# SAVER Verifier

## Paid Trust Layer for Autonomous AI Agents

SAVER Verifier is a machine-to-machine verification service for
autonomous AI agents and software systems.

Agents can request evidence-backed claim verification through an API,
pay programmatically using x402, and receive structured verification
results.

No manual API keys. No human approval workflow. Payment and verification
are handled directly between compatible systems.

------------------------------------------------------------------------

## What SAVER Does

AI agents increasingly need reliable information before taking actions.

SAVER provides an independent verification step:

``` text
Agent
  |
  v
Submit claim
  |
  v
x402 payment
  |
  v
Verification
  |
  v
Evidence-backed result
```

------------------------------------------------------------------------

## Live Service

  Property           Value
  ------------------ ----------------------------
  Service            SAVER Verifier
  Endpoint           `POST /verify`
  Network            Base Mainnet
  Payment protocol   x402 v2
  Payment asset      USDC
  Price              0.20 USDC per verification

------------------------------------------------------------------------

## Quick Start

``` http
POST /verify
Content-Type: application/json
```

Example:

``` json
{
  "claim": "The Ethereum mainnet launched on July 30, 2015.",
  "context": ""
}
```

Unpaid requests receive:

``` text
HTTP 402 Payment Required
```

Compatible x402 clients can authorize payment and retry automatically.

------------------------------------------------------------------------

## Response

Successful verification returns structured JSON:

``` json
{
  "status": "supported",
  "confidence": 0.98,
  "explanation": "The available evidence supports the claim.",
  "evidence": [],
  "sources": []
}
```

Possible outcomes:

-   `supported`
-   `contradicted`
-   `mixed`
-   `insufficient_evidence`

------------------------------------------------------------------------

## Built for Autonomous Systems

SAVER is designed for:

-   AI agent developers
-   research automation platforms
-   compliance systems
-   risk analysis tools
-   autonomous research pipelines
-   multi-agent systems

Use cases:

-   verify information before an agent acts
-   validate AI-generated research
-   add evidence checks to automated reports
-   create trust layers between autonomous systems

------------------------------------------------------------------------

## x402 Payment Model

SAVER uses x402 for machine-to-machine payments.

``` text
discover
   |
inspect payment requirements
   |
pay USDC
   |
receive verification result
```

Payment is required before verification processing begins.

------------------------------------------------------------------------

## Machine Discovery

SAVER exposes machine-readable interfaces:

``` text
GET /openapi.json

GET /.well-known/x402
```

Compatible agents can discover service capabilities and payment
requirements programmatically.

------------------------------------------------------------------------

## Integration Philosophy

The intended workflow:

``` text
discover -> inspect -> pay -> verify -> consume
```

SAVER is a verification primitive for autonomous workflows, not a
human-facing chatbot.

------------------------------------------------------------------------

## Repository

This public repository contains documentation and integration
information.

The production implementation is maintained separately.

------------------------------------------------------------------------

## License

No license has been specified yet.
