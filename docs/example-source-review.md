# Source review of the three published paid examples

This is a SAVER operator-directed source review of historical demonstrations, not an independent audit or accuracy benchmark. No new SAVER request, payment or model test was run. The original requests and responses have not been edited.

## Main conclusions

| Recorded example | Recorded verdict | Source check | What this demonstrates |
|---|---|---|---|
| Energy capacity | contradicted | IRENA's 2024 capacity publication describes 86% as the renewable share of power-capacity additions in 2023, not electricity generated. Its world capacity-share table reports 43.2% for 2023. | The returned assessment identifies a material metric/denominator error in the submitted claim. |
| EV market | supported | IEA's 2024 report distinguishes the 2023 new-car sales share of about 18% from electric-car stock of about 40 million. The figures include battery-electric and plug-in hybrid passenger cars. | The response confirms an already correct distinction; it does not demonstrate discovery of a new error. |
| Digital access | supported | ITU's 2023 publication gives Internet-use estimates of 67% globally, 93% in high-income countries and 27% in low-income countries, using World Bank income groups. | The response preserves the historical year and income-group comparison; the submitted claim was already correct. |

These are one contradicted claim and two supported claims. They are not three independently discovered mistakes, and none of the published examples demonstrates a mixed or insufficient-evidence result.

## Energy cross-check and access limits

IRENA's separate *Renewable Energy Statistics 2024* has a world renewable-electricity-production share of 29.1% for 2022; that production-share table ends in 2022. This does not substitute a 2022 figure for the 2023 claim.

Ember's historical 2024 review reports approximately 30% renewable electricity generation in 2023. Its listed component shares are consistent with the recorded answer. Our World in Data's historical note also reports just over 30%, explicitly using Ember data. Those two pages should not be counted as independent underlying datasets.

The cited IRENA press-release URL returned HTTP 403 to this review's web reader. The original IRENA capacity PDF was accessible and directly supported the central distinction. A reader-access failure is not proof that SAVER failed to consult a source during the original run. The PDF was inspected at its canonical URL without the recorded revision query; an exact historical revision comparison was not performed.

## Record and presentation checks

- The three per-example JSON records matched their corresponding entries in the site's examples.json collection.
- Every evidence sourceIds reference resolved to a source in its recorded response.
- The examples page displayed the recorded verdicts: contradicted, supported, supported.
- The current public result validator accepts all three unchanged records in offline tests.
- The records identify operator funding and caller-provided source URLs. They are not organic customer reviews.
- This pass did not independently recheck the on-chain receipts, retrieval/search traces, historical model configuration or every secondary wording choice.

## How to assess value before buying

Inspect whether the particular claim needs additional research. These examples show a useful correction of a metric error and two source confirmations, but they contain no paired baseline showing that another research agent would have missed the issue. The source URL and important scope cues were supplied in each request.

A separate cited assessment can be useful when a material claim remains unresolved. If the original source already resolves it adequately, another paid pass may add little. Confidence values are model-assessed, not calibrated probabilities, and a linked source does not guarantee correct interpretation.

These historical outputs do not establish current-model accuracy, cost per request, comparative superiority or production-wide reliability. A valid insufficient-evidence result is a completed paid assessment. See the [installation guide](agent-installation.md) and [report checkpoint](research-report-review.md) for authorization and recovery requirements.

## Primary sources

- [IRENA (2024), Renewable capacity statistics 2024](https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2024/Mar/IRENA_RE_Capacity_Statistics_2024.pdf): foreword and renewable share of electricity capacity, printed page 54 (PDF page 67). © IRENA 2024.
- [IRENA (2024), Renewable energy statistics 2024](https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2024/Jul/IRENA_Renewable_Energy_Statistics_2024.pdf): renewable share of electricity production, printed page 96 (PDF page 109). © IRENA 2024.
- [IEA (2024), Global EV Outlook 2024: Trends in electric cars](https://www.iea.org/reports/global-ev-outlook-2024/trends-in-electric-cars): opening sales paragraphs and passenger-car chart notes. CC BY 4.0.
- [ITU, Facts and Figures 2023: Internet use](https://www.itu.int/itu-d/reports/statistics/2023/10/10/ff23-internet-use/): global estimate, income-group estimates and classification note.
- [Ember, Global Electricity Review 2024: Global electricity trends](https://ember-energy.org/latest-insights/global-electricity-review-2024/global-electricity-trends/): generation overview.
- [Our World in Data, 30% of the world's electricity came from renewable sources in 2023](https://ourworldindata.org/data-insights/renewable-electricity-2023): historical May 2024 note and stated Ember provenance.

Original records: [collection](https://saververify.com/examples.json) and [readable examples](https://saververify.com/examples/).
