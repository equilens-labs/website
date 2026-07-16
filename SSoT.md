Fair-Lending Bias-Simulation Appliance — Single Source of Truth (SSOT)

Last updated: 2026-06-12

Scope. This document is the product-level single source of truth for FL-BSA.
It covers: architecture, capabilities, regulatory positioning, performance targets, and the commercial model.
Implementation-level details (code, CI, infra) live in the repo and ops docs and are not duplicated here.
Release-evidence mechanics and historical release decisions are maintained outside this product
truth document.

One-sentence summary.
FL-BSA is a self-hosted fair-outcomes evidence appliance for regulated credit decisions – a safety-through-simulation system whose default path generates synthetic borrowers, measures bias in synthetic decision patterns, and emits tamper-evident evidence packs without touching live decisions; a draft real-model measurement mode (§1.5) is governance-gated separately.

⸻

1. Product Definition

1.1 Form factor
	•	FL-BSA is a multi-container appliance deployed inside the customer’s environment (own VPC / VM / on-prem).
	•	It exposes:
	•	An API service for orchestration and integration.
	•	A batch worker / job runner for training and audits.
	•	Orchestration: currently via docker-compose (or equivalent vendor packaging); Kubernetes is a future option but out of scope here.

1.2 Deployment model
	•	Hosting: Customer-hosted only (no vendor-managed SaaS).
	•	Network boundary: All data processing happens inside the customer’s perimeter. FL-BSA does not exfiltrate model parameters, raw data, or SCPD to vendor-controlled services.
	•	Data sources:
	•	Historical application + performance data (features, decisions, outcomes).
	•	SCPD / demographic labels where available and lawfully collected.
	•	Outputs:
	•	Synthetic borrower portfolios (tabular).
	•	Metrics manifests and compliance indicators.
	•	PDF reports for governance review.
	•	Evidence bundles (certificates, manifests, logs).

1.3 Core value proposition

FL-BSA is a customer-hosted evidence appliance for credit-risk, fair-outcomes, and AI-governance teams.
	•	Safety-through-simulation only
	•	FL-BSA never makes, overrides, or batch-scores live lending decisions.
	•	The default simulation path generates synthetic "what-if" portfolios and measures bias in those
		synthetic decisions.
	•	Simulation-path outputs are simulation artefacts, not production records.
	•	The separate `measure_real_model` draft evidence class in section 1.5 is the only current
		carve-out: it emits unsigned aggregate measurement artifacts over a customer-authored decision
		or score column, and those artifacts are not synthetic borrower portfolios or production lending
		records.
	•	Dual-branch view of bias
	•	Amplification branch (“status-quo”):
	•	Generates synthetic borrowers that preserve protected-group proportions and historical bias signals for fair-lending simulation.
	•	Distribution and correlation utility diagnostics are emitted for reviewer context; they are not a guarantee that the whole borrower portfolio distribution is mirrored.
	•	Shows how the current stack behaves given the actual history, policies, and decision flows the customer has created.
	•	Intrinsic branch ("counterfactual baseline"):
	•	Trains the configured generator without the loan decision column, then applies fair decision rules via post-labeling to produce synthetic borrowers with equitable outcomes.
	•	Approximates a "fairer baseline" where structural penalties are removed.
	•	The gap between branches is the primary audit object: amplification vs intrinsic bias.
	•	v5.0.0 generator posture:
	•	The selected v5 generator cut target is native/no-CTGAN using the first-party evidence-native
		backend with a no-DataCebo dependency posture, subject to the final native release-candidate
		contract and release-owner disposition for the selected SHA.
	•	The earlier `v5.0.0-rc9` CTGAN-backed proof remains historical technical evidence and a
		comparator baseline; it is not the selected v5 default-generator path.
	•	Legacy CTGAN/RDT remains an explicitly gated compatibility/comparator path only. Any commercial
		or customer use of that path still requires the CTGAN/RDT legal authorization controls.
	•	Full differential privacy is post-v5 scope. The v5 native posture is no-CTGAN/no-DataCebo with
		privacy characterization and export/profile walls, not a formal DP claim.
	•	Evidence, not opinions
	•	Every simulation-path run produces a tamper-evident evidence pack (the §1.5 measurement carve-out emits unsigned artifacts instead):
	•	Metrics and manifests.
	•	Hashes and certificates.
	•	PDF reports and supporting logs.
	•	The pack is designed to be consumed by risk, compliance, model governance, internal audit, and customer-authorized external reviewers.
	•	BYOC commercial model
	•	Customers run FL-BSA in their own cloud/on-prem environment and pay their own compute, including GPUs.
	•	FL-BSA is licensed as an appliance (software) that converts data and models into auditable evidence.

