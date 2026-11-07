import fs from "node:fs/promises";

const BASE = "http://localhost:3000";
const CDP = "http://127.0.0.1:9222";
const OUT = "qa";
await fs.mkdir(OUT, { recursive: true });

const summary = {};
const errors = [];

async function log(label, err) {
  errors.push({ label, error: String(err) });
  console.error(`[FAIL] ${label}:`, String(err));
}

async function newTarget(url) {
  const response = await fetch(`${CDP}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  if (!response.ok) throw new Error(`new target failed ${response.status}`);
  return response.json();
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 0;
    const pending = new Map();
    const cdpErrors = [];

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const entry = pending.get(message.id);
        if (!entry) return;
        pending.delete(message.id);
        if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
        else entry.resolve(message.result);
        return;
      }
      if (message.method === "Runtime.exceptionThrown") {
        cdpErrors.push(message.params.exceptionDetails?.exception?.description ?? "exception");
      }
      if (
        message.method === "Log.entryAdded" &&
        (message.params.entry.level === "error" || message.params.entry.level === "warning")
      ) {
        cdpErrors.push(`${message.params.entry.level}: ${message.params.entry.text}`);
      }
    });

    ws.addEventListener("error", reject);
    ws.addEventListener("open", () => {
      const send = (method, params = {}) =>
        new Promise((res, rej) => {
          const id = ++nextId;
          pending.set(id, { resolve: res, reject: rej });
          ws.send(JSON.stringify({ id, method, params }));
        });
      resolve({ ws, send, cdpErrors });
    });
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openPage(width = 1440, height = 900, mobile = false) {
  const target = await newTarget("about:blank");
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
  if (mobile) await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
  return { target, cdp };
}

async function navigate(page, path) {
  const loaded = page.cdp.waitEvent
    ? page.cdp.waitEvent("Page.loadEventFired")
    : new Promise((res) => setTimeout(res, 100));
  await page.cdp.send("Page.navigate", { url: BASE + path });
  if (loaded.then) await loaded;
  await sleep(1500);
}

async function evaluate(page, expression) {
  const result = await page.cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "evaluate failed");
  }
  return result.result.value;
}

async function screenshot(page, name) {
  const { data } = await page.cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fs.writeFile(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
}

async function scrollTo(page, selector, offset = -90) {
  await evaluate(
    page,
    `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + ${offset});
      return true;
    })()`
  );
  await sleep(900);
}

async function waitFor(page, expression, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      if (await evaluate(page, expression)) return true;
    } catch {}
    await sleep(200);
  }
  return false;
}

function selStr(s) {
  return JSON.stringify(s);
}

async function clickText(page, selector, text) {
  return evaluate(
    page,
    `(() => {
      const nodes = [...document.querySelectorAll(${selStr(selector)})];
      const el = nodes.find((node) => node.textContent.replace(/\\s+/g, " ").trim().includes(${selStr(text)}));
      if (!el) return { ok: false, count: nodes.length };
      el.scrollIntoView({ block: "center" });
      el.click();
      return { ok: true, text: el.textContent.replace(/\\s+/g, " ").trim().slice(0, 80) };
    })()`
  );
}

async function fill(page, selector, value) {
  return evaluate(
    page,
    `(() => {
      const el = document.querySelector(${selStr(selector)});
      if (!el) return false;
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, ${selStr(value)});
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el.value;
    })()`
  );
}

async function runPage(label, fn) {
  try {
    await fn();
    console.log(`[OK] ${label}`);
  } catch (e) {
    await log(label, e);
  }
}

// ---------- Home desktop ----------
await runPage("home-desktop", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/");
  summary.home = await evaluate(
    page,
    `(() => ({
      h1: document.querySelector("h1")?.textContent.replace(/\\s+/g," ").trim(),
      video: [...document.querySelectorAll("video")].map(v => ({paused:v.paused, ready:v.readyState, w:v.videoWidth, h:v.videoHeight})),
      canvas: [...document.querySelectorAll("canvas")].map(c => ({w:c.width,h:c.height})),
      overflow: document.documentElement.scrollWidth - innerWidth,
      height: document.body.scrollHeight
    }))()`
  );
  await screenshot(page, "01-home-hero-desktop");
  summary.homeErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

// ---------- Home configurator ----------
await runPage("home-configurator", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/");
  await scrollTo(page, "#configurator");
  await sleep(2500);
  summary.configurator = await evaluate(
    page,
    `(() => ({
      heading: document.querySelector("#configurator h2")?.textContent.replace(/\\s+/g," ").trim(),
      canvas: [...document.querySelectorAll("#configurator canvas")].map(c => ({w:c.width,h:c.height})),
      buttons: [...document.querySelectorAll("#configurator button")].map(b => b.textContent.replace(/\\s+/g," ").trim()).filter(Boolean).slice(0,40)
    }))()`
  );
  await screenshot(page, "02-home-configurator");
  await clickText(page, "#configurator button", "Gloss");
  await sleep(900);
  await screenshot(page, "03-home-configurator-toggle");
  page.cdp.ws.close();
});

// ---------- Home estimator + before/after ----------
await runPage("home-estimator-beforeafter", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/");
  await scrollTo(page, "#estimator");
  summary.estimator = await evaluate(
    page,
    `(() => ({
      heading: document.querySelector("#estimator h2")?.textContent.replace(/\\s+/g," ").trim(),
      priceMatches: document.querySelector("#estimator")?.textContent.match(/\\$[\\d,]+/g)?.slice(0,8)
    }))()`
  );
  await screenshot(page, "04-home-estimator");
  const beforeAfter = await evaluate(
    page,
    `(() => {
      const el = [...document.querySelectorAll("section")].find(s => s.textContent.includes("Inspection Light"));
      if (!el) return null;
      el.scrollIntoView({block:"center"});
      return {heading: el.querySelector("h2")?.textContent.replace(/\\s+/g," ").trim()};
    })()`
  );
  await sleep(1000);
  summary.beforeAfter = beforeAfter;
  await screenshot(page, "05-home-before-after");
  page.cdp.ws.close();
});

// ---------- Metrics overflow fix ----------
await runPage("metrics-no-overflow", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/");
  await scrollTo(page, "section");
  const metrics = await evaluate(
    page,
    `(() => {
      const el = [...document.querySelectorAll("section")].find(s => s.textContent.includes("Vehicles protected"));
      if (!el) return null;
      const rects = [...el.querySelectorAll("span[class*='clamp'], span[class*='leading-none']")].map(s => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return { w: Math.round(r.width), x: Math.round(r.left), right: Math.round(r.right), fw: cs.fontSize, overflow: r.right > innerWidth };
      });
      const viewportRight = innerWidth;
      const anyOverflow = rects.some(r => r.overflow);
      return { rects, anyOverflow, viewportRight };
    })()`
  );
  summary.metrics = metrics;
  await screenshot(page, "06-home-metrics");
  page.cdp.ws.close();
});

// ---------- Mobile home + menu ----------
await runPage("mobile-home-menu", async () => {
  const page = await openPage(390, 844, true);
  await navigate(page, "/");
  await screenshot(page, "07-home-mobile-hero");
  await evaluate(page, `(() => { const b=document.querySelector('button[aria-label="Open navigation menu"]'); b?.click(); return !!b; })()`);
  await sleep(1200);
  summary.mobileMenu = await evaluate(
    page,
    `(() => {
      const dialog=document.querySelector('[role="dialog"]');
      return {
        open: !!dialog,
        overflow: getComputedStyle(document.body).overflow,
        links: [...(dialog?.querySelectorAll("a") ?? [])].map(a=>a.textContent.replace(/\\s+/g," ").trim()).slice(0,12),
        widthOverflow: document.documentElement.scrollWidth - innerWidth
      };
    })()`
  );
  await screenshot(page, "08-home-mobile-menu");
  summary.mobileErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

// ---------- Services + deposit modal ----------
await runPage("services-deposit", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/services");
  await scrollTo(page, "#icon-rocklear");
  await screenshot(page, "09-services-accordion");
  await clickText(page, "#icon-rocklear button", "Reserve with $100 deposit");
  await sleep(900);
  const open = await evaluate(page, `!!document.querySelector('[role="dialog"]')`);
  summary.servicesModal = { opened: true, open };
  if (open) {
    await fill(page, 'input[name="name"]', "QA Test Client");
    await fill(page, 'input[name="email"]', "qa@example.com");
    await fill(page, 'input[name="phone"]', "(248) 555-0134");
    await evaluate(page, `(() => { const s=document.querySelector('select'); if(s){s.value='delemere'; s.dispatchEvent(new Event('change',{bubbles:true}));} })()`);
    await clickText(page, 'button[type="submit"]', "Reserve with $100");
    await sleep(1800);
    summary.servicesModal.result = await evaluate(
      page,
      `(() => { const d=document.querySelector('[role="dialog"]'); return d ? d.textContent.replace(/\\s+/g," ").trim().slice(0,400) : null; })()`
    );
    await screenshot(page, "10-services-deposit-success");
  }
  summary.servicesErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

// ---------- Locations toggle ----------
await runPage("locations-toggle", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/locations");
  await sleep(800);
  await clickText(page, "button", "Delemere Studio");
  await sleep(1200);
  summary.locations = await evaluate(
    page,
    `(() => ({
      selected: [...document.querySelectorAll('button[aria-pressed="true"]')].map(b=>b.textContent.replace(/\\s+/g," ").trim()),
      addresses: document.querySelector("main")?.textContent.replace(/\\s+/g," ").match(/901 W 11 Mile Rd|4325 Delemere Blvd/g)
    }))()`
  );
  await screenshot(page, "11-locations-delemere");
  summary.locationsErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

// ---------- Booking flow ----------
await runPage("booking-flow", async () => {
  const page = await openPage(1440, 900);
  await navigate(page, "/book");
  await sleep(1000);
  await clickText(page, "button", "XPEL PPF");
  await clickText(page, "button", "Exotic / Sports");
  await clickText(page, "button", "Wheels-off coating");
  await clickText(page, "button", "Delemere Studio");
  await clickText(page, "button", "Continue");
  const reachedTime = await waitFor(page, `document.body.textContent.includes("Choose a drop-off slot.")`);
  await sleep(700);

  const dateInfo = await evaluate(
    page,
    `(() => {
      const buttons=[...document.querySelectorAll("button[aria-label]")].filter(b=>/(January|February|March|April|May|June|July|August|September|October|November|December) \\d{1,2}, \\d{4}/.test(b.getAttribute("aria-label")||""));
      const enabled=buttons.filter(b=>!b.disabled);
      if(!enabled.length) return {found:false, total:buttons.length};
      const target=enabled[Math.min(2,enabled.length-1)];
      target.click();
      return {found:true, label:target.getAttribute("aria-label"), enabled:enabled.length, total:buttons.length};
    })()`
  );
  const gotSlots = await waitFor(
    page,
    `[...document.querySelectorAll("button")].some(b=>/^\\d{1,2}:\\d{2} (AM|PM)$/.test(b.textContent.trim()))`
  );
  const slots = await evaluate(
    page,
    `(() => {
      const buttons=[...document.querySelectorAll("button")].filter(b=>/^\\d{1,2}:\\d{2} (AM|PM)$/.test(b.textContent.trim()));
      const available=buttons.filter(b=>!b.disabled);
      if(available.length) available[0].click();
      return {count:buttons.length, picked:available[0]?.textContent.trim() ?? null};
    })()`
  );
  await sleep(700);
  await clickText(page, "button", "Continue");
  const reachedDetails = await waitFor(
    page,
    `document.body.textContent.includes("Who is dropping off the car?")`
  );
  await sleep(700);

  await fill(page, 'input[autocomplete="name"]', "QA Test Client");
  await fill(page, 'input[type="email"]', "qa@example.com");
  await fill(page, 'input[type="tel"]', "(248) 555-0134");
  await fill(page, 'input[type="number"]', "2024");
  const textInputs = await evaluate(
    page,
    `(() => [...document.querySelectorAll('input[type="text"]')].map(i=>({ph:i.placeholder, ac:i.autocomplete})))()`
  );
  const makeIndex = textInputs.findIndex((i) => i.ph === "Porsche");
  const modelIndex = textInputs.findIndex((i) => i.ph === "911 Turbo S");
  await evaluate(
    page,
    `(() => {
      const inputs=[...document.querySelectorAll('input[type="text"]')];
      const set=(el,val)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,val);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));};
      if(inputs[${makeIndex}]) set(inputs[${makeIndex}], "Ferrari");
      if(inputs[${modelIndex}]) set(inputs[${modelIndex}], "458 Italia");
      return {makeIndex, modelIndex, count:inputs.length};
    })()`
  );
  await sleep(500);
  await clickText(page, "button", "Continue");
  const reachedDeposit = await waitFor(
    page,
    `document.body.textContent.includes("Hold the bay with $100.")`
  );
  await sleep(700);

  const continueState = await evaluate(
    page,
    `(() => { const b=[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="Continue to secure deposit"); return {disabled:b?.disabled}; })()`
  );
  await clickText(page, "button", "Continue to secure deposit");
  await sleep(2500);

  summary.booking = {
    reachedTime, dateInfo, gotSlots, slots, reachedDetails, reachedDeposit, continueState,
    resultUrl: await evaluate(page, `location.href`),
    result: await evaluate(
      page,
      `(() => ({
        h1: document.querySelector("h1")?.textContent.replace(/\\s+/g," ").trim(),
        text: document.querySelector("main")?.textContent.replace(/\\s+/g," ").slice(0,900)
      }))()`
    )
  };
  await screenshot(page, "12-booking-success");
  summary.bookingErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

// ---------- Legal pages ----------
await runPage("legal-pages", async () => {
  const page = await openPage(1440, 900);
  for (const [name, path] of [["privacy","/privacy"], ["terms","/terms"]]) {
    await navigate(page, path);
    const data = await evaluate(
      page,
      `(() => ({
        h1: document.querySelector("h1")?.textContent.replace(/\\s+/g," ").trim(),
        sections: document.querySelectorAll("h2").length,
        overflow: document.documentElement.scrollWidth - innerWidth,
        hasContact: document.body.textContent.includes("motorcityautospa@live.com")
      }))()`
    );
    summary[name] = data;
    await screenshot(page, `${name === "privacy" ? "13-privacy" : "14-terms"}`);
  }
  summary.legalErrors = page.cdp.cdpErrors;
  page.cdp.ws.close();
});

summary.errors = errors;
await fs.writeFile(`${OUT}/summary.json`, JSON.stringify(summary, null, 2));
console.log("\n=== QA SUMMARY ===");
console.log(JSON.stringify(summary, null, 2));
