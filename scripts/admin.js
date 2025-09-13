#!/usr/bin/env node

/**
 * Admin Script for Kayan Factory Backend
 * This script provides administrative functions for managing the database
 */

const database = require('../config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Admin menu
function showMenu() {
  console.log('\n🔧 كيان الخليج - لوحة الإدارة');
  console.log('================================');
  console.log('1. عرض إحصائيات عامة');
  console.log('2. إدارة الرسائل');
  console.log('3. إدارة التقييمات');
  console.log('4. عرض تحليلات الموقع');
  console.log('5. إدارة الإيميلات');
  console.log('6. تنظيف قاعدة البيانات');
  console.log('7. تصدير البيانات');
  console.log('8. إعادة تعيين قاعدة البيانات');
  console.log('0. خروج');
  console.log('================================');
}

// Show statistics
async function showStatistics() {
  try {
    const stats = await database.getStats();
    console.log('\n📊 الإحصائيات العامة');
    console.log('====================');
    console.log(`📧 إجمالي الرسائل: ${stats.totalMessages}`);
    console.log(`⭐ إجمالي التقييمات: ${stats.totalTestimonials}`);
    console.log(`✅ التقييمات المعتمدة: ${stats.approvedTestimonials}`);
    console.log(`📬 الرسائل الجديدة: ${stats.newMessages}`);
    console.log(`🌐 إجمالي الزيارات: ${stats.totalVisits}`);
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error.message);
  }
}

