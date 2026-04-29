"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Sankey,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type KPI = {
  label: string;
  value: string;
  delta: string;
  accent: "yellow" | "cyan" | "ok" | "danger";
};

const kpis: KPI[] = [
  { label: "Operational Efficiency", value: "+15%", delta: "QoQ uplift", accent: "yellow" },
  { label: "Customer Impact", value: "+20%", delta: "CSAT", accent: "cyan" },
  { label: "Campaign Performance", value: "+40%", delta: "Engagement", accent: "yellow" },
  { label: "Risk Exposure Reduction", value: "-30%", delta: "Residual risk", accent: "ok" }
];

const perfSeries = [
  { t: "W1", uptime: 98.2, throughput: 74, cost: 102 },
  { t: "W2", uptime: 98.6, throughput: 77, cost: 101 },
  { t: "W3", uptime: 98.9, throughput: 79, cost: 100 },
  { t: "W4", uptime: 99.2, throughput: 83, cost: 99 },
  { t: "W5", uptime: 99.0, throughput: 81, cost: 98 },
  { t: "W6", uptime: 99.4, throughput: 86, cost: 97 },
  { t: "W7", uptime: 99.5, throughput: 88, cost: 96 },
  { t: "W8", uptime: 99.7, throughput: 92, cost: 95 }
];

const riskHeat = [
  { zone: "Pit A", likelihood: 0.8, impact: 0.9, severity: "High" },
  { zone: "Pit B", likelihood: 0.6, impact: 0.7, severity: "Med" },
  { zone: "Haul Rd", likelihood: 0.7, impact: 0.6, severity: "Med" },
  { zone: "Workshop", likelihood: 0.4, impact: 0.5, severity: "Low" },
  { zone: "Remote Ops", likelihood: 0.75, impact: 0.8, severity: "High" },
  { zone: "Explosives", likelihood: 0.55, impact: 0.95, severity: "High" },
  { zone: "Power", likelihood: 0.45, impact: 0.7, severity: "Med" }
];

const funnel = [
  { value: 100, name: "Variant Exposure" },
  { value: 68, name: "Qualified Interactions" },
  { value: 41, name: "High-Intent Actions" },
  { value: 22, name: "Converted" }
];

const workflowNodes = [
  { name: "Sensors (OT)", id: 0 },
  { name: "Edge Gateway", id: 1 },
  { name: "Streaming Bus", id: 2 },
  { name: "Ops Data Lake", id: 3 },
  { name: "Risk Engine", id: 4 },
  { name: "Dashboards", id: 5 }
];
const workflowLinks = [
  { source: 0, target: 1, value: 8 },
  { source: 1, target: 2, value: 7 },
  { source: 2, target: 3, value: 6 },
  { source: 3, target: 4, value: 4 },
  { source: 4, target: 5, value: 4 },
  { source: 3, target: 5, value: 2 }
];

function accentStyle(accent: KPI["accent"]): CSSProperties {
  switch (accent) {
    case "cyan":
      return { borderColor: "hsla(var(--cyan) / 0.35)", boxShadow: "0 0 28px hsla(var(--cyan) / 0.12)" };
    case "ok":
      return { borderColor: "hsla(var(--ok) / 0.35)", boxShadow: "0 0 28px hsla(var(--ok) / 0.12)" };
    case "danger":
      return { borderColor: "hsla(var(--danger) / 0.35)", boxShadow: "0 0 28px hsla(var(--danger) / 0.12)" };
    default:
      return { borderColor: "hsla(var(--yellow) / 0.35)", boxShadow: "0 0 28px hsla(var(--yellow) / 0.12)" };
  }
}

