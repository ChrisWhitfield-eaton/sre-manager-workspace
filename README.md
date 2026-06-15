# SRE Manager Workspace — Setup Guide

## Workspace Structure

```
sre-manager-workspace/
├── sre-manager.code-workspace          ← Multi-root workspace file (open this in VS Code)
├── AGENTS.md                           ← Team-shared agent definition (commit to your repos)
├── .gitignore                          ← Protects credentials and excludes .vscode/
├── .github/
│   ├── copilot-instructions.md         ← YOUR personal agent instructions (always-on)
│   ├── context/
│   │   └── manager-briefing.md         ← Persistent session context (update weekly)
│   └── instructions/
│       ├── backstage.instructions.md   ← Activates when editing *backstage*, *catalog-info*
│       ├── cicd.instructions.md        ← Activates when editing workflows/, *pipeline*, *deploy*
│       ├── iac.instructions.md         ← Activates when editing *.tf, modules/, environments/
│       ├── incident.instructions.md    ← Activates when editing *incident*, *pir*, *runbook*
│       ├── kpi.instructions.md         ← Activates when editing *kpi*, *metric*, *dashboard*, *wbr*
│       ├── observability.instructions.md ← Activates when editing *monitor*, *slo*, *dashboard*
│       └── policy.instructions.md      ← Activates when editing *policy*, *adr*, *standard*
├── .vscode/
│   └── mcp.json                        ← MCP server connections (gitignored — each user maintains locally)
```

### Companion Repo: sre-policy

```
sre-policy/
├── AGENTS.md                           ← Team-shared agent definition (same copy)
├── .gitignore
├── policy-manifest.md                  ← Registry of all policies with lifecycle status
└── policies/
    └── P13/
        └── P13_SRE_Monitoring_Observability.prompt.md  ← Agent-consumable policy sidecar
```

## How It Works

### Layer 1: Always-On Instructions (`copilot-instructions.md`)

Every interaction with Copilot in this workspace automatically includes your personal agent instructions. These define your role, your two teams, your KPIs, your toolchain, and your working principles. You never need to re-explain organizational context.

### Layer 2: Domain-Scoped Instructions (`.instructions.md` files)

When you open or edit files matching specific patterns, the corresponding domain instructions activate automatically. If you're editing a Terraform file, the IaC standards load. If you're writing a PIR, the incident management context loads. Multiple instruction files can activate simultaneously.

### Layer 3: MCP Servers (`mcp.json`)

MCP connections turn your workspace into an operational control plane. Instead of switching to browser tabs for Dynatrace, Jira, or GitHub, you query them directly from the agent. Requires VS Code setting `chat.mcp.enabled` = true (may require IT approval on managed machines).

### Layer 4: Session Context (`manager-briefing.md`)

At the start of a session, attach this file to your prompt: `#file:.github/context/manager-briefing.md`. This gives the agent your current priorities, team status, open PIRs, and active initiatives without re-explaining.

### Layer 5: Policy Compliance (`AGENTS.md` + `policy-manifest.md`)

`AGENTS.md` teaches agents to consult `policy-manifest.md` in the `sre-policy` repository before producing artifacts that touch infrastructure, observability, incident management, change management, or security. Agents follow only Active policies via their `.prompt.md` sidecars. Policy lifecycle: Draft → Active → Deprecated → Superseded.

### AGENTS.md (Team-Shared)

Copy `AGENTS.md` to the root of any repository your team works in. It provides baseline SRE context and policy compliance instructions for every team member's agent, regardless of their personal instructions.

## Prerequisites

### Node.js

Required for MCP servers that use `npx`. Install via PowerShell:

```powershell
winget install OpenJS.NodeJS.LTS
```

If Node.js is installed but not recognized in PowerShell or VS Code, add it to your PowerShell profile:

```powershell
Add-Content -Path $PROFILE -Value "`n# Node.js`n`$env:PATH += `";C:\Program Files\nodejs`""
```

Close and reopen PowerShell to verify:

```powershell
node --version
npx --version
```

### npm Corporate Proxy (if applicable)

If `npx` returns `SELF_SIGNED_CERT_IN_CHAIN` errors on a corporate network, the network is doing SSL inspection. Quick fix:

```powershell
npm config set strict-ssl false
```

Long-term fix — point npm at your corporate CA certificate:

```powershell
npm config set cafile "C:\path\to\corporate-ca.pem"
npm config set strict-ssl true
```

### VS Code MCP Setting

MCP servers require `chat.mcp.enabled` = true in VS Code settings. On managed corporate machines, this may require IT approval. The setting can be found at: `Ctrl+,` → search `chat.mcp.enabled`.

## Setup Steps

### 1. Environment Variables

Set these before opening the workspace. Restart VS Code after setting them.

**PowerShell (Windows) — persistent, user-level:**

```powershell
# Dynatrace
[Environment]::SetEnvironmentVariable("DT_ENVIRONMENT", "https://your-environment.apps.dynatrace.com", "User")
[Environment]::SetEnvironmentVariable("DYNATRACE_API_TOKEN", "dt0c01.XXXXXXXX.XXXXXXXXXXXXXXXX", "User")

