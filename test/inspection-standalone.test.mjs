import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

test('free inspector runs in a clean directory without wallet packages or payment retries', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'saver-inspect-'));
  try {
    for (const file of ['verify-agent.mjs', 'saver-contract.mjs']) {
      await copyFile(new URL('../examples/' + file, import.meta.url), join(dir, file));
    }
    const entry = pathToFileURL(join(dir, 'verify-agent.mjs')).href;
    const program = `
      import assert from 'node:assert/strict';
      const { inspectPayment } = await import(${JSON.stringify(entry)});
      let calls = 0;
      const terms = {x402Version:2,resource:{url:'https://api.saververify.com/v2/verify'},accepts:[{
        scheme:'exact',network:'eip155:8453',amount:'200000',
        asset:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        payTo:'0xdfd6cb683F5288e1dD1337E84C09b490857CC110'
      }]};
      const result = await inspectPayment({claim:'The Earth orbits the Sun.'}, async (url, init) => {
        calls++; assert.equal(init.method, 'POST');
        assert.deepEqual(init.headers, {'content-type':'application/json'});
        return new Response('{}',{status:402,headers:{'payment-required':Buffer.from(JSON.stringify(terms)).toString('base64')}});
      });
      assert.equal(calls, 1); assert.equal(result.paymentsAuthorized, 0);
      assert.equal(result.inspectionOnly, true);
      console.log('standalone inspection passed');
    `;
    const output = execFileSync(process.execPath, ['--input-type=module', '-e', program], {
      cwd: dir, encoding: 'utf8', timeout: 10000,
      env: {PATH:process.env.PATH},
    });
    assert.match(output, /standalone inspection passed/);
  } finally {
    await rm(dir, {recursive:true, force:true});
  }
});
