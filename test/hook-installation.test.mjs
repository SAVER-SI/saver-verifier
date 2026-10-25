import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

test('documented Franklin package starts with all local client imports', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const guide = fs.readFileSync(path.join(root, 'examples/franklin-prespend-hook.md'), 'utf8');
  const line = guide.split('\n').find(line => line.startsWith('cp examples/'));
  assert.ok(line, 'documented copy command missing');
  const sources = line.split(/\s+/).slice(1, -1);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'saver-hook-install-'));
  try {
    for (const source of sources) {
      assert.match(source, /^examples\/[a-z-]+\.(mjs|sh|json)$/);
      fs.copyFileSync(path.join(root, source), path.join(dir, path.basename(source)));
    }
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'junction');
    const env = { ...process.env };
    delete env.SAVER_X402_PRIVATE_KEY;
    delete env.SAVER_PRIVATE_KEY;
    const run = spawnSync(process.execPath, [path.join(dir, 'franklin-prespend-hook.mjs')], {
      input: '{}', encoding: 'utf8', cwd: dir, env, timeout: 10000,
    });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).decision, 'deny');
    assert.equal(fs.existsSync(path.join(dir, '.saver-hook-recovery')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
