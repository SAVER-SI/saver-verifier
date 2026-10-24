# Changes

- Make the stored report demo, local checkpoint plan and Markdown export runnable without wallet SDK installation. Share the unchanged strict result validator between offline and paid clients; paid execution and recovery still require dependencies.

## 2026-10-24 — strict public result validation

- Validate complete v2 results, source URLs, unique IDs and linked verdict relations without adding dependencies.
- Preserve the three actual stored paid examples and valid empty-evidence abstentions. Reject malformed recovered results even with a valid settlement receipt; never automatically repay.

## 2026-10-24 — dependency-free challenge inspection

- Remove wallet/SDK imports from the free inspector by sharing request and payment-term validation in a dependency-free module. Paid clients retain the same validation and exports.
- Document inspection without npm installation; verify it in a clean directory without wallet packages or credentials. No payment or production-server change.

## 2026-10-24 — Claude Code distribution package

- Add plugin and SAVER-managed marketplace manifests around the unchanged 1.1.1 skill.
- Document installation, existing-wallet requirements and explicit spending controls. No startup hooks, new hosted service or payment on installation.
- Add offline packaging checks. Plugin version 1.0.0 is separate from the skill and API versions.

## 2026-10-24 — own-claim purchase workflow

- Replace the fixed-claim paid CLI with a request-file workflow, default local plan and explicit `--execute --max-usdc=0.20` purchase. Existing bare invocations no longer buy the sample claim.
- Validate requests before saving recovery or sending network requests; preserve one-signature/send limits and recovery without repayment.
- Add five offline tests. API routes, price, server implementation and skill version are unchanged.

## 2026-10-23 — optional claim-assessment export

- Add a local Markdown formatter for saved research-checkpoint results, preserving source links, example-replay provenance and single-claim scope.
- Formatting never signs, pays, calls the network or publishes a report. Add tests for source-link safety and unresolved outcomes.

## 2026-10-23 — catalogue review evidence

- Publish a reproducible POST probe, dated CDP validation and transparent operator-funded payment evidence for directory reviewers.
- Link the review material from the README. API and skill versions are unchanged.

## 2026-10-23 — claim and citation discovery wording

- Describe factual-claim and cited-source checks directly while preserving the statistics, dates and reporting-scope focus.
- Synchronize service metadata and documentation; payment terms, response schemas, model and recorded paid examples are unchanged.

## 23 October 2026 — public integration maintenance

- Replace the informal discovery demo with a valid-POST, unsigned payment inspector and machine-readable output; document the reproduced bodyless-inspector limitation.
- Align the machine-facing description and five-tag metadata with claim verification and statistics checking in research reports.
- Consolidate the current contract in README and add offline public-client CI without wallet or API credentials.
- Retain the API contract at 1.2.2, the public skill at 1.1.1, both response versions and the three original paid example records.

## Earlier releases

API 1.2.2 documents request correction, bounded payment admission, strict completion/provenance handling and 24-hour recovery. API response v2 adds source-linked evidence while `/verify` preserves string evidence. The separately versioned skill 1.1.1 documents safe payment and recovery behavior.

The [README before consolidation](https://github.com/SAVER-SI/saver-verifier/blob/08f14b03abc28d5ef0a5b7a6db3993489a55db9e/README.md) and Git history retain dated release observations and test counts. Operator-funded tests are not evidence of organic adoption or independent accuracy.


