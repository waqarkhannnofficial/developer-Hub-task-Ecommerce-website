/**
 * Centralized product catalog shared across all pages.
 * Every UI component reads data from this single source instead of hardcoding values.
 */
(function () {
  const PRODUCT_SOURCE = {
    1: { name: "GoPro HERO6 4k Action Headphone", category: "Electronics", image: "Images/group1-item-headphone.jpg", price: "99.50" },
    2: { name: "Smart Watch Pro", category: "Electronics", image: "Images/group1-item-watch.jpg", price: "99.50" },
    3: { name: "Kitchen Mixer Pro", category: "Electronics", image: "Images/group1-item-mixer.jpg", price: "99.50" },
    4: { name: "Premium Perfume Collection", category: "Fashion", image: "Images/group1-item-purfume.jpg", price: "99.50" },
    5: { name: "Designer Purse", category: "Fashion", image: "Images/group1-item-purse.webp", price: "99.50" },
    6: { name: "Sports Shoes", category: "Shoes", image: "Images/group1-item-shoe.jpg", price: "99.50" },
    7: { name: "Ergonomic Chair", category: "Modern tech", image: "Images/group1-item-chair.jpg", price: "99.50" },
    8: { name: "Mobile Accessory Set", category: "Mobile accessory", image: "Images/recomend-item-01.png", price: "99.50" },
    9: { name: "Electronics Bundle", category: "Electronics", image: "Images/recomend-item-02.jpg", price: "99.50" },
    10: { name: "Smartphone Case", category: "smartphones", image: "Images/recomend-item-04.png", price: "99.50" },
    11: { name: "Mobile Charger", category: "Mobile accessory", image: "Images/recomend-item-03.png", price: "99.50" },
    12: { name: "Electronic Device", category: "Electronics", image: "Images/recomend-item-07.png", price: "99.50" },
    13: { name: "Shoe", category: "Shoes", image: "Images/sale-item-01.jpg", price: "99.50" },
    14: { name: "Headphone", category: "Electronics", image: "Images/sale-item-02.jpg", price: "99.50" },
    15: { name: "Perfume", category: "Fashion", image: "Images/sale-item-03.jpg", price: "99.50" },
    16: { name: "Smart Watch", category: "Electronics", image: "Images/sale-item-04.jpg", price: "99.50" },
    17: { name: "Watch", category: "Electronics", image: "Images/group1-item-watch.jpg", price: "19.00" },
    18: { name: "Kitchen mixer", category: "Electronics", image: "Images/group1-item-mixer.jpg", price: "19.00" },
    19: { name: "Soft chairs", category: "Modern tech", image: "Images/group1-item-chair.jpg", price: "19.00" },
    20: { name: "Gaming sets", category: "Electronics", image: "Images/group1-item-keyboard.jpg", price: "19.00" },
    21: { name: "headphone", category: "Electronics", image: "Images/group1-item-headphone.jpg", price: "19.00" },
    22: { name: "purfume", category: "Fashion", image: "Images/group1-item-purfume.jpg", price: "19.00" },
    23: { name: "bag", category: "Fashion", image: "Images/group1-item-purse.webp", price: "19.00" },
    24: { name: "shoes", category: "Shoes", image: "Images/group1-item-shoe.jpg", price: "19.00" },
    25: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-01.png", price: "10.30" },
    26: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-02.jpg", price: "10.30" },
    27: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-03.png", price: "10.30" },
    28: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-04.png", price: "10.30" },
    29: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-05.png", price: "10.30" },
    30: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-06.png", price: "10.30" },
    31: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-07.png", price: "10.30" },
    32: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-05.png", price: "10.30" },
    33: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-08.png", price: "10.30" },
    34: { name: "T-shirt with multiples colors,for men", category: "Fashion", image: "Images/recomend-item-09.png", price: "10.30" },
    35: { name: "Men Blazer sets", category: "Fashion", image: "Images/sale-item-01.jpg", price: "99.00" },
    36: { name: "Men Blazer sets", category: "Fashion", image: "Images/sale-item-01.jpg", price: "99.00" },
    37: { name: "Men Blazer sets", category: "Fashion", image: "Images/sale-item-01.jpg", price: "99.00" },
    38: { name: "Men Blazer sets", category: "Fashion", image: "Images/sale-item-01.jpg", price: "99.00" },
    39: { name: "Men Blazer sets", category: "Fashion", image: "Images/sale-item-01.jpg", price: "99.00" },
    40: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" },
    41: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" },
    42: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" },
    43: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" },
    44: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" },
    45: { name: "Xiamo Redmi 8 Original", category: "Electronics", image: "Images/recomend-item-04.png", price: "40.00" }
  };

  const PRODUCT_ENRICHMENTS = {
    1: { brand: "Samsung", color: "black", features: ["metalic", "super power"], verified: true },
    2: { brand: "iphone", color: "black", features: ["metalic", "large memory"], verified: true },
    3: { brand: "Techno", color: "orange", features: ["plastic cover", "super power"], verified: false },
    4: { brand: "Lenovo", color: "pink", features: ["metalic"], verified: true },
    5: { brand: "Real me", color: "khaki", features: ["plastic cover"], verified: false },
    6: { brand: "Samsung", color: "yellow", features: ["large memory"], verified: true },
    7: { brand: "Techno", color: "black", features: ["metalic", "plastic cover"], verified: true },
    8: { brand: "iphone", color: "pink", features: ["super power", "large memory"], verified: false },
    9: { brand: "Lenovo", color: "orange", features: ["metalic"], verified: true },
    10: { brand: "Real me", color: "khaki", features: ["plastic cover", "super power"], verified: true },
    11: { brand: "Samsung", color: "yellow", features: ["large memory"], verified: false },
    12: { brand: "iphone", color: "black", features: ["metalic", "plastic cover"], verified: true },
    13: { brand: "Stride", color: "black", features: ["breathable mesh"], verified: true },
    14: { brand: "SoundMax", color: "black", features: ["noise cancelation"], verified: true },
    15: { brand: "AromaLab", color: "pink", features: ["long lasting"], verified: true },
    16: { brand: "Chrono", color: "black", features: ["super power"], verified: true },
    17: { brand: "Chrono", color: "black", features: ["metalic"], verified: true },
    18: { brand: "KitchenHub", color: "orange", features: ["large memory"], verified: true },
    19: { brand: "HomePro", color: "khaki", features: ["ergonomic design"], verified: true },
    20: { brand: "GameOn", color: "black", features: ["RGB lighting"], verified: true },
    21: { brand: "SoundMax", color: "black", features: ["noise cancelation"], verified: true },
    22: { brand: "AromaLab", color: "pink", features: ["long lasting"], verified: true },
    23: { brand: "LuxeBag", color: "khaki", features: ["leather"], verified: true },
    24: { brand: "Stride", color: "yellow", features: ["breathable mesh"], verified: true },
    25: { brand: "FabricPro", color: "black", features: ["cotton"], verified: false },
    26: { brand: "FabricPro", color: "pink", features: ["cotton"], verified: false },
    27: { brand: "FabricPro", color: "orange", features: ["cotton"], verified: false },
    28: { brand: "FabricPro", color: "black", features: ["cotton"], verified: false },
    29: { brand: "FabricPro", color: "yellow", features: ["cotton"], verified: false },
    30: { brand: "FabricPro", color: "black", features: ["cotton"], verified: false },
    31: { brand: "FabricPro", color: "pink", features: ["cotton"], verified: false },
    32: { brand: "FabricPro", color: "orange", features: ["cotton"], verified: false },
    33: { brand: "FabricPro", color: "black", features: ["cotton"], verified: false },
    34: { brand: "FabricPro", color: "yellow", features: ["cotton"], verified: false },
    35: { brand: "Tailor Hub", color: "black", features: ["custom fit"], verified: true },
    40: { brand: "Mi", color: "black", features: ["fast charge"], verified: true }
  };

  const CATEGORY_PRESETS = {
    Electronics: {
      material: "Aluminium & ABS",
      design: "Modern sleek",
      customization: "Custom branding & packaging",
      protection: "Extended refund policy",
      warranty: "2 years full warranty",
      descriptionPrefix: "engineered for reliable performance and thoughtful ergonomics.",
      features: ["Fast worldwide shipping", "Rigorous QC before dispatch", "OEM/ODM friendly"]
    },
    Fashion: {
      material: "Premium textiles",
      design: "Contemporary cut",
      customization: "Private label options",
      protection: "Quality replacement policy",
      warranty: "1 year stitching warranty",
      descriptionPrefix: "crafted with premium textiles and clean finishing for all-day comfort.",
      features: ["Eco-friendly dyes", "Bulk friendly pricing", "Ready for seasonal drops"]
    },
    Shoes: {
      material: "Vegan leather",
      design: "Athleisure",
      customization: "Size & logo customization",
      protection: "Buyer protection program",
      warranty: "180 days manufacturing warranty",
      descriptionPrefix: "built for everyday wear with cushioning focused on long outings.",
      features: ["Breathable upper mesh", "Anti-slip rubber outsole", "Custom logo support"]
    },
    "Modern tech": {
      material: "Reinforced polymer",
      design: "Scandinavian minimal",
      customization: "Color swatch selection",
      protection: "Transit insurance",
      warranty: "3 years structural warranty",
      descriptionPrefix: "pairs minimalist design with practical ergonomics for modern spaces.",
      features: ["Tool-free assembly", "Durable matte coating", "Flexible MOQ"]
    },
    "Mobile accessory": {
      material: "ABS + Silicone",
      design: "Compact travel ready",
      customization: "Packaging & color",
      protection: "DOA replacement",
      warranty: "12 months warranty",
      descriptionPrefix: "keeps devices powered and protected with pocket-friendly builds.",
      features: ["Universal compatibility", "Smart chip safety", "Retail-ready box"]
    },
    smartphones: {
      material: "Polycarbonate shell",
      design: "Slim profile",
      customization: "Pattern & branding",
      protection: "Breakage assurance",
      warranty: "1 year warranty",
      descriptionPrefix: "brings minimalist protection with grippy finishes tailored for drops.",
      features: ["Raised camera lip", "Matte anti-fingerprint coat", "Shock absorbing edges"]
    },
    default: {
      material: "High grade composite",
      design: "Modern utility",
      customization: "Custom logo",
      protection: "Standard refund policy",
      warranty: "1 year warranty",
      descriptionPrefix: "offers reliable build quality with flexible wholesale options.",
      features: ["Responsive support", "Door-to-door logistics", "QC pictures before ship"]
    }
  };

  const SELLER_PROFILES = [
    { name: "Guanjol Trading LLC", country: "Germany", status: "Verified", feature: "Worldwide shipping" },
    { name: "Trendy Fashion Hub", country: "Italy", status: "Gold supplier", feature: "Private label support" },
    { name: "NextWave Electronics", country: "Singapore", status: "Verified", feature: "24h dispatch" },
    { name: "Urban Living Co", country: "United States", status: "Verified", feature: "Sustainable sourcing" }
  ];

  const DEFAULT_SHORT_INFO = [
    { label: "Price", value: "Negotiable" },
    { label: "Customization", value: "Logo & packaging" },
    { label: "Protection", value: "Refund policy" }
  ];

  function selectSeller(category) {
    if (category === "Fashion") return SELLER_PROFILES[1];
    if (category === "Electronics" || category === "Mobile accessory" || category === "smartphones") {
      return SELLER_PROFILES[2];
    }
    if (category === "Modern tech") return SELLER_PROFILES[3];
    return SELLER_PROFILES[0];
  }

  function buildTradePrices(price) {
    const base = Number(price);
    const tiers = [
      { label: "1-49 pcs", multiplier: 1 },
      { label: "50-99 pcs", multiplier: 0.95 },
      { label: "100+ pcs", multiplier: 0.9 }
    ];
    return tiers.map((tier) => ({
      label: tier.label,
      price: (base * tier.multiplier).toFixed(2)
    }));
  }

  function buildSpecs(id, categoryDefaults) {
    const baseId = `#5241${String(id).padStart(4, "0")}`;
    return [
      { label: "Model", value: baseId },
      { label: "Type", value: categoryDefaults.design },
      { label: "Material", value: categoryDefaults.material },
      { label: "Certification", value: "CE & ISO" },
      { label: "Origin", value: "OEM Partner" },
      { label: "Warranty", value: categoryDefaults.warranty }
    ];
  }

  function buildShortInfo(product, categoryDefaults) {
    return [
      ...DEFAULT_SHORT_INFO,
      { label: "Type", value: product.category },
      { label: "Material", value: categoryDefaults.material },
      { label: "Design", value: categoryDefaults.design },
      { label: "Warranty", value: categoryDefaults.warranty }
    ];
  }

  function buildFeatures(product, categoryDefaults) {
    const name = product.name.split(" ")[0];
    return [
      `${name} ${categoryDefaults.features[0] || "premium finishing"}`,
      categoryDefaults.features[1] || "Flexible MOQ with express lead-times",
      categoryDefaults.features[2] || "In-house QA on every batch"
    ];
  }

  function ensureGallery(product, extraGallery) {
    const gallery = extraGallery && extraGallery.length ? extraGallery : [];
    if (!gallery.includes(product.image)) {
      gallery.unshift(product.image);
    }
    return gallery.slice(0, 5);
  }

  function normalizeProduct(id, product) {
    const enriched = PRODUCT_ENRICHMENTS[id] || {};
    const categoryDefaults = CATEGORY_PRESETS[product.category] || CATEGORY_PRESETS.default;
    const price = Number(product.price);
    return {
      id: Number(id),
      name: product.name,
      category: product.category,
      image: product.image,
      price: price.toFixed(2),
      brand: enriched.brand || `${product.category} Co`,
      color: enriched.color || "black",
      features: enriched.features || categoryDefaults.features,
      verified: typeof enriched.verified === "boolean" ? enriched.verified : true,
      stockStatus: enriched.stockStatus || "In Stock",
      rating: enriched.rating || 4.5,
      reviews: enriched.reviews || 32,
      sold: enriched.sold || 150,
      description:
        enriched.description ||
        `${product.name} ${categoryDefaults.descriptionPrefix} Crafted for wholesalers needing dependable ${product.category.toLowerCase()} inventory.`,
      tradePrices: enriched.tradePrices || buildTradePrices(price),
      shortInfo: enriched.shortInfo || buildShortInfo(product, categoryDefaults),
      specs: enriched.specs || buildSpecs(id, categoryDefaults),
      featuresList: enriched.featuresList || buildFeatures(product, categoryDefaults),
      gallery: ensureGallery(product, enriched.gallery),
      seller: { ...selectSeller(product.category), ...(enriched.seller || {}) }
    };
  }

  const PRODUCT_MAP = Object.fromEntries(
    Object.entries(PRODUCT_SOURCE).map(([id, product]) => [Number(id), normalizeProduct(Number(id), product)])
  );

  const PRODUCT_LIST = Object.values(PRODUCT_MAP);

  function getProductById(id) {
    const numericId = Number(id);
    return PRODUCT_MAP[numericId] || null;
  }

  function getProductByName(name) {
    if (!name) return null;
    const needle = name.toLowerCase();
    return PRODUCT_LIST.find((p) => p.name.toLowerCase() === needle) || null;
  }

  function getProductsByCategory(category) {
    if (!category) return PRODUCT_LIST;
    const needle = category.toLowerCase();
    return PRODUCT_LIST.filter((p) => p.category.toLowerCase() === needle);
  }

  function getRelatedProducts(product, limit = 6) {
    if (!product) return PRODUCT_LIST.slice(0, limit);
    const sameCategory = PRODUCT_LIST.filter((p) => p.category === product.category && p.id !== product.id);
    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }
    const fallback = PRODUCT_LIST.filter((p) => p.id !== product.id);
    return [...sameCategory, ...fallback].slice(0, limit);
  }

  window.ProductStore = {
    list: PRODUCT_LIST,
    map: PRODUCT_MAP,
    getById: getProductById,
    getByName: getProductByName,
    getByCategory: getProductsByCategory,
    getRelated: getRelatedProducts
  };
})();

