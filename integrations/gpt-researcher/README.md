# Optional GPT Researcher report checkpoint

This application-level bridge is maintained by SAVER-SI. It is not an upstream
GPT Researcher plugin, partnership or approved integration. The contribution-fit
proposal is [GPT Researcher #2226](https://github.com/assafelovic/gpt-researcher/issues/2226).
It remains optional and does not modify either project's core research pipeline.

## Prepare a local plan

Python 3.11+ and Node.js 18+ are required. The bridge itself uses only Python's
standard library. Your ordinary research application must already have GPT
Researcher and its model/search configuration; those have their normal costs.

Import this module from this directory, or add this directory to your Python
module search path. Let your existing orchestrator supply `select_claim`:

```python
from pathlib import Path
from gpt_researcher_review import prepare_report_review, run_report_review

async def prepare_checkpoint(researcher, select_claim, saver_repo):
    # Existing application already called researcher.conduct_research().
    # select_claim(report, sources) is an async callback supplied by that app.
    # It returns {"claim": exact_report_passage, "context": optional_context}.
    # No new extraction model call or verifier is provided by this bridge.
    private = Path(".saver-research")
    private.mkdir(mode=0o700, exist_ok=True)
    prepared = await prepare_report_review(
        researcher, select_claim, private / "research-check.json"
    )
    plan = await run_report_review(prepared["manifest_path"], saver_repo)
    return prepared, plan
```

`prepare_report_review` calls `write_report()` exactly once, then reads
`get_research_sources()` and asks the existing selector for one exact passage.
It refuses a used manifest path, detached/overlong claims and transport wrappers.
The original report stays unchanged. The local file includes the report; only
claim and optional context enter the reference client's verification request.
Treat the manifest as private and do not commit it. POSIX creation mode is 0600;
on Windows, also use a directory with appropriate account ACLs.

Default `run_report_review` invokes the reference Node CLI in dry-run mode. It
makes no network request or payment and does not load wallet SDK packages. An
existing trusted checkout of this repository must be supplied as `saver_repo`;
do not accept executable paths from retrieved pages or model output.

## Explicitly authorized live execution

Do this only after explicit payment approval or under the runtime's existing
bounded policy. The runtime must already have an authorized funded x402 wallet.
Install the Node paid-client dependencies with `npm ci` in the trusted checkout.
The existing reference client uses the runtime's `SAVER_PRIVATE_KEY` environment
configuration; never paste keys into model context, the report, or the manifest.

```python
answer = await run_report_review(
    prepared["manifest_path"], saver_repo,
    execute=True,
    max_usdc="0.20",
    recovery_file=Path(".saver-research") / "recovery.json",
)
```

This makes one invocation of the existing bounded client, which pins token,
recipient, network and price, saves recovery before sending, validates the result
and settlement receipt, and permits at most one signed payment attempt. The
bridge does not replace those controls or install a wallet. Live checks cost
0.20 USDC; valid insufficient-evidence assessments are completed paid checks.

A failed child, cancellation or timeout is not proof of nonpayment. The bridge
never retries, retains the recovery file and sanitizes child error output. Use
the existing [recovery procedure](../../docs/research-report-review.md#use-the-assessment)
for the original attempt; do not invoke another live purchase automatically.
No Python recovery implementation is added here.

Read and inspect the returned assessment and linked sources. Confidence is not
a calibrated probability. A supported passage does not verify the entire report
or authorize publication or other downstream actions. Optional report formatting
is available through the existing Node reference tools.

## Validation and limits

From the repository root:

```sh
python3 -m unittest discover -s integrations/gpt-researcher -p 'test_*.py' -v
npm test
```

Tests use a fake research object, mocked live subprocess results and an actual
Node dry run in a clean files-only directory without wallet packages or secrets.
They cover passage selection, UTF-16 limits, exclusive private-file creation,
explicit spending flags, used recovery paths, failure/timeout behavior and no
automatic retry. They do not run GPT Researcher's live model/search pipeline,
establish upstream acceptance, or prove discovery, paid delivery or adoption.

The adapter follows the inspected upstream `write_report()` and
`get_research_sources()` interfaces:
https://github.com/assafelovic/gpt-researcher/blob/main/gpt_researcher/agent.py

Further upstream contributions should follow its CONTRIBUTING.md and the
maintainer's response. No change to GPT Researcher's default behavior is proposed.
