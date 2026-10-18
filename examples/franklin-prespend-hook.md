# Franklin PreSpend Integration

This example shows how Franklin can use SAVER Verifier as an independent evidence check before a money-moving tool executes.

Franklin's `PreSpend` lifecycle hook is blocking. The hook receives a JSON envelope on stdin, for example:

```json
{
  "hookEventName": "PreSpend",
  "spend": {
    "estimatedUsd": 20,
    "tool": "ExamplePurchase",
    "params": {}
  }
}
```

The SAVER hook:

1. reads the Franklin `PreSpend` envelope from stdin
2. converts the proposed paid action into a verification request
3. calls `https://api.saververify.com/v2/verify`
4. evaluates SAVER's structured `status` and `confidence`
5. prints a Franklin-compatible `allow` or `deny` decision

## Files

- `franklin-prespend-hook.mjs` — reads Franklin's `PreSpend` envelope and calls SAVER
- `franklin-prespend-hook.sh` — launches the Node.js hook from the hook directory
- `franklin-prespend-hook.json` — Franklin hook configuration

## Install

Copy all three files into Franklin's user hook directory:

```bash
mkdir -p ~/.blockrun/hooks
cp franklin-prespend-hook.mjs ~/.blockrun/hooks/
cp franklin-prespend-hook.sh ~/.blockrun/hooks/
cp franklin-prespend-hook.json ~/.blockrun/hooks/
chmod +x ~/.blockrun/hooks/franklin-prespend-hook.sh
cd ~/.blockrun/hooks
npm install @x402/fetch@^2.28.0 @x402/evm@^2.28.0 viem@^2.57.4
```

Project-scoped hooks can instead be installed in:

```text
<project>/.franklin/hooks/
```

Project hooks require the Franklin project to be trusted.

## Decision policy

The example allows a proposed spend only when SAVER returns:

```text
status = supported
confidence >= 0.80
```

Other verification outcomes are denied.

The `0.80` confidence threshold is an example integration policy and can be changed by the integrator.

SAVER should be treated as an independent evidence signal. It does not replace Franklin's own wallet, budget, permission, security, or execution controls.

## x402 payment

SAVER Verifier is a paid x402 service.

A completed verification costs:

```text
0.20 USDC
```

on Base Mainnet.

The hook includes x402 payment support using `@x402/fetch`, `@x402/evm`, and `viem`.

Provide a dedicated Base wallet private key through:

```text
SAVER_X402_PRIVATE_KEY
```

Do not commit this value to the repository.

When configured, the hook:

1. calls SAVER
2. receives the x402 payment requirements
3. authorizes the `0.20 USDC` SAVER payment
4. retries the verification request automatically
5. evaluates the returned SAVER result

If `SAVER_X402_PRIVATE_KEY` is not present, the hook returns an explicit Franklin `deny` decision and does not attempt a payment.

The SAVER verification payment is separate from the spend Franklin is evaluating.

## Fail behavior

The example returns an explicit Franklin `deny` decision when SAVER cannot provide an acceptable verification result.

Franklin's lifecycle-hook engine has its own fail-open behavior when the hook process itself crashes, times out, or cannot be executed.

Review Franklin's hook security model before relying on lifecycle hooks as a security boundary.

## SAVER

- Website: `https://saververify.com`
- API: `https://api.saververify.com`
- Verification endpoint: `POST https://api.saververify.com/v2/verify`
- Price: `0.20 USDC`
- Network: Base Mainnet (`eip155:8453`)
- Protocol: x402 v2

