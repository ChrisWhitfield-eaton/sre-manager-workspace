/**
 * Brightlayer WBR — SRE Pre-Read Template
 * Aligned to WBR Playbook v1.6 (Mark Kelly, 13 Jan 2026)
 *
 * This is the auto-generated pre-read, NOT a presentation deck.
 * Meeting is exception-only discussion; these slides are consumed before the call.
 *
 * Slide structure:
 *   1  Cover / Week Header
 *   2  Executive Overview — Q1 / Q2 / Q3 (§3)
 *   3  SRE Mini Scoreboard — Cloud Services Lane A (§2.1-D)
 *   4  SRE Mini Scoreboard — SA&O Signals (§2.1-G additions)
 *   5  Active Exceptions (Issue → Impact → Action → Owner → Due)
 *   6  Aging Radar — SRE items (§6 guardrails)
 *   7  Culture Evidence Loop + Decision Register (§15)
 *
 * Visual style: Eaton brand, white/light background, data-dense,
 *   RAG overlays, "6–12" sparkline stencil (Bryan Bunn convention).
 */

const PptxGenJS = require("pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5"

// ── Constants ────────────────────────────────────────────────────────────────
const C = {
  eatonBlue: "005EB8",
  navy:      "003865",
  gray:      "5B6770",
  lightGray: "E7EAED",
  midGray:   "CCD2D8",
  white:     "FFFFFF",
  black:     "000000",
  green:     "00B050",
  amber:     "FF9900",
  red:       "E70000",
  teal:      "00B2A9",
  darkRed:   "9D2235",
  greenBg:   "EAF4EA",
  amberBg:   "FFF8EC",
  redBg:     "FDECEA",
  blueBg:    "EEF4FB",
};

const WEEK = "Week of 17 Jun 2026  ·  Pre-read generated: Mon 16 Jun 17:00";
const FONT = "Aptos";

// ── Helpers ───────────────────────────────────────────────────────────────────

function topBar(slide, title, subtitle) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.52, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0.52, w: 13.33, h: 0.04, fill: { color: C.eatonBlue }, line: { color: C.eatonBlue } });
  slide.addText("WBR  ·  SRE Pre-Read  ·  " + WEEK, {
    x: 0.25, y: 0.02, w: 8, h: 0.28, fontSize: 8, color: C.midGray, fontFace: FONT, valign: "middle",
  });
  slide.addText("CONFIDENTIAL (IP Level 3)", {
    x: 9.5, y: 0.02, w: 3.6, h: 0.28, fontSize: 7.5, color: C.gray, fontFace: FONT, align: "right", valign: "middle",
  });
  slide.addText(title, {
    x: 0.25, y: 0.6, w: 10, h: 0.42, fontSize: 16, bold: true, color: C.navy, fontFace: FONT,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.25, y: 1.0, w: 12.5, h: 0.26, fontSize: 9, color: C.gray, fontFace: FONT, italic: true,
    });
  }
  // Page bottom
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.3, w: 13.33, h: 0.2, fill: { color: C.midGray }, line: { color: C.midGray } });
  slide.addText("© 2026 Eaton. All Rights Reserved.  ·  Source: Dynatrace · JSM · OpsGenie · GitHub Actions · Swarmia", {
    x: 0.25, y: 7.32, w: 12.8, h: 0.16, fontSize: 7, color: C.gray, fontFace: FONT,
  });
}

function ragPill(slide, x, y, status, label) {
  const map = { green: [C.green, C.white], amber: [C.amber, C.white], red: [C.red, C.white], na: [C.midGray, C.gray] };
  const [bg, fg] = map[status] || map.na;
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 0.65, h: 0.22, fill: { color: bg }, line: { color: bg }, rectRadius: 0.05 });
  slide.addText(label || status.toUpperCase(), {
    x, y, w: 0.65, h: 0.22, fontSize: 7.5, bold: true, color: fg, fontFace: FONT, align: "center", valign: "middle",
  });
}

function sectionBand(slide, x, y, w, text, color) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.26, fill: { color: color || C.eatonBlue }, line: { color: color || C.eatonBlue } });
  slide.addText(text, { x: x + 0.08, y, w: w - 0.16, h: 0.26, fontSize: 8.5, bold: true, color: C.white, fontFace: FONT, valign: "middle" });
}

