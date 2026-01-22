// server.js
// Simple Node.js proxy to allow in-app browsing

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

// Serve proxy endpoint
app.get("/proxy", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing url parameter");

  try {
    const response = await fetch(target, { redirect: "follow" });
    let text = await response.text();

    // Strip CSP meta tags that block iframe
    text = text.replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    res.send(text);
  } catch (err) {
    res.status(500).send("Error fetching target: " + err.message);
  }
});

// Optional: serve frontend from same server
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
