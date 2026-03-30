import { Card, DetailPage, Pill, Table, Typography } from "@procore/core-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { label: "Safety Score",         value: "94", unit: "/ 100",     trend: "+2 this week",      trendUp: true,  pillColor: "green"  as const, pillLabel: "Good",            accentColor: "green45"  as const },
  { label: "Open Incidents",       value: "3",  unit: "active",    trend: "1 overdue Stage 2", trendUp: false, pillColor: "red"    as const, pillLabel: "Needs attention",  accentColor: "red45"    as const },
  { label: "Inspection Pass Rate", value: "87", unit: "%",         trend: "-4% vs last week",  trendUp: false, pillColor: "yellow" as const, pillLabel: "Watch",           accentColor: "orange45" as const },
  { label: "Daily Logs",           value: "12", unit: "this month",trend: "Last entry: today",  trendUp: true,  pillColor: "blue"   as const, pillLabel: "On track",        accentColor: "blue45"   as const },
];

const INCIDENTS = [
  { type: "Near Miss",        count: 1, color: "yellow" as const },
  { type: "Injury / Illness", count: 1, color: "red"    as const },
  { type: "Property Damage",  count: 1, color: "gray"   as const },
];

const RECENT_LOGS = [
  { date: "Mar 29", superintendent: "J. Rivera",  status: "Complete",   workers: 14, pill: "green" as const },
  { date: "Mar 28", superintendent: "J. Rivera",  status: "Complete",   workers: 11, pill: "green" as const },
  { date: "Mar 27", superintendent: "M. Okonkwo", status: "Complete",   workers: 9,  pill: "green" as const },
  { date: "Mar 26", superintendent: "M. Okonkwo", status: "Incomplete", workers: 12, pill: "red"   as const },
  { date: "Mar 25", superintendent: "J. Rivera",  status: "Complete",   workers: 15, pill: "green" as const },
];

const OVERDUE_ACTIONS = [
  { id: "CA-041", title: "Guard rail replacement — Level 3", assignee: "T. Walsh", due: "Mar 27", daysOver: 2 },
  { id: "CA-039", title: "Spill kit restock — Loading bay",  assignee: "K. Patel", due: "Mar 28", daysOver: 1 },
];

const INSPECTION_SUMMARY = [
  { area: "Structural framing",    result: "Pass",    date: "Mar 29" },
  { area: "Electrical rough-in",   result: "Fail",    date: "Mar 28" },
  { area: "Fire stopping",         result: "Pass",    date: "Mar 27" },
  { area: "Plumbing rough-in",     result: "Pass",    date: "Mar 26" },
  { area: "Foundation waterproof", result: "Pending", date: "Mar 25" },
];

const WEATHER = { condition: "Partly Cloudy", high: 68, low: 52, precipitation: "0.0 in", wind: "12 mph NW" };

const PROJECT_SUMMARY = {
  name: "Grandview Mixed-Use",
  projectNumber: "PRJ-2024-0047",
  completion: 62,
  schedule: { status: "Behind", color: "red" as const, detail: "2 days behind" },
  budget: { status: "On Track", color: "green" as const, detail: "$4.2M of $6.8M spent" },
  workforce: { total: 47, subcontractors: 5 },
  projectManager: "A. Chen",
  superintendent: "J. Rivera",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function ResultPill({ result }: { result: string }) {
  const color = result === "Pass" ? "green" : result === "Fail" ? "red" : "gray";
  return <Pill color={color as any}>{result}</Pill>;
}

function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      {up ? (
        <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-green45)" }} />
      ) : (
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-red45)" }} />
      )}
    </svg>
  );
}

// ── Project Summary Card ───────────────────────────────────────────────────────

