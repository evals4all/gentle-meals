(() => {
  "use strict";

  const MEALS = [
    {
      slot: "breakfast",
      title: "Oatmeal + gentle protein",
      idea: "Warm oatmeal with banana + stirred-in Greek yogurt",
      protein: 20,
      tags: ["breakfast", "dairy"],
    },
    {
      slot: "breakfast",
      title: "Soft eggs",
      idea: "Scrambled eggs with spinach + soft toast",
      protein: 18,
      tags: ["breakfast", "eggs"],
    },
    {
      slot: "breakfast",
      title: "Smoothie (low-acid)",
      idea: "Milk (or lactose-free) smoothie: oats + banana + peanut butter",
      protein: 22,
      tags: ["breakfast", "dairy", "lactose-free"],
    },

    {
      slot: "lunch",
      title: "Chicken & rice",
      idea: "Chicken and rice bowl with steamed zucchini",
      protein: 30,
      tags: ["lunch"],
    },
    {
      slot: "lunch",
      title: "Tuna salad (gentle)",
      idea: "Tuna mixed with a little yogurt + cucumber, served with crackers",
      protein: 28,
      tags: ["lunch", "fish"],
    },
    {
      slot: "lunch",
      title: "Tofu rice bowl",
      idea: "Silken tofu over rice with steamed bok choy + sesame",
      protein: 22,
      tags: ["lunch", "vegetarian", "vegan"],
    },

    {
      slot: "dinner",
      title: "Salmon plate",
      idea: "Baked salmon with mashed potatoes + carrots",
      protein: 32,
      tags: ["dinner", "fish"],
    },
    {
      slot: "dinner",
      title: "Turkey + pasta",
      idea: "Ground turkey with pasta + steamed green beans (skip acidic sauce)",
      protein: 34,
      tags: ["dinner"],
    },
    {
      slot: "dinner",
      title: "Lentil soup (mild)",
      idea: "Mild lentil soup with rice on the side",
      protein: 20,
      tags: ["dinner", "vegetarian", "vegan"],
    },

    {
      slot: "snack",
      title: "Cottage cheese",
      idea: "Cottage cheese with sliced peaches (or lactose-free option)",
      protein: 14,
      tags: ["snack", "dairy"],
    },
    {
      slot: "snack",
      title: "Turkey + crackers",
      idea: "Turkey slices + plain crackers + cucumber",
      protein: 15,
      tags: ["snack"],
    },
    {
      slot: "snack",
      title: "Edamame",
      idea: "Shelled edamame with a pinch of salt (skip chili)",
      protein: 17,
      tags: ["snack", "vegetarian", "vegan"],
    },
  ];

  const SLOTS = [
    { key: "breakfast", label: "Breakfast" },
    { key: "breakfast2", label: "Breakfast" },
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
    { key: "snack", label: "Snack" },
    { key: "snack2", label: "Snack" },
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function normalizeNotes(s) {
    return (s || "")
      .toLowerCase()
      .split(/[,/]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function matchesNotes(meal, notes) {
    if (!notes.length) return true;

    // Simple, explicit rules (no external data). If a note matches a meal tag, we keep it.
    const tags = new Set(meal.tags || []);

    // A few helpful aliases.
    const alias = new Map([
      ["veggie", "vegetarian"],
      ["veg", "vegetarian"],
      ["no dairy", "lactose-free"],
      ["dairy-free", "lactose-free"],
    ]);

    const normalized = notes.map((n) => alias.get(n) || n);

    // If the user requests vegetarian/vegan/lactose-free, filter accordingly.
    if (normalized.includes("vegetarian") && !tags.has("vegetarian") && !tags.has("vegan")) return false;
    if (normalized.includes("vegan") && !tags.has("vegan")) return false;
    if (normalized.includes("lactose-free") && tags.has("dairy") && !tags.has("lactose-free")) return false;

    return true;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickIdeas({ targetProtein, notes }) {
    const filtered = MEALS.filter((m) => matchesNotes(m, notes));
    const pool = filtered.length ? filtered : MEALS;

    // Heuristic: for higher targets, bias toward higher-protein picks.
    const biasHighProtein = Number.isFinite(targetProtein) && targetProtein >= 90;

    const bySlot = {
      breakfast: pool.filter((m) => m.slot === "breakfast"),
      lunch: pool.filter((m) => m.slot === "lunch"),
      dinner: pool.filter((m) => m.slot === "dinner"),
      snack: pool.filter((m) => m.slot === "snack"),
    };

    function pickOne(list) {
      if (!list.length) return null;
      const candidates = biasHighProtein ? list.slice().sort((a, b) => b.protein - a.protein) : shuffle(list);
      // For biased mode, still add some randomness from the top.
      const top = candidates.slice(0, Math.min(3, candidates.length));
      return top[Math.floor(Math.random() * top.length)];
    }

    const picks = [];
    picks.push(pickOne(bySlot.breakfast));
    picks.push(pickOne(bySlot.breakfast));
    picks.push(pickOne(bySlot.lunch));
    picks.push(pickOne(bySlot.dinner));
    picks.push(pickOne(bySlot.snack));
    picks.push(pickOne(bySlot.snack));

    // Ensure we have no nulls and reduce obvious duplicates.
    const seen = new Set();
    return picks.map((p) => {
      if (!p) return null;
      const key = p.title + "|" + p.idea;
      if (!seen.has(key)) {
        seen.add(key);
        return p;
      }
      // Try to find an alternative with the same slot.
      const altList = pool.filter((m) => m.slot === p.slot);
      const alt = shuffle(altList).find((m) => !seen.has(m.title + "|" + m.idea));
      if (alt) {
        seen.add(alt.title + "|" + alt.idea);
        return alt;
      }
      return p;
    });
  }

  function renderIdeas(ideas, { targetProtein, notesText }) {
    const total = ideas.filter(Boolean).reduce((sum, m) => sum + (m.protein || 0), 0);

    SLOTS.forEach((slot, idx) => {
      const meal = ideas[idx];
      const ideaEl = $("idea-" + slot.key);
      const metaEl = $("meta-" + slot.key);

      if (!meal) {
        ideaEl.textContent = "No matching ideas found. Try removing some notes.";
        metaEl.textContent = "";
        return;
      }

      ideaEl.textContent = meal.idea;
      metaEl.textContent = `~${meal.protein}g protein`;
    });

    const helper = $("helperText");
    const target = Number.isFinite(targetProtein) ? targetProtein : 70;
    const noteBit = notesText.trim() ? ` Notes: ${notesText.trim()}` : "";
    helper.textContent = `Generated ~${total}g protein across these six ideas (target ${target}g).${noteBit}`;
  }

  function init() {
    const form = $("generatorForm");
    const proteinInput = $("proteinTarget");
    const notesInput = $("dietaryNotes");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const targetProtein = Number(proteinInput.value);
      const notesText = notesInput.value || "";
      const notes = normalizeNotes(notesText);

      const ideas = pickIdeas({ targetProtein, notes });
      renderIdeas(ideas, { targetProtein, notesText });

      // Small visual cue that the cards updated.
      document.documentElement.classList.remove("pulse");
      void document.documentElement.offsetHeight;
      document.documentElement.classList.add("pulse");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
