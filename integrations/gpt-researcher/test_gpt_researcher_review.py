import asyncio
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, Mock, patch

from gpt_researcher_review import prepare_report_review, run_report_review


class ReportReviewTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.client = self.root / "client"
        (self.client / "examples").mkdir(parents=True)
        (self.client / "examples" / "research-report-review.mjs").write_text("// trusted stub")
        self.manifest = self.root / "claim.json"
        self.manifest.write_text(json.dumps({"report": "Claim.", "claim": "Claim."}))

    async def test_prepare_calls_report_once_preserves_sources_and_never_verifies(self):
        researcher = Mock()
        researcher.write_report = AsyncMock(return_value="# Report\nClaim.")
        researcher.get_research_sources.return_value = [{"url": "https://example.com"}]
        selector = AsyncMock(return_value={"claim": "Claim.", "context": None})
        destination = self.root / "prepared.json"
        result = await prepare_report_review(researcher, selector, destination)
        self.assertEqual(result["newPayments"], 0)
        self.assertEqual(result["report"], "# Report\nClaim.")
        researcher.write_report.assert_awaited_once()
        selector.assert_awaited_once_with("# Report\nClaim.", [{"url": "https://example.com"}])
        self.assertEqual(json.loads(destination.read_text()), {"report": "# Report\nClaim.", "claim": "Claim."})
        self.assertEqual(destination.stat().st_mode & 0o777, 0o600)

    async def test_used_path_fails_before_report_model_call(self):
        researcher = Mock(write_report=AsyncMock())
        with self.assertRaises(FileExistsError):
            await prepare_report_review(researcher, AsyncMock(), self.manifest)
        researcher.write_report.assert_not_awaited()

    async def test_detached_claim_extra_fields_and_utf16_overflow_never_save(self):
        for selection in [{"claim": "Detached"}, {"claim": "Claim.", "body": {}},
                          {"claim": "😀" * 4001}, {"claim": "Claim.", "context": "😀" * 6001}]:
            researcher = Mock(write_report=AsyncMock(return_value="Claim. " + "😀" * 4001))
            destination = self.root / "invalid.json"
            with self.assertRaises(ValueError):
                await prepare_report_review(researcher, AsyncMock(return_value=selection), destination)
            self.assertFalse(destination.exists())

    async def test_missing_budget_string_execute_and_existing_recovery_never_spawn(self):
        used = self.root / "used-recovery.json"
        used.write_text("do not overwrite")
        options = [{"execute": True}, {"execute": "false"},
                   {"max_usdc": "0.20"},
                   {"execute": True, "max_usdc": "0.20", "recovery_file": used}]
        with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock) as spawn:
            for option in options:
                with self.assertRaises((ValueError, FileExistsError)):
                    await run_report_review(self.manifest, self.client, **option)
            spawn.assert_not_awaited()
        self.assertEqual(used.read_text(), "do not overwrite")

    async def test_live_mode_invokes_bounded_existing_client_once(self):
        child = Mock(returncode=0)
        child.communicate = AsyncMock(return_value=(b'{"mode":"live","review":{}}', b""))
        with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock, return_value=child) as spawn:
            result = await run_report_review(self.manifest, self.client, execute=True,
                max_usdc="0.20", recovery_file=self.root / "new-recovery.json")
        spawn.assert_awaited_once()
        args = spawn.call_args.args
        self.assertIn("--max-usdc=0.20", args)
        self.assertIn("--recovery-file", args)
        self.assertEqual(result["mode"], "live")

    async def test_failed_child_sanitizes_logs_and_never_retries(self):
        child = Mock(returncode=2)
        child.communicate = AsyncMock(return_value=(b"", b"SECRET child detail"))
        with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock, return_value=child) as spawn:
            with self.assertRaisesRegex(RuntimeError, "do not automatically repay") as error:
                await run_report_review(self.manifest, self.client)
            self.assertNotIn("SECRET", str(error.exception))
            spawn.assert_awaited_once()

    async def test_timeout_kills_one_child_without_retry(self):
        child = Mock(returncode=None)
        child.communicate = AsyncMock(side_effect=asyncio.TimeoutError)
        child.wait = AsyncMock(return_value=-9)
        with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock, return_value=child) as spawn:
            with self.assertRaises(asyncio.TimeoutError):
                await run_report_review(self.manifest, self.client, execute=True,
                    max_usdc="0.20", recovery_file=self.root / "pending-recovery.json")
            spawn.assert_awaited_once()
            child.kill.assert_called_once()
            child.wait.assert_awaited_once()

    async def test_real_node_dry_run_needs_no_wallet_or_packages(self):
        checkout = Path(os.environ.get("SAVER_CLIENT_REPO", Path(__file__).resolve().parents[2]))
        # Files-only isolated checkout: no node_modules, wallet config or hooks.
        isolated = self.root / "isolated"
        (isolated / "examples").mkdir(parents=True)
        for name in ["research-report-review.mjs", "saver-contract.mjs", "saver-result.mjs"]:
            (isolated / "examples" / name).write_bytes((checkout / "examples" / name).read_bytes())
        with patch.dict(os.environ, {"PATH": os.environ["PATH"]}, clear=True):
            result = await run_report_review(self.manifest, isolated)
        self.assertEqual(result["mode"], "dry_run")
        self.assertEqual(result["newPayments"], 0)
        self.assertEqual(result["maximumPurchases"], 1)
        self.assertEqual(result["maximumUSDC"], "0.20")

    async def test_invalid_output_and_wrong_mode_never_trigger_retry(self):
        for stdout in [b"not json", b'{"mode":"live"}', b"[]"]:
            child = Mock(returncode=0)
            child.communicate = AsyncMock(return_value=(stdout, b""))
            with patch("asyncio.create_subprocess_exec", new_callable=AsyncMock, return_value=child) as spawn:
                with self.assertRaises(RuntimeError):
                    await run_report_review(self.manifest, self.client)
                spawn.assert_awaited_once()


if __name__ == "__main__":
    unittest.main()
