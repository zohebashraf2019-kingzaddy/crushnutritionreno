/* =========================================================================
   MENU PAGE + HOME PAGE renderers (data-driven from data.js)
   ========================================================================= */
(function () {
  const C = window.CRUSH, money = window.crushMoney;
  const $ = (s, r = document) => r.querySelector(s);

  const miniCup = (f) => {
    const bg = f.layers ? `linear-gradient(180deg,${f.layers.join(",")})`
      : `repeating-linear-gradient(100deg, ${f.base} 0 14px, ${f.swirl} 14px 19px, ${f.base} 19px 30px)`;
    return `<span class="mcup" aria-hidden="true"><span style="background:${bg}"></span></span>`;
  };
  const tags = (f) => [
    f.seasonal ? '<i class="tag s">NEW</i>' : "",
    f.popular ? '<i class="tag p">FAN FAV</i>' : "",
    ...(f.tags || []).map((t) => (t === "GF" ? '<i class="tag gf">GF</i>' : '<i class="tag pn">🥜 peanut</i>')),
  ].join("");
  const card = (f, cat) => `
    <a class="fcard" href="build.html#${cat}=${f.id}" data-search="${(f.name + " " + (f.notes || f.group || "")).toLowerCase()}" data-gf="${(f.tags || []).includes("GF")}" data-peanut="${(f.tags || []).includes("PEANUT")}" data-seasonal="${!!f.seasonal}">
      ${miniCup(f)}<span class="fbody"><b>${f.name}</b><small>${f.notes || f.note || f.group}</small><span class="ftags">${tags(f)}</span></span><span class="go" aria-hidden="true">Build →</span>
    </a>`;

  /* ================= MENU PAGE ================= */
  const menu = $("#menu-app");
  if (menu) {
    const shakeGroups = ["Fruity", "Bakery", "Peanut", "Chocolate", "Sweet Treats"];
    const sizeList = (rows) => `<ul class="price-list">${rows.map((r) => `<li><span><b>${r[0]}</b>${r[1] ? `<small>${r[1]}</small>` : ""}</span><span>${r[2]}</span></li>`).join("")}</ul>`;
    const boostList = (b) => `<ul class="addons">${b.map((x) => `<li><span>${x.name}</span><span>+${money(x.price)}</span></li>`).join("")}</ul>`;

    $("#m-seasonal").innerHTML = `
      <div class="flavor-grid">${C.teaSeasonal.map((f) => card(f, "tea")).join("")}${C.shakeSeasonal.map((f) => card(f, "shake")).join("")}</div>`;
    $("#m-shakes").innerHTML = shakeGroups.map((g) => `
      <div class="fgroup"><h4>${g}</h4><div class="flavor-grid">${C.shakeFlavors.filter((f) => f.group === g).map((f) => card(f, "shake")).join("")}</div></div>`).join("");
    $("#m-shake-prices").innerHTML = sizeList(C.shakeSizes.map((z) => [z.name + ` (${z.oz} oz)`, z.desc.split(" · ").slice(1).join(" · "), money(z.price)])) + `<h5>Boost your shake</h5>` + boostList(C.shakeBoosts);
    $("#m-teas").innerHTML = `<div class="flavor-grid">${C.teaFlavors.map((f) => card(f, "tea")).join("")}</div>`;
    $("#m-tea-prices").innerHTML = sizeList([
      ["No Caffeine (kid friendly)", "16 oz / 24 oz", "$3.65 / $4.59"],
      ["Level 1", "15 cal · 85mg caffeine · B-vitamins + aloe", "$7.37 / $8.26"],
      ["Level 2 · most popular", "20 cal · 170mg caffeine · herbal blend", "$8.28 / $9.18"],
    ]) + `<p class="fine">Level 1 & 2 priced 24 oz / 32 oz. All options sugar free.</p><h5>Add-ons</h5>` + boostList(C.teaBoosts);
    $("#m-ptea").innerHTML = `<div class="flavor-grid">${C.proteinTeaFlavors.map((f) => card(f, "ptea")).join("")}</div>`;
    $("#m-ptea-prices").innerHTML = sizeList([
      ["Caffeine-Free Protein Cooler", "aloe + sugar-free flavors", "$7.09 / $7.95"],
      ["Level 1", "85mg caffeine", "$10.49 / $11.38"],
      ["Level 2", "170mg caffeine", "$11.99 / $12.88"],
    ]) + `<p class="fine">24 oz / 32 oz · 70 cal, 15g protein, 0g sugar.</p><h5>Add-ons</h5>` + boostList(C.proteinTeaBoosts);

    // filters
    const q = $("#m-search"), chips = document.querySelectorAll("[data-filter]");
    const active = new Set();
    function apply() {
      const term = (q.value || "").trim().toLowerCase();
      let shown = 0;
      document.querySelectorAll("#menu-app .fcard").forEach((c) => {
        let ok = !term || c.dataset.search.includes(term);
        if (active.has("gf") && c.dataset.gf !== "true") ok = false;
        if (active.has("nopeanut") && c.dataset.peanut === "true") ok = false;
        if (active.has("seasonal") && c.dataset.seasonal !== "true") ok = false;
        c.hidden = !ok; if (ok) shown++;
      });
      document.querySelectorAll("#menu-app .fgroup").forEach((g) => (g.hidden = !g.querySelector(".fcard:not([hidden])")));
      $("#m-count").textContent = term || active.size ? `${shown} drinks match` : "";
    }
    q.addEventListener("input", apply);
    chips.forEach((c) => c.addEventListener("click", () => { const f = c.dataset.filter; active.has(f) ? active.delete(f) : active.add(f); c.classList.toggle("on"); c.setAttribute("aria-pressed", active.has(f)); apply(); }));

    // section nav highlight
    const links = document.querySelectorAll(".menu-jump a");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
      document.querySelectorAll(".menu-sec").forEach((s) => io.observe(s));
    }
  }

  /* ================= HOME ================= */
  const hero = $(".hero-cup");
  if (hero) {
    const stage = CrushStage.create(hero, { startEmpty: true });
    const reel = [
      ...C.teaSeasonal.slice(0, 1).map((f) => ({ ...f, type: "tea", oz: 24, cat: "tea" })),
      { ...C.shakeFlavors.find((f) => f.id === "wc-raspberry-cheesecake"), type: "shake", oz: 24, cat: "shake" },
      { ...C.teaFlavors.find((f) => f.id === "iron-man"), type: "tea", oz: 32, cat: "tea" },
      { ...C.shakeFlavors.find((f) => f.id === "peanut-butter-cup"), type: "shake", oz: 24, cat: "shake" },
      { ...C.teaSeasonal.find((f) => f.id === "sour-gummy-worm"), type: "tea", oz: 24, cat: "tea" },
      { ...C.shakeFlavors.find((f) => f.id === "fruity-pebbles"), type: "shake", oz: 24, cat: "shake" },
      { ...C.teaFlavors.find((f) => f.id === "taste-the-rainbow"), type: "tea", oz: 32, cat: "tea" },
      { ...C.shakeSeasonal.find((f) => f.id === "toasted-marshmallow"), type: "shake", oz: 24, cat: "shake" },
    ];
    let i = 0, timer;
    const label = $(".hero-cup-label");
    function showAt(n) {
      i = (n + reel.length) % reel.length; const d = reel[i];
      stage.show(d);
      if (label) label.innerHTML = `<b>${d.name}</b><span>${d.cat === "tea" ? "Power Tea" : "Protein Shake"}</span><a href="build.html#${d.cat}=${d.id}">Build this →</a>`;
    }
    const auto = () => { clearInterval(timer); timer = setInterval(() => showAt(i + 1), 3600); };
    showAt(0); auto();
    hero.addEventListener("click", () => { stage.sip(); auto(); });
    document.querySelectorAll("[data-hero-nav]").forEach((b) => b.addEventListener("click", () => { showAt(i + +b.dataset.heroNav); auto(); }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(timer);
  }
  const spec = $("#home-specials");
  if (spec) spec.innerHTML = [...C.teaSeasonal.slice(0, 4).map((f) => card(f, "tea")), ...C.shakeSeasonal.map((f) => card(f, "shake"))].join("");
  const mq = document.querySelectorAll(".marquee-track");
  if (mq.length) {
    const names = [...C.teaFlavors, ...C.shakeFlavors].map((f) => f.name);
    mq.forEach((t, k) => { const list = (k ? names.slice().reverse() : names).map((n) => `<span>${n}</span><i>✦</i>`).join(""); t.innerHTML = list + list; });
  }
})();
