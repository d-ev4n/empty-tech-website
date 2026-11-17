
EMPTY — TECH BRAND WEBSITE
==========================================
A modern, responsive frontend website for a fictional tech brand called "Empty",
showcasing a range of consumer electronics including phones, laptops, tablets,
headphones, earbuds, keyboards, mice, and more.

Built with plain HTML, CSS, and JavaScript — no frameworks, no build tools,
no dependencies. Just open a file and it works.


FEATURES
================================================================================

- 7 product categories: Phones, Laptops, Tablets, Headphones, Earbuds,
  Keyboards & Mice, More Tech
- Product listings with specs, color swatches, and add-to-cart buttons
- Shopping cart with a slide-out panel and live item count
- Multi-currency support with a searchable currency picker and live exchange
  rates (via Exchange Rate API)
- Dark / light theme toggle persisted in localStorage
- Checkout page with contact, delivery, and payment forms (card, UPI,
  net banking, wallet, pay on delivery)
- Demo checkout — no real payments are processed
- Animated hero devices (phones, laptops, headphones, earbuds, watches,
  speakers) built entirely in CSS/SVG
- Scroll-reveal animations that respect prefers-reduced-motion
- Lite mode — automatically detected for low-memory, low-core, or
  data-saver devices
- Accessible — ARIA labels, keyboard-friendly controls, semantic markup
- No frameworks, no build step — pure HTML, CSS, and JavaScript


PAGES
================================================================================

index.html          — Homepage with category bento grid
phones.html         — Phone product listing
laptops.html        — Laptop product listing
tablets.html        — Tablet product listing
headphones.html     — Headphone product listing
earbuds.html        — Earbud product listing
keyboard-mouse.html — Keyboard and mouse product listing
more-tech.html      — Watch, speaker, tracker, charger listings
checkout.html       — Checkout form with payment options
style.css           — All styling (shared across pages)
script.js           — Cart, currency, theme, and UI logic


GETTING STARTED
================================================================================

1. Clone the repo

   git clone https://github.com/your-username/empty-tech.git
   cd empty-tech

2. Open it

   Simply open index.html in any modern browser. No server, no install,
   no build step.

   Or serve it locally:

   # Python 3
   python -m http.server 8000

   # Node.js (npx)
   npx serve .

   Then visit http://localhost:8000


PROJECT STRUCTURE
================================================================================

empty-tech/
├── index.html
├── phones.html
├── laptops.html
├── tablets.html
├── headphones.html
├── earbuds.html
├── keyboard-mouse.html
├── more-tech.html
├── checkout.html
├── style.css
├── script.js
└── README.txt


HOW IT WORKS
================================================================================

Cart
----
- Products are marked with data-id, data-name, and data-price attributes.
- Clicking "Add to cart" pushes the item into a cart array stored in
  localStorage.
- The cart button in the nav shows a live item count.
- The cart panel lets users adjust quantities or remove items.

Currency
--------
- The currency picker fetches live exchange rates from the Exchange Rate API.
- All prices on the page update instantly when a new currency is selected.
- The selected currency is saved in localStorage.

Theme
-----
- Dark and light themes are toggled via the sun/moon button.
- The theme is stored in localStorage and respects prefers-color-scheme
  on first visit.

Lite Mode
---------
- If the device reports low memory, few CPU cores, data-saver mode, or
  prefers-reduced-data, a "lite" class is added to the html element.
- This disables heavier animations and effects for smoother performance.

Checkout
--------
- The form collects contact, delivery, and payment details.
- Payment method selection shows/hides the relevant fields
  (card, UPI, bank, wallet, COD).
- Submitting shows a "Thank you" confirmation — nothing is sent anywhere
  (demo only).


TECH STACK
================================================================================

- HTML5 — semantic markup
- CSS3 — custom properties, grid, flexbox, animations, glassmorphism
- JavaScript (vanilla) — cart, currency, theme, form logic
- SVG — inline device illustrations and icons
- Exchange Rate API — live currency conversion


BROWSER SUPPORT
================================================================================

Works in all modern browsers:

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)


NOTES
================================================================================

- This is a frontend demo. No backend, no database, no real payments.
- Product images are SVG illustrations, not photos — they scale perfectly
  and load instantly.
- The currency API is called client-side; in a real app you'd proxy this
  through a backend to protect any API keys.


LICENSE
================================================================================

This project is open source and available under the MIT License.


CREDITS
================================================================================

- Exchange rates by Exchange Rate API (https://www.exchangerate-api.com)
- Fonts, icons, and illustrations are custom/inline — no external assets
  required


Built as a frontend showcase for a fictional tech brand.
Feel free to fork, remix, and make it your own.
================================================================================
