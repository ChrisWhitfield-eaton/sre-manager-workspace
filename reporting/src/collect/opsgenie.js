/**
 * collect/jsm.js
 * Collects incident, MTTR, CIM, PDR, and escalation data from
 * Jira Service Management (JSM) REST API.
 *
 * Phase 1 implementation target: August 2026
 * Phase 3 dependency: PDR + CIM require JSM taxonomy fields:
 *   - cf[detection_source]         ("monitoring" | "customer-reported")
 *   - cf[customer_impact_start]    (datetime: when customer impact began)
 *   - cf[service_restored]         (datetime: when service was restored)
 *
 * Required secrets (Azure Key Vault):
 *   JSM_API_TOKEN   — Atlassian API token
 *   JSM_USER_EMAIL  — Service account email
 *
 * Required env vars:
 *   JSM_BASE_URL    — https://eaton.atlassian.net
 *   JSM_PROJECT_KEY — SRE project key
 */

const https = require("https");

const BASE_URL     = process.env.JSM_BASE_URL    || "https://eaton.atlassian.net";
const PROJECT_KEY  = process.env.JSM_PROJECT_KEY || "SRE";
const API_TOKEN    = process.env.JSM_API_TOKEN;
const USER_EMAIL   = process.env.JSM_USER_EMAIL;

/**
 * Get incidents for the period, grouped by severity.
 * @returns {Object} incidents payload fragment
 */
async function getIncidents({ start, end }) {
  // TODO Phase 1:
  // POST /rest/api/3/search with JQL:
  //   project = SRE AND issuetype = Incident
  //   AND created >= "YYYY-MM-DD" AND created <= "YYYY-MM-DD"
  // Group by priority field → p1/p2/p3/p4 counts
  throw new Error("getIncidents not yet implemented — Phase 1");
}

/**
 * Calculate MTTR per severity from JSM incident timestamps.
 * MTTR = resolutiondate - created (filtered to incidents with resolution)
 *
 * @returns {Object} mttr payload fragment with breach counts and history
 */
async function getMttr({ start, end }) {
  // TODO Phase 1:
  // POST /rest/api/3/search JQL: project=SRE AND issuetype=Incident AND resolved>=start
  // For each incident: delta = resolutiondate - created
  // Count breaches: Critical >2h, High >4h, Medium >3d, Low >5d
  throw new Error("getMttr not yet implemented — Phase 1");
}

/**
 * Calculate Customer Impacted Minutes (CIM).
 * REQUIRES JSM taxonomy fields: cf[customer_impact_start] + cf[service_restored]
 *
 * CIM = sum(service_restored - customer_impact_start) for P1/P2 incidents
 *
 * @returns {Object} cim payload fragment
 */
async function getCim({ start, end }) {
  // TODO Phase 3 (blocked on JSM taxonomy):
  // POST /rest/api/3/search JQL: issuetype=Incident AND priority in (P1,P2)
  //   AND created >= start
  // Sum (cf[service_restored] - cf[customer_impact_start]) in minutes
  throw new Error("getCim not yet implemented — Phase 3 (blocked on JSM taxonomy)");
}

/**
 * Calculate Proactive Detection Ratio (PDR).
 * REQUIRES JSM taxonomy field: cf[detection_source]
 *
 * PDR = incidents where detection_source = "monitoring" / total incidents
 *
 * @returns {Object} pdr payload fragment
 */
async function getPdr({ start, end }) {
  // TODO Phase 3 (blocked on JSM taxonomy):
  // POST /rest/api/3/search JQL: issuetype=Incident AND created >= start
  // Count where cf[detection_source] = "monitoring" vs total
  throw new Error("getPdr not yet implemented — Phase 3 (blocked on JSM taxonomy)");
}

/**
 * Get open escalations count by severity.
 * @returns {Object} escalations payload fragment
 */
async function getOpenEscalations() {
  // TODO Phase 1:
  // POST /rest/api/3/search JQL:
  //   issuetype = "Engineering Escalation" AND status != Done
  // Group by priority
  throw new Error("getOpenEscalations not yet implemented — Phase 1");
}

module.exports = { getIncidents, getMttr, getCim, getPdr, getOpenEscalations };
