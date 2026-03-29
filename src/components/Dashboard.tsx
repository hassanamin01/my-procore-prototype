import { Card, DetailPage, H3, P, Pill } from "@procore/core-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: "Safety Score",
    value: "94",
    unit: "/ 100",
    trend: "+2 this week",
    trendUp: true,
    pillColor: "green" as const,
    pillLabel: "Good",
    accent: "#16a34a",
  },
  {
    label: "Open Incidents",
    value: "3",
    unit: "active",
    trend: "1 overdue Stage 2",
    trendUp: false,
    pillColor: "red" as const,
    pillLabel: "Needs attention",
    accent: "#dc2626",
  },
  {
    label: "Inspection Pass Rate",
    value: "87",
    unit: "%",
    trend: "-4% vs last week",
    trendUp: false,
    pillColor: "yellow" as const,
    pillLabel: "Watch",
    accent: "#d97706",
  },
  {
    label: "Daily Logs",
    value: "12",
    unit: "this month",
    trend: "Last entry: today",
    trendUp: true,
    pillColor: "blue" as const,
    pillLabel: "On track",
    accent: "#2563eb",
  },
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

// ── Helpers ────────────────────────────────────────────────────────────────────

function ResultPill({ result }: { result: string }) {
  const color = result === "Pass" ? "green" : result === "Fail" ? "red" : "gray";
  return <Pill color={color as any}>{result}</Pill>;
}

function TrendIcon({ up }: { up: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      {up ? (
        <path d="M18 15l-6-6-6 6" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 9l6 6 6-6" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// ── KPI card ───────────────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, trend, trendUp, pillColor, pillLabel, accent }: typeof KPI_CARDS[0]) {
  return (
    <Card shadowStrength={1} style={{ padding: "20px 24px", flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </span>
        <Pill color={pillColor}>{pillLabel}</Pill>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: accent, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500 }}>{unit}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <TrendIcon up={trendUp} />
        <span style={{ fontSize: 12, color: trendUp ? "#16a34a" : "#dc2626" }}>{trend}</span>
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
            <span style={{ fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Overview</span>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Project Dashboard</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
                  Grandview Mixed-Use · As of Mar 29, 2026
                </p>
              </div>
              <Pill color="blue">Active</Pill>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>

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
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 16px", background: "#f9fafb", borderRadius: 6, border: "1px solid #e5e7eb",
                      }}
                    >
                      <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>{inc.type}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>{inc.count} open</span>
                        <Pill color={inc.color}>{inc.count}</Pill>
                      </div>
                    </div>
                  ))}
                  <P style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
                    1 draft awaiting Stage 2 completion · expires in 6 h
                  </P>
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
                        borderBottom: i < INSPECTION_SUMMARY.length - 1 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>{ins.area}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>{ins.date}</span>
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
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Date", "Superintendent", "Workers", "Status"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left", padding: "0 0 8px", color: "#9ca3af",
                            fontWeight: 600, fontSize: 11, textTransform: "uppercase",
                            letterSpacing: "0.05em", borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_LOGS.map((log, i) => (
                      <tr key={log.date} style={{ borderBottom: i < RECENT_LOGS.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                        <td style={{ padding: "9px 0", color: "#374151", fontWeight: 500 }}>{log.date}</td>
                        <td style={{ padding: "9px 0", color: "#374151" }}>{log.superintendent}</td>
                        <td style={{ padding: "9px 0", color: "#374151" }}>{log.workers}</td>
                        <td style={{ padding: "9px 0" }}><Pill color={log.pill}>{log.status}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6 }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>{action.id}</span>
                        <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 600 }}>{action.daysOver}d overdue</span>
                      </div>
                      <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: "#111827" }}>{action.title}</p>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{action.assignee} · Due {action.due}</span>
                    </div>
                  ))}
                  <div
                    style={{ padding: "12px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, marginTop: 4 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Pill color="yellow">Behind</Pill>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#92400e" }}>Schedule status</span>
                    </div>
                    <P style={{ margin: "6px 0 0", fontSize: 12, color: "#92400e" }}>
                      2 days behind on structural framing. Recovery plan required.
                    </P>
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
                    <P style={{ margin: 0, fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {label}
                    </P>
                    <H3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#111827" }}>
                      {value}
                    </H3>
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
