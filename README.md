# SAVER Verifier

![x402](https://img.shields.io/badge/x402-enabled-blue)
![Network](https://img.shields.io/badge/network-Base%20Mainnet-blue)
![Payment](https://img.shields.io/badge/payment-USDC-green)
![API](https://img.shields.io/badge/API-OpenAPI-orange)

# Give AI Agents a Trust Layer

SAVER Verifier is a source-backed factual claim verification service for autonomous AI agents.

Agents can discover SAVER, authorize payment through **x402**, submit
factual claims, and receive structured verification results with
source-backed evidence before they act, pay, or make a decision.

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

SAVER adds an independent verification step:

    Agent
     |
     | submit claim
     v
    SAVER
     |
     | verify using evidence
     v
    Source-backed result
     |
     v
    Agent decides whether to continue

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

    https://api.saververify.com

------------------------------------------------------------------------

# Quick Start

## Send a verification request

Endpoint:

``` http
POST https://api.saververify.com/verify
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

SAVER is designed to be discovered programmatically by autonomous software.

x402 well-known discovery:

``` text
GET /.well-known/x402
```

Live:

``` text
https://api.saververify.com/.well-known/x402
```

OpenAPI:

``` text
GET /openapi.json
```

Live:

``` text
https://api.saververify.com/openapi.json
```

The machine-facing service description is:

``` text
Source-backed factual claim verification for autonomous AI agents. Verify external information with web evidence and cited sources before an agent acts, pays, or makes a decision.
```

Discovery exposes:

-   service capabilities
-   `POST /verify`
-   x402 payment requirements
-   price and network
-   API schema
-   verification workflow
-   ownership information

SAVER also publishes x402/Bazaar discovery metadata with tags including:

``` text
fact-verification
claim-verification
web-evidence
ai-agents
fact-checking
```

------------------------------------------------------------------------

# x402 Ecosystem Visibility

SAVER is indexed on x402scan as a live x402 service with observable
on-chain usage.

Public listing:

``` text
https://www.x402scan.com/server/ec61b7ea-e709-42eb-895e-1a3e9d0f61da
```

x402scan may apply broad UI categories of its own. SAVER's authoritative
capability description remains the metadata exposed by the live service
through x402 discovery and OpenAPI.

------------------------------------------------------------------------

# OpenClaw / ClawHub

SAVER includes an OpenClaw-compatible skill for agent-native discovery.

Skill source:

``` text
skills/saver-verifier/SKILL.md
```

Repository path:

``` text
https://github.com/SAVER-SI/saver-verifier/tree/main/skills/saver-verifier
```

Skill identity:

``` text
saver-verifier@1.0.0
```

ClawHub publisher:

``` text
@saver-si
```

The skill teaches compatible agents:

-   when SAVER should be used
-   where to discover the live service
-   how to submit a factual claim
-   how to interpret the verification result
-   when SAVER should not replace deterministic security controls

The skill does not replace an x402 payment client. The calling agent still
needs an x402-compatible payment capability to authorize payment and retry
the protected request.

SAVER Verifier is published on ClawHub as @saver-si/saver-verifier.

Current release: v1.0.2. Security audit: Pass.

Install: openclaw skills install @saver-si/saver-verifier

------------------------------------------------------------------------

# Built for Autonomous Agents

SAVER is not a chatbot.

It is an independent verification primitive for autonomous software.

Workflow:

    Agent discovers SAVER

            |

    Agent inspects x402 requirements

            |

    Agent authorizes payment

            |

    SAVER verifies the claim

            |

    Agent receives evidence + sources

            |

    Agent decides whether to continue

------------------------------------------------------------------------

# Technology

SAVER uses:

-   x402 payment protocol
-   Base Mainnet
-   USDC settlement
-   OpenAPI 3.1 contracts
-   x402 well-known discovery
-   Bazaar discovery metadata
-   OpenClaw skill metadata
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
    ├── skills/
    │   └── saver-verifier/
    │       └── SKILL.md
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

ClawHub skill audit:

    https://clawhub.ai/saver-si/skills/saver-verifier/security-audit

Before authorizing a SAVER payment, configure the x402 wallet or client to require explicit approval for each charge or enforce appropriate per-call, session, or daily spending limits.

------------------------------------------------------------------------

# Status

SAVER Verifier is live.

Current capabilities:

✅ HTTPS API\
✅ x402 payment flow\
✅ Base Mainnet USDC payments\
✅ Autonomous discovery\
✅ Machine-readable API contracts\
✅ Bazaar discovery metadata\
✅ x402scan indexing\
✅ OpenClaw skill source\
✅ Published on ClawHub as `@saver-si/saver-verifier`\
✅ ClawHub security audit passed\
✅ Structured verification responses

------------------------------------------------------------------------

# How Agents Should Use SAVER

SAVER should be used when an agent needs an independent evidence check for a
factual premise obtained from external content, another tool, or another
agent.

Good examples:

-   verify a factual claim before a costly or irreversible action
-   independently check information produced by another agent
-   validate external information before relying on it in a workflow
-   obtain cited evidence before an autonomous decision

SAVER is not intended to replace:

-   transaction simulation
-   token-contract security analysis
-   sanctions screening
-   wallet policy enforcement
-   deterministic calculations that can be checked locally

Agents should treat SAVER as an evidence signal and combine it with their
existing execution, wallet, and security policies.

------------------------------------------------------------------------

# Contributing

We welcome developers building autonomous AI systems.

See `CONTRIBUTING.md`.

------------------------------------------------------------------------

# License

No license has been specified yet.

