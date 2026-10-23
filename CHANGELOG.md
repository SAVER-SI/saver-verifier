# Changes

## 23 October 2026 — public integration maintenance

- Replace the informal discovery demo with a valid-POST, unsigned payment inspector and machine-readable output; document the reproduced bodyless-inspector limitation.
- Align the machine-facing description and five-tag metadata with claim verification and statistics checking in research reports.
- Consolidate the current contract in README and add offline public-client CI without wallet or API credentials.
- Retain the API contract at 1.2.2, the public skill at 1.1.1, both response versions and the three original paid example records.

## Earlier releases

API 1.2.2 documents request correction, bounded payment admission, strict completion/provenance handling and 24-hour recovery. API response v2 adds source-linked evidence while `/verify` preserves string evidence. The separately versioned skill 1.1.1 documents safe payment and recovery behavior.

The [README before consolidation](https://github.com/SAVER-SI/saver-verifier/blob/08f14b03abc28d5ef0a5b7a6db3993489a55db9e/README.md) and Git history retain dated release observations and test counts. Operator-funded tests are not evidence of organic adoption or independent accuracy.
