import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const SAVER_URL = "https://api.saververify.com/verify";
const privateKey = process.env.SAVER_PRIVATE_KEY;

if (!privateKey) {
  console.error("Missing SAVER_PRIVATE_KEY.");
  console.error("");
  console.error("PowerShell:");
  console.error('$env:SAVER_PRIVATE_KEY="0x..."');
  console.error("node examples/paid-verify.mjs");
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);

const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [
    {
      network: "eip155:8453",
      client: new ExactEvmScheme(account),
    },
  ],
});

async function main() {
  console.log("SAVER Verifier — paid x402 example");
  console.log("--------------------------------");
  console.log("Payer:", account.address);
  console.log("Network: Base Mainnet");
  console.log("Price: 0.20 USDC");
  console.log("");

  const response = await fetchWithPayment(SAVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      claim: "NASA initially reported that DART shortened Dimorphos's orbital period around Didymos by 32 minutes, and later refined that measurement to 33 minutes. These figures describe an orbital-period change, not a change in a predicted Earth-impact time.",
      context: "Checking apparently conflicting figures in a science and engineering briefing. Assess the original and revised measurements and what they measure, using primary sources.",
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    console.error(`Request failed with HTTP ${response.status}`);
    console.error(text);
    process.exit(1);
  }

  let result;

  try {
    result = JSON.parse(text);
  } catch {
    console.error("SAVER returned a non-JSON response:");
    console.error(text);
    process.exit(1);
  }

  console.log("Verification complete");
  console.log("---------------------");
  console.log("Status:", result.status);
  console.log("Confidence:", result.confidence);
  console.log("Explanation:", result.explanation);

  console.log("");
  console.log("Evidence:");
  for (const item of result.evidence ?? []) {
    console.log("-", item);
  }

  console.log("");
  console.log("Sources:");
  for (const source of result.sources ?? []) {
    console.log(`- ${source.title}: ${source.url}`);
  }

  const paymentResponse = response.headers.get("payment-response");

  if (paymentResponse) {
    console.log("");
    console.log("x402 payment settled.");
  }
}

main().catch((error) => {
  console.error("Paid verification failed:");
  console.error(error?.message ?? error);
  process.exit(1);
});

