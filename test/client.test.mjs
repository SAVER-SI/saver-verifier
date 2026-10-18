import test from "node:test";
import assert from "node:assert/strict";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  createSaverClient,
  validateChallenge,
  validateReceipt,
  recoverResult,
  ENDPOINT,
  RECIPIENT,
  ASSET,
} from "../examples/saver-client.mjs";
import { evaluateHook } from "../examples/franklin-prespend-hook.mjs";
const challenge = () => ({
  x402Version: 2,
  resource: { url: ENDPOINT, mimeType: "application/json" },
  accepts: [
    {
      scheme: "exact",
      network: "eip155:8453",
      amount: "200000",
      asset: ASSET,
      payTo: RECIPIENT,
      maxTimeoutSeconds: 300,
      extra: { name: "USD Coin", version: "2" },
    },
  ],
});
const result = {
  schemaVersion: "2.0",
  status: "supported",
  confidence: 0.9,
  evidence: [{ text: "A finding", relation: "supports", sourceIds: ["s1"] }],
  sources: [{ id: "s1", title: "Source", url: "https://example.com" }],
};
const receipt = (payer) => ({
  success: true,
  network: "eip155:8453",
  transaction: "0x" + "ab".repeat(32),
  payer,
});
const encode = (x) => Buffer.from(JSON.stringify(x)).toString("base64");
test("wrong amount, recipient, asset and network are rejected before signing", () => {
  validateChallenge(challenge());
  for (const [key, value] of [
    ["amount", "200001"],
    ["payTo", "0x" + "00".repeat(20)],
    ["asset", "0x" + "00".repeat(20)],
    ["network", "eip155:1"],
  ]) {
    const c = challenge();
    c.accepts[0][key] = value;
    assert.throws(() => validateChallenge(c));
  }
});
test("receipt presence alone cannot indicate successful settlement", () => {
  const r = receipt("payer");
  assert.equal(validateReceipt(encode(r), "payer").success, true);
  assert.throws(() => validateReceipt(encode({ ...r, success: false })));
  assert.throws(() => validateReceipt(encode(r), "someone-else"));
  assert.throws(() => validateReceipt("not-json"));
});
test("one client enforces one charge and saves recovery before any request", async () => {
  const key = generatePrivateKey(),
    payer = privateKeyToAccount(key).address;
  let saved = false,
    paid = 0;
  const transport = async (input, options) => {
    assert.equal(saved, true);
    assert.equal(options.redirect, "error");
    const r = new Request(input);
    if (r.headers.has("payment-signature")) {
      paid++;
      return Response.json(result, {
        headers: { "payment-response": encode(receipt(payer)) },
      });
    }
    return Response.json(
      {},
      { status: 402, headers: { "payment-required": encode(challenge()) } },
    );
  };
  const client = createSaverClient(key, transport);
  const answer = await client.verify(
    { claim: "A fact" },
    {
      saveRecovery: () => {
        saved = true;
      },
    },
  );
  assert.equal(answer.result.status, "supported");
  assert.equal(paid, 1);
  await assert.rejects(() => client.verify({ claim: "Another fact" }));
  assert.equal(paid, 1);
});
test("recovery uses only its bearer token and never sends a payment", async () => {
  let calls = 0;
  const answer = await recoverResult("ab".repeat(32), async (url, options) => {
    calls++;
    assert.equal(url, "https://api.saververify.com/results");
    assert.equal(options.headers["saver-recovery-token"], "ab".repeat(32));
    return Response.json(result, {
      headers: {
        "payment-response": encode(receipt("payer")),
        "saver-result-replay": "true",
      },
    });
  });
  assert.equal(answer.replay, true);
  assert.equal(calls, 1);
});
test("malformed PreSpend events deny before a paid call", async () => {
  for (const input of [
    null,
    [],
    {},
    { hookEventName: "PreSpend" },
    { hookEventName: "PreSpend", spend: {} },
    {
      hookEventName: "PreSpend",
      spend: { tool: "x", verification: { claim: "" } },
    },
  ]) {
    let calls = 0;
    const r = await evaluateHook(input, async () => {
      calls++;
    });
    assert.equal(r.decision, "deny");
    assert.equal(calls, 0);
  }
});
test("hook sends an explicit fact, excludes tool parameters and retains wallet policy", async () => {
  const r = await evaluateHook(
    {
      hookEventName: "PreSpend",
      spend: {
        tool: "Purchase",
        params: { secret: "not-a-fact" },
        verification: { claim: "A factual precondition", context: "Context" },
      },
    },
    async (request) => {
      assert.deepEqual(request, {
        claim: "A factual precondition",
        context: "Context",
      });
      return { result };
    },
  );
  assert.equal(r.decision, "allow");
  assert.match(r.reason, /wallet/);
});
test("unsupported outcomes and service failure deny rather than bypassing controls", async () => {
  for (const verdict of ["contradicted", "mixed", "insufficient_evidence"])
    assert.equal(
      (
        await evaluateHook(
          {
            hookEventName: "PreSpend",
            spend: { tool: "x", verification: { claim: "Fact" } },
          },
          async () => ({ result: { ...result, status: verdict } }),
        )
      ).decision,
      "deny",
    );
  assert.equal(
    (
      await evaluateHook(
        {
          hookEventName: "PreSpend",
          spend: { tool: "x", verification: { claim: "Fact" } },
        },
        async () => {
          throw Error("Failure");
        },
      )
    ).decision,
    "deny",
  );
});
