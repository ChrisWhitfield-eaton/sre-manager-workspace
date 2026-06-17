/**
 * Brightlayer MOR — Pillar 5: Platform Reliability & Operations
 * Generates slides to insert into the existing MOR deck.
 *
 * Matches June 2026 MOR visual style:
 *   - Slide dimensions: 13.33" × 7.5" (widescreen)
 *   - Primary font: Aptos (fallback: Segoe UI)
 *   - Eaton primary blue: #005EB8
 *   - Dark navy: #003865
 *   - Gray: #5B6770
 *   - Light gray bg: #E7EAED / #CCD2D8
 *   - RAG: Green #00B050 · Amber #FF9900 · Red #E70000
 */

const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// ── Color constants ──────────────────────────────────────────────────────────
const C = {
  eatonBlue:   "005EB8",
  navy:        "003865",
  gray:        "5B6770",
  lightGray:   "E7EAED",
  midGray:     "CCD2D8",
  white:       "FFFFFF",
  black:       "000000",
  green:       "00B050",
  amber:       "FF9900",
  red:         "E70000",
  teal:        "00B2A9",
  darkRed:     "9D2235",
};

// ── Shared helpers ────────────────────────────────────────────────────────────

function addSectionHeader(slide, pillarLabel, title) {
  // Dark navy left bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.18, h: 7.5,
    fill: { color: C.navy },
    line: { color: C.navy },
  });
  // Top blue bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.18, y: 0, w: 13.15, h: 0.6,
    fill: { color: C.eatonBlue },
    line: { color: C.eatonBlue },
  });
  // Pillar label
  slide.addText(pillarLabel, {
    x: 0.35, y: 0.08, w: 8, h: 0.44,
    fontSize: 11, bold: true, color: C.white,
    fontFace: "Aptos", valign: "middle",
  });
  // Slide title
  slide.addText(title, {
    x: 0.35, y: 0.65, w: 12.5, h: 0.55,
    fontSize: 18, bold: true, color: C.navy,
    fontFace: "Aptos",
  });
  // Bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.18, y: 7.25, w: 13.15, h: 0.25,
    fill: { color: C.midGray },
    line: { color: C.midGray },
  });
  slide.addText("© 2026 Eaton. All Rights Reserved. Confidential (IP Level 3)", {
    x: 0.35, y: 7.27, w: 10, h: 0.2,
    fontSize: 7, color: C.gray, fontFace: "Aptos",
  });
}

function ragDot(slide, x, y, status) {
  const colorMap = { green: C.green, amber: C.amber, red: C.red, na: C.gray };
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: 0.2, h: 0.2,
    fill: { color: colorMap[status] || C.gray },
    line: { color: colorMap[status] || C.gray },
  });
}

