// Kayan Al Khalij - Enhanced JavaScript with Animations and Professional Features
// Version: 2.0.0

// Initialize libraries safely
function initializeLibraries() {
  try {
    // Check if AOS is available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        delay: 0
      });
    }
    
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
      // GSAP animations will be initialized later
    }
  } catch (error) {
    console.log('Libraries not loaded, continuing without them');
  }
}

// Initialize AOS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initializeLibraries();
  }, 100);
});

// Enhanced carousel images with local content only
const carouselImages = [
  'Screenshot 2025-07-20 213311_1753036903982.png',
  'Screenshot 2025-07-20 213323_1753036903981.png',
  'Screenshot 2025-07-20 213337_1753036903980.png',
  'Screenshot 2025-07-20 213351_1753036896131.png',
  'Screenshot 2025-07-20 213404_1753036896130.png',
  'Screenshot 2025-07-20 213415_1753036896130.png',
  'Screenshot 2025-07-20 213428_1753036896129.png',
  'Screenshot 2025-07-20 213440_1753036896129.png',
  'Screenshot 2025-07-20 213452_1753036896128.png',
  'Screenshot 2025-07-20 213507_1753036896128.png',
  'Screenshot 2025-07-20 213351_1753036615329.png',
  'Screenshot 2025-07-20 213404_1753036615328.png',
  'Screenshot 2025-07-20 213415_1753036615327.png',
  'Screenshot 2025-07-20 213311_1753036605407.png',
  'Screenshot 2025-07-20 213337_1753036605405.png',
  'Screenshot 2025-07-20 213428_1753036605405.png',
  'Screenshot 2025-07-20 213452_1753036605404.png',
  'Screenshot 2025-07-20 213507_1753036605402.png',
  'Screenshot 2025-07-20 213323_1753036605406.png',
  'Screenshot 2025-07-20 213440_1753036605404.png',
  'Screenshot 2025-07-20 213250_1753036605407.png'
];

// Use only local images
const allCarouselImages = carouselImages;

let currentIndex = 0;
let autoPlayInterval;

// Enhanced carousel functionality
function initializeCarousel() {
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  
  if (!carousel) return;

  function showImage(index) {
    carousel.innerHTML = '';
    const img = document.createElement('img');
    img.src = allCarouselImages[index];
    img.alt = `Gallery Image ${index + 1}`;
    img.style.transition = 'opacity 0.5s ease-in-out';
    img.style.width = '100%';
    img.style.height = '400px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    
    // Handle image load error
    img.onerror = function() {
      console.log(`Failed to load image: ${allCarouselImages[index]}`);
      // Try next image
      currentIndex = (currentIndex + 1) % allCarouselImages.length;
      showImage(currentIndex);
    };
    
    carousel.appendChild(img);
    
    // Add fade-in animation
    img.style.opacity = '0';
    setTimeout(() => {
      img.style.opacity = '1';
    }, 50);
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % allCarouselImages.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + allCarouselImages.length) % allCarouselImages.length;
    showImage(currentIndex);
  }

  // Event listeners with enhanced UX
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevImage();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextImage();
      resetAutoPlay();
    });
  }

  // Auto-play functionality
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextImage, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Initialize carousel
  showImage(currentIndex);
  startAutoPlay();

  // Pause auto-play on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });

  carousel.addEventListener('mouseleave', startAutoPlay);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevImage();
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextImage();
      resetAutoPlay();
    }
  });
}

// Language switcher functionality
function initializeLanguageSwitcher() {
  const langToggle = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');
  const langOptions = document.querySelectorAll('.lang-option');

  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', () => {
      langDropdown.style.display = langDropdown.style.display === 'none' ? 'block' : 'none';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.style.display = 'none';
      }
    });

    // Language selection
  langOptions.forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
      langDropdown.style.display = 'none';
    });
  });
  }
}

// Load and set language
function loadAndSetLanguage() {
  const savedLang = localStorage.getItem('selectedLanguage') || 'ar';
      setLanguage(savedLang);
}

// Set language function
function setLanguage(lang) {
  localStorage.setItem('selectedLanguage', lang);
  
  fetch('translations.json')
    .then(response => response.json())
    .then(data => {
      const translations = data[lang];
      
      // Update all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
          element.textContent = translations[key];
        }
      });

      // Update document direction
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
  
  // Update language button
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    const flag = lang === 'ar' ? '🇸🇦' : '🇬🇧';
    const text = lang === 'ar' ? 'العربية' : 'English';
    langToggle.innerHTML = `<span class="flag">${flag}</span> <span data-i18n="${lang === 'ar' ? 'arabic' : 'english'}">${text}</span>`;
  }
    })
    .catch(error => {
      console.error('Error loading translations:', error);
  });
}

// Initialize scroll animations
function initializeScrollAnimations() {
  // Initialize AOS when library is loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 0
    });
  } else {
    // Fallback for when AOS is not loaded
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize mobile menu
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}

