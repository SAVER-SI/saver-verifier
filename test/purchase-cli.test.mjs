import test from 'node:test';
import assert from 'node:assert/strict';
import { runPurchase } from '../examples/paid-verify.mjs';
import { createSaverClient } from '../examples/saver-client.mjs';
const request={claim:'An actual selected claim.',context:'Original publication and year.'};
function setup(input=request,exists=false) {
 const trace=[];
 const files={readFileSync:()=>JSON.stringify(input),existsSync:()=>exists,writeFileSync:(...args)=>trace.push(['persist',...args])};
 const options={files,env:{SAVER_PRIVATE_KEY:'TEST_ONLY',SAVER_RECOVERY_FILE:'private-recovery.json'},createClient:()=>{trace.push(['client']);return {verify:async(body,{saveRecovery})=>{assert.deepEqual(body,request);saveRecovery({token:'test-token',request:body});trace.push(['send']);return {result:{status:'supported'}};}}},recover:async token=>{trace.push(['recover',token]);return {recovered:true};}};
 return {trace,options};
}
test('own request defaults to a local plan even when wallet configuration exists',async()=>{
 const {trace,options}=setup();const plan=await runPurchase(['claim.json'],options);
 assert.equal(plan.mode,'plan');assert.equal(plan.networkRequests,0);assert.equal(plan.paymentsAuthorized,0);assert.deepEqual(plan.request,request);assert.deepEqual(trace,[]);
});
test('execution needs explicit budget, valid input and a fresh recovery file',async()=>{
 for(const args of [[],['--execute'],['claim.json','--execute'],['claim.json','--execute','--max-usdc=1'],['claim.json','--wat']]){
  const {trace,options}=setup();await assert.rejects(runPurchase(args,options));assert.deepEqual(trace,[]);
 }
 for(const [input,exists] of [[{},false],[request,true]]){
  const {trace,options}=setup(input,exists);await assert.rejects(runPurchase(['claim.json','--execute','--max-usdc=0.20'],options));assert.deepEqual(trace,[]);
 }
});
test('one authorized invocation persists recovery exclusively before submitting',async()=>{
 const {trace,options}=setup();await runPurchase(['claim.json','--execute','--max-usdc=0.20'],options);
 assert.deepEqual(trace.map(x=>x[0]),['client','persist','send']);assert.equal(trace[1][3].flag,'wx');assert.equal(trace[1][3].mode,0o600);
});
test('recovery uses no signing client and cannot be combined with execution',async()=>{
 const {trace,options}=setup({token:'retained-token'});await runPurchase(['--recover'],options);
 assert.deepEqual(trace,[['recover','retained-token']]);await assert.rejects(runPurchase(['--recover','--execute'],options));
});
test('shared client rejects malformed input before persisting recovery or network work',async()=>{
 let calls=0,saves=0;const client=createSaverClient('0x'+'11'.repeat(32),async()=>{calls++;throw Error('no network');});
 await assert.rejects(client.verify({claim:'ok',body:{}},{saveRecovery:()=>saves++}));assert.equal(calls,0);assert.equal(saves,0);
});
