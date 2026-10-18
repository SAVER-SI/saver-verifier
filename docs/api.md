# SAVER Verifier API

SAVER Verifier exposes a paid machine-to-machine verification endpoint for autonomous AI agents.

The API allows compatible agents and software systems to submit factual claims and receive structured verification results after successful x402 payment authorization.

---

## Base URL

```text
https://api.saververify.com
```

---

## Recommended endpoint

```http
POST /v2/verify
```

Full URL:

```text
https://api.saververify.com/v2/verify
```

---

The request below works with both routes. V2 is recommended for new clients; the original `/verify` response examples below remain documented for compatibility. See [V2 migration](migration-v2.md) for linked evidence.

## Request

Content-Type:

```text
application/json
```

Example request:

```json
{
  "claim": "IRENA's Renewable Capacity Statistics 2024 shows that renewables generated 86% of global electricity in 2023.",
  "context": "An energy-sector briefing cites https://www.irena.org/News/pressreleases/2024/Mar/Record-Growth-in-Renewables-but-Progress-Needs-to-be-Equitable . Independently check the attributed statistic against the original publication, including the year, measured quantity and denominator."
}
```

### Request Fields

| Field | Required | Type | Description |
|---|---|---|---|
| `claim` | Yes | string | Non-empty after trimming; at most 8000 UTF-16 code units |
| `context` | No | string | Optional additional context; at most 12000 UTF-16 code units |

---

## Request constraints

Only `claim` and `context` are accepted as top-level fields. Do not send `query`, `text`, an `input` wrapper, or payment data inside the JSON body. Send `Content-Type: application/json` and do not wrap the body in Markdown fences.

Omit unused context or send an empty string. The current server also accepts `context: null` as absent; omitting it is compatible with the OpenAPI contract. The JSON body limit is 128 KiB. Invalid input is rejected before payment.

`GET /verify`, `HEAD /verify` and their v2 equivalents return 405 with `Allow: POST`. GET includes JSON correction guidance; HEAD has no body. OPTIONS returns 200. Use `/healthz` for liveness checks.

## Payment

SAVER Verifier uses the x402 payment protocol for machine-to-machine payments.

Requests without payment authorization receive:

```text
HTTP 402 Payment Required
```

Read the base64-encoded JSON in the `PAYMENT-REQUIRED` response header. The 402 response body may be `{}`. Header names are case-insensitive. A client that reads only the body, or supports only x402 v1, is not the demonstrated integration.

A compatible x402 v2 client can:

1. Receive payment requirements

2. Authorize USDC payment

3. Retry the request

4. Receive the verification result and `PAYMENT-RESPONSE` settlement metadata

A 402 response alone is not proof of payment. Require explicit approval or enforce bounded wallet spending policy before authorizing charges. See [x402 integration](x402.md) for client examples and retry guidance.

---

## Current Payment Configuration

| Setting | Value |
|---|---|
| Protocol | x402 v2 |
| Network | Base Mainnet |
| Chain ID | `eip155:8453` |
| Asset | USDC |
| Price | `0.20 USDC` |

---

## Successful Response

HTTP:

```text
200 OK
```

