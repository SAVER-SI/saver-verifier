# Franklin factual-precondition gate

This sample checks an explicit external factual claim before a proposed action. It does not assess whether spending money is safe, affordable or authorized. Existing wallet, budget, permission and execution controls must remain in force.

A trusted adapter must supply `spend.verification`; this is an integration contract for this example, not an assertion that Franklin automatically provides these fields:

```json
{
  "hookEventName": "PreSpend",
  "spend": {
    "tool": "PublishReport",
    "verification": {
      "claim": "The Ethereum mainnet launched on July 30, 2015.",
      "context": "A factual precondition for the proposed report."
    }
  }
}
```

Missing or malformed PreSpend data returns `deny` before any payment. Only the explicit claim/context is sent to SAVER; arbitrary tool parameters are excluded. A `supported` result with linked supporting evidence passes this factual gate. Other outcomes and failures deny. Model confidence is not treated as a calibrated probability or a spending authorization.

## Installation

From the repository root, install into the hook directory with the same dependency lock:

```sh
mkdir -p ~/.blockrun/hooks
cp examples/franklin-prespend-hook.mjs examples/franklin-prespend-hook.sh examples/franklin-prespend-hook.json examples/saver-client.mjs ~/.blockrun/hooks/
cp package.json package-lock.json ~/.blockrun/hooks/
cd ~/.blockrun/hooks
npm ci
chmod +x franklin-prespend-hook.sh
```

Preserve the executable mode of the shell launcher. Configure a dedicated funded wallet through `SAVER_X402_PRIVATE_KEY`; never put it in input JSON, logs or source control.

The shared client enforces Base USDC, the expected SAVER recipient, exactly 0.20 USDC, one signed payment send and a validated settlement receipt. This charge is separate from the action being evaluated. Each invocation requires applicable spending authorization or a bounded runtime budget.

The configuration permits 180 seconds; the HTTP client stops after 170 seconds. Verify that the installed Franklin runtime accepts that timeout and retains its existing fail behavior. A host that crashes or ignores hook decisions cannot be secured by this sample.

## Recovery and failures

Before sending a request, the hook writes a private recovery record under `.saver-hook-recovery/`, or `SAVER_HOOK_RECOVERY_DIR`. Keep these files private. To recover with the CLI example, set `SAVER_RECOVERY_FILE` to that record and run `node examples/paid-verify.mjs --recover` from the repository. Recovery does not authorize another payment.

Retained results are released only after settlement. Inspect `resultRecovery.durable` in API discovery before depending on recovery across restarts. A timeout, 202 or 404 must never cause the host to rerun the hook and sign a replacement payment blindly. The host's own retry and fail-open policies remain its responsibility.
