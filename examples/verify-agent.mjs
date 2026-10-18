async function main() {
  const SAVER_URL = "https://api.saververify.com/v2/verify";

  const request = {
    claim: "IRENA's Renewable Capacity Statistics 2024 shows that renewables generated 86% of global electricity in 2023.",
    context: "An energy-sector briefing cites https://www.irena.org/News/pressreleases/2024/Mar/Record-Growth-in-Renewables-but-Progress-Needs-to-be-Equitable . Independently check the attributed statistic against the original publication, including the year, measured quantity and denominator."
  };

  console.log("🤖 Demo AI Agent");
  console.log("----------------");
  console.log("Sending claim to SAVER:\n");
  console.log(request);

  const response = await fetch(SAVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  console.log("\nSAVER status:", response.status);

  if (response.status === 402) {
    console.log("\n💳 Payment required");
    console.log("-------------------");

    const paymentHeader = response.headers.get("payment-required");

    if (paymentHeader) {
      try {
        const decoded = JSON.parse(
          Buffer.from(paymentHeader, "base64").toString("utf8")
        );

        const payment = decoded.accepts?.[0];

        console.log("Protocol: x402");
        console.log("Network:", payment?.network || "unknown");

        console.log(
          "Amount:",
          payment?.amount
            ? `${Number(payment.amount) / 1000000} USDC`
            : "unknown"
        );

        console.log("Pay to:", payment?.payTo || "unknown");

        console.log("\nService:");
        console.log(
          decoded.resource?.description || "SAVER Verifier"
        );

      } catch (error) {
        console.log("Could not decode payment challenge.");
      }
    } else {
      console.log("No x402 payment metadata found.");
    }

    console.log("\nA compatible x402 agent can now authorize payment and retry.");
    return;
  }

  const result = await response.json();

  console.log("\n✅ Verification result:");
  console.log("----------------------");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Demo failed:");
  console.error(error.message);
});

