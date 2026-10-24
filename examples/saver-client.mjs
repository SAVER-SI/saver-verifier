import { randomBytes } from "node:crypto";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";
import { ENDPOINT, RECIPIENT, ASSET, validateRequest, validateChallenge } from "./saver-contract.mjs";
export { ENDPOINT, RECIPIENT, ASSET, validateRequest, validateChallenge } from "./saver-contract.mjs";
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
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const exactKeys = (value, keys) => object(value) &&
    Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
  const invalid = () => { throw Error('Invalid SAVER result; do not authorize another payment.'); };
  if (!exactKeys(r, ['schemaVersion','requestId','status','confidence','explanation','domain','timestamp','confidenceType','evidence','sources']) ||
      r.schemaVersion !== '2.0' || r.confidenceType !== 'model_assessed' ||
      !['supported','contradicted','mixed','insufficient_evidence'].includes(r.status) ||
      !Number.isFinite(r.confidence) || r.confidence < 0 || r.confidence > 1 ||
      !text(r.requestId) || !text(r.domain) || !text(r.explanation) ||
      typeof r.timestamp !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(r.timestamp) ||
      !Number.isFinite(Date.parse(r.timestamp)) ||
      !Array.isArray(r.sources) || !Array.isArray(r.evidence) || r.evidence.length > 10) invalid();
  const sourceIds = new Set(), evidenceIds = new Set();
  for (const source of r.sources) {
    if (!exactKeys(source, ['id','title','url']) || !text(source.id) || sourceIds.has(source.id) ||
        typeof source.title !== 'string' || typeof source.url !== 'string') invalid();
    let url;
    try { url = new URL(source.url); } catch { invalid(); }
    if (!['https:','http:'].includes(url.protocol) || !url.hostname || url.username || url.password) invalid();
    sourceIds.add(source.id);
  }
  for (const item of r.evidence) {
    if (!exactKeys(item, ['id','text','relation','sourceIds']) || !text(item.id) || evidenceIds.has(item.id) ||
        !text(item.text) || !['supports','contradicts','context'].includes(item.relation) ||
        !Array.isArray(item.sourceIds) || !item.sourceIds.length ||
        new Set(item.sourceIds).size !== item.sourceIds.length ||
        item.sourceIds.some(id => !text(id) || !sourceIds.has(id))) invalid();
    evidenceIds.add(item.id);
  }
  const supports = r.evidence.some(item => item.relation === 'supports');
  const contradicts = r.evidence.some(item => item.relation === 'contradicts');
  if ((r.status === 'supported' && !supports) || (r.status === 'contradicted' && !contradicts) ||
      (r.status === 'mixed' && (!supports || !contradicts))) invalid();
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
      validateRequest(request);
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

