import { useState } from "react";
import { VALUE_CONFIG, STATUS_CONFIG, EFFORT_CONFIG, TOOLS } from "../constants";

export default function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "", category: "Business", tags: "", value: "Medium Value",
    status: "Idea", effort: "Low", timeSaved: "", summary: "",
    commentary: "", toolName: "", toolDate: "",
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const labelStyle = { fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5, display: "block" };
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#CBD5E1", fontSize: 13, padding: "9px 12px", boxSizing: "border-box", fontFamily: "inherit" };

  const handleAdd = () => {
    if (!form.title.trim()) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
    event: "use_case_added",
    use_case_title: form.title.trim(),
    use_case_category: form.category,
    use_case_value: form.value,
    use_case_status: form.status,
    use_case_effort: form.effort,
    use_case_tool: form.toolName || "none",
    use_case_tag_count: form.tags
      ? form.tags.split(",").map(t => t.trim()).filter(Boolean).length
      : 0,
  });
    onAdd({
      id: Date.now(),
      title: form.title,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      value: form.value,
      status: form.status,
      effort: form.effort,
      timeSaved: form.timeSaved,
      summary: form.summary,
      commentary: form.commentary || "No notes yet.",
      tools: form.toolName ? [{ name: form.toolName, date: form.toolDate || new Date().toISOString().slice(0, 10) }] : [],
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#0D1120", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, maxWidth: 540, width: "100%", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: "0 0 22px", color: "#F1F5F9", fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Add Use Case</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Title *</label><input value={form.title} onChange={e => f("title", e.target.value)} style={inputStyle} placeholder="e.g. Meeting Summary Drafts" /></div>
          <div><label style={labelStyle}>Category</label><select value={form.category} onChange={e => f("category", e.target.value)} style={inputStyle}><option>Business</option><option>Personal</option></select></div>
          <div><label style={labelStyle}>Tags (comma-sep)</label><input value={form.tags} onChange={e => f("tags", e.target.value)} style={inputStyle} placeholder="Writing, Research" /></div>
          <div><label style={labelStyle}>Value</label><select value={form.value} onChange={e => f("value", e.target.value)} style={inputStyle}>{Object.keys(VALUE_CONFIG).map(v => <option key={v}>{v}</option>)}</select></div>
          <div><label style={labelStyle}>Status</label><select value={form.status} onChange={e => f("status", e.target.value)} style={inputStyle}>{Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label style={labelStyle}>Effort</label><select value={form.effort} onChange={e => f("effort", e.target.value)} style={inputStyle}>{Object.keys(EFFORT_CONFIG).map(e => <option key={e}>{e}</option>)}</select></div>
          <div><label style={labelStyle}>Time Saved</label><input value={form.timeSaved} onChange={e => f("timeSaved", e.target.value)} style={inputStyle} placeholder="e.g. ~45 min/week" /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>One-line Summary</label><input value={form.summary} onChange={e => f("summary", e.target.value)} style={inputStyle} placeholder="What are you using AI for here?" /></div>
          <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Commentary / Test Notes</label><textarea value={form.commentary} onChange={e => f("commentary", e.target.value)} style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Results, observations, tips..." /></div>
          <div><label style={labelStyle}>First Tool Tested</label><select value={form.toolName} onChange={e => f("toolName", e.target.value)} style={inputStyle}><option value="">— none —</option>{TOOLS.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label style={labelStyle}>Date Tested</label><input type="date" value={form.toolDate} onChange={e => f("toolDate", e.target.value)} style={inputStyle} /></div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
          <button onClick={handleAdd} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#00E5A0", color: "#0D1120", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Add</button>
        </div>
      </div>
    </div>
  );
}
