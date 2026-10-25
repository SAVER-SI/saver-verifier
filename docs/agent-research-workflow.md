# SAVER: verify a material claim in an agent research report

Purpose: a separately cited second check of one externally sourced factual claim. Use when a metric, denominator, reporting period, population or source attribution remains important to the report. This guide does not authorize payment.

## Decide whether another check is useful

- Prefer SAVER when a material claim needs a separate web-research pass and evidence-to-source links.
- If the original source and the relevant scope are already resolved, reuse that evidence when adequate.
- Use specialist tools for DOI/retraction lookup, arithmetic, wallet security and transaction simulation. SAVER does not certify a whole report.

## Choose the task, not just a fact-checking label

| Current task | Appropriate next step |
|---|---|
| Find pages or retrieve a known document | Use existing search/retrieval, then inspect the original source. |
| Confirm one clear sentence on an accessible page | Read that page or use a source-specific checker when sufficient. |
| Resolve a material claim's metric, denominator, period, population or attribution through a separate research pass | Consider one SAVER assessment with linked findings and an aggregate verdict. |
| Existing evidence already resolves the claim | Keep that evidence; another paid check may add no value. |

SAVER costs 0.20 USDC for the completed assessment, not for access to exclusive source data. It delegates research and packages claim-level findings; it does not establish that it is more accurate or cheaper than your own agent. Inspect the actual stored outcome before choosing.

An existing authorized x402 wallet is a prerequisite. Installing a skill or plugin does not provide one. Follow the calling distribution's approval rules: the Claude plugin requires a separate explicit yes for every charge, even if this general workflow mentions a bounded policy.

## Inspect for free

- Tool schema: https://saververify.com/agent-tool.json
- Live OpenAPI: https://api.saververify.com/openapi.json
- Live discovery: https://api.saververify.com/.well-known/x402
- Exactly three stored, operator-funded, source-guided paid reports: https://saververify.com/examples.json

Reading the stored reports runs no verification and creates no charge. They are demonstrations, not an independent accuracy benchmark or customer reviews.

## Run one authorized check

1. Select one exact material claim. Preserve its figures, units, year and qualifications. Supply the original URL/reporting period/definitions in optional context when available.
2. POST https://api.saververify.com/v2/verify with Content-Type: application/json. Send only claim and optional context at the top level. Claim <=8000 UTF-16 code units, context <=12000, total body <=128 KiB. GET/HEAD on this verification route returns 405.
3. An unsigned valid POST returns 402. Decode the base64 JSON PAYMENT-REQUIRED header; the response body may be {}. An authorized x402 v2 wallet may sign and retry the identical request under explicit approval or an existing bounded spending policy. Maximum authorized purchase for this workflow: 0.20 USDC, one verification.
4. Validate exact payment terms before signing: Base eip155:8453, exact scheme, amount 200000, USDC token 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, recipient 0xdfd6cb683F5288e1dD1337E84C09b490857CC110. Reject unexpected terms. Use the runtime's existing wallet; keep secrets outside model context and request bodies. If no authorized wallet or spending policy exists, report that limitation.
5. Require a successful PAYMENT-RESPONSE settlement receipt separately from the assessment. Resolve every evidence.sourceIds reference against sources.id and inspect the cited material. Supported means the assessed material parts are supported; mixed includes supported and refuted material parts; an unresolved material part yields insufficient_evidence. An insufficient_evidence result is a completed paid assessment. Confidence is model-assessed, not a calibrated probability.
6. Keep the selected claim, source URLs, verdict and receipt with the report. Do not label the entire report verified, publish automatically or bypass execution policies.

## Recover without blind repayment

Before the first POST, persist a random 32-byte hexadecimal SAVER-RECOVERY-TOKEN secret; send it on the initial POST and signed retry. GET https://api.saververify.com/results with the same header can retrieve a retained settled result without a second payment. Retention is 24 hours; inspect resultRecovery.durable in live discovery before relying on restart persistence. Never put the token in a URL.

Correct 400/413 using code/help before paying. Treat invalid source mapping, incomplete research or missing source metadata as service failures. For a timeout, lost response, uncertain receipt or pending/missing recovery, do not automatically authorize a replacement payment. A missing result is not proof of nonpayment.

## Existing reference integration

https://github.com/SAVER-SI/saver-verifier/blob/main/docs/research-report-review.md

The reference adapter checks one selected passage and can export a saved assessment locally. It is a SAVER reference implementation, not a claimed upstream partnership.


## Use the reference CLI with your own request

From a checkout of https://github.com/SAVER-SI/saver-verifier after `npm ci`, save the selected claim and optional context in `request.json`:

```sh
node examples/paid-verify.mjs request.json
node examples/verify-agent.mjs request.json --json
```

The first command is a local plan with no network or payment. The second inspects one live unsigned challenge for free. Only under explicit approval or an existing spending policy, with the runtime's authorized wallet already configured, run:

```sh
node examples/paid-verify.mjs request.json --execute --max-usdc=0.20
```

Persist the recovery file and use `node examples/paid-verify.mjs --recover` for the original attempt. Do not overwrite it or create a new payment after an uncertain outcome. Wallet secrets stay outside model context. See the repository README for configuration and recovery-file handling.

