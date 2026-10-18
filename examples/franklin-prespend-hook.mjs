import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { createSaverClient } from "./saver-client.mjs";
export async function evaluateHook(input, verify) {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    typeof input.hookEventName !== "string"
  )
    return { decision: "deny", reason: "Invalid hook envelope." };
  if (input.hookEventName !== "PreSpend")
    return { decision: "allow", reason: "Not a PreSpend event." };
  const spend = input.spend,
    fact = spend?.verification;
  if (
    !spend ||
    typeof spend !== "object" ||
    Array.isArray(spend) ||
    typeof spend.tool !== "string" ||
    !spend.tool.trim() ||
    !fact ||
    typeof fact.claim !== "string" ||
    !fact.claim.trim() ||
    fact.claim.length > 8000 ||
    (fact.context !== undefined &&
      (typeof fact.context !== "string" || fact.context.length > 12000))
  )
    return {
      decision: "deny",
      reason:
        "PreSpend requires a tool and an explicit factual spend.verification.claim.",
    };
  try {
    const { result } = await verify({
      claim: fact.claim,
      ...(fact.context === undefined ? {} : { context: fact.context }),
    });
    const supported =
      result.status === "supported" &&
      Array.isArray(result.evidence) &&
      result.evidence.some(
        (e) => e.relation === "supports" && e.sourceIds?.length,
      );
    return supported
      ? {
          decision: "allow",
          reason:
            "The factual evidence gate passed. Existing wallet, budget and execution controls still apply.",
        }
      : {
          decision: "deny",
          reason: "The factual claim was not supported by linked evidence.",
        };
  } catch {
    return {
      decision: "deny",
      reason:
        "Verification failed or its outcome is uncertain. Do not automatically authorize another payment.",
    };
  }
}
async function main() {
  let body = "";
  try {
    for await (const chunk of process.stdin) {
      body += chunk;
      if (Buffer.byteLength(body) > 128 * 1024) throw Error("Input too large");
    }
    const input = JSON.parse(body);
    console.log(
      JSON.stringify(
        await evaluateHook(input, async (request) => {
          const key = process.env.SAVER_X402_PRIVATE_KEY;
          if (!key) throw Error("Missing payment wallet");
          return createSaverClient(key).verify(request, {
            saveRecovery: (data) => {
              const directory =
                process.env.SAVER_HOOK_RECOVERY_DIR || ".saver-hook-recovery";
              fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
              const name =
                createHash("sha256").update(data.token).digest("hex") + ".json";
              fs.writeFileSync(
                path.join(directory, name),
                JSON.stringify(data) + "\n",
                { flag: "wx", mode: 0o600 },
              );
            },
          });
        }),
      ),
    );
  } catch {
    console.log(
      JSON.stringify({
        decision: "deny",
        reason: "Invalid or oversized hook input.",
      }),
    );
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main();
