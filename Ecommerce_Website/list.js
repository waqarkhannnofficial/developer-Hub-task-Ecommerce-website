// Filter functionality for product list page

const productCards = document.querySelectorAll('.item-card');
const contentItems = document.querySelector('.content-items');
const itemCountElement = document.getElementById('item-count');
const categoryNameElement = document.getElementById('category-name');

let filters = {
    category: null,
    brands: [],
    features: [],
    colors: [],
    searchTerm: '',
    verifiedOnly: false,
    sortBy: 'default'
};

document.addEventListener('DOMContentLoaded', function() {
    hydrateProductCards();
    applyQueryParams();
    initializeFilters();
    initializeProductClicks();
    bindGlobalSearchListener();
    updateDisplay();
});

function hydrateProductCards() {
    if (!window.ProductStore) return;
    productCards.forEach(card => {
        const productId = Number(card.getAttribute('data-product-id'));
        const product = ProductStore.getById(productId);
        if (!product) return;

        card.setAttribute('data-category', product.category);
        card.setAttribute('data-name', product.name);
        card.setAttribute('data-image', product.image);
        card.setAttribute('data-price', product.price);
        card.setAttribute('data-verified', product.verified);
        if (product.brand) {
            card.setAttribute('data-brand', product.brand);
        }
        if (product.features) {
            card.setAttribute('data-features', product.features.join(','));
        }
        if (product.color) {
            card.setAttribute('data-color', product.color);
        }

        const nameElement = card.querySelector('.item-text .about p');
        if (nameElement) {
            nameElement.textContent = product.name;
        }

        const priceElement = card.querySelector('.item-text .price h4');
        if (priceElement) {
            priceElement.textContent = `$${product.price}`;
        }

        const compareElement = card.querySelector('.item-text .price del');
        if (compareElement) {
            const comparePrice = (Number(product.price) * 1.3).toFixed(2);
            compareElement.textContent = `@${comparePrice}`;
        }

        const imageElement = card.querySelector('.item-image img');
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.name;
        }
    });
}

function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const category = params.get('category');

    if (search) {
        filters.searchTerm = search.toLowerCase();
    }

    if (category) {
        filters.category = resolveCategoryValue(category);
    }

    syncSearchControls(search || '', filters.category);
    updateActiveCategory();
}

function bindGlobalSearchListener() {
    window.addEventListener('global-search', (event) => {
        event.preventDefault();
        const { term, category } = event.detail;
        filters.searchTerm = term;
        filters.category = category && category !== 'all' ? resolveCategoryValue(category) : null;
        syncSearchControls(term, filters.category);
        updateActiveCategory();
        updateDisplay();
    });
}

function resolveCategoryValue(rawCategory) {
    if (!rawCategory || rawCategory === 'all') {
        return null;
    }
    const match = window.ProductStore?.list.find(product => product.category.toLowerCase() === rawCategory.toLowerCase());
    return match ? match.category : rawCategory;
}

function syncSearchControls(term, category) {
    const searchInput = document.getElementById('search-input');
    const searchCategory = document.getElementById('search-category');
    if (searchInput) {
        searchInput.value = term || '';
    }
    if (searchCategory) {
        const targetValue = category || 'all';
        const hasOption = Array.from(searchCategory.options).some(option => option.value === targetValue);
        searchCategory.value = hasOption ? targetValue : 'all';
    }
}

function initializeProductClicks() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            const productName = encodeURIComponent(this.getAttribute('data-name'));
            const productImage = encodeURIComponent(this.getAttribute('data-image'));
            const productCategory = encodeURIComponent(this.getAttribute('data-category'));
            const productPrice = this.getAttribute('data-price');
            
            window.location.href = `detail.html?id=${productId}&name=${productName}&image=${productImage}&category=${productCategory}&price=${productPrice}`;
        });
    });
}

function initializeFilters() {
    const categoryLinks = document.querySelectorAll('.category-filter');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filters.category = filters.category === category ? null : category;
            updateActiveCategory();
            updateDisplay();
        });
    });

    const brandIds = ['samsung', 'iphone', 'Techno', 'Lenovo'];
    brandIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const brand = getBrandName(this.id);
                if (this.checked) {
                    if (!filters.brands.includes(brand)) {
                        filters.brands.push(brand);
                    }
                } else {
                    filters.brands = filters.brands.filter(b => b !== brand);
                }
                updateDisplay();
            });
        }
    });
    
    const realMeCheckbox = document.getElementById('Real me');
    if (realMeCheckbox) {
        realMeCheckbox.addEventListener('change', function() {
            const brand = 'Real me';
            if (this.checked) {
                if (!filters.brands.includes(brand)) {
                    filters.brands.push(brand);
                }
            } else {
                filters.brands = filters.brands.filter(b => b !== brand);
            }
            updateDisplay();
        });
    }

    const featureIds = ['metalic'];
    featureIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const feature = this.id;
                if (this.checked) {
                    if (!filters.features.includes(feature)) {
                        filters.features.push(feature);
                    }
                } else {
                    filters.features = filters.features.filter(f => f !== feature);
                }
                updateDisplay();
            });
        }
    });
    
    const featureIdsWithSpaces = ['plastic cover', 'super power', 'large memory'];
    featureIdsWithSpaces.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const feature = this.id;
                if (this.checked) {
                    if (!filters.features.includes(feature)) {
                        filters.features.push(feature);
                    }
                } else {
                    filters.features = filters.features.filter(f => f !== feature);
                }
                updateDisplay();
            });
        }
    });

    const colorIds = ['black', 'orange', 'pink', 'khaki', 'yellow'];
    colorIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                const color = this.id;
                if (this.checked) {
                    if (!filters.colors.includes(color)) {
                        filters.colors.push(color);
                    }
                } else {
                    filters.colors = filters.colors.filter(c => c !== color);
                }
                updateDisplay();
            });
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filters.searchTerm = this.value.toLowerCase().trim();
            updateDisplay();
        });
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                filters.searchTerm = searchInput.value.toLowerCase().trim();
                updateDisplay();
            }
        });
    }

    const searchCategory = document.getElementById('search-category');
    if (searchCategory) {
        searchCategory.addEventListener('change', function() {
            const category = this.value;
            if (category === 'all') {
                filters.category = null;
            } else {
                filters.category = category;
            }
            updateActiveCategory();
            updateDisplay();
        });
    }

    const verifiedCheckbox = document.getElementById('verification');
    if (verifiedCheckbox) {
        verifiedCheckbox.addEventListener('change', function() {
            filters.verifiedOnly = this.checked;
            updateDisplay();
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            filters.sortBy = this.value;
            updateDisplay();
        });
    }
}

