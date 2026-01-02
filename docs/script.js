(() => {
  "use strict";

  window.addEventListener("error", (e) => {
    const dbg = document.getElementById("debugText");
    if (dbg) dbg.textContent = `JS error: ${e.message || e.type}`;
  });

  window.addEventListener("unhandledrejection", (e) => {
    const dbg = document.getElementById("debugText");
    if (dbg) dbg.textContent = `Promise error: ${String(e.reason || "")}`;
  });

  // Built-in food database (approx protein per serving).
  // Values are intentionally rough: vary by brand/recipe/portion.
  const FOOD_DB = [
    // Breakfast
    {
      id: "besan_chilla_2",
      mealType: "breakfast",
      name: "Besan chilla",
      serving: "2 chillas (medium)",
      protein: 16,
      sources: ["dal"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "moong_dal_cheela_2",
      mealType: "breakfast",
      name: "Moong dal cheela",
      serving: "2 cheelas (medium)",
      protein: 18,
      sources: ["dal"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "idli_sambar",
      mealType: "breakfast",
      name: "Idli + mild sambar",
      serving: "3 idlis + 3/4 cup sambar",
      protein: 14,
      sources: ["dal"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "poha_peanuts",
      mealType: "breakfast",
      name: "Poha with peanuts",
      serving: "1.5 cups",
      protein: 11,
      sources: ["peanuts"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "upma_milk",
      mealType: "breakfast",
      name: "Upma + milk",
      serving: "1.5 cups upma + 1 cup milk",
      protein: 16,
      sources: ["milk"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "egg_bhurji_2",
      mealType: "breakfast",
      name: "Egg bhurji (mild)",
      serving: "2 eggs",
      protein: 12,
      sources: ["eggs"],
      diet: "nonveg",
      tags: ["indian", "gentle"],
    },

    // Lunch
    {
      id: "dal_rice_dahi",
      mealType: "lunch",
      name: "Dal + rice + dahi",
      serving: "1 bowl dal + 1 cup rice + 1/2 cup dahi",
      protein: 24,
      sources: ["dal", "dahi"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "chana_roti",
      mealType: "lunch",
      name: "Chana masala (mild) + roti",
      serving: "1 bowl chana + 2 rotis",
      protein: 24,
      sources: ["chana"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "paneer_roti",
      mealType: "lunch",
      name: "Paneer bhurji (mild) + roti",
      serving: "150g paneer + 2 rotis",
      protein: 32,
      sources: ["paneer"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "chicken_curry_rice",
      mealType: "lunch",
      name: "Chicken curry (mild) + rice",
      serving: "150g cooked chicken + 1 cup rice",
      protein: 35,
      sources: ["chicken"],
      diet: "nonveg",
      tags: ["indian", "gentle"],
    },

    // Dinner
    {
      id: "khichdi_curd",
      mealType: "dinner",
      name: "Moong dal khichdi + curd",
      serving: "1.5 cups khichdi + 1/2 cup curd",
      protein: 22,
      sources: ["dal", "dahi"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "dal_roti",
      mealType: "dinner",
      name: "Dal + roti",
      serving: "1 bowl dal + 2 rotis",
      protein: 21,
      sources: ["dal"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "fish_curry_rice",
      mealType: "dinner",
      name: "Fish curry (mild) + rice",
      serving: "150g fish + 1 cup rice",
      protein: 33,
      sources: ["fish"],
      diet: "nonveg",
      tags: ["indian", "gentle"],
    },
    {
      id: "egg_curry_roti",
      mealType: "dinner",
      name: "Egg curry (mild) + roti",
      serving: "2 eggs + 2 rotis",
      protein: 20,
      sources: ["eggs"],
      diet: "nonveg",
      tags: ["indian", "gentle"],
    },

    // Snacks (aim gentle; avoid spicy/acidic in phrasing)
    {
      id: "dahi_1cup",
      mealType: "snack",
      name: "Dahi/curd (plain)",
      serving: "1 cup",
      protein: 10,
      sources: ["dahi"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "greek_yogurt_200g",
      mealType: "snack",
      name: "Greek yogurt (plain)",
      serving: "200g",
      protein: 18,
      sources: ["dahi"],
      diet: "veg",
      tags: ["gentle"],
    },
    {
      id: "milk_1cup",
      mealType: "snack",
      name: "Milk",
      serving: "1 cup",
      protein: 8,
      sources: ["milk"],
      diet: "veg",
      tags: ["gentle"],
    },
    {
      id: "milk_warm",
      mealType: "snack",
      name: "Warm milk",
      serving: "1 cup",
      protein: 8,
      sources: ["milk"],
      diet: "veg",
      tags: ["gentle"],
    },
    {
      id: "milk_oats",
      mealType: "breakfast",
      name: "Oats porridge with milk",
      serving: "1 bowl",
      protein: 12,
      sources: ["milk"],
      diet: "veg",
      tags: ["gentle"],
    },
    {
      id: "roasted_chana_halfcup",
      mealType: "snack",
      name: "Roasted chana",
      serving: "1/2 cup",
      protein: 10,
      sources: ["chana"],
      diet: "veg",
      tags: ["indian"],
    },
    {
      id: "paneer_100g",
      mealType: "snack",
      name: "Paneer cubes (soft)",
      serving: "100g",
      protein: 18,
      sources: ["paneer"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "paneer_bhurji_small",
      mealType: "snack",
      name: "Paneer bhurji (mild)",
      serving: "100g paneer",
      protein: 20,
      sources: ["paneer"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "paneer_curry_mild",
      mealType: "dinner",
      name: "Paneer curry (mild) + rice",
      serving: "150g paneer + 1 cup rice",
      protein: 32,
      sources: ["paneer"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "peanuts_30g",
      mealType: "snack",
      name: "Peanuts (lightly roasted)",
      serving: "30g",
      protein: 7,
      sources: ["peanuts"],
      diet: "veg",
      tags: ["indian"],
    },
    {
      id: "sattu_drink",
      mealType: "snack",
      name: "Sattu drink (gentle)",
      serving: "3 tbsp sattu in water",
      protein: 12,
      sources: ["chana"],
      diet: "veg",
      tags: ["indian", "gentle"],
    },
    {
      id: "soy_chunks_small",
      mealType: "snack",
      name: "Soy chunks (soft, cooked)",
      serving: "40g dry (cooked)",
      protein: 20,
      sources: ["soy"],
      diet: "veg",
      tags: ["gentle"],
    },

    // Light western-ish options (still gentle)
    {
      id: "scrambled_eggs_toast",
      mealType: "breakfast",
      name: "Scrambled eggs (soft) + toast",
      serving: "2 eggs + 1 slice toast",
      protein: 14,
      sources: ["eggs"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "egg_drop_soup",
      mealType: "snack",
      name: "Egg drop soup (mild)",
      serving: "1 bowl",
      protein: 10,
      sources: ["eggs"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "chicken_stew",
      mealType: "dinner",
      name: "Light chicken stew",
      serving: "1 bowl (small)",
      protein: 20,
      sources: ["chicken"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "chicken_soup",
      mealType: "snack",
      name: "Light chicken soup",
      serving: "1 bowl (small)",
      protein: 14,
      sources: ["chicken"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "chicken_rice_soup",
      mealType: "dinner",
      name: "Chicken rice soup (mild)",
      serving: "1 bowl",
      protein: 18,
      sources: ["chicken"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "fish_soup",
      mealType: "snack",
      name: "Mild fish soup",
      serving: "1 bowl (small)",
      protein: 14,
      sources: ["fish"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
    {
      id: "fish_steamed_rice",
      mealType: "lunch",
      name: "Steamed fish + rice",
      serving: "120g fish + 1 cup rice",
      protein: 28,
      sources: ["fish"],
      diet: "nonveg",
      tags: ["gentle"],
    },
    {
      id: "baked_fish_potato",
      mealType: "dinner",
      name: "Baked fish + mashed potato",
      serving: "120g fish + 1 cup potato",
      protein: 26,
      sources: ["fish"],
      diet: "nonveg",
      tags: ["western", "gentle"],
    },
  ];

  const MENU_SLOTS = [
    { key: "breakfast", label: "Breakfast", mealType: "breakfast" },
    { key: "lunch", label: "Lunch", mealType: "lunch" },
    { key: "dinner", label: "Dinner", mealType: "dinner" },
    { key: "snack1", label: "Snack 1", mealType: "snack" },
    { key: "snack2", label: "Snack 2", mealType: "snack" },
    { key: "snack3", label: "Snack 3", mealType: "snack" },
  ];

  const DEFAULT_TOLERANCE = { min: -5, max: 5 }; // +/- 5g around target

  const AGE_SCALE = {
    under60: 1.0,
    "60to75": 0.9,
    "76to85": 0.75,
    "85plus": 0.65,
  };

  const ULCER_AVOID_SOURCES = new Set(["peanuts"]);
  const ULCER_AVOID_WORDS = [
    "spicy",
    "fried",
    "pickle",
    "achaar",
    "chilli",
    "chili",
    "masala",
    "tandoori",
    "tomato",
    "lemon",
    "citrus",
    "vinegar",
  ];

  const SOURCE_MIN_OPTIONS = 4;
  const SOURCE_LABELS = {
    paneer: "paneer",
    dahi: "dahi/Greek yogurt",
    milk: "milk",
    dal: "dal",
    chana: "chana",
    eggs: "eggs",
    chicken: "chicken",
    fish: "fish",
    soy: "soy",
  };

  function $(id) {
    return document.getElementById(id);
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function normalizeNotes(s) {
    return (s || "")
      .toLowerCase()
      .split(/[,/]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function formatFraction(x) {
    // Friendly fractions for common scales.
    if (x >= 0.99) return "1";
    if (x >= 0.84) return "3/4";
    if (x >= 0.69) return "2/3";
    if (x >= 0.58) return "1/2";
    if (x >= 0.42) return "1/3";
    if (x >= 0.30) return "1/4";
    return "small";
  }

  function scaleNumber(n, scale) {
    // Round to a caregiver-friendly number (e.g., 0.75 cups, 1.5 cups).
    const v = n * scale;
    const rounded = Math.round(v * 4) / 4; // nearest 1/4
    // Trim trailing .0
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  }

  function scaleUnitText(numStr, unit, scale) {
    const n = Number(numStr);
    if (!Number.isFinite(n)) return null;
    const scaled = scaleNumber(n, scale);
    return `${scaled} ${unit}`;
  }

  function scaleServingText(serving, scale) {
    if (scale >= 0.99) return serving;

    // Try to scale common caregiver-readable patterns.
    // Examples:
    // - "1 cup" -> "0.75 cup"
    // - "1/2 cup" -> "0.5 cup" (kept as 0.5 after parsing)
    // - "2 eggs" -> "1.5 eggs" (we'll keep decimals; users can round if needed)
    // - "150g paneer" -> "112.5g paneer"
    // - "3 idlis + 3/4 cup sambar" -> scale each segment
    const parts = serving.split(/\s*\+\s*/);
    const scaledParts = parts.map((p) => {
      const s = p.trim();

      // Mixed fraction like "3/4 cup"
      let m = s.match(/^(\d+)\s*\/\s*(\d+)\s+(cup|cups)\b/i);
      if (m) {
        const frac = Number(m[1]) / Number(m[2]);
        return scaleUnitText(String(frac), m[3], scale) || s;
      }

      // Mixed fraction like "1/2 cup dahi"
      m = s.match(/^(\d+)\s*\/\s*(\d+)\s+(cup|cups|tbsp|tablespoon|tablespoons)\b(.*)$/i);
      if (m) {
        const frac = Number(m[1]) / Number(m[2]);
        const rest = (m[4] || "").trim();
        const scaled = scaleUnitText(String(frac), m[3], scale);
        return scaled ? `${scaled}${rest ? " " + rest : ""}` : s;
      }

      // Plain number + unit (cup/tbsp/g) with optional trailing description.
      m = s.match(/^(\d+(?:\.\d+)?)\s*(cup|cups|tbsp|g)\b(.*)$/i);
      if (m) {
        const rest = (m[3] || "").trim();
        const scaled = scaleUnitText(m[1], m[2], scale);
        return scaled ? `${scaled}${rest ? " " + rest : ""}` : s;
      }

      // Eggs / rotis / idlis / chillas / bowls
      m = s.match(/^(\d+(?:\.\d+)?)\s+(eggs?|rotis?|idlis?|chillas?|cheelas?|bowls?|bowl)\b(.*)$/i);
      if (m) {
        const rest = (m[3] || "").trim();
        const n = Number(m[1]);
        if (!Number.isFinite(n)) return s;
        const scaledN = scaleNumber(n, scale);
        return `${scaledN} ${m[2]}${rest ? " " + rest : ""}`;
      }

      // If we can't parse it, fall back to a clear but still caregiver-friendly prefix.
      if (scale <= 0.30) return `small portion: ${s}`;
      return `${formatFraction(scale)} portion: ${s}`;
    });

    return scaledParts.join(" + ");
  }

  function applyAgeScaling(meal, scale) {
    return {
      ...meal,
      protein: Math.round(meal.protein * scale),
      serving: scaleServingText(meal.serving, scale),
    };
  }

  function mealAllowedByDiet(meal, dietMode) {
    if (dietMode === "veg") return meal.diet === "veg";
    // nonveg mode allows both veg and nonveg entries (we only include eggs/chicken/fish as nonveg).
    return meal.diet === "veg" || meal.diet === "nonveg";
  }

  function mealAllowedByNotes(meal, notes) {
    if (!notes.length) return true;
    const text = (meal.name + " " + meal.serving).toLowerCase();

    // Simple keyword rules. Keep it conservative: only exclude when explicitly asked.
    const wantsLactoseFree = notes.includes("lactose-free") || notes.includes("dairy-free") || notes.includes("no dairy");
    if (wantsLactoseFree && (meal.sources.includes("dahi") || meal.sources.includes("milk") || meal.sources.includes("paneer")))
      return false;

    const wantsNoPeanuts = notes.includes("no peanuts") || notes.includes("peanut-free");
    if (wantsNoPeanuts && meal.sources.includes("peanuts")) return false;

    const wantsLowAcid = notes.includes("low-acid") || notes.includes("no acid");
    if (wantsLowAcid && text.includes("tomato")) return false;

    return true;
  }

  function mealAllowedByUlcerMode(meal, ulcerModeOn) {
    if (!ulcerModeOn) return true;
    if ((meal.sources || []).some((s) => ULCER_AVOID_SOURCES.has(s))) return false;
    const text = (meal.name + " " + meal.serving).toLowerCase();
    if (ULCER_AVOID_WORDS.some((w) => text.includes(w))) return false;
    return true;
  }

  function getSelectedDietMode(form) {
    const el = form.querySelector('input[name=\"dietMode\"]:checked');
    return el ? el.value : "veg";
  }

  function getSelectedProteinSources(form) {
    const checked = Array.from(form.querySelectorAll('input[type=\"checkbox\"][name=\"src\"]:checked')).map((i) => i.value);
    return new Set(checked);
  }

  function getUlcerMode(form) {
    const el = $("ulcerMode");
    return el ? Boolean(el.checked) : true;
  }

  function getAgeScale(form) {
    const sel = $("ageRange");
    const key = sel && sel.value ? sel.value : "under60";
    return AGE_SCALE[key] ?? 1.0;
  }

  function setNonVegControlsEnabled(form, enabled) {
    const nonVegEls = Array.from(form.querySelectorAll("[data-nonveg] input[type=\"checkbox\"][name=\"src\"]"));
    nonVegEls.forEach((cb) => {
      cb.disabled = !enabled;
      if (!enabled) cb.checked = false;
      const label = cb.closest(".check");
      if (label) label.dataset.disabled = String(!enabled);
    });
  }

  function scoreMeal(meal, preferredSources) {
    // Prefer meals that hit one or more preferred sources, and slightly prefer higher protein.
    const hitCount = (meal.sources || []).reduce((n, s) => n + (preferredSources.has(s) ? 1 : 0), 0);
    return hitCount * 100 + meal.protein;
  }

  function chooseOne(mealType, pool, preferredSources, alreadyPickedIds, hardRequiredSources = null) {
    const candidates = pool.filter((m) => m.mealType === mealType && !alreadyPickedIds.has(m.id));
    if (!candidates.length) return null;

    // If we're still missing a required source (e.g. eggs/chicken/fish), strongly bias toward meals that include it.
    // This avoids relying on randomness + post-filtering retries.
    let filtered = candidates;
    if (hardRequiredSources && hardRequiredSources.size > 0) {
      const want = filtered.filter((m) => (m.sources || []).some((s) => hardRequiredSources.has(s)));
      if (want.length) filtered = want;
    }

    const sorted = filtered.slice().sort((a, b) => scoreMeal(b, preferredSources) - scoreMeal(a, preferredSources));
    const top = sorted.slice(0, Math.min(4, sorted.length));
    return top[Math.floor(Math.random() * top.length)];
  }

  function totalProtein(menu) {
    return menu.reduce((sum, m) => sum + (m ? m.protein : 0), 0);
  }

  function sourcesUsed(menu) {
    return uniq(menu.flatMap((m) => (m ? m.sources : [])));
  }

  function buildPool({ dietMode, notes, ulcerModeOn, ageScale }) {
    return FOOD_DB
      .filter((m) => mealAllowedByDiet(m, dietMode) && mealAllowedByNotes(m, notes) && mealAllowedByUlcerMode(m, ulcerModeOn))
      .map((m) => applyAgeScaling(m, ageScale));
  }

  function countOptionsBySource(pool) {
    const counts = {};
    for (const m of pool) {
      for (const s of m.sources || []) {
        counts[s] = (counts[s] || 0) + 1;
      }
    }
    return counts;
  }

  function hasMinOptionsForSelectedSources(pool, preferredSources) {
    const counts = countOptionsBySource(pool);
    const missing = [];
    for (const s of preferredSources) {
      if (!SOURCE_LABELS[s]) continue;
      if ((counts[s] || 0) < SOURCE_MIN_OPTIONS) missing.push(`${SOURCE_LABELS[s]} (${counts[s] || 0}/${SOURCE_MIN_OPTIONS})`);
    }
    return { ok: missing.length === 0, missing };
  }

  function generateDailyMenu({ target, dietMode, preferredSources, notes, ulcerModeOn, ageScale }) {
    const toleranceMin = target + DEFAULT_TOLERANCE.min;
    const toleranceMax = target + DEFAULT_TOLERANCE.max;

    const pool = buildPool({ dietMode, notes, ulcerModeOn, ageScale }).filter(
      (m) => !(ulcerModeOn && (m.sources || []).some((s) => s === "peanuts")),
    );
    const haveTypes = new Set(pool.map((m) => m.mealType));

    // Must be able to fill each required slot type.
    const requiredTypes = uniq(MENU_SLOTS.map((s) => s.mealType));
    for (const t of requiredTypes) {
      if (!haveTypes.has(t)) {
        return {
          ok: false,
          message: `Not enough options to build a full menu with the current constraints.` ,
          suggestions: suggestFixes({ dietMode, preferredSources, notes, pool }),
        };
      }
    }

    const requestedNonVeg = new Set(["eggs", "chicken", "fish"]);
    const selectedNonVeg = new Set(Array.from(preferredSources).filter((s) => requestedNonVeg.has(s)));
    const requireOneSelectedNonVeg = dietMode === "nonveg" && selectedNonVeg.size > 0;

    // Try multiple attempts to hit the target range.
    // Approach:
    // - pick 1 breakfast/lunch/dinner
    // - pick 3 snacks
    // - if low, swap in higher-protein snacks (Greek yogurt/soy chunks/paneer) if allowed
    // - if high, swap in lower-protein snacks (milk/curd) if allowed
    let best = null;
    const attempts = 250;

    for (let k = 0; k < attempts; k++) {
      const pickedIds = new Set();
      const menu = [];
      const remainingRequired = new Set(selectedNonVeg);

      for (const slot of MENU_SLOTS) {
        const pick = chooseOne(
          slot.mealType,
          pool,
          preferredSources,
          pickedIds,
          requireOneSelectedNonVeg ? remainingRequired : null,
        );
        if (!pick) break;
        pickedIds.add(pick.id);
        menu.push(pick);

        if (requireOneSelectedNonVeg) {
          for (const s of pick.sources || []) remainingRequired.delete(s);
        }
      }
      if (menu.length !== MENU_SLOTS.length) continue;

      // Hard requirement: if user explicitly selected eggs/chicken/fish in Non-veg mode,
      // ensure at least one of those sources shows up somewhere in the day plan.
      if (requireOneSelectedNonVeg) {
        const used = new Set(sourcesUsed(menu));
        const hasOne = Array.from(selectedNonVeg).some((s) => used.has(s));
        if (!hasOne) continue;
      }

      // Adjust by swapping snacks up/down.
      let current = totalProtein(menu);
      const snackIndexes = [3, 4, 5];

      function swapSnack(direction) {
        // direction: +1 means need more protein, -1 means need less
        const snackCandidates = pool.filter((m) => m.mealType === "snack");
        if (!snackCandidates.length) return false;
        const idx = snackIndexes[Math.floor(Math.random() * snackIndexes.length)];
        const existing = menu[idx];
        const candidates = snackCandidates
          .filter((m) => m.id !== existing.id && !pickedIds.has(m.id))
          .map((m) => ({ m, delta: m.protein - existing.protein }))
          .filter((x) => (direction > 0 ? x.delta > 0 : x.delta < 0))
          .sort((a, b) => (direction > 0 ? b.delta - a.delta : a.delta - b.delta));

        if (!candidates.length) return false;
        const top = candidates.slice(0, Math.min(5, candidates.length));
        const next = top[Math.floor(Math.random() * top.length)].m;

        pickedIds.delete(existing.id);
        pickedIds.add(next.id);
        menu[idx] = next;
        current = totalProtein(menu);
        return true;
      }

      let guard = 0;
      while ((current < toleranceMin || current > toleranceMax) && guard < 20) {
        guard++;
        if (current < toleranceMin) {
          if (!swapSnack(+1)) break;
        } else if (current > toleranceMax) {
          if (!swapSnack(-1)) break;
        }
      }

      const total = totalProtein(menu);
      const dist = Math.min(Math.abs(total - target), 999);
      const within = total >= toleranceMin && total <= toleranceMax;

      // Track whether we had to use non-preferred sources.
      const used = new Set(sourcesUsed(menu));
      const preferredHits = Array.from(used).filter((s) => preferredSources.has(s)).length;
      const usedNonPreferred = Array.from(used).some((s) => !preferredSources.has(s));

      const candidate = { menu, total, within, dist, preferredHits, usedNonPreferred };
      if (!best) best = candidate;

      // Prefer within-tolerance, then closer, then more preferred hits.
      const bestScore = (best.within ? 10000 : 0) - best.dist * 10 + best.preferredHits;
      const candScore = (candidate.within ? 10000 : 0) - candidate.dist * 10 + candidate.preferredHits;
      if (candScore > bestScore) best = candidate;

      if (within && candidate.preferredHits >= Math.min(3, preferredSources.size)) {
        // Good enough; stop early.
        break;
      }
    }

    if (!best) {
      return {
        ok: false,
        message: `Couldn't generate a menu with the current constraints.`,
        suggestions: suggestFixes({ dietMode, preferredSources, notes, pool, ulcerModeOn }),
      };
    }

    const warnings = [];
    if (!best.within) {
      if (best.total > toleranceMax) {
        warnings.push(
          `Above target: aiming for ${target}g (tolerance ${toleranceMin}–${toleranceMax}g), but got ~${best.total}g. ` +
            `Consider smaller portions or swapping a snack to a lighter option (milk or curd).`,
        );
      } else if (best.total < toleranceMin) {
        warnings.push(
          `Below target: aiming for ${target}g (tolerance ${toleranceMin}–${toleranceMax}g), but got ~${best.total}g. ` +
            `Consider adding Greek yogurt/paneer/soy chunks, or an extra gentle snack.`,
        );
      }
    } else {
      warnings.push(`On target: ~${best.total}g (goal ${target}g, tolerance ${toleranceMin}–${toleranceMax}g).`);
    }

    // If user selected too few sources, we likely had to pull in other allowed items.
    if (preferredSources.size > 0 && best.usedNonPreferred) {
      warnings.push("Added additional sources to meet protein goal.");
    }

    const usedSources = sourcesUsed(best.menu);
    const debug = `diet=${dietMode} selected=[${Array.from(preferredSources).sort().join(",")}] used=[${usedSources.sort().join(",")}]`;
    if (!variety.ok && variety.missing.length) {
      warnings.push(`Limited variety for: ${variety.missing.join(", ")}.`);
    }

    return { ok: true, menu: best.menu, total: best.total, warnings, debug };
  }

  function suggestFixes({ dietMode, preferredSources, notes, pool, ulcerModeOn }) {
    const suggestions = [];
    const notesSet = new Set(notes);
    const wantsLactoseFree = notesSet.has("lactose-free") || notesSet.has("dairy-free") || notesSet.has("no dairy");
    if (wantsLactoseFree) {
      suggestions.push("If possible, remove lactose-free restriction or use lactose-free dairy alternatives (not modeled here).");
    } else {
      suggestions.push("Add dahi/Greek yogurt or paneer for an easy protein bump.");
    }

    if (dietMode === "veg") {
      suggestions.push("If you eat eggs, switch to Non-vegetarian and enable Eggs.");
      suggestions.push("Or enable Soy (soy chunks) for higher-protein vegetarian options.");
    } else {
      if (!preferredSources.has("eggs")) suggestions.push("Enable Eggs for a gentle high-protein option.");
      if (!preferredSources.has("chicken")) suggestions.push("Enable Chicken for easier protein targets.");
      if (!preferredSources.has("fish")) suggestions.push("Enable Fish if tolerated.");
    }

    if (ulcerModeOn) suggestions.push("If you're not in a flare, you can try turning off Ulcer-friendly mode to widen options.");

    // If pool is tiny, suggest loosening notes.
    if (pool && pool.length < 8) suggestions.push("Try removing some dietary notes to widen the options.");
    return suggestions;
  }

  function renderMenu(menu, { target, warnings }) {
    MENU_SLOTS.forEach((slot, idx) => {
      const item = menu[idx];
      const ideaEl = $("idea-" + slot.key);
      const metaEl = $("meta-" + slot.key);
      if (!item) {
        ideaEl.textContent = "—";
        metaEl.textContent = "";
        return;
      }
      ideaEl.textContent = item.name;
      metaEl.textContent = `${item.serving} • ~${item.protein}g protein`;
    });

    $("totalProtein").textContent = `~${totalProtein(menu)}g protein`;
    $("totalMeta").textContent = `Target ${target}g • tolerance ${target + DEFAULT_TOLERANCE.min}–${target + DEFAULT_TOLERANCE.max}g`;

    const warningEl = $("warningText");
    warningEl.textContent = warnings && warnings.length ? warnings.join(" ") : "";
  }

  function renderFailure({ message, suggestions }, { target }) {
    // Clear cards but keep labels; show message in helper area.
    MENU_SLOTS.forEach((slot) => {
      $("idea-" + slot.key).textContent = "No menu generated";
      $("meta-" + slot.key).textContent = "";
    });
    $("totalProtein").textContent = `Target ~${target}g`;
    $("totalMeta").textContent = "Try adjusting constraints";

    const helper = $("helperText");
    helper.textContent = message;

    const warningEl = $("warningText");
    warningEl.textContent = suggestions && suggestions.length ? `Suggestions: ${suggestions.join(" ")}` : "";
  }

  function init() {
    const form = $("generatorForm");
    const proteinInput = $("proteinTarget");
    const notesInput = $("dietaryNotes");
    const btn = $("generateBtn");

    function syncDietUI() {
      const mode = getSelectedDietMode(form);
      setNonVegControlsEnabled(form, mode === "nonveg");
    }

    form.addEventListener("change", (e) => {
      if (e.target && e.target.name === "dietMode") syncDietUI();
    });
    syncDietUI();

    // Ensure the CTA always generates, even if the browser doesn't submit the form for any reason.
    if (btn) {
      btn.addEventListener("click", (e) => {
        // If it's a submit button, the form handler will run too; prevent double-run.
        e.preventDefault();
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const target = clamp(Number(proteinInput.value || 70), 0, 300);
      const notesText = notesInput.value || "";
      const notes = normalizeNotes(notesText);
      const dietMode = getSelectedDietMode(form);
      const preferredSources = getSelectedProteinSources(form);
      const ulcerModeOn = getUlcerMode(form);
      const ageScale = getAgeScale(form);

      const result = generateDailyMenu({ target, dietMode, preferredSources, notes, ulcerModeOn, ageScale });

      if (result.ok) {
        renderMenu(result.menu, { target, warnings: result.warnings });
        const helper = $("helperText");
        const noteBit = notesText.trim() ? ` Notes: ${notesText.trim()}` : "";
        helper.textContent = `Daily Menu generated for ${dietMode === "veg" ? "Vegetarian" : "Non-vegetarian"} mode.${noteBit}`;

        const dbg = $("debugText");
        if (dbg) dbg.textContent = result.debug || "";
      } else {
        renderFailure(result, { target });
        const dbg = $("debugText");
        if (dbg) dbg.textContent = `diet=${dietMode} selected=[${Array.from(preferredSources).sort().join(",")}] used=[]`;
      }

      document.documentElement.classList.remove("pulse");
      void document.documentElement.offsetHeight;
      document.documentElement.classList.add("pulse");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
