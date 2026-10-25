import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('marketplace pins the consent-specific Claude release',async()=>{
 const m=JSON.parse(await readFile(new URL('.claude-plugin/marketplace.json',root),'utf8'));
 assert.equal(m.name,'saver-tools');assert.equal(m.plugins.length,1);
 const p=m.plugins[0];assert.equal(p.name,'saver-verifier');assert.equal(p.version,'1.0.1');
 assert.deepEqual(p.source,{source:'github',repo:'SAVER-SI/saver-verifier',sha:'4cf419630f07ce3e5b9b89b15c9e4f33683914de'});
 assert.match(p.source.sha,/^[a-f0-9]{40}$/);
 assert.deepEqual(await readdir(new URL('.claude-plugin/',root)),['marketplace.json']);
});
test('general autonomous agent skill remains separate and unchanged',async()=>{
 const s=await readFile(new URL('skills/saver-verifier/SKILL.md',root),'utf8');
 assert.ok(s.includes('version: 1.1.1'));assert.ok(s.includes('or an existing bounded per-call/session/daily spending policy'));
 assert.ok(!s.includes('Require a separate yes for every charge'));
});
