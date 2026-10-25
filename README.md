# SAVER Verifier for Claude

Check external factual claims in research, reports and tool outputs against cited web evidence. Results distinguish supported, contradicted, mixed and insufficient evidence, with links between evidence and sources. Confidence is model-assessed and is not a calibrated probability.

## Requirements and price

An existing authorized x402 v2 wallet integration is required for paid checks. This plugin does not provide a wallet, read credentials, install dependencies or run an MCP server. If payment capability is unavailable, it can inspect the public contract and stored examples but cannot complete a paid verification.

Each completed assessment costs **0.20 USDC on Base Mainnet**. Before every charge, the skill must display the exact claim, price, network and full recipient and receive an explicit yes. A standing budget never replaces this confirmation. An insufficient-evidence assessment is a completed paid check.

## Try it

Invoke `/saver-verifier:saver-verifier` with one of these requests:

- "Inspect the SAVER API contract and its payment requirements without signing or paying."
- "Check whether this cited source supports my report's statistic. Show me the claim and payment terms before asking for approval."
- "Check this factual claim independently and return its verdict, linked evidence and limitations. Ask before any payment."

Read [three actual operator-funded paid examples](https://saververify.com/examples.json) for free. They are demonstrations, not customer reviews or an independent accuracy benchmark.

## Data and safety

Only the selected claim and optional context should be sent to the verification API. The hosted service uses OpenAI web research. Wallet secrets must remain inside the authorized wallet integration and must not be read by the model or sent to SAVER. Optional recovery stores a result for 24 hours; that is not a promise about all infrastructure or third-party log retention. Never automatically repay an uncertain outcome.

## Distribution and support

This branch contains only the Claude plugin distribution. Other clients and integrations remain on [the main branch](https://github.com/SAVER-SI/saver-verifier/tree/main); the private verification server is not included. Plugin version 1.0.2 reduces the package scope without changing its verification or payment instructions. The tracked branch name is retained for existing directory drafts.

[Website](https://saververify.com) · [Public API contract](https://api.saververify.com/openapi.json) · [Support](https://github.com/SAVER-SI/saver-verifier/issues) · [Security reporting](https://github.com/SAVER-SI/saver-verifier/security/policy)

Licensed under Apache-2.0. Directory submission and installation do not imply approval by Anthropic.
