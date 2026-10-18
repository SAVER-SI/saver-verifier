import { randomBytes } from "node:crypto";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";
export const ENDPOINT = "https://api.saververify.com/v2/verify";
export const RECIPIENT = "0xdfd6cb683F5288e1dD1337E84C09b490857CC110";
export const ASSET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export function validateChallenge(c) {
  const a = c?.accepts?.[0];
  if (
    c?.x402Version !== 2 ||
    c.resource?.url !== ENDPOINT ||
    c.accepts?.length !== 1 ||
    a.scheme !== "exact" ||
    a.network !== "eip155:8453" ||
    a.amount !== "200000" ||
    a.asset?.toLowerCase() !== ASSET.toLowerCase() ||
    a.payTo?.toLowerCase() !== RECIPIENT.toLowerCase()
  )
    throw Error("Unexpected payment requirements; nothing authorized.");
}
export function validateReceipt(encoded, payer) {
  const r = JSON.parse(Buffer.from(encoded || "", "base64").toString("utf8"));
  if (
    r.success !== true ||
    r.network !== "eip155:8453" ||
    !/^0x[\da-f]{64}$/i.test(r.transaction) ||
    (payer && r.payer && r.payer.toLowerCase() !== payer.toLowerCase())
  )
    throw Error(
      "Invalid settlement receipt; do not authorize another payment.",
    );
  return r;
}
export function validateResult(r) {
  if (
    r?.schemaVersion !== "2.0" ||
    !["supported", "contradicted", "mixed", "insufficient_evidence"].includes(
      r.status,
    ) ||
    !Number.isFinite(r.confidence) ||
    r.confidence < 0 ||
    r.confidence > 1 ||
    !Array.isArray(r.sources) ||
    !Array.isArray(r.evidence)
  )
    throw Error("Invalid SAVER result.");
  for (const e of r.evidence)
    if (
      !Array.isArray(e.sourceIds) ||
      !e.sourceIds.length ||
      e.sourceIds.some((id) => !r.sources.some((s) => s.id === id))
    )
      throw Error("Invalid source links.");
  return r;
}
async function readResult(response, payer) {
  if (response.status !== 200)
    throw Error(
      `SAVER returned HTTP ${response.status}; do not automatically authorize another payment.`,
    );
  return {
    result: validateResult(await response.json()),
    receipt: validateReceipt(response.headers.get("payment-response"), payer),
    replay: response.headers.get("saver-result-replay") === "true",
  };
}
export async function recoverResult(token, fetchImpl = fetch) {
  if (!/^[\da-f]{64}$/i.test(token)) throw Error("Invalid recovery token.");
  return readResult(
    await fetchImpl("https://api.saververify.com/results", {
      headers: { "saver-recovery-token": token },
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    }),
  );
}
// Construct one client per approved purchase. Never retry a paid send automatically.
export function createSaverClient(privateKey, fetchImpl = fetch) {
  const account = privateKeyToAccount(privateKey);
  let signatures = 0,
    paidSends = 0;
  const signer = {
    ...account,
    async signTypedData(d) {
      if (
        Number(d.domain.chainId) !== 8453 ||
        d.domain.verifyingContract?.toLowerCase() !== ASSET.toLowerCase() ||
        d.primaryType !== "TransferWithAuthorization" ||
        d.message.to?.toLowerCase() !== RECIPIENT.toLowerCase() ||
        BigInt(d.message.value) !== 200000n ||
        ++signatures > 1
      )
        throw Error("Payment policy rejected authorization.");
      return account.signTypedData(d);
    },
  };
  const restricted = async (input, init) => {
    const req = new Request(input, init);
    if (req.url !== ENDPOINT || req.method !== "POST")
      throw Error("Unexpected payment destination.");
    if (req.headers.has("payment-signature") && ++paidSends > 1)
      throw Error("One-payment send limit reached.");
    const res = await fetchImpl(req, {
      redirect: "error",
      signal: AbortSignal.timeout(170000),
    });
    if (res.status === 402)
      validateChallenge(
        JSON.parse(
          Buffer.from(
            res.headers.get("payment-required") || "",
            "base64",
          ).toString("utf8"),
        ),
      );
    return res;
  };
  const paid = wrapFetchWithPaymentFromConfig(restricted, {
    spendControls: { maxAmountPerPayment: "$0.20" },
    schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(signer) }],
  });
  return {
    async verify(
      request,
      { token = randomBytes(32).toString("hex"), saveRecovery } = {},
    ) {
      if (!/^[\da-f]{64}$/i.test(token)) throw Error("Invalid recovery token.");
      if (saveRecovery)
        await saveRecovery({ token, request, endpoint: ENDPOINT });
      return readResult(
        await paid(ENDPOINT, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "saver-recovery-token": token,
          },
          body: JSON.stringify(request),
        }),
        account.address,
      );
    },
  };
}
