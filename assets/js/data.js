/* =========================================================================
   CRUSH NUTRITION — MENU DATA
   Single source of truth for the Menu page AND the Crush Lab builder.
   To update monthly specials, edit SEASONAL below (flavors + label).
   Colors drive the animated cup: `layers` go TOP -> BOTTOM.
   ========================================================================= */
window.CRUSH = (function () {
  const SEASONAL_LABEL = "November Specials";

  /* ---------- POWER TEAS (sugar-free energy) ---------- */
  const teaFlavors = [
    { id: "aloha-sunset", name: "Aloha Sunset", notes: "Orange, Peach, Raspberry", layers: ["#ff6a3d", "#ff9a3c", "#ffb347"] },
    { id: "bahama-mama", name: "Bahama Mama", notes: "Watermelon, Pineapple, Coconut, Tropical Fruit", layers: ["#ffd84a", "#ff8a5b", "#e5354f"] },
    { id: "berry-crush", name: "Berry Crush", notes: "Blackberry, Strawberry Kiwi, Pomegranate, Grape", layers: ["#ff9cb6", "#d12f55", "#4a1230"] },
    { id: "cherry-nerds", name: "Cherry Nerds", notes: "Cherry, Blue Raspberry, Pomegranate", layers: ["#5a5fd6", "#8e2a6d", "#d1213c"] },
    { id: "cucumber-lime", name: "Cucumber Lime", notes: "Cucumber, Watermelon, Lemon-Lime", layers: ["#ff4b4b", "#ffb347", "#d7e84a"] },
    { id: "huckleberry", name: "Huckleberry", notes: "Strawberry, Huckleberry, Pomegranate", layers: ["#ff8fa8", "#b8245a", "#3c0d2a"] },
    { id: "hulk-smash", name: "Hulk Smash", notes: "Green Apple, Grape, Lemon-Lime", layers: ["#8fe33a", "#4c8a2b", "#2a1640"] },
    { id: "iron-man", name: "Iron Man", notes: "Mango, Strawberry, Orange", layers: ["#e8262f", "#ff5a2c", "#ff9a1f"], popular: true },
    { id: "island-breeze", name: "Island Breeze", notes: "Tropical Fruit, Mango, Peach, Blue Raspberry", layers: ["#38a8ff", "#a7c7a0", "#ff9a3c"] },
    { id: "jolly-rancher", name: "Jolly Rancher", notes: "Green Apple, Watermelon, Rainbow Candy", layers: ["#ff3d4f", "#c9a23b", "#3fc94b"] },
    { id: "lemon-lagoon", name: "Lemon Lagoon", notes: "Blue Blast, Strawberry, Pink Lemonade, Lemon-Lime", layers: ["#1f4fd6", "#e8263f", "#ffe14a"] },
    { id: "margarita", name: "Margarita", notes: "Cucumber Lime, Margarita, Lemon-Lime", layers: ["#f4f7b0", "#eef27a", "#e3ec5a"] },
    { id: "orange-crush", name: "Orange Crush", notes: "Orange, Melon, Pineapple", layers: ["#ff8a1f", "#ff6a1a", "#ff4f1a"] },
    { id: "otter-pop", name: "Otter Pop", notes: "Green Apple, Blue Blast, Lime", layers: ["#2aa8ff", "#36c3d8", "#3fd35a"] },
    { id: "peachy-peach", name: "Peachy Peach", notes: "Peach, Mandarin, Tropical Fruit", layers: ["#ffd6a1", "#ffb06b", "#ff8c3a"], popular: true },
    { id: "shirley-temple", name: "Shirley Temple", notes: "Cherry, Strawberry, Pomegranate", layers: ["#ff4157", "#e5213a", "#b5122b"] },
    { id: "spiderman", name: "Spiderman", notes: "Blue Blast, Cherry, Rainbow Candy, Pomegranate", layers: ["#1d4fe0", "#6b2a8a", "#e0202e"] },
    { id: "strawberry-blast", name: "Strawberry Blast", notes: "Strawberry, Pomegranate", layers: ["#ff3b4e", "#e8263f", "#c51432"] },
    { id: "taste-the-rainbow", name: "Taste the Rainbow", notes: "Blue Blast, Pineapple, Mango, Rainbow Candy", layers: ["#ff3b3b", "#ffd23f", "#3ed06a", "#2b6bff"] },
    { id: "tropicolada", name: "Tropicolada", notes: "Tropical, Piña Colada, Pineapple, Coconut", layers: ["#fff1b8", "#ffd56b", "#ffb347"] },
  ];
  const teaSeasonal = [
    { id: "blueberry-bliss", name: "Blueberry Bliss", notes: "Blueberry, Pineapple, Mango, Lemon-Lime", layers: ["#4b5fe0", "#8a7fd6", "#ffc94a"], seasonal: true },
    { id: "passion-fruit", name: "Passion Fruit", notes: "Passion Fruit, Peach, Tropical Fruit", layers: ["#ffb13d", "#ff8a3d", "#ff5f6d"], seasonal: true },
    { id: "caramel-candy-apple", name: "Caramel Candy Apple", notes: "Green Apple, Caramel, Lemon-Lime", layers: ["#c98a2e", "#a8c93a", "#6fd13f"], seasonal: true },
    { id: "fall-harvest", name: "Fall Harvest", notes: "Orange, Cherry, Chai, Cranberry, Grape", layers: ["#ff8a2a", "#c2412f", "#6b1f3a"], seasonal: true },
    { id: "sour-gummy-worm", name: "Sour Gummy Worm", notes: "Blue-to-green sour candy tea, topped with a gummy worm", layers: ["#35b6ff", "#3fd6c9", "#6ee83a"], seasonal: true, topper: "worm" },
  ];

  /* ---------- PROTEIN SHAKES ---------- */
  // base = shake body, swirl = drizzle/lava color
  const S = (id, name, group, base, swirl, tags = [], extra = {}) => ({ id, name, group, base, swirl, tags, ...extra });
  const shakeFlavors = [
    S("dole-whip", "Dole Whip", "Fruity", "#fff3a8", "#ffe14a", ["GF"]),
    S("fruity-pebbles", "Fruity Pebbles", "Fruity", "#ffd1dc", "#ff4058", ["GF"], { sprinkles: true }),
    S("pina-colada", "Piña Colada", "Fruity", "#fffbe0", "#ffe46b", ["GF"], { note: "Add strawberry to make it a Lava Flow" }),
    S("strawberry-banana", "Strawberry Banana", "Fruity", "#ffe9ec", "#ff4058", ["GF"]),
    S("strawberry-cheesecake", "Strawberry Cheesecake", "Fruity", "#fff4f2", "#ff6b7f", []),
    S("apple-pie-brulee", "Apple Pie Brûlée", "Bakery", "#f8e6c4", "#d79b4a", ["GF"]),
    S("banana-bread", "Banana Bread", "Bakery", "#f3e2c2", "#b98552", ["GF"], { popular: true }),
    S("blueberry-muffin", "Blueberry Muffin", "Bakery", "#f7ecf2", "#d43a5c", []),
    S("lemon-pound-cake", "Lemon Pound Cake", "Bakery", "#fff8d9", "#f2dc6b", []),
    S("wc-raspberry-cheesecake", "White Chocolate Raspberry Cheesecake", "Bakery", "#fff1f3", "#e8264a", ["GF"], { popular: true }),
    S("snickers", "Snickers", "Peanut", "#d9b98f", "#4a2a18", ["PEANUT"]),
    S("peanut-butter-cookie", "Peanut Butter Cookie", "Peanut", "#efd8b4", "#a8743e", ["PEANUT"]),
    S("banana-peanut-butter", "Banana Peanut Butter", "Peanut", "#f1dfb6", "#b07a3c", ["GF", "PEANUT"], { baseChoice: true }),
    S("payday", "Payday", "Peanut", "#ecd5a8", "#9b6a34", ["GF", "PEANUT"]),
    S("peanut-butter-cup", "Peanut Butter Cup", "Peanut", "#c89a72", "#3b2014", ["PEANUT"], { baseChoice: true, popular: true }),
    S("dutch-chocolate-brownie", "Dutch Chocolate Brownie", "Chocolate", "#a77b5c", "#3a1f12", []),
    S("chocolate-caramel-cheesecake", "Chocolate Caramel Cheesecake", "Chocolate", "#c9a383", "#3d2214", []),
    S("cookies-and-cream", "Cookies & Cream", "Chocolate", "#ece7e2", "#2b2421", [], { sprinkles: "cookie" }),
    S("java-chip", "Java Chip", "Chocolate", "#cfae8d", "#3a2316", []),
    S("mint-chip", "Mint Chip", "Chocolate", "#eef4ec", "#2a1d18", []),
    S("banana-split", "Banana Split", "Sweet Treats", "#ffe4e4", "#e5213a", []),
    S("cinnamon-toast-crunch", "Cinnamon Toast Crunch", "Sweet Treats", "#f2dfbf", "#c4884a", ["GF"]),
    S("funfetti", "Funfetti", "Sweet Treats", "#fffaf0", "#ffffff", ["GF"], { sprinkles: true }),
    S("salted-caramel-cookie-dough", "Salted Caramel Cookie Dough", "Sweet Treats", "#ead2ad", "#6a3d1f", []),
    S("salted-caramel-latte", "Salted Caramel Latte", "Sweet Treats", "#e8d3b3", "#b98552", ["GF"]),
  ];
  const shakeSeasonal = [
    S("white-choc-mocha", "White Choc Mocha", "Seasonal", "#e9d8c2", "#6b4430", [], { seasonal: true, notes: "Café Latte, Chocolate, White Chocolate" }),
    S("apple-toffee-crunch", "Apple Toffee Crunch", "Seasonal", "#f1ddb5", "#b8742e", [], { seasonal: true, notes: "Apple Pie, Dulce de Leche, Toffee" }),
    S("pb-pumpkin-cookie", "PB Pumpkin Cookie", "Seasonal", "#f0c48f", "#3b2618", ["PEANUT"], { seasonal: true, notes: "Peanut Butter, Pumpkin, Cookies n Cream" }),
    S("toasted-marshmallow", "Toasted Marshmallow", "Seasonal", "#fbf3e6", "#a8703a", [], { seasonal: true, notes: "Pralines, Vanilla, S'mores, Marshmallow" }),
  ];

  /* ---------- PROTEIN TEAS ---------- */
  const proteinTeaFlavors = [
    { id: "ranch-water", name: "Ranch Water", notes: "Peach Mango, Cucumber Lime, Margarita, Watermelon", layers: ["#ffb25b", "#ffa15a", "#ff8a4a"] },
    { id: "pt-cherry-nerds", name: "Cherry Nerds", notes: "Wild Berry, Cherry, Raspberry, Blue Raspberry, Blue Blast", layers: ["#3b6bff", "#7a3ab8", "#e0203a"] },
    { id: "tropical-coconut", name: "Tropical Coconut", notes: "Peach Mango, Piña Colada, Coconut, Pineapple", layers: ["#ffe27a", "#ffd24a", "#ffbf3a"] },
    { id: "fruit-punch", name: "Fruit Punch", notes: "Wild Berry, Cherry Limeade, Fruit Punch, Lime", layers: ["#ff6a5b", "#d12f3d", "#7a1230"] },
    { id: "peach-ring", name: "Peach Ring", notes: "Peach Mango, White Grape, Peach", layers: ["#ffc06b", "#ffab4a", "#ff9a3a"] },
  ];

  /* ---------- PROTEIN COFFEE ---------- */
  const coffeeBases = [
    { id: "mocha-latte", name: "Mocha Latte", layers: ["#b48a6a", "#8a5d3f", "#6b4430"] },
    { id: "caramel-latte", name: "Caramel Latte", layers: ["#d8b48a", "#bf9364", "#a87a4c"] },
  ];
  const coffeeFlavors = ["Peppermint", "Salted Caramel", "White Chocolate", "Toffee", "Hazelnut", "Butter Rum"];

  /* ---------- SIZES / LEVELS ---------- */
  const shakeSizes = [
    { id: "small", name: "Small / Kids", oz: 16, price: 6.47, cal: 100, protein: 12, carbs: 8, desc: "16 oz · 100 cal · 12g protein" },
    { id: "regular", name: "Regular", oz: 24, price: 8.49, cal: 170, protein: 17, carbs: 13, desc: "24 oz · 170 cal · 17g protein" },
    { id: "extra", name: "Extra Protein", oz: 24, price: 10.12, cal: 210, protein: 24, carbs: 16, desc: "24 oz · 210 cal · 24g protein" },
    { id: "post", name: "Post Workout", oz: 24, price: 12.0, cal: 300, protein: 33, carbs: 27, desc: "24 oz · 300 cal · 33g protein · whey + casein + BCAAs + L-glutamine" },
  ];
  const teaLevels = [
    { id: "nocaf16", level: "nocaf", name: "No Caffeine", oz: 16, price: 3.65, cal: 5, caffeine: 0, desc: "Kid friendly · 16 oz" },
    { id: "nocaf24", level: "nocaf", name: "No Caffeine", oz: 24, price: 4.59, cal: 5, caffeine: 0, desc: "Kid friendly · 24 oz" },
    { id: "l1-24", level: "l1", name: "Level 1", oz: 24, price: 7.37, cal: 15, caffeine: 85, desc: "85mg caffeine · B-vitamins + aloe" },
    { id: "l1-32", level: "l1", name: "Level 1", oz: 32, price: 8.26, cal: 15, caffeine: 85, desc: "85mg caffeine · 32 oz" },
    { id: "l2-24", level: "l2", name: "Level 2", oz: 24, price: 8.28, cal: 20, caffeine: 170, desc: "170mg caffeine · herbal blend · most popular", popular: true },
    { id: "l2-32", level: "l2", name: "Level 2", oz: 32, price: 9.18, cal: 20, caffeine: 170, desc: "170mg caffeine · 32 oz" },
  ];
  const proteinTeaLevels = [
    { id: "cooler24", level: "nocaf", name: "Caffeine-Free Cooler", oz: 24, price: 7.09, caffeine: 0, desc: "Aloe + sugar-free flavors" },
    { id: "cooler32", level: "nocaf", name: "Caffeine-Free Cooler", oz: 32, price: 7.95, caffeine: 0, desc: "32 oz" },
    { id: "pl1-24", level: "l1", name: "Level 1", oz: 24, price: 10.49, caffeine: 85, desc: "85mg caffeine" },
    { id: "pl1-32", level: "l1", name: "Level 1", oz: 32, price: 11.38, caffeine: 85, desc: "85mg caffeine · 32 oz" },
    { id: "pl2-24", level: "l2", name: "Level 2", oz: 24, price: 11.99, caffeine: 170, desc: "170mg caffeine" },
    { id: "pl2-32", level: "l2", name: "Level 2", oz: 32, price: 12.88, caffeine: 170, desc: "170mg caffeine · 32 oz" },
  ];

  /* ---------- ADD-ONS ---------- */
  const shakeBoosts = [
    { id: "upsize", name: "Upgrade 24 → 32 oz", price: 1.0, only24: true },
    { id: "fiber", name: "Fiber (5g)", price: 2.0 },
    { id: "probiotic", name: "Probiotic", price: 1.5 },
    { id: "creatine", name: "Creatine (5g)", price: 2.0 },
    { id: "extra-pb", name: "Extra PB", price: 0.75, cal: 60, protein: 6 },
    { id: "collagen", name: "Collagen", price: 3.0 },
    { id: "coffee", name: "Coffee shot", price: 1.0, caffeine: 85 },
    { id: "donut-hole", name: "Donut Hole Shot (fat reducer)", price: 5.0 },
  ];
  const teaBoosts = [
    { id: "collagen", name: "Collagen", price: 3.0 },
    { id: "probiotic", name: "Probiotic", price: 1.5 },
    { id: "extra-energy", name: "Extra Energy (+40mg)", price: 1.5, caffeine: 40 },
    { id: "immune", name: "Immune Booster", price: 2.0 },
    { id: "electrolyte", name: "Electrolyte Booster", price: 2.5 },
  ];
  const proteinTeaBoosts = [{ id: "extra-protein", name: "Extra Protein (+7.5g)", price: 2.0, cal: 35, protein: 7.5 }, ...teaBoosts];
  const coffeeBoosts = [
    { id: "extra-coffee", name: "Extra Coffee (+85mg)", price: 1.0, caffeine: 85 },
    { id: "collagen", name: "Collagen", price: 3.0 },
    { id: "extra-protein-coffee", name: "Extra Protein Coffee", price: 2.5, cal: 50, protein: 7.5, caffeine: 40 },
    { id: "extra-protein-vc", name: "Extra Protein Vanilla or Chocolate", price: 2.0, cal: 55, protein: 7 },
    { id: "fat-burner", name: "Fat Burner", price: 5.0 },
  ];

  /* ---------- FOOD ---------- */
  const bakeBases = [
    { id: "vanilla", name: "Vanilla", color: "#f3d9a4" },
    { id: "cookies-cream", name: "Cookies & Cream", color: "#d9d2cb" },
    { id: "chocolate", name: "Chocolate", color: "#6b4030" },
    { id: "banana", name: "Banana", color: "#f2dc8a" },
    { id: "caramel", name: "Caramel", color: "#c98d4a" },
    { id: "berry", name: "Berry", color: "#d46a8a" },
  ];
  const bakeToppings = [
    { id: "strawberries", name: "Strawberries", color: "#e8263f" },
    { id: "banana", name: "Banana", color: "#fff0a8" },
    { id: "pb-drizzle", name: "Peanut Butter Drizzle", color: "#c58a4a" },
    { id: "oreo", name: "Oreo", color: "#2b2421" },
    { id: "heath", name: "Heath Bar", color: "#b8742e" },
    { id: "choc-drizzle", name: "Chocolate Drizzle", color: "#3a1f12" },
    { id: "wc-drizzle", name: "White Chocolate Drizzle", color: "#fffaf0" },
    { id: "caramel-drizzle", name: "Caramel Drizzle", color: "#d08a2e" },
    { id: "choc-chips", name: "Chocolate Chips", color: "#4a2a18" },
    { id: "pb-chips", name: "Peanut Butter Chips", color: "#d9a35a" },
    { id: "butterfinger", name: "Butterfinger Pieces", color: "#f2a23a" },
    { id: "rainbow", name: "Rainbow Sprinkles", color: "rainbow" },
    { id: "choc-sprinkles", name: "Chocolate Sprinkles", color: "#3a1f12" },
  ];
  const acaiSizes = [
    { id: "small", name: "Small", price: 9.59 },
    { id: "medium", name: "Medium", price: 11.49 },
    { id: "large", name: "Large", price: 13.95 },
  ];
  const acaiBases = [
    { id: "acai", name: "Açaí", color: "#4a1f4a" },
    { id: "pitaya", name: "Pitaya (Dragonfruit)", color: "#e8326e" },
    { id: "both", name: "Both", color: "split" },
  ];
  const acaiToppings = [
    { id: "strawberries", name: "Strawberries", color: "#e8263f" },
    { id: "bananas", name: "Bananas", color: "#fff0a8" },
    { id: "blueberries", name: "Blueberries", color: "#2b3a8a" },
    { id: "granola", name: "Granola", color: "#c4884a" },
    { id: "choc-chips", name: "Chocolate Chips", color: "#4a2a18" },
    { id: "honey", name: "Honey or Agave", color: "#f2b43a" },
  ];
  const extras = [
    { id: "immunity-shot", name: "Immunity Shot", price: 4.5, notes: "Vitamin C & D, Echinacea, Epicor, Zinc", kind: "shot", color: "#ff9a1f" },
    { id: "greens-shot", name: "Super Greens Shot", price: 4.0, notes: "40 cal · spirulina, chlorella, moringa, wheatgrass, turmeric, ashwagandha", kind: "shot", color: "#4c8a2b" },
    { id: "immunity-lemonade-cf", name: "Immunity Lemonade — Caffeine Free", price: 7.37, notes: "Vitamin C & D, Echinacea, Epicor, Zinc + Aloe · hot or cold", kind: "drink", color: "#ffe46b" },
    { id: "immunity-lemonade-caf", name: "Immunity Lemonade — Caffeinated", price: 8.69, notes: "85mg caffeine + immunity blend · hot or cold", kind: "drink", color: "#ffd23f" },
    { id: "cake-pop-bites", name: "Cake Pop Bites", price: 3.29, notes: "50 cal · 5g protein", kind: "snack", color: "#ffd1dc" },
    { id: "cookie-dough", name: "Protein Cookie Dough", price: 8.0, notes: "150 cal · 21g protein", kind: "snack", color: "#e8c99a" },
    { id: "protein-balls", name: "Protein Balls", price: 8.0, notes: "100 cal · 5g protein per ball · contains peanut", kind: "snack", color: "#a8743e" },
  ];

  /* ---------- COMBOS (tea + shake) ---------- */
  // price[teaLevel][shakeOz]; nocaf combos start at 16oz tea (+$1 for 24oz)
  const comboTable = { nocaf: { 16: 8.39, 24: 10.14 }, l1: { 16: 12.25, 24: 13.78 }, l2: { 16: 13.39, 24: 14.49 } };

  /* ---------- HOURS ---------- */
  const hours = {
    regular: { 0: null, 1: [7, 16], 2: [7, 16], 3: [7, 16], 4: [7, 16], 5: [7, 16], 6: [8, 14] },
    special: {
      "2026-11-25": { span: [7, 15], label: "Thanksgiving Eve" },
      "2026-11-26": { span: null, label: "Closed for Thanksgiving" },
      "2026-11-27": { span: [8, 14], label: "Black Friday" },
      "2026-11-28": { span: [8, 14], label: "Small Business Saturday — giveaways & raffles" },
    },
    announcement: { until: "2026-11-28", text: "Thanksgiving week: Wed 7–3 · Closed Thu · Fri & Sat 8–2 · Giveaways & raffles on Small Business Saturday 🦃" },
  };

  const info = {
    phone: "775-357-9477",
    tel: "+17753579477",
    address: "175 Damonte Ranch Pkwy, Ste D",
    city: "Reno, NV 89521",
    area: "South Towne Crossing · South Reno",
    instagram: "https://www.instagram.com/crushnutritionreno/",
    handle: "@crushnutritionreno",
    yelp: "https://www.yelp.com/biz/crush-reno-2",
    google: "https://www.google.com/maps/search/?api=1&query=Crush+Nutrition+175+Damonte+Ranch+Pkwy+Ste+D+Reno+NV+89521",
    directions: "https://www.google.com/maps/dir/?api=1&destination=175+Damonte+Ranch+Pkwy+Ste+D,+Reno,+NV+89521",
    jobsForm: "https://docs.google.com/forms/d/e/1FAIpQLSfRoXdL4UNmVH7GYn82eWWjLypj91_J0ozeu9Fd8pwMNCrjxg/viewform",
  };

  return {
    SEASONAL_LABEL, teaFlavors, teaSeasonal, shakeFlavors, shakeSeasonal, proteinTeaFlavors, coffeeBases, coffeeFlavors,
    shakeSizes, teaLevels, proteinTeaLevels, shakeBoosts, teaBoosts, proteinTeaBoosts, coffeeBoosts,
    bakeBases, bakeToppings, acaiSizes, acaiBases, acaiToppings, extras, comboTable, hours, info,
  };
})();

