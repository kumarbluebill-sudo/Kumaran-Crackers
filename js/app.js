/* Router, pages and event wiring. */
var app = $("app"), route = {name: "home", arg: ""};
var S = {q: "", sort: "no", av: "", min: "", max: "", fopen: false};            // shop state
var F = {name: "", mobile: "", city: "", delivery: false, address: "", date: "", notes: "", consent: false};  // checkout form
var E = {}, step = 1, sent = false;

/* ---------- pages ---------- */
function pageHome() {
  var feat = FEATURED.map(byNo).filter(Boolean).map(ProductCard).join("");
  return FestivalHero() +
    '<div class="wrap sec"><h2 class="rv">Shop by category</h2><div class="tiles">' + GROUPS.map(CategoryTile).join("") + '</div>' +
    '<p class="rv" style="margin-top:12px"><a class="link" href="#shop">View all ' + PRODUCTS.length + ' products →</a></p></div>' +
    '<div class="wrap sec"><h2 class="rv">Featured festive picks</h2><div class="pgrid" id="feat">' + feat + '</div></div>' +
    '<section class="offer"><div class="wrap rv"><span class="big">₹5,000+</span><div><b>Shopping for a bigger celebration?</b><p>Ask us about special discounts on bills above ₹5,000.</p></div><a class="btn org" href="#shop">Start shopping</a></div></section>' +
    '<div class="wrap sec"><h2 class="rv">Why shop with us</h2><div class="why">' +
    [["📍", "Sivakasi business", "Crackers directly from Sivakasi, Tamil Nadu."], ["🔎", "Easy browsing", "Find any of " + PRODUCTS.length + " products by category, name or number."], ["💬", "WhatsApp ordering", "Send your basket in one tap — no account, no online payment."], ["✅", "Clear confirmation", "We confirm stock, discounts and the final total with you."], ["🚚", "Pickup or delivery", "Store pickup, or delivery across India with charges confirmed."]].map(function (w) { return '<div class="rv"><span aria-hidden="true">' + w[0] + '</span><b>' + w[1] + '</b><p>' + w[2] + '</p></div>'; }).join("") + '</div>' +
    '<div class="note rv"><b>Safety first.</b> Use fireworks outdoors, keep water nearby, light one at a time and supervise children. <a href="#safety">Read safety guidelines</a>.</div></div>';
}

function pageShop() {
  var chips = '<button class="chip" data-g="">All</button>' + GROUPS.map(function (g) { return '<button class="chip" data-g="' + g.key + '">' + g.icon + ' ' + esc(g.name) + '</button>'; }).join("");
  return '<div class="shopbar"><div class="wrap"><div class="srow"><div class="search"><label class="sr" for="q">Search products</label><input id="q" type="search" placeholder="Search by name or number" autocomplete="off" value="' + esc(S.q) + '"></div>' +
    '<label class="sr" for="sort">Sort</label><select id="sort"><option value="no">Sort: List order</option><option value="name">Name A–Z</option><option value="pa">Price: low to high</option><option value="pd">Price: high to low</option></select>' +
    '<button type="button" class="btn sm ghost-d" id="ftog" aria-expanded="false">Filters</button></div>' +
    '<div class="fpanel" id="fpanel" hidden><label>Availability<select id="av"><option value="">Any</option><option value="Available">Available</option><option value="Check availability">Check availability</option></select></label>' +
    '<label>Min ₹<input id="pmin" type="number" min="0" inputmode="numeric"></label><label>Max ₹<input id="pmax" type="number" min="0" inputmode="numeric"></label><button type="button" class="btn sm" id="freset">Reset filters</button></div>' +
    '<div class="chips" id="chips">' + chips + '</div></div></div><div class="wrap sec"><div id="results" aria-live="polite"></div></div>';
}

