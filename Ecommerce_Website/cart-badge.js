/**
 * Cart Badge Updater
 * Updates cart badge on all pages that include this script
 */
(function() {
  'use strict';

  const CART_STORAGE_KEY = 'ecommerce_cart';

  function updateCartBadge() {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      const cart = cartData ? JSON.parse(cartData) : [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

      const cartBadges = document.querySelectorAll('.cart-action .badge');
      cartBadges.forEach(badge => {
        if (totalItems > 0) {
          badge.textContent = totalItems;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      });
    } catch (error) {
      console.error('Error updating cart badge:', error);
    }
  }

  // Update badge on page load
  document.addEventListener('DOMContentLoaded', updateCartBadge);

  // Update badge when storage changes (for cross-tab updates)
  window.addEventListener('storage', (e) => {
    if (e.key === CART_STORAGE_KEY) {
      updateCartBadge();
    }
  });

  // Expose function globally
  window.updateCartBadge = updateCartBadge;

  // Also update badge when CartManager is available
  if (window.CartManager) {
    window.CartManager.updateBadge = updateCartBadge;
  }
})();