function sectionLabel(slide, x, y, w, text, bgColor) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h: 0.28,
    fill: { color: bgColor || C.eatonBlue },
    line: { color: bgColor || C.eatonBlue },
  });
  slide.addText(text, {
    x, y, w, h: 0.28,
    fontSize: 8.5, bold: true, color: C.white,
    fontFace: "Aptos", align: "center", valign: "middle",
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Section divider: Pillar 5 intro
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();

  // Full dark navy background
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  // Eaton blue accent band
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 3.1, w: 0.22, h: 1.9,
    fill: { color: C.eatonBlue }, line: { color: C.eatonBlue },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.22, y: 3.1, w: 13.11, h: 0.04,
    fill: { color: C.eatonBlue }, line: { color: C.eatonBlue },
  });

  slide.addText("Pillar 5", {
    x: 0.5, y: 2.4, w: 12, h: 0.6,
    fontSize: 22, bold: false, color: C.teal,
    fontFace: "Aptos", align: "left",
  });
  slide.addText("Platform Reliability & Operations", {
    x: 0.5, y: 2.95, w: 12, h: 1.0,
    fontSize: 36, bold: true, color: C.white,
    fontFace: "Aptos", align: "left",
  });
  slide.addText("SRE — Site Reliability Engineering", {
    x: 0.5, y: 3.95, w: 12, h: 0.5,
    fontSize: 16, bold: false, color: C.midGray,
    fontFace: "Aptos", align: "left",
  });
  slide.addText("June 2026  ·  Global Software Operations", {
    x: 0.5, y: 6.8, w: 12, h: 0.4,
    fontSize: 10, color: C.gray, fontFace: "Aptos",
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Executive Scorecard (one-page summary)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addSectionHeader(slide, "Pillar 5  ·  Platform Reliability & Operations", "SRE Executive Scorecard — June 2026");

  // Revenue context banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.35, y: 1.28, w: 12.6, h: 0.38,
    fill: { color: C.lightGray }, line: { color: C.midGray },
  });
  slide.addText(
    "Platform context:  ~2B platform calls processed in North America in June  ·  Revenue run-rate: ~$14.0M/month  ·  Revenue at risk per P1 hour: ~$19,400",
    {
      x: 0.45, y: 1.28, w: 12.4, h: 0.38,
      fontSize: 9, color: C.navy, fontFace: "Aptos", valign: "middle", bold: false,
    }
  );

  // Table header
  const hdrY = 1.75;
  const cols = [
    { label: "Metric", x: 0.35, w: 3.1 },
    { label: "Business Meaning", x: 3.5, w: 3.8 },
    { label: "Target", x: 7.35, w: 1.5 },
    { label: "June Actual", x: 8.9, w: 1.6 },
    { label: "Trend", x: 10.55, w: 0.8 },
    { label: "RAG", x: 11.4, w: 1.25 },
  ];

  cols.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, {
      x: col.x, y: hdrY, w: col.w, h: 0.3,
      fill: { color: C.navy }, line: { color: C.navy },
    });
    slide.addText(col.label, {
      x: col.x + 0.05, y: hdrY, w: col.w - 0.1, h: 0.3,
      fontSize: 8.5, bold: true, color: C.white,
      fontFace: "Aptos", valign: "middle",
    });
  });

  // Table rows
  const rows = [
    {
      metric: "SLO Compliance",
      meaning: "Are we meeting our service commitments?",
      target: "≥ 99.5%",
      actual: "99.9%",
      trend: "→",
      rag: "green",
      note: "",
    },
    {
      metric: "Error Budget Remaining",
      meaning: "How much reliability headroom remains?",
      target: "> 20%",
      actual: "—",
      trend: "—",
      rag: "na",
      note: "⚠ Dynatrace SLO configuration in progress",
    },
    {
      metric: "Customer Impacted Minutes (CIM)",
      meaning: "Total customer-facing outage minutes this month",
      target: "0 P1 / P2",
      actual: "0 P1 incidents",
      trend: "→",
      rag: "green",
      note: "",
    },
    {
      metric: "Mean Time to Restore (MTTR)",
      meaning: "Speed of recovery after impact",
      target: "Critical ≤ 2h\nHigh ≤ 4h",
      actual: "0 Critical\n1 High breach",
      trend: "↑",
      rag: "amber",
      note: "1× High MTTR breach (DIT) — process issue resolved",
    },
    {
      metric: "Change Failure Rate (CFR)",
      meaning: "% of deployments that caused degradation",
      target: "< 5%",
      actual: "—",
      trend: "—",
      rag: "na",
      note: "⚠ GitHub Actions + JSM correlation in progress (Q3)",
    },
    {
      metric: "Proactive Detection Ratio (PDR)",
      meaning: "Are we finding problems before customers do?",
      target: "≥ 80%",
      actual: "—",
      trend: "—",
      rag: "na",
      note: "⚠ JSM classification field required (Q3)",
    },
  ];

  rows.forEach((row, i) => {
    const rowY = hdrY + 0.3 + i * 0.62;
    const rowBg = i % 2 === 0 ? C.white : C.lightGray;

    cols.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, {
        x: col.x, y: rowY, w: col.w, h: 0.6,
        fill: { color: rowBg }, line: { color: C.midGray, pt: 0.5 },
      });
    });

    // Metric name
    slide.addText(row.metric, {
      x: 0.4, y: rowY + 0.03, w: 3.0, h: 0.3,
      fontSize: 9, bold: true, color: C.navy, fontFace: "Aptos", valign: "top",
    });
    if (row.note) {
      slide.addText(row.note, {
        x: 0.4, y: rowY + 0.32, w: 3.0, h: 0.25,
        fontSize: 7.5, color: C.gray, fontFace: "Aptos", valign: "top", italic: true,
      });
    }

    // Business meaning
    slide.addText(row.meaning, {
      x: 3.55, y: rowY + 0.05, w: 3.7, h: 0.52,
      fontSize: 8.5, color: C.black, fontFace: "Aptos", valign: "middle",
    });
    // Target
    slide.addText(row.target, {
      x: 7.4, y: rowY + 0.05, w: 1.4, h: 0.52,
      fontSize: 8.5, color: C.gray, fontFace: "Aptos", valign: "middle",
    });
    // Actual
    slide.addText(row.actual, {
      x: 8.95, y: rowY + 0.05, w: 1.5, h: 0.52,
      fontSize: 9, bold: true, color: C.navy, fontFace: "Aptos", valign: "middle",
    });
    // Trend
    const trendColor = row.trend === "↑" ? C.green : row.trend === "↓" ? C.red : C.gray;
    slide.addText(row.trend, {
      x: 10.6, y: rowY + 0.05, w: 0.7, h: 0.52,
      fontSize: 14, bold: true, color: trendColor,
      fontFace: "Aptos", align: "center", valign: "middle",
    });
    // RAG dot
    ragDot(slide, 11.65, rowY + 0.2, row.rag);
  });

  // Coverage note
  slide.addText(
    "Coverage: Brightlayer Cloud (BLC/Fiji), Lighting, DIT.  Full portfolio mapping (Power, EPMS, DCIM) in progress — Q3 target.",
    {
      x: 0.35, y: 7.05, w: 12.6, h: 0.18,
      fontSize: 7.5, color: C.gray, fontFace: "Aptos", italic: true,
    }
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Uptime & Availability (replaces/upgrades Slide 21)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addSectionHeader(slide, "Pillar 5  ·  Platform Reliability & Operations", "SRE Uptime & Availability — Brightlayer Platforms");

  // Two region columns: NA and EMEA
  const regions = [
    {
      name: "North America",
      slo: "99.9%",
      sloRag: "green",
      calls: "~2B",
      incidents: "0 P1  ·  0 P2  ·  3 P3",
      incidentRag: "green",
      note: "Operating at significant production scale. SLA compliance sustained across all monitored services.",
    },
    {
      name: "EMEA",
      slo: "99.9%",
      sloRag: "green",
      calls: "—",
      incidents: "0 P1  ·  0 P2  ·  0 P3",
      incidentRag: "green",
      note: "Meeting SLAs at current traffic volumes. Lower volume provides stable foundation for growth. Regional on-call coverage expansion planned Q3.",
    },
  ];

  regions.forEach((r, i) => {
    const bx = 0.35 + i * 6.3;
    const bw = 6.0;
    const by = 1.35;

    // Region header
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: bw, h: 0.38,
      fill: { color: C.eatonBlue }, line: { color: C.eatonBlue },
    });
    slide.addText(r.name, {
      x: bx + 0.1, y: by, w: bw - 0.2, h: 0.38,
      fontSize: 13, bold: true, color: C.white,
      fontFace: "Aptos", valign: "middle",
    });

    // SLO tile
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by + 0.42, w: bw / 2 - 0.05, h: 1.3,
      fill: { color: C.lightGray }, line: { color: C.midGray },
    });
    slide.addText("SLO Compliance", {
      x: bx + 0.1, y: by + 0.5, w: bw / 2 - 0.25, h: 0.28,
      fontSize: 9, color: C.gray, fontFace: "Aptos",
    });
    slide.addText(r.slo, {
      x: bx + 0.1, y: by + 0.78, w: bw / 2 - 0.25, h: 0.6,
      fontSize: 32, bold: true, color: C.navy, fontFace: "Aptos",
    });
    ragDot(slide, bx + bw / 2 - 0.4, by + 0.9, r.sloRag);

    // Calls tile
    slide.addShape(pptx.ShapeType.rect, {
      x: bx + bw / 2 + 0.05, y: by + 0.42, w: bw / 2 - 0.05, h: 1.3,
      fill: { color: C.lightGray }, line: { color: C.midGray },
    });
    slide.addText("Platform Calls", {
      x: bx + bw / 2 + 0.15, y: by + 0.5, w: bw / 2 - 0.25, h: 0.28,
      fontSize: 9, color: C.gray, fontFace: "Aptos",
    });
    slide.addText(r.calls, {
      x: bx + bw / 2 + 0.15, y: by + 0.78, w: bw / 2 - 0.25, h: 0.6,
      fontSize: r.calls === "—" ? 22 : 28, bold: true, color: C.navy, fontFace: "Aptos",
    });

    // Incident summary
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by + 1.78, w: bw, h: 0.48,
      fill: { color: i === 0 ? "EAF4EA" : C.lightGray }, line: { color: C.midGray },
    });
    slide.addText("Incidents this period:", {
      x: bx + 0.1, y: by + 1.82, w: 1.5, h: 0.38,
      fontSize: 8.5, color: C.gray, fontFace: "Aptos", valign: "middle",
    });
    slide.addText(r.incidents, {
      x: bx + 1.6, y: by + 1.82, w: bw - 1.7, h: 0.38,
      fontSize: 9, bold: true, color: C.navy, fontFace: "Aptos", valign: "middle",
    });
    ragDot(slide, bx + bw - 0.35, by + 1.93, r.incidentRag);

    // Narrative
    slide.addText(r.note, {
      x: bx + 0.05, y: by + 2.32, w: bw - 0.1, h: 0.9,
      fontSize: 9, color: C.black, fontFace: "Aptos", valign: "top",
    });
  });

  // Business framing callout
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.35, y: 5.6, w: 12.6, h: 0.9,
    fill: { color: "EEF4FB" }, line: { color: C.eatonBlue, pt: 1 },
  });
  slide.addText("💡  Business context", {
    x: 0.5, y: 5.65, w: 2.2, h: 0.3,
    fontSize: 9, bold: true, color: C.eatonBlue, fontFace: "Aptos",
  });
  slide.addText(
    "Uptime & Availability protects revenue and enables enterprise customer trust.  At current run-rate (~$14.0M/month), each hour of P1 downtime represents ~$19,400 in revenue at risk.  SLA compliance is the platform's hard commitment to customers.",
    {
      x: 0.5, y: 5.95, w: 12.3, h: 0.5,
      fontSize: 9, color: C.navy, fontFace: "Aptos",
    }
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — MTTR by Product (upgrades Slide 22)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addSectionHeader(slide, "Pillar 5  ·  Platform Reliability & Operations", "Brightlayer Products — SRE Mean Time to Restore (MTTR)");

  slide.addText("MTTR measures how quickly we recover from infrastructure incidents.  Faster MTTR = fewer Customer Impacted Minutes = lower revenue exposure.", {
    x: 0.35, y: 1.28, w: 12.6, h: 0.32,
    fontSize: 9, color: C.gray, fontFace: "Aptos", italic: true,
  });

  // Table
  const products = [
    { product: "Brightlayer Cloud (BLC / Fiji)", tier: "T1", critical: "0 breaches", high: "0 breaches", cim: "0 min", rag: "green", note: "Fiji 3.0 deployment automation reduced blast radius 97%. 30+ services independently deployable." },
    { product: "Brightlayer Lighting", tier: "T1", critical: "0 breaches", high: "0 breaches", cim: "0 min", rag: "green", note: "Now fully under SRE monitoring. Improvement sustained vs. prior quarter." },
    { product: "Brightlayer DIT", tier: "T2", critical: "0 breaches", high: "1 breach (process)", cim: "0 min", rag: "amber", note: "Breach caused by incorrect ServiceNow request format — not API/system failure. Corrective action in May. JSM migration will eliminate root cause." },
    { product: "Brightlayer Power", tier: "T2", critical: "—", high: "—", cim: "—", rag: "na", note: "⚠ SRE monitoring onboarding in progress — Q3 target." },
    { product: "Brightlayer EPMS", tier: "T2", critical: "—", high: "—", cim: "—", rag: "na", note: "⚠ SRE monitoring onboarding in progress — Q3 target." },
    { product: "Brightlayer DCIM", tier: "T2", critical: "—", high: "—", cim: "—", rag: "na", note: "⚠ SRE monitoring onboarding in progress — Q3 target." },
  ];

  const hdrY = 1.65;
  const tblCols = [
    { label: "Product", x: 0.35, w: 3.0 },
    { label: "Tier", x: 3.4, w: 0.5 },
    { label: "Critical MTTR\n(target ≤ 2h)", x: 3.95, w: 1.6 },
    { label: "High MTTR\n(target ≤ 4h)", x: 5.6, w: 1.6 },
    { label: "CIM", x: 7.25, w: 0.9 },
    { label: "RAG", x: 8.2, w: 0.6 },
    { label: "Notes", x: 8.85, w: 4.1 },
  ];

  tblCols.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, {
      x: col.x, y: hdrY, w: col.w, h: 0.36,
      fill: { color: C.navy }, line: { color: C.navy },
    });
    slide.addText(col.label, {
      x: col.x + 0.04, y: hdrY, w: col.w - 0.08, h: 0.36,
      fontSize: 8, bold: true, color: C.white,
      fontFace: "Aptos", valign: "middle",
    });
  });

  products.forEach((p, i) => {
    const rowY = hdrY + 0.36 + i * 0.72;
    const rowBg = i % 2 === 0 ? C.white : C.lightGray;

    tblCols.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, {
        x: col.x, y: rowY, w: col.w, h: 0.7,
        fill: { color: rowBg }, line: { color: C.midGray, pt: 0.5 },
      });
    });

    slide.addText(p.product, { x: 0.4, y: rowY + 0.04, w: 2.9, h: 0.62, fontSize: 8.5, bold: true, color: C.navy, fontFace: "Aptos", valign: "middle" });
    slide.addText(p.tier, { x: 3.44, y: rowY + 0.04, w: 0.42, h: 0.62, fontSize: 8.5, color: C.gray, fontFace: "Aptos", valign: "middle", align: "center" });
    slide.addText(p.critical, { x: 3.99, y: rowY + 0.04, w: 1.52, h: 0.62, fontSize: 8.5, color: C.navy, fontFace: "Aptos", valign: "middle", align: "center" });
    slide.addText(p.high, { x: 5.64, y: rowY + 0.04, w: 1.52, h: 0.62, fontSize: 8.5, color: p.high.includes("breach") ? C.amber : C.navy, fontFace: "Aptos", valign: "middle", align: "center", bold: p.high.includes("breach") });
    slide.addText(p.cim, { x: 7.29, y: rowY + 0.04, w: 0.82, h: 0.62, fontSize: 8.5, color: C.navy, fontFace: "Aptos", valign: "middle", align: "center" });
    ragDot(slide, 8.35, rowY + 0.25, p.rag);
    slide.addText(p.note, { x: 8.9, y: rowY + 0.04, w: 4.0, h: 0.62, fontSize: 7.5, color: C.gray, fontFace: "Aptos", valign: "middle" });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — SRE Operating Guardrails + What's Next
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  addSectionHeader(slide, "Pillar 5  ·  Platform Reliability & Operations", "SRE Operating Guardrails & Roadmap");

  // Left column: guardrails table (Slide 23 upgraded)
  sectionLabel(slide, 0.35, 1.3, 6.1, "OPERATING GUARDRAILS", C.navy);

  const guardrails = [
    { focus: "Customer Protection", metric: "SLA Compliance — Uptime & Availability", meaning: "Hard SLA commitments met (quarterly)", threshold: "≥ 99.5%  ·  99.3–99.5%  ·  < 99.3%" },
    { focus: "Customer Impact", metric: "Customer Impacted Minutes (CIM)", meaning: "Total customer-visible outage time", threshold: "0 P1/P2  ·  1 P2  ·  ≥ 1 P1" },
    { focus: "Operational Efficiency", metric: "Mean Time to Restore (MTTR)", meaning: "Speed of recovery", threshold: "Critical ≤ 2h  ·  High ≤ 4h  ·  Breach" },
    { focus: "Reliability Headroom", metric: "Error Budget Remaining", meaning: "Buffer before SLO policy triggers", threshold: "> 20%  ·  ≤ 20%  ·  Exhausted" },
    { focus: "Delivery Safety", metric: "Change Failure Rate (CFR)", meaning: "Deployments causing degradation", threshold: "< 5%  ·  5–15%  ·  > 15%" },
    { focus: "Platform Coverage", metric: "On-Call Burden Ratio", meaning: "Team capacity vs. 168-hr coverage need", threshold: "≥ 1:4  ·  1:2–1:3  ·  < 1:2" },
  ];

  guardrails.forEach((g, i) => {
    const gy = 1.62 + i * 0.82;
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    slide.addShape(pptx.ShapeType.rect, { x: 0.35, y: gy, w: 6.1, h: 0.8, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    slide.addText(g.focus, { x: 0.42, y: gy + 0.04, w: 5.9, h: 0.22, fontSize: 7.5, bold: true, color: C.eatonBlue, fontFace: "Aptos" });
    slide.addText(g.metric, { x: 0.42, y: gy + 0.24, w: 5.9, h: 0.2, fontSize: 8.5, bold: true, color: C.navy, fontFace: "Aptos" });
    slide.addText(g.meaning, { x: 0.42, y: gy + 0.44, w: 2.8, h: 0.3, fontSize: 8, color: C.gray, fontFace: "Aptos" });
    // RAG key
    const ragParts = g.threshold.split("·");
    if (ragParts.length === 3) {
      [{ color: C.green, x: 3.3 }, { color: C.amber, x: 4.15 }, { color: C.red, x: 5.5 }].forEach((r, ri) => {
        slide.addShape(pptx.ShapeType.ellipse, { x: r.x, y: gy + 0.5, w: 0.14, h: 0.14, fill: { color: r.color }, line: { color: r.color } });
        slide.addText(ragParts[ri].trim(), { x: r.x + 0.17, y: gy + 0.47, w: 0.75, h: 0.2, fontSize: 7, color: C.gray, fontFace: "Aptos" });
      });
    }
  });

  // Right column: roadmap
  sectionLabel(slide, 6.7, 1.3, 5.95, "IMPROVEMENT ROADMAP", C.eatonBlue);

  const phases = [
    {
      phase: "Phase 1 — August 2026",
      color: C.teal,
      items: [
        "Add Pillar 5 SRE section to MOR (this deck)",
        "Revenue-at-risk paragraph in every MOR narrative",
        "Explicit product coverage gap disclosure",
        "On-Call Burden Ratio reported monthly",
      ],
    },
    {
      phase: "Phase 2 — September 2026",
      color: C.eatonBlue,
      items: [
        "Full product portfolio coverage (JSM Assets tier mapping)",
        "CFR activated via GitHub Actions + JSM correlation",
        "IOM security compliance line (CrowdStrike CSPM)",
        "EMEA regional reliability depth",
      ],
    },
    {
      phase: "Phase 3 — Q4 2026",
      color: C.navy,
      items: [
        "PDR live (JSM incident classification field enforced)",
        "MTTD from Dynatrace Davis AI timestamps",
        "Toil Ratio baseline + reduction target",
        "AI workload SLOs (Nexus AI, PGPU, BL Intelligence Platform)",
        "FinOps line: cloud cost per revenue dollar (Apptio)",
      ],
    },
  ];

  phases.forEach((ph, i) => {
    const py = 1.62 + i * 1.72;
    slide.addShape(pptx.ShapeType.rect, { x: 6.7, y: py, w: 5.95, h: 0.3, fill: { color: ph.color }, line: { color: ph.color } });
    slide.addText(ph.phase, { x: 6.8, y: py, w: 5.75, h: 0.3, fontSize: 9.5, bold: true, color: C.white, fontFace: "Aptos", valign: "middle" });
    ph.items.forEach((item, j) => {
      slide.addText(`• ${item}`, {
        x: 6.8, y: py + 0.33 + j * 0.26, w: 5.75, h: 0.25,
        fontSize: 8.5, color: C.black, fontFace: "Aptos",
      });
    });
  });

  // Footnote
  slide.addText(
    "Dependency: JSM taxonomy standardization (Q3) is the critical path for PDR, CFR, and full product-level MTTR reporting.",
    {
      x: 0.35, y: 7.06, w: 12.6, h: 0.18,
      fontSize: 7.5, color: C.darkRed, fontFace: "Aptos", italic: true, bold: true,
    }
  );
}

// ── Write file ────────────────────────────────────────────────────────────────
const outPath = "BrightlayerMOR_Pillar5_SRE_Slides.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log(`✅  Saved: ${outPath}`))
  .catch(err => { console.error("❌  Error:", err); process.exit(1); });