1.4 Simulation vs Reporting Strategy

FL-BSA is deliberately scoped to the customer’s Simulation Strategy, not its Reporting Strategy.
	•	Simulation Strategy (FL-BSA domain)
	•	Generate synthetic portfolios and estimate group-level fairness outcomes via synthetic simulation.
	•	Explore Less Discriminatory Alternatives (LDAs), overlays, and “counterfactual reject” scenarios.
	•	Quantify intrinsic vs amplification effects.
	•	Produce evidence that can support regulatory engagement.
	•	Reporting Strategy (customer domain, out of scope for FL-BSA)
	•	How production decisions are explained to customers and regulators (e.g. ECOA adverse-action notices, Consumer Duty statements).
	•	How self-testing results feed into governance, remediation, and official disclosures.

This separation is enforced by:
	•	The no-raw-data-leaves stance: real borrower data and SCPD stay inside the customer's environment.
	•	A synthetic-only export boundary for simulation-path exports: synthetic CSV, Parquet, JSON, and
		PDF artefacts that leave the appliance are explicitly simulation outputs and must not be treated
		as “historical truth”.
	•	A separate unsigned measurement boundary for `measure_real_model`: dedicated real-model
		artifacts are not synthetic exports and are never production records; they are not signed external
		evidence unless a later release record, with the required claims and release approvals, explicitly
		promotes that evidence class.

1.5 Real-model measurement evidence class (draft / governance-gated)

A separate `measure_real_model` evidence class is in pre-production draft. It lets a customer run
FL-BSA inside the customer-controlled environment against a prepared dataset containing protected
attributes plus a customer-authored decision or probability-score column.
	•	FL-BSA measures aggregate fairness metrics over the supplied customer-authored output.
	•	FL-BSA does not call the customer model, execute a scorecard, connect to production decision
		services, make lending decisions, or override lending decisions.
	•	The mode emits dedicated real-model measurement artifacts, not synthetic-pipeline artifacts.
	•	The mode may expose unsigned measurement outputs and, when approved, a dedicated unsigned
		measurement report. Certificates and evidence-bundle signing are not part of this draft evidence
		class unless separately promoted.
	•	Current emitted artifacts are unsigned (`signed: false`) and are not certificates, conformity
		assessment evidence, regulator approval, legal advice, or production release approval.
	•	Artifacts may include provenance bindings to the submitted source file. Those bindings support
		artifact integrity, but they are not production records or row-level semantic certification.
	•	Customer-facing handoff, customer-pack inclusion, customer-facing production use, or any external
		claim that this real-model measurement evidence class is release-grade requires explicit
		release/claims/SSoT-owner approval, and any required legal/customer-handoff approval, in the
		relevant release record.

This draft evidence class does not change the current product posture for shipped release evidence:
the released appliance remains safety-through-simulation unless a later release record explicitly
promotes real-model measurement with the required claims and release approvals.

1.6 Out of scope

FL-BSA is not:
	•	A live credit decision engine or LOS replacement.
	•	A data warehouse, MDM system, or reporting platform.
	•	A generic AI-governance dashboard; it is specialised for fair-lending bias simulation.

⸻

2. Core Capabilities & Architecture

2.1 Dual-branch bias simulation

Concept.
	•	FL-BSA maintains two conceptually independent branches:
	•	Amplification branch (Branch A)
	•	Trains generative models on features plus historical decisions/outcomes, preserving observed patterns in approvals/denials and performance.
	•	Represents “what your current stack is doing today”, including any inherited bias.
	•	Intrinsic branch (Branch B)
	•	Trains the configured generator without the loan decision column (loan_approved excluded from training).
	•	Post-labels synthetic records with fair decisions via `flbsa.synthetic.fair_decisions`.
	•	Represents an approximate "fair baseline" where structural penalties are removed as far as practicable.
	•	A comparison module computes branch-to-branch deltas on:
	•	Approval / decline rates.
	•	Pricing / terms if present.
	•	Standard fairness metrics (e.g. adverse impact ratio).

