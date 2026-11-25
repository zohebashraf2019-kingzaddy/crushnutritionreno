/* =========================================================================
   CRUSH CUP — animated SVG drink + food stage
   CrushStage.create(el) -> { show(drink), sip(), refill(), level }
   drink = { type: 'tea'|'shake'|'coffee'|'shot'|'donut'|'waffle'|'acai'|'snack',
             layers:[top..bottom], base, swirl, sprinkles, topper, oz,
             toppings:[{id,color}], baseColor, count }
   ========================================================================= */
(function () {
  let uid = 0;
  const NS = "http://www.w3.org/2000/svg";

  function rng(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  const RAINBOW = ["#ff3b3b", "#ffd23f", "#3ed06a", "#2b6bff", "#ff5fb0", "#ffffff"];

  function cupMarkup(id) {
    // cup interior: top 34..206 @ y78, bottom 58..182 @ y322
    const interior = "M36 80 L204 80 L182 322 Q181 330 172 330 L68 330 Q59 330 58 322 Z";
    return `
    <defs>
      <clipPath id="clip-${id}"><path d="${interior}"/></clipPath>
      <linearGradient id="grad-${id}" x1="0" y1="0" x2="0" y2="1"></linearGradient>
      <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".18" stop-color="#fff" stop-opacity=".08"/>
        <stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/>
      </linearGradient>
      <linearGradient id="worm-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fb6ff"/><stop offset=".55" stop-color="#3fb6ff"/><stop offset=".56" stop-color="#7be63f"/><stop offset="1" stop-color="#7be63f"/></linearGradient>
      <clipPath id="sticker-${id}"><circle cx="120" cy="214" r="33"/></clipPath>
    </defs>
    <g class="cup-shadow"><ellipse cx="120" cy="338" rx="78" ry="9" fill="#000" opacity=".18"/></g>
    <g class="straw-back">
      <rect class="straw" x="150" y="-6" width="15" height="300" rx="7" transform="rotate(9 157 140)"/>
      <rect class="straw-fill" x="153" y="290" width="9" height="0" rx="4" transform="rotate(9 157 140)"/>
    </g>
    <g clip-path="url(#clip-${id})">
      <rect x="0" y="0" width="240" height="340" fill="#ffffff" opacity=".35"/>
      <g class="liquid">
        <g class="liquid-inner">
          <rect class="liquid-body" x="20" y="72" width="200" height="270" fill="url(#grad-${id})"/>
          <g class="swirls"></g>
          <g class="sprinkles"></g>
          <g class="ice"></g>
          <g class="bubbles"></g>
          <ellipse class="surface" cx="120" cy="74" rx="96" ry="7" fill="#fff" opacity=".28"/>
        </g>
      </g>
    </g>
    <path class="glass" d="M30 76 L210 76 L187 324 Q185 334 174 334 L66 334 Q55 334 53 324 Z" fill="url(#glass-${id})" stroke="#0b0b0f" stroke-width="3.5" stroke-linejoin="round"/>
    <g class="sticker">
      <circle cx="120" cy="214" r="37" fill="#2e47b8" stroke="#0b0b0f" stroke-width="3"/>
      <image href="assets/img/crush-logo.png" x="87" y="181" width="66" height="66" clip-path="url(#sticker-${id})"/>
    </g>
    <g class="lid">
      <path class="lid-dome" d="M30 72 Q120 8 210 72 Z" fill="#fff" fill-opacity=".35" stroke="#0b0b0f" stroke-width="3.5"/>
      <rect x="22" y="66" width="196" height="14" rx="7" fill="#fff" fill-opacity=".7" stroke="#0b0b0f" stroke-width="3.5"/>
    </g>
    <g class="topper"><path d="M150 62 C 170 40, 186 66, 204 44 S 226 30, 232 52" fill="none" stroke="url(#worm-${id})" stroke-width="13" stroke-linecap="round"/>
      <path d="M150 62 C 170 40, 186 66, 204 44 S 226 30, 232 52" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 7" opacity=".7"/></g>
    <g class="straw-front"><rect x="150" y="-6" width="15" height="74" rx="7" class="straw" transform="rotate(9 157 140)"/></g>
    <g class="plate"></g>`;
  }

  function create(el, opts = {}) {
    const id = "c" + ++uid;
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-6 -14 252 362");
    svg.setAttribute("class", "crush-stage");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Your drink");
    svg.innerHTML = cupMarkup(id);
    el.appendChild(svg);

    const $ = (s) => svg.querySelector(s);
    const grad = svg.querySelector(`#grad-${id}`);
    const liquid = $(".liquid");
    const strawFill = svg.querySelector(".straw-fill");
    let level = 1, current = null, sipping = false;

    function setLevel(l) {
      level = Math.max(0, Math.min(1, l));
      liquid.style.transform = `translateY(${(1 - level) * 252}px)`;
      svg.classList.toggle("is-empty", level < 0.04);
    }

    function setGradient(colors) {
      grad.innerHTML = "";
      const n = colors.length;
      colors.forEach((c, i) => {
        const a = document.createElementNS(NS, "stop");
        const off = n === 1 ? 0 : i / (n - 1);
        a.setAttribute("offset", Math.max(0, off * 0.9 + (i ? 0.1 : 0)).toFixed(2));
        a.setAttribute("stop-color", c);
        grad.appendChild(a);
      });
    }

    function fillIce(on, seed) {
      const g = $(".ice"); g.innerHTML = "";
      if (!on) return;
      const r = rng(seed);
      for (let i = 0; i < 7; i++) {
        const x = 50 + r() * 130, y = 84 + r() * 70, s = 22 + r() * 14;
        g.insertAdjacentHTML("beforeend", `<rect class="cube" style="animation-delay:${(r() * 2).toFixed(2)}s" x="${x}" y="${y}" width="${s}" height="${s}" rx="5" transform="rotate(${(r() * 40 - 20).toFixed(0)} ${x + s / 2} ${y + s / 2})" fill="#fff" fill-opacity=".32" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>`);
      }
    }
    function fillBubbles(on) {
      const g = $(".bubbles"); g.innerHTML = "";
      if (!on) return;
      for (let i = 0; i < 10; i++) {
        const x = 60 + Math.random() * 120, r = 2 + Math.random() * 3.5;
        g.insertAdjacentHTML("beforeend", `<circle class="bubble" style="animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(3 + Math.random() * 3).toFixed(2)}s" cx="${x}" cy="320" r="${r}" fill="#fff" opacity=".55"/>`);
      }
    }
    function fillSwirls(color, seed) {
      const g = $(".swirls"); g.innerHTML = "";
      if (!color) return;
      const r = rng(seed);
      const paths = [];
      // drizzle running down the inside of the cup walls + a lazy spiral through the middle
      [[44, 1], [196, -1]].forEach(([x0, dir]) => {
        let d = `M${x0} 76`;
        for (let y = 76; y < 330; y += 46) { const amp = 10 + r() * 14; d += ` Q ${x0 + dir * amp} ${y + 23}, ${x0 + dir * (r() * 6)} ${y + 46}`; }
        paths.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${(8 + r() * 4).toFixed(1)}" stroke-linecap="round" opacity=".9"/>`);
      });
      let d = "M70 96";
      for (let k = 0; k < 4; k++) { const y = 96 + k * 58; d += ` C ${172 + r() * 10} ${y + 6}, ${172 + r() * 10} ${y + 30}, ${120} ${y + 32} S ${64 + r() * 8} ${y + 52}, ${84} ${y + 58}`; }
      paths.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`);
      g.innerHTML = paths.join("");
    }
    function fillSprinkles(kind, seed) {
      const g = $(".sprinkles"); g.innerHTML = "";
      if (!kind) return;
      const r = rng(seed + "s");
      for (let i = 0; i < 46; i++) {
        const x = 40 + r() * 165, y = 80 + r() * 245;
        if (kind === "cookie") g.insertAdjacentHTML("beforeend", `<circle cx="${x}" cy="${y}" r="${(2 + r() * 4).toFixed(1)}" fill="#2b2421" opacity=".8"/>`);
        else g.insertAdjacentHTML("beforeend", `<rect x="${x}" y="${y}" width="9" height="3.4" rx="1.7" fill="${RAINBOW[i % RAINBOW.length]}" transform="rotate(${(r() * 180).toFixed(0)} ${x} ${y})"/>`);
      }
    }

    /* ---------------- FOOD ---------------- */
    function topColor(t, i) { return t.color === "rainbow" ? RAINBOW[i % RAINBOW.length] : t.color; }
    function scatterToppings(toppings, area, seed) {
      // area: {cx, cy, rx, ry}
      let out = "";
      toppings.forEach((t, ti) => {
        const r = rng(seed + t.id);
        const drizzle = /drizzle/.test(t.id) || t.id === "honey";
        if (drizzle) {
          let d = `M${area.cx - area.rx} ${area.cy - area.ry * 0.4}`;
          for (let k = 0; k < 6; k++) d += ` Q ${area.cx - area.rx + (k + 0.5) * (area.rx / 3)} ${area.cy + (k % 2 ? 1 : -1) * area.ry * 0.9}, ${area.cx - area.rx + (k + 1) * (area.rx / 3)} ${area.cy + (r() - 0.5) * area.ry * 0.6}`;
          out += `<path class="pop" style="animation-delay:${ti * 0.05}s" d="${d}" fill="none" stroke="${t.color}" stroke-width="5" stroke-linecap="round" opacity=".92"/>`;
          return;
        }
        for (let i = 0; i < 9; i++) {
          const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * 0.8;
          const x = area.cx + Math.cos(a) * area.rx * rad, y = area.cy + Math.sin(a) * area.ry * rad;
          const c = topColor(t, i), rot = (r() * 180).toFixed(0);
          let shape;
          if (t.id === "strawberries") shape = `<path d="M${x} ${y - 7} q 8 2 6 9 q -6 6 -12 0 q -2 -7 6 -9z" fill="${c}" stroke="#0b0b0f" stroke-width="1.2"/>`;
          else if (t.id === "banana" || t.id === "bananas") shape = `<circle cx="${x}" cy="${y}" r="6" fill="${c}" stroke="#d9c56a" stroke-width="2"/>`;
          else if (t.id === "blueberries") shape = `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`;
          else if (/sprinkles/.test(t.id)) shape = `<rect x="${x - 4}" y="${y - 1.5}" width="8" height="3" rx="1.5" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
          else shape = `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" rx="2" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
          out += `<g class="pop" style="animation-delay:${(ti * 0.05 + i * 0.02).toFixed(2)}s">${shape}</g>`;
        }
      });
      return out;
    }
    function drawFood(d) {
      const p = $(".plate");
      const tops = d.toppings || [];
      let html = "";
      if (d.type === "donut") {
        html += `<rect x="12" y="120" width="216" height="170" rx="18" fill="#fff" stroke="#0b0b0f" stroke-width="3.5"/>`;
        const pos = [[60, 165], [120, 165], [180, 165], [60, 240], [120, 240], [180, 240]];
        pos.forEach(([x, y], i) => {
          html += `<g class="pop" style="animation-delay:${i * 0.04}s"><circle cx="${x}" cy="${y}" r="30" fill="${d.baseColor}" stroke="#0b0b0f" stroke-width="3"/>`;
          html += scatterToppings(tops, { cx: x, cy: y, rx: 24, ry: 24 }, "d" + i);
          html += `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#0b0b0f" stroke-width="3"/></g>`;
        });
      } else if (d.type === "waffle") {
        html += `<ellipse cx="120" cy="215" rx="112" ry="92" fill="#fff" stroke="#0b0b0f" stroke-width="3.5"/>`;
        html += `<g class="pop"><rect x="38" y="140" width="164" height="150" rx="22" fill="${d.baseColor}" stroke="#0b0b0f" stroke-width="3.5"/>`;
        for (let i = 1; i < 5; i++) html += `<line x1="${38 + i * 32.8}" y1="146" x2="${38 + i * 32.8}" y2="284" stroke="#000" stroke-opacity=".18" stroke-width="5"/><line x1="44" y1="${140 + i * 30}" x2="196" y2="${140 + i * 30}" stroke="#000" stroke-opacity=".18" stroke-width="5"/>`;
        html += `</g>` + scatterToppings(tops, { cx: 120, cy: 215, rx: 70, ry: 62 }, "w");
      } else if (d.type === "acai") {
        const split = d.baseColor === "split";
        html += `<path d="M26 150 L214 150 L196 300 Q192 320 172 320 L68 320 Q48 320 44 300 Z" fill="#fff" fill-opacity=".5" stroke="#0b0b0f" stroke-width="3.5"/>`;
        html += split
          ? `<path class="pop" d="M32 156 L208 156 L200 228 L40 228Z" fill="#e8326e"/><path class="pop" d="M40 228 L200 228 L193 300 Q189 314 172 314 L68 314 Q51 314 47 300Z" fill="#4a1f4a"/>`
          : `<path class="pop" d="M32 156 L208 156 L193 300 Q189 314 172 314 L68 314 Q51 314 47 300Z" fill="${d.baseColor}"/>`;
        html += `<ellipse cx="120" cy="152" rx="96" ry="22" fill="${split ? "#e8326e" : d.baseColor}" stroke="#0b0b0f" stroke-width="3"/>`;
        html += scatterToppings(tops, { cx: 120, cy: 148, rx: 84, ry: 16 }, "a");
      } else if (d.type === "snack") {
        html += `<ellipse cx="120" cy="250" rx="110" ry="54" fill="#fff" stroke="#0b0b0f" stroke-width="3.5"/>`;
        const r = rng(d.id || "snack");
        for (let i = 0; i < 9; i++) {
          const x = 60 + (i % 3) * 60 + r() * 10, y = 215 + Math.floor(i / 3) * 26 + r() * 6;
          html += `<g class="pop" style="animation-delay:${i * 0.04}s"><circle cx="${x}" cy="${y}" r="19" fill="${d.baseColor}" stroke="#0b0b0f" stroke-width="3"/>`;
          if (d.id === "cake-pop-bites") for (let k = 0; k < 4; k++) html += `<rect x="${x - 10 + k * 5}" y="${y - 8 + (k % 2) * 8}" width="6" height="2.6" fill="${RAINBOW[(i + k) % 6]}" transform="rotate(${k * 40} ${x} ${y})"/>`;
          if (d.id === "cookie-dough") html += `<circle cx="${x - 5}" cy="${y - 3}" r="3" fill="#4a2a18"/><circle cx="${x + 6}" cy="${y + 4}" r="2.6" fill="#4a2a18"/>`;
          html += `</g>`;
        }
      }
      p.innerHTML = html;
    }

    function show(d) {
      current = d;
      const isFood = ["donut", "waffle", "acai", "snack"].includes(d.type);
      svg.dataset.type = d.type;
      svg.classList.toggle("is-food", isFood);
      svg.classList.toggle("has-topper", d.topper === "worm");
      if (isFood) { $(".plate").innerHTML = ""; requestAnimationFrame(() => drawFood(d)); return; }
      $(".plate").innerHTML = "";
      const seed = d.id || "x";
      if (d.type === "shake") {
        setGradient([d.base, d.base]);
        fillSwirls(d.swirl, seed); fillSprinkles(d.sprinkles, seed); fillIce(false); fillBubbles(false);
      } else {
        setGradient(d.layers || ["#ffd23f"]);
        fillSwirls(null); fillSprinkles(null); fillIce(d.type !== "shot", seed); fillBubbles(d.type === "tea");
      }
      const oz = d.oz || 24;
      const scale = d.type === "shot" ? 0.6 : oz <= 16 ? 0.84 : oz <= 24 ? 0.93 : 1;
      svg.style.setProperty("--cup-scale", scale);
      strawFill.setAttribute("fill", d.type === "shake" ? d.base : (d.layers || ["#fff"])[0]);
      if (level < 0.3) setLevel(1);
    }

    function sip() {
      if (sipping || svg.classList.contains("is-food")) return false;
      if (level < 0.04) { refill(); return "refill"; }
      sipping = true;
      svg.classList.add("is-sipping");
      strawFill.style.transition = "height .45s ease-in, y .45s ease-in";
      strawFill.setAttribute("y", "-2"); strawFill.setAttribute("height", "292");
      setTimeout(() => {
        setLevel(level - 0.17);
        strawFill.setAttribute("y", "290"); strawFill.setAttribute("height", "0");
        setTimeout(() => { sipping = false; svg.classList.remove("is-sipping"); }, 450);
      }, 480);
      return true;
    }
    function refill() { svg.classList.add("is-refill"); setLevel(1); setTimeout(() => svg.classList.remove("is-refill"), 900); }

    setLevel(opts.startEmpty ? 0 : 1);
    if (opts.startEmpty) setTimeout(() => setLevel(1), 300);
    return { show, sip, refill, svg, get level() { return level; } };
  }

  window.CrushStage = { create };
})();
