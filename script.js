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

// Carousel removed per new design

// Language switcher functionality (idempotent; prevents double-binding)
let langSwitcherInitialized = false;
function initializeLanguageSwitcher() {
  if (langSwitcherInitialized) return;
  const langToggle = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');
  const langOptions = document.querySelectorAll('.lang-option');

  if (!langToggle || !langDropdown) return;

  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = (langDropdown.style.display === 'none' || getComputedStyle(langDropdown).display === 'none');
    langDropdown.style.display = isHidden ? 'block' : 'none';
  }, { once: false });

  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
      langDropdown.style.display = 'none';
    }
  });

  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      const lang = option.getAttribute('data-lang');
      setLanguage(lang);
      langDropdown.style.display = 'none';
    });
  });

  langSwitcherInitialized = true;
}

// Load and set language
function loadAndSetLanguage() {
  const savedLang = localStorage.getItem('selectedLanguage') || (document.documentElement.lang || 'ar');
  setLanguage(savedLang);
}

// Set language function
function setLanguage(lang) {
  localStorage.setItem('selectedLanguage', lang);
  fetch('translations.json', { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
      const translations = data[lang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations && translations[key];
        if (!value) return;

        // If element has children (e.g., icon + label), update existing label instead of duplicating
        if (el.children && el.children.length > 0) {
          // Remove stray text nodes to avoid duplicates
          Array.from(el.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              node.parentNode && node.parentNode.removeChild(node);
            }
          });
          // Prefer an existing non-icon span as label
          let labelEl = Array.from(el.children).find(ch => ch.tagName !== 'I');
          if (!labelEl) {
            labelEl = el.querySelector('.i18n-text');
          }
          if (!labelEl) {
            labelEl = document.createElement('span');
            labelEl.className = 'i18n-text';
            el.appendChild(labelEl);
          }
          labelEl.textContent = value;
        } else {
          el.textContent = value;
        }
      });
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    })
    .catch(err => console.error('Translation error:', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('selectedLanguage') || 'ar';
  setLanguage(lang);
  // Single initialization to avoid duplicates
  initializeLanguageSwitcher();
});

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
  
  console.log('Mobile menu initialization:', { mobileMenuBtn, mainNav });
  
  if (mobileMenuBtn && mainNav) {
    console.log('Mobile menu elements found, adding event listeners');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Mobile menu button clicked');
      
      const willOpen = !mainNav.classList.contains('mobile-active');
      mainNav.classList.toggle('mobile-active');
      mobileMenuBtn.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', willOpen);
      
      console.log('Mobile menu toggled:', mainNav.classList.contains('mobile-active'));
    });
    
    // Close mobile menu when clicking on any link
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        console.log('Nav link clicked, closing mobile menu');
        // Don't prevent default - let the link work normally
        mainNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mainNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mainNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });

    // Resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 901) {
        mainNav.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  } else {
    console.error('Mobile menu elements not found:', { mobileMenuBtn, mainNav });
  }
}

// Inject quick action buttons (WhatsApp and Call) for mobile
function injectQuickActions() {
  if (document.querySelector('.quick-actions')) return;
  const container = document.createElement('div');
  container.className = 'quick-actions';
  container.innerHTML = `
    <a class="qa-btn qa-whatsapp" href="https://wa.me/966545666924" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i><span class="sr-only">WhatsApp</span></a>
    <a class="qa-btn qa-call" href="tel:+966545666924" aria-label="Call"><i class="fa fa-phone"></i><span class="sr-only">Call</span></a>
  `;
  document.body.appendChild(container);
}

// Apply native lazy-loading to images that don't have it
function applyNativeLazyLoading() {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    if (!img.classList.contains('hero-bg-img')) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });
}

// Ensure there is a main content anchor for skip link
function ensureMainContentAnchor() {
  if (!document.getElementById('main-content')) {
    const anchor = document.createElement('span');
    anchor.id = 'main-content';
    const header = document.querySelector('.main-header');
    var targetParent = (header && header.parentNode) ? header.parentNode : document.body;
    var referenceNode = header ? header.nextSibling : document.body.firstChild;
    targetParent.insertBefore(anchor, referenceNode);
  }
}