function ProjectSummaryCard() {
  return (
    <Card shadowStrength={1} style={{ marginBottom: 24, padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <Typography intent="h2" as="h2">{PROJECT_SUMMARY.name}</Typography>
          <Typography intent="small" color="gray50" as="p" style={{ marginTop: 2 }}>
            {PROJECT_SUMMARY.projectNumber} · PM: {PROJECT_SUMMARY.projectManager} · Super: {PROJECT_SUMMARY.superintendent}
          </Typography>
        </div>
        <Pill color="blue">Active</Pill>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <Typography intent="label" color="gray50">Overall Completion</Typography>
          <Typography intent="label" weight="semibold">{PROJECT_SUMMARY.completion}%</Typography>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--color-gray85, #e5e7eb)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${PROJECT_SUMMARY.completion}%`,
              borderRadius: 4,
              background: "var(--color-blue45, #3b82f6)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div>
          <Typography intent="label" color="gray50" as="p">Schedule</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Pill color={PROJECT_SUMMARY.schedule.color}>{PROJECT_SUMMARY.schedule.status}</Pill>
            <Typography intent="small" color="gray50">{PROJECT_SUMMARY.schedule.detail}</Typography>
          </div>
        </div>
        <div>
          <Typography intent="label" color="gray50" as="p">Budget</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Pill color={PROJECT_SUMMARY.budget.color}>{PROJECT_SUMMARY.budget.status}</Pill>
            <Typography intent="small" color="gray50">{PROJECT_SUMMARY.budget.detail}</Typography>
          </div>
        </div>
        <div>
          <Typography intent="label" color="gray50" as="p">Workforce Today</Typography>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Typography intent="h3" as="span">{PROJECT_SUMMARY.workforce.total}</Typography>
            <Typography intent="small" color="gray50" as="span">
              workers · {PROJECT_SUMMARY.workforce.subcontractors} subs on site
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── KPI card ───────────────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, trend, trendUp, pillColor, pillLabel, accentColor }: typeof KPI_CARDS[0]) {
  return (
    <Card shadowStrength={1} style={{ padding: "20px 24px", flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <Typography intent="label" color="gray50">{label}</Typography>
        <Pill color={pillColor}>{pillLabel}</Pill>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
        <Typography intent="h1" color={accentColor} as="span">{value}</Typography>
        <Typography intent="small" color="gray50" as="span">{unit}</Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <TrendIcon up={trendUp} />
        <Typography intent="small" color={trendUp ? "green45" : "red45"} as="span">{trend}</Typography>
      </div>
    </Card>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <DetailPage width="xl">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <Typography intent="small" color="gray50">Quality &amp; Safety › Overview</Typography>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Typography intent="h1" as="h1">Project Dashboard</Typography>
                <Typography intent="small" color="gray50" as="p" style={{ marginTop: 4 }}>
                  Grandview Mixed-Use · As of Mar 29, 2026
                </Typography>
              </div>
              <Pill color="blue">Active</Pill>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>

          {/* ── Project Summary ── */}
          <ProjectSummaryCard />

          {/* ── KPI row ── */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            {KPI_CARDS.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </div>

          {/* ── Row: Incidents + Inspections ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

            <Card shadowStrength={1}>
              <DetailPage.Section
                heading="Open Incidents"
                pills={<Pill color="red">3 open</Pill>}
                subtext="Requires attention within 24 h"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                  {INCIDENTS.map((inc) => (
                    <div
                      key={inc.type}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderRadius: 6, border: "1px solid" }}
                    >
                      <Typography intent="body" weight="semibold">{inc.type}</Typography>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Typography intent="small" color="gray50">{inc.count} open</Typography>
                        <Pill color={inc.color}>{inc.count}</Pill>
                      </div>
                    </div>
                  ))}
                  <Typography intent="small" color="gray50" as="p">
                    1 draft awaiting Stage 2 completion · expires in 6 h
                  </Typography>
                </div>
              </DetailPage.Section>
            </Card>

            <Card shadowStrength={1}>
              <DetailPage.Section
                heading="Recent Inspections"
                pills={<Pill color="yellow">1 failed</Pill>}
                subtext="Last 5 inspection results"
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {INSPECTION_SUMMARY.map((ins, i) => (
                    <div
                      key={ins.area}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "9px 0",
                        borderBottom: i < INSPECTION_SUMMARY.length - 1 ? "1px solid" : "none",
                      }}
                    >
                      <div>
                        <Typography intent="body" weight="semibold" as="span">{ins.area}</Typography>
                        <Typography intent="small" color="gray50" as="span" style={{ marginLeft: 8 }}>{ins.date}</Typography>
                      </div>
                      <ResultPill result={ins.result} />
                    </div>
                  ))}
                </div>
              </DetailPage.Section>
            </Card>

          </div>

          {/* ── Row: Daily Logs + Overdue Actions ── */}
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 16 }}>

            <Card shadowStrength={1}>
              <DetailPage.Section
                heading="Recent Daily Logs"
                pills={<Pill color="green">12 this month</Pill>}
              >
                <Table>
                  <Table.Container>
                    <Table.Header>
                      <Table.HeaderRow>
                        {["Date", "Superintendent", "Workers", "Status"].map((h) => (
                          <Table.HeaderCell key={h}>{h}</Table.HeaderCell>
                        ))}
                      </Table.HeaderRow>
                    </Table.Header>
                    <Table.Body>
                      {RECENT_LOGS.map((log) => (
                        <Table.BodyRow key={log.date}>
                          <Table.TextCell>{log.date}</Table.TextCell>
                          <Table.TextCell>{log.superintendent}</Table.TextCell>
                          <Table.TextCell>{log.workers}</Table.TextCell>
                          <Table.BodyCell><Pill color={log.pill}>{log.status}</Pill></Table.BodyCell>
                        </Table.BodyRow>
                      ))}
                    </Table.Body>
                  </Table.Container>
                </Table>
              </DetailPage.Section>
            </Card>

            <Card shadowStrength={1}>
              <DetailPage.Section
                heading="Overdue Actions"
                pills={<Pill color="red">{OVERDUE_ACTIONS.length} overdue</Pill>}
                subtext="Corrective actions past due date"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {OVERDUE_ACTIONS.map((action) => (
                    <div
                      key={action.id}
                      style={{ padding: "12px 14px", borderRadius: 6, border: "1px solid" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <Typography intent="label" color="gray50">{action.id}</Typography>
                        <Typography intent="label" color="red45" weight="semibold">{action.daysOver}d overdue</Typography>
                      </div>
                      <Typography intent="body" weight="semibold" as="p" style={{ margin: "0 0 4px" }}>{action.title}</Typography>
                      <Typography intent="small" color="gray50">{action.assignee} · Due {action.due}</Typography>
                    </div>
                  ))}
                  <div style={{ padding: "12px 14px", borderRadius: 6, border: "1px solid", marginTop: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Pill color="yellow">Behind</Pill>
                      <Typography intent="body" weight="semibold" color="orange45">Schedule status</Typography>
                    </div>
                    <Typography intent="small" color="orange45" as="p" style={{ margin: "6px 0 0" }}>
                      2 days behind on structural framing. Recovery plan required.
                    </Typography>
                  </div>
                </div>
              </DetailPage.Section>
            </Card>

          </div>

          {/* ── Weather summary ── */}
          <Card shadowStrength={1}>
            <DetailPage.Section
              heading="Today's Weather"
              subtext="Grandview site · Mar 29, 2026"
              pills={<Pill color="gray">{WEATHER.condition}</Pill>}
            >
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap", paddingTop: 4 }}>
                {[
                  { label: "High",          value: `${WEATHER.high}°F` },
                  { label: "Low",           value: `${WEATHER.low}°F` },
                  { label: "Precipitation", value: WEATHER.precipitation },
                  { label: "Wind",          value: WEATHER.wind },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <Typography intent="label" color="gray50" as="p">{label}</Typography>
                    <Typography intent="h2" as="p" style={{ marginTop: 4 }}>{value}</Typography>
                  </div>
                ))}
              </div>
            </DetailPage.Section>
          </Card>

        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}
