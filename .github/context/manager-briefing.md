# SRE Manager Briefing — Current State

> **Purpose:** This file is your persistent session context. Reference it at the start of VS Code agent sessions (`#file:.github/context/manager-briefing.md`) to re-establish state without re-explaining your world. Update weekly or when priorities shift.
>
> **Last Updated:** [TBD — set to current date on first use]

---

## Active Priorities (Rank Ordered)

1. **SRE Team Expansion** — Status: Drafting business case. The artifact package includes profit plan financials, cohort hiring schedule (Q1/Q2), on-call burden analysis as the central justification pillar, security posture mandate, and Platform Engineering ownership gap. Audience is cross-functional leadership (Engineering, Finance, HR) targeting budget approval. Next action: [TBD — e.g., finalize financials / schedule leadership review]. Target date: [TBD].
2. **ServiceNow → JSM Migration** — Status: In Progress. 17 Brightlayer platform services cataloged, team slugs established, Salesforce-JSM-Jira Software workflow designed with CIM tracking. JSM Assets now serving as single source of truth for service ownership. Next action: [TBD — e.g., complete JSM Assets object schema / pilot incident routing]. Target date: [TBD].
3. **CrowdStrike Falcon CSPM Transition** — Status: In Progress. Replacing Microsoft Defender. IOM remediation SLAs defined (Critical ≤48h, High ≤7d). Next action: [TBD — e.g., complete agent deployment / begin IOM remediation SLA enforcement]. Target date: [TBD].
4. **Azure DevOps → GitHub Actions Migration** — Status: In Progress. GitHub Actions is the target CI/CD platform. Reusable workflow pattern adopted. Next action: [TBD — e.g., migrate next batch of pipelines / retire Azure DevOps pipelines for migrated services]. Target date: [TBD].
5. **SRE KPI Framework (Pillar 5)** — Status: Defined. Three-tier KPI framework established (PDR, SLO Compliance, CIM, MTTR, CFR + Tier 2/3). SLO Compliance has baseline data in Dynatrace. Remaining Tier 1 KPIs need instrumentation and baselining in JSM. Next action: Establish PDR baseline by classifying JSM incidents as system-detected vs. customer-reported. Target date: [TBD].

---

## Team Status

### REST (Operations)
- **Headcount:** [TBD] / [TBD target] (of 9 total SRE)
- **On-call coverage:** [TBD — e.g., Americas only / Americas + partial EMEA]
- **Open P1/P2 incidents:** [TBD]
- **On-call burden ratio:** Exceeds Google SRE benchmark (1:4 target). Exact ratio: [TBD — calculate from OpsGenie rotation participation]. This is the primary driver for team expansion.

### Platform Engineering (Development)
- **Headcount:** [TBD] / [TBD target] (of 9 total SRE)
- **Current sprint focus:** [TBD — e.g., JSM Assets service object buildout, GitHub Actions reusable workflows, FluxCD operations]
- **Blocked items:** [TBD]

---

## Open PIRs

| PIR ID | Severity | Service | Status | Due Date |
|---|---|---|---|---|
| [TBD] | [TBD] | [TBD] | [TBD] | [TBD] |

---

## Active Initiatives

| Initiative | Owner | Phase | Key Metric | Notes |
|---|---|---|---|---|
| SRE Team Expansion | SRE Manager | Drafting business case | On-call burden ratio | Cohort hiring Q1/Q2. On-call burden is central justification pillar. |
| ServiceNow → JSM Migration | SRE + IT | Pilot | Ticket migration % | 17 services cataloged. Salesforce-JSM-Jira workflow designed. JSM Assets = service ownership source of truth. |
| Azure DevOps → GitHub Actions | SRE + DevOps | [TBD — Foundation / Pilot / Scale / Hardening] | Pipeline migration count | Reusable workflow pattern. GitHub Actions is the target. |
| Backstage IDP | Platform Eng | Deferred | N/A | JSM Assets covers service ownership until resumption. |
| CrowdStrike CSPM | Security + SRE | Transition | IOM remediation SLA compliance | Replacing Microsoft Defender. SLAs: Critical ≤48h, High ≤7d. |
| SRE KPI Framework | SRE Manager | Instrumentation | PDR baseline established (Y/N) | Pillar 5 defined. SLO Compliance has baseline. PDR, CIM, MTTR need baselining. |

