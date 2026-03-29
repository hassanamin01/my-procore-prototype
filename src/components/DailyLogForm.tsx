import { useState } from "react";
import { Banner, Button, Form, Tabs, Typography, useFormContext } from "@procore/core-react";

// ── Option shapes ──────────────────────────────────────────────────────────────

interface Opt {
  id: string;
  label: string;
}

const WEATHER_CONDITIONS: Opt[] = [
  { id: "clear", label: "Clear / Sunny" },
  { id: "partly_cloudy", label: "Partly Cloudy" },
  { id: "overcast", label: "Overcast" },
  { id: "light_rain", label: "Light Rain" },
  { id: "heavy_rain", label: "Heavy Rain" },
  { id: "snow", label: "Snow / Ice" },
  { id: "fog", label: "Fog / Low Visibility" },
  { id: "high_wind", label: "High Wind" },
];

const DELAY_REASONS: Opt[] = [
  { id: "none", label: "No Delay" },
  { id: "weather", label: "Weather" },
  { id: "material", label: "Material Shortage" },
  { id: "equipment", label: "Equipment Breakdown" },
  { id: "labor", label: "Labor Shortage" },
  { id: "inspection", label: "Awaiting Inspection" },
  { id: "rfi", label: "Awaiting RFI Response" },
  { id: "design", label: "Design Change" },
  { id: "other", label: "Other" },
];

const WORK_STATUS_OPTIONS: Opt[] = [
  { id: "on_schedule", label: "On Schedule" },
  { id: "ahead", label: "Ahead of Schedule" },
  { id: "behind", label: "Behind Schedule" },
  { id: "suspended", label: "Work Suspended" },
];

const INCIDENT_OPTIONS: Opt[] = [
  { id: "none", label: "None" },
  { id: "injury", label: "Injury / Illness" },
  { id: "near_miss", label: "Near Miss" },
  { id: "property_damage", label: "Property Damage" },
  { id: "environmental", label: "Environmental" },
  { id: "security", label: "Security" },
];

// ── Types ──────────────────────────────────────────────────────────────────────

interface DailyLogValues {
  date: Date | undefined;
  superintendent: string;
  projectPhase: string;
  weatherCondition: Opt | null;
  temperatureHigh: string;
  temperatureLow: string;
  precipitation: string;
  workDelayReason: Opt | null;
  workDelayNotes: string;
  totalWorkers: string;
  contractorBreakdown: string;
  hoursWorked: string;
  workStatus: Opt | null;
  workDescription: string;
  areasWorked: string;
  materialsInstalled: string;
  equipmentOnSite: string;
  equipmentIssues: string;
  incidentType: Opt | null;
  incidentDescription: string;
  visitorsOnSite: string;
  inspections: string;
  generalNotes: string;
}

const initialValues: DailyLogValues = {
  date: undefined,
  superintendent: "",
  projectPhase: "",
  weatherCondition: null,
  temperatureHigh: "",
  temperatureLow: "",
  precipitation: "",
  workDelayReason: null,
  workDelayNotes: "",
  totalWorkers: "",
  contractorBreakdown: "",
  hoursWorked: "",
  workStatus: null,
  workDescription: "",
  areasWorked: "",
  materialsInstalled: "",
  equipmentOnSite: "",
  equipmentIssues: "",
  incidentType: null,
  incidentDescription: "",
  visitorsOnSite: "",
  inspections: "",
  generalNotes: "",
};

// ── Tabs config ────────────────────────────────────────────────────────────────

type Tab =
  | "header"
  | "weather"
  | "manpower"
  | "work"
  | "equipment"
  | "incidents"
  | "notes";

const TABS: { id: Tab; label: string }[] = [
  { id: "header", label: "Log Details" },
  { id: "weather", label: "Weather" },
  { id: "manpower", label: "Manpower" },
  { id: "work", label: "Work Performed" },
  { id: "equipment", label: "Equipment" },
  { id: "incidents", label: "Incidents" },
  { id: "notes", label: "Notes & Visitors" },
];

