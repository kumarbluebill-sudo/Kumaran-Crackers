/* UI components: each returns an HTML string. Behaviour is bound by delegated handlers in app.js. */
var Motion = {
  reduced: function () { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } },
  /* Fade/slide .rv elements in as they scroll into view. Content is visible by default if JS or IO is unavailable. */
  reveal: function (root) {
    var els = (root || document).querySelectorAll(".rv:not(.in)");
    if (this.reduced() || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, {rootMargin: "0px 0px -6% 0px"});
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add("in"); }); }, 1800);
  },
  bump: function (el) { if (!el || this.reduced()) return; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
};

function hueOf(p) { var g = groupOfCat(p.cat); return g ? g.hue : 40; }

function FestivalHero() {
  var sparks = "";
  for (var i = 0; i < 18; i++) sparks += '<i class="sp" style="left:' + ((i * 53) % 100) + '%;top:' + ((i * 37 + 11) % 90) + '%;animation-delay:' + ((i % 7) * 0.7) + 's"></i>';
  var bulbs = "";
  for (var j = 0; j < 14; j++) bulbs += '<i style="animation-delay:' + ((j % 5) * 0.5) + 's"></i>';
  return '<section class="hero" aria-labelledby="h1"><div class="lights" aria-hidden="true">' + bulbs + '</div>' +
    '<div class="burst b1" aria-hidden="true"></div><div class="burst b2" aria-hidden="true"></div><div class="burst b3" aria-hidden="true"></div>' + sparks +
    '<div class="wrap hero-in"><p class="eyebrow">SIVAKASI • HAPPY DIWALI 2026</p>' +
    '<h1 id="h1">Celebrate Diwali.<br><span>Create Brighter Memories.</span></h1>' +
    '<p class="lead">Explore our festive collection from Sivakasi.</p>' +
    '<div class="cta"><a class="btn org" href="#shop">Shop Crackers →</a><a class="btn ghost" href="#shop/gift-boxes">Explore Gift Boxes</a></div></div>' +
    '<svg class="diya" viewBox="0 0 120 80" aria-hidden="true"><path d="M8 38h104c0 24-22 40-52 40S8 62 8 38z" fill="#c9722b"/><path d="M8 38h104" stroke="#E8B84A" stroke-width="3"/><path class="flame" d="M60 6c10 12 12 20 0 30-12-10-10-18 0-30z" fill="#ffd36b"/></svg></section>';
}

function CategoryTile(g) {
  var n = PRODUCTS.filter(function (p) { return g.cats.indexOf(p.cat) > -1; }).length;
  return '<a class="tile rv" href="#shop/' + g.key + '" style="--h:' + g.hue + '"><span class="ti" aria-hidden="true">' + g.icon + '</span><b>' + esc(g.name) + '</b><small>' + n + ' items</small></a>';
}

function Thumb(p) {
  var im = p.img ? '<img loading="lazy" src="' + esc(p.img) + '" alt="' + esc(p.name) + '" onload="this.classList.add(\'ld\')" onerror="this.remove()">' : '';
  return '<div class="thumb" style="--h:' + hueOf(p) + '"><span aria-hidden="true">' + (ICON[p.cat] || "🎆") + '</span>' + im + (p.img ? '' : '<em>Illustrative</em>') + '</div>';
}

function ProductCard(p) {
  var av = availOf(p), off = av === "Unavailable", inb = Store.get(p.no);
  return '<article class="pc rv" data-no="' + p.no + '">' + Thumb(p) + '<div class="pb">' +
    '<div class="pm">' + esc(p.cat.toUpperCase()) + ' · #' + p.no + '</div><h3>' + esc(p.name) + '</h3>' +
    '<div class="price">' + inr(p.rate) + '</div>' +
    '<div class="av' + (av === "Available" ? "" : " warn") + '">' + (off ? "Currently unavailable" : esc(av)) + '</div>' +
    '<div class="inb" data-inb' + (inb ? '' : ' hidden') + '>In basket × ' + inb + '</div>' +
    '<div class="pact"><div class="step" role="group" aria-label="Quantity"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button><output>1</output><button type="button" data-step="1" aria-label="Increase quantity">+</button></div>' +
    '<button type="button" class="add" data-add' + (off ? ' disabled' : '') + ' aria-label="Add ' + esc(p.name) + ' to cart">' + (off ? 'Unavailable' : 'Add to Cart') + '</button></div></div></article>';
}

