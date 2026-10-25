# Claude Code plugin

Install the existing SAVER skill from the SAVER-managed marketplace:

```text
/plugin marketplace add SAVER-SI/saver-verifier
/plugin install saver-verifier@saver-tools
```

Invoke `/saver-verifier:saver-verifier` after installation. Plugin version 1.0.1 is a separate Claude distribution pinned to an exact source commit. The general Skills CLI/ClawHub skill remains 1.1.1 and is not changed by this release. It is not an Anthropic endorsement or an official directory approval.

Installation adds instructions only. It does not install a funded wallet, grant spending permission, run a verification, or send a payment. There are no startup hooks or additional hosted services. Normal model charges from your calling runtime still apply when you use it.

Read https://saververify.com/examples.json for three actual operator-funded paid examples, free of charge. Completed verifications cost 0.20 USDC on Base. Use an existing authorized x402 wallet. Before every charge, display the exact claim, 0.20 USDC on Base and full recipient 0xdfd6cb683F5288e1dD1337E84C09b490857CC110, disclose that insufficient evidence is also a paid result, and wait for a separate explicit yes. A standing spending cap only bounds the amount; it does not replace confirmation. Never paste wallet secrets into a model or request body. Without authorized payment capability, inspect the examples and report that payment capability is missing.

The skill pins payment terms, checks settlement and documents 24-hour result recovery. Do not automatically sign another payment after a timeout or uncertain outcome. Follow the skill and the current OpenAPI contract. Confidence is model-assessed, and a valid insufficient-evidence verdict is a paid result; inspect cited evidence before relying on it.

The optional paid reference client requires its own dependencies; the free Node.js inspector requires no dependency installation. The plugin does not install or execute either automatically. See the main README for client instructions.

Maintainers can validate packaging without starting a model session:

```sh
claude plugin validate .
```

Official documentation: https://code.claude.com/docs/en/plugins/publish

## Upgrade and pinned source

Update the saver-tools marketplace and the installed saver-verifier plugin to 1.0.1. The install commands above are unchanged. Version 1.0.0 cached installations do not gain the new rule until updated. The marketplace fetches the plugin from commit `4cf419630f07ce3e5b9b89b15c9e4f33683914de`; later pushes to main or the release branch cannot alter this pinned package. The root of main now distributes the marketplace; the actual Claude plugin lives in the pinned release snapshot. Review that exact source before installing.

The plugin's confirmation rule applies even if linked general API/client documentation permits autonomous execution under a spending policy. It is an instruction policy, not a new server-side payment gate. No startup hook or payment is added. No new live payment was used to test this release.
