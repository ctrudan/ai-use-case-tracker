const AT_TOKEN = "patVYPD2YLt7JdmI7.996c0d341a1fd7a5ca09add365d2550e3cc05c96b3f0efa39a0c7a3cc233f67a";
const AT_BASE  = "apprrw4fhJY6kIJu5";
const AT_TABLE = "tblG8h5Du71FKsGOF";
const AT_URL   = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE}`;
const AT_HEADS = { "Authorization": `Bearer ${AT_TOKEN}`, "Content-Type": "application/json" };

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
    "Sort Order":  item.sortOrder ?? 0,
  };
}

// ── API calls ─────────────────────────────────────────────────────

export async function fetchAllCases() {
  let all = [], offset = null;
  do {
    const url = offset ? `${AT_URL}?offset=${offset}` : AT_URL;
    const res = await fetch(url, { headers: AT_HEADS });
    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
    const data = await res.json();
    all = [...all, ...data.records.map(fromAirtable)];
    offset = data.offset;
  } while (offset);
  return all;
}

export async function createCase(item) {
  const res = await fetch(AT_URL, {
    method: "POST",
    headers: AT_HEADS,
    body: JSON.stringify({ fields: toAirtable(item) }),
  });
  const data = await res.json();
  return fromAirtable(data);
}

export async function updateCase(item) {
  const res = await fetch(`${AT_URL}/${item.id}`, {
    method: "PATCH",
    headers: AT_HEADS,
    body: JSON.stringify({ fields: toAirtable(item) }),
  });
  const data = await res.json();
  return fromAirtable(data);
}

export async function deleteCase(id) {
  await fetch(`${AT_URL}/${id}`, { method: "DELETE", headers: AT_HEADS });
}

export async function reorderCases(updates) {
  await Promise.all(
    updates.map(u =>
      fetch(`${AT_URL}/${u.id}`, {
        method: "PATCH",
        headers: AT_HEADS,
        body: JSON.stringify({ fields: { Status: u.status, "Sort Order": u.sortOrder } }),
      })
    )
  );
}
