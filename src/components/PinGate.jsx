import { useState } from "react";

export default function PinGate({ children }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pin.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/validate-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setUnlocked(true);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "pin_unlock_success",
        });
      } else {
        setError(true);
        setPin("");
        setTimeout(() => setError(false), 2000);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "pin_unlock_failed",
        });
      }
    } catch {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (unlocked) return children;

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#080C18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ background: "rgba(15,20,35,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "40px 48px", maxWidth: 360, width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#475569", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>AI Experiments</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif", background: "linear-gradient(135deg, #F1F5F9, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 32 }}>Use Case Tracker</h1>

        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter PIN"
            autoFocus
            disabled={loading}
            style={{ width: "100%", background: error ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, padding: "12px 16px", color: "#F1F5F9", fontSize: 18, fontFamily: "'DM Mono', monospace", outline: "none", textAlign: "center", letterSpacing: "0.3em", boxSizing: "border-box", transition: "border 0.2s" }}
          />
          {error && (
            <div style={{ fontSize: 12, color: "#EF4444", fontFamily: "'DM Mono', monospace", marginTop: 8 }}>incorrect pin, try again</div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: loading ? "#64748B" : "#00E5A0", color: "#0D1120", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
        >
          {loading ? "Checking..." : "Unlock"}
        </button>
      </div>
    </div>
  );
}
