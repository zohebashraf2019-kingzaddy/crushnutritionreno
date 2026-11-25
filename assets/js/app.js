/* =========================================================================
   CRUSH — shared site behaviour: nav, hours/open status, order bag
   (cart + automatic combo savings), toasts, reveal, contact form.
   ========================================================================= */
(function () {
  const C = window.CRUSH;
  const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);
  window.crushMoney = money;
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- toast ---------------- */
  let toastTimer;
  window.crushToast = function (msg) {
    let t = qs(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* ---------------- nav ---------------- */
  const navBtn = qs(".nav-toggle");
  if (navBtn) navBtn.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navBtn.setAttribute("aria-expanded", open);
  });
  qsa(".site-nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
  const header = qs(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------------- hours ---------------- */
  const H = C.hours;
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmtH = (h) => { const hh = Math.floor(h), m = Math.round((h - hh) * 60); const ap = hh >= 12 ? "pm" : "am"; const x = hh % 12 || 12; return x + (m ? ":" + String(m).padStart(2, "0") : "") + ap; };
  const span = (s) => (s ? `${fmtH(s[0])} – ${fmtH(s[1])}` : "Closed");
  function renoNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" }).formatToParts(new Date());
    const g = (t) => parts.find((p) => p.type === t).value;
    const ymd = `${g("year")}-${g("month")}-${g("day")}`;
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    return { ymd, dow, hour: (parseInt(g("hour"), 10) % 24) + parseInt(g("minute"), 10) / 60 };
  }
  function addDays(ymd, n) { const d = new Date(ymd + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function dayInfo(ymd, dow) { const sp = H.special[ymd]; return sp ? { span: sp.span, label: sp.label, special: true } : { span: H.regular[dow], special: false }; }
  function status() {
    const now = renoNow(); const today = dayInfo(now.ymd, now.dow);
    if (today.span && now.hour >= today.span[0] && now.hour < today.span[1]) {
      const left = today.span[1] - now.hour;
      return { open: true, text: left <= 0.75 ? `Open · closing soon (${fmtH(today.span[1])})` : `Open now · until ${fmtH(today.span[1])}` };
    }
    for (let i = 0; i < 8; i++) {
      const ymd = addDays(now.ymd, i), dow = (now.dow + i) % 7, info = dayInfo(ymd, dow);
      if (!info.span) continue;
      if (i === 0 && now.hour >= info.span[0]) continue;
      const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[dow];
      return { open: false, text: `Closed · opens ${when} ${fmtH(info.span[0])}` };
    }
    return { open: false, text: "Closed" };
  }
  function renderHours() {
    const st = status();
    qsa("[data-status]").forEach((el) => { el.textContent = st.text; el.classList.toggle("is-open", st.open); el.classList.toggle("is-closed", !st.open); });
    const now = renoNow();
    qsa("[data-hours]").forEach((el) => {
      // show the next 7 days starting Monday of this week for a stable look
      const rows = [];
      for (let i = 0; i < 7; i++) {
        const dow = (i + 1) % 7; // Mon..Sun
        const delta = (dow - now.dow + 7) % 7; const ymd = addDays(now.ymd, delta);
        const info = dayInfo(ymd, dow), isToday = delta === 0;
        rows.push(`<li class="${isToday ? "today" : ""}${info.special ? " special" : ""}"><span>${DAYS[dow]}${isToday ? ' <em>today</em>' : ""}</span><span>${span(info.span)}${info.special ? `<small>${info.label}</small>` : ""}</span></li>`);
      }
      el.innerHTML = rows.join("");
    });
    qsa("[data-regular-hours]").forEach((el) => {
      el.innerHTML = `<li><span>Mon – Fri</span><span>7am – 4pm</span></li><li><span>Saturday</span><span>8am – 2pm</span></li><li><span>Sunday</span><span>Closed</span></li>`;
    });
    const bar = qs(".announce");
    if (bar) { if (H.announcement && now.ymd <= H.announcement.until) { qs(".announce-text", bar).textContent = H.announcement.text; bar.hidden = false; } else bar.hidden = true; }
  }
  renderHours(); setInterval(renderHours, 60000);

  /* ---------------- info binding ---------------- */
  qsa("[data-ig]").forEach((a) => { a.href = C.info.instagram; a.target = "_blank"; a.rel = "noopener"; });
  qsa("[data-jobs]").forEach((a) => { a.href = C.info.jobsForm; a.target = "_blank"; a.rel = "noopener"; });
  qsa("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));

  /* ---------------- reveal on scroll ---------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    qsa(".reveal").forEach((el) => io.observe(el));
  } else qsa(".reveal").forEach((el) => el.classList.add("in"));

  /* =====================================================================
     ORDER BAG
     ===================================================================== */
  const KEY = "crush-bag-v1";
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { bag = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} };

  function comboSavings(items) {
    const teas = [], shakes = [], bowls = [], anyTeas = [];
    items.forEach((it) => {
      for (let q = 0; q < it.qty; q++) {
        if (it.combo && it.combo.type === "tea") teas.push(it);
        if (it.combo && it.combo.type === "shake") shakes.push(it);
        if (it.kind === "acai") bowls.push(it);
      }
    });
    const lines = []; let total = 0;
    const usedT = new Set(), usedS = new Set();
    const pairs = [];
    teas.forEach((t, ti) => shakes.forEach((s, si) => {
      const tc = t.combo, sc = s.combo;
      let price = C.comboTable[tc.level][sc.oz];
      if (tc.level === "nocaf" && tc.oz === 24) price += 1;
      if (tc.oz === 32) price += 1;
      price += tc.addons + sc.extra + sc.addons;
      const save = t.price + s.price - price;
      if (save > 0.009) pairs.push({ ti, si, save, t, s });
    }));
    pairs.sort((a, b) => b.save - a.save);
    pairs.forEach((p) => {
      if (usedT.has(p.ti) || usedS.has(p.si)) return;
      usedT.add(p.ti); usedS.add(p.si); total += p.save;
      lines.push({ label: `Combo: ${p.t.short} + ${p.s.short}`, amount: p.save });
    });
    // bowl + tea: $1.50 off each pair (teas not already in a combo)
    items.forEach((it) => { if (it.kind === "tea" || it.kind === "ptea") for (let q = 0; q < it.qty; q++) anyTeas.push(it); });
    let freeTeas = anyTeas.length - usedT.size;
    bowls.forEach((b) => { if (freeTeas > 0) { freeTeas--; total += 1.5; lines.push({ label: `Bowl + tea combo`, amount: 1.5 }); } });
    return { lines, total };
  }

  function totals() {
    const sub = bag.reduce((s, it) => s + it.price * it.qty, 0);
    const combos = comboSavings(bag);
    return { sub, combos, total: Math.max(0, sub - combos.total), count: bag.reduce((s, it) => s + it.qty, 0) };
  }

  function swatch(it) {
    const v = it.visual || {};
    const cols = v.layers || [v.base || "#eee", v.swirl || v.base || "#ddd"];
    return `<span class="bag-swatch" style="background:linear-gradient(180deg,${cols.join(",")})"></span>`;
  }

  function renderBag() {
    const t = totals();
    qsa("[data-bag-count]").forEach((e) => { e.textContent = t.count; e.hidden = !t.count; });
    const list = qs(".bag-items"); if (!list) return;
    if (!bag.length) {
      list.innerHTML = `<div class="bag-empty"><p class="big">Your cup is empty.</p><p>Build a shake, power tea or protein waffle in the Crush Lab and it lands here.</p><a class="btn btn-yellow" href="build.html">Open the Crush Lab</a></div>`;
    } else {
      list.innerHTML = bag.map((it, i) => `
        <div class="bag-item">
          ${swatch(it)}
          <div class="bag-info"><strong>${it.name}</strong><span>${it.detail}</span>${it.forName ? `<span class="for">for ${escapeHtml(it.forName)}</span>` : ""}</div>
          <div class="bag-right"><span class="price">${money(it.price * it.qty)}</span>
            <div class="qty"><button aria-label="Fewer" data-q="-1" data-i="${i}">−</button><span>${it.qty}</span><button aria-label="More" data-q="1" data-i="${i}">+</button></div></div>
        </div>`).join("");
    }
    const sum = qs(".bag-summary");
    if (sum) sum.innerHTML = bag.length ? `
      <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      ${t.combos.lines.map((l) => `<div class="row save"><span>${l.label}</span><span>−${money(l.amount)}</span></div>`).join("")}
      <div class="row total"><span>Estimated total</span><span>${money(t.total)}</span></div>
      <p class="fine">Combo savings are applied automatically. Tax not included; final price confirmed at the counter.</p>` : "";
    const actions = qs(".bag-actions"); if (actions) actions.hidden = !bag.length;
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function orderText() {
    const t = totals();
    const lines = bag.map((it) => `• ${it.qty} × ${it.name} — ${it.detail}${it.forName ? ` (for ${it.forName})` : ""} — ${money(it.price * it.qty)}`);
    t.combos.lines.forEach((l) => lines.push(`  ${l.label}: −${money(l.amount)}`));
    return `CRUSH order\n${lines.join("\n")}\nEstimated total: ${money(t.total)}`;
  }

  window.crushBag = {
    add(item) {
      const same = bag.find((b) => b.sig === item.sig && (b.forName || "") === (item.forName || ""));
      if (same) same.qty += item.qty || 1; else bag.push({ ...item, qty: item.qty || 1 });
      save(); renderBag();
      qsa(".bag-btn").forEach((b) => { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); });
    },
    open() { document.body.classList.add("bag-open"); },
    totals, orderText,
  };

  document.addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]");
    if (q) { const i = +q.dataset.i; bag[i].qty += +q.dataset.q; if (bag[i].qty <= 0) bag.splice(i, 1); save(); renderBag(); return; }
    if (e.target.closest(".bag-btn")) { document.body.classList.add("bag-open"); return; }
    if (e.target.closest("[data-bag-close]")) { document.body.classList.remove("bag-open"); return; }
    if (e.target.closest("[data-bag-clear]")) { bag = []; save(); renderBag(); return; }
    if (e.target.closest("[data-bag-copy]")) {
      const txt = orderText();
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => crushToast("Order copied — paste it anywhere or read it off when you call."), () => { window.prompt("Copy your order:", txt); });
    }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("bag-open", "nav-open", "lightbox-open"); });
  renderBag();

  /* ---------------- contact form ---------------- */
  const form = qs("#contact-form");
  if (form) form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("button[type=submit]", form), out = qs(".form-status", form);
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) { out.textContent = "Please add your name, email and a message."; out.className = "form-status err"; return; }
    btn.disabled = true; btn.textContent = "Sending…"; out.textContent = "";
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "send failed");
      form.reset(); out.textContent = "Got it! The Crush crew will get back to you soon. 💛"; out.className = "form-status ok";
    } catch (err) {
      out.innerHTML = `That didn't go through. Please call or text us at <a href="tel:${C.info.tel}">${C.info.phone}</a>.`; out.className = "form-status err";
    } finally { btn.disabled = false; btn.textContent = "Send message"; }
  });

  /* ---------------- lightbox (menu boards) ---------------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-lightbox]");
    if (!a) return;
    e.preventDefault();
    let lb = qs(".lightbox");
    if (!lb) {
      lb = document.createElement("div"); lb.className = "lightbox"; lb.innerHTML = `<button class="lb-close" aria-label="Close">×</button><img alt="">`;
      lb.addEventListener("click", (ev) => { if (ev.target === lb || ev.target.closest(".lb-close")) document.body.classList.remove("lightbox-open"); });
      document.body.appendChild(lb);
    }
    const img = qs("img", lb); img.src = a.getAttribute("href"); img.alt = a.dataset.lightbox || "Menu board";
    document.body.classList.add("lightbox-open");
  });

  /* ---------------- reels: tap to play with sound ---------------- */
  qsa(".reel").forEach((r) => {
    const v = qs("video", r);
    r.addEventListener("click", () => {
      qsa(".reel video").forEach((o) => { if (o !== v) { o.pause(); o.closest(".reel").classList.remove("playing"); } });
      if (v.paused) { v.muted = false; v.play(); r.classList.add("playing"); } else { v.pause(); r.classList.remove("playing"); }
    });
    v.addEventListener("ended", () => r.classList.remove("playing"));
  });
})();