Actual paid request/response records are published at [saververify.com/examples/](https://saververify.com/examples/) and [examples.json](https://saververify.com/examples.json). They are operator-funded tests, not synthetic responses or organic demand. Use the OpenAPI schema for the original response format.

---

## Verification Status Values

Possible response states:

```text
supported
contradicted
mixed
insufficient_evidence
```

Meaning:

| Status | Description |
|---|---|
| `supported` | Available evidence supports the claim |
| `contradicted` | Available evidence conflicts with the claim |
| `mixed` | Evidence contains conflicting information |
| `insufficient_evidence` | Available evidence is not enough to determine |

---

## HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Verification completed successfully |
| `400` | Invalid request |
| `402` | Payment required |
| `413` | Request payload too large |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `502` | Verification service unavailable |
| `504` | Verification timeout |

---

## Machine Discovery

SAVER provides machine-readable discovery endpoints.

### OpenAPI Specification

```text
GET /openapi.json
```

URL:

```text
https://api.saververify.com/openapi.json
```

---

### x402 Discovery Metadata

```text
GET /.well-known/x402
```

URL:

```text
https://api.saververify.com/.well-known/x402
```

---

## Integration Flow

Typical autonomous agent workflow:

```text
1. Discover service
        |
        v
2. Inspect API and payment requirements
        |
        v
3. Submit verification request
        |
        v
4. Complete x402 payment
        |
        v
5. Receive structured verification result
```

---

## OpenAPI Contract

The complete machine-readable API definition is available here:

```text
https://api.saververify.com/openapi.json
```

---

## x402 Contract

Payment discovery information is available here:

```text
https://api.saververify.com/.well-known/x402
```

---

## Repository

This public repository contains:

- API documentation

- integration examples

- service information

The production implementation is maintained separately.


## Troubleshooting

For HTTP 400, check the response `message`, JSON formatting, required `claim`, field types and extra fields. Application validation errors include `error`, `message` and `requestId`. Preserve `x-request-id` for support. Payment-layer errors may have a different response format.

For HTTP 413, reduce claim, context or body size. For 429, respect the indicated wait. Do not repeatedly sign new payments after a timeout or lost connection: the original request may have settled. The API does not advertise an idempotency key or result-recovery endpoint.

An `insufficient_evidence` result is a completed verification, not a payment failure. Server-side fetch clients are the demonstrated integration; browser clients must separately check CORS support.


## Version 2: linked evidence

`POST /v2/verify` uses the same flat request schema, price, network and payment policy as `/verify`. It adds `schemaVersion: "2.0"`, `requestId` and `confidenceType: "model_assessed"`.

Each evidence object has `id`, `text`, `relation` (`supports`, `contradicts`, `context`) and non-empty `sourceIds`. Each source has `id`, `title` and `url`. Resolve each evidence source ID against the response's sources. URLs not present in returned search metadata are excluded. Findings without linked sources cannot support a definitive verdict. The model still interprets the source content; URL membership is not independent verification of its interpretation.

Confidence is model-assessed and uncalibrated in both formats. The original `/verify` endpoint retains its response shape, with string evidence and title/URL source objects. Existing clients keep the original v1 evidence behavior; choose v2 to require explicit evidence/source links.

## Flat agent interface

Read https://saververify.com/agent-tool.json. Send its input fields as JSON directly to the advertised transport URL. The surrounding transport/discovery objects are metadata, not request-body fields. All payment calls use api.saververify.com, even when discovering the service through the website or an older Railway-host listing.

## Current paid examples

- [Energy: capacity versus generation](https://saververify.com/examples/energy-capacity-check.json) — `contradicted`, six linked findings and five sources.
- [Electric cars: sales versus fleet](https://saververify.com/examples/ev-market-check.json) — `supported`, three linked findings and one source.
- [Internet use: global and income-group figures](https://saververify.com/examples/digital-access-check.json) — `supported`, four linked findings and one source.

These three source-guided production records were captured after the source-linking update. Each contains the original request, complete unedited response and a successful 0.20 USDC Base settlement transaction. The public [collection](https://saververify.com/examples.json) contains exactly these three examples. Input and output examples in OpenAPI use the first record.

V2 preserves consulted sources before linking evidence, and incomplete finding/source linkage prevents a confident full verdict. The request/response formats, price and original `/verify` behavior are unchanged. Offline validation passes 39 tests; the three current paid records additionally demonstrate actual post-update outputs, not an independent accuracy benchmark.

## Correcting a request automatically

Both verification routes reject invalid input before payment. HTTP 400/413 responses preserve `error`, `message` and `requestId`, and add a machine-readable `code` and `help`. The help object supplies `method`, `contentType`, a minimal JSON `example`, the same-route `endpoint`, the recommended v2 endpoint and the OpenAPI URL. Send only the example/input fields as the body, not the help object.

Correct the request and retry `help.endpoint` to preserve the response version. Only authorize payment after a valid HTTP 402 challenge and within the existing wallet spending policy. Wrong content types remain HTTP 400; form data is not silently converted.

GET/HEAD on `/verify` and `/v2/verify` return HTTP 405 with `Allow: POST`. GET includes JSON guidance; HEAD has no body. OPTIONS returns HTTP 200 with `Allow: POST`. Use `/healthz` or `/readyz` for health checks. These guidance responses do not perform verification or charge a payment.



## Concurrent requests and temporary unavailability

HTTP 409 with `code: payment_authorization_in_use` means the same verified authorization is already being processed. It does not include a new `PAYMENT-REQUIRED` challenge and starts no additional AI call or settlement. Do not authorize a replacement while the original outcome is uncertain. This is concurrent-request protection, not a result-recovery API or durable idempotency guarantee.

HTTP 503 can report verification-capacity limits or service shutdown. That rejected request starts no AI work and is not settled. Capacity responses include `Retry-After`. The current OpenAPI contract is 1.1.3; response schema v2 and the payment protocol remain unchanged.

A v2 `mixed` verdict requires linked evidence with both `supports` and `contradicts` relations. Background-only or one-sided evidence cannot substantiate that verdict.
