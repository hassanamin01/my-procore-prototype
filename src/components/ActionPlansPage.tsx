import { useState } from "react";
import {
  Banner,
  Button,
  Card,
  DetailPage,
  Form,
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

type ActionStatus = "not_started" | "in_progress" | "complete" | "overdue";
type PlanStatus   = "active" | "on_hold" | "complete";

interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: ActionStatus;
  notes: string;
}

interface ActionPlan {
  id: string;
  title: string;
  category: string;
  status: PlanStatus;
  owner: string;
  startDate: string;
  targetDate: string;
  description: string;
  actions: ActionItem[];
}

const MOCK_PLANS: ActionPlan[] = [
  {
    id: "AP-2026-007",
    title: "Electrical Rough-In Remediation",
    category: "Quality",
    status: "active",
    owner: "T. Walsh",
    startDate: "2026-03-28",
    targetDate: "2026-04-04",
    description: "Corrective action plan following failed electrical rough-in inspection on Level 2 east wing. All items must be resolved before re-inspection.",
    actions: [
      { id: "a1", title: "Replace 14 AWG wire with 12 AWG on 20A circuits — Level 2 east", assignee: "T. Walsh", dueDate: "2026-03-31", status: "in_progress", notes: "Approx 240 LF of wire to be replaced." },
      { id: "a2", title: "Install GFCI protection at kitchen island rough-in", assignee: "T. Walsh", dueDate: "2026-03-31", status: "not_started", notes: "" },
      { id: "a3", title: "Verify arc fault protection per NEC 210.12", assignee: "T. Walsh", dueDate: "2026-04-01", status: "not_started", notes: "" },
      { id: "a4", title: "Schedule re-inspection with city inspector", assignee: "K. Patel", dueDate: "2026-04-03", status: "not_started", notes: "" },
    ],
  },
  {
    id: "AP-2026-005",
    title: "Structural Framing Recovery Plan",
    category: "Schedule",
    status: "active",
    owner: "M. Okonkwo",
    startDate: "2026-03-20",
    targetDate: "2026-04-10",
    description: "Plan to recover 2-day schedule delay on structural framing at Level 3 north section. Includes overtime and crew augmentation strategy.",
    actions: [
      { id: "b1", title: "Augment framing crew with 4 additional carpenters", assignee: "M. Okonkwo", dueDate: "2026-03-29", status: "complete", notes: "Crew starts Monday." },
      { id: "b2", title: "Authorise Saturday overtime for framing crew", assignee: "M. Okonkwo", dueDate: "2026-03-29", status: "complete", notes: "" },
      { id: "b3", title: "Complete Level 3 north framing", assignee: "T. Walsh", dueDate: "2026-04-05", status: "in_progress", notes: "" },
      { id: "b4", title: "Framing inspection sign-off", assignee: "K. Patel", dueDate: "2026-04-07", status: "not_started", notes: "" },
    ],
  },
  {
    id: "AP-2026-003",
    title: "Spill Prevention & PPE Compliance",
    category: "Safety",
    status: "on_hold",
    owner: "K. Patel",
    startDate: "2026-03-15",
    targetDate: "2026-03-28",
    description: "Address recurring PPE non-compliance and spill kit shortfalls identified during March safety walkthroughs.",
    actions: [
      { id: "c1", title: "Restock spill kits at all loading bay locations", assignee: "K. Patel", dueDate: "2026-03-28", status: "overdue", notes: "Supplier delivery delayed." },
      { id: "c2", title: "Conduct PPE toolbox talk with all trades", assignee: "M. Okonkwo", dueDate: "2026-03-22", status: "complete", notes: "Completed Mar 22." },
      { id: "c3", title: "Post PPE requirement signage at site entrances", assignee: "J. Rivera", dueDate: "2026-03-20", status: "complete", notes: "" },
    ],
  },
];

const PLAN_CATEGORIES: Opt[] = [
  { id: "quality", label: "Quality" },
  { id: "safety", label: "Safety" },
  { id: "schedule", label: "Schedule" },
  { id: "compliance", label: "Compliance" },
  { id: "environmental", label: "Environmental" },
];

const PLAN_STATUS_OPTIONS: Opt[] = [
  { id: "active", label: "Active" },
  { id: "on_hold", label: "On Hold" },
  { id: "complete", label: "Complete" },
];