function shopFilter() {
  var g = route.arg ? groupByKey(route.arg) : null, term = S.q.trim().toLowerCase().replace(/^#/, "");
  var lo = parseFloat(S.min), hi = parseFloat(S.max);
  var list = PRODUCTS.filter(function (p) {
    return (!g || g.cats.indexOf(p.cat) > -1) && (!term || p.name.toLowerCase().indexOf(term) > -1 || String(p.no) === term) &&
      (!S.av || availOf(p) === S.av) && (isNaN(lo) || p.rate >= lo) && (isNaN(hi) || p.rate <= hi);
  });
  if (S.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  else if (S.sort === "pa") list.sort(function (a, b) { return a.rate - b.rate; });
  else if (S.sort === "pd") list.sort(function (a, b) { return b.rate - a.rate; });
  return list;
}

function shopUpdate() {
  var list = shopFilter(), box = $("results"), g = route.arg ? groupByKey(route.arg) : null, html = "";
  document.querySelectorAll("#chips .chip").forEach(function (c) { c.classList.toggle("on", c.dataset.g === (g ? g.key : "")); });
  if (!list.length) {
    box.innerHTML = '<div class="empty"><h3>No matching products found</h3><p>Try a different word or number, or reset your filters.</p><button type="button" class="btn org" data-clearsearch>Clear search &amp; filters</button></div>';
    return;
  }
  html = '<p class="count">' + list.length + ' product' + (list.length > 1 ? 's' : '') + (g ? ' in ' + esc(g.name) : '') + '</p>';
  if (S.sort === "no") {
    var cats = [];
    list.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    cats.forEach(function (c) { html += '<h3 class="gh">' + esc(c) + '</h3><div class="pgrid">' + list.filter(function (p) { return p.cat === c; }).map(ProductCard).join("") + '</div>'; });
  } else html += '<div class="pgrid">' + list.map(ProductCard).join("") + '</div>';
  box.innerHTML = html;
  Motion.reveal(box);
}

function pageInfo(n) { var i = INFO[n]; return '<div class="wrap sec prose"><h1>' + esc(i[0]) + '</h1>' + i[1] + '</div>'; }

function pageContact() {
  var tels = ["9442294888", "9487007583", "8903413988"];
  return '<div class="wrap sec prose"><h1>Contact Kumaran Crackers</h1><p>390, Gnanagiri Road, Sivakasi, Tamil Nadu – 626189</p><p>' +
    tels.map(function (t) { return '<a href="tel:+91' + t + '">' + t.slice(0, 5) + ' ' + t.slice(5) + '</a>'; }).join(" · ") + '</p>' +
    '<p><a class="btn org" href="tel:+919442294888">Call now</a> <a class="btn wa" target="_blank" rel="noopener" href="' + WA.link("Hello Kumaran Crackers, I would like the Diwali 2026 price list.") + '">WhatsApp ' + CONFIG.WA_DISPLAY + '</a></p>' +
    '<div class="note"><b>Safety &amp; purchase information.</b> Orders sent here are requests. Final prices, availability and delivery are confirmed by Kumaran Crackers directly. Please follow local regulations and safety guidelines.</div></div>';
}

/* ---------- checkout ---------- */
function pageCheckout() { return '<div class="wrap sec narrow" id="co"></div>'; }

function renderCheckout() {
  var box = $("co"); if (!box) return;
  var L = Store.lines(), t = Store.total();
  if (!L.length) { box.innerHTML = '<h1>Checkout</h1>' + EmptyBasket(); return; }
  var h = '<h1>Checkout</h1>' + Progress(step);
  if (step === 1) {
    h += '<h2 class="h2s">Review your basket</h2><ul class="cls">' + L.map(function (l) { return CartLine(l, true); }).join("") + '</ul>' + CartSummary(L, t) +
      '<div class="nav"><a class="btn ghost-d" href="#shop">+ Add more</a><button type="button" class="btn org" data-next>Continue</button></div>';
  } else if (step === 2) {
    h += '<h2 class="h2s">Your details</h2>' + CheckoutForm(F, E) + '<div class="nav"><button type="button" class="btn ghost-d" data-back>Back</button><button type="button" class="btn org" data-next>Review order</button></div>';
  } else {
    h += '<h2 class="h2s">Review &amp; send</h2><div class="rv-box"><div><b>' + esc(F.name) + '</b> · ' + esc(F.mobile) + '<br>' + esc(F.city) + '<br>' + (F.delivery ? 'Delivery' + (F.address ? ': ' + esc(F.address) : '') : 'Store pickup — Sivakasi') + (F.date ? '<br>Date: ' + esc(F.date) : '') + (F.notes ? '<br>Notes: ' + esc(F.notes) : '') + '</div><button type="button" class="link" data-edit>Edit details</button></div>' +
      '<ul class="cls">' + L.map(function (l) { return CartLine(l, false); }).join("") + '</ul>' + CartSummary(L, t, {delivery: F.delivery}) +
      '<p class="fine">No online payment. Pressing the button opens WhatsApp with your order prepared — you still need to press Send there.</p>' + WhatsAppOrderButton(sent) +
      '<div class="nav"><button type="button" class="btn ghost-d" data-back>Back</button><a class="link" href="#shop">Keep shopping</a></div>';
  }
  box.innerHTML = h;
}

function validate() {
  E = {};
  if (!F.name.trim()) E.name = "Enter your name.";
  var mb = F.mobile.replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(mb)) E.mobile = "Enter a valid 10-digit mobile number.";
  if (!F.city.trim()) E.city = "Enter your city / town.";
  if (F.delivery && !F.address.trim()) E.address = "Enter your delivery address.";
  if (!F.consent) E.consent = "Please tick the acknowledgement to continue.";
  return Object.keys(E).length === 0;
}

function sendOrder() {
  var f = {name: F.name.trim(), mobile: F.mobile.replace(/\D/g, "").slice(-10), city: F.city.trim(), delivery: F.delivery, address: F.address.trim(), date: F.date, notes: F.notes.trim()};
  var w = window.open(WA.link(WA.build(f, Store.lines(), Store.total())), "_blank");
  if (w) { try { w.opener = null; } catch (e) {} }
  sent = true; renderCheckout();
}

function copyMessage() {
  var f = {name: F.name.trim(), mobile: F.mobile.replace(/\D/g, "").slice(-10), city: F.city.trim(), delivery: F.delivery, address: F.address.trim(), date: F.date, notes: F.notes.trim()};
  var m = WA.build(f, Store.lines(), Store.total());
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).then(function () { toast("Message copied"); }, function () { window.prompt("Copy your order message:", m); });
  else window.prompt("Copy your order message:", m);
}

