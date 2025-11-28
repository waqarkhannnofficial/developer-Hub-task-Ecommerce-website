/**
 * Shared UI helpers (search + filtering) used across all pages.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    attachHeaderSearch();
  });

  function attachHeaderSearch() {
    const searchForm = document.querySelector(".search-form");
    if (!searchForm) return;

    const pageType = document.body?.dataset?.page || "default";
    const handleInputLocally = pageType !== "list";
    const searchInput = searchForm.querySelector('input[type="search"]');
    const categorySelect = searchForm.querySelector("select");
    const searchButton = searchForm.querySelector("#search-btn");

    const submitSearch = (event) => {
      if (event) event.preventDefault();
      const term = (searchInput?.value || "").trim().toLowerCase();
      const category = (categorySelect?.value || "all").toLowerCase();

      const searchEvent = new CustomEvent("global-search", {
        detail: { term, category },
        cancelable: true
      });

      const prevented = !window.dispatchEvent(searchEvent);
      if (prevented) {
        return;
      }

      const filteredLocally = filterPageProducts(term, category);
      if (filteredLocally && filteredLocally.matched > 0) {
        return;
      }

      const params = new URLSearchParams();
      if (term) params.set("search", term);
      if (category && category !== "all") params.set("category", category);
      window.location.href = `list.html${params.toString() ? `?${params.toString()}` : ""}`;
    };

    searchButton?.addEventListener("click", submitSearch);
    searchForm.addEventListener("submit", submitSearch);

    searchInput?.addEventListener("input", () => {
      if (!handleInputLocally) return;
      if (!searchInput.value.trim()) {
        filterPageProducts("", "all");
      }
    });
  }

  function filterPageProducts(term, category) {
    const filterableSelectors = [".product-card", ".related-product"];
    const cards = Array.from(document.querySelectorAll(filterableSelectors.join(",")));
    if (!cards.length) return null;

    const normalizedCategory = category && category !== "all" ? category : null;
    let matches = 0;

    cards.forEach((card) => {
      const cardCategory = (card.getAttribute("data-category") || "").toLowerCase();
      const cardName = (card.getAttribute("data-name") || card.textContent || "").toLowerCase();

      const categoryMatch = !normalizedCategory || cardCategory === normalizedCategory;
      const nameMatch = !term || cardName.includes(term);

      if (categoryMatch && nameMatch) {
        card.style.removeProperty("display");
        matches++;
      } else if (term || normalizedCategory) {
        card.style.display = "none";
      } else {
        card.style.removeProperty("display");
      }
    });

    const feedback = document.querySelector("[data-filter-feedback]");
    if (feedback) {
      feedback.textContent = matches === 0 && (term || normalizedCategory) ? "No local items match this search." : "";
    }

    if (matches === 0 && (term || normalizedCategory)) {
      cards.forEach((card) => card.style.removeProperty("display"));
    }

    return { cards, matched: matches };
  }
})();

