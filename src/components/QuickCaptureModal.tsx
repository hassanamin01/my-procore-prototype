import { useState } from "react";
import {
  Banner,
  Button,
  Form,
  Link,
  Modal,
  Typography,
  useFormContext,
} from "@procore/core-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Opt {
  id: string;
  label: string;
}

const INCIDENT_TYPES: Opt[] = [
  { id: "injury", label: "Injury / Illness" },
  { id: "near_miss", label: "Near Miss" },
  { id: "property_damage", label: "Property Damage" },
  { id: "environmental", label: "Environmental" },
  { id: "security", label: "Security" },
];

interface QuickCaptureValues {
  incidentType: Opt | null;
  timestamp: string;
  mediaDescription: string;
  // optional fields (collapsed by default)
  location: string;
  involvedParty: string;
  immediateAction: string;
}

const now = () => {
  const d = new Date();
  // format as datetime-local value: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// ── Saved confirmation screen ──────────────────────────────────────────────────

interface ConfirmationProps {
  capturedAt: string;
  incidentType: string;
  onClose: () => void;
}

function SavedConfirmation({ capturedAt, incidentType, onClose }: ConfirmationProps) {
  const dt = new Date(capturedAt);
  const formatted = dt.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <Modal.Header />
      <Modal.Body>
        {/* Green check circle */}
        <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#16a34a",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Typography intent="h2" as="h2" style={{ margin: "0 0 6px" }}>
            Draft saved
          </Typography>
          <Typography intent="body" color="gray50" as="p" style={{ margin: 0 }}>
            Your team has been notified.
          </Typography>
        </div>

        {/* Immutable record card */}
        <div
          style={{
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 16,
            border: "1px solid",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {/* Lock icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <Typography intent="label" color="gray50" as="span" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Captured — immutable
            </Typography>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            <div>
              <Typography intent="small" color="gray40" as="p" style={{ margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Type
              </Typography>
              <Typography intent="label" as="p" style={{ margin: 0 }}>
                {incidentType}
              </Typography>
            </div>
            <div>
              <Typography intent="small" color="gray40" as="p" style={{ margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Captured at
              </Typography>
              <Typography intent="label" as="p" style={{ margin: 0 }}>
                {formatted}
              </Typography>
            </div>
          </div>
        </div>

        {/* Stage 2 reminder */}
        <Banner variant="attention">
          <Banner.Content>
            <Banner.Title>Complete your report within 24 hours</Banner.Title>
            <Banner.Body>
              Return to this draft when it's safe to do so. You'll be reminded by notification.
            </Banner.Body>
          </Banner.Content>
        </Banner>
      </Modal.Body>

      <Modal.Footer>
        <Modal.FooterButtons>
          <Button variant="primary" onClick={onClose}>
            Done — return to triage
          </Button>
        </Modal.FooterButtons>
      </Modal.Footer>
    </>
  );
}

// ── Inner form body ────────────────────────────────────────────────────────────

interface FormBodyProps {
  showOptional: boolean;
  onToggleOptional: () => void;
  onClose: () => void;
}

function FormBody({ showOptional, onToggleOptional, onClose }: FormBodyProps) {
  const { isSubmitting } = useFormContext<QuickCaptureValues>();

  return (
    <Form.Form>
      <Modal.Body>
        {/* Stage label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            border: "1px solid",
            borderRadius: 4,
            padding: "3px 10px",
            marginBottom: 20,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <Typography intent="label" color="orange45" as="span">
            STAGE 1 · Target: under 30 seconds
          </Typography>
        </div>

        {/* ── Required fields ── */}
        <Form.Row>
          <Form.Select
            name="incidentType"
            label="Incident Type"
            required
            colWidth={12}
            options={INCIDENT_TYPES}
            getId={(o: Opt | null) => o?.id ?? ""}
            getLabel={(o: Opt | null) => o?.label ?? ""}
          />
        </Form.Row>

        <Form.Row>
          <Form.Text
            name="timestamp"
            label="Incident Timestamp"
            required
            description="Auto-populated — edit if the incident occurred earlier"
            colWidth={12}
          />
        </Form.Row>

        {/* Media field — simulated with TextArea since file input requires native */}
        <Form.Row>
          <Form.TextArea
            name="mediaDescription"
            label="Photo / Voice Note"
            required
            description="Describe what you observed, or note that a photo was taken. Full media upload available in Stage 2."
            colWidth={12}
          />
        </Form.Row>

        {/* ── Optional fields expander ── */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: 16,
            marginTop: 4,
          }}
        >
          <Link onClick={onToggleOptional} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: showOptional ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {showOptional ? "Hide" : "Add"} optional details
            <Typography intent="small" color="gray40" as="span">
              (can be completed in Stage 2)
            </Typography>
          </Link>

          {showOptional && (
            <div style={{ marginTop: 16 }}>
              <Form.Row>
                <Form.Text
                  name="location"
                  label="Location on Site"
                  colWidth={12}
                />
              </Form.Row>
              <Form.Row>
                <Form.Text
                  name="involvedParty"
                  label="Involved Party Name"
                  colWidth={12}
                />
              </Form.Row>
              <Form.Row>
                <Form.TextArea
                  name="immediateAction"
                  label="Immediate Action Taken"
                  colWidth={12}
                />
              </Form.Row>
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Modal.FooterButtons>
          <Button variant="tertiary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            Save Draft
          </Button>
        </Modal.FooterButtons>
      </Modal.Footer>
    </Form.Form>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

interface QuickCaptureModalProps {
  open: boolean;
  onClose: () => void;
  onDraftSaved: (incidentType: string, capturedAt: string) => void;
}

export default function QuickCaptureModal({
  open,
  onClose,
  onDraftSaved,
}: QuickCaptureModalProps) {
  const [showOptional, setShowOptional] = useState(false);
  const [savedState, setSavedState] = useState<{
    incidentType: string;
    capturedAt: string;
  } | null>(null);

  const initialValues: QuickCaptureValues = {
    incidentType: null,
    timestamp: now(),
    mediaDescription: "",
    location: "",
    involvedParty: "",
    immediateAction: "",
  };

  function handleClose() {
    setSavedState(null);
    setShowOptional(false);
    onClose();
  }

  function handleSubmit(
    values: QuickCaptureValues,
    actions: { setSubmitting: (b: boolean) => void }
  ) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        const label =
          INCIDENT_TYPES.find((t) => t.id === values.incidentType?.id)?.label ??
          "Unknown";
        setSavedState({ incidentType: label, capturedAt: values.timestamp });
        onDraftSaved(label, values.timestamp);
        resolve();
      }, 600);
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      howToClose={savedState ? ["x", "scrim"] : ["x"]}
      width="sm"
      placement="top"
      role="dialog"
      aria-labelledby="quick-capture-heading"
    >
      {savedState ? (
        <SavedConfirmation
          capturedAt={savedState.capturedAt}
          incidentType={savedState.incidentType}
          onClose={handleClose}
        />
      ) : (
        <>
          <Modal.Header>
            <Modal.Heading id="quick-capture-heading">
              Report Incident
            </Modal.Heading>
          </Modal.Header>
          <Form
            view="create"
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            <FormBody
              showOptional={showOptional}
              onToggleOptional={() => setShowOptional((v) => !v)}
              onClose={handleClose}
            />
          </Form>
        </>
      )}
    </Modal>
  );
}