// Ensure Font Awesome is present (robust fallback for non-Chromium browsers or CDN hiccups)
function ensureFontAwesome() {
  var hasFAClass = document.querySelector('i.fa, i.fas, i.far, i.fab');
  var hasFALink = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(function(l){ return (l.href||'').indexOf('font-awesome') !== -1 || (l.href||'').indexOf('fontawesome') !== -1; });
  if (!hasFAClass) return; // no icons used
  if (hasFALink) return;   // stylesheet already present
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  document.head.appendChild(link);
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
        // Send to our backend API
        const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showNotification(result.message || 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'فشل في إرسال الرسالة');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        showNotification(error.message || 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
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
        const rawValue = stat.getAttribute('data-count');
        const parsedTarget = Number(rawValue);

        // Guard against NaN or missing values
        if (!Number.isFinite(parsedTarget)) {
          // If there's any readable text/number use it, else show fallback label
          if (rawValue && String(rawValue).trim().length > 0) {
            stat.textContent = String(rawValue).trim();
          } else {
            stat.textContent = 'العدد والكمية';
          }
          statsObserver.unobserve(stat);
          return;
        }

        const target = parsedTarget;
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
  "url": "https://kayanalkhalij1.github.io/Kayan-Al-Khalij11",
  "logo": "https://kayanalkhalij1.github.io/Kayan-Al-Khalij11/WhatsApp%20Image%202025-07-08%20at%2017.49.46_02d7f189_1753025271754.jpg",
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
      "email": "info@kayanfactory.com"
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
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '';
    if (isLocalhost) {
      // Avoid SW in local dev to reduce caching differences
      return;
    }

    window.addEventListener('load', () => {
      // Use relative path to work on subfolder hosting as well
      navigator.serviceWorker.register('./sw.js')
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
    // Floating elements animation
    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      ease: 'power1.inOut',
      stagger: 0.2,
      repeat: -1,
      yoyo: true
    });

    // Simple staggered reveals if elements exist
    if (document.querySelectorAll('.service-card').length) {
      gsap.from('.service-card', {
        duration: 0.8,
        y: 40,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.15
      });
    }

    if (document.querySelectorAll('.testimonial-card').length) {
      gsap.from('.testimonial-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.2
      });
    }

    if (document.querySelector('.cta-content')) {
      gsap.from('.cta-content', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
      });
    }
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
  ensureFontAwesome();
  initializeLanguageSwitcher();
  loadAndSetLanguage();
  initializeScrollAnimations();
  initializeSmoothScrolling();
  initializeMobileMenu();
  injectQuickActions();
  applyNativeLazyLoading();
  ensureMainContentAnchor();
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
  // New effects
  initializeScrollProgressBar();
  initializeRippleEffect();
  initializeTypingEffect();
  initializeTiltHover();
  
  // Initialize new features
  initializeWhatsAppWidget();
  initializeSearch();
  initializeDarkMode();
  initializeTestimonialsForm();
  initializeAnalytics();
  fixMobileMenu();

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
      // no carousel to swipe
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
  initializeCommentsSystem
};

