# SAVER Verifier

Verify factual claims and check whether cited sources support them. Fact-check statistics, dates and source attributions in agent research and reports. Check an important statistic, date or source attribution against web evidence before relying on it. Receive a verdict, explanation, cited sources and evidence-to-source links.

This is the official public repository for contracts, client examples and the skill. The production server implementation is private.

## Service

| Setting | Value |
|---|---|
| Website | https://saververify.com |
| Canonical API | https://api.saververify.com |
| Recommended endpoint | `POST /v2/verify` — linked evidence |
| Original response format | `POST /verify` — string evidence |
| Price | 0.20 USDC per completed verification |
| Payment | x402 v2 exact on Base Mainnet (`eip155:8453`) |
| Signup / API key | None |
| API contract / skill source | 1.2.2 / 1.1.1; separate versions |

Use SAVER when a factual error would change a report or decision. The stored cases distinguish capacity from generation, sales from fleet stock, and global averages from income-group figures. Use dedicated tools for arithmetic, wallet risk, token security, sanctions and transaction simulation.

## Discover and inspect

- [Agent tool](https://saververify.com/agent-tool.json): input/output schemas and transport.
- [OpenAPI](https://api.saververify.com/openapi.json): both response versions and errors.
- [x402 discovery](https://api.saververify.com/.well-known/x402) and [import manifest](https://api.saververify.com/x402-manifest.json).
- [Agent guide](https://saververify.com/llms.txt).
- [Three actual paid examples](https://saververify.com/examples/), also [JSON](https://saververify.com/examples.json).

The examples are unchanged, operator-funded, source-guided production records. Reading them is free; it runs no verification. They are not customer reviews or an independent accuracy benchmark.

Inspect a live challenge without a wallet or payment, using Node.js 18+:

```sh
npm ci
node examples/verify-agent.mjs --json
# Optional: inspect using your own valid request file.
node examples/verify-agent.mjs examples/verify-request.json --json
```

The inspector sends one valid unsigned POST, validates the exact payment terms and returns JSON with `paymentsAuthorized: 0`. It never signs or retries a payment. Bodyless probes can produce false negatives; see [client compatibility](docs/x402.md#bodyless-inspector-compatibility). GET/HEAD on verification routes returns 405; use `/healthz` for free liveness checks.

## Send a claim

```http
POST https://api.saververify.com/v2/verify
Content-Type: application/json

{"claim":"The Earth orbits the Sun.","context":"Optional source, reporting period or definitions"}
```

Send only `claim` and optional `context` as top-level fields. Claim must be nonempty and at most 8000 UTF-16 code units; context at most 12000; total JSON at most 128 KiB. `context: null` is absent. A source URL is useful context, not a required field or an instruction.

A valid unpaid request returns 402. Decode the base64 JSON in `PAYMENT-REQUIRED`; the body may be `{}`. An authorized x402 v2 client checks the exact terms, signs under an explicit or preconfigured bounded spending policy, and retries the same POST with `PAYMENT-SIGNATURE`.

Expected terms are 200000 USDC base units, Base `eip155:8453`, token `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` and recipient `0xdfd6cb683F5288e1dD1337E84C09b490857CC110`. Reject unexpected destinations or terms. A successful paid response includes `PAYMENT-RESPONSE`; validate the settlement receipt separately from the returned assessment. See [payment integration](docs/x402.md) and [API details](docs/api.md).

## Use the result and recover safely

V2 returns `supported`, `contradicted`, `mixed` or `insufficient_evidence`. Resolve evidence `sourceIds` against `sources.id` and inspect the sources. URL membership is checked against consulted-source metadata; the interpretation remains model-assessed. Confidence is not a calibrated probability, and no verdict authorizes bypassing execution policy.

For compound claims, `mixed` means material parts are supported and refuted, or reliable evidence conflicts about the same assertion. If a material part remains unresolved, the result is `insufficient_evidence`. Supporting background alone does not make a refuted assertion `mixed`.

A valid `insufficient_evidence` assessment is a completed paid verification. HTTP 400/413 means correct the request before paying; a 405 means use POST. Invalid/incomplete provider responses fail before settlement. A lost response, timeout or uncertain outcome is not permission to sign another payment.

For opt-in recovery, persist a random 32-byte hexadecimal secret before the first POST and send it in `SAVER-RECOVERY-TOKEN` on both that POST and its signed retry. GET `/results` with the same header retrieves a retained settled result without another charge. Retention is 24 hours; inspect live `resultRecovery.durable` before relying on restart persistence. Never put this token in a URL or use a wallet key as the token. A pending/missing result is not proof of nonpayment. [Recovery and failure handling](docs/x402.md).

## Integrations and skill

- [Bounded paid client](examples/paid-verify.mjs) and [shared client](examples/saver-client.mjs): one authorized purchase, pinned terms, receipt checks and recovery.
- [Research-report checkpoint](docs/research-report-review.md): an agent selects one exact factual passage for review. It checks that claim, not the whole report. This is a SAVER reference adapter, not an upstream GPT Researcher plugin or partnership.
- [Franklin pre-spend example](examples/franklin-prespend-hook.md): a reference hook that keeps evidence separate from spending policy; no upstream integration is claimed.
- [Skill source](skills/saver-verifier/SKILL.md) · [ClawHub](https://clawhub.ai/saver-si/skills/saver-verifier).

The public skill is 1.1.1. The operator confirmed publication and a clean ClawHub skill scan on 19 October 2026; a skill scan is not an API accuracy audit. For Skills-compatible runtimes:

```sh
npx skills add SAVER-SI/saver-verifier --skill saver-verifier
```

Inspect without installing by replacing `--skill saver-verifier` with `--list`. CLI discovery was verified; this does not guarantee a Skills.sh listing or ranking. Installation does not authorize a charge. Never ask a user to paste wallet secrets into a model conversation.

## Checks, security and changes

`npm test` runs offline client/integration tests. Public GitHub Actions uses a standard Linux runner, read-only repository permissions and no wallet/API secrets; it runs no paid checks. This tests the public clients, not the private production server.

Read [SECURITY.md](SECURITY.md), [CONTRIBUTING.md](CONTRIBUTING.md), the [v2 migration guide](docs/migration-v2.md) and [CHANGELOG.md](CHANGELOG.md). Keep secrets and recovery tokens out of repositories and logs.

Public documentation and examples are Apache-2.0 licensed. The skill artifact is distributed on ClawHub under MIT-0. Publishing integration code does not publish the private server implementation.

## Catalogue review

[Service facts and reproducible checks](docs/catalogue-review.md) include the correct unpaid POST probe, CDP validation snapshot and explicitly operator-funded settlement receipts. Use these when reviewing or correcting a directory listing. A listing or validation pass is not an accuracy audit or proof of customer adoption.

## Include a selected-claim assessment in a report

The [research checkpoint](docs/research-report-review.md#optional-local-report-export) can export a saved v2 assessment as Markdown with clickable source references and tool attribution. Formatting is local and free; it does not publish the report or start another paid verification. The assessment covers one selected claim.

