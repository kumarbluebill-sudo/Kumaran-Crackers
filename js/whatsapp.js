/* Single place that builds the order message and the wa.me link. */
var WA = {
  link: function (text) { return "https://wa.me/" + CONFIG.WA_NUMBER + "?text=" + encodeURIComponent(text); },
  build: function (f, lines, total) {
    var m = "Kumaran Crackers — New Order Request\n\nHello Kumaran Crackers! I would like to place an order.\n\nCustomer: " + f.name + "\nMobile: " + f.mobile + "\nCity: " + f.city + "\nFulfilment: " + (f.delivery ? "Delivery (charges confirmed on WhatsApp)" : "Store pickup — Sivakasi") + (f.delivery && f.address ? "\nAddress: " + f.address : "") + (f.date ? "\nPreferred date: " + f.date : "") + (f.notes ? "\nNotes: " + f.notes : "") + "\n\nORDER ITEMS\n";
    lines.forEach(function (l, i) { m += (i + 1) + ". " + l.p.name + " × " + l.q + " — " + inr(l.amt) + "\n"; });
    m += "\nEstimated subtotal: " + inr(total) + (CONFIG.DELIVERY_CHARGE != null && f.delivery ? "\nDelivery charge: " + inr(CONFIG.DELIVERY_CHARGE) + " (subject to confirmation)" : "") + "\nDiscount: Subject to confirmation\nFinal total: To be confirmed\n\nPlease confirm product availability, final price and fulfilment details. Thank you!";
    return m;
  }
};
