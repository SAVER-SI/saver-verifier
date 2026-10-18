import fs from "node:fs";
import { createSaverClient, recoverResult } from "./saver-client.mjs";
const file = process.env.SAVER_RECOVERY_FILE || ".saver-recovery.json";
try {
  let answer;
  if (process.argv.includes("--recover"))
    answer = await recoverResult(
      JSON.parse(fs.readFileSync(file, "utf8")).token,
    );
  else {
    if (fs.existsSync(file))
      throw Error(
        "A prior attempt exists. Use --recover; do not overwrite it or authorize another payment while its outcome is uncertain.",
      );
    if (!process.env.SAVER_PRIVATE_KEY)
      throw Error(
        "Set SAVER_PRIVATE_KEY for a funded, authorized payment wallet. Maximum charge: 0.20 USDC.",
      );
    const request = {
      claim: "The Ethereum mainnet launched on July 30, 2015.",
      context: "Independent factual verification.",
    };
    answer = await createSaverClient(process.env.SAVER_PRIVATE_KEY).verify(
      request,
      {
        saveRecovery: (data) =>
          fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", {
            flag: "wx",
            mode: 0o600,
          }),
      },
    );
  }
  console.log(JSON.stringify(answer, null, 2));
} catch (error) {
  console.error(
    "Verification failed or its outcome is uncertain. Do not automatically pay again. Use --recover with the saved recovery file.",
  );
  process.exitCode = 1;
}