/* ---------- chrome ---------- */
var toastT;
function toast(msg) { var t = $("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, 1800); }

function updateChrome() {
  var n = Store.count(), t = Store.total();
  ["cnt", "bnCnt"].forEach(function (id) { var e = $(id); if (e) { e.textContent = n; e.hidden = !n; } });
  var bar = $("sbar"), show = n > 0 && (route.name === "home" || route.name === "shop");
  bar.hidden = !show;
  if (show) $("sbarTxt").innerHTML = '🛒 ' + n + ' item' + (n > 1 ? 's' : '') + ' · <b>' + inr(t) + '</b>' + (t >= CONFIG.THRESHOLD ? ' <small>🎉 ₹5,000+ offer</small>' : '');
  document.querySelectorAll(".pc[data-no]").forEach(function (c) {
    var q = Store.get(+c.dataset.no), b = c.querySelector("[data-inb]");
    if (b) { b.hidden = !q; b.textContent = "In basket × " + q; }
  });
  if ($("drawer").classList.contains("on")) $("dbody").innerHTML = CartDrawerBody();
  if (route.name === "checkout") renderCheckout();
}

function openDrawer() { $("dbody").innerHTML = CartDrawerBody(); $("drawer").classList.add("on"); $("drawer").setAttribute("aria-hidden", "false"); $("dclose").focus(); }
function closeDrawer() { $("drawer").classList.remove("on"); $("drawer").setAttribute("aria-hidden", "true"); }

/* ---------- router ---------- */
function go() {
  var h = location.hash.slice(1) || "home", a = h.split("/");
  route = {name: a[0], arg: a.slice(1).join("/")};
  var n = route.name, html;
  closeDrawer();
  if (n === "home") html = pageHome();
  else if (n === "shop") html = pageShop();
  else if (n === "checkout") { html = pageCheckout(); if (step > 3) step = 1; }
  else if (n === "contact") html = pageContact();
  else if (INFO[n]) html = pageInfo(n);
  else { route = {name: "home", arg: ""}; html = pageHome(); }
  app.innerHTML = html;
  document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === route.name); });
  if (route.name === "shop") { $("sort").value = S.sort; $("av").value = S.av; $("pmin").value = S.min; $("pmax").value = S.max; shopUpdate(); }
  if (route.name === "checkout") renderCheckout();
  Motion.reveal(app); updateChrome();
  try { window.scrollTo(0, 0); } catch (e) {}
  document.title = "Kumaran Crackers Sivakasi | Diwali 2026" + (route.name !== "home" ? " — " + route.name : "");
}

