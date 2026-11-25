/* =========================================================================
   GALLERY — masonry grid, filters, and a swipeable lightbox
   Grid:   <div data-gallery="full"></div>   Teaser: <div data-gallery="teaser"></div>
   ========================================================================= */
(function () {
  const G = (window.CRUSH && window.CRUSH.gallery) || [];
  const LABEL = { shakes: "Shakes", teas: "Power Teas", combos: "Combos", shop: "The Shop" };
  const path = (p, sm) => `assets/img/gallery/${p.src}${sm ? "-sm" : ""}.jpg`;
  let list = G.slice(), idx = 0, box;

  function tile(p, i, cls = "") {
    return `<button type="button" class="g-tile ${cls}" data-g="${i}" data-cat="${p.cat}" style="--ar:${p.w}/${p.h}" aria-label="Open photo: ${p.title}">
      <img src="${path(p, true)}" alt="${p.title}" loading="lazy" width="${p.w}" height="${p.h}">
      <span class="g-meta"><i>${LABEL[p.cat]}</i><b>${p.title}</b></span></button>`;
  }

  function lightbox() {
    if (box) return box;
    box = document.createElement("div");
    box.className = "g-box"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML = `<button class="g-x" type="button" aria-label="Close">×</button>
      <button class="g-nav prev" type="button" aria-label="Previous photo">←</button>
      <figure><img alt=""><figcaption><i></i><b></b><span class="g-count"></span></figcaption></figure>
      <button class="g-nav next" type="button" aria-label="Next photo">→</button>
      <div class="g-thumbs"></div>`;
    document.body.appendChild(box);
    box.addEventListener("click", (e) => {
      if (e.target === box || e.target.closest(".g-x")) return close();
      if (e.target.closest(".prev")) return go(-1);
      if (e.target.closest(".next")) return go(1);
      const t = e.target.closest("[data-t]"); if (t) show(+t.dataset.t);
    });
    let sx = null;
    box.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1); sx = null; });
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("g-open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1);
    });
    return box;
  }
  function show(i) {
    idx = (i + list.length) % list.length; const p = list[idx];
    const img = box.querySelector("figure img");
    img.classList.remove("in"); img.onload = () => img.classList.add("in");
    img.src = path(p); img.alt = p.title;
    box.querySelector("figcaption i").textContent = LABEL[p.cat];
    box.querySelector("figcaption b").textContent = p.title;
    box.querySelector(".g-count").textContent = `${idx + 1} / ${list.length}`;
    box.querySelectorAll("[data-t]").forEach((t) => t.classList.toggle("on", +t.dataset.t === idx));
    const on = box.querySelector("[data-t].on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
  function open(arr, i) {
    list = arr; lightbox();
    box.querySelector(".g-thumbs").innerHTML = list.map((p, k) => `<button type="button" data-t="${k}" aria-label="${p.title}"><img src="${path(p, true)}" alt=""></button>`).join("");
    document.body.classList.add("g-open"); show(i); box.querySelector(".g-x").focus();
  }
  function close() { document.body.classList.remove("g-open"); }
  function go(d) { show(idx + d); }

  /* full gallery page */
  const full = document.querySelector('[data-gallery="full"]');
  if (full) {
    let cur = G.slice();
    const render = () => { full.innerHTML = cur.map((p, i) => tile(p, i)).join(""); };
    render();
    full.addEventListener("click", (e) => { const t = e.target.closest("[data-g]"); if (t) open(cur, +t.dataset.g); });
    document.querySelectorAll("[data-gfilter]").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll("[data-gfilter]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
      const f = b.dataset.gfilter;
      full.classList.add("swap");
      setTimeout(() => { cur = f === "all" ? G.slice() : G.filter((p) => p.cat === f); render(); full.classList.remove("swap"); }, 220);
    }));
    document.querySelectorAll("[data-gcount]").forEach((el) => {
      const f = el.dataset.gcount; el.textContent = f === "all" ? G.length : G.filter((p) => p.cat === f).length;
    });
  }

  /* home teaser (bento) */
  const teaser = document.querySelector('[data-gallery="teaser"]');
  if (teaser) {
    const picks = G.filter((p) => p.feature).slice(0, 6);
    teaser.innerHTML = picks.map((p, i) => tile(p, i, "b" + i)).join("");
    teaser.addEventListener("click", (e) => { const t = e.target.closest("[data-g]"); if (t) open(G, G.indexOf(picks[+t.dataset.g])); });
  }
})();
