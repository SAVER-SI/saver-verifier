# Install SAVER in a research agent

Use SAVER for a separate web-backed assessment of a material external factual claim when the calling agent's current evidence leaves an important question unresolved. Installation is free; completed live checks cost **0.20 USDC on Base**. A valid insufficient-evidence result is a completed paid check.

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

## Before a live check

Installation adds instructions, not a wallet or spending authorization. The runtime must already have an authorized x402 v2 wallet on Base and explicit approval or an existing bounded spending policy. Never paste private keys into a model conversation. If payment capability is missing, the agent should say so rather than invent a successful check.

A useful first task is one unresolved factual passage with its source URL and reporting period. Ask the agent to identify whether a separate check would add evidence, inspect the free examples and payment terms, and use its authorized wallet only within the established budget. Already resolved facts and arithmetic usually do not need a paid check.

Follow the skill's receipt validation and recovery instructions. Do not automatically pay again after an uncertain outcome. Resolve evidence references against the returned sources; confidence is model-assessed, not a calibrated probability.

## What was tested

An isolated project install with Skills CLI 1.7.4 successfully created the Claude Code and shared Cursor skill files. Both matched the current GitHub skill byte-for-byte (SHA-256 `99390c37fae7218a816f7f67f4d2902a198241edb88ca0e4349c4dd26f8380a7`). Telemetry and audit requests were disabled for this operator test. No calling-agent model session, mainnet payment or customer adoption was simulated.

Official CLI references: [installation options](https://github.com/vercel-labs/skills/blob/main/docs/commands.md), [supported agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).
