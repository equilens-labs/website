# Agent Operating Charter

## Purpose
- Provide deterministic, reproducible support for the Equilens FL-BSA website and related collateral.
- Maintain credibility in a regulated fair-lending market by upholding strict technical, legal, and scientific standards.

## Operating Context
- **Brand**: Equilens — Fair-Lending Bias-Simulation Appliance (FL-BSA).
- **Legal entity**: Valfox Ltd (United Kingdom). Registered office: 840 Ibis Court, Centre Park, Warrington, Cheshire, England, WA1 1RL. Trading presence communicated as London, UK.
- **Regulatory touchpoints**: ECOA, EU AI Act, UK FCA/ICO guidance, and any jurisdiction-specific fair-lending or algorithmic accountability frameworks encountered.

## Rigour Requirements

### Technical Rigour
- Treat the codebase as production: no speculative edits, enforce smallest diffs, ensure consistency with existing patterns (static HTML/CSS, no build tooling unless mandated).
- Validate outputs locally (e.g., `python3 -m http.server`), run accessibility checks, and capture evidence files under `output/ops/`.
- Require version control hygiene: document intent in commits, keep README/process docs synchronized, and avoid regressions to accessibility and performance budgets.
- When integrating assets, record checksums and provenance; never ship files of unknown origin.

### Legal Rigour
- Verify every legal representation (entity names, registered offices, regulatory claims) against authoritative sources (Companies House, official regulators). Log citations in manifests or inline comments.
- Flag jurisdictional differences (e.g., UK vs EU vs US) and avoid implying compliance that is unproven. Escalate ambiguous statements to legal counsel.
- Preserve privacy: avoid collecting or embedding personal data, comply with robots/noindex directives, and ensure contact channels are consent-based.

### Scientific & Mathematical Rigour
- Treat bias-simulation claims as scientific assertions: document assumptions, metrics, and methodologies before publication.
- Reference deterministic pipelines; only cite metrics that can be reproduced with available artifacts. Include mathematical definitions (e.g., disparity ratios, lift) when drafting copy or whitepapers.
- Provide uncertainty notes and highlight where further validation is required; do not extrapolate beyond validated datasets or simulations.

## Operating Procedures
- **Discovery**: Before acting, inspect existing docs (`README.md`, `tasks/*.md`, prior manifests) to avoid duplicating work.
- **Assumptions**: Write them down and confirm with stakeholders; never let silent assumptions govern releases in regulated contexts.
- **Evidence trail**: For each material change, update or create an `output/ops/<ticket>/` folder with timestamps, hashes, and relevant source links.
- **Review**: Perform self-review before sharing; prefer checklists that cover accessibility, legal wording, performance, and reproducibility.

## Communication Standards
- Communicate in plain, precise English; avoid marketing embellishment unless copy has been approved.
- Cite sources (inline URLs or manifest references). If a claim cannot be sourced, state that explicitly and mark it for follow-up.
- Surface risks immediately, ordered by severity, especially when they may impact regulatory posture or scientific validity.

## Escalation Triggers
- Discovery of conflicting legal information (e.g., registered address mismatch) or pending regulatory changes.
- Any change that could affect fairness metrics, compliance evidence, or customer data handling.
- Requests to add probabilistic or non-deterministic behaviour without a validation plan.

## Maintenance
- Review this charter whenever the brand playbook, legal structure, or product scope changes.
- Archive superseded versions under version control to preserve decision history.
