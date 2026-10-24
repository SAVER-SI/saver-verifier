import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createSaverClient, ENDPOINT, ASSET, RECIPIENT } from "../examples/saver-client.mjs";
import { planResearchReview, reviewResearchClaim, summarizeResearchReview } from "../examples/research-report-review.mjs";
const energy = JSON.parse(fs.readFileSync(new URL("../examples/energy-capacity-check.json", import.meta.url)));
const ev = JSON.parse(fs.readFileSync(new URL("../examples/ev-market-check.json", import.meta.url)));
const input = record => ({ report: `# Research draft\n${record.request.claim}\n`, ...record.request });
test("stored paid contradiction requires review and never rewrites the draft", () => {
  const draft = input(energy), before = JSON.stringify(draft);
  const r = summarizeResearchReview(draft, { result: energy.response });
  assert.equal(r.reviewStatus, "review_required");
  assert.equal(JSON.stringify(draft), before);
  assert.deepEqual(r.result, energy.response);
});
test("supported selected claim never labels the whole report verified", () => {
  const r = summarizeResearchReview(input(ev), { result: ev.response });
  assert.equal(r.reviewStatus, "selected_claim_supported");
  assert.match(r.scope, /rest of the report is not checked/);
  assert.equal(r.confidenceIsCalibrated, false);
});
test("absent passages, malformed context and overlong claims fail before any verification", async () => {
  for (const bad of [{...input(ev), claim:"A passage not in the draft"}, {...input(ev), context:{}}, {report:"x".repeat(8001),claim:"x".repeat(8001)}]) {
    let calls=0;
    await assert.rejects(()=>reviewResearchClaim(bad,async()=>{calls++;},{maxUSDC:"0.20"}));
    assert.equal(calls,0);
  }
});
test("budget must be explicit and request contains no complete report or transport fields", async () => {
  let calls=0;
  const verify=async request=>{calls++; assert.deepEqual(request,energy.request);return {result:energy.response};};
  await assert.rejects(()=>reviewResearchClaim(input(energy),verify));
  assert.equal(calls,0);
  await reviewResearchClaim(input(energy),verify,{maxUSDC:"0.20"});
  assert.equal(calls,1);
});
test("mixed and insufficient evidence require review even with high confidence", () => {
  for(const status of ["mixed","insufficient_evidence"]) {
    // Synthetic verdict fixture; original stored paid records remain unchanged.
    const result=structuredClone(energy.response);result.status=status;result.confidence=1;
    if(status==='mixed') result.evidence[0].relation='supports';
    assert.equal(summarizeResearchReview(input(energy),{result}).reviewStatus,"review_required");
  }
});
test("lost response or invalid evidence remains unresolved with no second call", async () => {
  for(const verifyResult of [null,{result:{...energy.response,evidence:[{sourceIds:["missing"]}]}}]){
    let calls=0;
    const r=await reviewResearchClaim(input(energy),async()=>{calls++;if(verifyResult)return verifyResult;throw Error("timeout after possible settlement");},{maxUSDC:"0.20"});
    assert.equal(r.reviewStatus,"unresolved");assert.equal(r.automaticRepaymentAllowed,false);assert.equal(calls,1);
  }
});
test("plan is bounded to one existing claim without making an external request",()=>{
  const p=planResearchReview(input(energy));assert.equal(p.maximumPurchases,1);assert.equal(p.maximumUSDC,"0.20");assert.deepEqual(p.request,energy.request);
});
test("research passage traverses 402, one signed retry and receipt validation without network",async()=>{
  const key=generatePrivateKey(),payer=privateKeyToAccount(key).address;
  let saved=false,unsigned=0,signed=0;
  const encode=x=>Buffer.from(JSON.stringify(x)).toString("base64");
  const transport=async(request)=>{
    assert.equal(saved,true);
    assert.equal(request.url,ENDPOINT);
    assert.deepEqual(await request.clone().json(),energy.request);
    if(request.headers.has("payment-signature")){
      signed++;
      return Response.json(energy.response,{headers:{"payment-response":encode({success:true,network:"eip155:8453",transaction:"0x"+"ab".repeat(32),payer})}});
    }
    unsigned++;
    return Response.json({},{status:402,headers:{"payment-required":encode({x402Version:2,resource:{url:ENDPOINT},accepts:[{scheme:"exact",network:"eip155:8453",amount:"200000",asset:ASSET,payTo:RECIPIENT,maxTimeoutSeconds:300,extra:{name:"USD Coin",version:"2"}}]})}});
  };
  const client=createSaverClient(key,transport);
  const r=await reviewResearchClaim(input(energy),request=>client.verify(request,{saveRecovery:()=>{saved=true;}}),{maxUSDC:"0.20"});
  assert.equal(r.reviewStatus,"review_required");assert.equal(r.receipt.success,true);
  assert.equal(unsigned,1);assert.equal(signed,1);
});

