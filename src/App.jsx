import { useState, useEffect } from "react";
import { VALUE_CONFIG, CATEGORIES, VALUES, SAMPLE_CASES } from "./constants";
import { fetchAllCases, createCase, updateCase, deleteCase, reorderCases } from "./services/airtable";
import GridCard from "./components/GridCard";
import KanbanView from "./components/KanbanView";
import Modal from "./components/Modal";
import AddModal from "./components/AddModal";

// Preview mode: use sample data in Claude sandbox, real Airtable everywhere else
const IS_PREVIEW = typeof window !== "undefined" &&
  !window.location.hostname.includes("netlify") &&
  !window.location.hostname.includes("localhost");

export default function App() {
  const [cases, setCases]       = useState(IS_PREVIEW ? SAMPLE_CASES : []);
  const [loading, setLoading]   = useState(!IS_PREVIEW);
  const [error, setError]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [view, setView]         = useState("kanban");
  const [selected, setSelected] = useState(null);
  const [adding, setAdding]     = useState(false);
  const [search, setSearch]     = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterVal, setFilterVal] = useState("All");
  const [filterTag, setFilterTag] = useState("");

  // ── Load ────────────────────────────────────────────────────────
  useEffect(() => {
    if (IS_PREVIEW) return;
    const load = async () => {
      try {
        setLoading(true);
        setCases(await fetchAllCases());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── CRUD ────────────────────────────────────────────────────────
  const handleAdd = async (item) => {
    if (IS_PREVIEW) { setCases(cs => [{ ...item, id: Date.now() }, ...cs]); return; }
    setSaving(true);
    try {
      const created = await createCase(item);
      setCases(cs => [created, ...cs]);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleSave = async (updated) => {
    if (IS_PREVIEW) { setCases(cs => cs.map(c => c.id === updated.id ? updated : c)); return; }
    setSaving(true);
    try {
      const saved = await updateCase(updated);
      setCases(cs => cs.map(c => c.id === saved.id ? saved : c));
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (IS_PREVIEW) { setCases(cs => cs.filter(c => c.id !== id)); return; }
    setSaving(true);
    try {
      await deleteCase(id);
      setCases(cs => cs.filter(c => c.id !== id));
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleReorder = async (sourceId, targetCol, targetId) => {
    const colCards = [...cases.filter(c => c.status === targetCol)]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const source = cases.find(c => c.id === sourceId);
    if (!source) return;

    const withoutSource = colCards.filter(c => c.id !== sourceId);
    let insertIndex = targetId ? withoutSource.findIndex(c => c.id === targetId) : withoutSource.length;
    if (insertIndex === -1) insertIndex = withoutSource.length;
    withoutSource.splice(insertIndex, 0, { ...source, status: targetCol });

    const updates = withoutSource.map((c, i) => ({ ...c, sortOrder: (i + 1) * 10 }));
    setCases(cs => {
      const others = cs.filter(c => !updates.find(u => u.id === c.id));
      return [...others, ...updates];
    });

    if (!IS_PREVIEW) {
      setSaving(true);
      try { await reorderCases(updates); } catch (e) { setError(e.message); }
      setSaving(false);
    }
  };

  // ── Derived data ─────────────────────────────────────────────────
  const allTags = [...new Set(cases.flatMap(c => c.tags))].sort();
  const counts = Object.fromEntries(
    Object.keys(VALUE_CONFIG).map(v => [v, cases.filter(c => c.value === v).length])
  );
  const filtered = cases.filter(c => {
    if (filterCat !== "All" && c.category !== filterCat) return false;
    if (filterVal !== "All" && c.value !== filterVal) return false;
    if (filterTag && !c.tags.includes(filterTag)) return false;
    if (search &&
      !c.title.toLowerCase().includes(search.toLowerCase()) &&
      !c.summary.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Styles ───────────────────────────────────────────────────────
  const chipStyle = (active) => ({
    padding: "5px 12px", borderRadius: 20,
    border: `1px solid ${active ? "#00E5A0" : "rgba(255,255,255,0.25)"}`,
    background: active ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.04)",
    color: active ? "#00E5A0" : "#94A3B8",
    fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace",
    transition: "all 0.15s", fontWeight: active ? 700 : 400,
  });
  const viewBtnStyle = (active) => ({
    padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
    fontFamily: "'DM Mono', monospace", transition: "all 0.15s",
    background: active ? "rgba(255,255,255,0.1)" : "none",
    color: active ? "#F1F5F9" : "#64748B",
    border: `1px solid ${active ? "rgba(255,255,255,0.2)" : "transparent"}`,
    fontWeight: active ? 600 : 400,
  });

  // ── Loading / Error states ────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#080C18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", color: "#475569", fontSize: 13 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');`}</style>
      ● loading from airtable...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#080C18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", color: "#EF4444", fontSize: 13 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');`}</style>
      ✕ error: {error}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#080C18", fontFamily: "'DM Sans', sans-serif", color: "#F1F5F9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        select option { background: #0D1120; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "32px 32px 0", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>AI Experiments</div>
            <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: "linear-gradient(135deg, #F1F5F9, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Use Case Tracker</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 4 }}>
              <button onClick={() => setView("grid")} style={viewBtnStyle(view === "grid")}>⊞ Grid</button>
              <button onClick={() => setView("kanban")} style={viewBtnStyle(view === "kanban")}>⊟ Kanban</button>
            </div>
            <span style={{ fontSize: 11, color: saving ? "#F5C542" : IS_PREVIEW ? "#475569" : "#2D6A4F", background: saving ? "rgba(245,197,66,0.08)" : IS_PREVIEW ? "rgba(255,255,255,0.04)" : "rgba(0,229,160,0.08)", border: `1px solid ${saving ? "rgba(245,197,66,0.2)" : IS_PREVIEW ? "rgba(255,255,255,0.1)" : "rgba(0,229,160,0.2)"}`, borderRadius: 20, padding: "4px 10px", fontFamily: "'DM Mono', monospace", transition: "all 0.3s" }}>
              {saving ? "○ saving..." : IS_PREVIEW ? "◈ preview mode" : "● synced to airtable"}
            </span>
            <button onClick={() => setAdding(true)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#00E5A0", color: "#0D1120", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>+ New Use Case</button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {Object.entries(counts).map(([v, n]) => n > 0 && (
            <div key={v} style={{ background: VALUE_CONFIG[v].bg, border: `1px solid ${VALUE_CONFIG[v].color}30`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: VALUE_CONFIG[v].color, fontFamily: "'DM Mono', monospace" }}>{n}</span>
              <span style={{ fontSize: 11, color: VALUE_CONFIG[v].color, opacity: 0.8, fontFamily: "'DM Mono', monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#94A3B8", fontFamily: "'DM Mono', monospace" }}>{cases.length}</span>
            <span style={{ fontSize: 11, color: "#64748B", fontFamily: "'DM Mono', monospace" }}>Total</span>
          </div>
        </div>

        {/* ── Grid filters ── */}
        {view === "grid" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", color: "#CBD5E1", fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none", width: 160 }} />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            {CATEGORIES.map(c => <button key={c} onClick={() => setFilterCat(c)} style={chipStyle(filterCat === c)}>{c}</button>)}
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            {VALUES.map(v => <button key={v} onClick={() => setFilterVal(v)} style={chipStyle(filterVal === v)}>{v === "All" ? "All Values" : v}</button>)}
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ background: filterTag ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${filterTag ? "#A78BFA" : "rgba(255,255,255,0.2)"}`, borderRadius: 20, padding: "5px 12px", color: filterTag ? "#A78BFA" : "#94A3B8", fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: "pointer", outline: "none", fontWeight: filterTag ? 700 : 400 }}>
              <option value="">All Tags</option>
              {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        )}
        {view === "kanban" && <div style={{ marginBottom: 20 }} />}
      </div>

      {/* ── Main content ── */}
      {view === "grid" ? (
        <div style={{ padding: "0 32px 48px", width: "100%", boxSizing: "border-box" }}>
          {filtered.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 0", color: "#475569", fontFamily: "'DM Mono', monospace" }}>No results found.</div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                {filtered.map(item => (
                  <GridCard key={item.id} item={item} onClick={() => setSelected(item)} onTagClick={tag => setFilterTag(filterTag === tag ? "" : tag)} />
                ))}
              </div>
          }
        </div>
      ) : (
        <KanbanView cases={cases} onCardClick={setSelected} onReorder={handleReorder} />
      )}

      {/* ── Modals ── */}
      {selected && (
        <Modal
          item={selected}
          onClose={() => setSelected(null)}
          onSave={async (u) => { await handleSave(u); setSelected(u); }}
          onDelete={async (id) => { await handleDelete(id); setSelected(null); }}
        />
      )}
      {adding && <AddModal onClose={() => setAdding(false)} onAdd={handleAdd} />}
    </div>
  );
}