function EmptyBasket() {
  return '<div class="empty"><svg viewBox="0 0 120 90" width="120" aria-hidden="true"><path d="M20 30h80l-8 40H30z" fill="#fff" stroke="#E8B84A" stroke-width="4" stroke-linejoin="round"/><path d="M40 30c0-14 40-14 40 0" fill="none" stroke="#F36B38" stroke-width="4"/><circle cx="60" cy="8" r="3" fill="#E8B84A"/><circle cx="30" cy="14" r="2" fill="#F36B38"/><circle cx="92" cy="16" r="2.5" fill="#E8B84A"/></svg><h3>Your basket is waiting</h3><p>Add a few festive favourites to get started.</p><a class="btn org" href="#shop" data-close>Shop Now</a></div>';
}

/* One basket row. editable = steppers + remove. */
function CartLine(l, editable) {
  return '<li class="cl" data-no="' + l.p.no + '">' + Thumb(l.p) + '<div class="ci"><b>' + esc(l.p.name) + '</b><small>' + inr(l.p.rate) + ' each</small>' +
    (availOf(l.p) !== "Available" ? '<small class="warnt">' + (availOf(l.p) === "Unavailable" ? "Unavailable — we will confirm" : "Check availability") + '</small>' : '') + '</div>' +
    (editable ? '<div class="step sm" role="group" aria-label="Quantity of ' + esc(l.p.name) + '"><button type="button" data-dq="-1" aria-label="Decrease">−</button><output>' + l.q + '</output><button type="button" data-dq="1" aria-label="Increase">+</button></div>' : '<span class="qx">× ' + l.q + '</span>') +
    '<span class="lt">' + inr(l.amt) + '</span>' + (editable ? '<button type="button" class="rm" data-rm aria-label="Remove ' + esc(l.p.name) + '">✕</button>' : '') + '</li>';
}

function offerNote(t) {
  if (t <= 0) return "";
  if (t >= CONFIG.THRESHOLD) return '🎉 Your basket is above ₹5,000 — special discounts apply. Terms are confirmed manually by Kumaran Crackers; nothing is deducted here.';
  return 'Add ' + inr(CONFIG.THRESHOLD - t) + ' more to reach ₹5,000 and ask about special discounts.';
}

function CartSummary(lines, total, opts) {
  opts = opts || {};
  var showDel = CONFIG.DELIVERY_CHARGE != null && opts.delivery;
  return '<div class="sum"><div><span>Estimated subtotal</span><b>' + inr(total) + '</b></div>' +
    '<div><span>Discount</span><span>Subject to confirmation</span></div>' +
    (showDel ? '<div><span>Delivery charge</span><span>' + inr(CONFIG.DELIVERY_CHARGE) + ' (to be confirmed)</span></div>' : '') +
    '<div class="tot"><span>Estimated order total</span><b>' + inr(total + (showDel ? CONFIG.DELIVERY_CHARGE : 0)) + '</b></div></div>' +
    (offerNote(total) ? '<p class="offnote">' + offerNote(total) + '</p>' : '') +
    (lines.some(function (l) { return availOf(l.p) !== "Available"; }) ? '<p class="offnote warnt">⚠️ Some items need an availability check. We will confirm stock on WhatsApp.</p>' : '') +
    '<p class="fine">Estimate only — Kumaran Crackers confirms stock, discounts, delivery charges and the final total.</p>';
}

function CartDrawerBody() {
  var L = Store.lines(), t = Store.total();
  if (!L.length) return EmptyBasket();
  return '<ul class="cls">' + L.map(function (l) { return CartLine(l, true); }).join("") + '</ul>' + CartSummary(L, t) +
    '<div class="dfoot"><a class="btn org block" href="#checkout" data-close>Checkout</a><button type="button" class="link" data-clear>Clear basket</button></div>';
}

function Progress(step) {
  var names = ["Basket", "Details", "Review"];
  return '<ol class="prog" aria-label="Checkout progress">' + names.map(function (n, i) {
    return '<li class="' + (i + 1 === step ? 'on' : i + 1 < step ? 'done' : '') + '"' + (i + 1 === step ? ' aria-current="step"' : '') + '><span>' + (i + 1 < step ? '✓' : i + 1) + '</span>' + n + '</li>';
  }).join("") + '</ol>';
}

function field(id, label, val, err, attrs) {
  return '<div class="fld' + (err ? ' bad' : '') + '"><label for="f-' + id + '">' + label + '</label><input id="f-' + id + '" data-f="' + id + '" value="' + esc(val || "") + '" ' + (attrs || "") + (err ? ' aria-invalid="true" aria-describedby="e-' + id + '"' : '') + '>' + (err ? '<div class="fe" id="e-' + id + '">' + esc(err) + '</div>' : '') + '</div>';
}

