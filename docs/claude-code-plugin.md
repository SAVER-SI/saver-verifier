# Claude Code plugin

Install the existing SAVER skill from the SAVER-managed marketplace:

```text
/plugin marketplace add SAVER-SI/saver-verifier
/plugin install saver-verifier@saver-tools
```

Invoke `/saver-verifier:saver-verifier` after installation. This packages skill version 1.1.1 as plugin version 1.0.0. It is not an Anthropic endorsement or an official directory approval.

Installation adds instructions only. It does not install a funded wallet, grant spending permission, run a verification, or send a payment. There are no startup hooks or additional hosted services. Normal model charges from your calling runtime still apply when you use it.

Read https://saververify.com/examples.json for three actual operator-funded paid examples, free of charge. Completed verifications cost 0.20 USDC on Base. Use an existing authorized x402 wallet and explicit approval or an existing bounded spending policy. Never paste wallet secrets into a model or request body. Without authorized payment capability, inspect the examples and report that payment capability is missing.

The skill pins payment terms, checks settlement and documents 24-hour result recovery. Do not automatically sign another payment after a timeout or uncertain outcome. Follow the skill and the current OpenAPI contract. Confidence is model-assessed, and a valid insufficient-evidence verdict is a paid result; inspect cited evidence before relying on it.

The optional paid reference client requires its own dependencies; the free Node.js inspector requires no dependency installation. The plugin does not install or execute either automatically. See the main README for client instructions.

Maintainers can validate packaging without starting a model session:

```sh
claude plugin validate --strict .
```

Official documentation: https://code.claude.com/docs/en/plugins/publish
