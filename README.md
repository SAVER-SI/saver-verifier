# SAVER Verifier

## Paid Trust Infrastructure for Autonomous AI Agents

SAVER Verifier provides a machine-to-machine verification layer for
autonomous AI agents.

Agents can discover the service, submit factual claims, authorize
payment through x402, and receive structured verification results
without human interaction.

**Paid, source-backed fact verification for autonomous AI agents.**

------------------------------------------------------------------------

## Live Service

  Property           Value
  ------------------ ----------------------------------------------
  Service            SAVER Verifier
  API Base URL       https://agent-production-9804.up.railway.app
  Endpoint           `POST /verify`
  Price              `0.20 USDC` per verification
  Network            Base Mainnet
  Payment protocol   x402 v2
  Payment asset      USDC

------------------------------------------------------------------------

## How It Works

``` text
discover -> inspect -> pay -> verify -> consume
```

A compatible autonomous agent can:

1.  Discover SAVER metadata
2.  Inspect payment requirements
3.  Authorize USDC payment
4.  Submit a claim
5.  Receive a structured verification result

------------------------------------------------------------------------

## Why SAVER

Autonomous systems increasingly need to verify information before making
decisions.

SAVER provides a verification step that can be called when an agent
needs additional confidence in external information.

Example use cases:

-   AI research agents
-   compliance automation
-   risk analysis systems
-   autonomous reporting
-   multi-agent workflows
-   information validation pipelines

------------------------------------------------------------------------

## Payment Before Compute

SAVER uses x402 payment gating.

The verification workflow follows:

``` text
AI Agent
   |
   | POST /verify
   v
SAVER
   |
   | HTTP 402 Payment Required
   v
AI Agent
   |
   | USDC payment authorization
   v
Verification request processed
   |
   v
Structured verification result
```

Verification processing starts only after successful payment
authorization.

------------------------------------------------------------------------

## Quick Start

### Endpoint

``` http
POST https://agent-production-9804.up.railway.app/verify
Content-Type: application/json
```

### Request

``` json
{
  "claim": "The Ethereum mainnet launched on July 30, 2015.",
  "context": ""
}
```

Unpaid requests return:

``` text
HTTP 402 Payment Required
```

A compatible x402 client can handle payment and retry automatically.

------------------------------------------------------------------------

## Response

Example:

``` json
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
  ]
}
```

Verification states:

-   `supported`
-   `contradicted`
-   `mixed`
-   `insufficient_evidence`

------------------------------------------------------------------------

## Machine Discovery

SAVER exposes machine-readable interfaces.

### OpenAPI

``` text
GET /openapi.json
```

https://agent-production-9804.up.railway.app/openapi.json

### x402 Discovery

``` text
GET /.well-known/x402
```

https://agent-production-9804.up.railway.app/.well-known/x402

These interfaces allow compatible agents to discover:

-   service capabilities
-   API schema
-   payment requirements
-   supported workflows

------------------------------------------------------------------------

## Built for Autonomous Systems

SAVER is designed as an API primitive for software agents.

It is not a human-facing chatbot.

The goal is:

``` text
agent discovers service
        |
agent pays programmatically
        |
agent receives verification
        |
agent continues workflow
```

------------------------------------------------------------------------

## Technology

SAVER uses:

-   x402 payment protocol
-   Base Mainnet
-   USDC settlement
-   OpenAPI machine-readable contracts
-   AI-powered verification workflows

------------------------------------------------------------------------

## Repository Purpose

This public repository contains:

-   API documentation
-   integration information
-   examples
-   service overview

The production implementation is maintained separately.

------------------------------------------------------------------------

## Security

Do not include:

-   API keys
-   wallet private keys
-   deployment secrets
-   internal implementation details

------------------------------------------------------------------------

## Status

SAVER Verifier is deployed as a production x402-enabled
machine-to-machine verification service.

Current capabilities:

-   live HTTPS API
-   Base Mainnet payments
-   x402 payment flow
-   autonomous discovery support
-   structured verification responses
-   machine-readable API contracts

------------------------------------------------------------------------

## License

No license has been specified yet.