// ── Section heading ────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography intent="label" color="gray50" as="h2" style={{ textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid", paddingBottom: 8, marginBottom: 16 }}>
      {children}
    </Typography>
  );
}

// ── Inner form body (accesses Formik context via hook) ─────────────────────────

interface FormBodyProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

function FormBody({ activeTab, setActiveTab }: FormBodyProps) {
  const { isSubmitting } = useFormContext<DailyLogValues>();

  return (
    <Form.Form>
      {/* ── LOG DETAILS ─────────────────────────────────── */}
      {activeTab === "header" && (
        <div>
          <SectionHeading>Log Details</SectionHeading>
          <Form.Row>
            <Form.DateSelect
              name="date"
              label="Log Date"
              required
              colWidth={4}
            />
            <Form.Text
              name="superintendent"
              label="Superintendent"
              required
              colWidth={4}
            />
            <Form.Text
              name="projectPhase"
              label="Project Phase"
              colWidth={4}
            />
          </Form.Row>
        </div>
      )}

      {/* ── WEATHER ─────────────────────────────────────── */}
      {activeTab === "weather" && (
        <div>
          <SectionHeading>Weather Conditions</SectionHeading>
          <Form.Row>
            <Form.Select
              name="weatherCondition"
              label="Condition"
              required
              colWidth={6}
              options={WEATHER_CONDITIONS}
              getId={(o: Opt | null) => o?.id ?? ""}
              getLabel={(o: Opt | null) => o?.label ?? ""}
            />
            <Form.Select
              name="workDelayReason"
              label="Work Delay Reason"
              colWidth={6}
              options={DELAY_REASONS}
              getId={(o: Opt | null) => o?.id ?? ""}
              getLabel={(o: Opt | null) => o?.label ?? ""}
            />
          </Form.Row>
          <Form.Row>
            <Form.Text
              name="temperatureHigh"
              label="High Temp (°F)"
              colWidth={3}
            />
            <Form.Text
              name="temperatureLow"
              label="Low Temp (°F)"
              colWidth={3}
            />
            <Form.Text
              name="precipitation"
              label="Precipitation (in)"
              colWidth={3}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="workDelayNotes"
              label="Delay Notes"
              colWidth={12}
            />
          </Form.Row>
        </div>
      )}

      {/* ── MANPOWER ────────────────────────────────────── */}
      {activeTab === "manpower" && (
        <div>
          <SectionHeading>Manpower</SectionHeading>
          <Form.Row>
            <Form.Text
              name="totalWorkers"
              label="Total Workers on Site"
              required
              colWidth={4}
            />
            <Form.Text
              name="hoursWorked"
              label="Total Man-Hours"
              colWidth={4}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="contractorBreakdown"
              label="Contractor / Trade Breakdown"
              description="List each trade and headcount (e.g. Framing – 4, Electrical – 2)"
              colWidth={12}
            />
          </Form.Row>
        </div>
      )}

      {/* ── WORK PERFORMED ──────────────────────────────── */}
      {activeTab === "work" && (
        <div>
          <SectionHeading>Work Performed</SectionHeading>
          <Form.Row>
            <Form.Select
              name="workStatus"
              label="Schedule Status"
              required
              colWidth={6}
              options={WORK_STATUS_OPTIONS}
              getId={(o: Opt | null) => o?.id ?? ""}
              getLabel={(o: Opt | null) => o?.label ?? ""}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="workDescription"
              label="Work Description"
              required
              description="Summarise the primary activities completed today"
              colWidth={12}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="areasWorked"
              label="Areas / Locations Worked"
              colWidth={6}
            />
            <Form.TextArea
              name="materialsInstalled"
              label="Materials Installed"
              colWidth={6}
            />
          </Form.Row>
        </div>
      )}

      {/* ── EQUIPMENT ───────────────────────────────────── */}
      {activeTab === "equipment" && (
        <div>
          <SectionHeading>Equipment</SectionHeading>
          <Form.Row>
            <Form.TextArea
              name="equipmentOnSite"
              label="Equipment on Site"
              description="List major equipment present today (type, quantity)"
              colWidth={12}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="equipmentIssues"
              label="Equipment Issues / Downtime"
              colWidth={12}
            />
          </Form.Row>
        </div>
      )}

      {/* ── INCIDENTS ───────────────────────────────────── */}
      {activeTab === "incidents" && (
        <div>
          <SectionHeading>Incidents &amp; Safety</SectionHeading>
          <Banner variant="attention">
            <Banner.Content>
              <Banner.Body>
                If an injury or near miss occurred, also file a separate
                Incident Report within 24 hours.
              </Banner.Body>
            </Banner.Content>
          </Banner>
          <div style={{ marginTop: 20 }}>
            <Form.Row>
              <Form.Select
                name="incidentType"
                label="Incident Type"
                required
                colWidth={6}
                options={INCIDENT_OPTIONS}
                getId={(o: Opt) => o.id}
                getLabel={(o: Opt) => o.label}
              />
            </Form.Row>
            <Form.Row>
              <Form.TextArea
                name="incidentDescription"
                label="Incident Description"
                description="Leave blank if Incident Type is 'None'"
                colWidth={12}
              />
            </Form.Row>
          </div>
        </div>
      )}

      {/* ── NOTES & VISITORS ────────────────────────────── */}
      {activeTab === "notes" && (
        <div>
          <SectionHeading>Notes &amp; Visitors</SectionHeading>
          <Form.Row>
            <Form.TextArea
              name="visitorsOnSite"
              label="Visitors on Site"
              description="Name, company, and purpose of visit"
              colWidth={6}
            />
            <Form.TextArea
              name="inspections"
              label="Inspections / Tests"
              description="Inspector name, trade, and outcome"
              colWidth={6}
            />
          </Form.Row>
          <Form.Row>
            <Form.TextArea
              name="generalNotes"
              label="General Notes"
              colWidth={12}
            />
          </Form.Row>
        </div>
      )}

      {/* ── Footer actions ───────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
          paddingTop: 20,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {TABS.findIndex((t) => t.id === activeTab) > 0 && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                const idx = TABS.findIndex((t) => t.id === activeTab);
                setActiveTab(TABS[idx - 1].id);
              }}
            >
              ← Previous
            </Button>
          )}
          {TABS.findIndex((t) => t.id === activeTab) < TABS.length - 1 && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                const idx = TABS.findIndex((t) => t.id === activeTab);
                setActiveTab(TABS[idx + 1].id);
              }}
            >
              Next →
            </Button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" type="reset">
            Discard
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Save Daily Log
          </Button>
        </div>
      </div>
    </Form.Form>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function DailyLogForm() {
  const [activeTab, setActiveTab] = useState<Tab>("header");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(
    values: DailyLogValues,
    actions: { setSubmitting: (b: boolean) => void }
  ) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Daily Log submitted:", values);
        actions.setSubmitting(false);
        setSubmitted(true);
        resolve();
      }, 800);
    });
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Typography intent="small" color="gray50" as="p">
            Quality &amp; Safety › Daily Logs
          </Typography>
          <Typography intent="h1" as="h1" style={{ marginTop: 4 }}>
            New Daily Log Entry
          </Typography>
        </div>
      </div>

      {submitted && (
        <div style={{ marginBottom: 20 }}>
          <Banner variant="info">
            <Banner.Content>
              <Banner.Title>Daily log saved</Banner.Title>
              <Banner.Body>
                Your log has been submitted and is pending review.
              </Banner.Body>
            </Banner.Content>
          </Banner>
        </div>
      )}

      {/* Tab navigation */}
      <Tabs style={{ marginBottom: 0 }}>
        {TABS.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderTop: "none",
          borderRadius: "0 0 6px 6px",
          background: "#fff",
          padding: "28px 32px 32px",
        }}
      >
        <Form
          view="create"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <FormBody activeTab={activeTab} setActiveTab={setActiveTab} />
        </Form>
      </div>
    </div>
  );
}
