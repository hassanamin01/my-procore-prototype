import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  DetailPage,
  Form,
  H2,
  Pill,
  useFormContext,
} from "@procore/core-react";

// ── Types & mock data ──────────────────────────────────────────────────────────

interface Opt {
  id: string;
  label: string;
}

type IncidentStatus = "draft" | "open" | "under_review" | "closed";

interface Incident {
  id: string;
  type: string;
  typeId: string;
  status: IncidentStatus;
  capturedAt: string;
  location: string;
  reportedBy: string;
  assignee: string;
  description: string;
  immediateAction: string;
  stage: 1 | 2;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-031",
    type: "Near Miss",
    typeId: "near_miss",
    status: "draft",
    capturedAt: "2026-03-29T09:14",
    location: "Level 3 — stairwell B",
    reportedBy: "J. Rivera",
    assignee: "T. Walsh",
    description: "",
    immediateAction: "Area cordoned off pending guardrail replacement.",
    stage: 1,
  },
  {
    id: "INC-2026-028",
    type: "Injury / Illness",
    typeId: "injury",
    status: "open",
    capturedAt: "2026-03-27T14:22",
    location: "Loading bay — dock 2",
    reportedBy: "M. Okonkwo",
    assignee: "K. Patel",
    description: "Worker sustained laceration to left forearm while handling sheet metal. First aid administered on site. Worker transported to urgent care.",
    immediateAction: "First aid administered. Site supervisor notified. Work in area paused.",
    stage: 2,
  },
  {
    id: "INC-2026-025",
    type: "Property Damage",
    typeId: "property_damage",
    status: "under_review",
    capturedAt: "2026-03-25T11:05",
    location: "Parking level P1",
    reportedBy: "J. Rivera",
    assignee: "J. Rivera",
    description: "Delivery truck struck a structural column while reversing. Visible concrete spalling — structural engineer review requested.",
    immediateAction: "Area blocked off. Structural engineer notified. Photos taken.",
    stage: 2,
  },
];

const INCIDENT_TYPES: Opt[] = [
  { id: "injury", label: "Injury / Illness" },
  { id: "near_miss", label: "Near Miss" },
  { id: "property_damage", label: "Property Damage" },
  { id: "environmental", label: "Environmental" },
  { id: "security", label: "Security" },
];

const SEVERITY_OPTIONS: Opt[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "critical", label: "Critical" },
];

const CONTRIBUTING_FACTORS: Opt[] = [
  { id: "ppe", label: "Inadequate PPE" },
  { id: "training", label: "Insufficient Training" },
  { id: "procedure", label: "Procedure Not Followed" },
  { id: "equipment", label: "Equipment Failure" },
  { id: "environment", label: "Environmental Conditions" },
  { id: "communication", label: "Communication Failure" },
  { id: "fatigue", label: "Fatigue / Distraction" },
  { id: "other", label: "Other" },
];

const CORRECTIVE_STATUS: Opt[] = [
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "complete", label: "Complete" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_PILL: Record<IncidentStatus, { color: "red" | "yellow" | "blue" | "gray"; label: string }> = {
  draft:        { color: "yellow", label: "Draft — Stage 1" },
  open:         { color: "red",    label: "Open" },
  under_review: { color: "blue",   label: "Under Review" },
  closed:       { color: "gray",   label: "Closed" },
};

function formatDt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: "2px solid #e5e7eb", marginBottom: 16, paddingBottom: 8 }}>
      <H2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", margin: 0 }}>
        {children}
      </H2>
    </div>
  );
}

// ── Stage 2 form ───────────────────────────────────────────────────────────────

interface Stage2Values {
  incidentType: Opt | null;
  severity: Opt | null;
  location: string;
  involvedParty: string;
  jobTitle: string;
  description: string;
  contributingFactor: Opt | null;
  rootCause: string;
  correctiveAction: string;
  correctiveStatus: Opt | null;
  correctiveDueDate: string;
  witnesses: string;
}

interface Stage2FormBodyProps {
  incident: Incident;
  onSaved: () => void;
  onCancel: () => void;
}

