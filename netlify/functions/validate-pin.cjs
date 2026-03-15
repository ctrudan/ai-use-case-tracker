exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const { pin } = JSON.parse(event.body || "{}");
  const correct = process.env.PIN;

  if (!correct) {
    return { statusCode: 500, body: JSON.stringify({ error: "PIN not configured" }) };
  }

  if (pin === correct) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  }

  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: false }),
  };
};
