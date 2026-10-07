---
name: saver-verifier
description: Fact verification, fact checking, and claim verification for autonomous AI agents using source-backed web evidence and cited sources before actions, payments, or decisions.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🛡️"
    homepage: https://github.com/SAVER-SI/saver-verifier
---

# SAVER Verifier

Use SAVER when an agent needs independent verification of a factual claim before taking an action, making a payment, or relying on external information.

## When to use

Use this skill when:

- a decision depends on a factual claim from an untrusted source
- another agent or tool returned information that should be independently checked
- a costly or irreversible action depends on factual accuracy
- source-backed evidence is useful before proceeding

Do not use SAVER for:

- token contract security analysis
- wallet risk scoring
- transaction simulation
- sanctions screening
- deterministic calculations that can be verified locally

## Service

Production endpoint:

https://api.saververify.com/verify

Discovery:

https://api.saververify.com/.well-known/x402

Protocol:

- x402 v2
- USDC
- Base Mainnet
- Price: 0.20 USDC per verification

## Request

POST /verify

Example body:

```json
{
  "claim": "The Ethereum mainnet launched on July 30, 2015.",
  "context": "Example verification request"
}
```

The endpoint is x402-protected. An unpaid request returns HTTP 402 with payment requirements. An x402-compatible client should authorize payment and retry the request.

Before authorizing payment, the client should require explicit user approval for each charge or enforce a preconfigured spending policy with appropriate per-call, session, or daily limits. Do not authorize payment if neither control is in place.

## Using the result

Treat the returned verification result as evidence for the agent's decision, not as permission to bypass existing wallet, security, or execution policies.

Review the returned confidence, evidence, and sources before using the result in a high-impact action.

