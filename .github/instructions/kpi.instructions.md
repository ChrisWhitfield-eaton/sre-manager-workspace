---
applyTo: "**/*kpi*,**/*metric*,**/*dashboard*,**/*report*,**/*wbr*,**/*pdr*,**/*slo*,**/*error-budget*,**/*cim*,**/*mttr*,**/*mttd*"
---

# SRE KPI Measurement Standards

## Context

These KPIs form Pillar 5 — SRE (Platform Reliability & Operations) in the GSO WBR KPI Book. They complement the existing four pillars (CX, DevOps, Lean/Agile, QA/CCoE). The SRE Manager is the Domain Owner. Primary systems of record are JSM, Dynatrace, OpsGenie, CrowdStrike Falcon CSPM, and GitHub Actions.

## Tier 1 — Must Have

### KPI: Proactive Detection Ratio (PDR)

- **Objective:** Measure whether monitoring detects incidents before customers, support, or business stakeholders report them.
- **Why it matters:** A high PDR means the observability investment is working — issues are caught early, reducing customer impact and detection latency. A low PDR means customers are discovering problems first, indicating detection gaps.
- **Formula:** PDR = I_system / (I_system + I_customer), where I_system = system-detected incidents (JSM incidents created automatically by monitoring/alerting), I_customer = customer-reported incidents (JSM incidents created manually by support, customers, or business teams).
- **Data source:** JSM — incident classification field distinguishing system-detected vs. customer-reported origin.
- **Refresh cadence:** Monthly (MOR), Quarterly (QBR).
- **Owner:** SRE Manager.
- **Thresholds:** Target ≥ 80%. Green ≥ 80%, Amber 60–79%, Red < 60%.
- **Anti-gaming rule:** PDR must not be inflated by over-alerting. A rising PDR must correlate with meaningful incident detection, not noise. Pair with Alert Signal-to-Noise Ratio (Tier 3) to validate.
- **Executive interpretation:** Green: Most incidents are detected proactively — strong observability and operational readiness. Red: Customers are finding problems first — detection gaps exist, requiring investment in SLOs, alerting, and synthetic monitoring.
- **Cross-pillar connection:** Low PDR → growing CX escalation backlog (Pillar 1). Improving PDR requires better Dynatrace SLO coverage and alert quality.

### KPI: SLO Compliance

- **Objective:** Measure the percentage of production services meeting their SLO targets within the measurement period.
- **Why it matters:** SLO compliance is the foundational reliability metric. It answers "Are our services performing within acceptable bounds for customers?" It replaces subjective reliability assessments with quantitative, business-aligned measurement.
- **Formula:** SLO Compliance = (Services meeting all SLO targets / Total services with defined SLOs) × 100.
- **Companion metric — Error Budget Remaining (%):** For each service, Error Budget Remaining = (1 − (actual error rate / allowed error rate)) × 100. When budget reaches 0%, the error budget policy triggers (alert → freeze → PIR).
- **Data source:** Dynatrace SLOs (DQL-backed SLI definitions). Each production service has availability, latency (p95), and error rate SLOs.
- **Refresh cadence:** Weekly (WBR). Error budget burn rate monitored continuously.
- **Owner:** SRE Manager (service-level ownership defined in JSM Assets).
- **Thresholds:** SLO Compliance: Green ≥ 95%, Amber 85–94%, Red < 85%. Error Budget: Green > 50% remaining, Amber 20–50%, Red < 20%.
- **Executive interpretation:** Green: Services are performing within reliability targets — customers are getting the experience we committed to. Red: Multiple services are breaching SLOs — reliability is degraded, and error budget policies should be activating to shift investment from features to stability.
- **Cross-pillar connection:** Error budget exhaustion triggers feature freeze, which shifts investment balance (Pillar 3) away from "New Things" toward "Maintenance."

### KPI: Customer Impacted Minutes (CIM)

