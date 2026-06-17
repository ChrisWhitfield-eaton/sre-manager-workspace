/**
 * distribute/sharepoint.js
 * Uploads the generated PPTX to a SharePoint document library
 * via the Microsoft Graph API.
 *
 * Phase 1 implementation target: August 2026
 *
 * Required secrets (Azure Key Vault):
 *   SHAREPOINT_CLIENT_ID      — Azure AD App registration client ID
 *   SHAREPOINT_CLIENT_SECRET  — Azure AD App client secret
 *   SHAREPOINT_TENANT_ID      — Azure AD tenant ID
 *
 * Required env vars:
 *   SHAREPOINT_SITE_ID        — Graph site ID or site URL
 *   SHAREPOINT_DRIVE_ID       — Document library drive ID
 */

const fs   = require("fs");
const path = require("path");
const args = require("minimist")(process.argv.slice(2));

const filePath = args.file;
const folder   = args.folder || "SRE";

/**
 * Upload a file to SharePoint via Microsoft Graph API.
 * Uses simple PUT for files < 4MB; chunked upload session for larger files.
 *
 * @param {string} localFilePath - absolute path to the PPTX file
 * @param {string} remoteFolder  - SharePoint folder path (e.g. "SRE/WBR/2026")
 */
async function uploadToSharePoint(localFilePath, remoteFolder) {
  // TODO Phase 1:
  // 1. Acquire OAuth2 token: POST https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token
  //    scope: https://graph.microsoft.com/.default
  // 2. PUT https://graph.microsoft.com/v1.0/sites/{siteId}/drives/{driveId}/root:/{folder}/{filename}:/content
  //    Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation
  //    Body: file buffer
  // 3. Log the returned webUrl for Teams notification

  const filename = path.basename(localFilePath);
  console.log(`[distribute/sharepoint] TODO: upload ${filename} → ${remoteFolder}/${filename}`);
  console.log(`[distribute/sharepoint] ⚠  Not yet implemented — Phase 1`);
}

if (filePath) {
  uploadToSharePoint(filePath, folder).catch(err => {
    console.error("[distribute/sharepoint] ❌", err);
    process.exit(1);
  });
}

module.exports = { uploadToSharePoint };
