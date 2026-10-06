# SAVER Verifier

![x402](https://img.shields.io/badge/x402-enabled-blue)
![Network](https://img.shields.io/badge/network-Base%20Mainnet-blue)
![Payment](https://img.shields.io/badge/payment-USDC-green)
![API](https://img.shields.io/badge/API-OpenAPI-orange)

# Give AI Agents a Trust Layer

SAVER Verifier is a paid verification service for autonomous AI agents.

Agents can discover SAVER, authorize payment through **x402**, submit
factual claims, and receive structured verification results with
source-backed evidence.

No API keys.\
No human approval.\
Machine-to-machine trust.

------------------------------------------------------------------------

# Why SAVER?

Autonomous agents increasingly need to make decisions based on external
information.

The problem:

    Agent:
    "I believe this information is true."

    Question:
    "Can another system trust this decision?"

SAVER adds a verification step:

    Agent
     |
     | submit claim
     v
    SAVER
     |
     | verify using evidence
     v
    Verified result
     |
     v
    Agent continues safely

Use cases:

-   AI research agents
-   financial analysis agents
-   compliance automation
-   autonomous workflows
-   multi-agent systems
-   information validation pipelines

------------------------------------------------------------------------

# Live Service

  Property   Value
  ---------- ----------------
  Service    SAVER Verifier
  API        `POST /verify`
  Price      0.20 USDC
  Network    Base Mainnet
  Payment    x402 v2
  Asset      USDC

API:

    https://agent-production-9804.up.railway.app

------------------------------------------------------------------------

# Quick Start

## Send a verification request

Endpoint:

``` http
POST https://agent-production-9804.up.railway.app/verify
Content-Type: application/json
```

Example:

``` json
{
  "claim": "The Ethereum mainnet launched on July 30, 2015.",
  "context": "Example verification request"
}
```

Unpaid requests return:

    HTTP 402 Payment Required

with x402 payment metadata.

------------------------------------------------------------------------

# Try the Agent Demo

Requirements:

-   Node.js 18+

Run:

``` bash
node examples/verify-agent.mjs
```

Example output:

    🤖 Demo AI Agent

    SAVER status: 402

    💳 Payment required

    Protocol: x402
    Network: eip155:8453
    Amount: 0.2 USDC

------------------------------------------------------------------------

# Machine Discovery

SAVER supports autonomous discovery.

x402:

    GET /.well-known/x402

OpenAPI:

    GET /openapi.json

Discovery provides:

-   service capabilities
-   payment requirements
-   API schema
-   verification workflow

------------------------------------------------------------------------

# Built for Autonomous Agents

SAVER is not a chatbot.

It is an infrastructure primitive.

Workflow:

    Agent discovers service

            |

    Agent authorizes payment

            |

    SAVER verifies information

            |

    Agent continues execution

------------------------------------------------------------------------

# Technology

SAVER uses:

-   x402 payment protocol
-   Base Mainnet
-   USDC settlement
-   OpenAPI contracts
-   AI-powered verification workflows
-   source-backed evidence analysis

------------------------------------------------------------------------

# Repository Contents

    saver-verifier/

    ├── examples/
    │   ├── verify-request.json
    │   └── verify-agent.mjs
    │
    ├── docs/
    ├── openapi.json
    ├── SECURITY.md
    └── CONTRIBUTING.md

The production implementation is maintained separately.

------------------------------------------------------------------------

# Security

Never include:

-   API keys
-   wallet private keys
-   deployment secrets
-   internal credentials

See `SECURITY.md`.

------------------------------------------------------------------------

# Status

SAVER Verifier is live.

Current capabilities:

✅ HTTPS API\
✅ x402 payment flow\
✅ Base Mainnet USDC payments\
✅ Autonomous discovery\
✅ Machine-readable API contracts\
✅ Structured verification responses

------------------------------------------------------------------------

# Contributing

We welcome developers building autonomous AI systems.

See `CONTRIBUTING.md`.

------------------------------------------------------------------------

# License

No license has been specified yet.