- **Objective:** Quantify the total duration of customer-facing impact caused by incidents in a given period.
- **Why it matters:** CIM translates reliability failures into business language. Executives understand "400 customer-impacted minutes this month" more readily than "three P2 incidents." CIM also enables trending — is customer impact increasing or decreasing over time?
- **Formula:** CIM = Σ (Service Restored Timestamp − Salesforce Case Created Date) for all incidents with confirmed customer impact in the period. Timestamps are UTC (Jira) — critical for accuracy.
- **Data source:** JSM (Service Restored Timestamp) + Salesforce (Case Created Date). The `RPxx` comment prefix is required for Salesforce sync.
- **Refresh cadence:** Weekly (WBR).
- **Owner:** SRE Manager (in partnership with CX Lead).
- **Thresholds:** Trend-based. No fixed target initially. Target: month-over-month reduction. Green: declining or zero CIM. Red: sustained increase in CIM.
- **Executive interpretation:** Green: Customer-facing impact is decreasing — SRE and engineering investments are paying off. Red: Customer-facing impact is growing — either incident frequency or restoration speed (or both) are degrading.
- **Cross-pillar connection:** CIM is the quantitative bridge between Pillar 5 (SRE) and Pillar 1 (CX). High CIM drives CX escalation volume, average resolve time, and customer dissatisfaction.

### KPI: Mean Time to Restore (MTTR)

- **Objective:** Measure how quickly service is restored after an incident is detected, segmented by severity.
- **Why it matters:** MTTR directly determines CIM — shorter restoration = fewer customer-impacted minutes. It measures the effectiveness of incident response: runbook quality, on-call preparedness, escalation efficiency, and remediation capability.
- **Formula:** MTTR = Mean(Service Restored Timestamp − Incident Detected Timestamp) for incidents resolved in the period, segmented by P1/P2/P3/P4.
- **Distinction from CX pillar:** CX Pillar 1 tracks "Average Resolve Time" for customer escalations (escalation creation → resolution). MTTR tracks the SRE incident lifecycle (detection → service restoration). These are different clocks measuring different workflows.
- **Data source:** JSM incident timestamps (Detected, Restored fields).
- **Refresh cadence:** Weekly (WBR), rolling 90-day trend.
- **Owner:** SRE Manager.
- **Thresholds:** P1: Green < 30 min, Amber 30–60 min, Red > 60 min. P2: Green < 2h, Amber 2–4h, Red > 4h. P3/P4: Trend-based.
- **Executive interpretation:** Green: Incidents are resolved quickly — strong operational readiness. Red: Restoration is slow — indicates runbook gaps, staffing issues, or systemic complexity that needs engineering investment.
- **Cross-pillar connection:** MTTR × incident count ≈ CIM. Improving MTTR is the fastest lever to reduce CIM.

### KPI: Change Failure Rate (CFR)

- **Objective:** Measure the percentage of production deployments that cause a degradation, outage, or require rollback.
- **Why it matters:** CFR is the safety metric for the deployment pipeline. The DevOps pillar (Pillar 2) measures how *fast* code moves; CFR measures how *safely* it lands. A fast pipeline with a high CFR is a liability, not an asset.
- **Formula:** CFR = (Deployments causing incidents or rollbacks / Total production deployments) × 100.
- **Data source:** JSM incidents correlated with GitHub Actions deployment workflow runs within a defined correlation window (e.g., incident opened within 60 minutes of a deployment completion). GitHub Actions provides deployment count; JSM provides incident-to-deployment linking.
- **Refresh cadence:** Weekly (WBR).
- **Owner:** SRE Manager (in partnership with DevOps Lead).
- **Thresholds:** DORA Elite: < 5%. Green < 10%, Amber 10–15%, Red > 15%.
- **Executive interpretation:** Green: Deployments are safe — the pipeline delivers reliably. Red: A significant percentage of deployments cause problems — progressive delivery, deployment validation (SRE Guardian), or pre-production testing needs strengthening.
- **Cross-pillar connection:** CFR connects Pillar 2 (DevOps) to Pillar 5 (SRE). High CFR should trigger review of pipeline gates, SRE Guardian configuration, and QA coverage (Pillar 4).

---

## Tier 2 — Should Have

### KPI: Mean Time to Detect (MTTD)

