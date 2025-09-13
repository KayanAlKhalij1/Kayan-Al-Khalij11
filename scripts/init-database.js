#!/usr/bin/env node

/**
 * Database Initialization Script
 * This script initializes the database with sample data for development
 */

const database = require('../config/database');
const emailService = require('../services/emailService');

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...');

  try {
    // Initialize database
    database.init();
    
    // Wait a bit for database to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Insert sample data
    await insertSampleData();
    
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  console.log('📝 Inserting sample data...');

  // Sample contact messages
  const sampleMessages = [
    {
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      message: 'أريد استشارة حول تركيب كرتن وول لمبنى مكتبي في الرياض. ما هي التكلفة التقريبية؟',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'new',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'فاطمة السعيد',
      email: 'fatima@example.com',
      phone: '+966502345678',
      message: 'هل تقدمون خدمات صيانة للنوافذ الألمنيوم؟ لدي مشكلة في إغلاق النوافذ.',
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      status: 'replied',
      response: 'نعم، نقدم خدمات الصيانة. سنتواصل معك قريباً.',
      responded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'خالد العتيبي',
      email: 'khalid@example.com',
      phone: '+966503456789',
      message: 'أريد عرض سعر لتركيب كلادينج لمجمع تجاري. المساحة 500 متر مربع.',
      ip_address: '192.168.1.102',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'read',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const message of sampleMessages) {
    await database.run(
      `INSERT INTO contact_messages 
       (name, email, phone, message, ip_address, user_agent, status, response, responded_at, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        message.name, message.email, message.phone, message.message,
        message.ip_address, message.user_agent, message.status,
        message.response || null, message.responded_at || null, message.created_at
      ]
    );
  }

  // Sample testimonials
  const sampleTestimonials = [
    {
      name: 'عبدالله الحسين',
      email: 'abdullah@example.com',
      service: 'curtain-wall',
      rating: 5,
      message: 'خدمة ممتازة وجودة عالية في العمل. أنصح بالتعامل معهم.',
      ip_address: '192.168.1.103',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      approved: 1,
      approved_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'سلمان الدوسري',
      email: 'salman@example.com',
      service: 'cladding',
      rating: 5,
      message: 'تنفيذ سريع ومواعيد دقيقة. جودتهم في الألومنيوم ممتازة جداً.',
      ip_address: '192.168.1.104',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      approved: 1,
      approved_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'حسام أحمد',
      email: 'hussam@example.com',
      service: 'aluminum-windows',
      rating: 4,
      message: 'تصاميم رائعة وخدمة ما بعد البيع محترمة. الفريق متعاون جداً.',
      ip_address: '192.168.1.105',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      approved: 1,
      approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'محمد ياسر',
      email: 'mohammed@example.com',
      service: 'upvc-windows',
      rating: 5,
      message: 'من أفضل الشركات في الكرتن وول والكلادينج. النتائج فوق المتوقع.',
      ip_address: '192.168.1.106',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      approved: 1,
      approved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'نورا السعد',
      email: 'nora@example.com',
      service: 'wpc-doors',
      rating: 4,
      message: 'أبواب WPC ممتازة ومقاومة للماء. التركيب كان احترافي جداً.',
      ip_address: '192.168.1.107',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      approved: 0,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const testimonial of sampleTestimonials) {
    await database.run(
      `INSERT INTO testimonials 
       (name, email, service, rating, message, ip_address, user_agent, approved, approved_at, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testimonial.name, testimonial.email, testimonial.service, testimonial.rating,
        testimonial.message, testimonial.ip_address, testimonial.user_agent,
        testimonial.approved, testimonial.approved_at || null, testimonial.created_at
      ]
    );
  }

  // Sample analytics data
  const sampleAnalytics = [
    {
      page_url: 'https://kayanfactory.netlify.app/',
      page_title: 'كيان الخليج للصناعة | الصفحة الرئيسية',
      referrer: 'https://www.google.com/search?q=كرتن+وول+الرياض',
      ip_address: '192.168.1.108',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      device_type: 'desktop',
      browser: 'Chrome',
      os: 'Windows',
      screen_resolution: '1920x1080',
      language: 'ar',
      session_id: 'sess_' + Math.random().toString(36).substr(2, 9),
      visit_duration: 120,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      page_url: 'https://kayanfactory.netlify.app/products.html',
      page_title: 'منتجاتنا | كيان الخليج',
      referrer: 'https://kayanfactory.netlify.app/',
      ip_address: '192.168.1.109',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      device_type: 'mobile',
      browser: 'Safari',
      os: 'iOS',
      screen_resolution: '375x812',
      language: 'ar',
      session_id: 'sess_' + Math.random().toString(36).substr(2, 9),
      visit_duration: 85,
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      page_url: 'https://kayanfactory.netlify.app/contact.html',
      page_title: 'اتصل بنا | كيان الخليج',
      referrer: 'https://www.facebook.com/',
      ip_address: '192.168.1.110',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      device_type: 'desktop',
      browser: 'Chrome',
      os: 'macOS',
      screen_resolution: '1440x900',
      language: 'ar',
      session_id: 'sess_' + Math.random().toString(36).substr(2, 9),
      visit_duration: 200,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  ];

  for (const analytics of sampleAnalytics) {
    await database.run(
      `INSERT INTO website_analytics 
       (page_url, page_title, referrer, ip_address, user_agent, device_type, 
        browser, os, screen_resolution, language, session_id, visit_duration, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analytics.page_url, analytics.page_title, analytics.referrer,
        analytics.ip_address, analytics.user_agent, analytics.device_type,
        analytics.browser, analytics.os, analytics.screen_resolution,
        analytics.language, analytics.session_id, analytics.visit_duration,
        analytics.created_at
      ]
    );
  }

  // Sample email logs
  const sampleEmailLogs = [
    {
      to_email: 'info@kayanfactory.com',
      subject: 'رسالة جديدة من أحمد محمد - موقع كيان الخليج',
      type: 'contact_notification',
      status: 'sent',
      sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      related_id: 1
    },
    {
      to_email: 'ahmed@example.com',
      subject: 'شكراً لك - كيان الخليج للصناعة',
      type: 'auto_reply',
      status: 'sent',
      sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      related_id: 1
    },
    {
      to_email: 'info@kayanfactory.com',
      subject: 'تقييم جديد من عبدالله الحسين - موقع كيان الخليج',
      type: 'testimonial_notification',
      status: 'sent',
      sent_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      related_id: 1
    }
  ];

  for (const emailLog of sampleEmailLogs) {
    await database.run(
      `INSERT INTO email_logs (to_email, subject, type, status, sent_at, related_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        emailLog.to_email, emailLog.subject, emailLog.type,
        emailLog.status, emailLog.sent_at, emailLog.related_id
      ]
    );
  }

  console.log('✅ Sample data inserted successfully!');
  console.log('📊 Database now contains:');
  console.log('   - 3 contact messages');
  console.log('   - 5 testimonials (4 approved, 1 pending)');
  console.log('   - 3 analytics records');
  console.log('   - 3 email logs');
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, insertSampleData };