// WhatsApp Chat Widget Functionality
function initializeWhatsAppWidget() {
  const whatsappToggle = document.getElementById('whatsapp-toggle');
  const whatsappWidget = document.getElementById('whatsapp-widget');
  const whatsappClose = document.getElementById('whatsapp-close');
  const whatsappInput = document.getElementById('whatsapp-input');
  const whatsappSend = document.getElementById('whatsapp-send');
  const whatsappMessages = document.getElementById('whatsapp-messages');
  const quickMessages = document.querySelectorAll('.quick-msg');

  if (!whatsappToggle || !whatsappWidget) return;

  // Toggle WhatsApp widget
  whatsappToggle.addEventListener('click', () => {
    whatsappWidget.classList.toggle('show');
    if (whatsappWidget.classList.contains('show')) {
      whatsappInput.focus();
    }
  });

  // Close WhatsApp widget
  whatsappClose.addEventListener('click', () => {
    whatsappWidget.classList.remove('show');
  });

  // Enhanced AI-powered response system
  function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Service-related responses
    if (message.includes('كرتن وول') || message.includes('curtain wall') || message.includes('واجهات')) {
      return {
        text: "🏢 ممتاز! نحن متخصصون في تصنيع وتركيب الكرتن وول بأعلى معايير الجودة العالمية. نستخدم أفضل المواد المستوردة مع ضمان 10 سنوات. يمكننا تقديم عرض سعر مجاني لمشروعك خلال 24 ساعة. هل تريد تحديد موعد لزيارة الموقع؟",
        quickReplies: ['نعم، أريد عرض سعر', 'متى يمكن الزيارة؟', 'ما هي الأسعار التقريبية؟', 'أريد رؤية أعمالكم']
      };
    }
    
    if (message.includes('كلادينج') || message.includes('cladding') || message.includes('واجهات خارجية')) {
      return {
        text: "🏠 رائع! نوفر خدمات الكلادينج الخارجي للمباني التجارية والسكنية بأفضل المواد المقاومة للعوامل الجوية. نقدم ضمان 15 سنة على جميع أعمالنا. لدينا فريق فني متخصص ومرخص. هل لديك مشروع محدد؟",
        quickReplies: ['نعم، لدي مشروع', 'أريد استشارة مجانية', 'ما هي أنواع الكلادينج؟', 'أريد عرض سعر']
      };
    }
    
    if (message.includes('نوافذ') || message.includes('أبواب') || message.includes('windows') || message.includes('doors') || message.includes('upvc') || message.includes('ألمنيوم')) {
      return {
        text: "🚪 ممتاز! نوفر نوافذ وأبواب ألمنيوم و UPVC عالية الجودة مع ضمان العزل الحراري والصوتي. نقدم ضمان 20 سنة على النوافذ و 10 سنوات على الأبواب. جميع منتجاتنا معتمدة من الهيئة السعودية للمقاولين. ما نوع النوافذ التي تبحث عنها؟",
        quickReplies: ['نوافذ ألمنيوم', 'نوافذ UPVC', 'أبواب WPC', 'أريد عرض سعر', 'أريد استشارة']
      };
    }
    
    if (message.includes('سعر') || message.includes('تكلفة') || message.includes('price') || message.includes('cost') || message.includes('كم') || message.includes('تكلف')) {
      return {
        text: "💰 الأسعار تختلف حسب نوع الخدمة والمساحة والمواد المستخدمة. نقدم أسعار تنافسية مع ضمان أفضل جودة. يمكننا تقديم عرض سعر مجاني خلال 24 ساعة. ما نوع الخدمة التي تحتاجها؟",
        quickReplies: ['أريد عرض سعر شخصي', 'ما هي العوامل المؤثرة؟', 'أريد استشارة مجانية', 'متى يمكن الحصول على السعر؟']
      };
    }
    
    if (message.includes('موعد') || message.includes('زيارة') || message.includes('appointment') || message.includes('visit')) {
      return {
        text: "يمكننا تحديد موعد لزيارة موقعك وتقييم المشروع. نحن متاحون من السبت إلى الخميس من 8 صباحاً إلى 6 مساءً. ما هو الوقت المناسب لك؟",
        quickReplies: ['صباحاً', 'مساءً', 'عطلة نهاية الأسبوع', 'أريد حجز موعد']
      };
    }
    
    if (message.includes('ضمان') || message.includes('جودة') || message.includes('warranty') || message.includes('quality')) {
      return {
        text: "نحن نقدم ضمان شامل على جميع أعمالنا مع استخدام أفضل المواد المستوردة. لدينا فريق فني متخصص ومرخص من الهيئة السعودية للمقاولين.",
        quickReplies: ['ما هي مدة الضمان؟', 'ما هي شهادات الجودة؟', 'أريد رؤية أعمالكم']
      };
    }
    
    if (message.includes('شكر') || message.includes('ممتاز') || message.includes('thanks') || message.includes('great')) {
      return {
        text: "شكراً لك! نحن سعداء بخدمتك. هل هناك أي استفسارات أخرى يمكننا مساعدتك فيها؟",
        quickReplies: ['لا، شكراً', 'أريد المزيد من المعلومات', 'كيف أتواصل معكم؟']
      };
    }
    
    // Default response
    return {
      text: "👋 مرحباً! أنا مساعدك الذكي من كيان الخليج للصناعة. يمكنني مساعدتك في الاستفسارات حول خدماتنا: الكرتن وول، الكلادينج، النوافذ والأبواب. نحن متخصصون في تقديم حلول هندسية متطورة مع ضمان الجودة. كيف يمكنني مساعدتك اليوم؟",
      quickReplies: ['أريد عرض سعر', 'استشارة مجانية', 'حجز موعد', 'معلومات عن الخدمات', 'أريد رؤية أعمالكم']
    };
  }

  // Send message with AI response
  function sendMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
      <p>${message}</p>
      <span class="time">الآن</span>
    `;
    whatsappMessages.appendChild(messageDiv);
    whatsappMessages.scrollTop = whatsappMessages.scrollHeight;

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message received typing';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span class="time">يكتب...</span>
    `;
    whatsappMessages.appendChild(typingDiv);
    whatsappMessages.scrollTop = whatsappMessages.scrollHeight;

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      
      // Remove typing indicator
      whatsappMessages.removeChild(typingDiv);
      
      // Add AI response
      const responseDiv = document.createElement('div');
      responseDiv.className = 'message received';
      responseDiv.innerHTML = `
        <p>${aiResponse.text}</p>
        <span class="time">الآن</span>
      `;
      whatsappMessages.appendChild(responseDiv);
      whatsappMessages.scrollTop = whatsappMessages.scrollHeight;
      
      // Add quick replies if available
      if (aiResponse.quickReplies && aiResponse.quickReplies.length > 0) {
        const quickRepliesDiv = document.createElement('div');
        quickRepliesDiv.className = 'quick-replies-container';
        quickRepliesDiv.innerHTML = `
          <div class="quick-replies">
            ${aiResponse.quickReplies.map(reply => 
              `<button class="quick-reply-btn" data-message="${reply}">${reply}</button>`
            ).join('')}
          </div>
        `;
        whatsappMessages.appendChild(quickRepliesDiv);
        whatsappMessages.scrollTop = whatsappMessages.scrollHeight;
        
        // Add event listeners to quick reply buttons
        quickRepliesDiv.querySelectorAll('.quick-reply-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const replyMessage = btn.getAttribute('data-message');
            sendMessage(replyMessage);
            quickRepliesDiv.remove();
          });
        });
      }
    }, 1500 + Math.random() * 1000); // Random delay for more natural feel
  }

  // Send button click
  whatsappSend.addEventListener('click', () => {
    const message = whatsappInput.value.trim();
    if (message) {
      sendMessage(message);
      whatsappInput.value = '';
    }
  });

  // Enter key to send
  whatsappInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const message = whatsappInput.value.trim();
      if (message) {
        sendMessage(message);
        whatsappInput.value = '';
      }
    }
  });

  // Quick message buttons
  quickMessages.forEach(btn => {
    btn.addEventListener('click', () => {
      const message = btn.getAttribute('data-message');
      sendMessage(message);
    });
  });
}