// Simulated sparkline using a series of thin bars to represent a 6-week trend
function sparkline(slide, x, y, values, ragColor) {
  const bw = 0.09;
  const gap = 0.03;
  const maxH = 0.28;
  const maxVal = Math.max(...values, 1);
  values.forEach((v, i) => {
    const bh = Math.max(0.04, (v / maxVal) * maxH);
    const by = y + maxH - bh;
    const bx = x + i * (bw + gap);
    const isLast = i === values.length - 1;
    slide.addShape(pptx.ShapeType.rect, {
      x: bx, y: by, w: bw, h: bh,
      fill: { color: isLast ? ragColor : C.midGray },
      line: { color: isLast ? ragColor : C.midGray },
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Cover
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();

  // Navy top half
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 4.0, fill: { color: C.navy }, line: { color: C.navy } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 4.0, w: 13.33, h: 3.5, fill: { color: C.white }, line: { color: C.white } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 3.95, w: 13.33, h: 0.08, fill: { color: C.eatonBlue }, line: { color: C.eatonBlue } });

  slide.addText("WEEKLY BUSINESS REVIEW", {
    x: 0.6, y: 0.9, w: 12, h: 0.45, fontSize: 13, bold: false, color: C.teal, fontFace: FONT, charSpacing: 3,
  });
  slide.addText("SRE Pre-Read", {
    x: 0.6, y: 1.3, w: 12, h: 1.0, fontSize: 42, bold: true, color: C.white, fontFace: FONT,
  });
  slide.addText("Platform Reliability & Operations  ·  Pillar 5", {
    x: 0.6, y: 2.25, w: 12, h: 0.45, fontSize: 16, color: C.midGray, fontFace: FONT,
  });
  slide.addText(WEEK, {
    x: 0.6, y: 2.8, w: 12, h: 0.35, fontSize: 11, color: C.gray, fontFace: FONT,
  });

  // Info boxes bottom half
  const infoBoxes = [
    { label: "Pre-read published", value: "Mon 16 Jun  ·  17:00" },
    { label: "Inputs frozen", value: "Tue 17 Jun  ·  09:00" },
    { label: "WBR", value: "Tue 17 Jun  (exception-only)" },
    { label: "Owner", value: "SRE Manager · Global Software Ops" },
  ];
  infoBoxes.forEach((b, i) => {
    const bx = 0.5 + i * 3.1;
    slide.addShape(pptx.ShapeType.rect, { x: bx, y: 4.3, w: 2.9, h: 1.2, fill: { color: C.lightGray }, line: { color: C.midGray } });
    slide.addText(b.label, { x: bx + 0.1, y: 4.38, w: 2.7, h: 0.28, fontSize: 8, color: C.gray, fontFace: FONT });
    slide.addText(b.value, { x: bx + 0.1, y: 4.66, w: 2.7, h: 0.7, fontSize: 10, bold: true, color: C.navy, fontFace: FONT, valign: "middle" });
  });

  slide.addText("Exception-only discussion.  Reds and Ambers only.  Speak to data.  Green = no airtime.", {
    x: 0.5, y: 5.8, w: 12.3, h: 0.4, fontSize: 10, italic: true, color: C.eatonBlue, fontFace: FONT, align: "center",
  });
  slide.addText("CONFIDENTIAL (IP Level 3)  ·  © 2026 Eaton. All Rights Reserved.", {
    x: 0.5, y: 7.15, w: 12.3, h: 0.25, fontSize: 8, color: C.gray, fontFace: FONT, align: "center",
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — Executive Overview (Q1 / Q2 / Q3)  §3
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Executive Overview — SRE", "Three questions  ·  Exception-only  ·  00–10 min slot");

  const qs = [
    {
      q: "Q1  What did customers experience last week?",
      color: C.eatonBlue,
      items: [
        { label: "SLO Compliance (Tier-1, all regions)", value: "99.9%", rag: "green", trend: "→" },
        { label: "Error Budget Remaining (BLC/Fiji)", value: "—", rag: "na", trend: "—", note: "Config in progress" },
        { label: "Customer Impacted Minutes (CIM)", value: "0 min", rag: "green", trend: "→" },
        { label: "P1 / P2 Incidents this week", value: "0 / 0", rag: "green", trend: "→" },
        { label: "MTTR — Critical (target ≤ 2h)", value: "0 breaches", rag: "green", trend: "→" },
        { label: "MTTR — High (target ≤ 4h)", value: "0 breaches", rag: "green", trend: "↑" },
      ],
    },
    {
      q: "Q2  How did our business do last week?",
      color: C.navy,
      items: [
        { label: "Change Failure Rate (CFR)", value: "—", rag: "na", trend: "—", note: "GitHub Actions+JSM correlation Q3" },
        { label: "Deployment Frequency (BLC/Fiji)", value: "12 deploys", rag: "green", trend: "↑" },
        { label: "Toil Ratio (manual / repetitive work)", value: "~33%", rag: "red", trend: "→", note: "3× elite benchmark; automation backlog active" },
        { label: "On-Call Burden Ratio", value: "1:2.1", rag: "amber", trend: "→", note: "Target 1:4 (Google SRE); expansion business case in progress" },
        { label: "Alert Signal-to-Noise Ratio", value: "—", rag: "na", trend: "—", note: "OpsGenie feed Q3" },
      ],
    },
    {
      q: "Q3  Are we on track to hit targets?",
      color: C.teal,
      items: [
        { label: "Hoshin gate: SLO ≥ 99.9% (Tier-1)", value: "✓ On track", rag: "green", trend: "→" },
        { label: "Error budget policy status", value: "No freeze active", rag: "green", trend: "→" },
        { label: "JSM taxonomy + PDR activation", value: "On track (Q3)", rag: "amber", trend: "→", note: "Critical path for PDR, CFR, product-level MTTR" },
        { label: "Full portfolio SRE coverage", value: "3 / 6 products", rag: "amber", trend: "↑", note: "Power, EPMS, DCIM onboarding Q3" },
        { label: "On-call expansion (headcount)", value: "Business case active", rag: "amber", trend: "→", note: "1:2.1 vs 1:4 benchmark" },
      ],
    },
  ];

  qs.forEach((q, qi) => {
    const colX = 0.25 + qi * 4.35;
    const colW = 4.2;

    sectionBand(slide, colX, 1.3, colW, q.q, q.color);

    q.items.forEach((item, ii) => {
      const iy = 1.6 + ii * 0.82;
      const bg = ii % 2 === 0 ? C.white : C.lightGray;
      slide.addShape(pptx.ShapeType.rect, { x: colX, y: iy, w: colW, h: 0.8, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
      slide.addText(item.label, { x: colX + 0.1, y: iy + 0.04, w: colW - 0.8, h: 0.28, fontSize: 8, color: C.gray, fontFace: FONT });
      slide.addText(item.value, { x: colX + 0.1, y: iy + 0.3, w: colW - 0.8, h: 0.28, fontSize: 10, bold: true, color: C.navy, fontFace: FONT });
      if (item.note) {
        slide.addText(item.note, { x: colX + 0.1, y: iy + 0.56, w: colW - 0.8, h: 0.2, fontSize: 7, color: C.gray, fontFace: FONT, italic: true });
      }
      ragPill(slide, colX + colW - 0.75, iy + 0.29, item.rag, item.rag === "na" ? "N/A" : item.rag.toUpperCase());
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Mini Scoreboard: Cloud Services — Lane A  (§2.1-D + SRE)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Mini Scoreboard — Cloud Services  ·  Lane A", "Owner: Pradeep Abraham  ·  SRE reliability signals  ·  Source: Dynatrace · JSM · OpsGenie");

  // 6-week labels (generic template)
  const wkLabels = ["W14", "W15", "W16", "W17", "W18", "W19 (this week)"];

  const metrics = [
    {
      name: "SLO Compliance — Tier-1",
      source: "Dynatrace DQL",
      target: "≥ 99.9%",
      current: "99.9%",
      rag: "green",
      trend: "→",
      values: [99.95, 99.9, 99.92, 99.88, 99.95, 99.9],
      unit: "%",
      note: "BLC/Fiji · Lighting · DIT",
    },
    {
      name: "Error Budget Remaining",
      source: "Dynatrace SLOs",
      target: "> 20%",
      current: "—",
      rag: "na",
      trend: "—",
      values: [0, 0, 0, 0, 0, 0],
      unit: "%",
      note: "⚠ Dynatrace SLO config in progress",
    },
    {
      name: "Proactive Detection Ratio (PDR)",
      source: "JSM classification",
      target: "≥ 80%",
      current: "—",
      rag: "na",
      trend: "—",
      values: [0, 0, 0, 0, 0, 0],
      unit: "%",
      note: "⚠ JSM classification field required (Q3)",
    },
    {
      name: "Change Failure Rate (CFR)",
      source: "GitHub Actions + JSM",
      target: "< 5%",
      current: "—",
      rag: "na",
      trend: "—",
      values: [0, 0, 0, 0, 0, 0],
      unit: "%",
      note: "⚠ Correlation script in progress (Q3)",
    },
    {
      name: "MTTR — Critical (target ≤ 2h)",
      source: "JSM timestamps",
      target: "0 breaches",
      current: "0 breaches",
      rag: "green",
      trend: "→",
      values: [0, 1, 0, 0, 0, 0],
      unit: "breaches",
      note: "",
    },
    {
      name: "MTTR — High (target ≤ 4h)",
      source: "JSM timestamps",
      target: "0 breaches",
      current: "0 breaches",
      rag: "green",
      trend: "↑",
      values: [2, 1, 1, 0, 1, 0],
      unit: "breaches",
      note: "DIT breach (W17) — process issue, corrected",
    },
    {
      name: "Customer Impacted Minutes (CIM)",
      source: "JSM start/restore",
      target: "0 P1/P2",
      current: "0 min",
      rag: "green",
      trend: "→",
      values: [0, 45, 0, 0, 0, 0],
      unit: "min",
      note: "W15 event: P3 Lighting (pre-SRE monitoring)",
    },
    {
      name: "On-Call Burden Ratio",
      source: "OpsGenie rotations",
      target: "1:4 (Google SRE)",
      current: "1:2.1",
      rag: "amber",
      trend: "→",
      values: [1.5, 1.6, 1.8, 1.9, 2.0, 2.1],
      unit: ":1",
      note: "Below benchmark; headcount business case active",
    },
  ];

  // Column headers
  const colDefs = [
    { label: "Metric", x: 0.22, w: 2.55 },
    { label: "Source", x: 2.82, w: 1.4 },
    { label: "Target", x: 4.27, w: 1.1 },
    { label: "This Week", x: 5.42, w: 1.1 },
    { label: "RAG", x: 6.57, w: 0.65 },
    { label: "6-Week Trend", x: 7.27, w: 1.5 },
    { label: "Notes", x: 8.82, w: 4.28 },
  ];

  const hdrY = 1.32;
  colDefs.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, { x: col.x, y: hdrY, w: col.w, h: 0.28, fill: { color: C.navy }, line: { color: C.navy } });
    slide.addText(col.label, { x: col.x + 0.05, y: hdrY, w: col.w - 0.1, h: 0.28, fontSize: 8, bold: true, color: C.white, fontFace: FONT, valign: "middle" });
  });

  metrics.forEach((m, i) => {
    const ry = hdrY + 0.28 + i * 0.67;
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    colDefs.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, { x: col.x, y: ry, w: col.w, h: 0.65, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    });
    slide.addText(m.name, { x: 0.27, y: ry + 0.04, w: 2.45, h: 0.3, fontSize: 8.5, bold: true, color: C.navy, fontFace: FONT });
    slide.addText(m.source, { x: 0.27, y: ry + 0.36, w: 2.45, h: 0.24, fontSize: 7, color: C.gray, fontFace: FONT, italic: true });
    slide.addText(m.source, { x: 2.87, y: ry + 0.18, w: 1.3, h: 0.3, fontSize: 7.5, color: C.gray, fontFace: FONT, valign: "middle" });
    slide.addText(m.target, { x: 4.32, y: ry + 0.18, w: 1.0, h: 0.3, fontSize: 8, color: C.gray, fontFace: FONT, valign: "middle" });
    slide.addText(m.current, { x: 5.47, y: ry + 0.14, w: 1.0, h: 0.38, fontSize: 9.5, bold: true, color: m.rag === "red" ? C.red : m.rag === "amber" ? C.amber : C.navy, fontFace: FONT, valign: "middle" });
    ragPill(slide, 6.6, ry + 0.22, m.rag, m.rag === "na" ? "N/A" : m.rag.toUpperCase());
    // Sparkline
    const ragColor = m.rag === "green" ? C.green : m.rag === "amber" ? C.amber : m.rag === "red" ? C.red : C.midGray;
    if (m.values.some(v => v > 0)) {
      sparkline(slide, 7.3, ry + 0.18, m.values, ragColor);
    } else {
      slide.addText("No data yet", { x: 7.3, y: ry + 0.22, w: 1.4, h: 0.22, fontSize: 7.5, color: C.midGray, fontFace: FONT, italic: true });
    }
    slide.addText(m.note || "—", { x: 8.87, y: ry + 0.15, w: 4.18, h: 0.36, fontSize: 8, color: m.note?.startsWith("⚠") ? C.amber : C.gray, fontFace: FONT, valign: "middle" });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Mini Scoreboard: SA&O — SRE Toil & Pipeline Signals  (§2.1-G)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Mini Scoreboard — SA&O  ·  SRE Toil & Operational Signals", "Owner: David Knowles  ·  Source: JSM · Tenrox · OpsGenie · Dynatrace Davis AI");

  sectionBand(slide, 0.22, 1.3, 12.88, "SRE OPERATIONAL EFFICIENCY — Added to SA&O Scoreboard", C.navy);

  const saoMetrics = [
    {
      name: "Toil Ratio",
      desc: "% of SRE work that is manual, repetitive, automatable",
      source: "JSM + Tenrox",
      target: "< 20%  (elite: < 10%)",
      current: "~33%",
      rag: "red",
      values: [28, 30, 31, 33, 33, 33],
      note: "3× elite benchmark.  Primary driver: manual SNOW request handling, alert triage.  Automation backlog: 4 items in active sprint.",
      trend: "→",
    },
    {
      name: "Alert Signal-to-Noise Ratio",
      desc: "% of fired alerts that result in human action",
      source: "OpsGenie analytics",
      target: "≥ 70% actionable",
      current: "—",
      rag: "na",
      values: [0, 0, 0, 0, 0, 0],
      note: "⚠ OpsGenie → WBR data feed not yet connected.  Baseline measurement Q3.",
      trend: "—",
    },
    {
      name: "Mean Time to Detect (MTTD)",
      desc: "Detection timestamp (Davis AI) vs JSM incident creation",
      source: "Dynatrace Davis AI + JSM",
      target: "Trend ↓  (baseline Q3)",
      current: "—",
      rag: "na",
      values: [0, 0, 0, 0, 0, 0],
      note: "⚠ Requires Dynatrace Davis AI timestamp → JSM field mapping.  Q3 dependency.",
      trend: "—",
    },
  ];

  const scols = [
    { label: "Metric", x: 0.22, w: 2.3 },
    { label: "Description", x: 2.57, w: 2.5 },
    { label: "Source", x: 5.12, w: 1.3 },
    { label: "Target", x: 6.47, w: 1.4 },
    { label: "This Week", x: 7.92, w: 1.1 },
    { label: "RAG", x: 9.07, w: 0.65 },
    { label: "6-Week Trend", x: 9.77, w: 1.5 },
    { label: "Notes / Actions", x: 11.32, w: 1.78 },
  ];

  const hdrY = 1.62;
  scols.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, { x: col.x, y: hdrY, w: col.w, h: 0.28, fill: { color: C.eatonBlue }, line: { color: C.eatonBlue } });
    slide.addText(col.label, { x: col.x + 0.05, y: hdrY, w: col.w - 0.1, h: 0.28, fontSize: 7.5, bold: true, color: C.white, fontFace: FONT, valign: "middle" });
  });

  saoMetrics.forEach((m, i) => {
    const ry = hdrY + 0.28 + i * 1.0;
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    scols.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, { x: col.x, y: ry, w: col.w, h: 0.98, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    });
    slide.addText(m.name, { x: 0.27, y: ry + 0.04, w: 2.2, h: 0.28, fontSize: 9, bold: true, color: C.navy, fontFace: FONT });
    slide.addText(m.desc, { x: 0.27, y: ry + 0.34, w: 2.2, h: 0.58, fontSize: 7.5, color: C.gray, fontFace: FONT });
    slide.addText(m.desc, { x: 2.62, y: ry + 0.22, w: 2.4, h: 0.55, fontSize: 8, color: C.gray, fontFace: FONT });
    slide.addText(m.source, { x: 5.17, y: ry + 0.3, w: 1.2, h: 0.38, fontSize: 7.5, color: C.gray, fontFace: FONT, valign: "middle", italic: true });
    slide.addText(m.target, { x: 6.52, y: ry + 0.3, w: 1.3, h: 0.38, fontSize: 7.5, color: C.gray, fontFace: FONT, valign: "middle" });
    slide.addText(m.current, { x: 7.97, y: ry + 0.28, w: 1.0, h: 0.42, fontSize: 11, bold: true, color: m.rag === "red" ? C.red : m.rag === "amber" ? C.amber : C.navy, fontFace: FONT, valign: "middle" });
    ragPill(slide, 9.1, ry + 0.38, m.rag, m.rag === "na" ? "N/A" : m.rag.toUpperCase());
    const ragColor = m.rag === "green" ? C.green : m.rag === "amber" ? C.amber : m.rag === "red" ? C.red : C.midGray;
    if (m.values.some(v => v > 0)) {
      sparkline(slide, 9.8, ry + 0.35, m.values, ragColor);
    } else {
      slide.addText("No data yet", { x: 9.8, y: ry + 0.38, w: 1.4, h: 0.22, fontSize: 7.5, color: C.midGray, fontFace: FONT, italic: true });
    }
    slide.addText(m.note, { x: 11.37, y: ry + 0.1, w: 1.68, h: 0.78, fontSize: 7, color: m.note.startsWith("⚠") ? C.amber : C.gray, fontFace: FONT });
  });

  // Toil reduction trajectory callout
  slide.addShape(pptx.ShapeType.rect, { x: 0.22, y: 5.45, w: 12.88, h: 0.78, fill: { color: C.redBg }, line: { color: C.red, pt: 1 } });
  slide.addText("🔴  EXCEPTION — Toil Ratio", { x: 0.4, y: 5.5, w: 3.5, h: 0.28, fontSize: 9, bold: true, color: C.red, fontFace: FONT });
  slide.addText(
    "Issue: Toil Ratio sustained at 33% for 6+ weeks — 3× elite benchmark and primary limiter on capacity for value-add work.\n" +
    "Impact: ~33% of SRE engineering hours consumed by manual, non-automatable work.  Directly limits feature/automation delivery.\n" +
    "Action: 4 automation items active in sprint (SNOW request format correction, alert deduplication, runbook automation).  Target: 25% by end Q3.\n" +
    "Owner: SRE Manager  ·  Due: 30 Sep 2026",
    { x: 0.4, y: 5.78, w: 12.5, h: 0.42, fontSize: 8, color: C.black, fontFace: FONT }
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — Active Exceptions  (§13 Exception Log format)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Active Exceptions — SRE", "Exception format: Issue → Impact → Action → Owner → Due  ·  Reds first, then Ambers");

  const exceptions = [
    {
      id: "SRE-2026-W19-01",
      team: "SRE / REST",
      issue: "Toil Ratio sustained at 33% — 6 consecutive weeks",
      impact: "~33% of SRE capacity unavailable for automation/feature work.  Limits PDR and MTTD improvement trajectory.",
      action: "4 automation items active in current sprint: SNOW→JSM request validation, OpsGenie alert deduplication rules, 2 runbook automations.",
      owner: "SRE Manager",
      due: "30 Sep 2026",
      status: "Open",
      pir: "No",
      rag: "red",
    },
    {
      id: "SRE-2026-W19-02",
      team: "SRE / Platform Eng",
      issue: "On-Call Burden Ratio at 1:2.1 — below 1:4 Google SRE benchmark",
      impact: "3 engineers covering 168 hrs/week across 2 time zones.  Burnout risk.  Business continuity risk at $14M/month revenue scale.",
      action: "Headcount business case submitted.  Approval pending.  Interim mitigation: cross-training REST engineers for expanded rotation.",
      owner: "SRE Manager",
      due: "Approval target: 31 Jul 2026",
      status: "Open",
      pir: "No",
      rag: "amber",
    },
    {
      id: "SRE-2026-W19-03",
      team: "SRE / Platform Eng",
      issue: "JSM taxonomy standardization blocking PDR, CFR, and full MTTR product coverage",
      impact: "3 Tier-1 KPIs (PDR, CFR, Error Budget) cannot be reported until classification field and service tier mapping are complete.",
      action: "JSM project scoped.  Classification field design in progress.  Service tier mapping kickoff scheduled 24 Jun with product leads.",
      owner: "SRE Manager + JSM Admin",
      due: "30 Sep 2026",
      status: "Open",
      pir: "No",
      rag: "amber",
    },
  ];

  exceptions.forEach((ex, i) => {
    const ey = 1.3 + i * 1.9;
    const ragBg = ex.rag === "red" ? C.redBg : ex.rag === "amber" ? C.amberBg : C.greenBg;
    const ragBorder = ex.rag === "red" ? C.red : ex.rag === "amber" ? C.amber : C.green;

    slide.addShape(pptx.ShapeType.rect, { x: 0.22, y: ey, w: 12.88, h: 1.78, fill: { color: ragBg }, line: { color: ragBorder, pt: 1.5 } });

    // Header row
    ragPill(slide, 0.3, ey + 0.08, ex.rag, ex.rag.toUpperCase());
    slide.addText(`${ex.id}  ·  ${ex.team}`, { x: 1.05, y: ey + 0.08, w: 8, h: 0.24, fontSize: 8, bold: true, color: C.navy, fontFace: FONT });
    slide.addText(`Status: ${ex.status}  ·  PIR: ${ex.pir}  ·  Owner: ${ex.owner}  ·  Due: ${ex.due}`, {
      x: 9.0, y: ey + 0.08, w: 4.0, h: 0.24, fontSize: 7.5, color: C.gray, fontFace: FONT, align: "right",
    });

    // Content
    const fields = [
      { label: "Issue:", value: ex.issue, color: C.black, bold: true },
      { label: "Impact:", value: ex.impact, color: C.gray, bold: false },
      { label: "Action:", value: ex.action, color: C.navy, bold: false },
    ];
    fields.forEach((f, fi) => {
      slide.addText(f.label, { x: 0.3, y: ey + 0.38 + fi * 0.44, w: 0.75, h: 0.38, fontSize: 8, bold: true, color: ragBorder, fontFace: FONT, valign: "top" });
      slide.addText(f.value, { x: 1.1, y: ey + 0.38 + fi * 0.44, w: 11.9, h: 0.38, fontSize: 8.5, color: f.color, bold: f.bold, fontFace: FONT, valign: "top" });
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Aging Radar  (§6 guardrails + SRE additions)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Aging Radar — SRE Items", "Auto-promoted if any threshold breached  ·  Source: JSM · OpsGenie · Dynatrace");

  sectionBand(slide, 0.22, 1.3, 12.88, "PLAYBOOK GUARDRAILS (§6) — SRE-RELEVANT ITEMS  ·  Green = pass, auto-suppress  ·  Amber/Red = exception slot", C.navy);

  const agingItems = [
    { category: "Incidents", item: "Open P1/P2 without mitigation owner > 2 hours", threshold: "0", current: "0", rag: "green", lastBreach: "None this period" },
    { category: "Incidents", item: "Open P3 incidents > 7 days", threshold: "0", current: "0", rag: "green", lastBreach: "None this period" },
    { category: "Incidents", item: "P1 defects > 72 hours open", threshold: "0", current: "0", rag: "green", lastBreach: "None this period" },
    { category: "Reliability", item: "Error Budget < 20% remaining (any Tier-1 service)", threshold: "None exhausted", current: "—", rag: "na", lastBreach: "Data not yet live" },
    { category: "Reliability", item: "PDR < 60% for 2 consecutive weeks", threshold: "Trend ≥ 80%", current: "—", rag: "na", lastBreach: "Data not yet live" },
    { category: "Reliability", item: "SLO breach — any Tier-1 service", threshold: "0 breaches", current: "0 breaches", rag: "green", lastBreach: "None this period" },
    { category: "Operations", item: "Overdue WBR actions > 14 days", threshold: "0", current: "0", rag: "green", lastBreach: "None" },
    { category: "Operations", item: "On-call burden ratio < 1:2", threshold: "≥ 1:2 (minimum)", current: "1:2.1", rag: "amber", lastBreach: "Sustained — see Exception SRE-W19-02" },
    { category: "Toil", item: "Toil Ratio > 33% sustained ≥ 4 weeks", threshold: "< 20%", current: "33%", rag: "red", lastBreach: "W14–W19 (6 consecutive weeks) — see Exception SRE-W19-01" },
    { category: "Coverage", item: "SRE monitoring gap — Tier-1 service without Dynatrace SLO", threshold: "0 gaps", current: "3 products (Power, EPMS, DCIM)", rag: "amber", lastBreach: "Onboarding Q3" },
  ];

  const aCols = [
    { label: "Category", x: 0.22, w: 1.1 },
    { label: "Aging Item", x: 1.37, w: 4.0 },
    { label: "Threshold", x: 5.42, w: 1.6 },
    { label: "Current", x: 7.07, w: 1.4 },
    { label: "RAG", x: 8.52, w: 0.65 },
    { label: "Last Breach / Notes", x: 9.22, w: 3.88 },
  ];

  const hdrY = 1.62;
  aCols.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, { x: col.x, y: hdrY, w: col.w, h: 0.26, fill: { color: C.eatonBlue }, line: { color: C.eatonBlue } });
    slide.addText(col.label, { x: col.x + 0.04, y: hdrY, w: col.w - 0.08, h: 0.26, fontSize: 7.5, bold: true, color: C.white, fontFace: FONT, valign: "middle" });
  });

  agingItems.forEach((a, i) => {
    const ry = hdrY + 0.26 + i * 0.51;
    const bg = a.rag === "red" ? C.redBg : a.rag === "amber" ? C.amberBg : i % 2 === 0 ? C.white : C.lightGray;
    aCols.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, { x: col.x, y: ry, w: col.w, h: 0.49, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    });
    slide.addText(a.category, { x: 0.27, y: ry + 0.1, w: 1.0, h: 0.3, fontSize: 7.5, bold: true, color: C.eatonBlue, fontFace: FONT, valign: "middle" });
    slide.addText(a.item, { x: 1.42, y: ry + 0.06, w: 3.9, h: 0.38, fontSize: 8, color: C.black, fontFace: FONT, valign: "middle" });
    slide.addText(a.threshold, { x: 5.47, y: ry + 0.1, w: 1.5, h: 0.3, fontSize: 8, color: C.gray, fontFace: FONT, valign: "middle" });
    slide.addText(a.current, { x: 7.12, y: ry + 0.1, w: 1.3, h: 0.3, fontSize: 8.5, bold: true, color: a.rag === "red" ? C.red : a.rag === "amber" ? C.amber : C.navy, fontFace: FONT, valign: "middle" });
    ragPill(slide, 8.55, ry + 0.14, a.rag, a.rag === "na" ? "N/A" : a.rag.toUpperCase());
    slide.addText(a.lastBreach, { x: 9.27, y: ry + 0.06, w: 3.78, h: 0.38, fontSize: 7.5, color: C.gray, fontFace: FONT, valign: "middle" });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Culture Evidence Loop + Open Actions  (§15 + §13)
// ════════════════════════════════════════════════════════════════════════════
{
  const slide = pptx.addSlide();
  topBar(slide, "Culture Evidence Loop & Open Actions", "§15 WBR Playbook  ·  Published within 24 hours of WBR  ·  Scribe: [Name]");

  // Left: Culture Evidence Loop
  sectionBand(slide, 0.22, 1.3, 5.9, "CULTURE EVIDENCE LOOP  (§15)", C.navy);

  const cultureMetrics = [
    { label: "Early Reds surfaced", value: "3", delta: "vs 3 last week", rag: "green" },
    { label: "Help-needed answered in-meeting", value: "—", delta: "pending this WBR", rag: "na" },
    { label: "Avg. time-to-decision", value: "—", delta: "target ≤ 5 min", rag: "na" },
    { label: "% decisions with owner + date", value: "—", delta: "target 100%", rag: "na" },
    { label: "% commitments met by next WBR", value: "—", delta: "target ≥ 90%", rag: "na" },
  ];

  cultureMetrics.forEach((cm, i) => {
    const cy = 1.62 + i * 0.72;
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    slide.addShape(pptx.ShapeType.rect, { x: 0.22, y: cy, w: 5.9, h: 0.7, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    slide.addText(cm.label, { x: 0.32, y: cy + 0.06, w: 3.8, h: 0.28, fontSize: 8.5, color: C.gray, fontFace: FONT });
    slide.addText(cm.value, { x: 0.32, y: cy + 0.34, w: 2.0, h: 0.28, fontSize: 14, bold: true, color: C.navy, fontFace: FONT });
    slide.addText(cm.delta, { x: 2.35, y: cy + 0.38, w: 2.0, h: 0.24, fontSize: 8, color: C.gray, fontFace: FONT });
    ragPill(slide, 5.35, cy + 0.24, cm.rag, cm.rag === "na" ? "N/A" : cm.rag.toUpperCase());
  });

  // Right: Decision Register
  sectionBand(slide, 6.35, 1.3, 6.75, "DECISION REGISTER & OPEN ACTIONS  (§13)", C.eatonBlue);

  const actions = [
    { id: "DEC-W19-01", domain: "Resource", title: "On-call headcount expansion", owner: "SRE Manager", due: "31 Jul 2026", status: "Open — pending approval" },
    { id: "ACT-W19-01", domain: "Architecture", title: "JSM taxonomy + classification field design", owner: "SRE Mgr + JSM Admin", due: "30 Sep 2026", status: "In Progress" },
    { id: "ACT-W19-02", domain: "Policy", title: "OpsGenie alert deduplication rules", owner: "Platform Engineering", due: "30 Jul 2026", status: "In Sprint" },
    { id: "ACT-W19-03", domain: "Investment", title: "CFR correlation script (GH Actions + JSM)", owner: "Platform Engineering", due: "30 Sep 2026", status: "Backlog — Q3" },
    { id: "ACT-W19-04", domain: "Architecture", title: "Dynatrace SLO config — all Tier-1 services", owner: "SRE Manager", due: "31 Aug 2026", status: "In Progress" },
  ];

  const aCols2 = [
    { label: "ID", x: 6.35, w: 1.1 },
    { label: "Domain", x: 7.5, w: 1.1 },
    { label: "Title", x: 8.65, w: 2.3 },
    { label: "Owner", x: 11.0, w: 1.4 },
    { label: "Due", x: 12.45, w: 0.65 },
  ];

  const ahdrY = 1.62;
  aCols2.forEach(col => {
    slide.addShape(pptx.ShapeType.rect, { x: col.x, y: ahdrY, w: col.w, h: 0.26, fill: { color: C.navy }, line: { color: C.navy } });
    slide.addText(col.label, { x: col.x + 0.04, y: ahdrY, w: col.w - 0.08, h: 0.26, fontSize: 7.5, bold: true, color: C.white, fontFace: FONT, valign: "middle" });
  });

  actions.forEach((a, i) => {
    const ary = ahdrY + 0.26 + i * 0.72;
    const bg = i % 2 === 0 ? C.white : C.lightGray;
    aCols2.forEach(col => {
      slide.addShape(pptx.ShapeType.rect, { x: col.x, y: ary, w: col.w, h: 0.7, fill: { color: bg }, line: { color: C.midGray, pt: 0.5 } });
    });
    slide.addText(a.id, { x: 6.4, y: ary + 0.06, w: 1.0, h: 0.58, fontSize: 7.5, bold: true, color: C.eatonBlue, fontFace: FONT, valign: "middle" });
    slide.addText(a.domain, { x: 7.55, y: ary + 0.06, w: 1.0, h: 0.58, fontSize: 7.5, color: C.gray, fontFace: FONT, valign: "middle" });
    slide.addText(a.title, { x: 8.7, y: ary + 0.04, w: 2.2, h: 0.38, fontSize: 8, bold: true, color: C.navy, fontFace: FONT });
    slide.addText(a.status, { x: 8.7, y: ary + 0.42, w: 2.2, h: 0.24, fontSize: 7, color: C.gray, fontFace: FONT, italic: true });
    slide.addText(a.owner, { x: 11.05, y: ary + 0.14, w: 1.3, h: 0.42, fontSize: 7.5, color: C.navy, fontFace: FONT, valign: "middle" });
    slide.addText(a.due, { x: 12.5, y: ary + 0.14, w: 0.55, h: 0.42, fontSize: 7, color: C.gray, fontFace: FONT, valign: "middle" });
  });

  // Meeting norms reminder
  slide.addShape(pptx.ShapeType.rect, { x: 0.22, y: 7.02, w: 12.88, h: 0.24, fill: { color: C.blueBg }, line: { color: C.eatonBlue, pt: 0.5 } });
  slide.addText(
    "Meeting norms (Playbook §14):  \"Exceptions only. Reds/ambers welcome. We leave with decisions, owners, and dates. Speak to data. If it's green, we move on.\"",
    { x: 0.32, y: 7.03, w: 12.68, h: 0.2, fontSize: 7.5, color: C.eatonBlue, fontFace: FONT, italic: true }
  );
}

// ── Write ─────────────────────────────────────────────────────────────────────
const outPath = "BrightlayerWBR_SRE_PreRead_Template.pptx";
pptx.writeFile({ fileName: outPath })
  .then(() => console.log(`✅  Saved: ${outPath}`))
  .catch(err => { console.error("❌  Error:", err); process.exit(1); });
