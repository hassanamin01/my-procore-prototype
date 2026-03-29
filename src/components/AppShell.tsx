import { useState } from "react";
import { Banner, Button, DetailPage, Page } from "@procore/core-react";
import SidebarNav, { NavItemId } from "@/components/SidebarNav";
import Dashboard from "@/components/Dashboard";
import DailyLogForm from "@/components/DailyLogForm";
import QuickCaptureModal from "@/components/QuickCaptureModal";

// ── Placeholder view for unbuilt sections ──────────────────────────────────────

const SECTION_META: Record<NavItemId, { title: string; description: string }> = {
  "dashboard":    { title: "Dashboard",    description: "Project status overview." },
  "daily-logs":   { title: "Daily Logs",   description: "Record daily site activity, manpower, weather, and progress." },
  "incidents":    { title: "Incidents",    description: "Log and track safety incidents, near misses, and corrective actions." },
  "inspections":  { title: "Inspections",  description: "Run checklist-based inspections and capture pass/fail results." },
  "observations": { title: "Observations", description: "Capture site conditions and assign corrective tasks." },
  "action-plans": { title: "Action Plans", description: "Manage milestone-based quality assurance documentation." },
};

function PlaceholderView({ id }: { id: NavItemId }) {
  const meta = SECTION_META[id];
  return (
    <DetailPage width="lg">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Quality &amp; Safety › {meta.title}
            </span>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{meta.title}</h1>
          </DetailPage.Title>
        </DetailPage.Header>
        <DetailPage.Body>
          <DetailPage.Card>
            <DetailPage.Section>
              <p style={{ color: "#6b7280", margin: 0 }}>{meta.description}</p>
              <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 8 }}>
                This section is not yet built in the prototype.
              </p>
            </DetailPage.Section>
          </DetailPage.Card>
        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}

// ── Main shell ─────────────────────────────────────────────────────────────────

export default function AppShell() {
  const [activeNav, setActiveNav] = useState<NavItemId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<{
    incidentType: string;
    capturedAt: string;
  } | null>(null);

  function handleDraftSaved(incidentType: string, capturedAt: string) {
    setDraft({ incidentType, capturedAt });
    setActiveNav("incidents");
  }

  const formattedTime = draft
    ? new Date(draft.capturedAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Persistent Stage 2 reminder banner ── */}
      {draft && (
        <div style={{ flexShrink: 0, zIndex: 100 }}>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Title>
                Incomplete incident report — {draft.incidentType}
              </Banner.Title>
              <Banner.Body>
                Stage 1 captured at {formattedTime}. Complete Stage 2 within 24 hours.{" "}
                <button
                  onClick={() => setDraft(null)}
                  style={{
                    background: "none", border: "none", padding: 0,
                    cursor: "pointer", fontSize: "inherit",
                    color: "#92400e", fontWeight: 600, textDecoration: "underline",
                  }}
                >
                  Dismiss
                </button>
              </Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      {/* ── Top action bar ── */}
      <div
        style={{
          flexShrink: 0,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background: "none",
            border: "1px solid #d1d5db",
            borderRadius: 4,
            padding: "5px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#374151",
          }}
        >
          {/* Hamburger / close icon */}
          {sidebarOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
          Quality &amp; Safety
        </span>

        <div style={{ marginLeft: "auto" }}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            ⚠ Report Incident
          </Button>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ flexShrink: 0, overflowY: "auto" }}>
            <SidebarNav selected={activeNav} onSelect={setActiveNav} />
          </div>
        )}

        {/* Main content area */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Page>
            <Page.Main>
              <Page.Body>
                {activeNav === "dashboard" ? (
                  <Dashboard />
                ) : activeNav === "daily-logs" ? (
                  <DailyLogForm />
                ) : (
                  <PlaceholderView id={activeNav} />
                )}
              </Page.Body>
            </Page.Main>
          </Page>
        </div>
      </div>

      {/* ── Quick capture modal ── */}
      <QuickCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDraftSaved={handleDraftSaved}
      />
    </div>
  );
}
