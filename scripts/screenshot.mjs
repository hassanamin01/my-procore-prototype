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

// 1. Dashboard
{
  const page = await goTo("http://localhost:3000");
  await page.screenshot({ path: path.join(OUT_DIR, "dashboard.png") });
  console.log("✓ dashboard.png");
  await page.close();
}

// 2. Daily Logs form
{
  const page = await goTo("http://localhost:3000");
  // Click the "Daily Logs" nav item by finding text node
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent.trim() === "Daily Logs") {
        node.parentElement.closest("[role=menuitem],[data-item]")
          ? node.parentElement.closest("[role=menuitem],[data-item]").click()
          : node.parentElement.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, "daily-logs.png") });
  console.log("✓ daily-logs.png");
  await page.close();
}

// 3. Quick Capture modal
{
  const page = await goTo("http://localhost:3000");
  // Click "Report Incident" button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const btn = btns.find(b => b.textContent.includes("Report Incident"));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, "quick-capture.png") });
  console.log("✓ quick-capture.png");
  await page.close();
}

await browser.close();
console.log("Done!");