---

## SRE KPI Snapshot (Pillar 5)

### Tier 1 — Must Have

| KPI | Current Value | Trend | RAG | Notes |
|---|---|---|---|---|
| PDR | No baseline | — | — | Requires JSM incident classification (system-detected vs. customer-reported). First action: add classification field to JSM incident form. |
| SLO Compliance | [TBD — pull from Dynatrace] | [TBD] | [TBD] | Baseline data exists in Dynatrace. Pull current compliance % across all production services with defined SLOs. |
| CIM (this period) | No baseline | — | — | Data exists in JSM + Salesforce but not yet aggregated as a KPI. Requires report correlating Salesforce Case Created Date with JSM Service Restored Timestamp. |
| MTTR — P1 | No baseline | — | — | Data exists in JSM incident timestamps. Requires report: Mean(Restored − Detected) for P1 incidents, rolling 90 days. |
| MTTR — P2 | No baseline | — | — | Same as above for P2 severity. |
| CFR | No baseline | — | — | Requires correlation between GitHub Actions deployment events and JSM incidents within a time window. Most complex to instrument. |

### Tier 2 — Should Have

| KPI | Current Value | Trend | RAG | Notes |
|---|---|---|---|---|
| MTTD | No baseline | — | — | Requires Dynatrace Davis AI problem timestamps cross-referenced with JSM incident creation. |
| On-Call Burden | Exceeds 1:4 target | — | R | 9 total engineers. Exact ratio TBD from OpsGenie. This is already known to be Red — it's the expansion driver. |
| Platform Availability | [TBD — pull from Dynatrace Synthetic] | [TBD] | [TBD] | Synthetic monitors may already exist. Check Dynatrace for current synthetic pass rates across critical journeys. |
| IOM SLA Compliance | [TBD] | [TBD] | [TBD] | Pull from CrowdStrike Falcon CSPM (or Microsoft Defender during transition). |

---

## Error Budget Status

| Service | SLO Target | Current Burn Rate | Budget Remaining | Action |
|---|---|---|---|---|
| [TBD — populate from Dynatrace SLO dashboard for each production service with defined SLOs] | | | | |

---

## KPI Baselining Roadmap

Priority order for establishing baselines on KPIs that don't have data yet:

1. **PDR** (highest priority) — Add incident classification field to JSM incident form: "Detection Source" with values "Monitoring/Alerting" and "Customer/Support Reported." Begin classifying all new incidents. First monthly baseline available after 30 days of classification.
2. **CIM** — Build a JSM + Salesforce report correlating Case Created Date (start) with Service Restored Timestamp (stop). Data likely already exists; needs aggregation into a reportable metric.
3. **MTTR** — Build a JSM report using incident timestamps (Detected → Restored), segmented by severity, rolling 90-day window. Data already exists in JSM if timestamp fields are populated consistently.
4. **MTTD** — Requires Dynatrace-to-JSM timestamp correlation. More complex; defer until PDR and MTTR are baselined.
5. **CFR** — Most complex instrumentation. Requires deployment event tagging in GitHub Actions and incident correlation logic in JSM. Defer until the GitHub Actions migration is further along.

---

## Decisions Pending

- [ ] Team expansion business case: finalize financial model and schedule leadership review
- [ ] REST/Platform Engineering headcount split for expansion cohort (how many REST vs. dev hires)
- [ ] APAC rotation staffing model: contract vs. FTE
- [ ] JSM incident form: add "Detection Source" field for PDR baselining
- [ ] CrowdStrike Falcon CSPM: confirm cutover date from Microsoft Defender

---

## This Week's Focus

- [ ] [TBD — update weekly]
- [ ] [TBD]
- [ ] [TBD]
