import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateResult, recoverResult } from '../examples/saver-client.mjs';

const records = ['energy-capacity-check','ev-market-check','digital-access-check'].map(name =>
  JSON.parse(readFileSync(new URL('../examples/'+name+'.json',import.meta.url),'utf8')));
const valid = () => structuredClone(records[0].response);

test('three unchanged actual paid examples satisfy strict result validation', () => {
  for (const record of records) assert.equal(validateResult(record.response),record.response);
});
test('valid abstention may contain no findings or sources', () => {
  const r=valid(); Object.assign(r,{status:'insufficient_evidence',confidence:0,evidence:[],sources:[]});
  assert.equal(validateResult(r),r);
});
test('malformed source, evidence, metadata and unsupported decisive verdicts are rejected', () => {
  const changes = [
    r=>{r.status='supported';r.evidence=[];r.sources=[];},
    r=>{r.sources[0].url='javascript:alert(1)';},
    r=>{r.sources[0].url='https://user:secret@example.org/';},
    r=>{r.sources.push({...r.sources[0]});},
    r=>{r.evidence[0].sourceIds=['missing'];},
    r=>{r.evidence[0].sourceIds=[r.sources[0].id,r.sources[0].id];},
    r=>{r.evidence[1].id=r.evidence[0].id;},
    r=>{delete r.evidence[0].text;},
    r=>{r.evidence[0].text=' ';},
    r=>{delete r.requestId;},r=>{r.timestamp='not-a-date';},
    r=>{r.confidenceType='calibrated';},r=>{r.extra='unexpected';},
    r=>{r.status='mixed';r.evidence=r.evidence.map(e=>({...e,relation:'supports'}));},
    r=>{r.status='contradicted';r.evidence=r.evidence.map(e=>({...e,relation:'context'}));},
  ];
  for(const change of changes){const r=valid();change(r);assert.throws(()=>validateResult(r),/Invalid SAVER result/);}
});
test('a valid settlement receipt cannot make a malformed recovered result valid or trigger repayment', async () => {
  let calls=0;
  const receipt={success:true,network:'eip155:8453',transaction:'0x'+'ab'.repeat(32)};
  await assert.rejects(recoverResult('ab'.repeat(32),async()=>{
    calls++;return Response.json({schemaVersion:'2.0',status:'supported',confidence:1,evidence:[],sources:[]},
      {headers:{'payment-response':Buffer.from(JSON.stringify(receipt)).toString('base64')}});
  }),/Invalid SAVER result/);
  assert.equal(calls,1);
});
