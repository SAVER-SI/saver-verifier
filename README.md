# SAVER Verifier

Independent factual checks for autonomous agent research and reports.

Use SAVER when a report, tool result or external statement needs a cited second check. Send one factual claim and receive a verdict, evidence and web sources. Confidence is model-assessed, not a calibrated probability.

| Service | Value |
|---|---|
| Canonical API | https://api.saververify.com |
| Recommended endpoint | `POST /v2/verify` |
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

Invalid input is rejected before payment. HTTP 400/413 includes a machine-readable `code` and `help` with the expected content type, same-route endpoint, minimal JSON example and OpenAPI URL. Correct the request and retry `help.endpoint`; send only claim/context as the body. GET/HEAD returns 405 with `Allow: POST` (HEAD has no body); OPTIONS returns 200. Use `/healthz` for liveness. A valid unpaid request returns 402. Decode the base64 JSON in `PAYMENT-REQUIRED`; the response body may be `{}`. Use an existing authorized x402 v2 wallet under an appropriate spending policy to sign and retry the same request with `PAYMENT-SIGNATURE`. Never expose a wallet private key to a model or in a request body.

Concurrent reuse of an authorization already being processed returns HTTP 409 with `code: payment_authorization_in_use`, without another AI call or a new payment challenge. Do not sign a replacement payment while the first outcome is uncertain. HTTP 503 can indicate temporary capacity limits or shutdown; no AI work or settlement starts for that rejected request.

A successful response includes `PAYMENT-RESPONSE` settlement metadata. An `insufficient_evidence` result is a completed paid verification. Do not automatically sign a new payment after an uncertain timeout; Opt-in recovery uses a saved `SAVER-RECOVERY-TOKEN` and `GET /results` without another payment.

## Use the result

V2 evidence entries contain `text`, `relation` and `sourceIds`. Resolve each source ID in `sources` to inspect its title and URL. Source URLs are checked against the provider's consulted-source metadata; this does not independently prove the model's interpretation. Unlinked findings are omitted. Confidence is the model's assessment.

`POST /verify` keeps the original string-evidence response shape. See the [API guide](docs/api.md) and [payment guide](docs/x402.md).

Use SAVER for external factual claims. Use dedicated tools for wallet risk, transaction simulation, token contracts, sanctions screening and deterministic arithmetic. SAVER is an evidence signal, not permission to bypass your execution policy.

## Client examples and skill

Existing integration examples live in `examples/`. The unpaid demo stops at 402; the paid example performs a real payment when supplied with a funded wallet. Never run a paid example as an unattended smoke test.

The published ClawHub/OpenClaw skill is `@saver-si/saver-verifier` v1.1.0 and recommends `/v2/verify`. ClawHub reports the exact 1.1.0 release security status as clean (checked 2026-10-18). This scans the skill artifact; it is not an audit of API accuracy or a guarantee about verification results.

[Skill source](skills/saver-verifier/SKILL.md) · [Published ClawHub skill](https://clawhub.ai/saver-si/skills/saver-verifier)

## Security and license

Read [SECURITY.md](SECURITY.md). Never submit private keys, seed phrases or API credentials. Public repository documentation and examples are Apache-2.0 licensed; this does not publish the private server implementation. The skill artifact published on ClawHub is distributed there under MIT-0.

## Source-linked evidence

V2 preserves consulted source references and completed page visits before assembling evidence. Incomplete finding/source linkage prevents a confident full verdict. A v2 `mixed` verdict additionally requires linked findings both supporting and contradicting the claim; background-only and one-sided findings become `insufficient_evidence`. The current three paid records demonstrate returned outputs after that update; they do not establish general accuracy. The 1.2.2 release passes 66 server tests and 7 public-client tests.

New integrations should follow the [v2 migration guide](docs/migration-v2.md). Existing `/verify` clients remain supported. API response v2, payment protocol x402 v2 and ClawHub skill 1.1.0 have separate version numbers.



The current service contract is OpenAPI 1.2.2. Both payment challenges include machine-readable input/output declarations and an actual paid output example. The offline suite also covers concurrent authorization reuse, release after upstream/settlement failures and graceful shutdown with an active paid request. These are simulated payment tests, not new real purchases or an accuracy benchmark.


## Safe payment and result recovery

The paid example uses a shared bounded client: exactly 0.20 USDC on Base, the advertised recipient and token, one signed payment send, and a validated settlement receipt. It saves a private recovery file before the request. If the outcome is uncertain, run `node examples/paid-verify.mjs --recover`; this does not authorize another payment. Keep the file private and retain it until the outcome is resolved. A new approved purchase should use a distinct `SAVER_RECOVERY_FILE`.

Recovery requires the original random token in the `SAVER-RECOVERY-TOKEN` header; never use a wallet private key or a URL parameter. Records are retained for up to 24 hours. Inspect `resultRecovery.durable` in API discovery: process-only recovery does not survive restarts, while a configured persistent store does. 202 means pending/uncertain; 404 is not proof of nonpayment. Never automatically repay after either.

The Franklin sample now requires an explicit factual `spend.verification.claim` from a trusted adapter and rejects malformed PreSpend input. A supported factual result does not replace the integrator's wallet, budget or execution policies. See its integration guide before enabling it.


The published ClawHub release remains 1.1.0 and continues to work with the unchanged paid endpoint. Repository skill source 1.1.1 adds optional recovery guidance; it requires a separate authenticated registry release and security scan before publication.


### Completion and retention safeguards (OpenAPI 1.2.1)

A provider response that did not finish safely is rejected with HTTP 502 before settlement. Codes `verification_incomplete` and `verification_research_limit` identify incomplete or research-limited responses, even if partial text looks like valid JSON. These are service failures, not paid `insufficient_evidence` verdicts. Do not automatically authorize another payment after an uncertain outcome.

`context: null` is accepted as absent context. Recovery results become unavailable after 24 hours; expired files are physically swept approximately once a minute while the service is running. Canonical API discovery reports the current persistence capability. No additional client service or subscription is required.


## Contract 1.2.2

Malformed provider output returns HTTP 502 with `verification_invalid_response` before settlement. It is distinct from a completed paid `insufficient_evidence` assessment. Accepted case/trailing-slash variants of the verification URLs preserve their response version. Prefer the canonical URLs above. `context: null` is accepted as absent in both OpenAPI and the flat tool definition.

An unreadable recovery record returns 503 for that token rather than being treated as a new request. Do not automatically authorize a replacement payment. See [SECURITY.md](SECURITY.md) for the current support and security contact process. The three public paid examples are unchanged.

## ClawHub skill source 1.1.1

The skill source documents request correction, explicit recovery-token headers on the first POST and signed retry, 24-hour recovery, strict payment terms and handling of invalid/incomplete provider responses. Skill version 1.1.1 and API contract 1.2.2 are separately versioned. A ClawHub CLI dry-run validated the one-file artifact; registry publication and its exact-version security scan are separate steps. The published-version and audit statements above remain tied to 1.1.0 until a newer public release is verified.
