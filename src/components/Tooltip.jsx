import { useState } from "react";

export default function Tooltip({ text, color }) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span style={{ color, opacity: 0.5, fontSize: 11, cursor: "default", lineHeight: 1, userSelect: "none" }}>ⓘ</span>
      {visible && (
        <span style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#1E2438", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#CBD5E1", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif", zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", pointerEvents: "none" }}>
          {text}
          <span style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#1E2438", border: "1px solid rgba(255,255,255,0.12)", borderRight: "none", borderBottom: "none", rotate: "45deg" }} />
        </span>
      )}
    </span>
  );
}
