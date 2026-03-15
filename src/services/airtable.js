const FN = "/.netlify/functions/airtable";

// ── Data converters ───────────────────────────────────────────────

export function fromAirtable(rec) {
  const f = rec.fields;
  return {
    id:         rec.id,
    title:      f.Name          || "",
    category:   f.Category      || "Business",
    tags:       f.Tags          ? f.Tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    value:      f.Value         || "Medium Value",
    status:     f.Status        || "Idea",
    effort:     f.Effort        || "Low",
    timeSaved:  f["Time Saved"] || "",
    summary:    f.Summary       || "",
    commentary: f.Commentary    || "",
    tools:      f.Tools ? (() => { try { return JSON.parse(f.Tools); } catch { return []; } })() : [],
    notes:      f.Notes ? (() => { try { return JSON.parse(f.Notes); } catch { return []; } })() : [],
    sortOrder:  f["Sort Order"] ?? 0,
  };
}

export function toAirtable(item) {
  return {
    Name:          item.title,
    Category:      item.category,
    Tags:          item.tags.join(", "),
    Value:         item.value,
    Status:        item.status,
    Effort:        item.effort,
    "Time Saved":  item.timeSaved,
    Summary:       item.summary,
    Commentary:    item.commentary,
    Tools:         JSON.stringify(item.tools),
    Notes:         JSON.stringify(item.notes || []),
    "Sort Order":  item.sortOrder ?? 0,
  };
}

// ── API calls ─────────────────────────────────────────────────────

export async function fetchAllCases() {
  const res = await fetch(FN);
  if (!res.ok) throw new Error(`Function error: ${res.status}`);
  const data = await res.json();
  return data.records.map(fromAirtable);
}

export async function createCase(item) {
  const res = await fetch(FN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", fields: toAirtable(item) }),
  });
  const data = await res.json();
  return fromAirtable(data);
}

export async function updateCase(item) {
  const res = await fetch(FN, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", id: item.id, fields: toAirtable(item) }),
  });
  const data = await res.json();
  return fromAirtable(data);
}

export async function deleteCase(id) {
  await fetch(FN, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

export async function reorderCases(updates) {
  await fetch(FN, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reorder", updates }),
  });
}
