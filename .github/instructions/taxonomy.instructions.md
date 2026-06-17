---
applyTo: "**/*taxonomy*,**/*assets*,**/*service-model*,**/*service catalog*,**/*cmdb*,**/*queue-mapping*"
---

# Brightlayer Taxonomy Standards (Pre-SRE Catalog Scope)

## Authoritative Source

JSM Assets (Insight) is the system of record for service taxonomy, ownership, and routing.

## Locked Hierarchy

Use this hierarchy exactly unless an explicit governance decision changes it:

- Product Family: **Brightlayer**
- Platform: **Brightlayer Cloud Platform**
- Business Service: **Remote Monitoring Platform (Fiji)**

Brightlayer On-Prem Platform is planned and will be added later under Product Family Brightlayer.

## Scope Boundary

- Include product/platform taxonomy objects (business + technical services, CI relationships).
- Exclude SRE-owned service catalog domains (for example, observability catalog services) from product/platform/business-service taxonomy.
- SRE catalog items are modeled in a separate SRE taxonomy.

## Fiji Classification Baseline

### Business Service children (customer-facing)

- Ops Console
- Plant Console
- Production Console
- Energy Console
- Technician Mobile App

### Technical domains (product scope)

- Identity & Access
- Data Plane
- Monitoring & Alarms
- Device Management
- Analytics
- Production & Quality
- Integration & Orchestration
- Presentation & UX

## Modeling Rules

- Business Service = customer-facing experience.
- Technical Service = reusable capability supporting one or more business services.
- Configuration Item (CI) = infrastructure or external provider dependency.
- Do not model infrastructure (AKS, Event Hub, ADX, storage, etc.) or external providers (Okta, SendGrid, Twilio, etc.) as business services.
- Route incidents by technical domain queue ownership, not by UI/application names.

## Required Fields for Taxonomy Objects

Every production taxonomy object should include:

- Canonical Name
- Class (Product Family / Platform / Business Service / Technical Service / CI)
- Parent Object
- Engineering Owner Team
- SRE Support Owner
- Tier (T1/T2/T3)
- Queue Name
- Customer Facing (Yes/No)
- Statuspage Exposure (Yes/No/Conditional)

