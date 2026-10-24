// Public request and payment terms. No wallet, SDK, or network dependencies.
export const ENDPOINT = "https://api.saververify.com/v2/verify";
export const RECIPIENT = "0xdfd6cb683F5288e1dD1337E84C09b490857CC110";
export const ASSET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export function validateRequest(request) {
  if (!request || Array.isArray(request) || typeof request !== 'object' ||
      Object.keys(request).some(k => !['claim', 'context'].includes(k)) ||
      typeof request.claim !== 'string' || !request.claim.trim() || request.claim.length > 8000 ||
      (request.context != null && (typeof request.context !== 'string' || request.context.length > 12000))) {
    throw Error('Supply a valid claim and optional context as top-level JSON fields.');
  }
  const body = JSON.stringify(request);
  if (Buffer.byteLength(body, 'utf8') > 128 * 1024) throw Error('Request exceeds 128 KiB.');
  return request;
}
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