- **Objective:** Measure the elapsed time from the onset of an issue to its detection by monitoring systems.
- **Why it matters:** MTTD is the leading indicator for PDR. If monitoring detects issues slowly, customers will find them first, driving PDR down. Improving MTTD requires investment in SLOs, synthetic monitors, and anomaly detection — making it the metric that justifies observability spend.
- **Formula:** MTTD = Mean(Dynatrace Davis AI Problem Detection Timestamp − Estimated Issue Start Time) for system-detected incidents in the period.
- **Data source:** Dynatrace (Davis AI problem open timestamp) cross-referenced with JSM (incident creation timestamp). For customer-reported incidents, MTTD is effectively infinite (monitoring missed it).
- **Refresh cadence:** Monthly.
- **Owner:** SRE Manager.
- **Thresholds:** Green < 5 min, Amber 5–15 min, Red > 15 min. Trend matters more than absolute value initially.
- **Executive interpretation:** Green: Monitoring catches issues almost immediately — strong observability posture. Red: Significant detection lag — Davis AI anomaly detection may need tuning, SLOs may have gaps, or synthetic monitors may not cover critical journeys.

### KPI: On-Call Burden Ratio

- **Objective:** Measure the sustainability of the on-call rotation by tracking the ratio of engineers participating in on-call to total SRE headcount.
- **Why it matters:** On-call burden is a team health metric and the primary quantitative pillar of the SRE team expansion business case. Exceeding Google SRE guidelines (recommended max 25% of time on-call per engineer, minimum of 8 engineers per rotation) leads to burnout, attrition, and degraded incident response quality.
- **Formula:** On-Call Burden = Engineers in active on-call rotation / Total SRE headcount eligible for on-call. Compare against Google SRE benchmark target of 1:4 (each engineer on-call no more than 25% of the time).
- **Data source:** OpsGenie (rotation schedules, participation records).
- **Refresh cadence:** Monthly.
- **Owner:** SRE Manager.
- **Thresholds:** Green: ratio meets Google SRE benchmark (≤ 25% per engineer). Amber: 25–35%. Red: > 35% or fewer than 4 engineers in any rotation.
- **Executive interpretation:** Green: On-call is sustainable — engineers have adequate recovery time between rotations. Red: Engineers are on-call too frequently — risk of burnout, attrition, and degraded response quality. Primary justification for headcount investment.

### KPI: Platform Availability (Synthetic)

- **Objective:** Provide a top-line availability number for the Brightlayer platform measured from external vantage points.
- **Why it matters:** This is the executive-friendly "Is the platform up?" metric. Synthetic monitors simulate real user journeys from multiple global regions, providing an outside-in view that complements inside-out SLO measurements.
- **Formula:** Platform Availability = (Successful synthetic monitor executions / Total scheduled executions) × 100, aggregated across critical user journeys and all monitoring zones.
- **Critical user journeys monitored:** Device registration, firmware update initiation, telemetry data retrieval, user authentication, device command execution.
- **Data source:** Dynatrace Synthetic Monitors (HTTP monitors + browser clickpath monitors across multiple zones).
- **Refresh cadence:** Weekly (WBR). Continuous monitoring with alerting on failures.
- **Owner:** SRE Manager.
- **Thresholds:** Green ≥ 99.9%, Amber 99.5–99.8%, Red < 99.5%.
- **Executive interpretation:** Green: The platform is available and performant from a customer's perspective across all regions. Red: Availability is below acceptable levels — active investigation required, Statuspage communication may be warranted.

### KPI: IOM Remediation SLA Compliance

- **Objective:** Measure the percentage of cloud security findings remediated within defined SLA windows.
- **Why it matters:** SAST/DAST compliance (Pillar 4) measures whether security scans run. IOM remediation compliance measures whether the findings get fixed. Unremediated findings represent active risk to the platform.
- **Formula:** IOM SLA Compliance = (Findings remediated within SLA / Total findings requiring remediation) × 100, segmented by severity.
- **SLA targets:** Critical ≤ 48 hours. High ≤ 7 days. Medium ≤ 30 days. Low ≤ 90 days.
- **Data source:** CrowdStrike Falcon CSPM (transitioning from Microsoft Defender). Finding creation timestamp vs. remediation timestamp.
- **Refresh cadence:** Weekly (WBR).
- **Owner:** SRE Manager (in partnership with CCoE Security Lead).
- **Thresholds:** Green: 100% within SLA. Amber: ≥ 90%. Red: < 90% or any Critical finding exceeding 48h.
- **Executive interpretation:** Green: Security findings are being addressed within committed timeframes — strong security posture. Red: Findings are aging beyond SLA — active risk exposure that requires resource allocation or escalation.

---

## Tier 3 — Maturity Accelerators

### KPI: Toil Ratio

