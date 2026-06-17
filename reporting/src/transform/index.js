/**
 * transform/index.js
 * Entry point for the transform layer.
 * Reads dist/data-payload.json (raw), applies RAG thresholds,
 * calculates trends, detects exceptions, and writes the final payload.
 *
 * Usage:
 *   node src/transform/index.js --mode=wbr
 *   node src/transform/index.js --mode=mor
 */

const fs   = require("fs");
const path = require("path");
const args = require("minimist")(process.argv.slice(2));

const mode = args.mode || "wbr";

const thresholds = require("../../config/thresholds.json");
const { applyRag }          = require("./calculate-kpis");
const { detectExceptions }  = require("./detect-exceptions");

async function transform() {
  const payloadPath = path.join(__dirname, "../../dist/data-payload.json");
  if (!fs.existsSync(payloadPath)) {
    throw new Error(`data-payload.json not found at ${payloadPath}. Run collect first.`);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));
  console.log(`[transform] mode=${mode} payload period=${payload.period.start} → ${payload.period.end}`);

  // Apply RAG thresholds to each metric
  const enriched = applyRag(payload, thresholds);

  // Auto-promote breaches to exceptions[]
  enriched.exceptions = detectExceptions(enriched, thresholds);

  // Write back
  fs.writeFileSync(payloadPath, JSON.stringify(enriched, null, 2));
  console.log(`[transform] ✅ RAG + exceptions applied. ${enriched.exceptions.length} exception(s) detected.`);
}

transform().catch(err => { console.error("[transform] ❌", err); process.exit(1); });
