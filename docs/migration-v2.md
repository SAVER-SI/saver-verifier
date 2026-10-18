# Move new integrations to v2

Use `POST https://api.saververify.com/v2/verify`. Send the same flat JSON body with required `claim` and optional `context`, using `Content-Type: application/json`.

```json
{"claim":"The Ethereum mainnet launched on July 30, 2015."}
```

Both routes cost 0.20 USDC on Base Mainnet using x402 v2. API response v2 and payment protocol x402 v2 are separate version numbers. An unpaid valid POST returns 402; decode `PAYMENT-REQUIRED`, apply the wallet spending policy, then let an authorized x402 client sign and retry that same URL and body. An empty JSON object returns 400 before payment. GET and HEAD are not verification methods.

## Response changes

The original `/verify` returns evidence strings and source title/URL objects. V2 returns `schemaVersion: "2.0"`, `requestId`, `confidenceType: "model_assessed"`, evidence objects `{id,text,relation,sourceIds}` and sources `{id,title,url}`. Resolve each evidence source ID against the source list. Consumers must update their evidence parsing before switching URLs.

V2 requires explicit evidence/source linkage and handles incomplete linkage more conservatively. It does not guarantee factual correctness or calibrated confidence. `insufficient_evidence` is a completed paid result.

`POST /verify` remains supported with its original response format. It is not redirected to v2. Historical directory links continue to work. New directory submissions should use the canonical v2 URL, the POST method and the example body above, and link to OpenAPI and the three actual paid examples at https://saververify.com/examples/.

Client samples in this repository use v2. Do not automatically sign another payment after an ambiguous timeout; no idempotency or result recovery endpoint is advertised.
