# Crush Nutrition Reno — website

Energy · Protein · Nutrition. Family-owned protein shake & energy tea bar at 175 Damonte Ranch Pkwy, Ste D, Reno NV.
Built by [Nexora Digital](https://www.nexoradigital.live).

## Stack
Plain HTML / CSS / JS (no build step) + one Vercel serverless function for the contact form.

```
index.html      Home: animated hero cup, specials, power-tea benefits, reels, reviews, hours + map
menu.html       Full menu rendered from data (search + GF / no-peanut / seasonal filters, combos, in-store boards)
build.html      Crush Lab: build-a-drink/bite with live cup, price, macros, caffeine; "take a sip"
about.html      Story, owners' thank-you video, values, reviews
contact.html    Contact form + "Join the crew" (Google Form) + map
api/contact.js  POST /api/contact → Gmail SMTP via nodemailer
assets/js/data.js     ★ ALL menu items, prices, colors, hours, links live here
assets/js/cup.js      Animated SVG cup / plate engine
assets/js/builder.js  Crush Lab logic
assets/js/app.js      Nav, live open/closed status, order bag + automatic combo pricing, forms, lightbox
```

## Deploy (Vercel)
1. Import this repo in Vercel. Framework preset: **Other**. No build command, output = root.
2. Settings → Environment Variables:
   - `GMAIL_USER`: Gmail account that sends the form emails
   - `GMAIL_APP_PASSWORD`: Google App Password (Google Account → Security → 2-Step Verification → App passwords)
   - `CONTACT_TO`: inbox that receives messages (optional, defaults to `GMAIL_USER`)
3. Redeploy after adding env vars.

## Common edits
- **Monthly specials:** edit `teaSeasonal`, `shakeSeasonal` and `SEASONAL_LABEL` in `assets/js/data.js`, swap `assets/menu/november-specials.jpg`, and update the "November specials" headings in `index.html` / `menu.html`.
- **Holiday hours / banner:** `hours.special` and `hours.announcement` in `data.js` (banner auto-hides after the `until` date).
- **Prices:** `shakeSizes`, `teaLevels`, `proteinTeaLevels`, boosts, `comboTable` in `data.js`.
- **Jobs form link:** `info.jobsForm` in `data.js`.
- **Gallery:** add images to `assets/img/gallery/` (section to be added).

## Online ordering (next phase)
The order bag already stores structured items (`kind`, `detail`, `price`, `combo`) in `localStorage` and computes combo savings.
Checkout currently offers "Call in this order" / "Copy order". To go live, post `crushBag` items to a new `/api/order` endpoint or hand them to Square/Toast/Clover online ordering.
