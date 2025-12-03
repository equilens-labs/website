Here’s a full revised SSoT, with the new narrative angles baked in, but no new technical promises beyond what you’ve already committed to. It’s written to be self-contained, so you can drop it in as SSoT.md and iterate from there.

⸻

Fair-Lending Bias-Simulation Appliance — Single Source of Truth (SSOT)

Last updated: 2025-12-03

Scope. This document is the product-level single source of truth for FL-BSA.
It covers: architecture, capabilities, regulatory positioning, performance targets, and the commercial model.
Implementation-level details (code, CI, infra) live in the repo and ops docs and are not duplicated here.

One-sentence summary.
FL-BSA is a regulatory digital twin for lending – a safety-through-simulation appliance that generates synthetic borrowers, stress-tests existing models for bias, and emits tamper-evident evidence packs without touching live decisions.

⸻

1. Product Definition

1.1 Form factor
	•	FL-BSA is a multi-container appliance deployed inside the customer’s environment (own VPC / VM / on-prem).
	•	It exposes:
	•	An API service for orchestration and integration.
	•	A batch worker / job runner for training and audits.
	•	Optional UI for interactive exploration and report download.
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
	•	Regulator-ready PDF reports.
	•	Evidence bundles (certificates, manifests, logs).

1.3 Core value proposition

FL-BSA is the bank’s regulatory digital twin for lending.
	•	Safety-through-simulation only
	•	FL-BSA never makes, overrides, or batch-scores live lending decisions.
	•	It runs synthetic “what-if” portfolios against the existing decision stack (scorecards, ML models, rules).
	•	All outputs are simulation artefacts, not production records.
	•	Dual-branch view of bias
	•	Amplification branch (“status-quo”):
	•	Generates synthetic borrowers that mirror historical patterns in applications, decisions, and outcomes.
	•	Shows how the current stack behaves given the actual history the bank has created.
	•	Intrinsic branch (“counterfactual baseline”):
	•	Generates synthetic borrowers from a modified distribution where protected characteristics and selected proxies are decorrelated from outcomes, within statistical constraints.
	•	Approximates how the same models would behave in a “fairer baseline” world.
	•	The gap between branches is the primary audit object: amplification vs intrinsic bias.
	•	Evidence, not opinions
	•	Every run produces a tamper-evident evidence pack:
	•	Metrics and manifests.
	•	Hashes and certificates.
	•	PDF reports and supporting logs.
	•	The pack is designed to be consumed by risk, compliance, internal audit, and (via the bank) external reviewers.
	•	BYOC commercial model
	•	Customers run FL-BSA in their own cloud/on-prem environment and pay their own compute, including GPUs.
	•	FL-BSA is licensed as an appliance (software) that converts data and models into auditable evidence.

1.4 Simulation vs Reporting Strategy

FL-BSA is deliberately scoped to the bank’s Simulation Strategy, not its Reporting Strategy.
	•	Simulation Strategy (FL-BSA domain)
	•	Generate synthetic portfolios and stress-test existing models for bias.
	•	Explore Less Discriminatory Alternatives (LDAs), overlays, and “counterfactual reject” scenarios.
	•	Quantify intrinsic vs amplification effects.
	•	Produce evidence that can support regulatory engagement.
	•	Reporting Strategy (bank domain, out of scope for FL-BSA)
	•	How production decisions are explained to customers and regulators (e.g. ECOA adverse-action notices, Consumer Duty statements).
	•	How self-testing results feed into governance, remediation, and official disclosures.

This separation is enforced by:
	•	The no-raw-data-leaves stance: real borrower data and SCPD stay inside the bank’s perimeter.
	•	A synthetic-only export boundary: artefacts that leave the appliance (CSV, Parquet, JSON, PDF) are explicitly simulation outputs and must not be treated as “historical truth”.

1.5 Out of scope

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
	•	Trains generative models on a modified view of the data where:
	•	Protected attributes (and selected proxies) are masked, decorrelated, or otherwise neutralised.
	•	Represents an approximate “fair baseline” where structural penalties are removed as far as practicable.
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
	•	FL-BSA uses CTGAN-style tabular generative models to produce synthetic borrower portfolios with:
	•	Mixed continuous/categorical features.
	•	Application-time features.
	•	Decisions and outcomes (for amplified branch).
	•	Protected attributes (where lawfully available) for fairness analysis.
	•	High-level properties:
	•	Supports multiple protected attributes (e.g. gender, race/ethnicity) and combinations.
	•	Handles class imbalance (e.g. minority groups, rare outcomes) via appropriate sampling and training configuration.
	•	Ensures synthetic data stays within plausible ranges and business constraints (e.g. income, loan-amount ratios).
	•	Synthetic data is never linked back to identifiable individuals and is designed so that no single synthetic record can be trivially re-identified as a real borrower.