// Search Functionality
function initializeSearch() {
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchResults = document.getElementById('search-results');

  if (!searchToggle || !searchOverlay) return;

  // Search data
  const searchData = [
    { title: 'كرتن وول', description: 'واجهات زجاجية حديثة', url: 'projects-aluminum-glass.html', category: 'خدمات' },
    { title: 'كلادينج', description: 'واجهات خارجية للمباني', url: 'projects-cladding.html', category: 'خدمات' },
    { title: 'نوافذ ألمنيوم', description: 'نوافذ عالية الجودة', url: 'products.html', category: 'منتجات' },
    { title: 'أبواب WPC', description: 'أبواب مقاومة للماء', url: 'projects-wpc-doors.html', category: 'منتجات' },
    { title: 'نوافذ UPVC', description: 'نوافذ عازلة للحرارة', url: 'projects-upvc-windows.html', category: 'منتجات' },
    { title: 'كابائن الدش', description: 'كابائن مخصصة', url: 'products.html', category: 'خدمات' },
    { title: 'درابزين', description: 'درابزين ألمنيوم', url: 'products.html', category: 'منتجات' },
    { title: 'رولر شتر', description: 'ستائر أمنية', url: 'products.html', category: 'منتجات' },
    { title: 'قواطع زجاجية', description: 'قواطع للمكاتب', url: 'products.html', category: 'خدمات' },
    { title: 'مطابخ', description: 'مطابخ مخصصة', url: 'products.html', category: 'خدمات' }
  ];

  // Toggle search overlay
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('show');
    searchInput.focus();
  });

  // Close search overlay
  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('show');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  // Close on overlay click
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('show');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  // Search function
  function performSearch(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      return;
    }

    const results = searchData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">لم يتم العثور على نتائج</p>';
      return;
    }

    results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'search-result-item';
      resultDiv.innerHTML = `
        <h4>${result.title}</h4>
        <p>${result.description} - ${result.category}</p>
      `;
      resultDiv.addEventListener('click', () => {
        window.location.href = result.url;
      });
      searchResults.appendChild(resultDiv);
    });
  }

  // Search input event
  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  // Search button click
  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });

  // Enter key to search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
}

