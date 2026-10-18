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

## Send a claim

Use `POST https://api.saververify.com/v2/verify` with `Content-Type: application/json`:

```json
{
  "claim": "The James Webb Space Telescope launched on December 25, 2021.",
  "context": "Check the date before including it in a research report."
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