2.3 Bias auditing & adverse-action support
	•	Metric layers:
	•	Mathematical layer: foundational metrics (disparate impact ratio, statistical parity difference, TPR/FPR parity, etc.).
	•	Regulatory layers: mapping to:
	•	ECOA/Reg B and CFPB frameworks.
	•	EU AI Act data-governance requirements (Article 10, Article 13).
	•	UK FCA Consumer Duty / SDEG-relevant metrics.
	•	Adverse-action-style analysis:
	•	For scenarios that appear non-compliant, FL-BSA can surface reason codes or key contributing factors in a form that can inform ECOA-aligned adverse-action narratives.
	•	These are inputs to legal/compliance processes; they are not themselves adverse-action letters.

2.4 Certificates & evidence packs

FL-BSA treats each audit run as producing a cryptographically anchored evidence pack. At a minimum, packs include:
	•	Metrics manifest (metrics.json or equivalent).
	•	Synthetic data manifests and hashes.
	•	Configuration snapshot (models, hyperparameters, seed).
	•	One or more certificates, such as:
	•	Data validation certificate.
	•	Training / convergence certificate.
	•	Synthetic data quality / dataset certificate.
	•	Compliance assessment summaries per framework.
	•	Human-readable report (PDF) per scenario.

Certificates reference each other and key artefacts via hashes so that tampering is detectable.

2.5 Simulation–reporting firewall

To maintain the Simulation vs Reporting split:
	•	FL-BSA:
	•	Does not connect to production decision services for live scoring.
	•	Is integrated with source systems in a read-only fashion (for ingest) and as a write-only archive for evidence.
	•	All exported datasets and reports are:
	•	Clearly labelled as synthetic or simulated, and
	•	Intended for risk/compliance analysis, not for MIS, finance, or statutory reporting pipelines.

2.6 Interfaces (API / UI / CLI)
	•	API.
	•	Endpoints to:
	•	Create and configure pipelines.
	•	Trigger runs (by data snapshot / scenario).
	•	Retrieve metrics, manifests, certificates, and reports.
	•	UI (optional).
	•	For non-technical users to:
	•	Launch standard scenarios.
	•	View high-level metrics and branch comparisons.
	•	Download reports and evidence packs.
	•	CLI / automation.
	•	For CI/CD and batch integration (e.g. nightly audits, pre-deployment checks on new models).

⸻

3. Regulatory Positioning (Conceptual)

This section captures design intent and positioning. It is not legal advice and does not replace the bank’s own counsel.

3.1 United States – ECOA / Reg B / CFPB
	•	FL-BSA is designed to support disparate-impact and disparate-treatment analysis under ECOA/Reg B, by:
	•	Generating synthetic borrower populations with protected attributes.
	•	Replaying the bank’s models to estimate group-level outcomes.
	•	Quantifying metrics such as adverse impact ratio and TPR/FPR disparities.
	•	Argus-style risk mitigation:
	•	The appliance is never used to fabricate or backfill “historical” performance data.
	•	Synthetic borrowers are explicitly marked as synthetic and are only used for simulation, not for production reporting.
	•	Self-testing and LDAs:
	•	FL-BSA helps banks search for and quantify Less Discriminatory Alternatives (LDAs) by simulating alternative policies and models.
	•	The bank retains responsibility for:
	•	Deciding which LDAs to adopt.
	•	Managing any discovery/comms implications of self-testing records.

3.2 European Union – EU AI Act, Data Governance
	•	FL-BSA is designed to be used in a way that aligns with EU AI Act obligations for high-risk systems (e.g. credit scoring) by:
	•	Supporting workflows where:
	•	Real SCPD is used for training synthetic generators within the bank’s safe environment when strictly necessary.
	•	Downstream bias analysis is performed on synthetic data.
	•	Only synthetic and aggregate artefacts leave the environment.
	•	Providing:
	•	Dataset-quality metrics aligned with Article 10(3) (distribution coverage, representativeness).
	•	Documentation hooks for transparency and data-governance sections (Article 13).
	•	FL-BSA does not itself decide which legal basis or derogations (e.g. strict necessity under Article 10(5)) the bank relies on; it only provides technical capabilities consistent with those strategies.

3.3 United Kingdom – FCA, Consumer Duty, SDEG
	•	FL-BSA supports UK banks in analysing:
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
	•	Model outputs / scorecards used in production.
	•	Optional: external data sources the bank uses (bureau, open banking features, etc.).
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
	•	E.g. train-on-synthetic / test-on-real performance comparisons (with in-bank evaluation).

Current versions surface these metrics in manifests and reports so that banks can form their own acceptance criteria. Future versions may treat them as enforcement gates (see vNext planning docs).

