/* Shared basket state. Persisted in localStorage (same key as v1 so existing baskets survive). */
var Store = (function () {
  var KEY = "kumaran_estimate_v1", qty = {}, subs = [];
  try { var s = JSON.parse(localStorage.getItem(KEY) || "{}"); if (s && typeof s === "object") qty = s; } catch (e) { qty = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(qty)); } catch (e) {} }
  function emit() { save(); subs.forEach(function (f) { f(); }); }
  function clamp(v) { return Math.max(0, Math.min(999, v | 0)); }
  function lines() {
    var out = [];
    PRODUCTS.forEach(function (p) { var q = qty[p.no] | 0; if (q > 0) out.push({p: p, q: q, amt: q * p.rate}); });
    return out;
  }
  return {
    get: function (no) { return qty[no] | 0; },
    set: function (no, v) { v = clamp(v); if (v) qty[no] = v; else delete qty[no]; emit(); },
    add: function (no, n) { this.set(no, (qty[no] | 0) + n); },
    clear: function () { qty = {}; emit(); },
    lines: lines,
    total: function () { return lines().reduce(function (a, l) { return a + l.amt; }, 0); },
    count: function () { return lines().reduce(function (a, l) { return a + l.q; }, 0); },
    subscribe: function (f) { subs.push(f); }
  };
})();
