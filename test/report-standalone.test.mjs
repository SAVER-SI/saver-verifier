import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

test('report demo, plan and export work without wallet packages, credentials or network', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'saver-report-'));
  try {
    for (const file of ['research-report-review.mjs', 'render-reviewed-claim.mjs',
      'saver-contract.mjs', 'saver-result.mjs', 'energy-capacity-check.json']) {
      await copyFile(new URL('../examples/' + file, import.meta.url), join(dir, file));
    }
    await writeFile(join(dir, 'no-network.mjs'), 'globalThis.fetch = () => { throw Error("Network forbidden in offline demo"); };');
    const run = (...args) => execFileSync(process.execPath, ['--import', join(dir, 'no-network.mjs'), ...args], {
      cwd: dir, encoding: 'utf8', timeout: 10000, env: { PATH: process.env.PATH },
    });
    const replay = run('research-report-review.mjs', '--demo');
    const result = JSON.parse(replay);
    assert.equal(result.mode, 'stored_paid_record_replay');
    assert.equal(result.newPayments, 0);
    assert.equal(result.operatorFundedOriginal, true);
    assert.equal(result.review.reviewStatus, 'review_required');
    await writeFile(join(dir, 'review.json'), replay);
    const markdown = run('render-reviewed-claim.mjs', 'review.json');
    assert.match(markdown, /https:\/\//);
    assert.match(markdown, /replay/i);
    const claim = result.review.claim;
    await writeFile(join(dir, 'request.json'), JSON.stringify({ report: claim, claim }));
    const plan = JSON.parse(run('research-report-review.mjs', 'request.json'));
    assert.equal(plan.mode, 'dry_run');
    assert.equal(plan.newPayments, 0);
    assert.equal(plan.maximumPurchases, 1);
    assert.equal(plan.maximumUSDC, '0.20');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