// Show loading screen
function showLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-content">
      <div class="loading-logo">
        <img src="WhatsApp Image 2025-07-08 at 17.49.46_02d7f189_1753025271754.jpg" alt="Kayan Logo">
      </div>
      <div class="loading-spinner"></div>
      <p>جاري التحميل...</p>
    </div>
  `;
  
  document.body.appendChild(loadingScreen);
  
  // Remove loading screen after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 1000);
  });
}

// Show cookie banner
function showCookieBanner() {
  if (!localStorage.getItem('cookiesAccepted')) {
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-message">
        نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا.
    </div>
    <div class="cookie-actions">
      <button class="cookie-btn accept">قبول</button>
      <button class="cookie-btn decline">رفض</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  banner.querySelector('.accept').addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
      banner.remove();
  });
  
  banner.querySelector('.decline').addEventListener('click', () => {
      banner.remove();
  });
  }
}

// Initialize contact form
function initializeContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'جاري الإرسال...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
          contactForm.reset();
        } else {
          throw new Error('فشل في إرسال الرسالة');
        }
      } catch (error) {
        showNotification('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
  });
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
  
  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  });
}

// Initialize lazy loading
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Initialize stats counter
function initializeStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = Math.floor(current);
        }, 16);
        
        statsObserver.unobserve(stat);
      }
    });
  });
  
  stats.forEach(stat => statsObserver.observe(stat));
}

// Initialize back to top button
function initializeBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  
  if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  }
}

// Initialize header scroll effect
function initializeHeaderScroll() {
  const header = document.querySelector('.main-header');
  
  if (header) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  }
}

// Initialize performance monitoring
function initializePerformanceMonitoring() {
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
    }
        if (entry.entryType === 'first-input') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value);
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }

  // Monitor page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log('Page load time:', loadTime);
  });
}

// Initialize error handling
function initializeErrorHandling() {
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    showNotification('حدث خطأ في التطبيق. يرجى تحديث الصفحة.', 'error');
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('حدث خطأ في التطبيق. يرجى تحديث الصفحة.', 'error');
  });
}

// Initialize offline support
function initializeOfflineSupport() {
  window.addEventListener('online', () => {
    showNotification('تم استعادة الاتصال بالإنترنت.', 'success');
  });

  window.addEventListener('offline', () => {
    showNotification('فقد الاتصال بالإنترنت. يمكنك الاستمرار في تصفح الموقع.', 'warning');
  });
}

// Initialize accessibility
function initializeAccessibility() {
  // Skip to main content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
  `;
  
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Focus management
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Initialize SEO enhancements
function initializeSEO() {
  // Add structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "كيان الخليج للصناعة",
    "url": "https://kayanfactory.com",
    "logo": "https://kayanfactory.com/WhatsApp Image 2025-07-08 at 17.49.46_02d7f189_1753025271754.jpg",
    "description": "رؤية هندسية متطورة في مجال الكرتن وول والكلادينج والنوافذ والأبواب",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "الرياض",
      "addressRegion": "الرياض",
      "addressCountry": "SA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966545666924",
      "contactType": "customer service",
      "email": "kayanalkhalij.eng1@gmail.com"
    }
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Initialize service worker
function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Initialize Web Vitals
function initializeWebVitals() {
  // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        const lcp = entry.startTime;
        if (lcp < 2500) {
          console.log('✅ LCP is good:', lcp);
        } else {
          console.log('⚠️ LCP needs improvement:', lcp);
        }
      }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
  // FID (First Input Delay)
    new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-input') {
        const fid = entry.processingStart - entry.startTime;
        if (fid < 100) {
          console.log('✅ FID is good:', fid);
        } else {
          console.log('⚠️ FID needs improvement:', fid);
        }
      }
    }
    }).observe({ entryTypes: ['first-input'] });

  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        clsValue += entry.value;
      }
    }
    if (clsValue < 0.1) {
      console.log('✅ CLS is good:', clsValue);
    } else {
      console.log('⚠️ CLS needs improvement:', clsValue);
    }
  }).observe({ entryTypes: ['layout-shift'] });
}

