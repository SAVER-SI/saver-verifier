# Chat2AnyLLM plugin catalog contribution

Status: prepared, not submitted upstream. No paid calls, production changes or claim of catalog acceptance.

Target: https://github.com/Chat2AnyLLM/awesome-repo-configs
Contribution rules: https://github.com/Chat2AnyLLM/awesome-repo-configs/blob/main/CONTRIBUTING.md
Consumer: https://github.com/Chat2AnyLLM/awesome-claude-plugins

The upstream README says this config feeds the plugin catalog and code-agent-manager. This is metadata discovery, not automatic installation, endorsement, ranking or guaranteed sales.

Checked 26 October 2026: no SAVER entry among 4,902 plugin config records; no existing SAVER PR returned by upstream search. Existing pending submissions elsewhere are unchanged.

The patch adds only SAVER-SI/saver-verifier to plugin_repos.json. It does not edit the generated README. The existing public marketplace is saver-tools; its plugin is version 1.0.1, pinned internally to commit 4cf419630f07ce3e5b9b89b15c9e4f33683914de. Config discovery uses main like other entries; this catalog configuration itself is not a pinned executable artifact.

Validation performed: proposed JSON parses, adds exactly one record and preserves every existing entry structurally. The live marketplace manifest parses and declares a research plugin, explicit per-charge approval and the pinned source. No upstream full test-suite or Claude runtime invocation was performed for this metadata-only preparation.

In a fork of the target repository under SAVER-SI:

1. Create an add-saver-verifier branch from current upstream main.
2. Apply add-saver-verifier.patch with git apply. If the context no longer matches, add entry.json under its existing top-level key without overwriting others.
3. Run the three commands required in CONTRIBUTING.md:

```sh
python3 tests/test_json_validation.py
python3 tests/test_pr_review_config.py
python3 tests/test_readme_pr_reminder.py
```

4. Inspect the one-file diff, check upstream for a new duplicate submission, then submit the PR using PR.md.

GitHub connector lacks repository/fork creation in this session. Prepared files are hosted in the existing public SAVER repository; they do not modify the installable plugin, service terms, model, price or wallet. No new fork or upstream PR has been created.