function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 gridlines opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--yellow)/0.82)]">
          {eyebrow}
        </div>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-balance text-3xl font-extrabold leading-tight md:text-5xl">{title}</h2>
          {subtitle ? (
            <p className="max-w-xl text-pretty text-sm text-[hsla(var(--text)/0.78)] md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </motion.div>
      {children}
    </section>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass neon-ring rounded-2xl p-5 md:p-6 ${className ?? ""}`}>{children}</div>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[hsla(var(--yellow)/0.22)] bg-[hsla(0_0%_100%/0.06)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[hsla(var(--text)/0.82)]">
      {children}
    </span>
  );
}

function Nav() {
  const links = [
    { id: "hero", label: "Mission" },
    { id: "skills", label: "Skills" },
    { id: "exec", label: "Executive" },
    { id: "systems", label: "Systems" },
    { id: "grc", label: "GRC" },
    { id: "docs", label: "Services" },
    { id: "impact", label: "Impact" },
    { id: "build", label: "Roadmap" },
    { id: "about", label: "About" }
  ];
  return (
    <div className="sticky top-0 z-40 w-full border-b border-[hsla(var(--yellow)/0.12)] bg-[hsla(0_0%_0%/0.55)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--yellow))] shadow-[0_0_20px_hsla(var(--yellow)/0.55)]" />
          <div className="text-sm font-extrabold tracking-wide">EPIROC OPS INTEL</div>
          <span className="hidden md:inline text-xs text-[hsla(var(--text)/0.6)]">
            operational advantage console
          </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-[hsla(var(--text)/0.78)] hover:text-white hover:bg-[hsla(0_0%_100%/0.06)] transition"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#exec"
          className="rounded-full border border-[hsla(var(--yellow)/0.22)] bg-[hsla(var(--yellow)/0.12)] px-3 py-1.5 text-xs font-extrabold tracking-wide text-[hsla(var(--text)/0.92)] hover:bg-[hsla(var(--yellow)/0.18)] transition"
        >
          View Dashboard
        </a>
      </div>
    </div>
  );
}

function Hero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 70]);
  const glow = useTransform(scrollYProgress, [0, 0.25], [1, 0.25]);

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ y, opacity: glow }}
          className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_20%_10%,hsla(var(--yellow)/0.18),transparent_55%),radial-gradient(900px_700px_at_90%_20%,hsla(var(--cyan)/0.14),transparent_55%),radial-gradient(800px_600px_at_60%_100%,hsla(var(--yellow2)/0.10),transparent_60%)]"
        />
        <div className="absolute inset-0 gridlines opacity-70" />
        <MiningBackdrop />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="glass neon-ring rounded-2xl p-2.5">
                <Image
                  src="/epiroc-logo.png"
                  alt="Epiroc"
                  width={180}
                  height={56}
                  priority
                  className="h-8 w-auto md:h-9"
                />
              </div>
              <div className="hidden md:block text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.6)]">
                leadership console (simulation)
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Chip>MS Information Systems</Chip>
              <Chip>Data Analytics + AI</Chip>
              <Chip>Business Analyst</Chip>
              <Chip>Systems Thinker</Chip>
            </div>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] md:text-6xl">
              <span className="text-glow">For Epiroc</span>
              <span className="text-[hsl(var(--yellow))]"> — by Shamik</span>
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-[hsla(var(--text)/0.78)] md:text-base">
              A single-page simulation of how I’d deliver executive visibility across mining operations—performance,
              process, cyber, and commercial outcomes—using realistic telemetry, workflows, and risk signals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#exec"
                className="rounded-2xl bg-[hsl(var(--yellow))] px-5 py-3 text-sm font-extrabold text-black hover:brightness-110 transition"
              >
                View Operational Dashboard
              </a>
              <a
                href="#impact"
                className="rounded-2xl border border-[hsla(var(--yellow)/0.22)] bg-[hsla(0_0%_100%/0.05)] px-5 py-3 text-sm font-extrabold text-white hover:bg-[hsla(0_0%_100%/0.08)] transition"
              >
                Explore Capabilities
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.6)]">
                    LIVE SIGNALS
                  </div>
                  <div className="mt-1 text-lg font-extrabold">Mine Ops Telemetry</div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[hsla(var(--text)/0.7)]">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--ok))] shadow-[0_0_18px_hsla(var(--ok)/0.55)]" />
                  streaming
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <MiniSignal label="Haul cycle variance" value="-6.8%" hint="dispatch + route tuning" />
                <MiniSignal label="OT perimeter anomalies" value="3" hint="remote access pattern change" />
                <MiniSignal label="Backlog burn-down" value="92%" hint="workflow consolidation" />
              </div>
              <div className="mt-5 h-36 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perfSeries} margin={{ left: -12, right: 8, top: 6, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsla(var(--yellow)/0.70)" />
                        <stop offset="100%" stopColor="hsla(var(--yellow)/0.02)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="hsla(0 0% 100% / 0.06)" vertical={false} />
                    <XAxis dataKey="t" tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[70, 100]} />
                    <Area
                      type="monotone"
                      dataKey="uptime"
                      stroke="hsla(var(--yellow)/0.85)"
                      strokeWidth={2}
                      fill="url(#g1)"
                      isAnimationActive
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsla(0 0% 0% / 0.8)",
                        border: "1px solid hsla(var(--yellow)/0.22)",
                        borderRadius: 12
                      }}
                      labelStyle={{ color: "hsla(var(--text)/0.8)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MiniSignal({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.66)]">{label}</div>
        <div className="text-sm font-extrabold text-[hsl(var(--yellow))]">{value}</div>
      </div>
      <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{hint}</div>
    </motion.div>
  );
}

function MiningBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 opacity-70">
      <svg
        viewBox="0 0 1200 700"
        className="h-full w-full"
        role="img"
        aria-label="Animated mining operations schematic background"
      >
        <defs>
          <linearGradient id="strokeY" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsla(var(--yellow)/0.0)" />
            <stop offset="40%" stopColor="hsla(var(--yellow)/0.55)" />
            <stop offset="100%" stopColor="hsla(var(--cyan)/0.35)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#glow)" stroke="url(#strokeY)" strokeWidth="2" fill="none" opacity="0.9">
          <motion.path
            d="M60 540 C 280 420, 320 350, 520 340 S 840 300, 1100 170"
            initial={{ pathLength: 0.1, opacity: 0.25 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M130 600 C 260 560, 350 560, 510 520 S 820 420, 1120 360"
            initial={{ pathLength: 0.1, opacity: 0.25 }}
            animate={{ pathLength: 1, opacity: 0.65 }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.15 }}
          />
          <motion.path
            d="M200 170 C 380 210, 430 250, 610 250 S 890 220, 1120 120"
            initial={{ pathLength: 0.1, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.6, ease: "easeInOut", delay: 0.25 }}
          />
        </g>

        <g>
          {[
            { x: 140, y: 550, label: "Haul Truck 12" },
            { x: 520, y: 350, label: "Edge Sensor Grid" },
            { x: 870, y: 300, label: "Pipeline Pressure" },
            { x: 1060, y: 170, label: "Ops Control" }
          ].map((n, idx) => (
            <motion.g
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + idx * 0.06 }}
            >
              <circle cx={n.x} cy={n.y} r="6" fill="hsla(var(--yellow)/0.95)" />
              <circle cx={n.x} cy={n.y} r="14" fill="hsla(var(--yellow)/0.08)" />
              <text x={n.x + 14} y={n.y + 4} fontSize="12" fill="hsla(var(--text)/0.55)">
                {n.label}
              </text>
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default function Page() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.2 });

  return (
    <div className="min-h-screen">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-[linear-gradient(90deg,hsla(var(--yellow)/0.0),hsla(var(--yellow)/0.9),hsla(var(--cyan)/0.7))]"
      />
      <Nav />
      <Hero />

      <Section
        id="skills"
        eyebrow="SKILLS + DELIVERY FRAMEWORK"
        title="Tooling that ships outcomes (not slides)"
        subtitle="A compact capability map plus a repeatable problem-solving framework—built for measurable impact on Epiroc equipment uptime, maintenance execution, and operational risk."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">CAPABILITIES</div>
                <div className="mt-1 text-lg font-extrabold">Skills matrix (executive view)</div>
              </div>
              <Chip>ready-to-deploy</Chip>
            </div>

            <div className="mt-4 grid gap-3">
              <SkillGroup
                title="Programming & Data Analysis"
                items={["Python", "HTML/CSS/JS", "MySQL"]}
              />
              <SkillGroup
                title="Data Visualization & BI"
                items={["Tableau", "Power BI", "Gen AI (Microsoft Copilot)", "Excel (Pivot tables, VLOOKUP)"]}
              />
              <SkillGroup
                title="Applications"
                items={["Microsoft Access", "PowerPoint", "Word", "SharePoint", "Teams", "Visio"]}
              />
              <SkillGroup
                title="Tools"
                items={["JIRA", "SAP S/4HANA", "Jupyter Notebook"]}
              />
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">FRAMEWORK</div>
                <div className="mt-1 text-lg font-extrabold">Problem-solving loop (OT-safe)</div>
              </div>
              <Chip>step-by-step</Chip>
            </div>

            <div className="mt-4 grid gap-2">
              <FrameworkStep
                step="01"
                title="Instrument"
                detail="Define KPIs + data sources (equipment, maintenance, dispatch, CRM)."
                impact="Fewer blind spots in fleet health"
                tone="cyan"
              />
              <FrameworkStep
                step="02"
                title="Diagnose"
                detail="Segment, baseline, and find drivers (Pareto, cohorts, time-series)."
                impact="Root causes surface faster"
                tone="yellow"
              />
              <FrameworkStep
                step="03"
                title="Decide"
                detail="Convert insights into controls + workflows (SOPs, routing, SLAs)."
                impact="Less rework, clearer ownership"
                tone="ok"
              />
              <FrameworkStep
                step="04"
                title="Deploy + Verify"
                detail="Ship dashboard + alerts, validate lift, and lock in standard work."
                impact="Higher uptime, lower downtime risk"
                tone="yellow"
              />
            </div>

            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Impact on Epiroc machines</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ImpactPill label="Fleet uptime" value="↑" />
                <ImpactPill label="Unplanned stops" value="↓" />
                <ImpactPill label="Maintenance compliance" value="↑" />
                <ImpactPill label="Risk exposure" value="↓" />
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="exec"
        eyebrow="EXECUTIVE DASHBOARD"
        title="Operational performance — real-time, decision-ready"
        subtitle="Interactive mining SaaS-style analytics: KPI tiles, performance trends, risk zoning, experiment funnel impact, and system workflow traces."
      >
        <div className="grid gap-4 md:grid-cols-4">
          {kpis.map((k) => (
            <motion.div
              key={k.label}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <Card className="h-full" >
                <div className="rounded-xl border p-4" style={accentStyle(k.accent)}>
                  <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">
                    {k.label}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div className="text-3xl font-extrabold text-[hsl(var(--yellow))]">{k.value}</div>
                    <div className="text-xs font-semibold text-[hsla(var(--text)/0.68)]">{k.delta}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">PERFORMANCE</div>
                <div className="mt-1 text-lg font-extrabold">Throughput + Uptime trend</div>
              </div>
              <div className="flex gap-2">
                <Chip>dispatch</Chip>
                <Chip>maintenance</Chip>
                <Chip>downtime</Chip>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perfSeries} margin={{ left: -10, right: 10, top: 12, bottom: 6 }}>
                  <CartesianGrid stroke="hsla(0 0% 100% / 0.06)" vertical={false} />
                  <XAxis dataKey="t" tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsla(0 0% 0% / 0.85)",
                      border: "1px solid hsla(var(--yellow)/0.22)",
                      borderRadius: 12
                    }}
                    labelStyle={{ color: "hsla(var(--text)/0.8)" }}
                  />
                  <Legend wrapperStyle={{ color: "hsla(var(--text)/0.65)", fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke="hsla(var(--yellow)/0.90)"
                    strokeWidth={2.3}
                    dot={false}
                    isAnimationActive
                  />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="hsla(var(--cyan)/0.75)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">RISK ZONES</div>
                <div className="mt-1 text-lg font-extrabold">Heatmap — residual exposure</div>
              </div>
              <Chip>GRC signals</Chip>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ left: 0, right: 10, top: 8, bottom: 8 }}>
                  <CartesianGrid stroke="hsla(0 0% 100% / 0.06)" />
                  <XAxis
                    type="number"
                    dataKey="likelihood"
                    domain={[0, 1]}
                    tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    name="Likelihood"
                  />
                  <YAxis
                    type="number"
                    dataKey="impact"
                    domain={[0, 1]}
                    tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    name="Impact"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      background: "hsla(0 0% 0% / 0.85)",
                      border: "1px solid hsla(var(--yellow)/0.22)",
                      borderRadius: 12
                    }}
                    formatter={(value, name) => {
                      const label = name === "zone" ? "Zone" : String(name);
                      return [value as any, label] as [any, string];
                    }}
                    labelFormatter={() => ""}
                  />
                  <Scatter
                    data={riskHeat}
                    fill="hsla(var(--yellow)/0.85)"
                    isAnimationActive
                    shape={(props: any) => {
                      const sev = props.payload?.severity as string | undefined;
                      const fill =
                        sev === "High"
                          ? "hsla(var(--danger)/0.75)"
                          : sev === "Med"
                            ? "hsla(var(--yellow)/0.75)"
                            : "hsla(var(--ok)/0.70)";
                      return <circle cx={props.cx} cy={props.cy} r={7} fill={fill} />;
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl border border-[hsla(var(--danger)/0.28)] bg-[hsla(var(--danger)/0.10)] px-3 py-2 text-[hsla(var(--text)/0.8)]">
                <div className="font-extrabold">High</div>
                <div className="text-[hsla(var(--text)/0.62)]">Immediate controls</div>
              </div>
              <div className="rounded-xl border border-[hsla(var(--yellow)/0.28)] bg-[hsla(var(--yellow)/0.10)] px-3 py-2 text-[hsla(var(--text)/0.8)]">
                <div className="font-extrabold">Medium</div>
                <div className="text-[hsla(var(--text)/0.62)]">Roadmap + monitor</div>
              </div>
              <div className="rounded-xl border border-[hsla(var(--ok)/0.28)] bg-[hsla(var(--ok)/0.10)] px-3 py-2 text-[hsla(var(--text)/0.8)]">
                <div className="font-extrabold">Low</div>
                <div className="text-[hsla(var(--text)/0.62)]">Automate checks</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">EXPERIMENTS</div>
                <div className="mt-1 text-lg font-extrabold">A/B funnel — impact trace</div>
              </div>
              <Chip>campaign engine</Chip>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      background: "hsla(0 0% 0% / 0.85)",
                      border: "1px solid hsla(var(--yellow)/0.22)",
                      borderRadius: 12
                    }}
                    labelStyle={{ color: "hsla(var(--text)/0.85)" }}
                  />
                  <Funnel dataKey="value" data={funnel} isAnimationActive>
                    <LabelList position="right" fill="hsla(var(--text)/0.78)" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs text-[hsla(var(--text)/0.62)]">
              Variant B increased qualified interactions and reduced drop-off at high-intent actions through clearer
              operational value framing.
            </div>
          </Card>

          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">SYSTEM WORKFLOW</div>
                <div className="mt-1 text-lg font-extrabold">OT → IT data path + risk engine</div>
              </div>
              <div className="flex gap-2">
                <Chip>IT</Chip>
                <Chip>OT</Chip>
                <Chip>segmentation</Chip>
              </div>
            </div>
            <div className="mt-3 h-72 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <Sankey
                  data={{
                    nodes: workflowNodes,
                    links: workflowLinks
                  }}
                  nodePadding={18}
                  linkCurvature={0.45}
                  margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                />
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-3">
                <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Control point</div>
                <div className="mt-1 text-sm font-extrabold">Edge gateway allowlists</div>
              </div>
              <div className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-3">
                <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Control point</div>
                <div className="mt-1 text-sm font-extrabold">Risk scoring + tag-based alerts</div>
              </div>
              <div className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-3">
                <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Control point</div>
                <div className="mt-1 text-sm font-extrabold">Executive narrative views</div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="systems"
        eyebrow="PROJECT MANAGEMENT + SYSTEM DESIGN"
        title="Process intelligence — from BPMN to delivery"
        subtitle="A JIRA-style workstream simulation with BPMN-like flows and IT/OT architecture framing. Focus: clarity, reduced redundancy, measurable outcomes."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">BEFORE → AFTER</div>
                <div className="mt-1 text-lg font-extrabold">Process optimization</div>
              </div>
              <Chip>redundancy -15%</Chip>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <ProcessCard
                title="Before"
                points={[
                  "Manual handoffs across IT/OT boundary",
                  "Duplicate data entry (SAP + spreadsheets)",
                  "No single owner for incident triage"
                ]}
                accent="danger"
              />
              <ProcessCard
                title="After"
                points={[
                  "Event-driven intake with SLA routing",
                  "Normalized master data + one source of truth",
                  "Clear runbooks + auto-escalation"
                ]}
                accent="ok"
              />
            </div>

            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>BPMN simulation</Chip>
                <Chip>handoffs</Chip>
                <Chip>controls</Chip>
                <Chip>SLAs</Chip>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <FlowNode label="Detect" sub="telemetry / tickets" />
                <FlowNode label="Assess" sub="risk + impact" />
                <FlowNode label="Route" sub="IT / OT / vendor" />
                <FlowNode label="Resolve" sub="verify + report" />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">TASK TRACKING</div>
                <div className="mt-1 text-lg font-extrabold">Delivery board (simulation)</div>
              </div>
              <Chip>JIRA-style</Chip>
            </div>
            <div className="mt-4 grid gap-2">
              <TaskRow id="OPS-142" title="Consolidate telemetry sources (edge)" status="In progress" owner="BA / Systems" />
              <TaskRow id="GRC-88" title="Remote access review + segmentation gaps" status="Blocked" owner="Security" />
              <TaskRow id="DATA-37" title="Operational KPI model + glossary" status="In review" owner="Analytics" />
              <TaskRow id="CRM-19" title="Campaign attribution pipeline" status="Done" owner="RevOps" />
              <TaskRow id="DOC-06" title="Runbook: incident triage + SLA routing" status="Done" owner="Tech Writer" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Outcome highlight</div>
              <div className="mt-1 text-sm font-extrabold">Improved operational clarity + reduced rework</div>
              <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">
                Clear ownership, instrumentation, and control points—so leadership sees the system, not just the symptoms.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="grc"
        eyebrow="CYBERSECURITY + COMPLIANCE"
        title="Industrial risk command center (GRC view)"
        subtitle="Risk zoning, remote access exposure, IT/OT segmentation gaps, monitoring posture, and a conceptual AI-driven detection module."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">RISK HEATMAP</div>
                <div className="mt-1 text-lg font-extrabold">Controls vs exposure</div>
              </div>
              <Chip>GRC dashboard</Chip>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <GrcTile title="Remote access" value="Elevated" tone="danger" detail="3 anomalous vendor sessions" />
              <GrcTile title="IT/OT segmentation" value="Gaps" tone="yellow" detail="2 routes need allowlists" />
              <GrcTile title="Monitoring coverage" value="Improving" tone="ok" detail="new tags in SIEM feed" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>AI-driven risk detection module</Chip>
                <Chip>concept</Chip>
                <Chip>OT-safe</Chip>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <FlowNode label="Ingest" sub="logs + VPN + edge" tone="cyan" />
                <FlowNode label="Model" sub="baselines + drift" tone="yellow" />
                <FlowNode label="Detect" sub="anomalies + TTPs" tone="danger" />
                <FlowNode label="Respond" sub="playbooks + tickets" tone="ok" />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">ALIGNMENT</div>
                <div className="mt-1 text-lg font-extrabold">Compliance indicators</div>
              </div>
              <Chip>audit-ready</Chip>
            </div>
            <div className="mt-4 grid gap-2">
              <ComplianceRow label="Access governance" status="Tracking" />
              <ComplianceRow label="Asset inventory (OT)" status="Partial" />
              <ComplianceRow label="Logging + retention" status="On track" />
              <ComplianceRow label="Incident response runbooks" status="On track" />
              <ComplianceRow label="Vendor risk (remote)" status="Needs attention" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Executive summary</div>
              <div className="mt-1 text-sm font-extrabold">Reduce risk without slowing operations</div>
              <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">
                Focus controls at choke points: remote access, segmentation, and asset visibility—then automate evidence
                collection for compliance.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="docs"
        eyebrow="TECHNICAL INFORMATION SERVICES"
        title="System documentation hub + operational playbooks"
        subtitle="Interactive SOP viewer, expandable modules, and version-controlled system docs—built for adoption, audits, and repeatable execution."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">DOCUMENTATION</div>
                <div className="mt-1 text-lg font-extrabold">Operational playbooks (interactive)</div>
              </div>
              <Chip>versioned</Chip>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DocModule
                title="System Documentation Hub"
                items={[
                  "Architecture maps (IT + OT)",
                  "Data dictionary + KPI glossary",
                  "Access pathways + owners"
                ]}
              />
              <DocModule
                title="Operational Playbooks"
                items={[
                  "Incident triage (SLAs + escalation)",
                  "Remote access approvals",
                  "Change management checklist"
                ]}
              />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-4">
              <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">SOP VIEWER</div>
              <div className="mt-2 grid gap-2">
                <SopStep step="01" title="Trigger" detail="Edge anomaly or dispatch deviation crosses threshold." />
                <SopStep step="02" title="Validate" detail="Check sensor confidence + asset context; tag with owners." />
                <SopStep step="03" title="Act" detail="Route to IT/OT queue; auto-attach evidence pack." />
                <SopStep step="04" title="Close loop" detail="Verify impact, document changes, update dashboard narrative." />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">SOP HEALTH</div>
                <div className="mt-1 text-lg font-extrabold">Adoption + drift tracking</div>
              </div>
              <Chip>quality</Chip>
            </div>
            <div className="mt-4 h-64 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { m: "Jan", adherence: 62, drift: 18 },
                    { m: "Feb", adherence: 68, drift: 16 },
                    { m: "Mar", adherence: 74, drift: 13 },
                    { m: "Apr", adherence: 79, drift: 12 },
                    { m: "May", adherence: 84, drift: 10 }
                  ]}
                  margin={{ left: -12, right: 10, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsla(var(--cyan)/0.55)" />
                      <stop offset="100%" stopColor="hsla(var(--cyan)/0.02)" />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsla(var(--yellow)/0.55)" />
                      <stop offset="100%" stopColor="hsla(var(--yellow)/0.02)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsla(0 0% 100% / 0.06)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsla(var(--text)/0.55)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsla(0 0% 0% / 0.85)",
                      border: "1px solid hsla(var(--yellow)/0.22)",
                      borderRadius: 12
                    }}
                    labelStyle={{ color: "hsla(var(--text)/0.8)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="adherence"
                    stroke="hsla(var(--cyan)/0.75)"
                    strokeWidth={2}
                    fill="url(#g2)"
                    isAnimationActive
                  />
                  <Area
                    type="monotone"
                    dataKey="drift"
                    stroke="hsla(var(--yellow)/0.8)"
                    strokeWidth={2}
                    fill="url(#g3)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Version control</div>
              <div className="mt-1 text-sm font-extrabold">Change history + approvals</div>
              <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">
                Every SOP change is traceable to incidents, controls, and outcomes—so improvements compound.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="impact"
        eyebrow="DATA ANALYTICS + BUSINESS IMPACT"
        title="Analytics that moves KPIs — not dashboards that sit"
        subtitle="SQL + Power BI/Tableau-style outputs, CRM analytics, campaign optimization, and a data pipeline view that ties insights to outcomes."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">PIPELINE</div>
                <div className="mt-1 text-lg font-extrabold">Data path — source to decision</div>
              </div>
              <Chip>SQL</Chip>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <FlowNode label="Extract" sub="SAP / CRM / OT" tone="yellow" />
              <FlowNode label="Model" sub="facts + dims" tone="cyan" />
              <FlowNode label="Test" sub="A/B + cohorts" tone="ok" />
              <FlowNode label="Decide" sub="KPI + action" tone="yellow" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>Campaign optimization</Chip>
                <Chip>CRM (Zoho-style)</Chip>
                <Chip>attribution</Chip>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MetricCard title="Qualified leads" value="+27%" meta="post-segmentation" />
                <MetricCard title="Sales cycle" value="-11%" meta="handoff clarity" />
                <MetricCard title="Churn risk" value="-6%" meta="proactive outreach" />
              </div>
            </div>
          </Card>

          <Card className="md:col-span-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">EXEC READOUT</div>
                <div className="mt-1 text-lg font-extrabold">KPI tracking cards</div>
              </div>
              <Chip>Power BI</Chip>
            </div>
            <div className="mt-4 grid gap-2">
              <ImpactRow label="Dispatch idle time" value="-9.4%" hint="route optimization + shift pattern" />
              <ImpactRow label="Preventive maintenance compliance" value="+13%" hint="alerting + SOP adherence" />
              <ImpactRow label="Data freshness" value="15 min" hint="streaming bus + monitoring" />
              <ImpactRow label="Executive reporting cycle" value="-60%" hint="automated narrative packs" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">A/B engine simulation</div>
              <div className="mt-1 text-sm font-extrabold">Experiment → decision → rollout</div>
              <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">
                Tests are tied to operational hypotheses (not vanity metrics), then shipped as standard work.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        id="build"
        eyebrow="WHAT I WOULD BUILD FOR EPIROC"
        title="A roadmap that leadership can fund tomorrow"
        subtitle="Four deliverables visualized as product modules: predictive maintenance, AI operational alerts, integrated CRM + ops intelligence, and automated reporting."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <BuildModule
            title="Predictive maintenance dashboard"
            desc="Health scores per asset, failure probability windows, and maintenance capacity planning."
            bullets={["Asset health index", "Parts + labor forecasting", "Downtime cost avoidance"]}
            col="md:col-span-6"
            tone="yellow"
          />
          <BuildModule
            title="AI-powered operational alerts"
            desc="Telemetry + context + SOP suggestions; escalates only when confidence crosses a threshold."
            bullets={["Anomaly baselines", "Alert fatigue control", "Ops-safe response playbooks"]}
            col="md:col-span-6"
            tone="cyan"
          />
          <BuildModule
            title="Integrated CRM + operations intelligence"
            desc="Connect customer outcomes with operational reality to prioritize actions that protect revenue."
            bullets={["Account risk + ops signals", "Unified attribution", "Customer-facing proof of value"]}
            col="md:col-span-7"
            tone="ok"
          />
          <BuildModule
            title="Automated reporting engine"
            desc="Narrative packs for leaders: what changed, why it matters, what to do next."
            bullets={["KPI narrative templates", "Control evidence packs", "Weekly exec briefing automation"]}
            col="md:col-span-5"
            tone="yellow"
          />
        </div>
      </Section>

      <Section
        id="about"
        eyebrow="ABOUT"
        title="Bridge between business + systems + data"
        subtitle="Minimal, impact-first: consulting mindset + operational rigor + analytics execution."
      >
        <div className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Chip>Strayos — Business Analyst + Marketing</Chip>
              <Chip>EY Capstone — Tech Consulting</Chip>
              <Chip>SAP + dashboards + workflow optimization</Chip>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <AboutTile title="Systems thinking" value="IT + OT context" detail="Translate constraints into buildable solutions." />
              <AboutTile title="Analytics execution" value="SQL → BI → action" detail="Ship metrics with ownership + adoption." />
              <AboutTile title="Risk posture" value="GRC signal design" detail="Reduce exposure without slowing operations." />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.35)] p-4 text-xs text-[hsla(var(--text)/0.65)]">
              This page is intentionally designed like an internal leadership console: visuals first, narrative second, and
              everything tied to operational outcomes.
            </div>
          </Card>
          <Card className="md:col-span-5">
            <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">CAPABILITIES SNAPSHOT</div>
            <div className="mt-3 grid gap-2">
              <Capability label="Dashboards" detail="Power BI / Tableau-style executive views" />
              <Capability label="Data" detail="SQL modeling, pipelines, KPI governance" />
              <Capability label="Process" detail="BPMN workflows, SOPs, handoff clarity" />
              <Capability label="Cyber + GRC" detail="Risk heatmaps, segmentation, evidence packs" />
              <Capability label="Delivery" detail="Agile execution, JIRA-style tracking" />
            </div>
            <div className="mt-4 rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4">
              <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">Signal</div>
              <div className="mt-1 text-sm font-extrabold">“Operate like you’re already inside Epiroc.”</div>
              <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">
                Build dashboards that leadership trusts because they map to systems, controls, and real constraints.
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <footer className="mx-auto w-full max-w-7xl px-5 pb-20 md:px-8">
        <div className="rounded-2xl border border-[hsla(var(--yellow)/0.12)] bg-[hsla(0_0%_0%/0.35)] p-5 text-xs text-[hsla(var(--text)/0.6)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-[hsla(var(--text)/0.82)]">EPIROC OPS INTEL</span>{" "}
              <span className="text-[hsla(var(--text)/0.6)]">— single-page operational intelligence simulation</span>
            </div>
            <a
              href="#hero"
              className="rounded-full border border-[hsla(var(--yellow)/0.22)] bg-[hsla(0_0%_100%/0.05)] px-3 py-1.5 font-semibold text-[hsla(var(--text)/0.75)] hover:bg-[hsla(0_0%_100%/0.08)] transition"
            >
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProcessCard({
  title,
  points,
  accent
}: {
  title: string;
  points: string[];
  accent: "danger" | "ok";
}) {
  const tone =
    accent === "danger"
      ? "border-[hsla(var(--danger)/0.25)] bg-[hsla(var(--danger)/0.08)]"
      : "border-[hsla(var(--ok)/0.25)] bg-[hsla(var(--ok)/0.08)]";
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <div className="text-sm font-extrabold">{title}</div>
      <ul className="mt-3 space-y-2 text-xs text-[hsla(var(--text)/0.68)]">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--yellow))]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowNode({
  label,
  sub,
  tone
}: {
  label: string;
  sub: string;
  tone?: "yellow" | "cyan" | "ok" | "danger";
}) {
  const ring =
    tone === "cyan"
      ? "border-[hsla(var(--cyan)/0.28)] shadow-[0_0_28px_hsla(var(--cyan)/0.10)]"
      : tone === "ok"
        ? "border-[hsla(var(--ok)/0.28)] shadow-[0_0_28px_hsla(var(--ok)/0.10)]"
        : tone === "danger"
          ? "border-[hsla(var(--danger)/0.28)] shadow-[0_0_28px_hsla(var(--danger)/0.10)]"
          : "border-[hsla(var(--yellow)/0.24)] shadow-[0_0_28px_hsla(var(--yellow)/0.10)]";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={`rounded-xl border bg-[hsla(0_0%_100%/0.05)] p-3 ${ring}`}
    >
      <div className="text-xs font-extrabold">{label}</div>
      <div className="mt-1 text-[11px] text-[hsla(var(--text)/0.62)]">{sub}</div>
    </motion.div>
  );
}

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] p-4"
    >
      <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-full border border-[hsla(var(--yellow)/0.18)] bg-[hsla(0_0%_100%/0.05)] px-3 py-1.5 text-xs font-extrabold text-[hsla(var(--text)/0.80)] hover:bg-[hsla(0_0%_100%/0.08)] transition"
          >
            {it}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function FrameworkStep({
  step,
  title,
  detail,
  impact,
  tone
}: {
  step: string;
  title: string;
  detail: string;
  impact: string;
  tone: "yellow" | "cyan" | "ok" | "danger";
}) {
  const ring =
    tone === "cyan"
      ? "border-[hsla(var(--cyan)/0.28)]"
      : tone === "ok"
        ? "border-[hsla(var(--ok)/0.28)]"
        : tone === "danger"
          ? "border-[hsla(var(--danger)/0.28)]"
          : "border-[hsla(var(--yellow)/0.22)]";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border bg-[hsla(0_0%_0%/0.32)] p-3 ${ring}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">{step}</div>
        <div className="text-xs font-extrabold text-[hsl(var(--yellow))]">{title}</div>
      </div>
      <div className="mt-2 text-xs text-[hsla(var(--text)/0.66)]">{detail}</div>
      <div className="mt-2 rounded-lg border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] px-2.5 py-2 text-[11px] font-semibold text-[hsla(var(--text)/0.74)]">
        Impact: <span className="font-extrabold text-[hsla(var(--text)/0.85)]">{impact}</span>
      </div>
    </motion.div>
  );
}

function ImpactPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] px-3 py-2">
      <div className="text-[11px] font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-[hsl(var(--yellow))]">{value}</div>
    </div>
  );
}

function TaskRow({
  id,
  title,
  status,
  owner
}: {
  id: string;
  title: string;
  status: "In progress" | "Blocked" | "In review" | "Done";
  owner: string;
}) {
  const badge =
    status === "Done"
      ? "border-[hsla(var(--ok)/0.28)] bg-[hsla(var(--ok)/0.10)] text-[hsla(var(--text)/0.82)]"
      : status === "Blocked"
        ? "border-[hsla(var(--danger)/0.28)] bg-[hsla(var(--danger)/0.10)] text-[hsla(var(--text)/0.82)]"
        : status === "In review"
          ? "border-[hsla(var(--cyan)/0.28)] bg-[hsla(var(--cyan)/0.10)] text-[hsla(var(--text)/0.82)]"
          : "border-[hsla(var(--yellow)/0.28)] bg-[hsla(var(--yellow)/0.10)] text-[hsla(var(--text)/0.82)]";
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] px-3 py-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">{id}</div>
          <div className="mt-1 text-sm font-extrabold">{title}</div>
          <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{owner}</div>
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs font-extrabold ${badge}`}>{status}</div>
      </div>
    </motion.div>
  );
}