// Manage messages
async function manageMessages() {
  try {
    const messages = await database.query(`
      SELECT id, name, email, status, created_at, message
      FROM contact_messages 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log('\n📧 آخر 10 رسائل');
    console.log('================');
    messages.forEach(msg => {
      console.log(`ID: ${msg.id} | ${msg.name} | ${msg.status} | ${msg.created_at}`);
      console.log(`   ${msg.message.substring(0, 50)}...`);
      console.log('---');
    });

    console.log('\n1. عرض رسالة محددة');
    console.log('2. تحديث حالة رسالة');
    console.log('3. حذف رسالة');
    console.log('4. العودة للقائمة الرئيسية');

    const choice = await askQuestion('اختر رقم: ');
    
    switch (choice) {
      case '1':
        await viewMessage();
        break;
      case '2':
        await updateMessageStatus();
        break;
      case '3':
        await deleteMessage();
        break;
      default:
        return;
    }
  } catch (error) {
    console.error('❌ خطأ في إدارة الرسائل:', error.message);
  }
}

// View specific message
async function viewMessage() {
  const id = await askQuestion('أدخل ID الرسالة: ');
  try {
    const message = await database.get(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (message) {
      console.log('\n📧 تفاصيل الرسالة');
      console.log('==================');
      console.log(`الاسم: ${message.name}`);
      console.log(`البريد: ${message.email}`);
      console.log(`الهاتف: ${message.phone || 'غير محدد'}`);
      console.log(`الحالة: ${message.status}`);
      console.log(`التاريخ: ${message.created_at}`);
      console.log(`الرسالة: ${message.message}`);
      if (message.response) {
        console.log(`الرد: ${message.response}`);
      }
    } else {
      console.log('❌ الرسالة غير موجودة');
    }
  } catch (error) {
    console.error('❌ خطأ في عرض الرسالة:', error.message);
  }
}

// Update message status
async function updateMessageStatus() {
  const id = await askQuestion('أدخل ID الرسالة: ');
  const status = await askQuestion('الحالة الجديدة (new/read/replied/closed): ');
  
  try {
    const result = await database.run(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.changes > 0) {
      console.log('✅ تم تحديث حالة الرسالة بنجاح');
    } else {
      console.log('❌ الرسالة غير موجودة');
    }
  } catch (error) {
    console.error('❌ خطأ في تحديث الرسالة:', error.message);
  }
}

// Delete message
async function deleteMessage() {
  const id = await askQuestion('أدخل ID الرسالة للحذف: ');
  const confirm = await askQuestion('هل أنت متأكد؟ (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    try {
      const result = await database.run(
        'DELETE FROM contact_messages WHERE id = ?',
        [id]
      );

      if (result.changes > 0) {
        console.log('✅ تم حذف الرسالة بنجاح');
      } else {
        console.log('❌ الرسالة غير موجودة');
      }
    } catch (error) {
      console.error('❌ خطأ في حذف الرسالة:', error.message);
    }
  }
}

// Manage testimonials
async function manageTestimonials() {
  try {
    const testimonials = await database.query(`
      SELECT id, name, service, rating, approved, created_at, message
      FROM testimonials 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log('\n⭐ آخر 10 تقييمات');
    console.log('==================');
    testimonials.forEach(testimonial => {
      const status = testimonial.approved ? '✅ معتمد' : '⏳ في الانتظار';
      console.log(`ID: ${testimonial.id} | ${testimonial.name} | ${testimonial.rating}⭐ | ${status}`);
      console.log(`   ${testimonial.message.substring(0, 50)}...`);
      console.log('---');
    });

    console.log('\n1. عرض تقييم محدد');
    console.log('2. الموافقة على تقييم');
    console.log('3. رفض تقييم');
    console.log('4. حذف تقييم');
    console.log('5. العودة للقائمة الرئيسية');

    const choice = await askQuestion('اختر رقم: ');
    
    switch (choice) {
      case '1':
        await viewTestimonial();
        break;
      case '2':
        await approveTestimonial();
        break;
      case '3':
        await rejectTestimonial();
        break;
      case '4':
        await deleteTestimonial();
        break;
      default:
        return;
    }
  } catch (error) {
    console.error('❌ خطأ في إدارة التقييمات:', error.message);
  }
}

// View specific testimonial
async function viewTestimonial() {
  const id = await askQuestion('أدخل ID التقييم: ');
  try {
    const testimonial = await database.get(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (testimonial) {
      console.log('\n⭐ تفاصيل التقييم');
      console.log('==================');
      console.log(`الاسم: ${testimonial.name}`);
      console.log(`البريد: ${testimonial.email || 'غير محدد'}`);
      console.log(`الخدمة: ${testimonial.service}`);
      console.log(`التقييم: ${testimonial.rating}/5`);
      console.log(`الحالة: ${testimonial.approved ? 'معتمد' : 'في الانتظار'}`);
      console.log(`التاريخ: ${testimonial.created_at}`);
      console.log(`التعليق: ${testimonial.message}`);
    } else {
      console.log('❌ التقييم غير موجود');
    }
  } catch (error) {
    console.error('❌ خطأ في عرض التقييم:', error.message);
  }
}

// Approve testimonial
async function approveTestimonial() {
  const id = await askQuestion('أدخل ID التقييم للموافقة: ');
  
  try {
    const result = await database.run(
      'UPDATE testimonials SET approved = 1, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes > 0) {
      console.log('✅ تم الموافقة على التقييم بنجاح');
    } else {
      console.log('❌ التقييم غير موجود');
    }
  } catch (error) {
    console.error('❌ خطأ في الموافقة على التقييم:', error.message);
  }
}

// Reject testimonial
async function rejectTestimonial() {
  const id = await askQuestion('أدخل ID التقييم للرفض: ');
  
  try {
    const result = await database.run(
      'UPDATE testimonials SET approved = 0 WHERE id = ?',
      [id]
    );

    if (result.changes > 0) {
      console.log('✅ تم رفض التقييم');
    } else {
      console.log('❌ التقييم غير موجود');
    }
  } catch (error) {
    console.error('❌ خطأ في رفض التقييم:', error.message);
  }
}

// Delete testimonial
async function deleteTestimonial() {
  const id = await askQuestion('أدخل ID التقييم للحذف: ');
  const confirm = await askQuestion('هل أنت متأكد؟ (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    try {
      const result = await database.run(
        'DELETE FROM testimonials WHERE id = ?',
        [id]
      );

      if (result.changes > 0) {
        console.log('✅ تم حذف التقييم بنجاح');
      } else {
        console.log('❌ التقييم غير موجود');
      }
    } catch (error) {
      console.error('❌ خطأ في حذف التقييم:', error.message);
    }
  }
}

// Show analytics
async function showAnalytics() {
  try {
    const stats = await database.query(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors,
        AVG(visit_duration) as avg_duration
      FROM website_analytics
    `);

    const deviceStats = await database.query(`
      SELECT device_type, COUNT(*) as count
      FROM website_analytics 
      GROUP BY device_type
      ORDER BY count DESC
    `);

    const pageStats = await database.query(`
      SELECT page_url, COUNT(*) as visits
      FROM website_analytics 
      GROUP BY page_url
      ORDER BY visits DESC
      LIMIT 5
    `);

    console.log('\n📊 تحليلات الموقع');
    console.log('==================');
    console.log(`إجمالي الزيارات: ${stats[0].total_visits}`);
    console.log(`الجلسات الفريدة: ${stats[0].unique_sessions}`);
    console.log(`الزوار الفريدون: ${stats[0].unique_visitors}`);
    console.log(`متوسط مدة الزيارة: ${Math.round(stats[0].avg_duration || 0)} ثانية`);

    console.log('\n📱 أنواع الأجهزة:');
    deviceStats.forEach(device => {
      console.log(`  ${device.device_type}: ${device.count}`);
    });

    console.log('\n📄 أكثر الصفحات زيارة:');
    pageStats.forEach(page => {
      console.log(`  ${page.page_url}: ${page.visits}`);
    });
  } catch (error) {
    console.error('❌ خطأ في جلب التحليلات:', error.message);
  }
}

// Manage emails
async function manageEmails() {
  try {
    const emails = await database.query(`
      SELECT id, to_email, subject, type, status, sent_at
      FROM email_logs 
      ORDER BY sent_at DESC 
      LIMIT 10
    `);

    console.log('\n📧 آخر 10 إيميلات');
    console.log('==================');
    emails.forEach(email => {
      const status = email.status === 'sent' ? '✅' : '❌';
      console.log(`${status} ${email.to_email} | ${email.subject} | ${email.sent_at}`);
    });

    const stats = await database.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
      FROM email_logs
    `);

    console.log('\n📊 إحصائيات الإيميلات:');
    console.log(`إجمالي الإيميلات: ${stats[0].total}`);
    console.log(`مرسل بنجاح: ${stats[0].sent}`);
    console.log(`فشل في الإرسال: ${stats[0].failed}`);
  } catch (error) {
    console.error('❌ خطأ في جلب الإيميلات:', error.message);
  }
}

// Clean database
async function cleanDatabase() {
  const confirm = await askQuestion('هل تريد تنظيف البيانات القديمة؟ (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    try {
      // Delete old analytics (older than 6 months)
      const result1 = await database.run(
        'DELETE FROM website_analytics WHERE created_at < datetime("now", "-6 months")'
      );

      // Delete old email logs (older than 3 months)
      const result2 = await database.run(
        'DELETE FROM email_logs WHERE sent_at < datetime("now", "-3 months")'
      );

      console.log(`✅ تم حذف ${result1.changes} سجل تحليلات قديم`);
      console.log(`✅ تم حذف ${result2.changes} سجل إيميل قديم`);
    } catch (error) {
      console.error('❌ خطأ في تنظيف قاعدة البيانات:', error.message);
    }
  }
}

