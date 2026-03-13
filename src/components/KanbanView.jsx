import { useState } from "react";
import { KANBAN_COLUMNS, STATUS_CONFIG } from "../constants";
import KanbanCard from "./KanbanCard";
import Tooltip from "./Tooltip";

let _dragId = null; // module-level fallback for dataTransfer

export default function KanbanView({ cases, onCardClick, onReorder }) {
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null); // { col, beforeId }

  const onDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    _dragId = id;
    setDraggingId(id);
  };

  const onDragEnd = () => { setDraggingId(null); setDropTarget(null); };

  const onColDragOver = (e, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const cardEls = Array.from(e.currentTarget.querySelectorAll("[data-card-id]"));
    let beforeId = null;
    for (const el of cardEls) {
      const rect = el.getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        beforeId = el.getAttribute("data-card-id");
        break;
      }
    }
    setDropTarget({ col, beforeId });
  };

  const onColDrop = (e, col) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || _dragId;
    if (sourceId) onReorder(sourceId, col, dropTarget?.beforeId || null);
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div style={{ padding: "0 32px 48px", width: "100%", boxSizing: "border-box", overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 16, minWidth: "fit-content", alignItems: "flex-start" }}>
        {KANBAN_COLUMNS.map(col => {
          const colCfg = STATUS_CONFIG[col];
          const colCards = [...cases.filter(c => c.status === col)].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          const isActiveCol = dropTarget?.col === col;

          return (
            <div key={col} style={{ width: 240, flexShrink: 0 }}>
              {/* Column header */}
              <div style={{ background: colCfg.bg, border: `1px solid ${isActiveCol ? colCfg.color : colCfg.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "border 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ color: colCfg.color, fontSize: 10 }}>{colCfg.icon}</span>
                  <span style={{ color: colCfg.color, fontWeight: 700, fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>{col.toUpperCase()}</span>
                  <Tooltip text={colCfg.tooltip} color={colCfg.color} />
                </div>
                <span style={{ background: "rgba(255,255,255,0.08)", color: "#64748B", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{colCards.length}</span>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => onColDragOver(e, col)}
                onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null); }}
                onDrop={e => onColDrop(e, col)}
                style={{ minHeight: 80, borderRadius: 10, padding: 2, background: isActiveCol ? colCfg.bg : "transparent", transition: "background 0.15s" }}
              >
                {colCards.length === 0 && !isActiveCol && (
                  <div style={{ border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 10, padding: "20px 0", textAlign: "center", color: "#2D3748", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>empty</div>
                )}
                {colCards.map(item => {
                  const isThisDragging = draggingId === item.id;
                  const showIndicatorBefore = isActiveCol && dropTarget?.beforeId === item.id;
                  return (
                    <div key={item.id}>
                      {showIndicatorBefore && (
                        <div style={{ height: 2, background: colCfg.color, borderRadius: 2, margin: "2px 0", opacity: 0.8 }} />
                      )}
                      <div
                        data-card-id={item.id}
                        draggable
                        onDragStart={e => onDragStart(e, item.id)}
                        onDragEnd={onDragEnd}
                        style={{ opacity: isThisDragging ? 0.3 : 1, transition: "opacity 0.15s", cursor: "grab" }}
                      >
                        <KanbanCard item={item} onClick={() => !draggingId && onCardClick(item)} isDragging={isThisDragging} />
                      </div>
                    </div>
                  );
                })}
                {isActiveCol && !dropTarget?.beforeId && (
                  <div style={{ height: 2, background: colCfg.color, borderRadius: 2, margin: "2px 0", opacity: 0.8 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