/* ---------- GALLERY ----------
   Add a photo: drop name.jpg + name-sm.jpg (≈640px wide) into assets/img/gallery/
   and add a line here. cat: shakes | teas | combos | shop. w/h = original pixels. */
window.CRUSH.gallery = [
  { src: "elvis-shake-neon", cat: "shakes", title: "The Elvis under the neon", w: 750, h: 1000, feature: true },
  { src: "crew-drinks", cat: "shop", title: "Peachy Peach Pineapple, a strawberry swirl & a fresh tea", w: 1000, h: 750, feature: true },
  { src: "layered-power-tea", cat: "teas", title: "Sunset-layered power tea", w: 750, h: 1000, feature: true },
  { src: "caramel-shake-blue-tea", cat: "combos", title: "Caramel drizzle shake + a deep blue power tea", w: 750, h: 1000, feature: true },
  { src: "inside-crush", cat: "shop", title: "Pull up a stool at the bar", w: 1000, h: 750, feature: true },
  { src: "strawberry-shake", cat: "shakes", title: "Strawberry swirl protein shake", w: 1000, h: 1000, feature: true },
  { src: "chocolate-shake-orange-tea", cat: "combos", title: "Chocolate drizzle shake + an orange power tea", w: 750, h: 1000 },
  { src: "red-power-teas", cat: "teas", title: "Double red power teas", w: 750, h: 1000 },
  { src: "shakes-at-the-bar", cat: "shakes", title: "Bananas Foster & Chocolate Brownie", w: 750, h: 1000 },
  { src: "teas-and-snacks", cat: "teas", title: "Two teas and protein snack cups", w: 750, h: 1000 },
  { src: "tea-mocha-shake", cat: "combos", title: "The classic combo: tea + mocha-drizzle shake", w: 752, h: 1000 },
  { src: "snow-day-crush", cat: "combos", title: "Snow day? Still a Crush day.", w: 750, h: 1000 },
  { src: "tea-chocolate-shake", cat: "combos", title: "Tea + chocolate shake at the counter", w: 750, h: 1000 },
  { src: "tea-and-shake-patio", cat: "combos", title: "Golden tea + a creamy shake by the window", w: 750, h: 1000 },
];
