const https = require("https");

const AT_TOKEN = process.env.AIRTABLE_TOKEN;
const AT_BASE  = process.env.AIRTABLE_BASE;
const AT_TABLE = process.env.AIRTABLE_TABLE;

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { reject(new Error("Invalid JSON: " + data)); }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function atOptions(path, method) {
  return {
    hostname: "api.airtable.com",
    path: `/v0/${AT_BASE}/${AT_TABLE}${path || ""}`,
    method: method || "GET",
    headers: {
      "Authorization": `Bearer ${AT_TOKEN}`,
      "Content-Type": "application/json",
    },
  };
}

function ok(data) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

exports.handler = async (event) => {
  const method = event.httpMethod;
  const body   = event.body ? JSON.parse(event.body) : {};

  try {
    if (method === "GET") {
      let all = [], offset = null;
      do {
        const path = offset ? `?offset=${offset}` : "";
        const res = await request(atOptions(path, "GET"));
        if (res.status !== 200) throw new Error(`Airtable error: ${res.status} ${JSON.stringify(res.body)}`);
        all = [...all, ...res.body.records];
        offset = res.body.offset;
      } while (offset);
      return ok({ records: all });
    }

    if (method === "POST" && body.action === "create") {
      const res = await request(atOptions("", "POST"), { fields: body.fields });
      return ok(res.body);
    }

    if (method === "PATCH" && body.action === "update") {
      const res = await request(atOptions(`/${body.id}`, "PATCH"), { fields: body.fields });
      return ok(res.body);
    }

    if (method === "PATCH" && body.action === "reorder") {
      await Promise.all(
        body.updates.map(u =>
          request(atOptions(`/${u.id}`, "PATCH"), { fields: { Status: u.status, "Sort Order": u.sortOrder } })
        )
      );
      return ok({ success: true });
    }

    if (method === "DELETE") {
      await request(atOptions(`/${body.id}`, "DELETE"));
      return ok({ success: true });
    }

    return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
