const cron = require("node-cron");
const http = require("http");
const https = require("https");
const { URL } = require("url");

const job = cron.schedule("*/14 * * * *", () => {
  const apiUrl = process.env.FRONTEND_URL;

  if (!apiUrl) {
    console.error("❌ API_URL not defined");
    return;
  }

  const url = new URL(apiUrl);
  const protocol = url.protocol;

  const client = protocol === "https:" ? https : http;

  client
    .get(apiUrl, (res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        console.log("✅ GET request sent successfully to:", apiUrl);
      } else {
        console.error("⚠️ GET request failed. Status code:", statusCode);
      }
    })
    .on("error", (err) => {
      console.error("❌ Error while sending request:", err.message);
    });
});

module.exports = job;
