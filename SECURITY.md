\# Security Policy



\## Overview



SAVER Verifier is a machine-to-machine verification service for autonomous AI agents.



Security is important because the service handles automated interactions, payment authorization flows, and API-based integrations.



\---



\## Supported Versions



Security updates are applied to the currently deployed production version.



Older versions may not receive security fixes.



\---



\## Reporting a Security Issue



If you discover a potential security vulnerability, please report it privately.



Please do not create a public GitHub issue for security-related problems.



Include:



\- Description of the issue

\- Steps to reproduce

\- Potential impact

\- Any relevant technical details



\---



\## Responsible Disclosure



We appreciate responsible disclosure and will investigate reported issues as quickly as possible.



Please allow reasonable time for investigation and remediation before publicly discussing a vulnerability.



\---



\## Security Principles



SAVER follows these principles:



\- Payment authorization before protected processing

\- No exposure of private credentials

\- Machine-readable API contracts

\- Separation between public documentation and production implementation

\- Secure handling of service configuration



\---



\## ClawHub Skill Audit



The published SAVER Verifier skill is scanned by ClawHub security tooling.



Current release: v1.0.2. Security audit: Pass.



A previous audit warning identified that payment authorization guidance did not explicitly require a user confirmation gate or bounded spending policy. Version 1.0.2 addresses that guidance.



Before authorizing a 0.20 USDC verification charge, an x402 wallet or client should require explicit user approval for each charge or enforce a preconfigured spending policy with appropriate per-call, session, or daily limits.



SAVER verification results are evidence signals and must not be treated as permission to bypass existing wallet, security, or execution policies.



ClawHub audit:



https://clawhub.ai/saver-si/skills/saver-verifier/security-audit



\---



\## Scope



Examples of security issues include:



\- Unauthorized access

\- Payment flow vulnerabilities

\- Authentication or authorization issues

\- Exposure of sensitive information

\- Data handling problems



\---



\## Out of Scope



The following are generally not considered security vulnerabilities:



\- General feature requests

\- Documentation improvements

\- Public API suggestions

\- Expected API behavior



\---



\## Contact



For security reports, please contact the maintainers through the appropriate private communication channel.