Narrative mapping.
	•	Amplification branch answers:
“Are we amplifying the unfairness already present in our history and policies?”
	•	Intrinsic branch answers:
“Would this model still discriminate if history were fairer and protected characteristics carried no structural penalty?”
	•	The difference between branches is how FL-BSA explains bias to non-technical stakeholders.

2.2 Synthetic data generation
	•	FL-BSA uses a tabular generator contract to produce synthetic borrower portfolios with:
	•	Mixed continuous/categorical features.
	•	Application-time features.
	•	Decisions and outcomes (for amplified branch).
	•	Protected attributes (where lawfully available) for fairness analysis.
	•	High-level properties:
	•	Supports multiple protected attributes (e.g. gender, race/ethnicity) and combinations.
	•	Handles class imbalance (e.g. minority groups, rare outcomes) via appropriate sampling and training configuration.
	•	Ensures synthetic data stays within plausible ranges and business constraints (e.g. income, loan-amount ratios).
	•	For the selected v5 cut target, the intended default simulation backend is the first-party
		evidence-native generator under a no-DataCebo dependency posture once the final native
		release-candidate contract and release-owner disposition pass for the selected SHA. Legacy
		CTGAN remains a gated comparator/compatibility backend, not the selected v5 default.
	•	Optional post-processing hooks (copula repair, band clamping, windowed Spearman boost) can
		restore feature correlations that tabular generation may under-learn. See
		`docs/architecture/realism-gates.md`.
	•	Synthetic data is never linked back to identifiable individuals and is designed so that no single synthetic record can be trivially re-identified as a real borrower.

2.3 Bias auditing & adverse-action support
	•	Metric layers:
	•	Mathematical layer: foundational metrics (disparate impact ratio, statistical parity difference, TPR/FPR parity, etc.).
	•	Regulatory layers: mapping to:
	•	ECOA/Reg B and CFPB frameworks.
	•	EU AI Act data-governance requirements (Article 10, Article 13).
	•	UK FCA Consumer Duty / SDEG-relevant metrics.
	•	Adverse-action-style analysis:
	•	Current adverse-action output is fixed-template scaffold material for reviewed workflows. It is not a per-row, data-derived, or model-attribution engine.
	•	These artifacts may help structure customer legal/compliance review, but they are not Reg B adverse-action notices and must not be used as legally final customer communications without customer-owned attribution, policy, and legal review.

2.4 Certificates & evidence packs

FL-BSA treats each simulation-path audit run as producing a cryptographically anchored evidence pack. At a minimum, packs include:
	•	Metrics manifest (metrics.json or equivalent).
	•	Synthetic data manifests and hashes.
	•	Configuration snapshot (models, hyperparameters, seed).
	•	One or more certificates, including:
	•	Data validation and lineage certificates.
	•	Training and convergence certificates.
	•	Hyperparameter tuning certificates.
	•	Synthetic data quality certificates.
	•	End-to-end pipeline certificates.
	•	Compliance assessment summaries per framework.
	•	Human-readable report (PDF) per scenario.

Certificates reference each other and key artefacts via hashes so that tampering is detectable.

Human-readable report renderer boundary.
	•	Active customer-facing and release evidence PDFs render through the offline Typst report
		renderer and carry report metadata naming that engine.
	•	Legacy LaTeX templates, metadata normalization, and archive fixtures are compatibility
		surfaces only. They are not a release fallback and must not be used to claim current customer
		report generation.

Certificate acceptance boundary for release evidence.
	•	`valid_with_limitations` is not equivalent to an unqualified release-grade pass.
	•	Release-grade/customer evidence must say whether accepted certificates are unqualified
		release evidence or limited verification evidence accepted under an explicit release-owner
		disposition.
	•	Hyperparameter tuning certificates must keep completed-search, truncated-search, cache,
		default, and default-after-rejected-trials claim scopes machine-readable so downstream
		reports cannot collapse them into a single success status.
	•	Compliance statuses emitted to reports and certificates use the canonical vocabulary:
		`PASS`, `WARN`, `DEGRADED`, `FAIL`, and `UNKNOWN`.
	•	The detailed gate contract lives in
		`docs/development/quality-gates.md#certificate-acceptance-boundary`.

