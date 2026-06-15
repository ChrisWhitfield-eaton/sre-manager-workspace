---
applyTo: "**/.github/workflows/**,**/*.yml,**/*pipeline*,**/*cicd*,**/*deploy*"
---

# CI/CD Pipeline Standards

## Platform

GitHub Actions is the CI/CD platform. The organization is migrating from Azure DevOps Pipelines. All new pipeline development must use GitHub Actions.

## Workflow Architecture

- Each service has its own workflow file in `.github/workflows/`.
- Shared steps are extracted into **reusable workflows** (`.github/workflows/reusable-*.yml`) called via `workflow_call`.
- Reusable workflows cover: Coverity SAST, Black Duck SCA, JFrog Artifactory publish, Dynatrace SRE Guardian evaluation.

## Per-Service Pipeline Stages

```
Code Push → Build & Test → Security Scan → Publish Artifact → Update GitOps → FluxCD Sync → DT Guardian → SRE Gate
```

- **Code Push:** PR merge to `main` triggers the workflow.
- **Build & Test:** Unit + integration tests.
- **Security Scan:** Coverity SAST + Black Duck SCA (reusable workflow).
- **Publish Artifact:** Container image + Helm chart → JFrog Artifactory.
- **Update GitOps:** PR to environment overlay in the GitOps repo.
- **FluxCD Sync:** Cluster pulls and applies the new overlay. FluxCD handles all in-cluster delivery.
- **DT Guardian:** Dynatrace SRE Guardian evaluates SLOs during a 30-minute bake window (staging).
- **SRE Gate:** Production requires SRE team approval or certified auto-deploy status.

## Security Principles

- **Cloud-hosted runners only.** No self-hosted GitHub Actions agents.
- **Least-privilege permissions.** Only the permissions needed for each step. No `GITHUB_TOKEN` with `write-all`.
- **Branch protection:** CI must pass, at least one peer review, no direct pushes to `main`.
- **No secrets in code.** Secrets come from GitHub Actions secrets or Azure Key Vault.

## Environment Promotion

| Environment | Trigger | Exit Gate |
|---|---|---|
| Dev | Auto on PR merge | Green CI |
| QA | Auto from Dev | Integration tests + DT synthetic pass |
| Staging | Manual from QA | DT SRE Guardian SLO evaluation (30-min bake) |
| Production | Manual from Staging | Guardian gate + JSM change record + SRE approval |

## Artifact Management

- JFrog Artifactory (SaaS) is the universal artifact repository.
- Container images and Helm charts are published to Artifactory, not GitHub Container Registry.
- Artifact retention follows environment tier: dev (7 days), QA (30 days), staging/prod (indefinite).

## Infrastructure Pipeline (Separate)

Infrastructure changes follow their own pipeline in a dedicated repository:
```
PR Raised → Validate + Lint (TFlint, Checkov, TFsec) → TF Plan → Peer Review → JSM CR (prod) → TF Apply
```