function Stage2FormBody({ incident, onSaved, onCancel }: Stage2FormBodyProps) {
  const { isSubmitting } = useFormContext<Stage2Values>();

  return (
    <Form.Form>
      {/* Stage 2 badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 4, padding: "3px 10px", marginBottom: 20 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#2563eb"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>STAGE 2 · Full Incident Report</span>
      </div>

      {/* Immutable Stage 1 record */}
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 32 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Incident ID</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{incident.id}</p>
        </div>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Captured</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{formatDt(incident.capturedAt)}</p>
        </div>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Reported by</p>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{incident.reportedBy}</p>
        </div>
      </div>

      <SectionHeading>Incident Details</SectionHeading>
      <Form.Row>
        <Form.Select
          name="incidentType"
          label="Incident Type"
          required
          colWidth={6}
          options={INCIDENT_TYPES}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
        <Form.Select
          name="severity"
          label="Severity"
          required
          colWidth={6}
          options={SEVERITY_OPTIONS}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
      </Form.Row>
      <Form.Row>
        <Form.Text name="location" label="Location on Site" required colWidth={6} />
        <Form.Text name="involvedParty" label="Involved Party Name" colWidth={4} />
        <Form.Text name="jobTitle" label="Job Title" colWidth={2} />
      </Form.Row>
      <Form.Row>
        <Form.TextArea name="description" label="Incident Description" required description="Provide a detailed factual account of what occurred." colWidth={12} />
      </Form.Row>

      <div style={{ marginTop: 24 }}>
        <SectionHeading>Causal Analysis</SectionHeading>
        <Form.Row>
          <Form.Select
            name="contributingFactor"
            label="Primary Contributing Factor"
            colWidth={6}
            options={CONTRIBUTING_FACTORS}
            getId={(o: Opt | null) => o?.id ?? ""}
            getLabel={(o: Opt | null) => o?.label ?? ""}
          />
        </Form.Row>
        <Form.Row>
          <Form.TextArea name="rootCause" label="Root Cause Analysis" description="Describe the underlying cause(s) of this incident." colWidth={12} />
        </Form.Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionHeading>Corrective Actions</SectionHeading>
        <Form.Row>
          <Form.TextArea name="correctiveAction" label="Corrective Action" required description="Describe the action taken or planned to prevent recurrence." colWidth={8} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <Form.Select
              name="correctiveStatus"
              label="Status"
              colWidth={12}
              options={CORRECTIVE_STATUS}
              getId={(o: Opt | null) => o?.id ?? ""}
              getLabel={(o: Opt | null) => o?.label ?? ""}
            />
            <Form.Text name="correctiveDueDate" label="Due Date" colWidth={12} />
          </div>
        </Form.Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionHeading>Witnesses</SectionHeading>
        <Form.Row>
          <Form.TextArea name="witnesses" label="Witness Names" description="List names and contact details of any witnesses." colWidth={12} />
        </Form.Row>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          ← Back to list
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" type="reset">Discard changes</Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Submit Report
          </Button>
        </div>
      </div>
    </Form.Form>
  );
}

// ── Incident row card ──────────────────────────────────────────────────────────

interface IncidentRowProps {
  incident: Incident;
  onOpen: (id: string) => void;
}

function IncidentRow({ incident, onOpen }: IncidentRowProps) {
  const { color, label } = STATUS_PILL[incident.status];
  const isOverdue = incident.stage === 1;

  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        background: "#fff",
        border: `1px solid ${isOverdue ? "#fecaca" : "#e5e7eb"}`,
        borderLeft: `4px solid ${isOverdue ? "#dc2626" : incident.status === "under_review" ? "#2563eb" : "#e5e7eb"}`,
        borderRadius: 6,
        cursor: "pointer",
        transition: "box-shadow 0.12s",
      }}
      onClick={() => onOpen(incident.id)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{incident.id}</span>
          <Pill color={color}>{label}</Pill>
          {isOverdue && <Pill color="red">Stage 2 required</Pill>}
        </div>
        <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{incident.type}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
          {formatDt(incident.capturedAt)} · {incident.location} · Reported by {incident.reportedBy}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 24, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: "#6b7280" }}>Assignee: {incident.assignee}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#9ca3af" }}>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Detail view ────────────────────────────────────────────────────────────────

