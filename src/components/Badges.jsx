import { VALUE_CONFIG, STATUS_CONFIG, EFFORT_CONFIG } from "../constants";

export function ValueBadge({ value }) {
  const cfg = VALUE_CONFIG[value] || VALUE_CONFIG["Experimental"];
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
      {value}
    </span>
  );
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Idea"];
  return (
    <span style={{ color: cfg.color, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 8 }}>{cfg.icon}</span>
      {status}
    </span>
  );
}

export function EffortBadge({ effort }) {
  const cfg = EFFORT_CONFIG[effort];
  if (!cfg) return null;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
      {effort} effort
    </span>
  );
}
