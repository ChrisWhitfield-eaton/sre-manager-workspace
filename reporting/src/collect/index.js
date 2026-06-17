/**
 * collect/index.js
 * Entry point for the data collection layer.
 * Orchestrates all source collectors and writes dist/data-payload.json.
 *
 * Usage:
 *   node src/collect/index.js --mode=wbr --window=7d
 *   node src/collect/index.js --mode=mor --window=30d
 *   node src/collect/index.js --mode=wbr --mock   (uses fixture data, no live API calls)
 */

const path = require("path");
const fs   = require("fs");
const args = require("minimist")(process.argv.slice(2));

const mode   = args.mode   || "wbr";   // "wbr" | "mor"
const window = args.window || "7d";
const mock   = !!args.mock;

// Collectors — uncomment as each is implemented
// const dynatrace     = require("./dynatrace");
// const jsm           = require("./jsm");
// const opsgenie      = require("./opsgenie");
// const githubActions = require("./github-actions");
// const swarmia       = require("./swarmia");
// const apptio        = require("./apptio");   // MOR only

const schedule = require("../../config/schedule.json");
const products = require("../../config/products.json");

async function collect() {
  console.log(`[collect] mode=${mode} window=${window} mock=${mock}`);

  const now   = new Date();
  const start = new Date(now.getTime() - parseDays(window) * 86400000);

  const payload = {
    generated_at: now.toISOString(),
    mode,
    period: {
      start: start.toISOString().slice(0, 10),
      end:   now.toISOString().slice(0, 10),
    },
    week_label: `Week of ${formatDate(now)}`,
    data_quality_warnings: [],

    // --- Populated by collectors (stubbed with null until live) ---
    slo_compliance:    null,
    error_budget:      null,
    cim:               null,
    mttr:              null,
    cfr:               null,
    pdr:               null,
    mttd:              null,
    on_call_burden:    null,
    toil_ratio:        null,
    alert_snr:         null,
    iom_compliance:    null,
    deployment_freq:   null,
    revenue_at_risk:   buildRevenueAtRisk(schedule),
    product_coverage:  buildProductCoverage(products),
    exceptions:        [],
    aging_radar:       [],
  };

  // TODO Phase 1: uncomment and implement each collector
  // payload.slo_compliance = await dynatrace.getSloCompliance({ start, end: now });
  // payload.mttr           = await jsm.getMttr({ start, end: now });
  // payload.cim            = await jsm.getCim({ start, end: now });
  // payload.on_call_burden = await opsgenie.getOnCallBurden(schedule.sre_headcount);

  // TODO Phase 2:
  // payload.cfr            = await githubActions.getCfr({ start, end: now });
  // payload.alert_snr      = await opsgenie.getAlertSnr({ start, end: now });

  // TODO Phase 3:
  // payload.pdr            = await jsm.getPdr({ start, end: now });
  // payload.mttd           = await dynatrace.getMttd({ start, end: now });
  // if (mode === "mor") payload.iom_compliance = await apptio.getCosts({ start, end: now });

  // Write payload
  const outDir = path.join(__dirname, "../../dist");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "data-payload.json");
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`[collect] ✅ Payload written to ${outPath}`);
}

function buildRevenueAtRisk(schedule) {
  const { monthly_revenue_usd, hourly_revenue_at_risk_usd, revenue_period } = schedule.financials;
  return { monthly_revenue_usd, hourly_revenue_at_risk_usd, revenue_period };
}

function buildProductCoverage(products) {
  return products.products.map(p => ({
    id:        p.id,
    name:      p.name,
    tier:      p.tier,
    onboarded: p.onboarded,
    onboarding_target: p.onboarding_target || null,
  }));
}

function parseDays(window) {
  const match = window.match(/^(\d+)d$/);
  return match ? parseInt(match[1]) : 7;
}

function formatDate(d) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

collect().catch(err => { console.error("[collect] ❌", err); process.exit(1); });