// Initialize GSAP animations
function initializeGSAPAnimations() {
  if (typeof gsap !== 'undefined') {
  // Hero section animations
    gsap.from('.hero h1', {
      duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power2.out',
      delay: 0.5
  });

    gsap.from('.hero p', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power2.out',
      delay: 0.8
  });

    gsap.from('.hero .btn', {
      duration: 1,
      y: 20,
    opacity: 0,
      ease: 'power2.out',
      delay: 1.1
  });

    // Floating elements animation
    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
    stagger: 0.2,
      repeat: -1,
      yoyo: true
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach((stat, index) => {
      gsap.from(stat, {
        duration: 2,
        textContent: 0,
        ease: 'power1.out',
        delay: index * 0.2,
        snap: { textContent: 1 },
        onUpdate: function() {
          stat.textContent = Math.ceil(this.targets()[0].textContent);
        }
      });
  });

    // Service cards animation
  gsap.from('.service-card', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: 'power2.out',
      stagger: 0.2,
    scrollTrigger: {
      trigger: '.services-section',
      start: 'top 80%'
    }
  });

    // Testimonial cards animation
  gsap.from('.testimonial-card', {
    duration: 0.8,
      y: 50,
    opacity: 0,
    ease: 'power2.out',
      stagger: 0.2,
    scrollTrigger: {
      trigger: '.testimonials-section',
      start: 'top 80%'
    }
  });

    // CTA section animation
  gsap.from('.cta-content', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%'
    }
  });
}
}

// Initialize comments system
function initializeCommentsSystem() {
  const commentsList = document.getElementById('comments-list');
  const commentForm = document.getElementById('comment-form');
  
  if (commentsList) {
  loadComments();
  }
  
  if (commentForm) {
    commentForm.addEventListener('submit', submitComment);
    
    // Add star rating functionality
    const stars = commentForm.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.getAttribute('data-value'));
        setRating(value);
      });
      
      // Add hover effects
      star.addEventListener('mouseenter', () => {
        const value = parseInt(star.getAttribute('data-value'));
      setRating(value);
    });
  });
  
    // Reset stars on mouse leave
    const ratingContainer = commentForm.querySelector('.rating-stars');
    if (ratingContainer) {
      ratingContainer.addEventListener('mouseleave', () => {
        const selectedStar = commentForm.querySelector('.star.selected');
        if (selectedStar) {
          const value = parseInt(selectedStar.getAttribute('data-value'));
          setRating(value);
        } else {
          setRating(0);
        }
  });
}
  }
}

// Load comments from localStorage
function loadComments() {
  const comments = JSON.parse(localStorage.getItem('comments') || '[]');
  const commentsList = document.getElementById('comments-list');
  
  if (commentsList) {
  commentsList.innerHTML = '';
  comments.forEach(comment => {
      commentsList.appendChild(createCommentElement(comment));
  });
  }
}

// Create comment element
function createCommentElement(comment) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <div class="comment-header">
      <div class="comment-author">${comment.name || 'زائر'}</div>
      <div class="comment-date">${formatDate(comment.date)}</div>
    </div>
    <div class="comment-rating">
      ${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}
    </div>
    <div class="comment-text">${comment.text}</div>
  `;
  return commentDiv;
}

// Set rating stars
function setRating(value) {
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < value) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

// Submit comment
function submitComment(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const comment = {
    name: formData.get('name') || 'زائر',
    text: formData.get('comment'),
    rating: parseInt(document.querySelector('.star.selected')?.getAttribute('data-value') || 5),
    date: new Date().toISOString()
  };
  
  const comments = JSON.parse(localStorage.getItem('comments') || '[]');
  comments.unshift(comment);
  localStorage.setItem('comments', JSON.stringify(comments));
  
  loadComments();
  e.target.reset();
  
  // Reset rating
  document.querySelectorAll('.star').forEach(star => {
    star.classList.remove('selected');
  });
  
  showNotification('تم إضافة تعليقك بنجاح!', 'success');
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeCarousel();
  initializeLanguageSwitcher();
  loadAndSetLanguage();
  initializeScrollAnimations();
  initializeSmoothScrolling();
  initializeMobileMenu();
  showLoadingScreen();
  showCookieBanner();
  initializeContactForm();
  initializeLazyLoading();
  initializeStatsCounter();
  initializeBackToTop();
  initializeHeaderScroll();
  initializePerformanceMonitoring();
  initializeErrorHandling();
  initializeOfflineSupport();
  initializeAccessibility();
  initializeSEO();
  initializeServiceWorker();
  initializeWebVitals();
  initializeGSAPAnimations();
  initializeCommentsSystem();

  // Add keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals/dropdowns
    if (e.key === 'Escape') {
      const dropdowns = document.querySelectorAll('.lang-dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }
  });

  // Add touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      const carousel = document.getElementById('carousel');
      if (carousel && carousel.offsetParent !== null) {
        if (diff > 0) {
          // Swipe left - next image
          document.getElementById('next')?.click();
        } else {
          // Swipe right - previous image
          document.getElementById('prev')?.click();
        }
      }
    }
  }

  // Add intersection observer for performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load images when they come into view
        const images = entry.target.querySelectorAll('img[data-src]');
        images.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections for lazy loading
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  console.log('🎉 Kayan Al Khalij website initialized successfully!');
});

// Add global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// Export functions for external use
window.KayanWebsite = {
  setLanguage,
  showNotification,
  initializeCarousel,
  initializeCommentsSystem
}; 