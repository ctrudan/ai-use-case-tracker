export const TOOLS = ["Claude", "ChatGPT", "Gemini", "Perplexity", "Copilot", "Midjourney", "Other"];

export const KANBAN_COLUMNS = ["Idea", "In Testing", "Active Use", "Paused", "Abandoned"];
export const CATEGORIES = ["All", "Business", "Personal"];
export const VALUES = ["All", "High Value", "Medium Value", "Experimental", "Low Value"];

export const VALUE_CONFIG = {
  "High Value":    { color: "#00E5A0", bg: "rgba(0,229,160,0.12)",   dot: "#00E5A0" },
  "Medium Value":  { color: "#F5C542", bg: "rgba(245,197,66,0.12)",  dot: "#F5C542" },
  "Experimental":  { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", dot: "#A78BFA" },
  "Low Value":     { color: "#64748B", bg: "rgba(100,116,139,0.10)", dot: "#64748B" },
};

export const STATUS_CONFIG = {
  "Idea":       { color: "#94A3B8", icon: "◎", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", tooltip: "Captured but not yet tried. Sitting in the backlog." },
  "In Testing": { color: "#F5C542", icon: "◆", bg: "rgba(245,197,66,0.08)",  border: "rgba(245,197,66,0.2)",  tooltip: "Actively experimenting with this right now." },
  "Active Use": { color: "#00E5A0", icon: "▲", bg: "rgba(0,229,160,0.08)",   border: "rgba(0,229,160,0.2)",   tooltip: "Proven and part of your regular workflow." },
  "Paused":     { color: "#A78BFA", icon: "⏸", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)", tooltip: "Tried it, not using it currently but not ready to give up on it." },
  "Abandoned":  { color: "#475569", icon: "✕", bg: "rgba(71,85,105,0.08)",   border: "rgba(71,85,105,0.2)",   tooltip: "Definitively not worth pursuing." },
};

export const EFFORT_CONFIG = {
  "Low":    { color: "#00E5A0", bg: "rgba(0,229,160,0.10)" },
  "Medium": { color: "#F5C542", bg: "rgba(245,197,66,0.10)" },
  "High":   { color: "#EF4444", bg: "rgba(239,68,68,0.10)" },
};

export const SAMPLE_CASES = [
  {
    id: 1, title: "Weekly Report Drafting", category: "Business", tags: ["Writing", "Productivity"],
    value: "High Value", status: "Active Use", effort: "Low", timeSaved: "~45 min/week",
    summary: "Using AI to draft weekly status reports from bullet notes.",
    commentary: "Huge time saver. Claude does the best job structuring narrative flow from rough bullets.",
    tools: [{ name: "Claude", date: "2025-11-10" }, { name: "ChatGPT", date: "2025-11-15" }],
    sortOrder: 10,
  },
  {
    id: 2, title: "Contract Clause Review", category: "Business", tags: ["Legal", "Research"],
    value: "High Value", status: "Active Use", effort: "Low", timeSaved: "~1 hr/contract",
    summary: "Pasting contract sections and asking for plain-English explanations + red flags.",
    commentary: "Not a replacement for a lawyer but excellent for initial triage.",
    tools: [{ name: "Claude", date: "2025-12-01" }, { name: "Gemini", date: "2025-12-03" }],
    sortOrder: 20,
  },
  {
    id: 3, title: "Recipe Scaling & Meal Planning", category: "Personal", tags: ["Cooking", "Planning"],
    value: "Medium Value", status: "Active Use", effort: "Low", timeSaved: "~20 min/week",
    summary: "Scaling recipes, substituting ingredients, building weekly meal plans.",
    commentary: "Works great for scaling. Ingredient substitution suggestions are creative and accurate.",
    tools: [{ name: "Claude", date: "2025-10-20" }],
    sortOrder: 10,
  },
  {
    id: 4, title: "Competitor Research Summaries", category: "Business", tags: ["Research", "Strategy"],
    value: "Medium Value", status: "In Testing", effort: "Medium", timeSaved: "",
    summary: "Feeding articles/docs about competitors and asking for structured SWOT-style analysis.",
    commentary: "Useful but requires clean source material.",
    tools: [{ name: "Perplexity", date: "2026-01-10" }, { name: "Claude", date: "2026-01-12" }],
    sortOrder: 10,
  },
  {
    id: 5, title: "Travel Itinerary Planning", category: "Personal", tags: ["Travel", "Planning"],
    value: "High Value", status: "Active Use", effort: "Low", timeSaved: "~2 hrs/trip",
    summary: "Building day-by-day trip itineraries with logistics, restaurants, timing.",
    commentary: "One of my favorite personal use cases. Way better than any travel app I've used.",
    tools: [{ name: "Claude", date: "2025-09-15" }],
    sortOrder: 30,
  },
  {
    id: 6, title: "Python Script Generation", category: "Business", tags: ["Coding", "Automation"],
    value: "High Value", status: "Active Use", effort: "Medium", timeSaved: "~3 hrs/script",
    summary: "Generating data processing and automation scripts from plain-language descriptions.",
    commentary: "Game changer for non-developer workflows. Claude produces working scripts ~85% of the time on first try.",
    tools: [{ name: "Claude", date: "2025-10-05" }, { name: "Copilot", date: "2025-10-08" }],
    sortOrder: 40,
  },
  {
    id: 7, title: "AI-Generated Marketing Images", category: "Business", tags: ["Design", "Marketing"],
    value: "Experimental", status: "In Testing", effort: "High", timeSaved: "",
    summary: "Testing image gen for social media graphics and internal presentations.",
    commentary: "Still figuring out the right workflow. Text in images remains a weakness.",
    tools: [{ name: "Midjourney", date: "2026-02-01" }],
    sortOrder: 20,
  },
  {
    id: 8, title: "Email Tone Calibration", category: "Business", tags: ["Writing", "Communication"],
    value: "Medium Value", status: "Paused", effort: "Low", timeSaved: "~15 min/email",
    summary: "Pasting draft emails and asking for tone adjustments.",
    commentary: "Works well for tricky emails. Occasionally over-sanitizes voice.",
    tools: [{ name: "Claude", date: "2025-11-20" }, { name: "ChatGPT", date: "2025-11-21" }],
    sortOrder: 10,
  },
  {
    id: 9, title: "Automated Meeting Summaries", category: "Business", tags: ["Productivity", "Writing"],
    value: "High Value", status: "Idea", effort: "Low", timeSaved: "",
    summary: "Using AI to summarize meeting transcripts into action items and decisions.",
    commentary: "No notes yet.",
    tools: [],
    sortOrder: 10,
  },
];