# GitHub
[Environment]::SetEnvironmentVariable("GITHUB_PAT", "ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", "User")

# Atlassian (Jira + Confluence)
[Environment]::SetEnvironmentVariable("ATLASSIAN_SITE_URL", "https://your-org.atlassian.net", "User")
[Environment]::SetEnvironmentVariable("ATLASSIAN_USER_EMAIL", "your.email@eaton.com", "User")
[Environment]::SetEnvironmentVariable("ATLASSIAN_API_TOKEN", "XXXXXXXXXXXXXXXXXXXXXXXX", "User")
```

Also add to your PowerShell profile for session availability:

```powershell
Add-Content -Path $PROFILE -Value "`$env:DT_ENVIRONMENT = `"https://your-environment.apps.dynatrace.com`""
```

To verify after restarting PowerShell:

```powershell
$env:DT_ENVIRONMENT
$env:GITHUB_PAT
$env:ATLASSIAN_SITE_URL
```

**Bash (macOS/Linux) — add to `~/.bashrc` or `~/.zshrc`:**

```bash
# Dynatrace
export DT_ENVIRONMENT="https://your-environment.apps.dynatrace.com"
export DYNATRACE_API_TOKEN="dt0c01.XXXXXXXX.XXXXXXXXXXXXXXXX"

# GitHub
export GITHUB_PAT="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Atlassian (Jira + Confluence)
export ATLASSIAN_SITE_URL="https://your-org.atlassian.net"
export ATLASSIAN_USER_EMAIL="your.email@eaton.com"
export ATLASSIAN_API_TOKEN="XXXXXXXXXXXXXXXXXXXXXXXX"
```

### 2. Open the Workspace

Launch VS Code from a PowerShell window that has Node.js in its PATH:

```powershell
code sre-manager.code-workspace
```

### 3. Install MCP Servers

Requires `chat.mcp.enabled` = true (see Prerequisites).

**Dynatrace:** `Ctrl+Shift+P` → "MCP: Add Server" → NPM Package → `@dynatrace-oss/dynatrace-mcp-server`

**GitHub:** `Ctrl+Shift+P` → "MCP: Add Server" → Browse MCP Servers → search "GitHub"

**Atlassian:** `Ctrl+Shift+P` → "MCP: Add Server" → Browse MCP Servers → search "Atlassian"

To verify: `Ctrl+Shift+P` → "MCP: List Servers"

### 4. Fill Out the Manager Briefing

Edit `.github/context/manager-briefing.md` with your current state. This is your weekly ritual.

### 5. Commit AGENTS.md to Repos

Copy `AGENTS.md` to the root of your infrastructure, platform-engineering, runbooks, and github-actions-workflows repositories.

### 6. Initialize the Policy Repo

Clone or create the `sre-policy` repository alongside your workspace. Copy the `sre-policy` starter (policy-manifest.md, AGENTS.md, and P13 sidecar) into it.

## Usage Patterns

| What You're Doing | What Loads | Example Prompt |
|---|---|---|
| Writing Terraform | copilot-instructions + iac.instructions | "Add a new AKS node pool for the EMEA region" |
| Drafting a PIR | copilot-instructions + incident.instructions | "Draft the PIR for last night's P1 on service-auth" |
| Building a pipeline | copilot-instructions + cicd.instructions | "Create a reusable workflow for SCA scanning" |
| Writing an ADR | copilot-instructions + policy.instructions | "Draft ADR-003 for the OpsGenie routing strategy" |
| Working on KPIs | copilot-instructions + kpi.instructions | "Calculate PDR for last month from JSM incident data" |
| Querying production | copilot-instructions + observability.instructions + Dynatrace MCP | "What's the p95 latency for service-api-gw over the last 24h?" |
| Planning the week | copilot-instructions + manager-briefing | "#file:.github/context/manager-briefing.md — What should I focus on this week?" |

## Maintenance

- **Weekly:** Update `manager-briefing.md` with current state.
- **Monthly:** Review `.instructions.md` files for accuracy as toolchain evolves. Review `policy-manifest.md` for policy lifecycle changes.
- **On team change:** Update `copilot-instructions.md` headcount and team structure.
- **On toolchain change:** Update the toolchain table and "What Not to Do" section.
- **On policy change:** Update the relevant `.prompt.md` sidecar and `policy-manifest.md` status.