// Export data
async function exportData() {
  try {
    const fs = require('fs');
    const path = require('path');

    const exportDir = './exports';
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Export messages
    const messages = await database.query('SELECT * FROM contact_messages');
    fs.writeFileSync(
      path.join(exportDir, `messages-${timestamp}.json`),
      JSON.stringify(messages, null, 2)
    );

    // Export testimonials
    const testimonials = await database.query('SELECT * FROM testimonials');
    fs.writeFileSync(
      path.join(exportDir, `testimonials-${timestamp}.json`),
      JSON.stringify(testimonials, null, 2)
    );

    // Export analytics
    const analytics = await database.query('SELECT * FROM website_analytics');
    fs.writeFileSync(
      path.join(exportDir, `analytics-${timestamp}.json`),
      JSON.stringify(analytics, null, 2)
    );

    console.log(`✅ تم تصدير البيانات إلى مجلد exports/`);
  } catch (error) {
    console.error('❌ خطأ في تصدير البيانات:', error.message);
  }
}

// Reset database
async function resetDatabase() {
  const confirm = await askQuestion('هل أنت متأكد من إعادة تعيين قاعدة البيانات؟ سيتم حذف جميع البيانات! (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    try {
      // Drop all tables
      await database.run('DROP TABLE IF EXISTS contact_messages');
      await database.run('DROP TABLE IF EXISTS testimonials');
      await database.run('DROP TABLE IF EXISTS website_analytics');
      await database.run('DROP TABLE IF EXISTS email_logs');
      await database.run('DROP TABLE IF EXISTS system_settings');

      // Recreate tables
      database.createTables();

      console.log('✅ تم إعادة تعيين قاعدة البيانات بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إعادة تعيين قاعدة البيانات:', error.message);
    }
  }
}

// Ask question helper
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Main menu loop
async function main() {
  console.log('🚀 بدء تشغيل لوحة الإدارة...');
  
  // Initialize database
  database.init();
  await new Promise(resolve => setTimeout(resolve, 1000));

  while (true) {
    showMenu();
    const choice = await askQuestion('اختر رقم: ');

    switch (choice) {
      case '1':
        await showStatistics();
        break;
      case '2':
        await manageMessages();
        break;
      case '3':
        await manageTestimonials();
        break;
      case '4':
        await showAnalytics();
        break;
      case '5':
        await manageEmails();
        break;
      case '6':
        await cleanDatabase();
        break;
      case '7':
        await exportData();
        break;
      case '8':
        await resetDatabase();
        break;
      case '0':
        console.log('👋 شكراً لاستخدام لوحة الإدارة!');
        rl.close();
        process.exit(0);
      default:
        console.log('❌ خيار غير صحيح');
    }

    await askQuestion('\nاضغط Enter للمتابعة...');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