- **Objective:** Measure the percentage of SRE operational work that is manual, repetitive, automatable, and devoid of enduring value.
- **Why it matters:** Google SRE recommends no more than 50% toil. Tracking toil justifies automation investment and measures whether the Platform Engineering team is reducing operational burden over time. If toil is rising, the dev team is not building enough automation.
- **Formula:** Toil Ratio = (Hours spent on toil work / Total SRE operational hours) × 100.
- **Toil classification:** Toil is work that is manual, repetitive, automatable, tactical, has no enduring value, and scales linearly with service growth. Examples: manual certificate rotations, repetitive alert triage for known issues, manual scaling operations.
- **Data source:** JSM ticket categorization (tag toil vs. engineering work) + time tracking.
- **Refresh cadence:** Monthly.
- **Owner:** SRE Manager.
- **Thresholds:** Green < 30%. Amber 30–50%. Red > 50%.
- **Executive interpretation:** Green: Most SRE time is spent on engineering and improvement, not repetitive operations. Red: SREs are spending more than half their time on toil — automation investment is insufficient, and the team will not scale without intervention.

### KPI: Alert Signal-to-Noise Ratio

- **Objective:** Measure the quality of the alerting pipeline by tracking the percentage of alerts that result in meaningful human action.
- **Why it matters:** Alert fatigue is the #1 threat to PDR and MTTD. If engineers receive too many non-actionable alerts, they stop responding quickly — or at all. A low signal-to-noise ratio means the alerting pipeline is noisy and needs tuning.
- **Formula:** Signal-to-Noise = (Alerts acknowledged AND actioned / Total alerts fired) × 100.
- **Data source:** OpsGenie (alert acknowledgment, resolution, and escalation data).
- **Refresh cadence:** Monthly.
- **Owner:** SRE Manager.
- **Thresholds:** Green > 70%. Amber 40–70%. Red < 40%.
- **Executive interpretation:** Green: Most alerts lead to real action — the alerting pipeline is well-tuned. Red: Most alerts are noise — alert fatigue is likely, degrading incident response effectiveness. Requires Davis AI anomaly detection tuning, SLO-based alerting, and alert consolidation.

### KPI: Deployment Frequency

- **Objective:** Track how often production deployments occur per service, per week.
- **Why it matters:** Deployment frequency is the DORA metric that measures delivery throughput. Combined with CFR, it gives the complete velocity-vs-safety picture. High frequency + low CFR = elite performance. High frequency + high CFR = fast but dangerous.
- **Formula:** Deployment Frequency = Count of production deployment workflow completions per service per week.
- **Data source:** GitHub Actions (deployment workflow run completions targeting production environments).
- **Refresh cadence:** Weekly (WBR).
- **Owner:** SRE Manager (in partnership with DevOps Lead).
- **Thresholds:** DORA Elite: multiple deploys per day per service. Green: ≥ 1/week. Amber: 1/month. Red: < 1/month.
- **Executive interpretation:** Green: Teams ship frequently and incrementally — smaller changes, lower risk per deployment. Red: Infrequent deployments suggest batching risk and long feedback loops. Pair with CFR: if frequency is high but CFR is also high, the pipeline is fast but unsafe.

---

## KPI Data Source Summary

| KPI | Primary Data Source | Secondary Source | Owner |
|---|---|---|---|
| PDR | JSM (incident classification) | — | SRE Manager |
| SLO Compliance | Dynatrace (SLOs, DQL) | — | SRE Manager |
| Error Budget Remaining | Dynatrace (SLO burn rate) | — | SRE Manager |
| CIM | JSM + Salesforce | — | SRE Manager + CX Lead |
| MTTR | JSM (incident timestamps) | — | SRE Manager |
| CFR | JSM + GitHub Actions | — | SRE Manager + DevOps Lead |
| MTTD | Dynatrace (Davis AI) + JSM | — | SRE Manager |
| On-Call Burden | OpsGenie (rotations) | — | SRE Manager |
| Platform Availability | Dynatrace Synthetic | — | SRE Manager |
| IOM Remediation SLA | CrowdStrike Falcon CSPM | Microsoft Defender (legacy) | SRE Manager + CCoE Lead |
| Toil Ratio | JSM (ticket tags) + time tracking | — | SRE Manager |
| Alert Signal-to-Noise | OpsGenie (alert analytics) | — | SRE Manager |
| Deployment Frequency | GitHub Actions (workflow runs) | — | SRE Manager + DevOps Lead |
