import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "screenshots");

await mkdir(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function waitForApp(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading..."),
    { timeout: 15000 }
  );
}

async function goTo(url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await waitForApp(page);
  return page;
}

// Incidents list
{
  const page = await goTo("http://localhost:3000");
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim() === "Incidents") {
        const el = node.parentElement;
        el.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "incidents.png") });
  console.log("✓ incidents.png");
  await page.close();
}

// Incident detail (click first row)
{
  const page = await goTo("http://localhost:3000");
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim() === "Incidents") {
        node.parentElement.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));
  // Click first incident row
  await page.evaluate(() => {
    const el = document.querySelector("[style*='cursor: pointer']");
    if (el) el.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, "incident-detail.png") });
  console.log("✓ incident-detail.png");
  await page.close();
}

await browser.close();
console.log("Done!");
