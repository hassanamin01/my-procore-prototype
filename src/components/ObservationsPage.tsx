import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  DetailPage,
  Form,
  H2,
  Pill,
  Tabs,
  useFormContext,
} from "@procore/core-react";

// ── Types & data ───────────────────────────────────────────────────────────────

interface Opt {
  id: string;
  label: string;
}

type ObsPriority = "low" | "medium" | "high" | "critical";
type ObsStatus   = "open" | "in_progress" | "resolved";

interface Observation {
  id: string;
  title: string;
  location: string;
  category: string;
  priority: ObsPriority;
  status: ObsStatus;
  reportedBy: string;
  assignee: string;
  date: string;
  description: string;
  dueDate: string;
}

const MOCK_OBSERVATIONS: Observation[] = [
  {
    id: "OBS-2026-044",
    title: "Unsecured scaffolding planks — Level 2 west",
    location: "Level 2 — west facade",
    category: "Safety",
    priority: "high",
    status: "open",
    reportedBy: "J. Rivera",
    assignee: "T. Walsh",
    date: "2026-03-29",
    description: "Three scaffold planks are not secured with toe boards. Workers below are exposed to falling object risk.",
    dueDate: "2026-03-30",
  },
  {
    id: "OBS-2026-043",
    title: "Missing fire stop at penetration — Elec room",
    location: "Level 1 — electrical room 1A",
    category: "Fire Safety",
    priority: "critical",
    status: "in_progress",
    reportedBy: "M. Okonkwo",
    assignee: "K. Patel",
    date: "2026-03-28",
    description: "Electrical conduit penetrates a fire-rated wall without approved firestop sealant. Requires immediate remediation.",
    dueDate: "2026-03-29",
  },
  {
    id: "OBS-2026-041",
    title: "Standing water in basement — potential slip hazard",
    location: "Basement level — pump room",
    category: "Housekeeping",
    priority: "medium",
    status: "open",
    reportedBy: "J. Rivera",
    assignee: "J. Rivera",
    date: "2026-03-27",
    description: "Approximately 2 inches of standing water from overnight precipitation. Sump pump appears to be non-functional.",
    dueDate: "2026-03-28",
  },
  {
    id: "OBS-2026-038",
    title: "Improperly stored hazardous materials — loading bay",
    location: "Loading bay — dock 1",
    category: "Safety",
    priority: "medium",
    status: "resolved",
    reportedBy: "K. Patel",
    assignee: "K. Patel",
    date: "2026-03-25",
    description: "Solvent containers stored without secondary containment in an area without ventilation.",
    dueDate: "2026-03-26",
  },
];

const CATEGORIES: Opt[] = [
  { id: "safety", label: "Safety" },
  { id: "fire", label: "Fire Safety" },
  { id: "quality", label: "Quality" },
  { id: "housekeeping", label: "Housekeeping" },
  { id: "environmental", label: "Environmental" },
  { id: "ppe", label: "PPE" },
  { id: "other", label: "Other" },
];

const PRIORITY_OPTIONS: Opt[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "critical", label: "Critical" },
];

const STATUS_OPTIONS: Opt[] = [
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const PRIORITY_PILL: Record<ObsPriority, { color: "red" | "yellow" | "gray" | "blue" }> = {
  critical: { color: "red" },
  high:     { color: "red" },
  medium:   { color: "yellow" },
  low:      { color: "gray" },
};

const STATUS_PILL: Record<ObsStatus, { color: "red" | "blue" | "green"; label: string }> = {
  open:        { color: "red",   label: "Open" },
  in_progress: { color: "blue",  label: "In Progress" },
  resolved:    { color: "green", label: "Resolved" },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: "2px solid #e5e7eb", marginBottom: 16, paddingBottom: 8 }}>
      <H2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", margin: 0 }}>
        {children}
      </H2>
    </div>
  );
}

// ── New observation form ───────────────────────────────────────────────────────

interface NewObsValues {
  title: string;
  location: string;
  category: Opt | null;
  priority: Opt | null;
  assignee: string;
  dueDate: string;
  description: string;
}

