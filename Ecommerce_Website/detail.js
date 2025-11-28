document.addEventListener("DOMContentLoaded", () => {
  const product = resolveProduct();
  renderProductDetail(product);
  renderRelatedSections(product);
  initializeRelatedProductClicks();
  initializeAddToCartButton(product);
});

function resolveProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const name = params.get("name") ? decodeURIComponent(params.get("name")) : null;

  if (id && window.ProductStore) {
    const productById = ProductStore.getById(id);
    if (productById) return productById;
  }

  if (name && window.ProductStore) {
    const productByName = ProductStore.getByName(name);
    if (productByName) return productByName;
  }

  return window.ProductStore ? ProductStore.list[0] : null;
}

function renderProductDetail(product) {
  if (!product) return;

  updateBreadcrumb(product);
  updateHeroSection(product);
  updatePricing(product);
  updateKeyFacts(product);
  updateDetailSection(product);
  updateSellerInfo(product);
}

function updateBreadcrumb(product) {
  const breadcrumbLinks = document.querySelectorAll(".bread-cump a");
  if (breadcrumbLinks.length >= 3) {
    breadcrumbLinks[1].textContent = product.category;
    breadcrumbLinks[2].textContent = product.name;
  }
}

function updateHeroSection(product) {
  const productImage = document.querySelector(".product-image img");
  if (productImage) {
    productImage.src = product.image;
    productImage.alt = product.name;
  }

  const gallery = document.querySelector(".product-gallery");
  if (gallery) {
    gallery.innerHTML = "";
    product.gallery.forEach((imageSrc) => {
      const wrapper = document.createElement("div");
      wrapper.className = "image";
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = product.name;
      wrapper.appendChild(img);
      gallery.appendChild(wrapper);
    });
  }

  const availability = document.querySelector(".product-info .available");
  if (availability) {
    availability.textContent = product.stockStatus;
  }

  const productTitle = document.querySelector(".product-info .title h3");
  if (productTitle) {
    productTitle.textContent = product.name;
  }

  const stars = document.querySelector(".rating .stars");
  if (stars) {
    const ratingRounded = Math.round(product.rating);
    stars.textContent = "★".repeat(ratingRounded) + "☆".repeat(5 - ratingRounded);
  }

  const reviews = document.querySelector(".rating .reviews span");
  if (reviews) {
    reviews.textContent = `${product.reviews} reviews`;
  }

  const sold = document.querySelector(".rating .sold p");
  if (sold) {
    sold.textContent = `${product.sold} sold`;
  }
}

function updatePricing(product) {
  const tradePrice = document.querySelector(".trade-price");
  if (tradePrice) {
    tradePrice.innerHTML = "";
    product.tradePrices.forEach((tier) => {
      const tierDiv = document.createElement("div");
      const price = document.createElement("b");
      price.textContent = `$${tier.price}`;
      const range = document.createElement("p");
      range.textContent = tier.label;
      tierDiv.appendChild(price);
      tierDiv.appendChild(range);
      tradePrice.appendChild(tierDiv);
    });
  }
}

function updateKeyFacts(product) {
  const shortInfo = document.querySelector(".short-info");
  if (shortInfo) {
    shortInfo.innerHTML = "";
    product.shortInfo.forEach((entry) => {
      const row = document.createElement("p");
      const labelSpan = document.createElement("span");
      labelSpan.textContent = entry.label;
      const valueSpan = document.createElement("span");
      valueSpan.textContent = entry.value;
      row.append(labelSpan, document.createTextNode(" :  "), valueSpan);
      shortInfo.appendChild(row);
    });
  }
}

