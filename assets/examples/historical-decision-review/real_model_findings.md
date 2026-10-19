# Unadjusted Historical Recorded-Decision Review

Document contract: `real_model_findings.v1`  
Status: unsigned operator findings; not a certificate or signed evidence bundle.

Read these findings first for the analysis context; the accompanying PDF is a compact summary of prepared-input measurements. Retain source and numerical exclusion receipts separately: excluded source rows cannot be reconstructed from the prepared input, and package verification does not verify extraction.

## Analysis scope

- Analysis ID: hmda-ally-2024-001
- Product or process: Ally Bank 2024 conventional first-lien home purchase, one-unit site-built principal residence
- Observation period: `2024-01-01` to `2024-12-31`
- Decision stage: reported originated, approved-not-accepted or denied action
- Record unit: one published public-LAR row; not a proven unique application
- Source reference: Official public Data Browser 2024 Ally Bank LAR extract; LEI 549300C04BJ0G297NC13; all four loan types requested; retained source and retrieval SHA-256 in accompanying source-binding.json
- Cohort column: `cohort`
- Recorded decision column: `historical\_approved`
- Favorable value: `1` (reported origination or approval not accepted)
- Minimum group-size privacy floor: `30`

### Prepared-extract rules

- Deduplication: Preserve all published rows and multiplicity; no unique application identifier is available.
- Decision finality: Use reported action 1 or 2 as favorable and action 3 as unfavorable; other actions excluded.
- Missing values: Missing or nonmatching required product, action and sex codes are excluded and counted; no imputation.
- Inclusion criteria:
  - Year 2024 and LEI 549300C04BJ0G297NC13.
  - loan\_type=1; loan\_purpose=1; lien\_status=1; construction\_method=1; occupancy\_type=1; total\_units=1; reverse\_mortgage=2; open\_end\_line\_of\_credit=2; business\_or\_commercial\_purpose=2.
  - action\_taken in 1,2,3 and applicant\_sex in 1,2; all geographies.
- Exclusion criteria:
  - Every row failing a product filter is excluded in the declared order.
  - Withdrawn, incomplete, purchased, preapproval-only and other actions are excluded.
  - Applicant sex codes other than male or female, including missing codes, are excluded.

These preparation statements are supplied analysis assumptions. FL-BSA does not certify source completeness, cohort correctness, decision finality, or legal permissibility.

## Complete cohort results

| Cohort value | Display label | n | Favorable count | Observed favorable-outcome rate |
| --- | --- | ---: | ---: | ---: |
| female | Reported applicant sex: female | 796 | 705 | 0.88567839196 |
| male | Reported applicant sex: male | 1283 | 1153 | 0.898674980514 |

Overall: `1858/2079` favorable (`0.893698893699`).

## Planned comparisons

The operator declared these comparisons as planned in the supplied analysis specification. The builder records its hash but does not attest when the specification was created or reviewed.

| Comparison | Group A | Group B | A minus B | Absolute gap |
| --- | --- | --- | ---: | ---: |
| Female versus male reported favorable rate | Reported applicant sex: female | Reported applicant sex: male | -0.0129965885546 | 0.0129965885546 |

## Post-hoc observed-extrema summary

This summary is selected after observing all cohort rates. It is not a customer-designated reference comparison.

- Highest observed rate cohort(s): Reported applicant sex: male (`male`) at `0.898674980514`.
- Lowest observed rate cohort(s): Reported applicant sex: female (`female`) at `0.88567839196`.
- Largest observed favorable-outcome-rate gap: `0.0129965885546`.
- Observed minimum-to-maximum rate ratio: `0.98553805454`.

The source JSON fields `statistical_parity_difference` and `adverse_impact_ratio` encode the last two quantities. The terms above state their implementation-specific meaning.

## Limitations

These are unadjusted descriptive differences in recorded favorable-outcome rates within the supplied prepared extract. They do not establish discrimination, causation, model validity, legal non-compliance, persistence over time, or differences in a wider population.

- No risk adjustment, weighting, within-stratum comparison, or causal analysis was performed.
- No confidence interval, hypothesis test, multiplicity correction, or significance label was produced.
- The minimum group size is a privacy floor, not a statistical-power threshold.
- A composite cohort exposes supplied categories; it does not establish group comparability.
- The current findings document and source artifacts are unsigned.

## Operator-supplied investigation prompts (unvalidated text; not findings)

- Do retained source counts reproduce the declared population and exclusions?
- Would any broader interpretation require a separately specified analysis?

The builder does not determine whether this operator-supplied wording is neutral. These prompts are not causal explanations, findings of discrimination, or remediation instructions; the exact document requires human claims/legal review before any delivery.

## Reproducibility and traceability

- Software/runtime commit (operator-supplied from the same runtime): `1594e694802bf71bebd6e145dfaa7b028f760ec2`
- Offline review directory label (path-derived; not independently attested): `hmda-ally-2024-001`
- Run ID: `real-model-measurement`
- Analysis-specification SHA-256: `5dac27d7fa56aa448cc975857c86f7713074998e84a585e6c87d631c0c309502`
- Retained-input SHA-256: `5e585deedfe947fd4d6f3c580bc62c23dcf5e354cf057344b68360f133bd9aba`
- Fairness JSON SHA-256: `ba8a1182018037909fbe1975f54d97618d0cb30cd55967cd70757695d8e18dcc`
- Measurement manifest SHA-256: `ef5c173ee0c4376da3eeb145bf574b4a8b541d26a6c2131734aa6fa4a9767e13`
- Source PDF SHA-256: `b77eb4de1a8b470264a9b1f14d5c501917b22b0cbf40cbea546f9d572972ea6e`
- Source report-metadata SHA-256: `eaaa6d9e1f25d1440322d67c17643cc5d9dce393886e86ececad588cbe3cc821`
- Source PDF renderer reported truncation: `false`
- Independent row arithmetic: reconciled to the retained input and validated JSON.
