import fs from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createSaverClient, recoverResult, validateRequest, ENDPOINT } from './saver-client.mjs';

// Default is a local plan. Payment requires a request file and explicit budget.
export async function runPurchase(args, {
  env = process.env, files = fs, createClient = createSaverClient, recover = recoverResult,
} = {}) {
  const execute = args.includes('--execute');
  const recovery = args.includes('--recover');
  const budget = args.filter(a => a.startsWith('--max-usdc='));
  const inputs = args.filter(a => !a.startsWith('--'));
  const unknown = args.filter(a => a.startsWith('--') && !['--execute', '--recover'].includes(a) && !a.startsWith('--max-usdc='));
  if (unknown.length || new Set(args).size !== args.length || budget.length > 1 || inputs.length > 1 ||
      (recovery && (execute || budget.length || inputs.length)) || (!recovery && inputs.length !== 1)) {
    throw Error('Use: node examples/paid-verify.mjs request.json [--execute --max-usdc=0.20], or --recover.');
  }
  const file = env.SAVER_RECOVERY_FILE || '.saver-recovery.json';
  if (recovery) return recover(JSON.parse(files.readFileSync(file, 'utf8')).token);
  const request = validateRequest(JSON.parse(files.readFileSync(inputs[0], 'utf8')));
  if (budget.length && budget[0] !== '--max-usdc=0.20') throw Error('The permitted budget is exactly --max-usdc=0.20.');
  if (!execute) return {mode:'plan', paymentsAuthorized:0, networkRequests:0, endpoint:ENDPOINT, request, maximumPurchaseUSDC:'0.20', recoveryFile:file};
  if (budget[0] !== '--max-usdc=0.20') throw Error('Execution requires --max-usdc=0.20 and an existing authorized spending policy or explicit approval.');
  if (files.existsSync(file)) throw Error('Prior attempt exists. Use --recover; do not overwrite it or automatically repay.');
  if (!env.SAVER_PRIVATE_KEY) throw Error('An existing authorized wallet is required. Keep its key outside model context.');
  return createClient(env.SAVER_PRIVATE_KEY).verify(request, {
    saveRecovery: data => files.writeFileSync(file, JSON.stringify(data,null,2)+'\n', {flag:'wx',mode:0o600}),
  });
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  runPurchase(process.argv.slice(2)).then(answer => console.log(JSON.stringify(answer,null,2))).catch(() => {
    console.error('Request not completed. Check arguments and saved recovery state; never automatically authorize another payment. Usage: node examples/paid-verify.mjs request.json [--execute --max-usdc=0.20], or --recover.');
    process.exitCode=1;
  });
}