/* ---------- events ---------- */
document.addEventListener("click", function (e) {
  var t = e.target, b = t.closest ? t.closest("button, a") : null;
  if (t.tagName === "IMG" && t.closest(".thumb")) { $("zimg").src = t.src; $("zimg").alt = t.alt; $("zoom").classList.add("on"); return; }
  if (t.id === "zoom" || t.id === "zimg") { $("zoom").classList.remove("on"); return; }
  if (t.id === "dover" || t.id === "dclose") { closeDrawer(); return; }
  if (!b) return;
  if (b.id === "cartBtn" || b.hasAttribute("data-opencart")) { e.preventDefault(); openDrawer(); return; }
  if (b.hasAttribute("data-close")) closeDrawer();
  var card = b.closest(".pc");
  if (card && b.dataset.step) { var o = card.querySelector("output"); o.textContent = Math.max(1, Math.min(99, (+o.textContent) + (+b.dataset.step))); return; }
  if (card && b.hasAttribute("data-add")) {
    var no = +card.dataset.no, o2 = card.querySelector("output"), n = +o2.textContent || 1, p = byNo(no);
    Store.add(no, n); o2.textContent = "1";
    b.textContent = "Added ✓"; b.classList.add("done"); setTimeout(function () { b.textContent = "Add to Cart"; b.classList.remove("done"); }, 1100);
    Motion.bump($("cnt")); Motion.bump($("bnCnt")); toast("Added to your basket: " + p.name);
    return;
  }
  var line = b.closest(".cl[data-no]");
  if (line && b.dataset.dq) { var ln = +line.dataset.no; Store.set(ln, Store.get(ln) + (+b.dataset.dq)); return; }
  if (line && b.hasAttribute("data-rm")) { Store.set(+line.dataset.no, 0); return; }
  if (b.hasAttribute("data-clear")) { if (confirm("Remove all items from your basket?")) Store.clear(); return; }
  if (b.dataset.g !== undefined && b.classList.contains("chip")) { location.hash = b.dataset.g ? "#shop/" + b.dataset.g : "#shop"; return; }
  if (b.id === "ftog") { var fp = $("fpanel"); fp.hidden = !fp.hidden; b.setAttribute("aria-expanded", String(!fp.hidden)); return; }
  if (b.id === "freset" || b.hasAttribute("data-clearsearch")) { S = {q: "", sort: "no", av: "", min: "", max: "", fopen: false}; if (route.arg) location.hash = "#shop"; else go(); return; }
  if (b.hasAttribute("data-next")) {
    if (step === 2) { if (!validate()) { renderCheckout(); var first = document.querySelector(".fld.bad input"); if (first) first.focus(); return; } }
    step = Math.min(3, step + 1); renderCheckout(); try { window.scrollTo(0, 0); } catch (x) {} return;
  }
  if (b.hasAttribute("data-back")) { step = Math.max(1, step - 1); renderCheckout(); return; }
  if (b.hasAttribute("data-edit")) { step = 2; renderCheckout(); return; }
  if (b.hasAttribute("data-send")) { sendOrder(); return; }
  if (b.hasAttribute("data-copy")) { copyMessage(); return; }
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDrawer(); $("zoom").classList.remove("on"); } });
document.addEventListener("input", function (e) {
  var t = e.target;
  if (t.id === "q") { S.q = t.value; shopUpdate(); }
  else if (t.id === "pmin") { S.min = t.value; shopUpdate(); }
  else if (t.id === "pmax") { S.max = t.value; shopUpdate(); }
  else if (t.dataset && t.dataset.f) { F[t.dataset.f] = t.value; if (E[t.dataset.f]) { delete E[t.dataset.f]; var fl = t.closest(".fld"); if (fl) { fl.classList.remove("bad"); var er = fl.querySelector(".fe"); if (er) er.remove(); } } }
});
document.addEventListener("change", function (e) {
  var t = e.target;
  if (t.id === "sort") { S.sort = t.value; shopUpdate(); }
  else if (t.id === "av") { S.av = t.value; shopUpdate(); }
  else if (t.dataset && t.dataset.ful !== undefined) { F.delivery = t.dataset.ful === "1"; delete E.address; renderCheckout(); }
  else if (t.hasAttribute && t.hasAttribute("data-consent")) { F.consent = t.checked; if (t.checked) { delete E.consent; var fe = $("e-consent"); if (fe) fe.remove(); } }
});
window.addEventListener("hashchange", go);
Store.subscribe(updateChrome);

/* ---------- init ---------- */
document.documentElement.classList.add("js");
go();
