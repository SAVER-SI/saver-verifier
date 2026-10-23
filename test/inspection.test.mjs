import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectPayment } from '../examples/verify-agent.mjs';
import { ENDPOINT, RECIPIENT, ASSET } from '../examples/saver-client.mjs';
const input = {claim:'The Earth orbits the Sun.'};
const terms = {x402Version:2,resource:{url:ENDPOINT},accepts:[{scheme:'exact',network:'eip155:8453',amount:'200000',asset:ASSET,payTo:RECIPIENT}]};
function challenge(value=terms) {return new Response('{}',{status:402,headers:{'payment-required':Buffer.from(JSON.stringify(value)).toString('base64')}});}
test('inspection sends one valid POST and no payment authorization',async()=>{
 let calls=0;
 const result=await inspectPayment(input,async(url,init)=>{
  calls++;assert.equal(url,ENDPOINT);assert.equal(init.method,'POST');assert.equal(init.redirect,'error');
  assert.deepEqual(JSON.parse(init.body),input);
  assert.deepEqual(init.headers,{'content-type':'application/json'});
  return challenge();
 });
 assert.equal(calls,1);assert.equal(result.paymentsAuthorized,0);assert.equal(result.method,'POST');
});
test('invalid requests fail locally; no probe or signing occurs',async()=>{
 for(const request of [{}, {claim:' '}, {claim:'x',body:{}}, {claim:'x',context:12}]) {
  await assert.rejects(inspectPayment(request,async()=>{assert.fail('network must not run');}));
 }
});
test('unexpected payment terms and 400 never trigger a retry',async()=>{
 for(const response of [new Response('{}',{status:400}),challenge({...terms,accepts:[{...terms.accepts[0],amount:'300000'}]})]) {
  let calls=0;await assert.rejects(inspectPayment(input,async()=>{calls++;return response;}));assert.equal(calls,1);
 }
});
