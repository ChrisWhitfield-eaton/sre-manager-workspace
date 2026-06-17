# SRE Reporting Automation

Automated generation and distribution of the **Brightlayer MOR Pillar 5 SRE section** and **WBR SRE Pre-Read**. Eliminates manual data gathering and deck assembly — target: zero SRE engineer hours per cycle once fully live.

---

## Contents

- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Data Sources](#data-sources)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Implementation Phasing](#implementation-phasing)
- [Adding a New Data Source](#adding-a-new-data-source)
- [Updating RAG Thresholds](#updating-rag-thresholds)
- [Adding a New Product](#adding-a-new-product)
- [Troubleshooting](#troubleshooting)
- [Operational Runbook](#operational-runbook)

---

## Architecture

The pipeline has four layers. Each layer has a single responsibility and a clean interface to the next.

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   COLLECT    │───▶│  TRANSFORM   │───▶│   GENERATE   │───▶│  DISTRIBUTE  │
│              │    │              │    │              │    │              │
│ API calls to │    │ Apply RAG    │    │ pptxgenjs    │    │ SharePoint   │
│ Dynatrace,   │    │ thresholds.  │    │ reads        │    │ upload +     │
│ JSM,         │    │ Calculate    │    │ data-payload │    │ Teams        │
│ OpsGenie,    │    │ trends.      │    │ .json →      │    │ notification │
│ GH Actions,  │    │ Detect and   │    │ PPTX output  │    │             │
│ Swarmia,     │    │ auto-promote │    │              │    │              │
│ Apptio       │    │ exceptions.  │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
        │                   │
        └──────────────────▶│
                  dist/data-payload.json
                  (validated against
                   schemas/data-payload.schema.json)
```

**Key design principles:**

1. **`data-payload.json` is the contract.** The generate layer reads only this file — it has no knowledge of API clients. The collect and generate layers can evolve independently.
2. **`config/thresholds.json` is the single source of truth for RAG logic.** No threshold values are hardcoded anywhere in the source code.
3. **Graceful degradation.** If a data source is unavailable, the affected metrics render as `N/A` with a source-unavailable timestamp. The pipeline does not fail the entire run for a single source outage.
4. **No secrets in code.** All credentials are retrieved from Azure Key Vault via GitHub Actions OIDC. No long-lived secrets stored in GitHub.

---

## Directory Structure

```
reporting/
├── README.md                           ← This file
├── package.json                        ← Node.js dependencies
│
├── config/                             ← All configuration — edit these, not source code
│   ├── thresholds.json                 ← RAG thresholds for every KPI
│   ├── products.json                   ← Brightlayer product registry with tier + DT entity IDs
│   └── schedule.json                   ← Cron schedule, revenue/headcount config, SharePoint paths
│
├── schemas/
│   └── data-payload.schema.json        ← JSON Schema v7 — validated before generate runs
│
├── src/
│   ├── collect/                        ← One file per data source
│   │   ├── index.js                    ← Orchestrates all collectors → dist/data-payload.json
│   │   ├── dynatrace.js                ← SLO compliance, error budget, MTTD, synthetic
│   │   ├── jsm.js                      ← Incidents, MTTR, CIM (Phase 3), PDR (Phase 3)
│   │   ├── opsgenie.js                 ← On-call burden, alert SNR, rotation gaps
│   │   ├── github-actions.js           ← Deployment frequency, CFR, FDRT
│   │   ├── swarmia.js                  ← DORA metrics, investment mix (stub)
│   │   └── apptio.js                   ← Cloud costs, unit cost-to-serve (MOR only, stub)
│   │
│   ├── transform/                      ← Pure functions — no API calls
│   │   ├── index.js                    ← Reads payload, applies RAG + exceptions, writes back
│   │   ├── calculate-kpis.js           ← applyRag(), calcTrend(), worstRag()
│   │   └── detect-exceptions.js        ← Auto-promotes breaches to exceptions[]
│   │
│   ├── generate/                       ← PPTX generation
│   │   ├── mor-slides.js               ← MOR Pillar 5 SRE section (5 slides)
│   │   └── wbr-slides.js               ← WBR pre-read (7 slides)
│   │
│   └── distribute/
│       ├── sharepoint.js               ← MS Graph API upload
│       └── teams-notify.js             ← Teams Incoming Webhook notification
│
├── input/
│   └── mor/                            ← Reference MOR source decks (not generated)
│
└── dist/                               ← Generated outputs — gitignored
    ├── data-payload.json               ← Intermediate payload (collect → transform → generate)
    ├── mor/                            ← Generated MOR slides
    └── wbr/                            ← Generated WBR pre-reads
```

---

## Data Sources

| Source | Metrics | Phase | Auth secret |
|---|---|---|---|
| **Dynatrace** (Grail / DQL) | SLO compliance, error budget, MTTD, synthetic availability | 1 | `DT_CLIENT_SECRET` |
| **JSM** (REST API) | Incidents, MTTR, CIM\*, PDR\* | 1 / 3\* | `JSM_API_TOKEN` |
| **OpsGenie** (REST API) | On-call burden ratio, alert SNR, rotation gaps | 2 | `OPSGENIE_API_KEY` |
| **GitHub Actions** (REST API) | Deployment frequency, CFR, FDRT | 2 | `GH_APP_PRIVATE_KEY` |
| **Swarmia** (REST API) | DORA metrics, PR latency, investment mix | 3 | `SWARMIA_API_KEY` |
| **Apptio** (REST API) | Cloud cost, unit cost-to-serve, run-rate (MOR only) | 3 | `APPTIO_API_KEY` |

\* CIM and PDR require JSM taxonomy fields (`detection_source`, `customer_impact_start`, `service_restored`). These are the blocking dependency for Phase 3. See [JSM Taxonomy Dependency](#jsm-taxonomy-dependency).

---

## Configuration

### RAG Thresholds — `config/thresholds.json`

All green/amber/red logic is in this file. To update a threshold:

```json
// Example: tighten SLO target from 99.5% to 99.9%
"slo_compliance_pct": {
  "green": { "gte": 99.9 },   // ← change here
  "amber": { "gte": 99.5, "lt": 99.9 },
  "red":   { "lt": 99.5 }
}
```

Both the MOR and WBR decks will reflect the new threshold on the next run. No code changes required.

### Products — `config/products.json`

Add new products as they onboard to SRE monitoring:

```json
{
  "id": "bl-safety",
  "name": "Brightlayer Safety",
  "tier": "T2",
  "category": "Cloud",
  "sre_owner": "REST Team",
  "dynatrace_service_ids": ["SERVICE-XXXXXXXX"],
  "dynatrace_slo_ids": ["XXXXXXXXXXXXXXXX"],
  "jsm_service_tag": "bl-safety",
  "onboarded": true
}
```

When `onboarded: false`, the product renders as a coverage gap (`⚠ onboarding Q3`) in both decks automatically.

### Schedule & Financials — `config/schedule.json`

Update monthly before each MOR run until Apptio integration is live:

```json
"financials": {
  "monthly_revenue_usd": 14000000,     // ← update each month
  "revenue_period": "April 2026",       // ← update each month
  "hours_per_month": 720,
  "hourly_revenue_at_risk_usd": 19444   // auto-calculated: monthly / 720
}
```

For the `workflow_dispatch` trigger, you can override `monthly_revenue_usd` directly as a workflow input — no file edit required.

---

## Running Locally

### Prerequisites

```powershell
node --version   # >= 20
npm --version    # >= 10
```

### Install dependencies

```powershell
cd reporting
npm install
```

### Full pipeline — mock data (no API keys required)

```powershell
# 1. Generate fixture payload
node src/collect/index.js --mode=wbr --mock

# 2. Apply RAG thresholds and detect exceptions
node src/transform/index.js --mode=wbr

# 3. Generate PPTX
node src/generate/wbr-slides.js

# Output: dist/wbr/BrightlayerWBR_SRE_PreRead_<DATE>.pptx
```

Same pattern for MOR:
```powershell
node src/collect/index.js --mode=mor --mock
node src/transform/index.js --mode=mor
node src/generate/mor-slides.js
# Output: dist/mor/BrightlayerMOR_Pillar5_SRE_<YEARMONTH>.pptx
```

### Full pipeline — live data (requires secrets)

Set environment variables from Azure Key Vault (or local `.env` file — never commit):

```powershell
$env:DT_ENV_ID        = "abc12345.live.dynatrace.com"
$env:DT_CLIENT_ID     = "dt0s02.XXXXXXXXXX"
$env:DT_CLIENT_SECRET = "dt0s02.XXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$env:JSM_BASE_URL     = "https://eaton.atlassian.net"
$env:JSM_PROJECT_KEY  = "SRE"
$env:JSM_API_TOKEN    = "XXXXXXXXXXXXXXXXXXXXXXXX"
$env:JSM_USER_EMAIL   = "sre-automation@eaton.com"

node src/collect/index.js --mode=wbr --window=7d
node src/transform/index.js --mode=wbr
node src/generate/wbr-slides.js
```

### Validate the payload schema

```powershell
node -e "
  const Ajv = require('ajv');
  const ajv = new Ajv();
  const schema = require('./schemas/data-payload.schema.json');
  const data   = require('./dist/data-payload.json');
  const valid  = ajv.validate(schema, data);
  console.log(valid ? '✅ Valid' : '❌ Invalid: ' + JSON.stringify(ajv.errors));
"
```

---

## GitHub Actions Workflows

### `wbr-generate.yml` — Weekly Business Review Pre-Read

| Property | Value |
|---|---|
| **Trigger** | Every Monday 17:00 UTC (cron) + `workflow_dispatch` |
| **Inputs frozen** | Tuesday 09:00 local (per WBR Playbook §5) |
| **Output** | `BrightlayerWBR_SRE_PreRead_<DATE>.pptx` |
| **SharePoint** | `SRE/WBR/<YEAR>/` |
| **Teams channel** | `sre-wbr` |
| **Artifact retention** | 90 days |

**Manual trigger (dry run — no upload, no Teams notification):**
1. GitHub → Actions → `WBR SRE Pre-Read Generation`
2. Run workflow → check `dry_run: true`
3. Download PPTX artifact from the workflow run

**Manual trigger (mock data — test without live APIs):**
1. Same as above → check `mock_data: true`

### `mor-generate.yml` — Monthly Operating Review Pillar 5 Slides

| Property | Value |
|---|---|
| **Trigger** | First Monday of each month 06:00 UTC (cron) + `workflow_dispatch` |
| **Output** | `BrightlayerMOR_Pillar5_SRE_<YEARMONTH>.pptx` |
| **SharePoint** | `SRE/MOR/<YEAR>/` |
| **Teams channel** | `sre-mor` |
| **Artifact retention** | 365 days |

**Override monthly revenue via `workflow_dispatch`:**
1. GitHub → Actions → `MOR SRE Pillar 5 Slide Generation`
2. Run workflow → fill `monthly_revenue_usd` input (e.g. `14500000`)
3. This overrides `config/schedule.json` for this run only

### Required GitHub Actions Variables (not secrets)

Set these in repository Settings → Secrets and variables → Actions → Variables:

| Variable | Example |
|---|---|
| `DT_ENV_ID` | `abc12345.live.dynatrace.com` |
| `JSM_BASE_URL` | `https://eaton.atlassian.net` |
| `JSM_PROJECT_KEY` | `SRE` |
| `SHAREPOINT_TENANT_ID` | Azure AD tenant GUID |
| `SHAREPOINT_SITE_ID` | SharePoint site ID or URL |
| `SHAREPOINT_DRIVE_ID` | Document library drive ID |

### Required GitHub Actions Secrets (from Azure Key Vault)

All secrets are retrieved at runtime via OIDC — none are stored in GitHub. The Key Vault name is `sre-reporting-kv`.

| Key Vault Secret | Used by |
|---|---|
| `DT-CLIENT-SECRET` | Dynatrace API |
| `DT-CLIENT-ID` | Dynatrace API |
| `JSM-API-TOKEN` | JSM REST API |
| `JSM-USER-EMAIL` | JSM REST API |
| `OPSGENIE-API-KEY` | OpsGenie API |
| `GH-APP-PRIVATE-KEY` | GitHub Actions API |
| `SWARMIA-API-KEY` | Swarmia API |
| `APPTIO-API-KEY` | Apptio (MOR only) |
| `SHAREPOINT-CLIENT-ID` | MS Graph API |
| `SHAREPOINT-CLIENT-SECRET` | MS Graph API |
| `TEAMS-WEBHOOK-URL` | Teams notification |

**GitHub Actions OIDC setup** — the workflow uses `azure/login@v2` with OIDC. Required GitHub Actions secrets (not from Key Vault):

| Secret | Value |
|---|---|
| `AZURE_CLIENT_ID` | Azure AD App registration client ID |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |

---

## Implementation Phasing

### Phase 1 — August 2026 (First automated WBR)

**Goal:** Publish first automated WBR pre-read with zero manual data entry.

**Activates:** SLO compliance, MTTR, platform call volume, incident counts, revenue-at-risk calculation.

**Work items:**
- [ ] Implement `src/collect/dynatrace.js` — `getSloCompliance()`, `getErrorBudget()`
- [ ] Implement `src/collect/jsm.js` — `getIncidents()`, `getMttr()`
- [ ] Implement `src/distribute/sharepoint.js` — MS Graph upload
- [ ] Implement `src/distribute/teams-notify.js` — Adaptive Card webhook
- [ ] Refactor `src/generate/wbr-slides.js` to read from `data-payload.json` (currently uses hardcoded values)
- [ ] Refactor `src/generate/mor-slides.js` to read from `data-payload.json`
- [ ] Deploy `wbr-generate.yml` and run first automated WBR (week of Aug 11, 2026)
- [ ] Install `ajv` and `ajv-formats` into `package.json` for schema validation

**Estimated effort:** 3–4 sprint days (Platform Engineering)

### Phase 2 — September 2026

**Goal:** Full Q2 WBR answer live. First automated MOR.

**Activates:** CFR, deployment frequency, on-call burden ratio, alert SNR.

**Work items:**
- [ ] Implement `src/collect/opsgenie.js`
- [ ] Implement `src/collect/github-actions.js` (CFR correlation: deploy timestamp ± 2h JSM incident window)
- [ ] Deploy `mor-generate.yml` — first automated MOR (September 2026)

**Estimated effort:** 3 sprint days (Platform Engineering)

### Phase 3 — Q4 2026 (Full automation — zero manual data entry)

**Blocked on:** JSM taxonomy standardization (see below).

**Activates:** PDR, CIM, MTTD, Toil Ratio, full product coverage MTTR, FinOps line.

**Work items:**
- [ ] JSM `detection_source` field enforced — PDR calculation live
- [ ] JSM `customer_impact_start` / `service_restored` fields — CIM live
- [ ] Implement `src/collect/dynatrace.js` — `getMttd()` (Davis AI timestamp join)
- [ ] Implement `src/collect/swarmia.js` — DORA metrics
- [ ] Implement `src/collect/apptio.js` — cloud cost, unit cost-to-serve
- [ ] All products onboarded in `config/products.json` with live DT entity IDs
- [ ] Add `ajv` schema validation as a required CI gate before generate

---

## JSM Taxonomy Dependency

PDR, CIM, and product-level MTTR all require custom JSM fields that do not yet exist:

| Field | JSM custom field key | Used by | Status |
|---|---|---|---|
| Detection source | `cf[detection_source]` | PDR | Needed in Phase 3 |
| Customer impact start | `cf[customer_impact_start]` | CIM | Needed in Phase 3 |
| Service restored | `cf[service_restored]` | CIM, MTTR | Needed in Phase 3 |
| Service/product tag | `cf[service_tag]` | MTTR per product | Needed in Phase 2 |

**Owner:** SRE Manager + JSM Admin
**Target:** Q3 2026
**Kickoff:** 24 June 2026 with product leads

Until these fields exist, Phase 3 metrics render as `N/A` with an explicit note in the deck.

---

## Adding a New Data Source

1. Create `src/collect/<source>.js` with documented function stubs matching the pattern in existing collectors.
2. Add the new metric(s) to `src/collect/index.js` with a `TODO Phase N` comment.
3. Add corresponding schema properties to `schemas/data-payload.schema.json`.
4. Add RAG thresholds to `config/thresholds.json`.
5. Add RAG application logic to `src/transform/calculate-kpis.js`.
6. Add rendering to the appropriate generate script (`mor-slides.js` or `wbr-slides.js`).
7. Add the secret name to `.github/workflows/wbr-generate.yml` and/or `mor-generate.yml`.

---

## Updating RAG Thresholds

1. Edit `config/thresholds.json`.
2. Run `node src/transform/index.js --mode=wbr` locally to verify the change applies correctly.
3. Commit. Both decks will use the updated thresholds on the next scheduled run.

Do **not** update thresholds in source code — `calculate-kpis.js` and the generate scripts read from `thresholds.json` exclusively.

---

## Troubleshooting

### Workflow fails at "Collect data" step

1. Check which collector threw the error in the step log.
2. Verify the corresponding Key Vault secret exists and has not expired (`sre-reporting-kv`).
3. Check API rate limits: Dynatrace (1000 req/min), JSM (depends on license), OpsGenie (500 req/min).
4. Re-run with `mock_data: true` to verify everything downstream is working.

### Workflow fails at "Validate data payload" step

1. Download the `wbr-data-payload-<run-id>` artifact.
2. Run schema validation locally: `node -e "const ajv = new (require('ajv'))(); console.log(ajv.validate(require('./schemas/data-payload.schema.json'), require('./dist/data-payload.json')))"`.
3. Fix the field causing the validation error in the relevant collector or transform function.

### PPTX is generated but data shows N/A for all metrics

The collect layer ran but APIs returned empty or null responses. Check `data_quality_warnings` in `dist/data-payload.json` — it lists which sources failed gracefully.

### Teams notification not delivered

Verify `TEAMS-WEBHOOK-URL` in Key Vault is the correct Incoming Webhook URL for the target channel (not expired — Teams webhooks don't expire but can be deleted). Test manually:
```powershell
$env:TEAMS_WEBHOOK_URL = "<webhook-url>"
node src/distribute/teams-notify.js --message="Test" --overall-rag=green
```

---

## Operational Runbook

### Monday pre-read missed (workflow failed or skipped)

1. Check GitHub Actions for the `WBR SRE Pre-Read Generation` run.
2. If failed: fix root cause and re-run via `workflow_dispatch` with `dry_run: false`.
3. If fix takes > 30 min: run with `mock_data: true` to publish a deck with stale-data watermarks, then re-run with live data once fixed.
4. If total failure: use previous week's deck, update the date on the cover slide manually, add an explicit note: *"DATA STALE — automation failure. Live data will be published [DATE]."*

### Threshold change required mid-cycle

Update `config/thresholds.json` and commit. The change takes effect on the next scheduled run — no deployment required. For an urgent in-cycle change (e.g., SLO target has been formally revised), trigger `workflow_dispatch` manually after committing the threshold update.

### Monthly revenue needs to be updated for MOR

Either:
- Update `config/schedule.json` → `financials.monthly_revenue_usd` and commit, **or**
- Pass `monthly_revenue_usd` as a `workflow_dispatch` input — overrides config for that run only without a commit.

### New product added to Brightlayer portfolio

Add an entry to `config/products.json` with `"onboarded": false` and `"onboarding_target": "Q[N] YYYY"`. The product will appear in the MTTR table immediately with an ⚠ onboarding note. Update `onboarded: true` and populate `dynatrace_service_ids` / `dynatrace_slo_ids` once monitoring is live.

---

*Owner: SRE Manager, Global Software Operations*
*Pipeline lead: Platform Engineering & Release Engineering*
*Last updated: June 2026*
