/**
 * transform/calculate-kpis.js
 * Applies RAG thresholds to the data payload and calculates
 * trend direction for each metric.
 *
 * RAG logic is driven entirely by config/thresholds.json —
 * no thresholds are hardcoded here.
 */

/**
 * Apply RAG thresholds to all metrics in the payload.
 * Adds a `rag` field and `trend` field (↑ / ↓ / →) to each metric.
 *
 * @param {Object} payload - raw data payload from collect layer
 * @param {Object} thresholds - from config/thresholds.json
 * @returns {Object} enriched payload
 */
function applyRag(payload, thresholds) {
  const p = { ...payload };

  if (p.slo_compliance?.value != null) {
    p.slo_compliance.rag = calcRag(p.slo_compliance.value, thresholds.slo_compliance_pct);
    p.slo_compliance.trend = calcTrend(p.slo_compliance.history);
  }

  if (p.error_budget?.value != null) {
    p.error_budget.rag = calcRag(p.error_budget.value, thresholds.error_budget_remaining_pct);
    p.error_budget.trend = calcTrend(p.error_budget.history);
  }

  if (p.mttr) {
    p.mttr.critical.rag = calcRag(p.mttr.critical.breaches, thresholds.mttr_critical_breaches, true);
    p.mttr.high.rag     = calcRag(p.mttr.high.breaches, thresholds.mttr_high_breaches, true);
  }

  if (p.cfr?.value != null) {
    p.cfr.rag = calcRag(p.cfr.value, thresholds.cfr_pct);
  }

  if (p.pdr?.value != null) {
    p.pdr.rag = calcRag(p.pdr.value, thresholds.pdr_pct);
  }

  if (p.on_call_burden?.ratio != null) {
    p.on_call_burden.rag = calcRag(p.on_call_burden.ratio, thresholds.on_call_burden_ratio);
    p.on_call_burden.trend = calcTrend(p.on_call_burden.history);
  }

  if (p.toil_ratio?.value != null) {
    p.toil_ratio.rag = calcRag(p.toil_ratio.value, thresholds.toil_ratio_pct);
    p.toil_ratio.trend = calcTrend(p.toil_ratio.history);
  }

  if (p.alert_snr?.value != null) {
    p.alert_snr.rag = calcRag(p.alert_snr.value, thresholds.alert_snr_pct);
  }

  if (p.iom_compliance) {
    if (p.iom_compliance.critical_sla_pct != null)
      p.iom_compliance.critical_rag = calcRag(p.iom_compliance.critical_sla_pct, thresholds.iom_critical_sla_pct);
    if (p.iom_compliance.high_sla_pct != null)
      p.iom_compliance.high_rag = calcRag(p.iom_compliance.high_sla_pct, thresholds.iom_high_sla_pct);
  }

  // Overall RAG: worst of all non-null metric RAGs
  p.overall_rag = worstRag([
    p.slo_compliance?.rag,
    p.mttr?.critical?.rag,
    p.mttr?.high?.rag,
    p.cfr?.rag,
    p.pdr?.rag,
    p.on_call_burden?.rag,
    p.toil_ratio?.rag,
  ]);

  return p;
}

/**
 * Evaluate a value against a threshold rule set.
 * Rule set format (from thresholds.json): { green: {gte: X}, amber: {gte: Y, lt: X}, red: {lt: Y} }
 * lowerIsBetter: for breach counts (e.g. MTTR breaches), invert the direction
 */
function calcRag(value, rules, lowerIsBetter = false) {
  if (value == null || rules == null) return "na";

  for (const level of ["green", "amber", "red"]) {
    const rule = rules[level];
    if (!rule) continue;
    if (matches(value, rule)) return level;
  }
  return "na";
}

function matches(value, rule) {
  if (rule.eq  != null && value !== rule.eq)  return false;
  if (rule.gte != null && value < rule.gte)   return false;
  if (rule.gt  != null && value <= rule.gt)   return false;
  if (rule.lte != null && value > rule.lte)   return false;
  if (rule.lt  != null && value >= rule.lt)   return false;
  return true;
}

/**
 * Calculate trend from a 6-value history array.
 * Returns "↑" (improving), "↓" (degrading), or "→" (stable).
 * Stable = last 2 values within 0.5% of each other.
 */
function calcTrend(history) {
  if (!history || history.length < 2) return "→";
  const last   = history[history.length - 1];
  const prev   = history[history.length - 2];
  const delta  = last - prev;
  const pct    = Math.abs(delta) / (Math.abs(prev) || 1) * 100;
  if (pct < 0.5) return "→";
  return delta > 0 ? "↑" : "↓";
}

/**
 * Returns the worst RAG from an array of RAG values.
 */
function worstRag(rags) {
  const order = { red: 3, amber: 2, green: 1, na: 0 };
  const sorted = (rags || []).filter(Boolean).sort((a, b) => (order[b] || 0) - (order[a] || 0));
  return sorted[0] || "na";
}

module.exports = { applyRag, calcRag, calcTrend, worstRag };
