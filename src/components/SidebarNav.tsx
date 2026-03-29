import { Menu } from "@procore/core-react";

export type NavItemId =
  | "dashboard"
  | "daily-logs"
  | "incidents"
  | "inspections"
  | "observations"
  | "action-plans";

interface NavItem {
  id: NavItemId;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// ── Simple SVG icons ───────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconCheckSquare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
    </svg>
  );
}

function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 5h11M9 12h11M9 19h11M5 5v.01M5 12v.01M5 19v.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Nav groups config ──────────────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard",    label: "Dashboard",     icon: <IconDashboard /> },
    ],
  },
  {
    label: "Quality & Safety",
    items: [
      { id: "daily-logs",    label: "Daily Logs",    icon: <IconClipboard /> },
      { id: "incidents",     label: "Incidents",     icon: <IconWarning /> },
      { id: "inspections",   label: "Inspections",   icon: <IconCheckSquare /> },
      { id: "observations",  label: "Observations",  icon: <IconEye /> },
    ],
  },
  {
    label: "Planning",
    items: [
      { id: "action-plans",  label: "Action Plans",  icon: <IconList /> },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

interface SidebarNavProps {
  selected: NavItemId;
  onSelect: (id: NavItemId) => void;
}

export default function SidebarNav({ selected, onSelect }: SidebarNavProps) {
  return (
    <div
      style={{
        width: 220,
        height: "100%",
        borderRight: "1px solid #e5e7eb",
        background: "#f9fafb",
        overflowY: "auto",
        paddingTop: 8,
      }}
    >
      {NAV_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 4 }}>
          <Menu
            onSelect={({ item }) => onSelect(item as NavItemId)}
          >
            <Menu.Group>
              <span
                style={{
                  display: "block",
                  padding: "10px 16px 4px",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "#9ca3af",
                }}
              >
                {group.label}
              </span>
            </Menu.Group>
            <Menu.Options scrollable={false}>
              {group.items.map((navItem) => (
                <Menu.Item
                  key={navItem.id}
                  item={navItem.id}
                  selected={selected === navItem.id}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "2px 0",
                      color: selected === navItem.id ? "#1d4ed8" : "#374151",
                    }}
                  >
                    {navItem.icon}
                    {navItem.label}
                  </span>
                </Menu.Item>
              ))}
            </Menu.Options>
          </Menu>
        </div>
      ))}
    </div>
  );
}