Trust-root boundary for externally visible evidence.
	•	Release-grade, customer-facing, or externally reviewed evidence must bind both:
	•	`FLBSA_VENDOR_TRUST_ROOT_URL`, an HTTPS URL for the vendor trust-root document.
	•	`FLBSA_VENDOR_TRUST_ROOT_SHA256`, the SHA-256 digest expected for that document.
	•	Evidence workflows that mint or reuse release-grade artifacts fail closed when either value is absent or malformed.
	•	Bundled certificate keys are implementation convenience material, not the external authorship trust anchor.
	•	Vendor-authored evidence additionally requires
		`evidence_authorship.vendor_authorship_claimed=true` and signer fingerprints published in
		the pinned vendor trust root. Only that mode is expected to pass strict
		`--pubkey trust-root.json --require-signatures --require-manifest-signature` verification.
	•	Direct-AMI/customer-local evidence with `vendor_authorship_claimed=false` is self-attested:
		trust-root URL/SHA metadata proves the handoff is bound to the expected governance document,
		and bundled keys prove bundle consistency, but neither proves vendor authorship.
	•	The current trust-root URL/SHA values, rotation process, and verifier commands live in `docs/crypto/trust-root-governance.md` and `docs/crypto/evidence-verification-guide.md`.

2.5 Simulation–reporting firewall

To maintain the Simulation vs Reporting split:
	•	FL-BSA:
	•	Does not connect to production decision services for live scoring.
	•	Is integrated with source systems in a read-only fashion (for ingest) and as a write-only archive for evidence.
	•	All exported simulation-path datasets and reports are:
	•	Clearly labelled as synthetic or simulated, and
	•	Intended for risk/compliance analysis, not for MIS, finance, or statutory reporting pipelines.

2.6 Interfaces (API / CLI)
	•	API.
	•	Endpoints to:
	•	Create and configure pipelines.
	•	Trigger runs (by data snapshot / scenario).
	•	Retrieve metrics, manifests, certificates, and reports.
	•	CLI / automation.
	•	For CI/CD and batch integration (e.g. nightly audits, pre-deployment checks on new models).

⸻

3. Regulatory Positioning (Conceptual)

This section captures design intent and positioning. It is not legal advice and does not replace the customer’s own counsel.

3.1 United States – ECOA / Reg B / CFPB
	•	FL-BSA is designed to support disparate-impact and disparate-treatment analysis under ECOA/Reg B, by:
	•	Generating synthetic borrower populations with protected attributes.
	•	Approximating customer decision patterns via synthetic generation to estimate group-level outcomes.
	•	Quantifying metrics such as adverse impact ratio and TPR/FPR disparities.
	•	Argus-style risk mitigation:
	•	The appliance is never used to fabricate or backfill “historical” performance data.
	•	Synthetic borrowers are explicitly marked as synthetic and are only used for simulation, not for production reporting.
	•	Self-testing and LDAs:
	•	FL-BSA helps customers search for and quantify Less Discriminatory Alternatives (LDAs) by simulating alternative policies and models.
	•	The customer retains responsibility for:
	•	Deciding which LDAs to adopt.
	•	Managing any discovery/comms implications of self-testing records.

3.2 European Union – EU AI Act, Data Governance
	•	FL-BSA is designed to be used in a way that aligns with EU AI Act obligations for high-risk systems (e.g. credit scoring) by:
	•	Supporting workflows where:
	•	Real SCPD is used for training synthetic generators within the customer’s safe environment when strictly necessary.
	•	Downstream bias analysis is performed on synthetic data.
	•	Only synthetic and aggregate artefacts leave the environment.
	•	Providing:
	•	Dataset-quality metrics aligned with Article 10(3) (distribution coverage, representativeness).
	•	Documentation hooks for transparency and data-governance sections (Article 13).
	•	FL-BSA does not itself decide which legal basis or derogations (e.g. strict necessity under Article 10(5)) the customer relies on; it only provides technical capabilities consistent with those strategies.

