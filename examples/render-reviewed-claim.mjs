// Optional local report formatting. No network, signing or publication.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateResult } from './saver-client.mjs';

const text = value => String(value).replace(/\r/g, '').replace(/[\\`*_{}\[\]<>]/g, '\\$&');
const quote = value => text(value).split('\n').map(line => `> ${line}`).join('\n');
function sourceLink(value) {
  if (typeof value !== 'string' || /[\x00-\x20]/.test(value)) throw Error('Invalid source URL.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw Error('Unsupported source URL.');
  return url.href.replace(/[()]/g, c => c === '(' ? '%28' : '%29');
}

export function renderReviewedClaim(envelope) {
  if (!envelope || !['live', 'stored_paid_record_replay', 'free_recovery'].includes(envelope.mode))
    throw Error('Expected a saved research-review envelope.');
  const review = envelope.review;
  if (!review || typeof review.claim !== 'string' || !review.claim.trim()) throw Error('Missing selected claim.');
  const lines = ['## Assessment of one selected claim', '', quote(review.claim), ''];
  if (envelope.mode === 'stored_paid_record_replay')
    lines.push('Stored operator-funded example replay. No new verification or payment was performed.', '');
  if (review.reviewStatus === 'unresolved') {
    lines.push('Outcome unresolved. No completed assessment is established by this record.', '',
      'Check recovery and settlement evidence before authorizing another payment.');
  } else {
    const result = validateResult(review.result);
    lines.push(`Assessment: **${result.status}**`, '',
      `Confidence: ${result.confidence} (model-assessed, not a calibrated probability).`, '',
      '### Explanation', '', quote(result.explanation), '', '### Evidence', '');
    for (const item of result.evidence) {
      const sourceIds = item.sourceIds.map(id => {
        const source = result.sources.find(source => source.id === id);
        return `[${text(id)}](${sourceLink(source.url)})`;
      }).join(', ');
      lines.push(`- ${text(item.text).replace(/\n/g, ' ')} (${text(item.relation)}; ${sourceIds})`);
    }
    lines.push('', '### Sources', '');
    for (const source of result.sources)
      lines.push(`- ${text(source.id)}: [${text(source.title || source.id).replace(/\n/g, ' ')}](${sourceLink(source.url)})`);
    if (review.receipt?.success === true && review.receipt.network === 'eip155:8453' && /^0x[0-9a-fA-F]{64}$/.test(review.receipt.transaction || ''))
      lines.push('', `Settlement reported in the saved receipt: https://basescan.org/tx/${review.receipt.transaction}`);
  }
  lines.push('', 'Scope: this assessment covers only the selected claim. The rest of the report has not been checked by this operation.', '',
    'Tool attribution: [SAVER Verifier](https://saververify.com/). Source interpretation remains model-assessed. This local export is not a signed attestation or certification.', '');
  return lines.join('\n');
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    if (process.argv.length !== 3) throw Error('Usage: node examples/render-reviewed-claim.mjs saved-review.json');
    process.stdout.write(renderReviewedClaim(JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))));
  } catch { console.error('Could not render the saved review. No network, payment or publication was performed.'); process.exitCode = 1; }
}
