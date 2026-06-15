---
applyTo: "**/*policy*,**/*adr*,**/*ADR*,**/*standard*,**/*framework*,**/*P13*,**/*manifest*,**/*.prompt.md"
---

# Policy & ADR Authoring Standards

## Policy Architecture — Three Layers

All SRE governance documents follow the P13 (SRE, Monitoring & Observability) three-layer architecture:

### Layer 1 — Values
- Principles and beliefs that define why the organization cares about reliability.
- Completely tool-agnostic. Must survive a complete toolchain replacement.
- Example: "Production systems must be observable."
- Written in plain language for executive and cross-functional audiences.

### Layer 2 — Requirements
- Measurable standards and rules that define what must be true.
- Tool-agnostic. References capabilities, not products.
- Example: "Every production service must have an availability SLO with a defined error budget policy."
- Written for engineering managers and senior engineers.

### Layer 3 — Technology
- Implementation specifics that define how requirements are met with current tools.
- Vendor-aware. Names Dynatrace, JSM, Backstage, GitHub Actions, etc.
- These markdown documents serve as AI agent guardrails in GitHub repositories.
- Example: "Availability SLOs are configured in Dynatrace using DQL-backed SLI definitions."
- Written for SREs and platform engineers.

**Critical rule:** Never mix layers in a single document. If a document names a vendor, it is Layer 3.

## ADR Structure

Architecture Decision Records follow the standard template:

```markdown
# ADR-NNN: [Title]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNN
**Date:** YYYY-MM-DD
**Deciders:** [Names/Roles]

## Context
[What is the issue that motivates this decision?]

## Decision
[What is the change being proposed?]

## Consequences
[What becomes easier or harder as a result?]

## Alternatives Considered
[What other options were evaluated and why were they rejected?]
```

## ADR Companion System (Three Artifacts)

Every ADR that affects AI-assisted workflows requires three artifacts:

1. **ADR document** (`ADR-NNN_Title.md`) — The human-readable decision record.
2. **Prompt sidecar** (`ADR-NNN_Title.prompt.md`) — Agent-consumable translation of the ADR. Written as instructions an AI agent can follow.
3. **Agent manifest** (`agent-manifest.md`) — Registry of all `.prompt.md` files. Used by GitHub Actions CI gate to enforce companion coverage.

When creating or editing an ADR, always check whether a `.prompt.md` sidecar is needed and whether `agent-manifest.md` needs updating.

## Policy Lifecycle & Manifest

Policies follow the same companion pattern as ADRs but have a formal lifecycle managed through `policy-manifest.md` in the `sre-policy` repository.

### Policy Lifecycle States

| Status | Meaning | Agent Behavior |
|---|---|---|
| Draft | Under development. Not yet reviewed or approved. | Do not enforce. |
| Active | Approved and in effect. Compliance is mandatory. | Enforce via `.prompt.md` sidecar. |
| Deprecated | No longer in effect. | Do not enforce or reference. |
| Superseded | Replaced by a newer policy. | Follow the successor instead. |

### Policy Artifacts (Three per Policy)

1. **Policy document** (`PXX_Title.md`) — Human-readable. Contains Layer 1 values, Layer 2 requirements, Layer 3 technology.
2. **`.prompt.md` sidecar** (`PXX_Title.prompt.md`) — Agent-consumable. Written in imperative voice. This is what agents follow.
3. **Manifest entry** — One row in `policy-manifest.md` with status, sidecar path, owner, and effective date.

### Authoring a `.prompt.md` Sidecar

When writing a policy or ADR sidecar:

- Write in imperative voice: "You must...", "Never...", "Always...", "Do not..."
- Organize by layer: Values (V-numbered), Requirements (R-numbered), Technology (T-numbered).
- Requirements must be measurable and testable — not aspirational.
- Technology items must name the specific tool and configuration. This is the only layer where vendor names appear.
- Include the policy status at the top: `# Status: Active`
- If a requirement has a threshold or SLA, state the exact number (e.g., "Critical ≤ 48 hours", not "promptly").

### Adding a New Policy to Agent Enforcement

1. Author the policy document in `sre-policy/policies/PXX/`.
2. Write the `.prompt.md` sidecar in the same directory.
3. Add a row to `policy-manifest.md` with Status = Active and the sidecar path.
4. The GitHub Actions CI gate validates that every Active policy with a declared sidecar has a valid file at the declared path.

## Governance References

Use these reference codes when linking to specific governance items:
- `OBS-NNN` — Observability standards
- `INC-NNN` — Incident management standards
- `CHG-NNN` — Change management standards
- `SEC-NNN` — Security standards
- `PLT-NNN` — Platform engineering standards
