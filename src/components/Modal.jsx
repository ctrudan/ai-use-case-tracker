import { useState } from "react";
import { VALUE_CONFIG, STATUS_CONFIG, EFFORT_CONFIG, TOOLS } from "../constants";
import { ValueBadge, StatusBadge, EffortBadge } from "./Badges";
import { TagPill, ToolPill } from "./Pills";

export default function Modal({ item, onClose, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [draft, setDraft] = useState({ ...item, tagsString: item.tags.join(", ") });
  const [newNote, setNewNote] = useState("");

  const handleSave = () => {
    onSave({ ...draft, tags: draft.tagsString.split(",").map(t => t.trim()).filter(Boolean) });
    setEditing(false);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      text: newNote.trim(),
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    const updated = { ...item, notes: [note, ...(item.notes || [])] };
    onSave(updated);
    setNewNote("");
  };

  const handleNoteKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
  };

  const labelStyle = { fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5, display: "block" };
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#CBD5E1", fontSize: 13, padding: "9px 12px", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "#0D1120", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 32, maxWidth: 620, width: "100%", maxHeight: "85vh", overflowY: "auto", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#64748B", fontSize: 20, cursor: "pointer" }}>✕</button>

        {editing ? (
          <>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Editing Use Case</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Title</label><input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Category</label><select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })} style={inputStyle}><option>Business</option><option>Personal</option></select></div>
              <div><label style={labelStyle}>Tags (comma-sep)</label><input value={draft.tagsString} onChange={e => setDraft({ ...draft, tagsString: e.target.value })} style={inputStyle} /></div>
              <div><label style={labelStyle}>Value</label><select value={draft.value} onChange={e => setDraft({ ...draft, value: e.target.value })} style={inputStyle}>{Object.keys(VALUE_CONFIG).map(v => <option key={v}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>Status</label><select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} style={inputStyle}>{Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label style={labelStyle}>Effort</label><select value={draft.effort || "Low"} onChange={e => setDraft({ ...draft, effort: e.target.value })} style={inputStyle}>{Object.keys(EFFORT_CONFIG).map(e => <option key={e}>{e}</option>)}</select></div>
              <div><label style={labelStyle}>Time Saved</label><input value={draft.timeSaved || ""} onChange={e => setDraft({ ...draft, timeSaved: e.target.value })} style={inputStyle} placeholder="e.g. ~45 min/week" /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Summary</label><input value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })} style={inputStyle} /></div>
              <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Commentary & Test Results</label><textarea value={draft.commentary} onChange={e => setDraft({ ...draft, commentary: e.target.value })} style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} /></div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={labelStyle}>Tools Tested</label>
                {draft.tools.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <select value={t.name} onChange={e => { const tools = [...draft.tools]; tools[i] = { ...tools[i], name: e.target.value }; setDraft({ ...draft, tools }); }} style={{ ...inputStyle, width: "auto", flex: 1 }}>{TOOLS.map(tool => <option key={tool}>{tool}</option>)}</select>
                    <input type="date" value={t.date} onChange={e => { const tools = [...draft.tools]; tools[i] = { ...tools[i], date: e.target.value }; setDraft({ ...draft, tools }); }} style={{ ...inputStyle, width: "auto", flex: 1 }} />
                    <button onClick={() => setDraft({ ...draft, tools: draft.tools.filter((_, j) => j !== i) })} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
                  </div>
                ))}
                <button onClick={() => setDraft({ ...draft, tools: [...draft.tools, { name: "Claude", date: new Date().toISOString().slice(0, 10) }] })} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>+ Add Tool</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
              {confirmDelete ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#EF4444", fontFamily: "'DM Mono', monospace" }}>Sure?</span>
                  <button onClick={() => onDelete(item.id)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Yes, delete</button>
                  <button onClick={() => setConfirmDelete(false)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 12 }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "none", color: "#EF4444", cursor: "pointer", fontSize: 13 }}>🗑 Delete</button>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setEditing(false)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                <button onClick={handleSave} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#00E5A0", color: "#0D1120", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Save</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{item.category}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 22, color: "#F1F5F9", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{item.title}</h2>
              <ValueBadge value={item.value} />
              <StatusBadge status={item.status} />
              {item.effort && <EffortBadge effort={item.effort} />}
              {item.timeSaved && <span style={{ fontSize: 12, color: "#64748B", fontFamily: "'DM Mono', monospace" }}>⏱ {item.timeSaved}</span>}
            </div>
            {item.tags.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {item.tags.map(tag => <TagPill key={tag} tag={tag} />)}
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Summary</div>
              <p style={{ fontSize: 14, color: "#94A3B8", margin: 0, lineHeight: 1.6 }}>{item.summary}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Commentary & Test Results</div>
              <p style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.7, margin: 0, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 14, borderLeft: `3px solid ${VALUE_CONFIG[item.value]?.color}44` }}>{item.commentary}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Tools Tested</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {item.tools?.length > 0 ? item.tools.map(t => <ToolPill key={t.name} name={t.name} date={t.date} />) : <span style={{ color: "#475569", fontSize: 13 }}>None yet</span>}
              </div>
            </div>

            {/* ── Notes log ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Notes Log</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={handleNoteKeyDown}
                  placeholder="Add a note... (Ctrl+Enter to save)"
                  rows={2}
                  style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#CBD5E1", fontSize: 13, padding: "9px 12px", fontFamily: "inherit", resize: "none", outline: "none" }}
                />
                <button onClick={handleAddNote} style={{ padding: "0 16px", borderRadius: 8, border: "none", background: "#00E5A0", color: "#0D1120", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif", alignSelf: "stretch" }}>+ Add</button>
              </div>
              {item.notes?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {item.notes.map((note, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{note.date}</div>
                      <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.6 }}>{note.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "#475569", fontFamily: "'DM Mono', monospace" }}>No notes yet.</div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)", background: "none", color: "#94A3B8", cursor: "pointer", fontSize: 13 }}>✎ Edit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
