import { products } from './products.js';

// Application State
let currentIndex = 0;
let isScrubbing = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const logoLink = document.getElementById('logoLink');
const scrollContainer = document.getElementById('scrollContainer');
const showcaseVideo = document.getElementById('showcaseVideo');
const productContentWrapper = document.getElementById('productContentWrapper');
const themeBlob = document.getElementById('themeBlob');

// Text Panels
const panels = {
  1: {
    el: document.getElementById('panel-1'),
    title: document.getElementById('panel-1-title'),
    subtitle: document.getElementById('panel-1-subtitle'),
    range: [0, 0.05, 0.15, 0.20]
  },
  2: {
    el: document.getElementById('panel-2'),
    title: document.getElementById('panel-2-title'),
    subtitle: document.getElementById('panel-2-subtitle'),
    range: [0.20, 0.25, 0.40, 0.45]
  },
  3: {
    el: document.getElementById('panel-3'),
    title: document.getElementById('panel-3-title'),
    subtitle: document.getElementById('panel-3-subtitle'),
    range: [0.45, 0.50, 0.65, 0.70]
  },
  4: {
    el: document.getElementById('panel-4'),
    title: document.getElementById('panel-4-title'),
    subtitle: document.getElementById('panel-4-subtitle'),
    range: [0.70, 0.75, 0.90, 0.95]
  }
};

// Dynamic Content Elements
const detailsTitle = document.getElementById('detailsTitle');
const detailsDesc = document.getElementById('detailsDesc');
const statsContainer = document.getElementById('statsContainer');
const freshnessTitle = document.getElementById('freshnessTitle');
const freshnessDesc = document.getElementById('freshnessDesc');
const featuresList = document.getElementById('featuresList');
const buyPrice = document.getElementById('buyPrice');
const buyUnit = document.getElementById('buyUnit');
const badgesWrapper = document.getElementById('badgesWrapper');
const deliveryPromise = document.getElementById('deliveryPromise');
const returnPolicy = document.getElementById('returnPolicy');
const continueBtn = document.getElementById('continueBtn');
const continueName = document.getElementById('continueName');

// Navigations
const prevArrow = document.getElementById('prevArrow');
const nextArrow = document.getElementById('nextArrow');
const bottomPillNav = document.getElementById('bottomPillNav');
const copyrightText = document.getElementById('copyrightText');

// Linear Interpolator Helper (Simulates Framer Motion transitions)
function interpolate(value, inputMin, inputMax, outputMin, outputMax) {
  if (value <= inputMin) return outputMin;
  if (value >= inputMax) return outputMax;
  return outputMin + ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin);
}

// Calculate and apply Panel transforms based on scroll progress
function updatePanelTransforms(progress) {
  Object.keys(panels).forEach(key => {
    const panel = panels[key];
    const [inStart, inPeakStart, inPeakEnd, inEnd] = panel.range;
    
    let opacity = 0;
    let translateY = 50;

    if (progress >= inStart && progress < inPeakStart) {
      // Fading In
      opacity = interpolate(progress, inStart, inPeakStart, 0, 1);
      translateY = interpolate(progress, inStart, inPeakStart, 50, 0);
    } else if (progress >= inPeakStart && progress <= inPeakEnd) {
      // Peak Active State
      opacity = 1;
      translateY = 0;
    } else if (progress > inPeakEnd && progress <= inEnd) {
      // Fading Out
      opacity = interpolate(progress, inPeakEnd, inEnd, 1, 0);
      translateY = interpolate(progress, inPeakEnd, inEnd, 0, -50);
    } else if (progress > inEnd) {
      // Faded Out Fully
      opacity = 0;
      translateY = -50;
    }

    panel.el.style.opacity = opacity;
    panel.el.style.transform = `translateY(${translateY}px)`;
    
    // Add/remove active classes for DOM structure
    if (opacity > 0) {
      panel.el.classList.add('active');
    } else {
      panel.el.classList.remove('active');
    }
  });
}

// High Performance Scroll / Video Scrub Logic
function handleScroll() {
  // 1. Toggle Navbar background highlight
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // 2. Video scrubbing
  if (!isScrubbing) {
    isScrubbing = true;
    requestAnimationFrame(() => {
      const scrollHeight = scrollContainer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / scrollHeight));

      if (showcaseVideo && showcaseVideo.duration) {
        showcaseVideo.currentTime = progress * showcaseVideo.duration;
      }

      // Update text panels
      updatePanelTransforms(progress);
      isScrubbing = false;
    });
  }
}

