import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('Claude release requires a fresh yes after full payment disclosure',async()=>{
 const p=JSON.parse(await readFile(new URL('.claude-plugin/plugin.json',root),'utf8'));
 assert.equal(p.name,'saver-verifier');assert.equal(p.version,'1.0.1');
 const skill=await readFile(new URL('skills/saver-verifier/SKILL.md',root),'utf8');
 for(const required of ['Before each charge, show','0.20 USDC','0xdfd6cb683F5288e1dD1337E84C09b490857CC110','wait for an explicit yes before signing','Require a separate yes for every charge','never replaces this per-charge confirmation','do not sign or pay'])assert.ok(skill.includes(required),required);
 assert.ok(!skill.includes('or an existing bounded per-call/session/daily spending policy'));
 assert.ok(skill.includes('Do not automatically sign another payment'));
});
test('Claude package has no automatic hooks, wallet collection or background services',async()=>{
 const p=JSON.parse(await readFile(new URL('.claude-plugin/plugin.json',root),'utf8'));
 for(const f of ['hooks','mcpServers','agents','commands','userConfig','settings'])assert.equal(Object.hasOwn(p,f),false);
 assert.deepEqual((await readdir(new URL('.claude-plugin/',root))).sort(),['marketplace.json','plugin.json']);
});
