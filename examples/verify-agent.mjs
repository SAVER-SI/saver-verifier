import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ENDPOINT, validateChallenge, validateRequest } from './saver-client.mjs';

// Inspection never creates a signer or sends a payment header.
export async function inspectPayment(request, fetchImpl = fetch) {
  validateRequest(request);
  const body = JSON.stringify(request);
  const response = await fetchImpl(ENDPOINT, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body,
    redirect: 'error', signal: AbortSignal.timeout(20000),
  });
  if (response.status !== 402) throw Error(`Inspection returned HTTP ${response.status}; no payment was authorized.`);
  const encoded = response.headers.get('payment-required');
  if (!encoded) throw Error('Missing PAYMENT-REQUIRED header; no payment was authorized.');
  const challenge = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
  validateChallenge(challenge);
  return { inspectionOnly: true, paymentsAuthorized: 0, httpStatus: 402,
    method: 'POST', url: ENDPOINT, paymentRequired: challenge };
}

async function main() {
  const args = process.argv.slice(2).filter(a => a !== '--json');
  if (args.length > 1 || args.some(a => a.startsWith('-'))) throw Error('Usage: node examples/verify-agent.mjs [request.json] [--json]');
  const file = args.length ? resolve(args[0]) : new URL('./verify-request.json', import.meta.url);
  const request = JSON.parse(await readFile(file, 'utf8'));
  console.log(JSON.stringify(await inspectPayment(request), null, 2));
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(() => {
    console.error(JSON.stringify({ inspectionOnly: true, paymentsAuthorized: 0,
      error: 'Inspection failed. Check the request, endpoint response and published contract; no payment was authorized.' }));
    process.exitCode = 1;
  });
}

