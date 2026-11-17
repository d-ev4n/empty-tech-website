const BRAND = ""; // type your brand name here (left empty on purpose)
const root = document.documentElement;
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

$$(".bn").forEach((e) => (e.textContent = BRAND));
if (BRAND) document.title += " – " + BRAND;

/* theme: dark / light, remembered */
const meta = $('meta[name="theme-color"]');
function setTheme(t, save) {
  root.dataset.theme = t;
  if (meta) meta.setAttribute("content", t === "dark" ? "#06070c" : "#edf0f7");
  if (save) try { localStorage.setItem("theme", t); } catch (e) {}
}
setTheme(root.dataset.theme, false);
$("#tg").addEventListener("click", () => {
  root.classList.add("swap");
  setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  setTimeout(() => root.classList.remove("swap"), 800);
});

/* reveal on scroll */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".rv").forEach((e) => io.observe(e));

/* colour swatches recolour the whole page smoothly */
$$(".sw").forEach((b) => b.addEventListener("click", () => {
  root.style.setProperty("--d1", b.dataset.a);
  root.style.setProperty("--d2", b.dataset.b);
  $$(".sw").forEach((x) => x.setAttribute("aria-pressed", x === b));
}));

/* nav gets depth after scrolling */
const nav = $("nav");
addEventListener("scroll", () => nav.classList.toggle("sc", scrollY > 20), { passive: true });

/* ---------- cart (saved in this browser) ---------- */
/* ---------- currency: prices are stored in USD and converted for display ---------- */
let rates = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 84, JPY: 150, AUD: 1.52, CAD: 1.37, CHF: 0.88, CNY: 7.2, AED: 3.67, SGD: 1.34, KRW: 1350, BRL: 5.5, MXN: 18, ZAR: 18, SAR: 3.75, TRY: 34, SEK: 10.5, NZD: 1.65, HKD: 7.8 };
let cur = "USD";
try { cur = localStorage.getItem("cur") || "USD"; } catch (e) {}
const money = (n) => {
  const v = n * (rates[cur] || 1);
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: cur, maximumFractionDigits: v >= 100 ? 0 : 2 }).format(v); }
  catch (e) { return cur + " " + Math.round(v); }
};
let cname; try { cname = new Intl.DisplayNames(undefined, { type: "currency" }); } catch (e) {}
function curName(c) { try { return cname ? cname.of(c) : ""; } catch (e) { return ""; } }
function curSym(c) {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency: c, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency").value; }
  catch (e) { return c; }
}
const curBtn = $("#curb"), curPanel = $("#curp"), curQ = $("#curq"), curList = $("#curl");
let curAct = -1;
function curLabel() { $("#curc").innerHTML = '<span class="sym">' + curSym(cur) + "</span> <b>" + cur + "</b>"; }
function buildCur() {
  const q = curQ.value.trim().toLowerCase();
  const items = Object.keys(rates).sort().filter((c) => !q || c.toLowerCase().includes(q) || curName(c).toLowerCase().includes(q));
  curList.innerHTML = items.map((c) => '<li role="option" data-c="' + c + '" aria-selected="' + (c === cur) + '"><b>' + c + "</b><span>" + curName(c) + "</span></li>").join("") || '<li class="none">No match</li>';
  curAct = -1;
}
function openCur(o) {
  curPanel.hidden = !o; curBtn.setAttribute("aria-expanded", o);
  if (o) { curQ.value = ""; buildCur(); curQ.focus(); const s = curList.querySelector('[aria-selected="true"]'); if (s) s.scrollIntoView({ block: "center" }); }
}
function pickCur(c) {
  cur = c; try { localStorage.setItem("cur", c); } catch (e) {}
  curLabel(); openCur(false); curBtn.focus(); render();
}
curBtn.addEventListener("click", () => openCur(curPanel.hidden));
document.addEventListener("click", (e) => { if (!curPanel.hidden && !e.target.closest(".cd")) openCur(false); });
curQ.addEventListener("input", buildCur);
curList.addEventListener("click", (e) => { const li = e.target.closest("li[data-c]"); if (li) pickCur(li.dataset.c); });
curQ.addEventListener("keydown", (e) => {
  const it = [...curList.querySelectorAll("li[data-c]")];
  if (e.key === "Escape") { openCur(false); curBtn.focus(); }
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    curAct = Math.max(0, Math.min(it.length - 1, curAct + (e.key === "ArrowDown" ? 1 : -1)));
    it.forEach((x, i) => x.classList.toggle("hl", i === curAct));
    if (it[curAct]) it[curAct].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") { e.preventDefault(); const t = it[curAct >= 0 ? curAct : 0]; if (t) pickCur(t.dataset.c); }
});
async function loadRates() {
  let c = null;
  try { c = JSON.parse(localStorage.getItem("rates")); } catch (e) {}
  if (c && Date.now() - c.t < 864e5) { rates = c.r; return; }
  try {
    const r = await (await fetch("https://open.er-api.com/v6/latest/USD")).json();
    if (r.result === "success") { rates = r.rates; try { localStorage.setItem("rates", JSON.stringify({ t: Date.now(), r: rates })); } catch (e) {} }
  } catch (e) {}
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart")) || []; } catch (e) {}
const total = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

const wrap = document.createElement("div");
wrap.innerHTML = '<div id="scrim"></div><aside id="cart" class="glass" aria-label="Cart" inert><header><h3>Your cart</h3><button id="cx" aria-label="Close cart">&times;</button></header><div id="ci"></div><footer><div class="tot"><span>Subtotal</span><b id="ct"></b></div><a class="btn p" href="checkout.html">Checkout</a></footer></aside>';
document.body.append(...wrap.children);

function setCart(open) {
  document.body.classList.toggle("cartopen", open);
  $("#cart").inert = !open;
  if (open) $("#cx").focus();
}
function render() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
  const n = cart.reduce((s, i) => s + i.qty, 0), badge = $(".cn");
  badge.hidden = !n; badge.textContent = n;
  $$(".price").forEach((p) => (p.textContent = money(+p.dataset.p)));
  $("#ct").textContent = money(total());
  $("#ci").innerHTML = cart.length ? cart.map((i, k) => '<div class="it"><b>' + esc(i.name) + '</b><b>' + money(i.price * i.qty) + '</b><small>' + esc(i.color) + '</small><div class="qty"><button data-a="dec" data-k="' + k + '" aria-label="Fewer">&minus;</button>' + i.qty + '<button data-a="inc" data-k="' + k + '" aria-label="More">+</button><button data-a="rm" data-k="' + k + '" aria-label="Remove" style="width:auto;padding:0 10px">Remove</button></div></div>').join("") : '<p class="empty">Your cart is empty.</p>';
  const s = $("#sum");
  if (s) {
    s.innerHTML = '<h3>Order summary</h3>' + (cart.length ? cart.map((i) => '<div class="sl"><span>' + esc(i.name) + ' (' + esc(i.color) + ') x ' + i.qty + '</span><span>' + money(i.price * i.qty) + '</span></div>').join("") + '<div class="sl"><span>Delivery</span><span>Free</span></div><div class="sl gt"><span>Total</span><span>' + money(total()) + '</span></div>' : '<p class="empty">Your cart is empty. <a href="index.html"><u>Find a device</u></a></p>');
    $("#po").disabled = !cart.length;
  }
}
$("#cb").addEventListener("click", () => setCart(true));
$("#cx").addEventListener("click", () => setCart(false));
$("#scrim").addEventListener("click", () => setCart(false));
addEventListener("keydown", (e) => { if (e.key === "Escape") setCart(false); });
$("#ci").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-a]"); if (!b) return;
  const i = cart[+b.dataset.k];
  if (b.dataset.a === "inc") i.qty++; else if (b.dataset.a === "dec") i.qty--; else i.qty = 0;
  cart = cart.filter((x) => x.qty > 0); render();
});

