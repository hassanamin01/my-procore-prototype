import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  DetailPage,
  Form,
  Input,
  Link,
  Pill,
  ProgressBar,
  Tabs,
  Typography,
  useFormContext,
} from "@procore/core-react";

// ── Types & data ───────────────────────────────────────────────────────────────

interface Opt {
  id: string;
  label: string;
}

type InspectionResult = "pass" | "fail" | "pending" | "na";

interface ChecklistItem {
  id: string;
  description: string;
  result: InspectionResult;
  comment: string;
}

interface Inspection {
  id: string;
  title: string;
  area: string;
  inspector: string;
  date: string;
  status: "open" | "completed" | "failed";
  items: ChecklistItem[];
}

const MOCK_INSPECTIONS: Inspection[] = [
  {
    id: "INSP-2026-018",
    title: "Electrical Rough-In",
    area: "Level 2 — east wing",
    inspector: "T. Walsh",
    date: "2026-03-28",
    status: "failed",
    items: [
      { id: "e1", description: "Conduit secured at correct intervals (max 10 ft)", result: "pass", comment: "" },
      { id: "e2", description: "Wire gauge matches panel schedule", result: "fail", comment: "14 AWG found on 20A circuit — must be 12 AWG" },
      { id: "e3", description: "Junction boxes accessible and covered", result: "pass", comment: "" },
      { id: "e4", description: "GFCI protection in wet locations", result: "fail", comment: "Missing GFCI at kitchen island rough-in" },
      { id: "e5", description: "Arc fault protection per code", result: "pending", comment: "" },
      { id: "e6", description: "Grounding electrodes installed", result: "pass", comment: "" },
    ],
  },
  {
    id: "INSP-2026-017",
    title: "Structural Framing",
    area: "Level 3 — north section",
    inspector: "M. Okonkwo",
    date: "2026-03-29",
    status: "completed",
    items: [
      { id: "s1", description: "Stud spacing 16\" O.C.", result: "pass", comment: "" },
      { id: "s2", description: "Header sizes correct per drawings", result: "pass", comment: "" },
      { id: "s3", description: "Blocking installed at floor/ceiling", result: "pass", comment: "" },
      { id: "s4", description: "Shear wall nailing pattern correct", result: "pass", comment: "" },
      { id: "s5", description: "Anchor bolts per foundation plan", result: "pass", comment: "" },
    ],
  },
  {
    id: "INSP-2026-016",
    title: "Foundation Waterproofing",
    area: "Basement — perimeter",
    inspector: "J. Rivera",
    date: "2026-03-25",
    status: "open",
    items: [
      { id: "w1", description: "Membrane fully adhered, no voids", result: "pending", comment: "" },
      { id: "w2", description: "Drainage board installed", result: "pending", comment: "" },
      { id: "w3", description: "Penetrations sealed", result: "pending", comment: "" },
      { id: "w4", description: "Inspection port installed", result: "pending", comment: "" },
    ],
  },
];

const RESULT_OPTIONS: Opt[] = [
  { id: "pass", label: "Pass" },
  { id: "fail", label: "Fail" },
  { id: "pending", label: "Pending" },
  { id: "na", label: "N/A" },
];

