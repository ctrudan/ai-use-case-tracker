import { VALUE_CONFIG } from "../constants";
import { ValueBadge, StatusBadge, EffortBadge } from "./Badges";
import { TagPill, ToolPill } from "./Pills";

export default function GridCard({ item, onClick, onTagClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "rgba(15,20,35,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 22px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: VALUE_CONFIG[item.value]?.color || "#64748B", borderRadius: "12px 0 0 12px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{item.category}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#F1F5F9", fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>{item.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 12, flexShrink: 0 }}>
          <ValueBadge value={item.value} />
          <StatusBadge status={item.status} />
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.55 }}>{item.summary}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
        {item.effort && <EffortBadge effort={item.effort} />}
        {item.timeSaved && <span style={{ fontSize: 11, color: "#64748B", fontFamily: "'DM Mono', monospace" }}>⏱ {item.timeSaved}</span>}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: item.tools?.length ? 10 : 0 }}>
        {item.tags.map(tag => (
          <TagPill key={tag} tag={tag} onClick={e => { e.stopPropagation(); onTagClick(tag); }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {item.tools?.map(t => <ToolPill key={t.name} name={t.name} date={t.date} />)}
      </div>
    </div>
  );
}
