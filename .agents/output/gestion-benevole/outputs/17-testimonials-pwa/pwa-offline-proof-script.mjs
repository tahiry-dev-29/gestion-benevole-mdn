import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = "http://localhost:3108";
const EXE = "/home/tahiry/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome";
const PROFILE = "/tmp/pwa-profile-08";
const OUT = "/tmp/pwa-proof-08";
fs.mkdirSync(OUT, { recursive: true });
const phase = process.argv[2] ?? "warm";

const result = { base: BASE, phase, steps: [], ok: true };
const step = (name, ok, detail) => {
  result.steps.push({ name, ok, detail });
  if (!ok) result.ok = false;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

const context = await chromium.launchPersistentContext(PROFILE, {
  executablePath: EXE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = context.pages()[0] ?? (await context.newPage());
  const paths = ["/temoignages", "/activites", "/partages"];

  if (phase === "warm") {
    for (const p of paths) await page.goto(BASE + p, { waitUntil: "networkidle" });
    for (const p of paths) await page.goto(BASE + p, { waitUntil: "networkidle" });
    await page.evaluate(async () => navigator.serviceWorker.ready);
    for (const p of paths) await page.goto(BASE + p, { waitUntil: "networkidle" });
    const sw = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return { active: !!reg.active, controller: !!navigator.serviceWorker.controller };
    });
    step("SW active + controller", sw.active && sw.controller, JSON.stringify(sw));
    const cached = await page.evaluate(async () => {
      const c = await caches.open("public-pages");
      return (await c.keys()).map((k) => new URL(k.url).pathname);
    });
    step("public-pages warmed", paths.every((p) => cached.includes(p)), JSON.stringify(cached));
    const pre = await page.evaluate(async () => {
      const names = await caches.keys();
      const pc = names.find((n) => n.includes("precache"));
      const c = await caches.open(pc);
      const keys = (await c.keys()).map((k) => k.url);
      return { hasOffline: keys.some((k) => k.includes("~offline")) };
    });
    step("precache contains /~offline", pre.hasOffline, JSON.stringify(pre));
  } else {
    // server is stopped: true offline
    const r1 = await page.goto(BASE + "/temoignages", { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => ({ err: String(e).split("\n")[0] }));
    const url1 = page.url();
    const h1 = await page.locator("h1").first().textContent().catch(() => "");
    step("server-stopped reload /temoignages from cache", (h1 ?? "").includes("Témoignages"), `h1=${(h1 ?? "").trim().slice(0, 40)} url=${url1} err=${r1?.err ?? "none"}`);
    await page.screenshot({ path: `${OUT}/offline-temoignages.png` });

    const r2 = await page.goto(`${BASE}/route-jamais-vue-xyz`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => ({ err: String(e).split("\n")[0] }));
    const body = await page.textContent("main,body").catch(() => "");
    step("server-stopped uncached route shows fallback", (body ?? "").includes("hors connexion"), `${(body ?? "").trim().slice(0, 90)} err=${r2?.err ?? "none"}`);
    await page.screenshot({ path: `${OUT}/offline-fallback.png` });
  }
  await context.close();
} finally {
  // persistent context closed above; ensure browser closed
  await context.browser()?.close().catch(() => {});
}
fs.writeFileSync(`${OUT}/result-${phase}.json`, JSON.stringify(result, null, 2));
console.log(`\nOVERALL ${phase}: ${result.ok ? "PASS" : "FAIL"}`);
process.exit(result.ok ? 0 : 1);
