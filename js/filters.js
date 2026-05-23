// Aktywacja chipów filtra. Bo filtry galerii to obecnie tylko wizualny "tag" (nie ma jeszcze
// metadanych do prawdziwej selekcji zdjęć), ograniczamy się do przełączania klasy is-active.
// Na blogu działają realnie — pokazują/ukrywają karty wpisów po data-kicker.
(function () {
  function bindChipGroup(root, onPick) {
    const chips = root.querySelectorAll(".chip");
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        if (onPick) onPick(chip.dataset.filter);
      });
    });
  }

  // Galeria (na index.html) — tylko wizualnie.
  const gallery = document.querySelector(".gallery__filters");
  if (gallery) bindChipGroup(gallery);

  // Blog — filtrowanie kart po data-kicker.
  const blogFilters = document.querySelector(".filters__inner");
  if (blogFilters) {
    bindChipGroup(blogFilters, (filter) => {
      const grid = document.querySelector(".post-grid");
      if (!grid) return;
      const cards = grid.querySelectorAll(".post-card");
      cards.forEach((card) => {
        const match = filter === "Wszystko" || card.dataset.kicker === filter;
        card.style.display = match ? "" : "none";
      });
    });
  }
})();
