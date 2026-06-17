/**
 * collect/opsgenie.js
 * Collects on-call burden ratio and alert signal-to-noise ratio
 * from the OpsGenie REST API.
 *
 * Phase 2 implementation target: September 2026
 *
 * Required secrets (Azure Key Vault):
 *   OPSGENIE_API_KEY  — OpsGenie API key (Integration API key)
 *
 * Base URL: https://api.opsgenie.com/v2
 */

const BASE_URL = "https://api.opsgenie.com/v2";
const API_KEY  = process.env.OPSGENIE_API_KEY;

/**
 * Calculate on-call burden ratio.
 * Ratio = engineers_actively_on_call / total_sre_headcount
 * Benchmark: 1:4 (Google SRE)
 *
 * @param {Object} headcount - { total: number, on_call_eligible: number }
 * @returns {Object} on_call_burden payload fragment
 */
async function getOnCallBurden(headcount) {
  // TODO Phase 2:
  // GET /schedules → list all SRE schedules
  // GET /schedules/{id}/on-calls?flat=true → active participants
  // Count unique participants currently on-call
  // ratio = on_call_count / headcount.total
  throw new Error("getOnCallBurden not yet implemented — Phase 2");
}

/**
 * Calculate alert signal-to-noise ratio.
 * SNR = alerts where status = "acknowledged" AND acknowledged = true / total alerts fired
 *
 * @param {Object} params - { start: Date, end: Date }
 * @returns {Object} alert_snr payload fragment
 */
async function getAlertSnr({ start, end }) {
  // TODO Phase 2:
  // GET /alerts?createdAt[gte]=start&createdAt[lte]=end&limit=100 (paginate)
  // Count total, count where acknowledged=true and status in [acknowledged, closed]
  // SNR % = actioned / total * 100
  throw new Error("getAlertSnr not yet implemented — Phase 2");
}

/**
 * Detect on-call rotation gaps (hours with no primary on-call engineer).
 *
 * @returns {Array} gaps array with { start, end, hours } objects
 */
async function getRotationGaps() {
  // TODO Phase 2:
  // GET /schedules/on-calls?scheduleIdentifierType=name&flat=true
  // Walk 7-day timeline, identify hours with 0 participants
  throw new Error("getRotationGaps not yet implemented — Phase 2");
}

module.exports = { getOnCallBurden, getAlertSnr, getRotationGaps };