function updateDetailSection(product) {
  const descriptionElement = document.querySelector(".detail-desc p");
  if (descriptionElement) {
    descriptionElement.textContent = product.description;
  }

  const detailInfo = document.querySelector(".detail-info");
  if (detailInfo) {
    detailInfo.innerHTML = "";
    product.specs.forEach((spec) => {
      const specDiv = document.createElement("div");
      const label = document.createElement("p");
      label.textContent = spec.label;
      specDiv.appendChild(label);
      specDiv.append(` ${spec.value}`);
      detailInfo.appendChild(specDiv);
    });
  }

  const featureContainer = document.querySelector(".detail-features");
  if (featureContainer) {
    featureContainer.innerHTML = "";
    product.featuresList.forEach((feature) => {
      const featureItem = document.createElement("p");
      featureItem.textContent = feature;
      featureContainer.appendChild(featureItem);
    });
  }
}

function updateSellerInfo(product) {
  const seller = product.seller;
  const initials = seller.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sellerLogo = document.querySelector(".seller-profile .logo h1");
  if (sellerLogo) {
    sellerLogo.textContent = initials;
  }

  const sellerName = document.querySelector(".seller-profile .seller-desc p");
  if (sellerName) {
    sellerName.textContent = seller.name;
  }

  const sellerBadge = document.querySelector(".seller-profile .seller-desc h2");
  if (sellerBadge) {
    sellerBadge.textContent = seller.status || "Supplier";
  }

  const sellerLocation = document.querySelector(".seller-location p");
  if (sellerLocation) {
    sellerLocation.textContent = seller.country;
  }

  const sellerStatus = document.querySelector(".seller-status p");
  if (sellerStatus) {
    sellerStatus.textContent = seller.status;
  }

  const sellerFeature = document.querySelector(".seller-feature p");
  if (sellerFeature) {
    sellerFeature.textContent = seller.feature;
  }
}

function renderRelatedSections(product) {
  const relatedProducts = window.ProductStore ? ProductStore.getRelated(product, 8) : [];
  if (!relatedProducts.length) return;
  const asideItems = document.querySelectorAll(".aside-item.related-product");
  const recomItems = document.querySelectorAll(".recom-item.related-product");

  asideItems.forEach((item, index) => {
    populateRelatedCard(item, relatedProducts[index] || relatedProducts[0]);
  });

  recomItems.forEach((item, index) => {
    const productData = relatedProducts[index % relatedProducts.length];
    populateRelatedCard(item, productData);
  });
}

function populateRelatedCard(element, product) {
  if (!element || !product) return;
  element.setAttribute("data-product-id", product.id);
  element.setAttribute("data-category", product.category);
  element.setAttribute("data-name", product.name);
  element.setAttribute("data-image", product.image);
  element.setAttribute("data-price", product.price);

  const imageElement = element.querySelector("img");
  if (imageElement) {
    imageElement.src = product.image;
    imageElement.alt = product.name;
  }

  const nameElement = element.querySelector(".aside-item-name p, .item-name p");
  if (nameElement) {
    nameElement.textContent = product.name;
  }

  const priceElement = element.querySelector(".aside-item-price p, .item-price p");
  if (priceElement) {
    priceElement.textContent = `$${product.price}`;
  }
}

function initializeRelatedProductClicks() {
  const relatedProducts = document.querySelectorAll(".related-product");
  relatedProducts.forEach((product) => {
    product.style.cursor = "pointer";
    product.addEventListener("click", function (e) {
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

function initializeAddToCartButton(product) {
  if (!product) return;

  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const buyNowBtn = document.getElementById("buy-now-btn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (window.CartManager) {
        const added = window.CartManager.addToCart(product, 1);
        if (added) {
          // Show success message
          const originalText = addToCartBtn.innerHTML;
          addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
          addToCartBtn.style.backgroundColor = "#28a745";
          setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.backgroundColor = "#0d6efd";
          }, 2000);

          // Update cart badge if exists
          if (window.CartManager.updateBadge) {
            window.CartManager.updateBadge();
          }
        }
      } else {
        // Fallback: redirect to cart with product
        window.location.href = `cart.html?add=${product.id}`;
      }
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      if (window.CartManager) {
        window.CartManager.addToCart(product, 1);
        window.location.href = "cart.html";
      } else {
        window.location.href = `cart.html?add=${product.id}`;
      }
    });
  }
}