/* colour dots + add to cart */
$$(".m").forEach((card) => {
  card.querySelectorAll(".dot").forEach((d) => d.addEventListener("click", () => {
    card.querySelectorAll(".dot").forEach((x) => x.setAttribute("aria-pressed", x === d));
    card.style.setProperty("--d1", d.dataset.a); card.style.setProperty("--d2", d.dataset.b);
  }));
  card.querySelector(".add").addEventListener("click", () => {
    const color = card.querySelector('.dot[aria-pressed="true"]').dataset.n, id = card.dataset.id + "|" + color;
    const hit = cart.find((i) => i.id === id);
    if (hit) hit.qty++; else cart.push({ id, name: card.dataset.name, color, price: +card.dataset.price, qty: 1 });
    render(); setCart(true);
    const bd = $(".cn"); bd.classList.remove("bump"); void bd.offsetWidth; bd.classList.add("bump");
  });
});

/* ---------- checkout page ---------- */
const form = $("#cof");
if (form) {
  const luhn = (v) => { let s = 0, d = false; for (let i = v.length - 1; i >= 0; i--) { let n = +v[i]; if (d) { n *= 2; if (n > 9) n -= 9; } s += n; d = !d; } return s % 10 === 0; };
  const pm = () => form.querySelector('[name="pm"]:checked').value;
  const setPay = () => $$(".pf").forEach((p) => {
    const off = p.dataset.m !== pm(); p.hidden = off;
    p.querySelectorAll("input").forEach((i) => (i.required = !off));
  });
  form.addEventListener("change", (e) => { if (e.target.name === "pm") setPay(); });
  $("#cn").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(); });
  $("#ce").addEventListener("input", (e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v; });
  setPay();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pm() === "card") {
      const ok = luhn($("#cn").value.replace(/\s/g, ""));
      $("#cn").setCustomValidity(ok ? "" : "Please check the card number");
      if (!ok) { form.reportValidity(); return; }
    }
    if (!form.reportValidity() || !cart.length) return;
    const names = { card: "card", upi: "UPI", bank: "net banking", wallet: "wallet", cod: "pay on delivery" };
    $("#dm").textContent = "Order ORD-" + Math.floor(100000 + Math.random() * 900000) + " is confirmed. Paid by " + names[pm()] + ". This is a demo, so no money was taken.";
    cart = []; render(); $("#cogrid").hidden = true; $("#done").hidden = false; scrollTo(0, 0);
  });
  $("#cn").addEventListener("input", () => $("#cn").setCustomValidity(""));
}
if (!rates[cur]) cur = "USD";
curLabel(); render();
loadRates().then(() => { if (!rates[cur]) cur = "USD"; curLabel(); render(); });
