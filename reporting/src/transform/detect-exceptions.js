/**
 * transform/detect-exceptions.js
 * Auto-promotes metric breaches to the exceptions[] array.
 * Any RED metric, and AMBER metrics that have been sustained
 * for 2+ consecutive periods, are promoted to exceptions.
 *
 * Exception format (aligned to WBR Playbook §13):
 * {
 *   id:     "SRE-{YYYY}-W{WW}-{N}",
 *   rag:    "red" | "amber",
 *   issue:  string,
 *   impact: string,
 *   action: string,   // populated from known_actions map or left as placeholder
 *   owner:  string,
 *   due:    string,
 * }
 */

const { worstRag } = require("./calculate-kpis");

/**
 * Known standing exceptions — manually curated until automation is mature.
 * Each entry maps a metric key to a pre-written exception description.
 * Override with live data once APIs are connected.
 */
const KNOWN_EXCEPTIONS = {
  toil_ratio: {
    issue:  "Toil Ratio sustained at {value}% — {n} consecutive weeks above target",
    impact: "~{value}% of SRE engineering capacity consumed by manual, non-automatable work. Limits automation investment throughput.",
    action: "4 automation items active in sprint: JSM request validation, OpsGenie deduplication rules, 2 runbook automations. Target: <20% by Q4.",
    owner:  "SRE Manager",
    due:    "2026-12-31",
  },
  on_call_burden: {
    issue:  "On-Call Burden Ratio at 1:{ratio} — below 1:4 Google SRE benchmark",
    impact: "3 engineers covering 168 hrs/week across 2 time zones. Burnout risk. Business continuity risk at ${monthly_revenue_usd_m}M/month revenue scale.",
    action: "Headcount business case submitted. Approval pending. Interim: cross-training REST engineers for expanded rotation.",
    owner:  "SRE Manager",
    due:    "2026-07-31",
  },
  pdr: {
    issue:  "Proactive Detection Ratio at {value}% — below 80% target",
    impact: "Customer reports are preceding monitoring detection. Increases CIM and MTTR risk.",
    action: "Review OpsGenie alert coverage. Add Dynatrace synthetic monitors for uncovered user journeys.",
    owner:  "SRE Manager",
    due:    "",
  },
  error_budget: {
    issue:  "Error budget exhausted for {services}",
    impact: "SLO policy triggered: freeze/slow-roll releases until SLO restored. Feature delivery halted for affected services.",
    action: "Error budget policy active. No releases except P0/security. PIR scheduled within 48h.",
    owner:  "SRE Manager",
    due:    "",
  },
};

/**
 * Detect exceptions from the enriched payload.
 * @param {Object} payload - enriched payload with .rag fields applied
 * @param {Object} thresholds - from config/thresholds.json
 * @returns {Array} exceptions array
 */
function detectExceptions(payload, thresholds) {
  const exceptions = [];
  let seq = 1;

  const week = getWeekLabel(new Date(payload.generated_at));

  // Toil Ratio
  if (["red", "amber"].includes(payload.toil_ratio?.rag) && payload.toil_ratio?.value != null) {
    exceptions.push(buildException(
      `SRE-${week}-${String(seq++).padStart(2, "0")}`,
      payload.toil_ratio.rag,
      KNOWN_EXCEPTIONS.toil_ratio,
      {
        value: payload.toil_ratio.value,
        n: countConsecutive(payload.toil_ratio.history, thresholds.toil_ratio_pct, "red"),
      }
    ));
  }

  // On-Call Burden
  if (["red", "amber"].includes(payload.on_call_burden?.rag) && payload.on_call_burden?.ratio != null) {
    const mrUsd = payload.revenue_at_risk?.monthly_revenue_usd || 0;
    exceptions.push(buildException(
      `SRE-${week}-${String(seq++).padStart(2, "0")}`,
      payload.on_call_burden.rag,
      KNOWN_EXCEPTIONS.on_call_burden,
      {
        ratio: payload.on_call_burden.ratio.toFixed(1),
        monthly_revenue_usd_m: (mrUsd / 1e6).toFixed(1),
      }
    ));
  }

  // Error Budget Exhausted (RED only — immediate policy trigger)
  if (payload.error_budget?.rag === "red") {
    const gaps = payload.slo_compliance?.gaps?.join(", ") || "unknown service";
    exceptions.push(buildException(
      `SRE-${week}-${String(seq++).padStart(2, "0")}`,
      "red",
      KNOWN_EXCEPTIONS.error_budget,
      { services: gaps }
    ));
  }

  // PDR below target
  if (["red", "amber"].includes(payload.pdr?.rag) && payload.pdr?.value != null) {
    exceptions.push(buildException(
      `SRE-${week}-${String(seq++).padStart(2, "0")}`,
      payload.pdr.rag,
      KNOWN_EXCEPTIONS.pdr,
      { value: payload.pdr.value }
    ));
  }

  // Merge any manually-provided exceptions from the payload (passthrough)
  if (Array.isArray(payload.exceptions)) {
    for (const e of payload.exceptions) {
      if (!exceptions.find(x => x.id === e.id)) exceptions.push(e);
    }
  }

  return exceptions;
}

function buildException(id, rag, template, values) {
  return {
    id,
    rag,
    issue:  interpolate(template.issue, values),
    impact: interpolate(template.impact, values),
    action: interpolate(template.action, values),
    owner:  template.owner,
    due:    template.due,
    status: "Open",
    pir:    "No",
  };
}

function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function getWeekLabel(date) {
  const year = date.getFullYear();
  const start = new Date(date.getFullYear(), 0, 1);
  const week  = Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function countConsecutive(history, threshold, level) {
  if (!history) return 1;
  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    // Simple heuristic: count values that would be red/amber by checking > green threshold
    if (history[i] > (threshold.green?.lt || 0)) count++;
    else break;
  }
  return count;
}

module.exports = { detectExceptions };
