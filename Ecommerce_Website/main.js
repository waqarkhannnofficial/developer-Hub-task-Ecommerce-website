document.addEventListener("DOMContentLoaded", function () {
  hydrateProductCards();
  initializeProductClicks();
});

function hydrateProductCards() {
  if (!window.ProductStore) return;
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const productId = Number(card.getAttribute("data-product-id"));
    const product = ProductStore.getById(productId);
    if (!product) return;

    card.setAttribute("data-category", product.category);
    card.setAttribute("data-name", product.name);
    card.setAttribute("data-image", product.image);
    card.setAttribute("data-price", product.price);
    if (product.brand) {
      card.setAttribute("data-brand", product.brand);
    }
    if (product.color) {
      card.setAttribute("data-color", product.color);
    }
    card.setAttribute("data-verified", product.verified);

    updateCardContent(card, product);
  });
}

function updateCardContent(card, product) {
  const nameSelectors = [".item-title h3", ".item-info p", ".left h4", ".item-name p", ".item-text .about p"];
  nameSelectors.forEach((selector) => {
    const element = card.querySelector(selector);
    if (element) {
      element.textContent = product.name;
    }
  });

  const priceSelectors = [".item-info .item-price h4", ".item-desc .item-price p", ".item-text .price h4"];
  priceSelectors.forEach((selector) => {
    const element = card.querySelector(selector);
    if (element) {
      element.textContent = `$${product.price}`;
    }
  });

  const locationPrice = card.querySelector(".left .location p");
  if (locationPrice) {
    locationPrice.textContent = `USD ${product.price}`;
  }

  const imageElement = card.querySelector("img");
  if (imageElement) {
    imageElement.src = product.image;
    imageElement.alt = product.name;
  }
}

function initializeProductClicks() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", function (e) {
      if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
        return;
      }

      const productId = this.getAttribute("data-product-id");
      const productName = encodeURIComponent(this.getAttribute("data-name"));
      const productImage = encodeURIComponent(this.getAttribute("data-image"));
      const productCategory = encodeURIComponent(this.getAttribute("data-category"));
      const productPrice = this.getAttribute("data-price");

      window.location.href = `detail.html?id=${productId}&name=${productName}&image=${productImage}&category=${productCategory}&price=${productPrice}`;
    });
  });
}
