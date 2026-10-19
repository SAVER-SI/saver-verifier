# Security Policy

## Overview

SAVER Verifier is a machine-to-machine verification service for autonomous AI agents.

Security is important because the service handles automated interactions, payment authorization flows, and API-based integrations.

---

## Supported Versions

Security updates are applied to the currently deployed production version.

Older versions may not receive security fixes.

---

## Reporting a Security Issue

If you discover a potential security vulnerability, do not publish technical details in a public issue.

To arrange a private reporting channel, open a minimal [contact request](https://github.com/SAVER-SI/saver-verifier/issues/new?title=Private%20security%20contact%20request) with the title "Private security contact request" and no vulnerability details or secrets. The operator will agree a private channel before you send the report. A dedicated security mailbox is not currently published.

Include:

- Description of the issue

- Steps to reproduce

- Potential impact

- Any relevant technical details

---

## Responsible Disclosure

We appreciate responsible disclosure and will investigate reported issues as quickly as possible.

Please allow reasonable time for investigation and remediation before publicly discussing a vulnerability.

---

## Security Principles

SAVER follows these principles:

- Payment authorization before protected processing

- No exposure of private credentials

- Machine-readable API contracts

- Separation between public documentation and production implementation

- Secure handling of service configuration

---

## ClawHub Skill Audit

The published SAVER Verifier skill is scanned by ClawHub security tooling.

Published skill checked on 2026-10-19: v1.1.1. The operator's exact-version registry output confirms latest 1.1.1, security status clean, no warnings, and an LLM scan verdict of benign. The 4412-byte SKILL.md SHA256 matches the committed source. The website displays Pass. This status applies to that skill artifact, not API accuracy or future revisions.

A previous audit warning identified that payment authorization guidance did not explicitly require a user confirmation gate or bounded spending policy. Version 1.0.2 addresses that guidance.

Before authorizing a 0.20 USDC verification charge, an x402 wallet or client should require explicit user approval for each charge or enforce a preconfigured spending policy with appropriate per-call, session, or daily limits.

SAVER verification results are evidence signals and must not be treated as permission to bypass existing wallet, security, or execution policies.

ClawHub audit:

https://clawhub.ai/saver-si/skills/saver-verifier/security-audit

---

## Scope

Examples of security issues include:

- Unauthorized access

- Payment flow vulnerabilities

- Authentication or authorization issues

- Exposure of sensitive information

- Data handling problems

---

## Out of Scope

The following are generally not considered security vulnerabilities:

- General feature requests

- Documentation improvements

- Public API suggestions

- Expected API behavior

---

## Contact

General support and listing corrections: [GitHub Issues](https://github.com/SAVER-SI/saver-verifier/issues).

For security matters, use the minimal contact-request process above. Do not put vulnerability details, personal information or credentials in that public request.

Please do not include private keys, wallet seed phrases, API credentials, or other secrets in the initial report.



