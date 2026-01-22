// server.js
// Simple Node.js proxy to allow iframe display of any website

// Install dependencies: npm install express node-fetch cors

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors()); // allow your HTML app to access it

// Proxy endpoint
// Example: http://localhost:3000/proxy?url=https://example.com
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url parameter");

  try {
    const response = await fetch(target, { redirect: "follow" });
    let text = await response.text();

    // Optional: strip CSP/X-Frame headers so iframe works
    text = text.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    res.send(text);
  } catch (err) {
    res.status(500).send("Error fetching target: " + err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