function GrcTile({
  title,
  value,
  tone,
  detail
}: {
  title: string;
  value: string;
  tone: "danger" | "yellow" | "ok";
  detail: string;
}) {
  const style =
    tone === "danger"
      ? "border-[hsla(var(--danger)/0.28)] bg-[hsla(var(--danger)/0.10)]"
      : tone === "ok"
        ? "border-[hsla(var(--ok)/0.28)] bg-[hsla(var(--ok)/0.10)]"
        : "border-[hsla(var(--yellow)/0.28)] bg-[hsla(var(--yellow)/0.10)]";
  return (
    <div className={`rounded-xl border p-4 ${style}`}>
      <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">{title}</div>
      <div className="mt-2 text-lg font-extrabold">{value}</div>
      <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{detail}</div>
    </div>
  );
}

function ComplianceRow({ label, status }: { label: string; status: string }) {
  const tone =
    status === "On track"
      ? "bg-[hsla(var(--ok)/0.12)] border-[hsla(var(--ok)/0.28)]"
      : status === "Needs attention"
        ? "bg-[hsla(var(--danger)/0.12)] border-[hsla(var(--danger)/0.28)]"
        : status === "Partial"
          ? "bg-[hsla(var(--yellow)/0.12)] border-[hsla(var(--yellow)/0.28)]"
          : "bg-[hsla(var(--cyan)/0.10)] border-[hsla(var(--cyan)/0.24)]";
  return (
    <div className="flex items-center justify-between rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] px-3 py-3">
      <div className="text-sm font-extrabold">{label}</div>
      <div className={`rounded-full border px-3 py-1 text-xs font-extrabold ${tone}`}>{status}</div>
    </div>
  );
}

