/**
 * distribute/teams-notify.js
 * Posts a summary notification to a Microsoft Teams channel
 * via an Incoming Webhook.
 *
 * Phase 1 implementation target: August 2026
 *
 * Required secrets (Azure Key Vault):
 *   TEAMS_WEBHOOK_URL  — Incoming webhook URL for the target channel
 *
 * Usage:
 *   node src/distribute/teams-notify.js
 *     --channel=sre-wbr
 *     --message="WBR SRE Pre-Read published for week of 17-Jun-2026"
 *     --url="https://sharepoint/..."
 *     --overall-rag=green
 */

const https = require("https");
const args  = require("minimist")(process.argv.slice(2));

const WEBHOOK_URL  = process.env.TEAMS_WEBHOOK_URL;
const channel      = args.channel      || "sre-wbr";
const message      = args.message      || "SRE Pre-Read published";
const fileUrl      = args.url          || "";
const overallRag   = args["overall-rag"] || "na";

const RAG_EMOJI = { green: "🟢", amber: "🟡", red: "🔴", na: "⚪" };
const RAG_COLOR = { green: "00B050", amber: "FF9900", red: "E70000", na: "CCD2D8" };

/**
 * Post an Adaptive Card notification to a Teams channel via webhook.
 * Card includes: overall RAG, message, and link to SharePoint file.
 *
 * @param {Object} options - { message, fileUrl, overallRag }
 */
async function notify({ message, fileUrl, overallRag }) {
  // TODO Phase 1:
  // POST to TEAMS_WEBHOOK_URL with Adaptive Card payload:
  // {
  //   "type": "message",
  //   "attachments": [{
  //     "contentType": "application/vnd.microsoft.card.adaptive",
  //     "content": {
  //       "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  //       "type": "AdaptiveCard",
  //       "version": "1.4",
  //       "body": [
  //         { "type": "TextBlock", "text": `${RAG_EMOJI[overallRag]} ${message}`, "weight": "Bolder" },
  //         { "type": "TextBlock", "text": `Channel: ${channel}`, "isSubtle": true }
  //       ],
  //       "actions": fileUrl ? [{ "type": "Action.OpenUrl", "title": "Open Pre-Read", "url": fileUrl }] : []
  //     }
  //   }]
  // }

  const emoji = RAG_EMOJI[overallRag] || RAG_EMOJI.na;
  console.log(`[distribute/teams] TODO: post to ${channel}`);
  console.log(`[distribute/teams] ${emoji} ${message}`);
  if (fileUrl) console.log(`[distribute/teams] URL: ${fileUrl}`);
  console.log("[distribute/teams] ⚠  Not yet implemented — Phase 1");
}

notify({ message, fileUrl, overallRag }).catch(err => {
  console.error("[distribute/teams] ❌", err);
  process.exit(1);
});

module.exports = { notify };
