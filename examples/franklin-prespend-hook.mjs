import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const SAVER_URL = "https://api.saververify.com/v2/verify";
const MIN_CONFIDENCE = 0.8;
const NETWORK = "eip155:8453";

function decide(decision, reason) {
  console.log(JSON.stringify({ decision, reason }));
}

async function readHookInput() {
  let body = "";
  for await (const chunk of process.stdin) {
    body += chunk;
  }
  return JSON.parse(body);
}

function createPaidFetch() {
  const privateKey = process.env.SAVER_X402_PRIVATE_KEY;

  if (!privateKey) {
    return null;
  }

  const account = privateKeyToAccount(privateKey);

  return wrapFetchWithPaymentFromConfig(fetch, {
    schemes: [
      {
        network: NETWORK,
        client: new ExactEvmScheme(account)
      }
    ]
  });
}

async function main() {
  let input;

  try {
    input = await readHookInput();
  } catch {
    decide("deny", "SAVER PreSpend hook could not parse Franklin hook input.");
    return;
  }

  if (input.hookEventName !== "PreSpend" || !input.spend) {
    decide("allow", "Not a Franklin PreSpend event.");
    return;
  }

  const { estimatedUsd, tool, params } = input.spend;

  const claim = [
    `The proposed paid action using tool "${tool}" is supported by the available external evidence.`,
    estimatedUsd !== null
      ? `The estimated spend is approximately $${estimatedUsd} USD.`
      : "The spend amount is not known.",
    `Proposed parameters: ${JSON.stringify(params)}`
  ].join(" ");

  const fetchWithPayment = createPaidFetch();

  if (!fetchWithPayment) {
    decide(
      "deny",
      "SAVER verification requires x402 payment. Set SAVER_X402_PRIVATE_KEY for a dedicated payment wallet before enabling this hook."
    );
    return;
  }

  const response = await fetchWithPayment(SAVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      claim,
      context:
        "Franklin PreSpend verification. SAVER is an independent evidence signal and does not replace Franklin wallet, policy, or execution controls."
    })
  });

  if (!response.ok) {
    decide(
      "deny",
      `SAVER verification failed with HTTP ${response.status}.`
     );
    return;
  }

  const verification = await response.json();

  const supported =
    verification.status === "supported" &&
    typeof verification.confidence === "number" &&
    verification.confidence >= MIN_CONFIDENCE;

  if (!supported) {
    decide(
      "deny",
      `SAVER did not support the proposed spend: status=${verification.status}, confidence=${verification.confidence}`
    );
    return;
  }

  decide(
    "allow",
    `SAVER supports the proposed spend with confidence ${verification.confidence}.`
  );
}

main().catch((error) => {
  decide("deny", `SAVER PreSpend hook failed: ${error.message}`);
});

