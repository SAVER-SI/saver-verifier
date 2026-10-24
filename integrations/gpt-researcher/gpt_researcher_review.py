"""Optional application-level bridge; no GPT Researcher or wallet dependency.

Use only with a trusted checkout of the SAVER public reference client. Research
and claim selection belong to the calling application and may have their own costs.
"""

import asyncio
import json
import os
from pathlib import Path


def _units(value):
    return len(value.encode("utf-16-le", errors="surrogatepass")) // 2


def _manifest(report, selection):
    if not isinstance(report, str) or not report.strip() or _units(report) > 1_000_000:
        raise ValueError("Invalid report.")
    if not isinstance(selection, dict) or set(selection) - {"claim", "context"}:
        raise ValueError("Selection must contain only claim and optional context.")
    claim = selection.get("claim")
    if not isinstance(claim, str) or not claim.strip() or _units(claim) > 8000 or claim not in report:
        raise ValueError("Claim must be an exact factual passage from the report.")
    context = selection.get("context")
    if context is not None and (not isinstance(context, str) or _units(context) > 12000):
        raise ValueError("Invalid context.")
    manifest = {"report": report, "claim": claim}
    if context is not None:
        manifest["context"] = context
    return manifest


async def prepare_report_review(researcher, select_claim, manifest_path):
    """Write one normal report, ask the caller to select a passage, save privately.

    researcher implements async write_report() and get_research_sources(). The
    async selector receives report and sources. No verifier is invoked here.
    An existing manifest is never overwritten.
    """
    target = Path(manifest_path)
    # Avoid an unnecessary report-generation call for an already-used path.
    if target.exists() or target.is_symlink():
        raise FileExistsError("Use the existing manifest or a new path.")
    report = await researcher.write_report()
    sources = researcher.get_research_sources()
    selected = await select_claim(report, sources)
    manifest = _manifest(report, selected)
    encoded = json.dumps(manifest, ensure_ascii=True) + "\n"
    descriptor = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
        stream.write(encoded)
    return {"report": report, "manifest_path": str(target.resolve()),
            "mode": "prepared_only", "newPayments": 0}


async def run_report_review(manifest_path, client_repo, *, execute=False,
                            max_usdc=None, recovery_file=None, timeout=360):
    """Default: offline plan. Live: one existing bounded Node client invocation.

    The caller owns payment approval and its existing wallet environment. This
    bridge never reads keys, starts a second attempt, or retries failures. A live
    timeout is uncertain: retain the recovery file and reconcile before repaying.
    """
    if not isinstance(execute, bool):
        raise ValueError("execute must be a boolean, not a string or model instruction.")
    manifest = Path(manifest_path).resolve()
    data = json.loads(manifest.read_text(encoding="utf-8"))
    _manifest(data.get("report"), {k: v for k, v in data.items() if k != "report"})
    checkpoint = Path(client_repo).resolve() / "examples" / "research-report-review.mjs"
    if not checkpoint.is_file():
        raise ValueError("Trusted reference client checkout is missing.")
    command = ["node", str(checkpoint), str(manifest)]
    if execute:
        if max_usdc != "0.20" or recovery_file is None:
            raise ValueError("Live execution requires explicit 0.20 USDC approval and recovery path.")
        recovery = Path(recovery_file).resolve()
        if recovery.exists() or recovery.is_symlink():
            raise FileExistsError("Recover the original attempt; do not create another payment.")
        command.extend(["--execute", "--max-usdc=0.20", "--recovery-file", str(recovery)])
    elif max_usdc is not None or recovery_file is not None:
        raise ValueError("Payment options require explicit execute=True.")
    process = await asyncio.create_subprocess_exec(
        *command, stdin=asyncio.subprocess.DEVNULL,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    try:
        stdout, _ = await asyncio.wait_for(process.communicate(), timeout=timeout)
    except (asyncio.TimeoutError, asyncio.CancelledError):
        if process.returncode is None:
            process.kill()
        await process.wait()
        # Keep the original cancellation/timeout; no automatic second attempt.
        raise
    if process.returncode:
        # Never copy arbitrary child logs or environment values into model context.
        raise RuntimeError("Review unresolved. Retain recovery and reconcile; do not automatically repay.")
    try:
        answer = json.loads(stdout)
    except (ValueError, UnicodeDecodeError):
        raise RuntimeError("Invalid client output. Reconcile before any new payment.") from None
    expected = "live" if execute else "dry_run"
    if not isinstance(answer, dict) or answer.get("mode") != expected:
        raise RuntimeError("Unexpected client mode. Reconcile before any new payment.")
    return answer
