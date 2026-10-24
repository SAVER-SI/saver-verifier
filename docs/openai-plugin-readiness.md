# OpenAI plugin directory readiness

Reviewed: 2026-10-24. Status: **not submitted; paid workflow is not cleared for directory distribution**.

OpenAI supports importing a Claude plugin archive containing skills without an MCP server. That establishes package-format support, not approval of the service's payment model.

The current SAVER skill instructs an authorized runtime to make an x402 payment in USDC for a digital verification service. OpenAI's published plugin guidelines currently restrict commerce to physical goods, prohibit selling digital services directly or indirectly, and list execution of crypto transfers among prohibited services. We therefore should not submit the existing paid workflow as a compliant directory plugin without explicit clarification from OpenAI.

Do not disguise payment instructions, remove price disclosure while retaining charges, offer a promotional-only placeholder, or describe the package as approved. The guidelines also require standalone value and do not accept trial/demo plugins or plugins primarily serving as advertising vehicles.

## What remains available

- The existing public API and Claude Code package remain available under their respective terms. This review does not establish approval by any platform.
- The stored examples and API documentation can be inspected without paying for a verification.
- Existing-client offline tests cover payment validation and recovery; they do not establish that ChatGPT supplies an x402 wallet or that an OpenAI-hosted paid flow works.

## Conditions before reopening this work

1. Obtain explicit policy clarification covering per-request USDC purchases of digital verification, or verify a relevant policy change.
2. Confirm an authorized wallet mechanism supported in the target environment. Never collect wallet keys through skill instructions, prompts, or a public plugin package.
3. Confirm owner identity verification, support contact and published privacy disclosures satisfy directory requirements.
4. Test imported skills and the actual permitted execution path in the target environment, then submit for review. Packaging checks alone are not end-to-end validation or approval.

No subscription, hosted server, model call, payment, or directory submission was created for this review. Do not add infrastructure or change the business/payment model merely to obtain a listing.

## Official sources

- [Import a Claude Code plugin](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Plugin guidelines: commerce, quality and privacy](https://developers.openai.com/plugins/plugin-guidelines)
- [Upload and submit a plugin](https://developers.openai.com/plugins/deploy/submission)
