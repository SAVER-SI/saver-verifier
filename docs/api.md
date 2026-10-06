\# SAVER Verifier API



SAVER Verifier exposes a paid machine-to-machine verification endpoint for autonomous AI agents.



The API allows compatible agents and software systems to submit factual claims and receive structured verification results after successful x402 payment authorization.



\---



\## Base URL



```text

https://agent-production-9804.up.railway.app

```



\---



\## Verify Endpoint



```http

POST /verify

```



Full URL:



```text

https://agent-production-9804.up.railway.app/verify

```



\---



\## Request



Content-Type:



```text

application/json

```



Example request:



```json

{

&#x20; "claim": "The Ethereum mainnet launched on July 30, 2015.",

&#x20; "context": ""

}

```



\### Request Fields



| Field | Required | Type | Description |

|---|---|---|---|

| `claim` | Yes | string | Factual claim or statement to verify |

| `context` | No | string | Optional additional context |



\---



\## Payment



SAVER Verifier uses the x402 payment protocol for machine-to-machine payments.



Requests without payment authorization receive:



```text

HTTP 402 Payment Required

```



A compatible x402 client can:



1\. Receive payment requirements

2\. Authorize USDC payment

3\. Retry the request

4\. Receive the verification result



\---



\## Current Payment Configuration



| Setting | Value |

|---|---|

| Protocol | x402 v2 |

| Network | Base Mainnet |

| Chain ID | `eip155:8453` |

| Asset | USDC |

| Price | `0.20 USDC` |



\---



\## Successful Response



HTTP:



```text

200 OK

```



Example:



```json

{

&#x20; "status": "supported",

&#x20; "confidence": 0.98,

&#x20; "explanation": "The available evidence supports the claim.",

&#x20; "evidence": \[

&#x20;   "Relevant authoritative sources support the claim."

&#x20; ],

&#x20; "sources": \[

&#x20;   {

&#x20;     "title": "Example source",

&#x20;     "url": "https://example.com"

&#x20;   }

&#x20; ],

&#x20; "domain": "general-verification",

&#x20; "timestamp": "2026-10-06T12:43:02.565Z"

}

```



\---



\## Verification Status Values



Possible response states:



```text

supported

contradicted

mixed

insufficient\_evidence

```



Meaning:



| Status | Description |

|---|---|

| `supported` | Available evidence supports the claim |

| `contradicted` | Available evidence conflicts with the claim |

| `mixed` | Evidence contains conflicting information |

| `insufficient\_evidence` | Available evidence is not enough to determine |



\---



\## HTTP Status Codes



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



\---



\## Machine Discovery



SAVER provides machine-readable discovery endpoints.



\### OpenAPI Specification



```text

GET /openapi.json

```



URL:



```text

https://agent-production-9804.up.railway.app/openapi.json

```



\---



\### x402 Discovery Metadata



```text

GET /.well-known/x402

```



URL:



```text

https://agent-production-9804.up.railway.app/.well-known/x402

```



\---



\## Integration Flow



Typical autonomous agent workflow:



```text

1\. Discover service

&#x20;       |

&#x20;       v

2\. Inspect API and payment requirements

&#x20;       |

&#x20;       v

3\. Submit verification request

&#x20;       |

&#x20;       v

4\. Complete x402 payment

&#x20;       |

&#x20;       v

5\. Receive structured verification result

```



\---



\## OpenAPI Contract



The complete machine-readable API definition is available here:



```text

https://agent-production-9804.up.railway.app/openapi.json

```



\---



\## x402 Contract



Payment discovery information is available here:



```text

https://agent-production-9804.up.railway.app/.well-known/x402

```



\---



\## Repository



This public repository contains:



\- API documentation

\- integration examples

\- service information



The production implementation is maintained separately.