// Dark Mode Functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  if (!darkModeToggle) return;

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  // Toggle dark mode
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  });
}


// Testimonials Form Functionality
function initializeTestimonialsForm() {
  const testimonialForm = document.getElementById('testimonial-form');
  
  if (!testimonialForm) return;

  testimonialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(testimonialForm);
    const submitBtn = testimonialForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'جاري الإرسال...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          service: formData.get('service'),
          rating: parseInt(formData.get('rating')),
          message: formData.get('message')
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification(result.message || 'شكراً لك! تم إرسال تقييمك بنجاح. سيتم مراجعته ونشره قريباً.', 'success');
        
        // Reset form
        testimonialForm.reset();
        
        // Reset star rating
        document.querySelectorAll('.testimonial-form .rating-stars input[type="radio"]').forEach(radio => {
          radio.checked = false;
        });
      } else {
        throw new Error(result.message || 'فشل في إرسال التقييم');
      }
    } catch (error) {
      console.error('Testimonial form error:', error);
      showNotification(error.message || 'حدث خطأ في إرسال التقييم. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Star rating interaction
  const stars = testimonialForm.querySelectorAll('.rating-stars .star');
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      const rating = 5 - index;
      const radio = testimonialForm.querySelector(`input[value="${rating}"]`);
      if (radio) {
        radio.checked = true;
      }
    });
    
    star.addEventListener('mouseenter', () => {
      const rating = 5 - index;
      highlightStars(rating);
    });
  });

  const ratingContainer = testimonialForm.querySelector('.rating-stars');
  ratingContainer.addEventListener('mouseleave', () => {
    const checkedRadio = testimonialForm.querySelector('.rating-stars input[type="radio"]:checked');
    if (checkedRadio) {
      highlightStars(parseInt(checkedRadio.value));
    } else {
      highlightStars(0);
    }
  });

  function highlightStars(rating) {
    stars.forEach((star, index) => {
      const starRating = 5 - index;
      if (starRating <= rating) {
        star.style.color = '#ffd700';
      } else {
        star.style.color = '#ddd';
      }
    });
  }
}

// Enhanced Mobile Menu Fix
function fixMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    // Remove existing event listeners by cloning the elements
    const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
    const newMainNav = mainNav.cloneNode(true);
    
    mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
    mainNav.parentNode.replaceChild(newMainNav, mainNav);
    
    // Re-initialize mobile menu
    initializeMobileMenu();
  }
}

// Analytics and Visit Tracking
function initializeAnalytics() {
  // Track page visit
  trackPageVisit();
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trackPageVisit();
    }
  });
  
  // Track page unload
  window.addEventListener('beforeunload', () => {
    trackVisitDuration();
  });
}

