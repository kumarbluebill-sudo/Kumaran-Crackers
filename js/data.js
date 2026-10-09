/* Config + catalogue metadata. Product rows live in products.js (verified against the OCT 2026 PDF). */
var CONFIG = {
  WA_NUMBER: "919487007583",
  WA_DISPLAY: "94870 07583",
  THRESHOLD: 5000,
  // Delivery charge in INR. Keep null until confirmed by the business; nothing is shown while null.
  DELIVERY_CHARGE: null
};
var PRODUCTS = window.PRODUCTS_DATA || [];
var FEATURED = window.POPULAR_DATA || [1, 11, 20, 39, 46, 58, 104, 107];
/* Category tiles shown on the home page and as shop chips. Every catalogue category belongs to one group. */
var GROUPS = [
  {key: "flower-pots", name: "Flower Pots", cats: ["Flower Pots"], icon: "🌸", hue: 24},
  {key: "sparklers", name: "Sparklers", cats: ["Sparklers"], icon: "✨", hue: 44},
  {key: "rockets", name: "Rockets", cats: ["Sky Divers"], icon: "🚀", hue: 350},
  {key: "fountains", name: "Fountains", cats: ["Rocking Fountain"], icon: "⛲", hue: 200},
  {key: "sky-shots", name: "Sky Shots & Aerials", cats: ["Sky Shots", "SPL Sky Fancy", "Night Aerials"], icon: "🎆", hue: 270},
  {key: "sound", name: "Sound Crackers & Bombs", cats: ["Sound Crackers", "Salt & Peppers", "Bombs", "Poppers"], icon: "💥", hue: 8},
  {key: "garlands", name: "Garlands", cats: ["Garlands"], icon: "🎇", hue: 140},
  {key: "wheels", name: "Wheels, Sticks & Matches", cats: ["Firing Wheels", "Sticks & Threads", "Matches"], icon: "🌀", hue: 170},
  {key: "gift-boxes", name: "Gift Boxes", cats: ["Gift Boxes"], icon: "🎁", hue: 330}
];
var ICON = {"Sound Crackers":"💥","Flower Pots":"🌸","Firing Wheels":"🌀","Salt & Peppers":"🧂","Garlands":"🎇","Bombs":"💣","Poppers":"🎉","Matches":"🔥","Sticks & Threads":"✨","Sky Divers":"🚀","Rocking Fountain":"⛲","Night Aerials":"🌌","SPL Sky Fancy":"🎆","Sky Shots":"🌈","Gift Boxes":"🎁","Sparklers":"✨"};
function groupOfCat(c) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].cats.indexOf(c) > -1) return GROUPS[i]; return null; }
function groupByKey(k) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].key === k) return GROUPS[i]; return null; }
/* Availability: "Available" (default), "Check availability" (can be added, flagged) or "Unavailable" (cannot be added). */
function availOf(p) { return p.avail || "Available"; }