4.3 Fairness metrics
	•	FL-BSA supports a configurable set of fairness metrics, including but not limited to:
	•	Disparate impact / adverse impact ratio.
	•	Statistical parity difference.
	•	Equal opportunity difference.
	•	TPR/FPR parity.
	•	Metrics are computed:
	•	Per protected group.
	•	Per branch (Amplification vs Intrinsic).
	•	Per scenario (e.g. threshold shifts, counterfactual rejects).

4.4 Metrics manifest (metrics.json)
	•	Each run produces a canonical metrics manifest containing:
	•	Run metadata (ID, timestamps, RNG seed, software version).
	•	Data summary (row/feature counts, list of protected attributes).
	•	Synthetic-data quality metrics.
	•	Fairness metrics and compliance indicators.
	•	This manifest is treated as part of the technical SSOT for that run and is referenced by certificates.

⸻

5. Evidence & Chain-of-Custody

5.1 Evidence pack contents

Each run’s evidence pack typically includes:
	•	Metrics manifest(s).
	•	Synthetic data manifest(s) and hashes.
	•	Configuration snapshot (YAML/JSON).
	•	Log excerpts relevant to the run.
	•	Certificates (see below).
	•	Rendered reports (PDFs).
	•	Optional service logs or performance traces.

5.2 Certificates and hash chains
	•	FL-BSA uses cryptographic hashes to tie artefacts together:
	•	Certificates include hashes of:
	•	The input dataset snapshot.
	•	Synthetic datasets.
	•	Metrics manifests.
	•	Config snapshots.
	•	A certificate chain links runs over time, allowing auditors to:
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
	•	Full pipeline (ingest → CTGAN training → dual-branch analysis → report) ≤ ~20 minutes on a reference CPU.
	•	~100k rows:
	•	CTGAN training ≤ ~45 minutes on the same reference CPU, with reduced epochs for CI/PR smoke tests.
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
	•	Bank’s own cloud accounts (e.g. AWS VPC).
	•	On-prem virtualised environments.
	•	Typical topology:
	•	Application and worker containers on app nodes.
	•	Optional database for configuration / metadata.
	•	Access to bank’s data warehouse / lake via secure network paths.

7.2 Data ingress
	•	Ingest options:
	•	Pull from data warehouse / lake (e.g. SQL, object store).
	•	Receive prepared snapshots (CSV/Parquet) dropped into a landing bucket.
	•	Data movement is under the bank’s control; FL-BSA does not open outbound tunnels to vendor services.

7.3 Data egress
	•	Artefacts produced:
	•	Stored in the bank’s storage (e.g. object buckets, file shares).
	•	Accessed via:
	•	API (download endpoints).
	•	UI (download buttons).
	•	Direct retrieval from configured storage.

⸻

8. Security & Privacy Posture

8.1 Data residency & ownership
	•	All customer data (real and synthetic) remains in customer-controlled environments.
	•	Vendor does not have direct access to production data or SCPD; any support requiring access is explicitly agreed and sandboxed.

8.2 SCPD handling
	•	FL-BSA assumes SCPD is:
	•	Collected lawfully by the bank.
	•	Made available for fairness analysis where regulations and internal policies permit.
	•	FL-BSA:
	•	Uses SCPD to annotate records and compute group-based metrics.
	•	Does not store SCPD outside the customer’s environment.
	•	Does not send SCPD to external services.

8.3 Identity & access control
	•	Authentication and authorisation are delegated to bank infrastructure where possible (SSO, IdP).
	•	Within FL-BSA, roles typically include:
	•	Admin / platform owner.
	•	Risk / model validation.
	•	Read-only audit / review.
	•	Access to evidence packs and metrics can be restricted to specific roles.

⸻

9. Commercial Model

9.1 BYOC and licensing
	•	Bring Your Own Cloud/Compute (BYOC):
	•	Customers provision and pay for their own compute and storage.
	•	FL-BSA incurs no hidden infra costs from the vendor side.
	•	Licensing shape (indicative):
	•	Evaluation / sandbox tier with limited data volume.
	•	Pilot or project-based licences (fixed term, scoped datasets).
	•	Ongoing annual licences for production-scale use.

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
	•	Remote support only (no direct shell access into bank systems).
	•	Channels:
	•	Ticketing system / email.
	•	Scheduled calls for complex issues.
	•	Artefacts exchanged for support (where allowed):
	•	Logs and redacted metrics.
	•	Synthetic-only samples.
	•	Never raw SCPD unless explicitly authorised by the bank.

10.2 Monitoring & health
	•	FL-BSA exposes health endpoints and basic metrics for:
	•	Service uptime.
	•	Queue depths (jobs).
	•	Error rates.
	•	Banks are expected to:
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
	•	Provide clearer “compliance summary” artefacts per scenario (e.g. a small JSON verdict + rationale).
	•	Evolve security posture (including SOC 2) in line with ops and customer requirements.

⸻

End of SSOT.