// Track page visit
async function trackPageVisit() {
  try {
    const visitData = {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || null,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language || 'ar',
      session_id: getOrCreateSessionId()
    };

    const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/analytics/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(visitData)
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.visit_id) {
        // Store visit ID for duration tracking
        sessionStorage.setItem('current_visit_id', result.data.visit_id);
        sessionStorage.setItem('visit_start_time', Date.now().toString());
      }
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

// Track visit duration
async function trackVisitDuration() {
  try {
    const visitId = sessionStorage.getItem('current_visit_id');
    const startTime = sessionStorage.getItem('visit_start_time');
    
    if (visitId && startTime) {
      const duration = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      
      if (duration > 0) {
        await fetch(`https://kayan-factory-backend.herokuapp.com/api/analytics/visit/${visitId}/duration`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ duration })
        });
      }
    }
  } catch (error) {
    console.error('Duration tracking error:', error);
  }
}

// Get or create session ID
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Get device type
function getDeviceType() {
  const userAgent = navigator.userAgent;
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet|ipad|android(?!.*mobile)/i.test(userAgent)) {
    return 'tablet';
  }
  return 'desktop';
}

// Get browser name
function getBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

// Get operating system
function getOS() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

// Load testimonials from backend
async function loadTestimonials() {
  try {
    const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/testimonials/public?limit=10');
    const result = await response.json();
    
    if (response.ok && result.success) {
      displayTestimonials(result.data);
    }
  } catch (error) {
    console.error('Failed to load testimonials:', error);
  }
}

// Display testimonials
function displayTestimonials(testimonials) {
  const testimonialsContainer = document.querySelector('.testimonials-grid');
  if (!testimonialsContainer) return;

  testimonialsContainer.innerHTML = testimonials.map(testimonial => `
    <div class="testimonial-card card-legendary legendary-hover">
      <div class="testimonial-content">
        <div class="rating-stars">
          ${'<i class="fa-solid fa-star"></i>'.repeat(testimonial.rating)}
          ${'<i class="fa-regular fa-star"></i>'.repeat(5 - testimonial.rating)}
        </div>
        <p>"${testimonial.message}"</p>
        <div class="testimonial-author">
          <strong>${testimonial.name}</strong>
          <span>${testimonial.service}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize testimonials loading
document.addEventListener('DOMContentLoaded', () => {
  // Load testimonials after a short delay
  setTimeout(loadTestimonials, 1000);
});

// لا يوجد نص ساعات العمل ثابت في js، كل شيء يعتمد على الترجمة أو HTML

// ===== Effects: Scroll Progress Bar =====
function initializeScrollProgressBar() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  const set = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  };

  set();
  window.addEventListener('scroll', set, { passive: true });
  window.addEventListener('resize', set);
}

// ===== Effects: Ripple on click =====
function initializeRippleEffect() {
  const candidates = document.querySelectorAll('.ripple-container, .btn, .nav-link, .quick-link');
  candidates.forEach(el => {
    // Avoid double attaching
    if (el.dataset.rippleAttached) return;
    el.dataset.rippleAttached = 'true';
    el.style.position = el.style.position || 'relative';
    el.style.overflow = el.style.overflow || 'hidden';
    el.addEventListener('click', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

// ===== Effects: Typing text =====
function initializeTypingEffect() {
  const nodes = document.querySelectorAll('[data-typing]');
  nodes.forEach(node => {
    if (node.dataset.typingInitialized) return;
    node.dataset.typingInitialized = 'true';
    const fullText = node.textContent.trim();
    const speed = parseInt(node.getAttribute('data-typing-speed') || '80', 10);
    node.textContent = '';

    let i = 0;
    const type = () => {
      if (i <= fullText.length) {
        node.textContent = fullText.slice(0, i);
        i++;
        setTimeout(type, speed);
      }
    };
    // Start after small delay so layout is stable
    setTimeout(type, 250);
  });
}

// ===== Effects: Tilt hover (pointer devices) =====
function initializeTiltHover() {
  const cards = document.querySelectorAll('.card-legendary, .service-card, .project-card');
  cards.forEach(card => {
    if (card.dataset.tiltAttached) return;
    card.dataset.tiltAttached = 'true';
    card.classList.add('tilt-hover');

    let rect;
    const onMove = (e) => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      rect = rect || card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = x / rect.width - 0.5; // -0.5 .. 0.5
      const cy = y / rect.height - 0.5;
      const tiltX = (-cy) * 6; // rotateX
      const tiltY = cx * 6;    // rotateY
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const reset = () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      rect = undefined;
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });
}