// Get brand name from checkbox ID
function getBrandName(id) {
    const brandMap = {
        'samsung': 'Samsung',
        'iphone': 'iphone',
        'Techno': 'Techno',
        'Lenovo': 'Lenovo',
        'Real me': 'Real me'
    };
    return brandMap[id] || id;
}

// Update active category styling
function updateActiveCategory() {
    const categoryLinks = document.querySelectorAll('.category-filter');
    categoryLinks.forEach(link => {
        const category = link.getAttribute('data-category');
        if (filters.category === category) {
            link.style.color = '#097cff';
            link.style.fontWeight = 'bold';
        } else {
            link.style.color = '#2e2c2c';
            link.style.fontWeight = 'normal';
        }
    });
}

// Main filter function
function filterProducts() {
    let visibleProducts = Array.from(productCards);

    // Filter by category
    if (filters.category) {
        visibleProducts = visibleProducts.filter(card => {
            return card.getAttribute('data-category') === filters.category;
        });
    }

    // Filter by brands
    if (filters.brands.length > 0) {
        visibleProducts = visibleProducts.filter(card => {
            const cardBrand = card.getAttribute('data-brand');
            return filters.brands.includes(cardBrand);
        });
    }

    // Filter by features
    if (filters.features.length > 0) {
        visibleProducts = visibleProducts.filter(card => {
            const featureAttr = card.getAttribute('data-features') || '';
            const cardFeatures = featureAttr.split(',').map(f => f.trim()).filter(Boolean);
            return filters.features.some(feature => cardFeatures.includes(feature));
        });
    }

    // Filter by colors
    if (filters.colors.length > 0) {
        visibleProducts = visibleProducts.filter(card => {
            const cardColor = card.getAttribute('data-color');
            return filters.colors.includes(cardColor);
        });
    }

    // Filter by search term
    if (filters.searchTerm) {
        visibleProducts = visibleProducts.filter(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            return productName.includes(filters.searchTerm);
        });
    }

    // Filter by verified only
    if (filters.verifiedOnly) {
        visibleProducts = visibleProducts.filter(card => {
            return card.getAttribute('data-verified') === 'true';
        });
    }

    return visibleProducts;
}

// Sort products
function sortProducts(products) {
    const sortedProducts = [...products];

    switch (filters.sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price'));
                const priceB = parseFloat(b.getAttribute('data-price'));
                return priceA - priceB;
            });
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price'));
                const priceB = parseFloat(b.getAttribute('data-price'));
                return priceB - priceA;
            });
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => {
                const nameA = a.getAttribute('data-name').toLowerCase();
                const nameB = b.getAttribute('data-name').toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => {
                const nameA = a.getAttribute('data-name').toLowerCase();
                const nameB = b.getAttribute('data-name').toLowerCase();
                return nameB.localeCompare(nameA);
            });
            break;
        default:
            // Keep original order
            break;
    }

    return sortedProducts;
}

// Update display
function updateDisplay() {
    // Filter products
    let visibleProducts = filterProducts();

    // Sort products
    visibleProducts = sortProducts(visibleProducts);

    // Hide all products first
    productCards.forEach(card => {
        card.style.display = 'none';
    });

    // Show visible products
    visibleProducts.forEach(card => {
        card.style.display = 'flex';
    });

    // Update item count
    const count = visibleProducts.length;
    if (itemCountElement) {
        itemCountElement.textContent = `${count} item${count !== 1 ? 's' : ''} in`;
    }

    // Update category name
    if (categoryNameElement) {
        if (filters.category) {
            categoryNameElement.textContent = filters.category;
        } else {
            categoryNameElement.textContent = 'All Categories';
        }
    }

    // If no products found, show message
    if (visibleProducts.length === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

// Show no results message
function showNoResultsMessage() {
    let noResultsMsg = document.getElementById('no-results-message');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-message';
        noResultsMsg.style.cssText = 'width: 100%; text-align: center; padding: 2rem; color: #8b96a5; font-size: 1.2rem;';
        noResultsMsg.textContent = 'No products found matching your filters.';
        contentItems.appendChild(noResultsMsg);
    }
}

// Hide no results message
function hideNoResultsMessage() {
    const noResultsMsg = document.getElementById('no-results-message');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

