import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderReviewedClaim } from '../examples/render-reviewed-claim.mjs';
const example=JSON.parse(fs.readFileSync(new URL('../examples/energy-capacity-check.json',import.meta.url),'utf8'));
const make=()=>({mode:'stored_paid_record_replay',review:{claim:example.request.claim,reviewStatus:'review_required',result:structuredClone(example.response)}});
test('stored paid replay preserves its provenance and single-claim scope',()=>{
 const md=renderReviewedClaim(make());assert.match(md,/Stored operator-funded example replay/);
 assert.match(md,/No new verification or payment/);assert.match(md,/rest of the report has not been checked/);
 assert.match(md,/\[SAVER Verifier\]\(https:\/\/saververify.com\/\)/);
 assert.match(md,/not a signed attestation or certification/);assert.match(md,/### Sources/);
});
test('input and provider strings cannot insert active HTML or Markdown links',()=>{
 const e=make();e.review.claim='<script>alert(1)</script> [click](https://evil.example)';
 const md=renderReviewedClaim(e);assert.ok(!md.includes('<script>'));assert.ok(!md.includes('[click]('));
});
test('unsafe source URLs are rejected and parentheses are escaped',()=>{
 for(const url of ['javascript:alert(1)','https://user:pass@example.org/x','https://example.org/x\n']){
  const e=make();e.review.result.sources[0].url=url;assert.throws(()=>renderReviewedClaim(e));
 }
 const e=make();e.review.result.sources[0].url='https://example.org/source_(2023)';
 assert.match(renderReviewedClaim(e),/source_%282023%29/);
});
test('unresolved outcomes produce no verdict or confidence',()=>{
 const md=renderReviewedClaim({mode:'live',review:{claim:'A claim.',reviewStatus:'unresolved'}});
 assert.match(md,/Outcome unresolved/);assert.ok(!md.includes('Confidence:'));
});
test('recovery tokens and unknown envelope fields never enter the report',()=>{
 const e=make();e.recoveryToken='private-recovery-secret';e.review.recoveryToken='also-private';
 const md=renderReviewedClaim(e);assert.ok(!md.includes('private-recovery-secret'));assert.ok(!md.includes('also-private'));
});
