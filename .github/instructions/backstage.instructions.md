---
applyTo: "**/*backstage*,**/*catalog-info*,**/*golden-path*,**/*scorecard*,**/*template*,**/*idp*"
---

# Backstage & Platform Engineering Standards

## Current Status: Backstage IDP is Deferred

Backstage implementation has been delayed. Do not reference Backstage as a current capability. The following are dormant until Backstage resumes:

- `catalog-info.yaml` files in service repositories
- Helm chart `sre:` annotations
- Golden path templates
- SRE scorecards
- Backstage service catalog UI

## Service Ownership — Current State

JSM Assets (Insight) is the single source of truth for service ownership. All service metadata — owning team, service tier, escalation contacts, dependencies, and environment mappings — lives in JSM Assets. This feeds:

- Incident routing and JSM queue assignment
- PIR service identification
- Change management impact assessment
- Escalation path resolution (REST → owning Software Product Team)

## When Backstage Resumes

When Backstage is re-activated, the migration path is:

1. JSM Assets service objects seed the Backstage service catalog (Assets → `catalog-info.yaml` generation).
2. `catalog-info.yaml` files are added to service repositories as the developer-facing ownership layer.
3. SRE scorecards and golden path templates are built on top of the populated catalog.
4. JSM Assets remains the operational source of truth; Backstage becomes the developer experience layer.

Nothing built in JSM Assets during the deferral period is wasted — it becomes the foundation for Backstage population.

## Provisioning Chain (Current — Without Backstage)

GitHub Actions → Terraform → Azure. Without Backstage, there is no self-service portal for repo/pipeline provisioning. Teams request new services through standard Jira Software stories assigned to Platform Engineering.

When Backstage resumes, the chain becomes: Backstage → GitHub Actions → Terraform → Azure.

## Platform Engineering Responsibilities (Current)

With Backstage deferred, Platform Engineering focuses on:

- FluxCD GitOps operations and platform cluster management
- CI/CD pipeline development (GitHub Actions reusable workflows)
- SRE tooling and automation
- JSM Assets service object maintenance and schema governance
- Preparing Backstage prerequisites so resumption is low-friction