const ACTION_STATUS_OPTIONS: Opt[] = [
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "complete", label: "Complete" },
  { id: "overdue", label: "Overdue" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const PLAN_STATUS_PILL: Record<PlanStatus, { color: "green" | "blue" | "gray"; label: string }> = {
  active:   { color: "blue",  label: "Active" },
  on_hold:  { color: "gray",  label: "On Hold" },
  complete: { color: "green", label: "Complete" },
};

const ACTION_STATUS_PILL: Record<ActionStatus, { color: "gray" | "blue" | "green" | "red"; label: string }> = {
  not_started: { color: "gray",  label: "Not Started" },
  in_progress: { color: "blue",  label: "In Progress" },
  complete:    { color: "green", label: "Complete" },
  overdue:     { color: "red",   label: "Overdue" },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography intent="label" color="gray50" as="h2" style={{ textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid", paddingBottom: 8, marginBottom: 16 }}>
      {children}
    </Typography>
  );
}

function progressPercent(plan: ActionPlan) {
  const done = plan.actions.filter(a => a.status === "complete").length;
  return Math.round((done / plan.actions.length) * 100);
}

// ── New plan form ──────────────────────────────────────────────────────────────

interface NewPlanValues {
  title: string;
  category: Opt | null;
  owner: string;
  startDate: string;
  targetDate: string;
  description: string;
}

function NewPlanFormBody({ onCancel }: { onCancel: () => void }) {
  const { isSubmitting } = useFormContext<NewPlanValues>();
  return (
    <Form.Form>
      <SectionHeading>Plan Details</SectionHeading>
      <Form.Row>
        <Form.Text name="title" label="Plan Title" required colWidth={8} />
        <Form.Select name="category" label="Category" required colWidth={4}
          options={PLAN_CATEGORIES}
          getId={(o: Opt | null) => o?.id ?? ""}
          getLabel={(o: Opt | null) => o?.label ?? ""}
        />
      </Form.Row>
      <Form.Row>
        <Form.Text name="owner" label="Plan Owner" required colWidth={4} />
        <Form.Text name="startDate" label="Start Date" colWidth={4} />
        <Form.Text name="targetDate" label="Target Completion" colWidth={4} />
      </Form.Row>
      <Form.Row>
        <Form.TextArea name="description" label="Description" colWidth={12} />
      </Form.Row>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24, paddingTop: 20, borderTop: "1px solid" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>Create Plan</Button>
      </div>
    </Form.Form>
  );
}

// ── Plan detail / action items view ───────────────────────────────────────────

interface PlanDetailProps {
  plan: ActionPlan;
  onBack: () => void;
  onActionUpdate: (planId: string, actionId: string, status: ActionStatus) => void;
}

function PlanDetailView({ plan, onBack, onActionUpdate }: PlanDetailProps) {
  const { color: statusColor, label: statusLabel } = PLAN_STATUS_PILL[plan.status];
  const pct = progressPercent(plan);
  const overdueCount = plan.actions.filter(a => a.status === "overdue").length;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <Typography intent="small" color="gray50" as="p" style={{ margin: 0 }}>Quality &amp; Safety › Action Plans › {plan.id}</Typography>
          <Typography intent="h1" as="h1" style={{ margin: "4px 0 0" }}>{plan.title}</Typography>
          <Typography intent="small" color="gray50" as="p" style={{ margin: "4px 0 0" }}>
            {plan.category} · Owner: {plan.owner} · Target: {plan.targetDate}
          </Typography>
        </div>
        <Pill color={statusColor}>{statusLabel}</Pill>
      </div>

      {overdueCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Title>{overdueCount} action item{overdueCount > 1 ? "s" : ""} overdue</Banner.Title>
              <Banner.Body>Update the status of overdue items or reschedule their due dates.</Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      {/* Progress bar */}
      <Card shadowStrength={1} style={{ marginBottom: 16 }}>
        <div style={{ padding: "16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Typography intent="label" as="span">Overall Progress</Typography>
            <Typography intent="label" as="span">{pct}%</Typography>
          </div>
          <ProgressBar value={pct} />
          <Typography intent="small" color="gray50" as="p" style={{ margin: "8px 0 0" }}>{plan.description}</Typography>
        </div>
      </Card>

      {/* Action items */}
      <Card shadowStrength={1}>
        <div style={{ padding: "20px 24px" }}>
          <SectionHeading>Action Items</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {plan.actions.map((action, i) => {
              const { color: aColor, label: aLabel } = ACTION_STATUS_PILL[action.status];
              return (
                <div
                  key={action.id}
                  style={{
                    padding: "14px 0",
                    borderBottom: i < plan.actions.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <Typography intent="body" as="p" style={{ margin: "0 0 4px", fontWeight: 500 }}>{action.title}</Typography>
                      <Typography intent="small" color="gray50" as="p" style={{ margin: 0 }}>
                        {action.assignee} · Due {action.dueDate}
                        {action.notes && <Typography intent="small" color="gray40" as="span"> · {action.notes}</Typography>}
                      </Typography>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                      <Pill color={aColor}>{aLabel}</Pill>
                      {action.status !== "complete" && (
                        <Button
                          variant="secondary"
                          onClick={() => onActionUpdate(plan.id, action.id, "complete")}
                        >
                          Mark done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Button variant="secondary" type="button" onClick={onBack}>← Back to plans</Button>
      </div>
    </div>
  );
}

// ── Plan row ───────────────────────────────────────────────────────────────────

function PlanRow({ plan, onOpen }: { plan: ActionPlan; onOpen: (id: string) => void }) {
  const { color, label } = PLAN_STATUS_PILL[plan.status];
  const pct = progressPercent(plan);
  const overdueCount = plan.actions.filter(a => a.status === "overdue").length;

  return (
    <div
      onClick={() => onOpen(plan.id)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        border: `1px solid ${overdueCount > 0 ? "#fecaca" : "#e5e7eb"}`,
        borderLeft: `4px solid ${plan.status === "active" ? "#2563eb" : plan.status === "complete" ? "#16a34a" : "#9ca3af"}`,
        borderRadius: 6, background: "#fff", cursor: "pointer",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Typography intent="small" color="gray40" as="span" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{plan.id}</Typography>
          <Pill color={color}>{label}</Pill>
          <Typography intent="small" color="gray40" as="span">{plan.category}</Typography>
          {overdueCount > 0 && <Pill color="red">{overdueCount} overdue</Pill>}
        </div>
        <Typography intent="body" as="p" style={{ margin: "0 0 4px", fontWeight: 600 }}>{plan.title}</Typography>
        <Typography intent="small" color="gray50" as="p" style={{ margin: "0 0 8px" }}>Owner: {plan.owner} · Target: {plan.targetDate}</Typography>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <ProgressBar value={pct} />
          </div>
          <Typography intent="small" color="gray50" as="span" style={{ flexShrink: 0 }}>
            {plan.actions.filter(a => a.status === "complete").length} / {plan.actions.length} actions complete
          </Typography>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#9ca3af", marginLeft: 16, flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function ActionPlansPage() {
  const [plans, setPlans] = useState<ActionPlan[]>(MOCK_PLANS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "new">("list");

  const selected = plans.find(p => p.id === selectedId) ?? null;

  function handleActionUpdate(planId: string, actionId: string, status: ActionStatus) {
    setPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, actions: p.actions.map(a => a.id === actionId ? { ...a, status } : a) }
        : p
    ));
  }

  function handleNewSubmit(_values: NewPlanValues, actions: { setSubmitting: (b: boolean) => void }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => { actions.setSubmitting(false); setActiveTab("list"); resolve(); }, 600);
    });
  }

  if (selected) {
    return (
      <PlanDetailView
        plan={selected}
        onBack={() => setSelectedId(null)}
        onActionUpdate={handleActionUpdate}
      />
    );
  }

  const active = plans.filter(p => p.status === "active");
  const overdue = plans.flatMap(p => p.actions).filter(a => a.status === "overdue");

  return (
    <DetailPage width="xl">
      <DetailPage.Main>
        <DetailPage.Header>
          <DetailPage.Breadcrumbs>
            <Typography intent="small" color="gray50" as="span">Quality &amp; Safety › Action Plans</Typography>
          </DetailPage.Breadcrumbs>
          <DetailPage.Title>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Typography intent="h1" as="h1" style={{ margin: 0 }}>Action Plans</Typography>
                <Typography intent="small" color="gray50" as="p" style={{ margin: "4px 0 0" }}>
                  Grandview Mixed-Use · {active.length} active plan{active.length !== 1 ? "s" : ""}
                </Typography>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {overdue.length > 0 && <Pill color="red">{overdue.length} overdue</Pill>}
                <Pill color="blue">{active.length} active</Pill>
                <Button variant="primary" onClick={() => setActiveTab("new")}>+ New Plan</Button>
              </div>
            </div>
          </DetailPage.Title>
        </DetailPage.Header>

        <DetailPage.Body>
          {overdue.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <Banner variant="attention">
                <Banner.Content>
                  <Banner.Title>{overdue.length} action item{overdue.length > 1 ? "s" : ""} past due date</Banner.Title>
                  <Banner.Body>Open the relevant plan to update or reschedule overdue items.</Banner.Body>
                </Banner.Content>
              </Banner>
            </div>
          )}

          <Tabs style={{ marginBottom: 0 }}>
            <Tabs.Tab selected={activeTab === "list"} onClick={() => setActiveTab("list")}>All Plans</Tabs.Tab>
            <Tabs.Tab selected={activeTab === "new"} onClick={() => setActiveTab("new")}>New Plan</Tabs.Tab>
          </Tabs>

          <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 6px 6px", background: "#fff", padding: "28px 32px" }}>
            {activeTab === "list" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {plans.map(plan => (
                  <PlanRow key={plan.id} plan={plan} onOpen={setSelectedId} />
                ))}
              </div>
            ) : (
              <Form
                view="create"
                initialValues={{ title: "", category: null, owner: "", startDate: "", targetDate: "", description: "" }}
                onSubmit={handleNewSubmit}
              >
                <NewPlanFormBody onCancel={() => setActiveTab("list")} />
              </Form>
            )}
          </div>
        </DetailPage.Body>
      </DetailPage.Main>
    </DetailPage>
  );
}
