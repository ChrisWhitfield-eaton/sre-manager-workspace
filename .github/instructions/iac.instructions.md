---
applyTo: "**/*.tf,**/*.tfvars,**/modules/**,**/environments/**"
---

# Infrastructure as Code Standards

## Terraform Conventions

- **Provider:** Azure is primary (`azurerm`). AWS and GCP modules exist but are secondary.
- **State:** Azure Blob Storage backend with per-environment state locking. Never suggest local state.
- **Module structure:** `modules/<resource>/` with `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf`.
- **Environments:** `environments/dev|qa|staging|prod/` with per-environment `terraform.tfvars`.
- **Naming:** Snake_case for resources and variables. Prefix resources with environment: `${var.environment}-${var.service_name}`.

## Provisioning Chain

GitHub Actions → Terraform → Azure. This is the current provisioning chain. Backstage IDP is deferred; when it resumes, it will sit at the front as the self-service portal (Backstage → GitHub Actions → Terraform → Azure). FluxCD handles only in-cluster reconciliation — it does not provision infrastructure.

## Production Change Rules

- Production `terraform apply` requires two PR approvers (DevOps + SRE).
- Production changes require a JSM change record before apply.
- Dev and QA apply automatically on PR merge with a single approver.

## Security Agents in IaC

- Dynatrace OneAgent: Deployed via `helm_release` (dynatrace-operator). Owned by SRE.
- CrowdStrike Falcon: Deployed via `helm_release` (falcon-sensor). Owned by Security + SRE.
- Microsoft Defender: Transitioning out. Do not add new Defender configurations.

## Key Terraform Resources

| Resource | Module Path | Owner |
|---|---|---|
| AKS clusters | `modules/aks/` | SRE + DevOps |
| PostgreSQL Flexible Server | `modules/databases/` | DevOps + DBA |
| Redis Cache | `modules/databases/` | DevOps |
| Application Gateway (AGIC) | `modules/gateway/` | DevOps + Networking |
| Key Vault | `modules/keyvault/` | Security + SRE |

## What Not to Suggest

- Do not suggest Crossplane for infrastructure provisioning. Terraform is the standard.
- Do not suggest self-hosted GitHub Actions runners. FluxCD eliminates the need for agents with kubeconfig access.
- Do not put secrets in `tfvars`. All secrets come from Azure Key Vault or GitHub Actions secrets.
