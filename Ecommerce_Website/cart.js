/**
 * Cart Management System
 * Handles cart operations: add, remove, update quantity, calculate totals, coupons, saved items
 */

(function() {
  'use strict';

  // Cart Storage Keys
  const CART_STORAGE_KEY = 'ecommerce_cart';
  const SAVED_ITEMS_STORAGE_KEY = 'ecommerce_saved_items';
  const COUPON_STORAGE_KEY = 'ecommerce_applied_coupon';

  // Tax rate (8%)
  const TAX_RATE = 0.08;

  // Valid coupon codes
  const COUPONS = {
    'SAVE10': { discount: 10, type: 'percent' },
    'SAVE20': { discount: 20, type: 'percent' },
    'FLAT50': { discount: 50, type: 'fixed' },
    'WELCOME15': { discount: 15, type: 'percent' }
  };

  // Cart State
  let cart = [];
  let savedItems = [];
  let appliedCoupon = null;

  // DOM Elements
  let cartContainer, savedContainer, summaryContainer;
  let emptyCartMessage, emptySavedMessage;

  // Initialize cart on page load
  document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    initializeDOMElements();
    renderCart();
    renderSavedItems();
    updateSummary();
    attachEventListeners();
    initializeFromURL();
  });

  // Load data from localStorage
  function loadCartData() {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      const savedData = localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
      const couponData = localStorage.getItem(COUPON_STORAGE_KEY);

      cart = cartData ? JSON.parse(cartData) : [];
      savedItems = savedData ? JSON.parse(savedData) : [];
      appliedCoupon = couponData ? JSON.parse(couponData) : null;
    } catch (error) {
      console.error('Error loading cart data:', error);
      cart = [];
      savedItems = [];
      appliedCoupon = null;
    }
  }

  // Save data to localStorage
  function saveCartData() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving cart data:', error);
    }
  }

  // Initialize DOM element references
  function initializeDOMElements() {
    cartContainer = document.querySelector('.my-carts');
    savedContainer = document.querySelector('.recommended-cart-items .items-container');
    summaryContainer = document.querySelector('.aside-summary');
    
    if (!cartContainer || !summaryContainer) {
      console.error('Required DOM elements not found');
    }
  }

  // Initialize from URL parameters (for add to cart from other pages)
  function initializeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('add');
    const quantity = parseInt(params.get('quantity')) || 1;

    if (productId) {
      // Wait for ProductStore to be available
      const checkProductStore = setInterval(() => {
        if (window.ProductStore) {
          clearInterval(checkProductStore);
          const product = ProductStore.getById(productId);
          if (product) {
            addToCart(product, quantity);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }, 100);

      // Timeout after 3 seconds
      setTimeout(() => clearInterval(checkProductStore), 3000);
    }
  }

  // Add product to cart
  function addToCart(product, quantity = 1) {
    if (!product) return false;

    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: parseFloat(product.price),
        category: product.category,
        quantity: quantity,
        seller: product.seller?.name || 'Generic Supplier',
        material: product.seller?.material || 'Standard',
        color: product.color || 'Default',
        size: 'Medium'
      });
    }

    saveCartData();
    renderCart();
    updateSummary();
    updateCartBadge();
    return true;
  }

  // Remove item from cart
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartData();
    renderCart();
    updateSummary();
    updateCartBadge();
  }

  // Update item quantity
  function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = Math.max(1, Math.min(99, newQuantity));
        saveCartData();
        renderCart();
        updateSummary();
      }
    }
  }

  // Save item for later
  function saveForLater(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    const item = cart[itemIndex];
    const existingSavedIndex = savedItems.findIndex(saved => saved.id === item.id);

    if (existingSavedIndex === -1) {
      savedItems.push({ ...item });
    }

    removeFromCart(productId);
    renderSavedItems();
  }

  // Move saved item to cart
  function moveToCart(productId) {
    const savedIndex = savedItems.findIndex(item => item.id === productId);
    if (savedIndex === -1) return;

    const item = savedItems[savedIndex];
    addToCart(item, item.quantity || 1);
    savedItems.splice(savedIndex, 1);
    saveCartData();
    renderSavedItems();
  }

  // Remove from saved items
  function removeFromSaved(productId) {
    savedItems = savedItems.filter(item => item.id !== productId);
    saveCartData();
    renderSavedItems();
  }

  // Remove all items from cart
  function removeAll() {
    if (cart.length === 0) return;
    if (confirm('Are you sure you want to remove all items from your cart?')) {
      cart = [];
      saveCartData();
      renderCart();
      updateSummary();
      updateCartBadge();
    }
  }

  // Apply coupon
  function applyCoupon(couponCode) {
    const coupon = COUPONS[couponCode.toUpperCase()];
    if (coupon) {
      appliedCoupon = { code: couponCode.toUpperCase(), ...coupon };
      saveCartData();
      updateSummary();
      return true;
    }
    return false;
  }

  // Remove coupon
  function removeCoupon() {
    appliedCoupon = null;
    saveCartData();
    updateSummary();
  }

  // Calculate cart totals
  function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = (subtotal * appliedCoupon.discount) / 100;
      } else {
        discount = Math.min(appliedCoupon.discount, subtotal);
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const tax = subtotalAfterDiscount * TAX_RATE;
    const total = subtotalAfterDiscount + tax;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  }

  // Render cart items
  function renderCart() {
    if (!cartContainer) return;

    // Remove existing empty message
    if (emptyCartMessage) {
      emptyCartMessage.remove();
      emptyCartMessage = null;
    }

    // Clear existing items (keep buttons container)
    const existingItems = cartContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    const buttonsContainer = cartContainer.querySelector('.more-btns');
    const buttonsParent = buttonsContainer ? buttonsContainer.parentNode : cartContainer;

    if (cart.length === 0) {
      // Show empty cart message
      emptyCartMessage = document.createElement('div');
      emptyCartMessage.className = 'empty-cart-message';
      emptyCartMessage.style.cssText = 'text-align: center; padding: 3rem; color: #8b96a5;';
      emptyCartMessage.innerHTML = `
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button id="back-to-shop" style="margin-top: 1rem; padding: 0.75rem 2rem; background: #0d6efd; color: white; border: none; border-radius: 7px; cursor: pointer;">Back to Shop</button>
      `;
      buttonsParent.insertBefore(emptyCartMessage, buttonsContainer);

      // Attach back to shop handler
      const backBtn = emptyCartMessage.querySelector('#back-to-shop');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          window.location.href = 'main.html';
        });
      }
    } else {
      // Render cart items
      cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        buttonsParent.insertBefore(cartItem, buttonsContainer);
      });
    }
  }

  // Create cart item element
  function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.setAttribute('data-product-id', item.id);

    const itemTotal = (item.price * item.quantity).toFixed(2);

    div.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-desc">
        <h2>${item.name}</h2>
        <p>
          Size: <span>${item.size}</span> 
          Color: <span>${item.color}</span>
          Material: <span>${item.material}</span> 
          Seller: <span>${item.seller}</span>
        </p>
        <div class="btns">
          <button class="remove-btn" data-product-id="${item.id}">Remove</button>
          <button class="save-btn" data-product-id="${item.id}">Save for later</button>
        </div>
      </div>
      <div class="item-price">$${itemTotal}</div>
      <select class="item-quantity" data-product-id="${item.id}">
        ${Array.from({ length: 99 }, (_, i) => i + 1)
          .map(qty => `<option value="${qty}" ${qty === item.quantity ? 'selected' : ''}>Qty:${qty}</option>`)
          .join('')}
      </select>
    `;

    // Attach event listeners
    const removeBtn = div.querySelector('.remove-btn');
    const saveBtn = div.querySelector('.save-btn');
    const quantitySelect = div.querySelector('.item-quantity');

    removeBtn.addEventListener('click', () => removeFromCart(item.id));
    saveBtn.addEventListener('click', () => saveForLater(item.id));
    quantitySelect.addEventListener('change', (e) => {
      updateQuantity(item.id, parseInt(e.target.value));
    });

    return div;
  }

  // Render saved items
  function renderSavedItems() {
    if (!savedContainer) return;

    // Remove existing empty message
    if (emptySavedMessage) {
      emptySavedMessage.remove();
      emptySavedMessage = null;
    }

    // Clear container
    savedContainer.innerHTML = '';

    if (savedItems.length === 0) {
      emptySavedMessage = document.createElement('div');
      emptySavedMessage.className = 'empty-saved-message';
      emptySavedMessage.style.cssText = 'text-align: center; padding: 2rem; color: #8b96a5; width: 100%;';
      emptySavedMessage.textContent = 'No saved items';
      savedContainer.appendChild(emptySavedMessage);
    } else {
      savedItems.forEach(item => {
        const savedCard = createSavedItemElement(item);
        savedContainer.appendChild(savedCard);
      });
    }
  }

  // Create saved item element
  function createSavedItemElement(item) {
    const div = document.createElement('div');
    div.className = 'item-card saved-item-card';
    div.setAttribute('data-product-id', item.id);

    div.innerHTML = `
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-price">$${item.price}</div>
      <div class="item-name">
        <p>${item.name}</p>
      </div>
      <button class="cart-btn move-to-cart-btn" data-product-id="${item.id}">
        Move to cart
      </button>
      <button class="remove-saved-btn" data-product-id="${item.id}" style="margin: 0.5rem 1rem; padding: 0.5rem; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Remove</button>
    `;

    // Attach event listeners
    const moveBtn = div.querySelector('.move-to-cart-btn');
    const removeBtn = div.querySelector('.remove-saved-btn');

    moveBtn.addEventListener('click', () => moveToCart(item.id));
    removeBtn.addEventListener('click', () => removeFromSaved(item.id));

    return div;
  }

  // Update summary section
  function updateSummary() {
    if (!summaryContainer) return;

    const totals = calculateTotals();

    summaryContainer.innerHTML = `
      <p>Subtotal: <span>$${totals.subtotal}</span></p>
      <p>Discount: <span>$${totals.discount}</span></p>
      <p>Tax: <span>$${totals.tax}</span></p>
      <p style="font-weight: bold; font-size: 1.2rem;">Total: <span>$${totals.total}</span></p>
      ${appliedCoupon ? `<p style="color: green;">Coupon: ${appliedCoupon.code} applied</p>` : ''}
      <button id="checkout-btn">Checkout</button>
    `;

    // Attach checkout handler
    const checkoutBtn = summaryContainer.querySelector('#checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          alert('Your cart is empty!');
          return;
        }
        alert(`Checkout functionality - Total: $${totals.total}\nThis would redirect to payment page in a real application.`);
      });
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    // Back to shop button
    const backBtn = document.getElementById('back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'main.html';
      });
    }

    // Remove all button
    const removeAllBtn = document.getElementById('remove-all');
    if (removeAllBtn) {
      removeAllBtn.addEventListener('click', removeAll);
    }

    // Coupon form
    const couponInput = document.querySelector('.cuopon input[type="search"]');
    const couponBtn = document.querySelector('.cuopon button');
    
    if (couponBtn && couponInput) {
      couponBtn.addEventListener('click', () => {
        const couponCode = couponInput.value.trim();
        if (!couponCode) {
          alert('Please enter a coupon code');
          return;
        }

        if (applyCoupon(couponCode)) {
          couponInput.value = '';
          alert(`Coupon "${appliedCoupon.code}" applied successfully!`);
        } else {
          alert('Invalid coupon code. Valid codes: SAVE10, SAVE20, FLAT50, WELCOME15');
        }
      });

      couponInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          couponBtn.click();
        }
      });
    }
  }

  // Update cart badge (if exists on other pages)
  function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-action .badge');
    if (cartBadge) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
  }

  // Expose functions globally for use from other pages
  window.CartManager = {
    addToCart: addToCart,
    getCart: () => cart,
    getCartItemCount: () => cart.reduce((sum, item) => sum + item.quantity, 0),
    updateBadge: updateCartBadge
  };

  // Update badge on load
  updateCartBadge();
})();
