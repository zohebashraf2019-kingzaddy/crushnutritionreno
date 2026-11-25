/* =========================================================================
   CRUSH LAB — build-your-drink (and bites) with live cup, price & macros
   Deep links: build.html#shake=banana-bread | #tea=iron-man | #ptea=peach-ring
               #coffee | #bites=waffle | #acai | #extras=greens-shot
   ========================================================================= */
(function () {
  const C = window.CRUSH, money = window.crushMoney;
  const root = document.querySelector("#lab");
  if (!root) return;
  const stage = CrushStage.create(root.querySelector(".lab-cup"));
  const $ = (s) => root.querySelector(s);

  const CATS = [
    { id: "shake", label: "Protein Shakes", icon: "🥤" },
    { id: "tea", label: "Power Teas", icon: "⚡" },
    { id: "ptea", label: "Protein Teas", icon: "💪" },
    { id: "coffee", label: "Protein Coffee", icon: "☕" },
    { id: "bites", label: "Donuts & Waffles", icon: "🍩" },
    { id: "acai", label: "Açaí Bowls", icon: "🫐" },
    { id: "extras", label: "Shots & Snacks", icon: "✨" },
  ];
  const allShakes = [...C.shakeSeasonal, ...C.shakeFlavors];
  const allTeas = [...C.teaSeasonal, ...C.teaFlavors];

  const st = {
    cat: "shake", group: "All", shake: "banana-bread", shakeSize: "regular", shakeBase: "Vanilla",
    tea: "iron-man", teaLevel: "l2-24", ptea: "peach-ring", pteaLevel: "pl1-24",
    coffeeBase: "caramel-latte", coffeeFlavors: ["Salted Caramel"], bites: "donut", bakeBase: "chocolate", toppings: ["oreo", "choc-drizzle", "strawberries"], gf: false,
    acaiSize: "medium", acaiBase: "acai", acaiTops: ["strawberries", "bananas", "blueberries", "granola"], extra: "immunity-shot", temp: "Cold",
    boosts: { shake: [], tea: [], ptea: [], coffee: [] }, qty: 1,
  };

  const find = (arr, id) => arr.find((x) => x.id === id);

  /* ---------------- current selection model ---------------- */
  function model() {
    const b = (cat, list) => st.boosts[cat].map((id) => find(list, id)).filter(Boolean);
    if (st.cat === "shake") {
      const f = find(allShakes, st.shake), sz = find(C.shakeSizes, st.shakeSize);
      const boosts = b("shake", C.shakeBoosts).filter((x) => !(x.only24 && sz.oz !== 24));
      const addons = boosts.filter((x) => x.id !== "upsize").reduce((s, x) => s + x.price, 0);
      const upsize = boosts.some((x) => x.id === "upsize");
      const price = sz.price + addons + (upsize ? 1 : 0);
      const cal = sz.cal + boosts.reduce((s, x) => s + (x.cal || 0), 0), protein = sz.protein + boosts.reduce((s, x) => s + (x.protein || 0), 0);
      const caf = boosts.reduce((s, x) => s + (x.caffeine || 0), 0);
      const oz = upsize ? 32 : sz.oz;
      return {
        kind: "shake", name: f.name + (f.baseChoice ? ` (${st.shakeBase})` : ""), short: f.name, price,
        detail: [`${sz.name} ${oz}oz`, ...boosts.filter((x) => x.id !== "upsize").map((x) => "+" + x.name)].join(" · "),
        stats: [`${cal} cal`, `${protein}g protein`, caf ? `${caf}mg caffeine` : "26 vitamins & minerals", ...(f.tags || []).map((t) => (t === "GF" ? "Gluten free" : "Contains peanut"))],
        visual: { type: "shake", id: f.id, base: f.base, swirl: f.swirl, sprinkles: f.sprinkles, oz },
        combo: { type: "shake", oz: sz.oz === 16 ? 16 : 24, extra: st.shakeSize === "extra" ? 2 : st.shakeSize === "post" ? 3.5 : 0, addons: addons + (upsize ? 1 : 0) },
        note: f.note || f.notes || "",
      };
    }
    if (st.cat === "tea" || st.cat === "ptea") {
      const isP = st.cat === "ptea";
      const f = find(isP ? C.proteinTeaFlavors : allTeas, isP ? st.ptea : st.tea);
      const lv = find(isP ? C.proteinTeaLevels : C.teaLevels, isP ? st.pteaLevel : st.teaLevel);
      const boosts = b(st.cat, isP ? C.proteinTeaBoosts : C.teaBoosts);
      const addons = boosts.reduce((s, x) => s + x.price, 0);
      const caf = lv.caffeine + boosts.reduce((s, x) => s + (x.caffeine || 0), 0);
      const cal = (isP ? 70 : lv.cal) + boosts.reduce((s, x) => s + (x.cal || 0), 0);
      const protein = isP ? 15 + boosts.reduce((s, x) => s + (x.protein || 0), 0) : 0;
      const lvName = lv.level === "nocaf" ? (isP ? "Cooler" : "No Caffeine") : lv.name;
      return {
        kind: st.cat, name: `${f.name} ${isP ? "Protein Tea" : "Power Tea"}`, short: `${lvName} ${f.name}`, price: lv.price + addons,
        detail: [`${lvName} ${lv.oz}oz`, ...boosts.map((x) => "+" + x.name)].join(" · "),
        stats: [`${cal} cal`, protein ? `${protein}g protein` : "B-vitamins + aloe", caf ? `${caf}mg caffeine` : "Caffeine free", "Sugar free"],
        visual: { type: "tea", id: f.id, layers: f.layers, oz: lv.oz, topper: f.topper },
        combo: isP ? null : { type: "tea", level: lv.level, oz: lv.oz, addons },
        note: f.notes,
      };
    }
    if (st.cat === "coffee") {
      const base = find(C.coffeeBases, st.coffeeBase), boosts = b("coffee", C.coffeeBoosts);
      const caf = 80 + boosts.reduce((s, x) => s + (x.caffeine || 0), 0);
      const cal = 100 + boosts.reduce((s, x) => s + (x.cal || 0), 0), protein = 15 + boosts.reduce((s, x) => s + (x.protein || 0), 0);
      return {
        kind: "coffee", name: `Protein ${base.name}`, short: base.name, price: 7.39 + boosts.reduce((s, x) => s + x.price, 0),
        detail: [st.coffeeFlavors.length ? st.coffeeFlavors.join(" + ") : "No flavor", ...boosts.map((x) => "+" + x.name)].join(" · "),
        stats: [`${cal} cal`, `${protein}g protein`, `${caf}mg caffeine`, "0g sugar"],
        visual: { type: "coffee", id: base.id + st.coffeeFlavors.join(), layers: base.layers, oz: 24 }, note: "Iced protein coffee, sugar-free flavors",
      };
    }
    if (st.cat === "bites") {
      const isD = st.bites === "donut", base = find(C.bakeBases, st.bakeBase);
      const tops = st.toppings.map((id) => find(C.bakeToppings, id));
      const extra = Math.max(0, tops.length - 3) * 0.5;
      return {
        kind: st.bites, name: `Protein ${isD ? "Donuts" : "Waffle"} — ${base.name}`, short: isD ? "Protein Donuts" : "Protein Waffle", price: (isD ? 10.49 : 12.79) + extra,
        detail: [tops.length ? tops.map((t) => t.name).join(", ") : "No toppings", st.gf ? "Gluten-free" : ""].filter(Boolean).join(" · "),
        stats: isD ? ["250 cal", "25g protein", "13g net carbs", "3 toppings included"] : ["330 cal", "31g protein", "13g net carbs", "3 toppings included"],
        visual: { type: isD ? "donut" : "waffle", baseColor: base.color, toppings: tops, layers: [base.color, base.color] },
        note: "Macros before toppings · each extra topping $0.50",
      };
    }
    if (st.cat === "acai") {
      const sz = find(C.acaiSizes, st.acaiSize), base = find(C.acaiBases, st.acaiBase);
      const tops = st.acaiTops.map((id) => find(C.acaiToppings, id));
      return {
        kind: "acai", name: `${sz.name} ${base.name} Bowl`, short: "Açaí Bowl", price: sz.price,
        detail: tops.length ? tops.map((t) => t.name).join(", ") : "No toppings",
        stats: ["Healthy superfood", "Pair with any tea: $1.50 off"],
        visual: { type: "acai", baseColor: base.color, toppings: tops, layers: base.color === "split" ? ["#e8326e", "#4a1f4a"] : [base.color, base.color] },
        note: "Add any tea and we take $1.50 off automatically",
      };
    }
    const x = find(C.extras, st.extra);
    const hotcold = /lemonade/.test(x.id);
    return {
      kind: "extra", name: x.name, short: x.name, price: x.price, detail: hotcold ? st.temp : x.notes,
      stats: x.notes.split(" · ").slice(0, 3),
      visual: x.kind === "snack" ? { type: "snack", id: x.id, baseColor: x.color, layers: [x.color, x.color] } : { type: x.kind === "shot" ? "shot" : "tea", id: x.id, layers: [x.color, x.color], oz: 24 },
      note: x.notes,
    };
  }

  /* ---------------- rendering ---------------- */
  const chip = (act, val, label, on, extra = "") => `<button type="button" class="chip${on ? " on" : ""}" data-act="${act}" data-val="${val}" aria-pressed="${on}" ${extra}>${label}</button>`;
  const opt = (act, val, title, sub, price, on, badge) => `<button type="button" class="opt${on ? " on" : ""}" data-act="${act}" data-val="${val}" aria-pressed="${on}">${badge ? `<i class="badge">${badge}</i>` : ""}<b>${title}</b><small>${sub || ""}</small>${price != null ? `<span>${money(price)}</span>` : ""}</button>`;
  const swatchBtn = (act, f, on) => {
    const cols = f.layers || [f.base, f.swirl];
    const bg = f.layers ? `linear-gradient(180deg,${cols.join(",")})` : `radial-gradient(circle at 35% 30%, ${f.base} 0 45%, ${f.swirl} 46% 60%, ${f.base} 61%)`;
    return `<button type="button" class="flav${on ? " on" : ""}" data-act="${act}" data-val="${f.id}" aria-pressed="${on}" title="${f.notes || f.name}">
      <span class="dot" style="background:${bg}"></span><span class="fn">${f.name}</span>
      ${f.seasonal ? '<i class="tag s">NEW</i>' : f.popular ? '<i class="tag p">FAN FAV</i>' : ""}
      ${(f.tags || []).map((t) => `<i class="tag ${t === "GF" ? "gf" : "pn"}">${t === "GF" ? "GF" : "🥜"}</i>`).join("")}</button>`;
  };
  const step = (n, title, body, aside = "") => `<section class="lab-step"><header><span class="num">${n}</span><h3>${title}</h3>${aside}</header>${body}</section>`;

  function renderSteps() {
    const s = st; let html = "";
    if (s.cat === "shake") {
      const groups = ["All", C.SEASONAL_LABEL, "Fruity", "Bakery", "Peanut", "Chocolate", "Sweet Treats"];
      const list = allShakes.filter((f) => s.group === "All" || (s.group === C.SEASONAL_LABEL ? f.seasonal : f.group === s.group));
      html += step(1, "Pick your flavor", `<div class="chips groups">${groups.map((g) => chip("group", g, g, s.group === g)).join("")}</div><div class="flavs">${list.map((f) => swatchBtn("shake", f, s.shake === f.id)).join("")}</div>`);
      const f = find(allShakes, s.shake);
      if (f.baseChoice) html += step("1b", "Base", `<div class="chips">${["Vanilla", "Chocolate"].map((v) => chip("shakeBase", v, v, s.shakeBase === v)).join("")}</div>`);
      html += step(2, "Pick your protein level", `<div class="opts">${C.shakeSizes.map((z) => opt("shakeSize", z.id, z.name, z.desc, z.price, s.shakeSize === z.id, z.id === "post" ? "BEAST" : "")).join("")}</div>`);
      const sz = find(C.shakeSizes, s.shakeSize);
      html += step(3, "Boost it", `<div class="boosts">${C.shakeBoosts.filter((x) => !(x.only24 && sz.oz !== 24)).map((x) => chip("boost", x.id, `${x.name} <em>+${money(x.price)}</em>`, s.boosts.shake.includes(x.id))).join("")}</div>`, `<span class="aside">Every shake: 26 vitamins & minerals</span>`);
    } else if (s.cat === "tea") {
      const groups = ["All", C.SEASONAL_LABEL];
      const list = allTeas.filter((f) => s.group === "All" || f.seasonal);
      html += step(1, "Pick your flavor", `<div class="chips groups">${groups.map((g) => chip("group", g, g, s.group === g)).join("")}</div><div class="flavs">${list.map((f) => swatchBtn("tea", f, s.tea === f.id)).join("")}</div>`);
      html += step(2, "Pick your energy", `<div class="opts">${C.teaLevels.map((z) => opt("teaLevel", z.id, `${z.name} · ${z.oz}oz`, z.desc, z.price, s.teaLevel === z.id, z.popular ? "MOST POPULAR" : z.level === "nocaf" ? "KIDS" : "")).join("")}</div>`, `<span class="aside">All options sugar free</span>`);
      html += step(3, "Add-ons", `<div class="boosts">${C.teaBoosts.map((x) => chip("boost", x.id, `${x.name} <em>+${money(x.price)}</em>`, s.boosts.tea.includes(x.id))).join("")}</div>`);
    } else if (s.cat === "ptea") {
      html += step(1, "Pick your flavor", `<div class="flavs">${C.proteinTeaFlavors.map((f) => swatchBtn("ptea", f, s.ptea === f.id)).join("")}</div>`, `<span class="aside">70 cal · 15g protein · 0g sugar</span>`);
      html += step(2, "Pick your energy", `<div class="opts">${C.proteinTeaLevels.map((z) => opt("pteaLevel", z.id, `${z.name} · ${z.oz}oz`, z.desc, z.price, s.pteaLevel === z.id)).join("")}</div>`);
      html += step(3, "Add-ons", `<div class="boosts">${C.proteinTeaBoosts.map((x) => chip("boost", x.id, `${x.name} <em>+${money(x.price)}</em>`, s.boosts.ptea.includes(x.id))).join("")}</div>`);
    } else if (s.cat === "coffee") {
      html += step(1, "Choose your base", `<div class="opts two">${C.coffeeBases.map((z) => opt("coffeeBase", z.id, z.name, "100 cal · 15g protein · 80mg caffeine", 7.39, s.coffeeBase === z.id)).join("")}</div>`);
      html += step(2, "Choose up to 2 flavors", `<div class="chips">${C.coffeeFlavors.map((v) => chip("coffeeFlavor", v, v, s.coffeeFlavors.includes(v))).join("")}</div>`, `<span class="aside">All sugar free</span>`);
      html += step(3, "Add-ons", `<div class="boosts">${C.coffeeBoosts.map((x) => chip("boost", x.id, `${x.name} <em>+${money(x.price)}</em>`, s.boosts.coffee.includes(x.id))).join("")}</div>`);
    } else if (s.cat === "bites") {
      html += step(1, "Donuts or waffle?", `<div class="opts two">${opt("bites", "donut", "Protein Donuts", "250 cal · 25g protein", 10.49, s.bites === "donut")}${opt("bites", "waffle", "Protein Waffle", "330 cal · 31g protein", 12.79, s.bites === "waffle")}</div>`);
      html += step(2, "Choose your base", `<div class="chips">${C.bakeBases.map((v) => chip("bakeBase", v.id, `<span class="mini" style="background:${v.color}"></span>${v.name}`, s.bakeBase === v.id)).join("")}</div>${chip("gf", "1", "Make it gluten free", s.gf)}`);
      html += step(3, "Toppings", `<div class="boosts">${C.bakeToppings.map((v) => chip("topping", v.id, v.name, s.toppings.includes(v.id))).join("")}</div>`, `<span class="aside">3 included · +$0.50 each after (${s.toppings.length} picked)</span>`);
    } else if (s.cat === "acai") {
      html += step(1, "Choose your size", `<div class="opts">${C.acaiSizes.map((z) => opt("acaiSize", z.id, z.name, "", z.price, s.acaiSize === z.id)).join("")}</div>`);
      html += step(2, "Choose your base", `<div class="chips">${C.acaiBases.map((v) => chip("acaiBase", v.id, v.name, s.acaiBase === v.id)).join("")}</div>`);
      html += step(3, "Toppings", `<div class="boosts">${C.acaiToppings.map((v) => chip("acaiTop", v.id, v.name, s.acaiTops.includes(v.id))).join("")}</div>`);
    } else {
      html += step(1, "Shots, lemonades & snacks", `<div class="opts">${C.extras.map((x) => opt("extra", x.id, x.name, x.notes, x.price, s.extra === x.id)).join("")}</div>`);
      if (/lemonade/.test(s.extra)) html += step(2, "Hot or cold?", `<div class="chips">${["Cold", "Hot"].map((v) => chip("temp", v, v, s.temp === v)).join("")}</div>`);
    }
    $(".lab-steps").innerHTML = html;
  }

  function renderStage(animate) {
    const m = model();
    stage.show(m.visual);
    $(".lab-name").textContent = m.name;
    $(".lab-detail").textContent = m.detail;
    $(".lab-note").textContent = m.note || "";
    $(".lab-stats").innerHTML = m.stats.map((x) => `<li>${x}</li>`).join("");
    $(".lab-price").textContent = money(m.price * st.qty);
    $(".lab-qty span").textContent = st.qty;
    $(".lab-sip").hidden = ["bites", "acai"].includes(st.cat) || m.visual.type === "snack";
    const mb = document.querySelector(".lab-mbar");
    if (mb) { mb.querySelector("b").textContent = (st.qty > 1 ? st.qty + " × " : "") + m.name; mb.querySelector("span").textContent = money(m.price * st.qty); }
    if (animate) { const p = $(".lab-price"); p.classList.remove("flash"); void p.offsetWidth; p.classList.add("flash"); }
    const ex = $(".combo-hint");
    if (ex) ex.hidden = !(st.cat === "shake" || st.cat === "tea" || st.cat === "acai");
  }

  function renderTabs() {
    $(".lab-tabs").innerHTML = CATS.map((c) => `<button type="button" role="tab" class="tab${st.cat === c.id ? " on" : ""}" aria-selected="${st.cat === c.id}" data-act="cat" data-val="${c.id}"><span>${c.icon}</span>${c.label}</button>`).join("");
  }
  function render(animate) { renderTabs(); renderSteps(); renderStage(animate); }

  /* ---------------- interactions ---------------- */
  const toggle = (arr, v, max) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else { if (max && arr.length >= max) arr.shift(); arr.push(v); } };
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const { act, val } = b.dataset;
    switch (act) {
      case "cat": st.cat = val; st.group = "All"; history.replaceState(null, "", "#" + val); break;
      case "group": st.group = val; break;
      case "shake": st.shake = val; break;
      case "tea": st.tea = val; break;
      case "ptea": st.ptea = val; break;
      case "boost": toggle(st.boosts[st.cat], val); break;
      case "coffeeFlavor": toggle(st.coffeeFlavors, val, 2); break;
      case "topping": toggle(st.toppings, val); break;
      case "acaiTop": toggle(st.acaiTops, val); break;
      case "gf": st.gf = !st.gf; break;
      default: st[act] = val;
    }
    render(true);
  });
  $(".lab-sip").addEventListener("click", () => {
    const r = stage.sip();
    if (r === "refill") crushToast("Refilled. Good thing it's just a Crush 💙");
    else if (r && stage.level < 0.2) crushToast("Last sip! Tap again to refill.");
  });
  root.querySelectorAll(".lab-qty button").forEach((b) => b.addEventListener("click", () => { st.qty = Math.max(1, Math.min(20, st.qty + +b.dataset.d)); renderStage(); }));
  $(".lab-surprise").addEventListener("click", () => {
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    st.cat = pick(["shake", "tea", "shake", "tea", "ptea"]); st.group = "All";
    st.shake = pick(allShakes).id; st.tea = pick(allTeas).id; st.ptea = pick(C.proteinTeaFlavors).id;
    st.shakeSize = pick(C.shakeSizes).id; st.teaLevel = pick(C.teaLevels).id;
    render(true); crushToast("🎲 The Crush gods have spoken.");
  });
  $(".lab-add").addEventListener("click", () => {
    const m = model(), forName = ($(".lab-for").value || "").trim().slice(0, 30);
    const sig = JSON.stringify([m.kind, m.name, m.detail]);
    crushBag.add({ sig, kind: m.kind, name: m.name, short: m.short, detail: m.detail, price: Math.round(m.price * 100) / 100, qty: st.qty, forName, visual: m.visual, combo: m.combo });
    crushToast(`Added ${st.qty} × ${m.short} to your order`);
    stage.refill(); st.qty = 1; $(".lab-for").value = ""; renderStage();
  });

  /* ---------------- mobile sticky add bar ---------------- */
  const mbar = document.querySelector(".lab-mbar");
  if (mbar) {
    mbar.querySelector(".btn").addEventListener("click", () => $(".lab-add").click());
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => mbar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0)).observe($(".lab-add"));
  }

  /* ---------------- deep link ---------------- */
  function fromHash() {
    const h = decodeURIComponent(location.hash.slice(1)); if (!h) return;
    const [cat, id] = h.split("=");
    if (!CATS.some((c) => c.id === cat)) return;
    st.cat = cat;
    if (id) {
      if (cat === "shake" && find(allShakes, id)) st.shake = id;
      if (cat === "tea" && find(allTeas, id)) st.tea = id;
      if (cat === "ptea" && find(C.proteinTeaFlavors, id)) st.ptea = id;
      if (cat === "bites" && (id === "donut" || id === "waffle")) st.bites = id;
      if (cat === "extras" && find(C.extras, id)) st.extra = id;
    }
  }
  fromHash();
  window.addEventListener("hashchange", () => { fromHash(); render(true); });
  render();
})();