3.3 United Kingdom – FCA, Consumer Duty, SDEG
	•	FL-BSA supports regulated UK credit providers and credit-infrastructure firms in analysing:
	•	Outcome disparities under Consumer Duty (e.g. acceptance, pricing, default treatment).
	•	“Exclusion harm” by simulating counterfactual reject scenarios:
	•	What would have happened if certain historically rejected applicants had been approved?
	•	The appliance’s outputs can feed into:
	•	Internal risk and governance reports.
	•	Evidence packs used when engaging with FCA or PRA on model fairness and consumer outcomes.

⸻

4. Data, Metrics & Manifests

4.1 Input data expectations
	•	Core inputs:
	•	Historical application & performance data (tabular).
	•	Optional: additional context columns may be present in uploaded snapshots, but the reference pipeline operates on the canonical schema columns only (FL‑BSA does not execute scorecards).
	•	Optional: external data sources the customer uses (bureau, open banking features, etc.).
	•	Protected attributes / SCPD:
	•	Where lawfully collected and accessible, these are used for:
	•	Training synthetic generators (if permitted).
	•	Annotating synthetic portfolios.
	•	Computing group-based metrics.
	•	Data contracts:
	•	FL-BSA expects a stable schema and contract for:
	•	Feature columns.
	•	Decision columns (approve/deny, limits).
	•	Outcome columns (default, cure).
	•	Protected attributes.

4.2 Synthetic-data quality metrics

FL-BSA computes synthetic-data quality metrics along three conceptual axes:
	•	Fidelity. How closely synthetic approximates real data distributions.
	•	E.g. JS/KL divergences on key marginals and group-conditioned views.
	•	Privacy. How far synthetic records are from any observed real record.
	•	E.g. nearest-neighbour distance statistics.
	•	Utility. How useful synthetic data is for modelling.
	•	E.g. train-on-synthetic / test-on-real performance comparisons (with customer-controlled evaluation).

Current versions surface these metrics in manifests and reports so that customers can form their own acceptance criteria. These synthetic-quality metrics are treated as observable evidence signals unless operators choose stricter policies.

4.3 Fairness metrics
	•	FL-BSA supports a configurable set of fairness metrics, including but not limited to:
	•	Adverse impact ratio (AIR) and selection‑rate gap (SRG) for approval‑rate comparisons.
	•	Statistical parity difference.
	•	Label‑based parity metrics (equal opportunity / odds, TPR/FPR parity) when ground‑truth error rates are in scope for the run.
	•	Metrics are computed:
	•	Per protected group.
	•	Per branch (Amplification vs Intrinsic).
	•	Per scenario (e.g. threshold shifts, counterfactual rejects).

Group and intersectional fairness signals require explicit support evidence before FL-BSA treats
them as reviewable screening signals. Missing support scope is not claimed; below-minimum group
count is not calculable under the configured support policy; and measured but below-percentage
support is disclosed as a support caveat rather than treated as an unqualified finding. These
support rules protect the validity of fairness claims. They are separate from differential privacy,
which remains a future post-v5 feature until formal DP mechanisms, accounting, and certificates are
implemented; native support evidence is not a formal DP claim.

4.4 Metrics manifest (metrics.json)
	•	Each simulation-path run produces a canonical metrics manifest containing:
	•	Run metadata (ID, timestamps, RNG seed, software version, `dataset_hash`).
	•	`dataset_hash` is the compatibility name for the SHA-256 digest of the
		canonicalized input CSV surface (`canonical_input_sha256`), not necessarily the
		raw upload-file byte hash. When upload metadata is present, raw and persisted byte
		hashes are recorded separately in dataset-lineage evidence.
	•	Data summary (row/feature counts, list of protected attributes).
	•	Dataset-quality metrics (representativeness/coverage) when available.
	•	Synthetic-data quality metrics.
	•	Fairness metrics and compliance indicators.
	•	This manifest is treated as part of the technical SSOT for that run and is referenced by certificates.
	•	Internal release validation separately checks the manifest schema and selected launch-readiness surfaces (e.g., dataset-quality thresholds and required realism/provenance fields).

⸻

5. Evidence & Chain-of-Custody

5.1 Evidence pack contents

Each simulation-path run's evidence pack typically includes:
	•	Metrics manifest(s).
	•	Synthetic data manifest(s) and hashes.
	•	Configuration snapshot (YAML/JSON).
	•	Log excerpts relevant to the run.
	•	Certificates (see below).
	•	Rendered reports (PDFs).
	•	Optional service logs or performance traces.

