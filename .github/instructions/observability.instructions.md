---
applyTo: "**/*monitor*,**/*alert*,**/*slo*,**/*sli*,**/*dashboard*,**/*dynatrace*,**/*telemetry*,**/*observability*,**/*dql*"
---

# Observability & Monitoring Standards

## Platform

Dynatrace is the observability platform. Grail is the data backend. Davis AI provides anomaly detection. Do not suggest Prometheus, Grafana, Datadog, or New Relic.

## Telemetry Pillars

The SRE organization maintains three telemetry framework documents:

1. **Infrastructure Telemetry Framework** — Host, container, Kubernetes, cloud platform, and network signals.
2. **Software Telemetry Framework** — Distributed traces, service-level metrics, and application logs via OpenTelemetry.
3. **Digital Experience Telemetry Framework** — RUM (web + mobile), synthetic monitoring, and third-party API monitoring via Dynatrace.

When producing observability guidance, reference the appropriate framework.

## SLI/SLO Standards

- SLOs are configured in Dynatrace using DQL-backed SLI definitions.
- Every production service must have at minimum: availability SLO, latency SLO (p95), and error rate SLO.
- Error budget policies define the response when budgets are consumed: alert → freeze → PIR.
- SRE Guardian validates SLOs during deployment bake windows (staging and production).

## DQL (Dynatrace Query Language)

When writing DQL queries:
- Use `fetch` as the entry point: `fetch logs`, `fetch metrics`, `fetch events`, `fetch bizevents`.
- Use `filter` for conditions, `summarize` for aggregations, `sort` for ordering.
- Time ranges: `from: -2h`, `from: -7d`, `timeframe: "2024-01-01T00:00:00Z/2024-01-02T00:00:00Z"`.
- Dynatrace MCP Server enables live DQL execution from agent context.

## Dashboard Audience Tiers

| Audience | Content | Format |
|---|---|---|
| Executive (SVP+) | PDR trend, CIM trend, SLO compliance %, platform availability, IOM SLA compliance — RAG indicators, business impact, cost | Power BI — plain language, outcome framing |
| Engineering Manager | SLO burn rates, error budget remaining, PDR, MTTR by severity, CFR, on-call burden, CLT trends | Power BI or Dynatrace dashboard |
| SRE / Operator | Golden signals, active alerts, deployment status, MTTD, alert signal-to-noise, toil ratio | Dynatrace dashboard with DQL |
| Developer | Service health, SLO status for owned services, trace analysis, error details, deployment frequency | Dynatrace dashboard |

## Alert Quality

- Every alert must have: a defined severity, a runbook link, an owning team (from JSM Assets), and a clear condition with threshold.
- Noise reduction: prefer anomaly-based (Davis AI) over static thresholds where applicable.
- Alert routing: Dynatrace → OpsGenie → REST on-call rotation.

## PII Caution

- Device IDs in this IoT platform map to residential premises addresses. They constitute PII.
- Session Replay is out of scope pending GDPR/PII review.
- Any telemetry that captures device-to-user mapping requires legal review before enablement.
