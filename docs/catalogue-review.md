# SAVER Verifier — catalogue review

Reviewed 23 October 2026. This page gives catalogue operators and agent runtimes reproducible service facts. It is not a Coinbase endorsement, an independent accuracy audit or a claim of curated status.

## Service and use

Verify factual claims and check whether cited sources support them. Focus: statistics, dates, source attribution, reporting periods, units and population groups in agent research and reports. A second cited assessment is useful when these distinctions remain unresolved. Existing search is sufficient when the source and scope have already been checked.

Recommended endpoint: `POST https://api.saververify.com/v2/verify`. The original `POST /verify` remains available for string evidence; v2 links evidence to source IDs. One checked claim does not verify an entire report. Source interpretation and confidence are model-assessed.

## Probe without paying

```bash
curl -i --request POST 'https://api.saververify.com/v2/verify' \
  --header 'Content-Type: application/json' \
  --data '{"claim":"The Earth orbits the Sun."}'
```

Expected: HTTP 402, with x402 v2 payment terms in the base64-encoded `PAYMENT-REQUIRED` header. The response body may be `{}`. Do not use GET or HEAD on the verification routes as a payment probe; they return 405 with `Allow: POST`. `GET https://api.saververify.com/healthz` is a free liveness check. A 402 establishes a payment challenge, not paid-result quality or a 200-result response time.

Terms: exact scheme, 0.20 USDC (`amount: "200000"`), Base Mainnet (`eip155:8453`), token `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`, recipient `0xdfd6cb683F5288e1dD1337E84C09b490857CC110`. The current live challenge is authoritative. Buyers must enforce their approved spending policy before signing.

## Public evidence

- [OpenAPI](https://api.saververify.com/openapi.json): full request, response and error contracts.
- [Agent tool](https://saververify.com/agent-tool.json): selection guidance and input/output schema.
- [Directory import manifest](https://api.saververify.com/x402-manifest.json): POST routes, payment terms and Bazaar declarations.
- [Discovery](https://api.saververify.com/.well-known/x402): current service and recovery capability.
- [Three recorded paid reports](https://saververify.com/examples/): unchanged operator-funded, source-guided demonstrations with original results and transactions. They are not organic customer reviews or a comparative benchmark.
- [CDP validation snapshot](./catalogue-validation.json): both routes returned `valid: true`, HTTP 402 and `simulation.outcome: accepted`; all 25 reported preflight checks passed on each route. This is a dated technical validation, not an uptime history or accuracy certification.

Production acceptance tests on 23 October 2026, funded by the operator:

| Route | Assessment | Settlement |
|---|---|---|
| `/v2/verify` | Contradicted a claim confusing renewable capacity additions with electricity generated | [0.20 USDC on Base](https://basescan.org/tx/0x01f3968bc2187126155cab4a166dc24ac278d9720e84498f9d9c723417fee3f9) |
| `/verify` | Contradicted a claim confusing annual electric-car sales share with the global car fleet | [0.20 USDC on Base](https://basescan.org/tx/0x1a177b42e7688b31580ac723bbb4b587efc2018ea90cdf9aef1d23f99db850f0) |

Both tests returned HTTP 200, successful settlement receipts and retained results that were retrieved without another payment. These transactions were funded by `0x2Be8199ebb93D79E8796ef0beb0cCe0F3c333285`; exclude operator-funded activity from organic-adoption assessments. An on-chain transaction proves a payment, not the correctness of an assessment.

## Review boundaries

SAVER is indexed in Bazaar. Editorial curation and platform-measured 30-day availability have not been established by this document. No 99% uptime claim is made from these checks. Coinbase determines eligibility and selection under its [published requirements](https://docs.cdp.coinbase.com/x402/seller/get-discovered#requirements-for-curation).

SAVER does not provide wallet risk scoring, transaction simulation, sanctions screening, deterministic arithmetic verification or a calibrated probability of truth. Insufficient evidence can be a completed paid assessment. No result authorizes bypassing execution policy.

Operator corrections can be raised through [repository issues](https://github.com/SAVER-SI/saver-verifier/issues). Use the canonical API hostname when importing; the older Railway hostname is a compatibility alias.