5.2 Certificates and hash chains
	•	FL-BSA uses cryptographic hashes to tie artefacts together:
	•	The DataLineageCertificate includes observed hashes across the raw upload,
		persisted/canonicalized input surface, synthetic output, and model parameters when those
		surfaces are available.
	•	Other certificates (training, tuning, validation) focus on stage-specific metadata.
	•	Certificates link sequentially via `previous_certificate_hash` within each pipeline run, allowing auditors to:
	•	Verify that a given metrics file and report correspond to a particular data snapshot and configuration.
	•	Detect tampering (changed files will no longer match hashes).

5.3 Single source of technical truth

For any given run:
	•	The metrics manifest + certificate chain are the technical SSOT:
	•	Everything else (reports, dashboards) is a view on those artefacts.
	•	This product-level SSOT document (you’re reading it) is about:
	•	What those artefacts mean.
	•	How they are expected to be produced and consumed.

⸻

6. Performance Targets

Targets, not guarantees. Actual performance depends on hardware, data complexity, and configuration.

6.1 Pipeline runtimes

Reference targets on a typical modern CPU (for indicative sizing):
	•	~10k rows:
	•	Full pipeline (ingest → generator training → dual-branch analysis → report) is typically in the ~20–25 minute range on a reference CPU.
	•	~100k rows:
	•	Generator training ≤ ~45 minutes on the same reference CPU, with reduced epochs for CI/PR smoke tests.
	•	Larger datasets (e.g. 1M+ rows):
	•	Treated as long-running, capacity-planning scenarios, currently outside CI baselines but supported when appropriate hardware is provisioned.

GPU acceleration can reduce training times substantially but is not assumed as baseline in this document.

6.2 Baselines & validation
	•	CI maintains CPU baselines derived from synthetic test suites.
	•	GPU benchmarks are collected periodically and used for sizing guidance, not for CI gates.
	•	Performance regression checks:
	•	Lightweight checks run in CI.
	•	Full benchmarks may be run manually or on a nightly schedule.

⸻

7. Deployment & Integration

7.1 Environments
	•	FL-BSA is designed to run in:
	•	Customer-controlled cloud accounts (e.g. AWS VPC).
	•	On-prem virtualised environments.
	•	Typical topology:
	•	Application and worker containers on app nodes.
	•	Optional database for configuration / metadata.
	•	Access to the customer’s data warehouse / lake via secure network paths.

7.2 Data ingress
	•	Ingest options:
	•	Pull from data warehouse / lake (e.g. SQL, object store).
	•	Receive prepared snapshots (CSV/Parquet) dropped into a landing bucket.
	•	Data movement is under the customer’s control; FL-BSA does not open outbound tunnels to vendor services except for optional AWS Marketplace usage metering (gated by `FLBSA_ALLOW_MARKETPLACE_METERING=1`).

7.3 Data egress
	•	Artefacts produced:
	•	Stored in customer-controlled storage (e.g. object buckets, file shares).
	•	Accessed via:
	•	API (download endpoints).
	•	Direct retrieval from configured storage.

⸻

8. Security & Privacy Posture

8.1 Data residency & ownership
	•	All customer data (real and synthetic) remains in customer-controlled environments.
	•	Vendor does not have direct access to production data or SCPD; any support requiring access is explicitly agreed and sandboxed.

8.2 SCPD handling
	•	FL-BSA assumes SCPD is:
	•	Collected lawfully by the customer.
	•	Made available for fairness analysis where regulations and internal policies permit.
	•	FL-BSA:
	•	Uses SCPD to annotate records and compute group-based metrics.
	•	Does not store SCPD outside the customer’s environment.
	•	Does not send SCPD to external services.

8.3 Identity & access control
	•	Authentication and authorisation are delegated to customer infrastructure where possible (SSO, IdP).
	•	Within FL-BSA, roles typically include:
	•	Admin / platform owner.
	•	Risk / model validation.
	•	Read-only audit / review.
	•	Access to evidence packs and metrics can be restricted to specific roles.

