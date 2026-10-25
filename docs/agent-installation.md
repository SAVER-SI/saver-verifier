# Install SAVER in a research agent

Use SAVER for a separate web-backed assessment of a material external factual claim when the calling agent's current evidence leaves an important question unresolved. Installation is free; completed live checks cost **0.20 USDC on Base**. A valid insufficient-evidence result is a completed paid check.

## Start here: check payment capability

Choose the path that matches your runtime:

| Runtime state | Next step |
|---|---|
| Existing authorized x402 v2 wallet with Base USDC | Install the skill/plugin, inspect terms, then request one selected claim check. |
| Coinbase Wallet MCP already connected | Use the [wallet request recipe](coinbase-wallet-mcp.md); wallet approval is also required. |
| No wallet or wallet authentication incomplete | Inspect stored examples and the unsigned challenge. Stop before payment and report missing capability. Installation alone cannot fix it. |

Do not create a wallet, install a financial connector, request wallet secrets or transfer funds as part of a verification without the owner's separate authorization. A generic USDC transfer is not an x402 request payment.

## Claude Code: plugin

```text
/plugin marketplace add https://github.com/SAVER-SI/saver-verifier.git
/plugin install saver-verifier@saver-tools
```

Invoke `/saver-verifier:saver-verifier`. See the [plugin guide](claude-code-plugin.md). This is SAVER's own marketplace, not an Anthropic directory listing or endorsement.

## Claude Code or Cursor: Skills CLI

With Node.js 22.20+ installed, run from the project where you want the skill available. These commands use the tested CLI version and install project-local files:

```sh
# Claude Code
npx --yes skills@1.7.4 add SAVER-SI/saver-verifier --skill saver-verifier --agent claude-code --copy --yes

# Cursor
npx --yes skills@1.7.4 add SAVER-SI/saver-verifier --skill saver-verifier --agent cursor --copy --yes
```

These are separate distributions: Claude plugin 1.0.1 requires a separate explicit yes after displaying price and recipient before every charge. The Skills CLI installs the unchanged general agent skill, whose policy can permit an existing bounded spending authorization. Installing both does not relax the Claude plugin's confirmation rule. Review the [skill instructions](../skills/saver-verifier/SKILL.md) before installation. In an existing project, check for a previously installed copy before replacing it. CLI privacy and telemetry options are documented [upstream](https://github.com/vercel-labs/skills/blob/main/docs/troubleshooting.md).

The CLI also supports other agents, but the installation check recorded here targets Claude Code and Cursor only. It does not prove tool selection, wallet availability or paid execution in either runtime. Being installable does not imply a Skills.sh ranking or vendor endorsement.

## See useful output before buying

From a checkout of this repository, with Node.js 18+:

```sh
node examples/research-report-review.mjs --demo
```

No package installation, network request, wallet or model call is needed. This replays an actual operator-funded stored assessment of a draft that confused renewable capacity with electricity generation. It is a demonstration, not a new verification, customer review or independent accuracy benchmark. The remaining report is unchecked.

Read the [report checkpoint guide](research-report-review.md) for your own selected passage and local Markdown export.

## Already have a Coinbase wallet connected?

Use the [Coinbase Wallet MCP request recipe](coinbase-wallet-mcp.md): POST body mapping, a 0.20-USDC cap, owner approval and recovery. It uses an existing connection; it does not install a wallet or require pasting a private key. This is a documented integration path, not a completed live Wallet MCP test.

## Before a live check

Installation adds instructions, not a wallet or spending authorization. The runtime must already have an authorized x402 v2 wallet on Base. For the Claude plugin, ask for a separate explicit yes before **every** charge; an existing budget never replaces that yes. The general agent skill may use an existing bounded spending policy where its instructions permit it. Never paste private keys into a model conversation. If payment capability is missing, the agent should say so rather than invent a successful check.

### First run in Claude: no payment

After installation, send:

> /saver-verifier:saver-verifier Inspect the public contract and send one unsigned POST to /v2/verify with claim "The Earth orbits the Sun." Validate the 402 challenge: 0.20 USDC, Base Mainnet and the expected recipient. Do not sign, pay, read local secrets or change files. Report whether an already connected payment tool is available, using tool metadata only. Do not configure a wallet.

A successful preflight reports HTTP 402 and validated payment terms. It is not a completed verification. A usage-limit or authentication error is not proof that the plugin or API failed.

### First paid check

Choose one material unresolved claim, with a source URL and reporting period where relevant. In Claude, request the assessment and ask it to show the exact claim, price, network and full recipient before asking for your explicit yes. If the wallet is missing, the correct outcome is a clear capability error with zero payments.

A useful first task is one unresolved factual passage with its source URL and reporting period. Ask the agent to identify whether a separate check would add evidence, inspect the free examples and payment terms, and use its authorized wallet only under the applicable confirmation and spending rules. Already resolved facts and arithmetic usually do not need a paid check.

Follow the skill's receipt validation and recovery instructions. Do not automatically pay again after an uncertain outcome. Resolve evidence references against the returned sources; confidence is model-assessed, not a calibrated probability.

## What was tested

An isolated project install with Skills CLI 1.7.4 successfully created the Claude Code and shared Cursor skill files. Both matched the current GitHub skill byte-for-byte (SHA-256 `99390c37fae7218a816f7f67f4d2902a198241edb88ca0e4349c4dd26f8380a7`). Telemetry and audit requests were disabled for this operator test. No calling-agent model session, mainnet payment or customer adoption was simulated.

Official CLI references: [installation options](https://github.com/vercel-labs/skills/blob/main/docs/commands.md), [supported agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).

## Directory candidate versus installed version

The official Anthropic directory candidate was submitted for review on 25 October 2026: plugin 1.0.2 at commit `33c25f1784a1de2cb8ab956a38d789cdd36677b5`. Approval/publication is not confirmed. The install commands above still select the existing marketplace's pinned 1.0.1; do not claim that an existing installation automatically received 1.0.2.
