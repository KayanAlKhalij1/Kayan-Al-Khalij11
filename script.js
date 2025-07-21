// Carousel images (add all relevant asset filenames here)
const carouselImages = [
  'Screenshot 2025-07-20 213250_1753036605407.png', // صورة المبنى أول صورة
  'assets/image_1753078573470.png',
  'assets/Screenshot 2025-07-20 213250_1753036903982.png',
  'assets/Screenshot 2025-07-20 213311_1753036903982.png',
  'assets/Screenshot 2025-07-20 213323_1753036903981.png',
  'assets/Screenshot 2025-07-20 213337_1753036903980.png',
  'assets/Screenshot 2025-07-20 213351_1753036896131.png',
  'assets/Screenshot 2025-07-20 213404_1753036896130.png',
  'assets/Screenshot 2025-07-20 213415_1753036896130.png',
  'assets/Screenshot 2025-07-20 213428_1753036896129.png',
  'assets/Screenshot 2025-07-20 213440_1753036896129.png',
  'assets/Screenshot 2025-07-20 213452_1753036896128.png',
  'assets/Screenshot 2025-07-20 213507_1753036896128.png',
  'assets/WhatsApp Image 2025-07-08 at 17.49.46_02d7f189_1753025271754.jpg',
  'assets/WhatsApp Image 2025-07-08 at 18.01.36_0910b8ca_1753025271753.jpg',
  'assets/WhatsApp Image 2025-07-08 at 18.02.26_00b5aec9_1753025271752.jpg'
];

// Add professional WebP images from CDN
carouselImages.push(
  'Screenshot 2025-07-20 213250_1753036605407.png', // Modern tower
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', // Glass building
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', // Cladding
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80', // Skyscraper
  'https://images.unsplash.com/photo-1460474647541-4edd0cd0c746?auto=format&fit=crop&w=800&q=80'  // Glass work
);

let currentIndex = 0;
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function showImage(index) {
  carousel.innerHTML = '';
  const img = document.createElement('img');
  img.src = carouselImages[index];
  img.alt = `Gallery Image ${index + 1}`;
  carousel.appendChild(img);
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
  showImage(currentIndex);
});
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  showImage(currentIndex);
});

// Initialize carousel
showImage(currentIndex);

// Fetch gallery images from backend
fetch('http://localhost:4000/api/gallery')
  .then(res => res.json())
  .then(images => {
    window.galleryImages = images;
    updateGalleryCarousel();
  });

function updateGalleryCarousel() {
  if (!window.galleryImages) return;
  let currentIndex = 0;
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  function showImage(index) {
    carousel.innerHTML = '';
    const img = document.createElement('img');
    img.src = window.galleryImages[index].url;
    img.alt = window.galleryImages[index].title || `Gallery Image ${index + 1}`;
    carousel.appendChild(img);
  }
  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
    showImage(currentIndex);
  };
  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % window.galleryImages.length;
    showImage(currentIndex);
  };
  showImage(currentIndex);
}

// Fetch products and projects from backend and update sections
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:4000/api/products')
    .then(res => res.json())
    .then(products => {
      const grid = document.querySelector('.products-grid');
      grid.innerHTML = '';
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.nameAr}">
          <h3>${product.nameAr}</h3>
          <p>${product.descAr}</p>
        `;
        grid.appendChild(card);
      });
    });
  fetch('http://localhost:4000/api/projects')
    .then(res => res.json())
    .then(projects => {
      const grid = document.querySelector('.projects-grid');
      grid.innerHTML = '';
      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <img src="${project.image}" alt="${project.nameAr}">
          <h3>${project.nameAr}</h3>
          <p>${project.descAr}</p>
        `;
        grid.appendChild(card);
      });
    });
});

// Contact form submission to backend
const contactForm = document.querySelector('.contact-form');
const formSuccess = document.getElementById('form-success');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value
    };
    fetch('http://localhost:4000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(response => {
        if (response.success) {
          formSuccess.style.display = 'block';
          formSuccess.textContent = 'تم إرسال رسالتك بنجاح! سنعود إليك قريباً.';
          contactForm.reset();
        } else {
          formSuccess.style.display = 'block';
          formSuccess.textContent = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.';
        }
      }).catch(() => {
        formSuccess.style.display = 'block';
        formSuccess.textContent = 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.';
      });
  });
}

// Language switching logic using data-i18n
const translations = {};

// Load translations and set language on page load
function loadAndSetLanguage() {
  fetch('translations.json')
    .then(res => res.json())
    .then(data => {
      Object.assign(translations, data);
      const savedLang = localStorage.getItem('siteLang') || document.documentElement.lang || 'ar';
      setLanguage(savedLang);
    });
}

function setLanguage(lang) {
  const t = translations[lang] || {};
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.setAttribute('lang', lang);
  localStorage.setItem('siteLang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
}

const langToggle = document.getElementById('lang-toggle');
const langDropdown = document.getElementById('lang-dropdown');

if (langToggle && langDropdown) {
  langToggle.addEventListener('click', () => {
    langDropdown.style.display = langDropdown.style.display === 'none' ? 'flex' : 'none';
  });
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      langDropdown.style.display = 'none';
    });
  });
}

// Apply language on every page load
window.addEventListener('DOMContentLoaded', loadAndSetLanguage);

// Carousel logic for Home page
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/kayan-static/') {
  const images = [
    'assets/image_1753078573470.png',
    'assets/Screenshot 2025-07-20 213250_1753036903982.png',
    'assets/Screenshot 2025-07-20 213311_1753036903982.png',
    'assets/Screenshot 2025-07-20 213323_1753036903981.png',
    'assets/Screenshot 2025-07-20 213337_1753036903980.png',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', // Modern tower
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80', // Glass building
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80', // Cladding
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80', // Skyscraper
    'https://images.unsplash.com/photo-1460474647541-4edd0cd0c746?auto=format&fit=crop&w=800&q=80'  // Glass work
  ];
  let current = 0;
  const carousel = document.getElementById('carousel');
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  function showImage(idx) {
    carousel.innerHTML = '';
    const img = document.createElement('img');
    img.src = images[idx];
    img.alt = 'معرض كيان الخليج';
    carousel.appendChild(img);
  }
  prev?.addEventListener('click', () => {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
  });
  next?.addEventListener('click', () => {
    current = (current + 1) % images.length;
    showImage(current);
  });
  showImage(current);
}

// Section reveal animation
function setupSectionReveal() {
  const reveals = document.querySelectorAll('section, .product-card, .project-card');
  function onScroll() {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) el.classList.add('revealed');
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
}
setupSectionReveal();

// Cookie consent banner
function showCookieBanner() {
  if (localStorage.getItem('cookieConsent')) return;
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <span class="cookie-message">هذا الموقع يستخدم الكوكيز لتحسين تجربتك.</span>
    <button class="cookie-btn">موافق</button>
  `;
  document.body.appendChild(banner);
  banner.querySelector('.cookie-btn').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    banner.remove();
  });
}
showCookieBanner();

// Tab navigation for .main-nav and .quick-links
function setupTabNavigation() {
  // Main nav
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  // Quick links
  const quickLinks = document.querySelectorAll('.quick-links .quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', function() {
      quickLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        quickLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}
setupTabNavigation(); 