8.4 External attestations (out of repo)
	•	Formal attestations and artefacts (e.g. SOC 2 reports, ISO 27001 certificates, SBOMs, pen-test letters) are maintained outside this repository and are not issued by the code or documentation here.

⸻

9. Commercial Model

9.1 BYOC and licensing
	•	Bring Your Own Cloud/Compute (BYOC):
	•	Customers provision and pay for their own compute and storage.
	•	FL-BSA incurs no hidden infra costs from the vendor side.
	•	Current public commercial posture:
	•	Prospects request an evidence-readiness assessment, pricing discussion, or guided pilot qualification.
	•	For the selected v5 generator cut, the intended commercial handoff posture is native/no-CTGAN
		and no-DataCebo after the final native release-candidate contract and release-owner
		disposition pass for the selected SHA. The historical CTGAN-backed rc9 proof remains a
		comparator/technical record, not the selected v5 default. Full differential privacy remains a
		post-v5 roadmap item, not a v5 commercial claim.
	•	Commercial terms are finalized during qualification and may be delivered through a controlled private-offer or agreed private handoff path.
	•	Annual and volume licence structures are indicative future or post-qualification shapes, not cold-sell public offers.
	•	Public AWS Marketplace access is not yet a standing offer; current AWS-oriented access remains controlled guided-pilot / private handoff unless current release and GTM records explicitly say otherwise.

Concrete pricing numbers are intentionally excluded from this SSOT; they live in commercial documents and may vary by market.

9.2 Usage dimensions

Typical levers for pricing and capacity planning:
	•	Number of pipelines / scenarios.
	•	Data volume (rows, portfolios).
	•	Frequency of runs and report generation.
	•	Support level (response times, customisation).

⸻

10. Support & Operations

10.1 Vendor support
	•	Remote support only (no direct shell access into customer systems).
	•	Channels:
	•	Ticketing system / email.
	•	Scheduled calls for complex issues.
	•	Artefacts exchanged for support (where allowed):
	•	Logs and redacted metrics.
	•	Synthetic-only samples.
	•	Never raw SCPD unless explicitly authorised by the customer.

10.2 Monitoring & health
	•	FL-BSA exposes health endpoints and basic metrics for:
	•	Service uptime.
	•	Queue depths (jobs).
	•	Error rates.
	•	Customers are expected to:
	•	Integrate these into their own monitoring stacks (e.g. Prometheus, CloudWatch).

⸻

11. Roadmap Snapshot (Non-Binding)

This section is a snapshot of intent, not a commitment schedule, and must not be used as a contract term.

Near-term priorities (subject to change):
	•	Strengthen metrics manifests and evidence bundle formats as the authoritative technical SSOT for each run.
	•	Expand dataset-quality metrics aligned with EU AI Act Article 10(3).
	•	Improve GPU/CPU benchmark coverage and exposure (documentation, sizing guides).
	•	Refine compliance templates and documentation anchors for new jurisdictions as they are added.
	•	Tighten Simulation-Reporting separation in UX and API to minimise any risk of misuse as a reporting engine.

Security and compliance:
	•	Continue to harden cryptographic hashing and certificate formats.
	•	Provide clearer "compliance summary" artefacts per scenario (e.g. a small JSON verdict + rationale).
	•	Evolve security posture in line with ops and customer requirements.

Certification roadmap (planned, not yet attained; current operational status belongs in GTM/task
records, not this SSOT):
	•	SOC 2 Type II — formal audit planned; current controls are SOC 2 aligned.
	•	ISO 27001 — certification planned; current practices are ISO 27001 aligned.
	•	Cyber Essentials / Cyber Essentials Plus — under evaluation for UK market.
	•	AWS Financial Services Competency — requires customer references and AWS validation.

Cloud marketplace posture:
	•	FL-BSA is packaged for customer-hosted marketplace-style delivery.
	•	AWS — AWS Partner registered (Valfox Ltd / Equilens seller account active; recorded 2026-02-25); listing in progress and not represented here as publicly transactable.
	•	Microsoft Partner Network — enrolled (MPN ID: 7035328); Azure Marketplace availability, acceptance, and release scope are governed by current release/GTM records.
	•	Current AWS/Azure listing, acceptance, and promotion status is release/GTM working state; see the
		current task board and private GTM records rather than treating this SSOT as a live launch ledger.

⸻

End of SSOT.