const TRADE_OPTIONS: Opt[] = [
  { id: "structural", label: "Structural" },
  { id: "electrical", label: "Electrical" },
  { id: "plumbing", label: "Plumbing" },
  { id: "mechanical", label: "Mechanical" },
  { id: "fire", label: "Fire Protection" },
  { id: "concrete", label: "Concrete" },
  { id: "roofing", label: "Roofing" },
  { id: "waterproofing", label: "Waterproofing" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_PILL: Record<Inspection["status"], { color: "red" | "green" | "yellow"; label: string }> = {
  failed:    { color: "red",    label: "Failed" },
  completed: { color: "green",  label: "Passed" },
  open:      { color: "yellow", label: "In Progress" },
};

const RESULT_PILL: Record<InspectionResult, { color: "green" | "red" | "gray" | "yellow" }> = {
  pass:    { color: "green" },
  fail:    { color: "red" },
  pending: { color: "yellow" },
  na:      { color: "gray" },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography intent="label" color="gray50" as="h2" style={{ textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid", paddingBottom: 8, marginBottom: 16 }}>
      {children}
    </Typography>
  );
}

function ResultPill({ result }: { result: InspectionResult }) {
  const { color } = RESULT_PILL[result];
  const label = result.charAt(0).toUpperCase() + result.slice(1);
  return <Pill color={color}>{label}</Pill>;
}

// ── New Inspection form ────────────────────────────────────────────────────────

interface NewInspectionValues {
  title: string;
  area: string;
  trade: Opt | null;
  inspector: string;
  scheduledDate: string;
  notes: string;
}

function NewInspectionFormBody({ onCancel }: { onCancel: () => void }) {
  const { isSubmitting } = useFormContext<NewInspectionValues>();
  return (
    <Form.Form>
      <SectionHeading>Inspection Details</SectionHeading>
      <Form.Row>
        <Form.Text name="title" label="Inspection Title" required colWidth={8} />
        <Form.Select
          name="trade"
          label="Trade / Discipline"
          required
          colWidth={4}
          options={TRADE_OPTIONS}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
      </Form.Row>
      <Form.Row>
        <Form.Text name="area" label="Area / Location" required colWidth={6} />
        <Form.Text name="inspector" label="Inspector Name" required colWidth={3} />
        <Form.Text name="scheduledDate" label="Scheduled Date" colWidth={3} />
      </Form.Row>
      <Form.Row>
        <Form.TextArea name="notes" label="Notes" colWidth={12} />
      </Form.Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>Create Inspection</Button>
      </div>
    </Form.Form>
  );
}

// ── Checklist detail view ──────────────────────────────────────────────────────

interface ChecklistViewProps {
  inspection: Inspection;
  onBack: () => void;
  onSaved: (id: string, items: ChecklistItem[]) => void;
}

function ChecklistView({ inspection, onBack, onSaved }: ChecklistViewProps) {
  const [items, setItems] = useState<ChecklistItem[]>(inspection.items);
  const [saved, setSaved] = useState(false);

  function setResult(id: string, result: InspectionResult) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, result } : item));
  }

  function setComment(id: string, comment: string) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, comment } : item));
  }

  const passCount = items.filter(i => i.result === "pass").length;
  const failCount = items.filter(i => i.result === "fail").length;
  const { color, label } = STATUS_PILL[inspection.status];

  if (saved) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <Banner variant="info">
          <Banner.Content>
            <Banner.Title>Inspection results saved</Banner.Title>
            <Banner.Body>
              {inspection.id} results submitted.{" "}
              <Link onClick={onBack}>Back to inspections</Link>
            </Banner.Body>
          </Banner.Content>
        </Banner>
      </div>
    );
  }

  const totalItems = items.length;
  const doneItems = items.filter(i => i.result !== "pending").length;
  const progressPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Typography intent="small" color="gray50" as="p" style={{ margin: 0 }}>Quality &amp; Safety › Inspections › {inspection.id}</Typography>
          <Typography intent="h1" as="h1" style={{ margin: "4px 0 0" }}>{inspection.title}</Typography>
          <Typography intent="small" color="gray50" as="p" style={{ margin: "4px 0 0" }}>{inspection.area} · {inspection.inspector} · {inspection.date}</Typography>
        </div>
        <Pill color={color}>{label}</Pill>
      </div>

      {failCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Title>{failCount} item{failCount > 1 ? "s" : ""} failed</Banner.Title>
              <Banner.Body>Review and add comments before submitting. Failed items require corrective action.</Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      <Card shadowStrength={1}>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
            <div style={{ textAlign: "center" }}>
              <Typography intent="h1" as="div" style={{ fontWeight: 800 }}>{passCount}</Typography>
              <Typography intent="small" color="gray50" as="div" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Pass</Typography>
            </div>
            <div style={{ textAlign: "center" }}>
              <Typography intent="h1" color="red45" as="div" style={{ fontWeight: 800 }}>{failCount}</Typography>
              <Typography intent="small" color="gray50" as="div" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Fail</Typography>
            </div>
            <div style={{ textAlign: "center" }}>
              <Typography intent="h1" color="orange45" as="div" style={{ fontWeight: 800 }}>{items.filter(i => i.result === "pending").length}</Typography>
              <Typography intent="small" color="gray50" as="div" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending</Typography>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <ProgressBar value={progressPct} />
          </div>

          <SectionHeading>Checklist</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{
                  padding: "14px 0",
                  borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none",
                  background: item.result === "fail" ? "#fef2f2" : "transparent",
                  marginLeft: item.result === "fail" ? -8 : 0,
                  paddingLeft: item.result === "fail" ? 8 : 0,
                  borderRadius: item.result === "fail" ? 4 : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <Typography intent="body" as="p" style={{ margin: 0, flex: 1 }}>{item.description}</Typography>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {RESULT_OPTIONS.map(opt => (
                      <Button
                        key={opt.id}
                        variant="secondary"
                        onClick={() => setResult(item.id, opt.id as InspectionResult)}
                        style={{
                          padding: "3px 10px",
                          borderColor: item.result === opt.id
                            ? opt.id === "pass" ? "#16a34a" : opt.id === "fail" ? "#dc2626" : opt.id === "pending" ? "#d97706" : "#9ca3af"
                            : undefined,
                          background: item.result === opt.id
                            ? opt.id === "pass" ? "#dcfce7" : opt.id === "fail" ? "#fee2e2" : opt.id === "pending" ? "#fef9c3" : "#f3f4f6"
                            : undefined,
                        }}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {(item.result === "fail" || item.comment) && (
                  <Input
                    value={item.comment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(item.id, e.target.value)}
                    placeholder="Add comment…"
                    style={{ marginTop: 8, width: "100%", boxSizing: "border-box" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <Button variant="secondary" type="button" onClick={onBack}>← Back to list</Button>
        <Button variant="primary" onClick={() => { onSaved(inspection.id, items); setSaved(true); }}>
          Submit Results
        </Button>
      </div>
    </div>
  );
}

// ── Inspection row ─────────────────────────────────────────────────────────────

function InspectionRow({ inspection, onOpen }: { inspection: Inspection; onOpen: (id: string) => void }) {
  const { color, label } = STATUS_PILL[inspection.status];
  const failCount = inspection.items.filter(i => i.result === "fail").length;
  const passCount = inspection.items.filter(i => i.result === "pass").length;

  return (
    <div
      onClick={() => onOpen(inspection.id)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        border: `1px solid ${inspection.status === "failed" ? "#fecaca" : "#e5e7eb"}`,
        borderLeft: `4px solid ${inspection.status === "failed" ? "#dc2626" : inspection.status === "completed" ? "#16a34a" : "#d97706"}`,
        borderRadius: 6, background: "#fff", cursor: "pointer",
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Typography intent="small" color="gray40" as="span" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{inspection.id}</Typography>
          <Pill color={color}>{label}</Pill>
        </div>
        <Typography intent="body" as="p" style={{ margin: "0 0 2px", fontWeight: 600 }}>{inspection.title}</Typography>
        <Typography intent="small" color="gray50" as="p" style={{ margin: 0 }}>{inspection.area} · {inspection.inspector} · {inspection.date}</Typography>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 24, flexShrink: 0 }}>
        <div style={{ textAlign: "right" }}>
          <Typography intent="small" as="span" style={{ fontWeight: 600 }}>{passCount} pass</Typography>
          {failCount > 0 && <Typography intent="small" color="red45" as="span" style={{ fontWeight: 600 }}> · {failCount} fail</Typography>}
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#9ca3af" }}>
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "new">("list");

  const selected = inspections.find(i => i.id === selectedId) ?? null;

  function handleSaved(id: string, items: ChecklistItem[]) {
    const failCount = items.filter(i => i.result === "fail").length;
    const allDone = items.every(i => i.result !== "pending");
    setInspections(prev => prev.map(insp =>
      insp.id === id
        ? { ...insp, items, status: allDone ? (failCount > 0 ? "failed" : "completed") : "open" }
        : insp
    ));
  }

  function handleNewSubmit(_values: NewInspectionValues, actions: { setSubmitting: (b: boolean) => void }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        setActiveTab("list");
        resolve();
      }, 600);
    });
  }

  if (selected) {
    return (
      <ChecklistView
        inspection={selected}
        onBack={() => setSelectedId(null)}
        onSaved={handleSaved}
      />
    );
  }

  const failed = inspections.filter(i => i.status === "failed");

  return (
    <DetailPage width="xl">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <Typography intent="small" color="gray50" as="span">Quality &amp; Safety › Inspections</Typography>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Typography intent="h1" as="h1" style={{ margin: 0 }}>Inspections</Typography>
                <Typography intent="small" color="gray50" as="p" style={{ margin: "4px 0 0" }}>
                  Grandview Mixed-Use · {inspections.length} inspections
                </Typography>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {failed.length > 0 && <Pill color="red">{failed.length} failed</Pill>}
                <Button variant="primary" onClick={() => setActiveTab("new")}>+ New Inspection</Button>
              </div>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>
          <Tabs style={{ marginBottom: 0 }}>
            <Tabs.Tab selected={activeTab === "list"} onClick={() => setActiveTab("list")}>All Inspections</Tabs.Tab>
            <Tabs.Tab selected={activeTab === "new"} onClick={() => setActiveTab("new")}>New Inspection</Tabs.Tab>
          </Tabs>

          <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 6px 6px", background: "#fff", padding: "28px 32px" }}>
            {activeTab === "list" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {inspections.map(insp => (
                  <InspectionRow key={insp.id} inspection={insp} onOpen={setSelectedId} />
                ))}
              </div>
            ) : (
              <Form
                view="create"
                initialValues={{ title: "", area: "", trade: null, inspector: "", scheduledDate: "", notes: "" }}
                onSubmit={handleNewSubmit}
              >
                <NewInspectionFormBody onCancel={() => setActiveTab("list")} />
              </Form>
            )}
          </div>
        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}