function NewObsFormBody({ onCancel }: { onCancel: () => void }) {
  const { isSubmitting } = useFormContext<NewObsValues>();
  return (
    <Form.Form>
      <SectionHeading>Observation Details</SectionHeading>
      <Form.Row>
        <Form.Text name="title" label="Title" required colWidth={8} />
        <Form.Select name="category" label="Category" required colWidth={4}
          options={CATEGORIES}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
      </Form.Row>
      <Form.Row>
        <Form.Text name="location" label="Location" required colWidth={6} />
        <Form.Select name="priority" label="Priority" required colWidth={3}
          options={PRIORITY_OPTIONS}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
        <Form.Text name="dueDate" label="Due Date" colWidth={3} />
      </Form.Row>
      <Form.Row>
        <Form.Text name="assignee" label="Assignee" colWidth={4} />
      </Form.Row>
      <Form.Row>
        <Form.TextArea name="description" label="Description" required description="Describe the condition observed and the associated risk." colWidth={12} />
      </Form.Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>Log Observation</Button>
      </div>
    </Form.Form>
  );
}

// ── Detail view ────────────────────────────────────────────────────────────────

interface ObsDetailValues {
  status: Opt | null;
  priority: Opt | null;
  assignee: string;
  dueDate: string;
  resolution: string;
}

function ObsDetailFormBody({ obs, onCancel }: { obs: Observation; onCancel: () => void }) {
  const { isSubmitting } = useFormContext<ObsDetailValues>();
  return (
    <Form.Form>
      <SectionHeading>Update Status</SectionHeading>
      <Form.Row>
        <Form.Select name="status" label="Status" required colWidth={4}
          options={STATUS_OPTIONS}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
        <Form.Select name="priority" label="Priority" colWidth={4}
          options={PRIORITY_OPTIONS}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
        <Form.Text name="assignee" label="Assignee" colWidth={4} />
      </Form.Row>
      <Form.Row>
        <Form.Text name="dueDate" label="Due Date" colWidth={3} />
      </Form.Row>
      <Form.Row>
        <Form.TextArea name="resolution" label="Resolution Notes" description="Describe the corrective action taken to resolve this observation." colWidth={12} />
      </Form.Row>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid #e5e7eb" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>← Back to list</Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>Save Changes</Button>
      </div>
    </Form.Form>
  );
}

interface ObsDetailViewProps {
  obs: Observation;
  onBack: () => void;
  onSaved: (id: string, status: ObsStatus) => void;
}

