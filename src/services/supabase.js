import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── Data converters ───────────────────────────────────────────────
// Supabase returns flat rows with snake_case keys.
// Components expect camelCase with "title" instead of "name".

function fromSupabase(row) {
  return {
    id:         row.id,
    title:      row.name        || "",
    category:   row.category    || "Business",
    tags:       row.tags        || [],
    value:      row.value       || "Medium Value",
    status:     row.status      || "Idea",
    effort:     row.effort      || "Low",
    timeSaved:  row.time_saved  || "",
    summary:    row.summary     || "",
    commentary: row.commentary  || "",
    tools:      row.tools       || [],
    notes:      row.notes       || [],
    sortOrder:  row.sort_order  ?? 0,
  };
}

function toSupabase(item) {
  return {
    name:       item.title,
    category:   item.category,
    tags:       item.tags,
    value:      item.value,
    status:     item.status,
    effort:     item.effort,
    time_saved: item.timeSaved,
    summary:    item.summary,
    commentary: item.commentary,
    tools:      item.tools,
    notes:      item.notes || [],
    sort_order: item.sortOrder ?? 0,
  };
}

// ── API calls ─────────────────────────────────────────────────────

export async function fetchAllCases() {
  const { data, error } = await supabase
    .from("use_cases")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(fromSupabase);
}

export async function createCase(item) {
  const { data, error } = await supabase
    .from("use_cases")
    .insert(toSupabase(item))
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromSupabase(data);
}

export async function updateCase(item) {
  const { data, error } = await supabase
    .from("use_cases")
    .update(toSupabase(item))
    .eq("id", item.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return fromSupabase(data);
}

export async function deleteCase(id) {
  const { error } = await supabase
    .from("use_cases")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function reorderCases(updates) {
  const promises = updates.map(u =>
    supabase
      .from("use_cases")
      .update({ status: u.status, sort_order: u.sortOrder })
      .eq("id", u.id)
  );

  const results = await Promise.all(promises);
  const failed = results.find(r => r.error);
  if (failed) throw new Error(failed.error.message);
}
