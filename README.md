# SAVER Verifier

Independent factual checks for autonomous agent research and reports.

Use SAVER when a report, tool result or external statement needs a cited second check. Send one factual claim and receive a verdict, evidence and web sources. Confidence is model-assessed, not a calibrated probability.

| Service | Value |
|---|---|
| Canonical API | https://api.saververify.com |
| Linked-evidence endpoint | `POST /v2/verify` |
| Original response format | `POST /verify` |
| Payment | x402 v2 exact, USDC on Base Mainnet (`eip155:8453`) |
| Price | 0.20 USDC per completed verification |
| Signup / API key | None |

This is the official public documentation repository. Production server code and business logic are maintained separately and are not published here.

## Discover and inspect

- [Agent tool definition](https://saververify.com/agent-tool.json): flat input schema, canonical endpoint, response schema and payment instructions.
- [OpenAPI](https://api.saververify.com/openapi.json): both response versions.
- [x402 discovery](https://api.saververify.com/.well-known/x402): resources and payment overview.
- [Agent guide](https://saververify.com/llms.txt).
- [Actual paid results](https://saververify.com/examples/), also [JSON](https://saververify.com/examples.json).

Published result examples are actual operator-funded purchases. They are not simulated, independent accuracy benchmarks or evidence of organic customer demand. Reading stored examples is free and does not run a verification.

## Three real paid examples

- [Energy: capacity versus generation](https://saververify.com/examples/energy-capacity-check.json) — `contradicted`, six linked findings and five sources.
- [Electric cars: sales versus fleet](https://saververify.com/examples/ev-market-check.json) — `supported`, three linked findings and one source.
- [Internet use: global and income-group figures](https://saververify.com/examples/digital-access-check.json) — `supported`, four linked findings and one source.

All three were captured from the live v2 API after the source-linking update on 2026-10-18, with 0.20 USDC paid per request. Source URLs were supplied in the requests, and the main figures and evidence were compared with the original publications. Original requests, responses and transaction references are unchanged. The public collection contains only these three current examples; older reports are no longer published.

## Send a claim

Use `POST https://api.saververify.com/v2/verify` with `Content-Type: application/json`:

```json
{
  "claim": "IRENA's Renewable Capacity Statistics 2024 shows that renewables generated 86% of global electricity in 2023.",
  "context": "An energy-sector briefing cites https://www.irena.org/News/pressreleases/2024/Mar/Record-Growth-in-Renewables-but-Progress-Needs-to-be-Equitable . Independently check the attributed statistic against the original publication, including the year, measured quantity and denominator."
}
```

Send `claim` and optional `context` directly. Do not send transport fields (`type`, `method`, `bodyType`) or a `body` wrapper. `claim` must be non-empty and at most 8000 UTF-16 code units; `context` at most 12000. The total JSON body limit is 128 KiB.

Invalid input is rejected before payment. A valid unpaid request returns 402. Decode the base64 JSON in `PAYMENT-REQUIRED`; the response body may be `{}`. Use an existing authorized x402 v2 wallet under an appropriate spending policy to sign and retry the same request with `PAYMENT-SIGNATURE`. Never expose a wallet private key to a model or in a request body.

A successful response includes `PAYMENT-RESPONSE` settlement metadata. An `insufficient_evidence` result is a completed paid verification. Do not automatically sign a new payment after an uncertain timeout; no idempotency key or result-recovery endpoint is currently offered.

## Use the result

V2 evidence entries contain `text`, `relation` and `sourceIds`. Resolve each source ID in `sources` to inspect its title and URL. Source URLs are checked against search metadata; this does not independently prove the model's interpretation. Unlinked findings are omitted. Confidence is the model's assessment.

`POST /verify` keeps the original string-evidence response shape. See the [API guide](docs/api.md) and [payment guide](docs/x402.md).

Use SAVER for external factual claims. Use dedicated tools for wallet risk, transaction simulation, token contracts, sanctions screening and deterministic arithmetic. SAVER is an evidence signal, not permission to bypass your execution policy.

## Client examples and skill

Existing integration examples live in `examples/`. The unpaid demo stops at 402; the paid example performs a real payment when supplied with a funded wallet. Never run a paid example as an unattended smoke test.

The published ClawHub/OpenClaw skill is `@saver-si/saver-verifier` v1.0.3. Its reported audit applies to that published skill, not to API accuracy or newer source revisions. The updated v1.0.4 source in this repository requires a separate registry release and audit.

[Skill source](skills/saver-verifier/SKILL.md) · [Published ClawHub skill](https://clawhub.ai/saver-si/skills/saver-verifier)

## Security and license

Read [SECURITY.md](SECURITY.md). Never submit private keys, seed phrases or API credentials. Public documentation and examples are Apache-2.0 licensed; this does not publish the private server implementation.

## Source-linked evidence

V2 preserves consulted source references and completed page visits before assembling evidence. Incomplete finding/source linkage prevents a confident full verdict. The current three paid records demonstrate returned outputs after that update; they do not establish general accuracy. The offline suite passes 24 tests.
