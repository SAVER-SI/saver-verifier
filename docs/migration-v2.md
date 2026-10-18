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

Client samples in this repository use v2. Do not automatically sign another payment after an ambiguous timeout; use the original recovery token with `GET /results` before considering another payment.

## Correcting a request automatically

Both verification routes reject invalid input before payment. HTTP 400/413 responses preserve `error`, `message` and `requestId`, and add a machine-readable `code` and `help`. The help object supplies `method`, `contentType`, a minimal JSON `example`, the same-route `endpoint`, the recommended v2 endpoint and the OpenAPI URL. Send only the example/input fields as the body, not the help object.

Correct the request and retry `help.endpoint` to preserve the response version. Only authorize payment after a valid HTTP 402 challenge and within the existing wallet spending policy. Wrong content types remain HTTP 400; form data is not silently converted.

GET/HEAD on `/verify` and `/v2/verify` return HTTP 405 with `Allow: POST`. GET includes JSON guidance; HEAD has no body. OPTIONS returns HTTP 200 with `Allow: POST`. Use `/healthz` or `/readyz` for health checks. These guidance responses do not perform verification or charge a payment.


OpenAPI 1.2.1 is a compatible maintenance update: context may explicitly be null, incomplete research returns HTTP 502 without settlement, and retained recovery files receive periodic cleanup. Paid response schemas and the payment policy are unchanged.
