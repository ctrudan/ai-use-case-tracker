export function TagPill({ tag, onClick, active }) {
  return (
    <span
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", background: active ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "#A78BFA" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: "2px 9px", fontSize: 11, color: active ? "#A78BFA" : "#64748B", fontFamily: "'DM Mono', monospace", cursor: onClick ? "pointer" : "default", transition: "all 0.15s" }}
    >
      {tag}
    </span>
  );
}

export function ToolPill({ name, date }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#CBD5E1", fontFamily: "'DM Mono', monospace" }}>
      <span style={{ fontSize: 9, color: "#64748B" }}>●</span>
      {name}
      <span style={{ color: "#475569", fontSize: 10 }}>{date}</span>
    </span>
  );
}