function DocModule({ title, items }: { title: string; items: string[] }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] p-4"
    >
      <div className="text-sm font-extrabold">{title}</div>
      <ul className="mt-3 space-y-2 text-xs text-[hsla(var(--text)/0.66)]">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--yellow))]" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SopStep({ step, title, detail }: { step: string; title: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-3"
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">{step}</div>
        <div className="text-xs font-extrabold text-[hsl(var(--yellow))]">{title}</div>
      </div>
      <div className="mt-2 text-xs text-[hsla(var(--text)/0.62)]">{detail}</div>
    </motion.div>
  );
}

function MetricCard({ title, value, meta }: { title: string; value: string; meta: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] p-4"
    >
      <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">{title}</div>
      <div className="mt-2 text-2xl font-extrabold text-[hsl(var(--yellow))]">{value}</div>
      <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{meta}</div>
    </motion.div>
  );
}

function ImpactRow({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] px-3 py-3"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm font-extrabold">{label}</div>
        <div className="text-sm font-extrabold text-[hsl(var(--yellow))]">{value}</div>
      </div>
      <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{hint}</div>
    </motion.div>
  );
}

function BuildModule({
  title,
  desc,
  bullets,
  col,
  tone
}: {
  title: string;
  desc: string;
  bullets: string[];
  col: string;
  tone: "yellow" | "cyan" | "ok";
}) {
  const ring =
    tone === "cyan"
      ? "border-[hsla(var(--cyan)/0.28)] shadow-[0_0_42px_hsla(var(--cyan)/0.10)]"
      : tone === "ok"
        ? "border-[hsla(var(--ok)/0.28)] shadow-[0_0_42px_hsla(var(--ok)/0.10)]"
        : "border-[hsla(var(--yellow)/0.22)] shadow-[0_0_42px_hsla(var(--yellow)/0.10)]";
  return (
    <Card className={`${col} overflow-hidden`}>
      <div className={`rounded-xl border bg-[hsla(0_0%_0%/0.35)] p-5 ${ring}`}>
        <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">MODULE</div>
        <div className="mt-2 text-xl font-extrabold">{title}</div>
        <div className="mt-2 text-sm text-[hsla(var(--text)/0.68)]">{desc}</div>
        <div className="mt-4 grid gap-2">
          {bullets.map((b) => (
            <div
              key={b}
              className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_100%/0.05)] px-3 py-2 text-xs font-semibold text-[hsla(var(--text)/0.78)]"
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AboutTile({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] p-4"
    >
      <div className="text-xs font-semibold tracking-wide text-[hsla(var(--text)/0.62)]">{title}</div>
      <div className="mt-2 text-lg font-extrabold text-[hsl(var(--yellow))]">{value}</div>
      <div className="mt-1 text-xs text-[hsla(var(--text)/0.62)]">{detail}</div>
    </motion.div>
  );
}

function Capability({ label, detail }: { label: string; detail: string }) {
  return (
    <motion.div
      whileHover={{ x: 2 }}
      className="rounded-xl border border-[hsla(var(--yellow)/0.14)] bg-[hsla(0_0%_0%/0.32)] px-3 py-3"
    >
      <div className="text-xs font-semibold tracking-[0.24em] text-[hsla(var(--text)/0.55)]">{label}</div>
      <div className="mt-1 text-sm font-extrabold">{detail}</div>
    </motion.div>
  );
}
