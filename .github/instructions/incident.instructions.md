---
applyTo: "**/*incident*,**/*pir*,**/*postmortem*,**/*runbook*,**/*escalation*,**/*oncall*"
---

# Incident Management & JSM Standards

## ITSM Platform

Jira Service Management (JSM) is the ITSM platform. The organization is migrating from ServiceNow. All new SRE workflows, automations, and integrations must target JSM. Do not reference ServiceNow for new SRE work. The one exception is Eaton IT escalations — REST routes corporate IT and infrastructure issues to Eaton IT via ServiceNow when they fall outside SRE scope.

## Service Ownership Source of Truth

JSM Assets (Insight) is the single source of truth for service ownership across all operational workflows — incidents, PIRs, change management, escalation routing, and JSM queue assignment. Backstage IDP is deferred; when it resumes, JSM Assets will seed the Backstage service catalog.

## Incident Severity Definitions

| Severity | Criteria | PIR Required | PIR Completion SLA |
|---|---|---|---|
| P1 — Critical | Platform-wide outage, data loss, or security breach | Yes — mandatory | 5 business days |
| P2 — High | Major feature degraded, significant user impact | Yes — mandatory | 10 business days |
| P3 — Medium | Minor feature degraded, workaround available | At SRE discretion | 15 business days |
| P4 — Low | Cosmetic, minimal impact | No | N/A |

## On-Call Model

- REST team owns 24×7 on-call via OpsGenie rotation.
- Follow-the-sun target: Americas → EMEA → APAC.
- Current gap: insufficient engineers to fill all rotations (this is the expansion driver).
- Escalation path: REST on-call → Software Product Team (owning team defined in JSM Assets).
- Eaton IT escalation (when needed): REST routes to Eaton IT via ServiceNow for infrastructure or corporate IT issues outside SRE scope.

## PIR (Post-Incident Review) Principles

- Blameless. Focus on systems, not individuals.
- Owned by the Platform Engineering / Dev team, not REST.
- REST provides the incident timeline and first-responder perspective.
- Action items are tracked in Jira Software as engineering work, not JSM tickets.
- Chaos Engineering section is intentionally deferred — do not include it in PIR templates.

## Statuspage Integration

- P1 and P2 incidents require Statuspage communication within 15 minutes of declaration.
- Statuspage updates are the responsibility of the incident commander (REST lead or SRE Manager).
- Use standard language: Investigating → Identified → Monitoring → Resolved.

## Customer Escalation Flow

Salesforce (customer support) → JSM (bi-directional sync) → Jira Software (if engineering follow-up work required).

### CIM (Customer Impacted Minutes) Tracking

- **Start:** Salesforce Case Created Date.
- **Stop:** Service Restored Timestamp in JSM.
- Timestamps are UTC (Jira) — critical for CIM accuracy.
- `RPxx` comment prefix is required for Salesforce sync.
- JSM Assets (Insight) is authoritative for service ownership and JSM queue routing.

### SLA Visibility by System

| Touchpoint | System | SLA Measured | Notes |
|---|---|---|---|
| Customer first response | Salesforce | Case First Response (SFT Response) | Customer-visible / Legal SLA |
| Engineering acknowledgement | JSM | MTI Acknowledgement | Internal KPI |
| Time to restore service | JSM | p1/Mitigation → drives CIM | CIM stop time (KPI) |
| Root cause resolution | Jira Software | Bug / Defect cycle time | Not customer-visible (KPI) |
