import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "screenshots");
await mkdir(OUT, { recursive: true });

const BASE = "http://localhost:3000";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function newPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  return page;
}

async function load(page) {
  await page.goto(BASE, { waitUntil: "networkidle0", timeout: 30000 });
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading..."),
    { timeout: 15000 }
  );
}

async function navTo(page, label) {
  await page.evaluate((label) => {
    const items = Array.from(document.querySelectorAll("[role=menuitem]"));
    const el = items.find((el) => el.textContent.trim() === label);
    if (el) el.click();
  }, label);
  await new Promise((r) => setTimeout(r, 900));
}

async function shot(name, fn) {
  const page = await newPage();
  await load(page);
  await fn(page);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log(`✓ ${name}.png`);
  await page.close();
}

// 1. Dashboard
await shot("dashboard", async () => {});

// 2. Daily Log
await shot("daily-logs", async (page) => {
  await navTo(page, "Daily Logs");
});

// 3. Quick Capture modal
await shot("quick-capture", async (page) => {
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const btn = btns.find((b) => b.textContent.includes("Report Incident"));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
});

// 4. Incidents list
await shot("incidents", async (page) => {
  await navTo(page, "Incidents");
});

// 5. Incident detail (Stage 2 form)
await shot("incident-detail", async (page) => {
  await navTo(page, "Incidents");
  await page.waitForFunction(
    () => document.body.innerText.includes("INC-2026-031"),
    { timeout: 10000 }
  );
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("div"));
    const row = all.find(
      (el) =>
        el.textContent.includes("INC-2026-031") &&
        el.textContent.includes("Near Miss") &&
        el.childElementCount > 1
    );
    if (row) row.click();
  });
  await new Promise((r) => setTimeout(r, 800));
});

// 6. Inspections
await shot("inspections", async (page) => {
  await navTo(page, "Inspections");
});

// 7. Observations
await shot("observations", async (page) => {
  await navTo(page, "Observations");
});

// 8. Action Plans
await shot("action-plans", async (page) => {
  await navTo(page, "Action Plans");
});

await browser.close();
console.log("\nAll screenshots done!");
