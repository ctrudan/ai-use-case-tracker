import { VALUE_CONFIG } from "../constants";
import { ValueBadge } from "./Badges";

export default function KanbanCard({ item, onClick, isDragging }) {
  const valueCfg = VALUE_CONFIG[item.value] || VALUE_CONFIG["Experimental"];
  return (
    <div
      onClick={onClick}
      style={{ background: isDragging ? "rgba(30,36,56,0.98)" : "rgba(15,20,35,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: `3px solid ${valueCfg.color}`, borderRadius: 10, padding: "14px 16px", cursor: isDragging ? "grabbing" : "pointer", transition: "box-shadow 0.2s ease", marginBottom: 8, boxShadow: isDragging ? "0 12px 40px rgba(0,0,0,0.6)" : "none" }}
      onMouseEnter={e => { if (!isDragging) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.borderLeftColor = valueCfg.color; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)"; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderLeftColor = valueCfg.color; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{item.category}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 8 }}>{item.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <ValueBadge value={item.value} />
        {item.tools?.length > 0 && (
          <span style={{ fontSize: 10, color: "#475569", fontFamily: "'DM Mono', monospace" }}>
            {item.tools.map(t => t.name).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}
