import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));

test('marketplace resolves the existing skill through the root plugin', async () => {
  const plugin = await json('.claude-plugin/plugin.json');
  const marketplace = await json('.claude-plugin/marketplace.json');
  assert.equal(plugin.name, 'saver-verifier');
  assert.equal(plugin.version, '1.0.0');
  assert.equal(marketplace.name, 'saver-tools');
  assert.deepEqual(marketplace.plugins, [{ name: plugin.name, source: './' }]);
  const skill = await readFile(new URL('skills/saver-verifier/SKILL.md', root), 'utf8');
  assert.match(skill, /version: 1\.1\.1/);
  assert.match(skill, /spending policy/);
  assert.match(skill, /Do not automatically/);
});

test('plugin contains instructions without automatic execution or secret collection', async () => {
  const plugin = await json('.claude-plugin/plugin.json');
  for (const field of ['mcpServers', 'hooks', 'agents', 'commands', 'userConfig', 'settings']) {
    assert.equal(Object.hasOwn(plugin, field), false);
  }
  assert.deepEqual((await readdir(new URL('.claude-plugin/', root))).sort(), ['marketplace.json', 'plugin.json']);
  assert.equal(plugin.homepage, 'https://saververify.com');
  assert.equal(plugin.repository, 'https://github.com/SAVER-SI/saver-verifier');
});
