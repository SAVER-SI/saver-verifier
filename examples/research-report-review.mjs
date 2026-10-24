import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ENDPOINT } from "./saver-contract.mjs";
import { validateResult } from "./saver-result.mjs";

// The research agent selects an exact factual passage. No extraction model or
// automatic report rewrite is hidden in this adapter.
export function planResearchReview(input) {
  if (!input || typeof input.report !== "string" || !input.report.trim() ||
      input.report.length > 1_000_000) throw Error("Invalid report.");
  if (typeof input.claim !== "string" || !input.claim.trim() || input.claim.length > 8000 ||
      !input.report.includes(input.claim)) throw Error("Claim must be an exact passage from the report, at most 8000 UTF-16 units.");
  if (input.context != null && (typeof input.context !== "string" || input.context.length > 12000))
    throw Error("Invalid context.");
  const request = { claim: input.claim };
  if (input.context != null) request.context = input.context;
  return { request, endpoint: ENDPOINT, maximumUSDC: "0.20", maximumPurchases: 1,
    scope: "one selected claim; the rest of the report is not checked" };
}

export function summarizeResearchReview(input, answer) {
  const plan = planResearchReview(input);
  const result = validateResult(answer.result);
  if (!result.evidence.length || !result.sources.length ||
      typeof result.explanation !== "string" || !result.explanation.trim())
    throw Error("Result does not contain inspectable evidence.");
  return { scope: plan.scope, claim: plan.request.claim,
    reviewStatus: result.status === "supported" ? "selected_claim_supported" : "review_required",
    result, receipt: answer.receipt ?? null,
    reportModified: false, confidenceIsCalibrated: false };
}

export async function reviewResearchClaim(input, verify, { maxUSDC } = {}) {
  const plan = planResearchReview(input);
  if (maxUSDC !== "0.20") throw Error("An explicit one-purchase budget of 0.20 USDC is required.");
  // Exactly one invocation. A transport failure may follow settlement: stop,
  // preserve recovery and never infer that another payment would be safe.
  try {
    return summarizeResearchReview(input, await verify(plan.request));
  } catch {
    return { scope: plan.scope, claim: plan.request.claim,
      reviewStatus: "unresolved", reportModified: false, automaticRepaymentAllowed: false,
      nextAction: "Inspect the saved recovery record and settlement outcome; do not sign another payment." };
  }
}

async function main(args) {
  if (args.length === 1 && args[0] === "--demo") {
    const stored = JSON.parse(fs.readFileSync(new URL("./energy-capacity-check.json", import.meta.url), "utf8"));
    const input = { report: `# Draft energy briefing\n\n${stored.request.claim}\n`, ...stored.request };
    console.log(JSON.stringify({ mode: "stored_paid_record_replay", newPayments: 0,
      operatorFundedOriginal: true, originalProvenance: stored.provenance,
      review: summarizeResearchReview(input, { result: stored.response }) }, null, 2));
    return;
  }
  const [manifest, ...options] = args;
  if (!manifest || manifest.startsWith("--")) throw Error("Supply a research manifest, or use --demo.");
  const input = JSON.parse(fs.readFileSync(manifest, "utf8"));
  const plan = planResearchReview(input);
  const take = flag => {
    const i = options.indexOf(flag);
    if (i < 0) return null;
    if (!options[i + 1] || options[i + 1].startsWith("--")) throw Error("Missing option value.");
    return options[i + 1];
  };
  if (options.includes("--recover")) {
    if (options.includes("--execute")) throw Error("Recovery and execution are separate modes.");
    const saved = JSON.parse(fs.readFileSync(take("--recover"), "utf8"));
    if (saved.endpoint !== plan.endpoint || JSON.stringify(saved.request) !== JSON.stringify(plan.request))
      throw Error("Recovery record belongs to a different request.");
    const { recoverResult } = await import("./saver-client.mjs");
    console.log(JSON.stringify({ mode: "free_recovery", review: summarizeResearchReview(input, await recoverResult(saved.token)) }, null, 2));
    return;
  }
  if (!options.includes("--execute")) {
    console.log(JSON.stringify({ mode: "dry_run", newPayments: 0, ...plan }, null, 2));
    return;
  }
  if (!options.includes("--max-usdc=0.20")) throw Error("Explicit --max-usdc=0.20 is required.");
  const recoveryFile = take("--recovery-file");
  if (!recoveryFile || fs.existsSync(recoveryFile)) throw Error("A new recovery file is required; recover prior attempts instead.");
  if (!process.env.SAVER_PRIVATE_KEY) throw Error("No authorized wallet is configured.");
  const { createSaverClient } = await import("./saver-client.mjs");
  const client = createSaverClient(process.env.SAVER_PRIVATE_KEY);
  const review = await reviewResearchClaim(input, request => client.verify(request, {
    saveRecovery: record => fs.writeFileSync(recoveryFile, JSON.stringify(record) + "\n", { flag: "wx", mode: 0o600 }),
  }), { maxUSDC: "0.20" });
  console.log(JSON.stringify({ mode: "live", review }, null, 2));
  if (review.reviewStatus === "unresolved") process.exitCode = 2;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url)
  main(process.argv.slice(2)).catch(() => {
    console.error("Research review stopped. Keep recovery records private; do not automatically authorize another payment.");
    process.exitCode = 1;
  });

