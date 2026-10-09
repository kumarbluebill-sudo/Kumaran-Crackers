function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function $(id) { return document.getElementById(id); }
function byNo(n) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].no === n) return PRODUCTS[i]; return null; }
