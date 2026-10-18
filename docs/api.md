# SAVER Verifier API

SAVER Verifier exposes a paid machine-to-machine verification endpoint for autonomous AI agents.

The API allows compatible agents and software systems to submit factual claims and receive structured verification results after successful x402 payment authorization.

---

## Base URL

```text
https://api.saververify.com
```

---

## Verify Endpoint

```http
POST /verify
```

Full URL:

```text
https://api.saververify.com/verify
```

---

## Request

Content-Type:

```text
application/json
```

Example request:

```json
{
  "claim": "The Ethereum mainnet launched on July 30, 2015.",
  "context": ""
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

`GET /verify` and `HEAD /verify` do not perform verification. Use `POST`; use `/healthz` for liveness checks.

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

Example:

```json
{
  "status": "supported",
  "confidence": 0.98,
  "explanation": "The available evidence supports the claim.",
  "evidence": [
    "Relevant authoritative sources support the claim."
  ],
  "sources": [
    {
      "title": "Example source",
      "url": "https://example.com"
    }
  ],
  "domain": "general-verification",
  "timestamp": "2026-10-06T12:43:02.565Z"
}
```

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