interface DetailViewProps {
  incident: Incident;
  onBack: () => void;
  onSubmitted: (id: string) => void;
}

function DetailView({ incident, onBack, onSubmitted }: DetailViewProps) {
  const [submitted, setSubmitted] = useState(false);
  const { color, label } = STATUS_PILL[incident.status];

  const initialValues: Stage2Values = {
    incidentType: INCIDENT_TYPES.find(t => t.id === incident.typeId) ?? null,
    severity: null,
    location: incident.location,
    involvedParty: "",
    jobTitle: "",
    description: incident.description,
    contributingFactor: null,
    rootCause: "",
    correctiveAction: incident.immediateAction,
    correctiveStatus: null,
    correctiveDueDate: "",
    witnesses: "",
  };

  function handleSubmit(_values: Stage2Values, actions: { setSubmitting: (b: boolean) => void }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        setSubmitted(true);
        onSubmitted(incident.id);
        resolve();
      }, 700);
    });
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Incidents › {incident.id}</p>
        </div>
        <Banner variant="info">
          <Banner.Content>
            <Banner.Title>Incident report submitted</Banner.Title>
            <Banner.Body>
              {incident.id} has been submitted for review.{" "}
              <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit", color: "#166534", fontWeight: 600, textDecoration: "underline" }}>
                Back to incidents
              </button>
            </Banner.Body>
          </Banner.Content>
        </Banner>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Incidents › {incident.id}</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700 }}>{incident.type}</h1>
        </div>
        <Pill color={color}>{label}</Pill>
      </div>

      {incident.stage === 1 && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Title>Stage 1 draft — complete Stage 2 within 24 hours</Banner.Title>
              <Banner.Body>Fill in the full incident report below and submit for review.</Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      <Card shadowStrength={1}>
        <div style={{ padding: "28px 32px" }}>
          <Form view="create" initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            <Stage2FormBody incident={incident} onSaved={() => setSubmitted(true)} onCancel={onBack} />
          </Form>
        </div>
      </Card>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = incidents.find(i => i.id === selectedId) ?? null;

  function handleSubmitted(id: string) {
    setIncidents(prev =>
      prev.map(i => i.id === id ? { ...i, status: "under_review" as IncidentStatus, stage: 2 } : i)
    );
  }

  if (selected) {
    return (
      <DetailView
        incident={selected}
        onBack={() => setSelectedId(null)}
        onSubmitted={handleSubmitted}
      />
    );
  }

  const open = incidents.filter(i => i.status !== "closed");
  const drafts = incidents.filter(i => i.status === "draft");

  return (
    <DetailPage width="xl">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Incidents</span>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Incidents</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Grandview Mixed-Use · {open.length} open</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill color="red">{open.length} open</Pill>
                {drafts.length > 0 && <Pill color="yellow">{drafts.length} awaiting Stage 2</Pill>}
              </div>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>

          {drafts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Banner variant="attention">
                <Banner.Content>
                  <Banner.Title>{drafts.length} incident{drafts.length > 1 ? "s" : ""} require Stage 2 completion</Banner.Title>
                  <Banner.Body>Stage 1 drafts must be completed within 24 hours of capture.</Banner.Body>
                </Banner.Content>
              </Banner>
            </div>
          )}

          <Card shadowStrength={1}>
            <DetailPage.Section
              heading="Open Incidents"
              pills={<Pill color="red">{open.length} open</Pill>}
              subtext="Click any row to view or complete the incident report"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                {open.map(inc => (
                  <IncidentRow key={inc.id} incident={inc} onOpen={setSelectedId} />
                ))}
              </div>
            </DetailPage.Section>
          </Card>

          {incidents.some(i => i.status === "closed") && (
            <Card shadowStrength={1} style={{ marginTop: 16 }}>
              <DetailPage.Section heading="Closed" pills={<Pill color="gray">{incidents.filter(i => i.status === "closed").length}</Pill>}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                  {incidents.filter(i => i.status === "closed").map(inc => (
                    <IncidentRow key={inc.id} incident={inc} onOpen={setSelectedId} />
                  ))}
                </div>
              </DetailPage.Section>
            </Card>
          )}

        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}
