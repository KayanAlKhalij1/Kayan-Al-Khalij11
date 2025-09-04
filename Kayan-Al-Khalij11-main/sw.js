// Kayan Al Khalij Website - Service Worker
// Version: 2.0.0

const CACHE_NAME = 'kayan-alkhalij-v2.0.0';
const STATIC_CACHE = 'kayan-static-v2.0.0';
const DYNAMIC_CACHE = 'kayan-dynamic-v2.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/about.html',
  '/products.html',
  '/contact.html',
  '/comments.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/translations.json',
  '/robots.txt',
  '/sitemap.xml'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js',
  'https://unpkg.com/gsap@3.12.2/dist/gsap.min.js',
  'https://unpkg.com/swiper@11/swiper-bundle.min.js',
  'https://unpkg.com/swiper@11/swiper-bundle.min.css'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return caches.open(CACHE_NAME);
      })
      .then(cache => {
        console.log('Service Worker: Caching external resources');
        return cache.addAll(EXTERNAL_RESOURCES);
      })
      .then(() => {
        console.log('Service Worker: Installation completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation completed');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML files - network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Fallback to index.html for SPA routing
              return caches.match('/index.html');
            });
        })
    );
  } else if (request.destination === 'style' || 
             request.destination === 'script' || 
             request.destination === 'image') {
    // Static assets - cache first, fallback to network
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
  } else {
    // Other requests - network first, fallback to cache
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  // تم تعطيل أي باك اند أو معالجة للنماذج في الخلفية
  // لا شيء هنا
});

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'كيان الخليج للصناعة',
    icon: '/window_icon_125687.svg',
    badge: '/window_icon_125687.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'تصفح الموقع',
        icon: '/window_icon_125687.svg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/window_icon_125687.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('كيان الخليج للصناعة', options)
  );
});

// Notification click
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/index.html')
    );
  } else if (event.action === 'close') {
    // Do nothing, notification already closed
  } else {
    // Default action
    event.waitUntil(
      clients.openWindow('/index.html')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  // تم تعطيل أي معالجة للنماذج أو إرسال بيانات
  return;
}

// Helper functions for form data storage
async function getStoredFormData() {
  // تم تعطيل أي تخزين بيانات للنماذج
  return null;
}

async function clearStoredFormData() {
  // تم تعطيل أي حذف بيانات للنماذج
  return;
}

// Cache management
async function cleanOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== STATIC_CACHE && 
      name !== DYNAMIC_CACHE && 
      name !== CACHE_NAME
    );
    
    await Promise.all(
      oldCaches.map(name => caches.delete(name))
    );
    
    console.log('Service Worker: Old caches cleaned');
  } catch (error) {
    console.error('Service Worker: Error cleaning old caches', error);
  }
}

// Periodic cache cleanup
setInterval(cleanOldCaches, 24 * 60 * 60 * 1000); // Every 24 hours

// Error handling
self.addEventListener('error', event => {
  console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled rejection', event.reason);
});

console.log('Service Worker: Loaded successfully');