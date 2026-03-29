import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "screenshots");

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
await page.waitForFunction(() => !document.body.innerText.includes("Loading..."), { timeout: 15000 });

// Nav to Incidents using role=menuitem
await page.evaluate(() => {
  const items = Array.from(document.querySelectorAll("[role=menuitem]"));
  const el = items.find(el => el.textContent.trim() === "Incidents");
  if (el) el.click();
});
await new Promise(r => setTimeout(r, 800));

// Wait for incidents list to appear
await page.waitForFunction(() => document.body.innerText.includes("INC-2026-031"), { timeout: 10000 });

// Click first INC row — find by text then click the row div
const clicked = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll("div"));
  // Find the shallowest div that contains the incident ID and has near miss text
  const row = all.find(el =>
    el.textContent.includes("INC-2026-031") &&
    el.textContent.includes("Near Miss") &&
    el.childElementCount > 0
  );
  if (row) { row.click(); return true; }
  return false;
});
console.log("clicked row:", clicked);
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: path.join(OUT, "incident-detail.png") });
console.log("✓ incident-detail.png");
await browser.close();