function CheckoutForm(F, E) {
  return '<form class="cform" novalidate>' +
    field("name", "Name *", F.name, E.name, 'autocomplete="name" maxlength="60"') +
    field("mobile", "Mobile number *", F.mobile, E.mobile, 'inputmode="tel" autocomplete="tel" maxlength="14" placeholder="10-digit number"') +
    field("city", "City / town *", F.city, E.city, 'autocomplete="address-level2" maxlength="60"') +
    '<fieldset class="fld"><legend>Order fulfilment preference *</legend>' +
    '<label class="opt"><input type="radio" name="ful" data-ful="0"' + (F.delivery ? '' : ' checked') + '> <span><b>Store pickup — Sivakasi</b><small>390, Gnanagiri Road, Sivakasi</small></span></label>' +
    '<label class="opt"><input type="radio" name="ful" data-ful="1"' + (F.delivery ? ' checked' : '') + '> <span><b>Delivery</b><small>We deliver across India. Charges confirmed on WhatsApp.</small></span></label></fieldset>' +
    (F.delivery ? field("address", "Delivery address *", F.address, E.address, 'autocomplete="street-address" maxlength="160"') : '') +
    field("date", "Preferred collection / delivery date (optional)", F.date, "", 'type="date"') +
    field("notes", "Additional notes (optional)", F.notes, "", 'maxlength="120"') +
    '<div class="fld' + (E.consent ? ' bad' : '') + '"><label class="chk"><input type="checkbox" data-consent' + (F.consent ? ' checked' : '') + '><span>I understand this order is a request, subject to product availability, price confirmation and applicable sales and delivery rules. I agree to the <a href="#privacy">Privacy policy</a> and <a href="#terms">Terms</a>.</span></label>' + (E.consent ? '<div class="fe" id="e-consent">' + esc(E.consent) + '</div>' : '') + '</div></form>';
}

function WhatsAppOrderButton(sent) {
  return '<button type="button" class="btn wa block" data-send>Send Order on WhatsApp</button>' +
    (sent ? '<div class="prep" role="status"><b>Order request prepared.</b> WhatsApp should now be open with your message — press <b>Send</b> there. Your order is not confirmed until Kumaran Crackers replies.' +
      '<div class="prep-a"><span>WhatsApp didn’t open?</span><button type="button" class="btn sm ghost-d" data-send>Retry</button><button type="button" class="btn sm ghost-d" data-copy>Copy message</button><a class="btn sm ghost-d" href="tel:+91' + CONFIG.WA_NUMBER.slice(2) + '">Call ' + CONFIG.WA_DISPLAY + '</a></div></div>' : '');
}

var INFO = {
  about: ["About Kumaran Crackers", '<p>Kumaran Crackers sells crackers directly from Sivakasi, Tamil Nadu. “Where Expectations Ends With a Happiness.”</p><p>Address: 390, Gnanagiri Road, Sivakasi, Tamil Nadu – 626189.</p>'],
  safety: ["Safety guidelines", '<div class="draft">Draft text — owner to review and complete.</div><ul><li>Use fireworks outdoors in an open area, away from buildings, vehicles and dry grass.</li><li>Keep a bucket of water or sand nearby.</li><li>Light one item at a time and move away immediately; never relight a dud.</li><li>Children must be supervised by an adult at all times.</li><li>Wear cotton clothing; avoid loose synthetic clothes.</li><li>Store crackers in a cool, dry place away from flame and heat.</li></ul>'],
  faq: ["FAQs", '<h3>Is my order confirmed when WhatsApp opens?</h3><p>No. WhatsApp opens with a prepared message. You must press Send, and Kumaran Crackers then confirms availability and final price manually.</p><h3>Do I pay online?</h3><p>No. There is no online payment on this website.</p><h3>What about the ₹5,000 discount?</h3><p>Special discounts apply on bills above ₹5,000. The terms are confirmed by Kumaran Crackers on the final bill.</p><h3>Do you deliver?</h3><p>Yes, we deliver to locations across India. Delivery charges and timing are confirmed by Kumaran Crackers on WhatsApp. Store pickup in Sivakasi is also available. See <a href="#delivery">Delivery &amp; pickup</a>.</p>'],
  delivery: ["Delivery & pickup policy", '<p>We deliver to locations across India. Delivery charges and delivery time depend on your location and order, and are confirmed by Kumaran Crackers on WhatsApp before your order is finalised. Store pickup at 390, Gnanagiri Road, Sivakasi is also available.</p>'],
  privacy: ["Privacy policy", '<div class="draft">Draft text — owner to review.</div><p>We collect only the name, mobile number, city, optional address and notes you enter. These are used solely to prepare your WhatsApp order message. This website does not collect payment details and does not send the message on your behalf; your basket is stored only in your own browser.</p>'],
  terms: ["Terms & conditions", '<div class="draft">Draft text — owner to review.</div><ul><li>An order sent through this website is a request, subject to product availability, price confirmation and applicable sales and delivery rules.</li><li>Prices are from the October 2026 price list and may change.</li><li>Totals shown are estimates until confirmed by Kumaran Crackers.</li><li>Special discounts on bills above ₹5,000 are confirmed manually.</li></ul>']
};