// Populate product metadata details into DOM templates
function populateProductData(product) {
  const nextProduct = products[(currentIndex + 1) % products.length];

  // Set brand / details content
  detailsTitle.textContent = product.detailsSection.title;
  detailsDesc.textContent = product.detailsSection.description;
  freshnessTitle.textContent = product.freshnessSection.title;
  freshnessDesc.textContent = product.freshnessSection.description;
  
  // Set Pricing cards
  buyPrice.textContent = product.buyNowSection.price;
  buyUnit.textContent = product.buyNowSection.unit;
  deliveryPromise.textContent = product.buyNowSection.deliveryPromise;
  returnPolicy.textContent = product.buyNowSection.returnPolicy;
  
  // Continue Journey Trigger button
  continueName.textContent = `Try ${nextProduct.name}`;

  // Populate dynamic stats counter list
  statsContainer.innerHTML = '';
  product.stats.forEach(stat => {
    const statBox = document.createElement('div');
    statBox.className = 'stat-box';
    
    const valueEl = document.createElement('span');
    valueEl.className = 'stat-value';
    valueEl.textContent = stat.val;

    const labelEl = document.createElement('span');
    labelEl.className = 'stat-label';
    labelEl.textContent = stat.label;

    statBox.appendChild(valueEl);
    statBox.appendChild(labelEl);
    statsContainer.appendChild(statBox);
  });

  // Populate dynamic features bullet list
  featuresList.innerHTML = '';
  product.features.forEach(feature => {
    const li = document.createElement('li');
    li.className = 'feature-item';

    const dot = document.createElement('div');
    dot.className = 'feature-dot';

    const text = document.createElement('span');
    text.textContent = feature;

    li.appendChild(dot);
    li.appendChild(text);
    featuresList.appendChild(li);
  });

  // Populate badge parameters
  badgesWrapper.innerHTML = '';
  product.buyNowSection.processingParams.forEach(param => {
    const span = document.createElement('span');
    span.className = 'param-badge';
    span.textContent = param;
    badgesWrapper.appendChild(span);
  });

  // Populate Scroll Panel Text
  panels[1].title.textContent = product.section1.title;
  panels[1].subtitle.textContent = product.section1.subtitle;

  panels[2].title.textContent = product.section2.title;
  panels[2].subtitle.textContent = product.section2.subtitle;

  panels[3].title.textContent = product.section3.title;
  panels[3].subtitle.textContent = product.section3.subtitle;

  panels[4].title.textContent = product.section4.title;
  panels[4].subtitle.textContent = product.section4.subtitle || "";
}

// Initialize dot indicator elements in bottom pill
function initDotNav() {
  bottomPillNav.innerHTML = '';
  products.forEach((product, idx) => {
    const dot = document.createElement('button');
    dot.className = `nav-dot ${idx === currentIndex ? 'active' : ''}`;
    dot.setAttribute('aria-label', `View ${product.name}`);
    dot.addEventListener('click', () => switchProduct(idx));
    bottomPillNav.appendChild(dot);
  });
}

// Fluid transition handler to update the page to a new product index
function switchProduct(index) {
  if (index === currentIndex) return;
  
  // Transition classes to hide panel sections and ease in new textures
  productContentWrapper.classList.add('transitioning');
  showcaseVideo.style.opacity = '0';
  
  currentIndex = index;
  const product = products[currentIndex];

  setTimeout(() => {
    // 1. Change CSS theme parameters
    document.documentElement.style.setProperty('--theme-color', product.themeColor);
    document.documentElement.style.setProperty('--background-gradient', product.gradient);

    // 2. Change video and preload
    showcaseVideo.src = product.videoPath;
    showcaseVideo.load();

    // 3. Reset viewport scroll back to start of screen
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 4. Fill text parameters in templates
    populateProductData(product);

    // 5. Update active dot menu classes
    const dots = bottomPillNav.querySelectorAll('.nav-dot');
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 6. Fade everything back in beautifully
    setTimeout(() => {
      productContentWrapper.classList.remove('transitioning');
      showcaseVideo.style.opacity = '0.88';
      handleScroll(); // Trigger initial scroll layouts
    }, 150);

  }, 350);
}

// Register Navigation Event Listeners
function registerEventListeners() {
  // Arrow navigations
  prevArrow.addEventListener('click', () => {
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    switchProduct(prevIndex);
  });

  nextArrow.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % products.length;
    switchProduct(nextIndex);
  });

  // Continue Journey footer trigger
  continueBtn.addEventListener('click', () => {
    const nextIndex = (currentIndex + 1) % products.length;
    switchProduct(nextIndex);
  });

  // Logo Reset
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchProduct(0);
  });

  // Standard Scroll listener
  window.addEventListener('scroll', handleScroll);

  // Cart click feedback
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const product = products[currentIndex];
    alert(`🎉 Awesome! ${product.name} (${product.price}) has been added to your cart.`);
  });

  // Navbar order button feedback
  document.getElementById('navOrderBtn').addEventListener('click', () => {
    const product = products[currentIndex];
    alert(`🛒 Opening checkout for ${product.name}!`);
  });

  // Video loaded metadata handler to guarantee scroll syncing
  showcaseVideo.addEventListener('loadedmetadata', () => {
    handleScroll();
  });
}

// Initial Bootstrap on Page load
function init() {
  // Auto-update footer copyright year
  copyrightText.innerHTML = `&copy; ${new Date().getFullYear()} Nano Banana. All rights reserved.`;

  const initialProduct = products[currentIndex];

  // Set CSS tokens
  document.documentElement.style.setProperty('--theme-color', initialProduct.themeColor);
  document.documentElement.style.setProperty('--background-gradient', initialProduct.gradient);

  // Load and play initial video context
  showcaseVideo.src = initialProduct.videoPath;
  showcaseVideo.load();

  // Populate templates
  populateProductData(initialProduct);
  initDotNav();
  registerEventListeners();

  // Initial Layout Setup
  setTimeout(() => {
    handleScroll();
  }, 100);
}

// Kickstart
document.addEventListener('DOMContentLoaded', init);
// Run init immediately if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
}
