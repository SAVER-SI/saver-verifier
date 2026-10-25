# Use SAVER with an existing Coinbase Wallet MCP

For agents that already have Coinbase Wallet MCP connected, SAVER needs no separate API key or local wallet-secret setup. This is a SAVER-maintained request recipe based on Coinbase's published tool contract, not a Coinbase partnership, approved native plugin or completed live interoperability test.

## Prerequisite

Use an already connected wallet with Base USDC and the owner's authorization. If the wallet is absent, follow Coinbase's [official setup](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp#quickstart). Adding a wallet connection grants financial capabilities; the owner should review and approve that connection. SAVER does not install or fund it.

The current Wallet MCP flow requires wallet approval for each paid request. It is an assisted payment path, not proof of unattended high-volume execution. An autonomous backend should instead use an existing policy-controlled x402 client.

## Inspect before buying

Read [three actual operator-funded reports](https://saververify.com/examples.json) and the [live contract](https://api.saververify.com/openapi.json). Choose one material unresolved claim. If existing sources already resolve it, keep those sources.

For a free live challenge, send a valid unsigned POST with only claim and optional context. Do not substitute GET or an empty object. No wallet signature is needed to inspect the PAYMENT-REQUIRED header.

Expected terms: 0.20 USDC / amount 200000, Base eip155:8453, exact scheme, USDC 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, recipient 0xdfd6cb683F5288e1dD1337E84C09b490857CC110. Reject different terms.

## Map the selected claim to the wallet tool

Coinbase documents initiate_x402_request followed by complete_x402_request after wallet approval. Inspect the runtime's actual tool schema before calling: tool names may be namespaced.

| Wallet tool field | SAVER value |
|---|---|
| url | https://api.saververify.com/v2/verify |
| method | POST |
| maxPayment | "0.20" — human-readable USDC, not 200000 |
| body | The caller's JSON object containing only claim and optional context |
| headers | Content-Type: application/json; optionally SAVER-RECOVERY-TOKEN |

The outer wallet fields must not be sent inside SAVER's JSON body. This distinction avoids body-wrapper validation errors.

For opt-in recovery, generate and privately persist a random 32-byte hexadecimal token before initiating. Forward the same SAVER-RECOVERY-TOKEN on the original and signed requests. Confirm that the wallet tool preserves custom headers; if it cannot, do not assume recovery is enabled. Never put the token in a URL or use a wallet key as the token.

## Authorize and complete once

Show the exact claim, 0.20 USDC on Base and full recipient. Disclose that a valid insufficient_evidence assessment is also a paid result. Ask for a separate explicit yes before initiating a payment flow, as required by SAVER's Claude plugin. The wallet's approval step remains required too.

After the owner approves the wallet request, pass its returned requestId to complete_x402_request. Keep that wallet request ID separate from SAVER's result requestId. Preserve the response, linked sources and successful settlement evidence. An approval link, pending status or request ID alone is not a completed purchase.

Do not start a second initiation after a timeout, failure or lost response. Use the existing wallet request status and SAVER's 24-hour recovery when enabled. A missing result is not proof of nonpayment. If the tool hides the receipt or response headers, keep the outcome unresolved until settlement is established; do not invent a successful receipt.

## Validation boundary

The POST body and terms match SAVER's public contract; the field mapping was checked against Coinbase's official documentation on 25 October 2026. No wallet was connected and no payment was executed through Wallet MCP for this recipe. Host allowlists, authentication, header preservation and returned receipts must be verified in the connected runtime. Never use a generic token transfer as a substitute for the x402 authorization/retry flow.