function ObsDetailView({ obs, onBack, onSaved }: ObsDetailViewProps) {
  const [saved, setSaved] = useState(false);
  const { color: priorityColor } = PRIORITY_PILL[obs.priority];
  const { color: statusColor, label: statusLabel } = STATUS_PILL[obs.status];

  const isOverdue = obs.status !== "resolved" && new Date(obs.dueDate) < new Date("2026-03-29");

  const initialValues: ObsDetailValues = {
    status: STATUS_OPTIONS.find(o => o.id === obs.status) ?? null,
    priority: PRIORITY_OPTIONS.find(o => o.id === obs.priority) ?? null,
    assignee: obs.assignee,
    dueDate: obs.dueDate,
    resolution: "",
  };

  function handleSubmit(values: ObsDetailValues, actions: { setSubmitting: (b: boolean) => void }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        setSaved(true);
        onSaved(obs.id, (values.status?.id ?? obs.status) as ObsStatus);
        resolve();
      }, 600);
    });
  }

  if (saved) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
        <Banner variant="info">
          <Banner.Content>
            <Banner.Title>Observation updated</Banner.Title>
            <Banner.Body>
              {obs.id} has been updated.{" "}
              <button onClick={onBack} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "inherit", color: "#1e40af", fontWeight: 600, textDecoration: "underline" }}>
                Back to observations
              </button>
            </Banner.Body>
          </Banner.Content>
        </Banner>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Observations › {obs.id}</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700 }}>{obs.title}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>{obs.location} · Reported by {obs.reportedBy} · {obs.date}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
          <Pill color={priorityColor}>{obs.priority.charAt(0).toUpperCase() + obs.priority.slice(1)}</Pill>
          <Pill color={statusColor}>{statusLabel}</Pill>
        </div>
      </div>

      {isOverdue && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Title>Overdue</Banner.Title>
              <Banner.Body>This observation was due {obs.dueDate} and has not been resolved.</Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      <Card shadowStrength={1} style={{ marginBottom: 16 }}>
        <div style={{ padding: "20px 24px" }}>
          <SectionHeading>Description</SectionHeading>
          <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{obs.description}</p>
          <div style={{ display: "flex", gap: 32, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Category</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{obs.category}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Assignee</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{obs.assignee}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em" }}>Due</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isOverdue ? "#dc2626" : "#111827" }}>{obs.dueDate}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card shadowStrength={1}>
        <div style={{ padding: "20px 24px" }}>
          <Form view="create" initialValues={initialValues} onSubmit={handleSubmit}>
            <ObsDetailFormBody obs={obs} onCancel={onBack} />
          </Form>
        </div>
      </Card>
    </div>
  );
}

// ── Observation row ────────────────────────────────────────────────────────────

function ObsRow({ obs, onOpen }: { obs: Observation; onOpen: (id: string) => void }) {
  const { color: priorityColor } = PRIORITY_PILL[obs.priority];
  const { color: statusColor, label: statusLabel } = STATUS_PILL[obs.status];
  const isOverdue = obs.status !== "resolved" && new Date(obs.dueDate) < new Date("2026-03-29");

  return (
    <div
      onClick={() => onOpen(obs.id)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        border: `1px solid ${isOverdue ? "#fecaca" : "#e5e7eb"}`,
        borderLeft: `4px solid ${obs.priority === "critical" || obs.priority === "high" ? "#dc2626" : obs.priority === "medium" ? "#d97706" : "#e5e7eb"}`,
        borderRadius: 6, background: "#fff", cursor: "pointer",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{obs.id}</span>
          <Pill color={priorityColor}>{obs.priority.charAt(0).toUpperCase() + obs.priority.slice(1)}</Pill>
          <Pill color={statusColor}>{statusLabel}</Pill>
          {isOverdue && <Pill color="red">Overdue</Pill>}
        </div>
        <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{obs.title}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{obs.location} · {obs.date} · Assignee: {obs.assignee}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#9ca3af", marginLeft: 16, flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function ObservationsPage() {
  const [observations, setObservations] = useState<Observation[]>(MOCK_OBSERVATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "new">("list");

  const selected = observations.find(o => o.id === selectedId) ?? null;

  function handleSaved(id: string, status: ObsStatus) {
    setObservations(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  function handleNewSubmit(_values: NewObsValues, actions: { setSubmitting: (b: boolean) => void }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => { actions.setSubmitting(false); setActiveTab("list"); resolve(); }, 600);
    });
  }

  if (selected) {
    return <ObsDetailView obs={selected} onBack={() => setSelectedId(null)} onSaved={handleSaved} />;
  }

  const open = observations.filter(o => o.status !== "resolved");
  const overdue = observations.filter(o => o.status !== "resolved" && new Date(o.dueDate) < new Date("2026-03-29"));

  return (
    <DetailPage width="xl">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Quality &amp; Safety › Observations</span>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Observations</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Grandview Mixed-Use · {open.length} open</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {overdue.length > 0 && <Pill color="red">{overdue.length} overdue</Pill>}
                <Pill color="yellow">{open.length} open</Pill>
                <Button variant="primary" onClick={() => setActiveTab("new")}>+ Log Observation</Button>
              </div>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>
          {overdue.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Banner variant="attention">
                <Banner.Content>
                  <Banner.Title>{overdue.length} observation{overdue.length > 1 ? "s" : ""} overdue</Banner.Title>
                  <Banner.Body>These items have passed their due date without resolution.</Banner.Body>
                </Banner.Content>
              </Banner>
            </div>
          )}

          <Tabs style={{ marginBottom: 0 }}>
            <Tabs.Tab selected={activeTab === "list"} onClick={() => setActiveTab("list")}>All Observations</Tabs.Tab>
            <Tabs.Tab selected={activeTab === "new"} onClick={() => setActiveTab("new")}>Log Observation</Tabs.Tab>
          </Tabs>

          <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 6px 6px", background: "#fff", padding: "28px 32px" }}>
            {activeTab === "list" ? (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: open.length > 0 && observations.some(o => o.status === "resolved") ? 24 : 0 }}>
                  {open.map(o => <ObsRow key={o.id} obs={o} onOpen={setSelectedId} />)}
                </div>
                {observations.some(o => o.status === "resolved") && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>Resolved</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {observations.filter(o => o.status === "resolved").map(o => <ObsRow key={o.id} obs={o} onOpen={setSelectedId} />)}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Form
                view="create"
                initialValues={{ title: "", location: "", category: null, priority: null, assignee: "", dueDate: "", description: "" }}
                onSubmit={handleNewSubmit}
              >
                <NewObsFormBody onCancel={() => setActiveTab("list")} />
              </Form>
            )}
          </div>
        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}
