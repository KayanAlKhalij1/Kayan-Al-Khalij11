const nodemailer = require('nodemailer');
const database = require('../config/database');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Email service configuration error:', error);
        } else {
          console.log('✅ Email service ready');
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  async sendEmail(to, subject, html, type = 'general', relatedId = null) {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'info@kayanfactory.com',
      to: to,
      subject: subject,
      html: html,
      replyTo: process.env.EMAIL_FROM || 'info@kayanfactory.com'
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      
      // Log email in database
      await this.logEmail(to, subject, type, 'sent', null, relatedId);
      
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      
      // Log failed email
      await this.logEmail(to, subject, type, 'failed', error.message, relatedId);
      
      throw error;
    }
  }

  async logEmail(to, subject, type, status, errorMessage = null, relatedId = null) {
    try {
      await database.run(
        'INSERT INTO email_logs (to_email, subject, type, status, error_message, related_id) VALUES (?, ?, ?, ?, ?, ?)',
        [to, subject, type, status, errorMessage, relatedId]
      );
    } catch (error) {
      console.error('❌ Failed to log email:', error);
    }
  }

  // Send contact form notification
  async sendContactNotification(contactData) {
    const { name, email, phone, message } = contactData;
    
    const subject = `رسالة جديدة من ${name} - موقع كيان الخليج`;
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>رسالة جديدة من موقع كيان الخليج</title>
        <style>
          body {
            font-family: 'Cairo', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #1565c0, #1976d2);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin-bottom: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-right: 4px solid #1565c0;
          }
          .field-label {
            font-weight: bold;
            color: #1565c0;
            margin-bottom: 5px;
            display: block;
          }
          .field-value {
            color: #333;
            font-size: 16px;
          }
          .message-content {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #bbdefb;
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .contact-info {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 رسالة جديدة من موقع كيان الخليج</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="field-label">👤 الاسم:</span>
              <span class="field-value">${name}</span>
            </div>
            
            <div class="field">
              <span class="field-label">📧 البريد الإلكتروني:</span>
              <span class="field-value">${email}</span>
            </div>
            
            ${phone ? `
            <div class="field">
              <span class="field-label">📞 رقم الهاتف:</span>
              <span class="field-value">${phone}</span>
            </div>
            ` : ''}
            
            <div class="field">
              <span class="field-label">💬 الرسالة:</span>
              <div class="message-content">${message}</div>
            </div>
          </div>
          
          <div class="contact-info">
            <strong>📅 تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-SA')}<br>
            <strong>🌐 الموقع:</strong> kayanfactory.netlify.app
          </div>
          
          <div class="footer">
            <p>تم إرسال هذه الرسالة تلقائياً من موقع كيان الخليج للصناعة</p>
            <p>للاستفسارات: info@kayanfactory.com | +966545666924</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(
      process.env.EMAIL_TO || 'info@kayanfactory.com',
      subject,
      html,
      'contact_notification',
      contactData.id
    );
  }

  // Send testimonial notification
  async sendTestimonialNotification(testimonialData) {
    const { name, email, service, rating, message } = testimonialData;
    
    const subject = `تقييم جديد من ${name} - موقع كيان الخليج`;
    
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقييم جديد من موقع كيان الخليج</title>
        <style>
          body {
            font-family: 'Cairo', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #ff9800, #ffb74d);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin-bottom: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-right: 4px solid #ff9800;
          }
          .field-label {
            font-weight: bold;
            color: #ff9800;
            margin-bottom: 5px;
            display: block;
          }
          .field-value {
            color: #333;
            font-size: 16px;
          }
          .rating {
            font-size: 24px;
            color: #ff9800;
            margin: 10px 0;
          }
          .message-content {
            background: #fff3e0;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ffcc02;
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .contact-info {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⭐ تقييم جديد من موقع كيان الخليج</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="field-label">👤 الاسم:</span>
              <span class="field-value">${name}</span>
            </div>
            
            ${email ? `
            <div class="field">
              <span class="field-label">📧 البريد الإلكتروني:</span>
              <span class="field-value">${email}</span>
            </div>
            ` : ''}
            
            <div class="field">
              <span class="field-label">🔧 نوع الخدمة:</span>
              <span class="field-value">${service}</span>
            </div>
            
            <div class="field">
              <span class="field-label">⭐ التقييم:</span>
              <div class="rating">${stars} (${rating}/5)</div>
            </div>
            
            <div class="field">
              <span class="field-label">💬 التعليق:</span>
              <div class="message-content">${message}</div>
            </div>
          </div>
          
          <div class="contact-info">
            <strong>📅 تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-SA')}<br>
            <strong>🌐 الموقع:</strong> kayanfactory.netlify.app
          </div>
          
          <div class="footer">
            <p>تم إرسال هذا التقييم تلقائياً من موقع كيان الخليج للصناعة</p>
            <p>للاستفسارات: info@kayanfactory.com | +966545666924</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(
      process.env.EMAIL_TO || 'info@kayanfactory.com',
      subject,
      html,
      'testimonial_notification',
      testimonialData.id
    );
  }

  // Send auto-reply to customer
  async sendAutoReply(to, name, type = 'contact') {
    const subject = type === 'contact' 
      ? 'شكراً لك - كيان الخليج للصناعة'
      : 'شكراً لتقييمك - كيان الخليج للصناعة';

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>شكراً لك - كيان الخليج للصناعة</title>
        <style>
          body {
            font-family: 'Cairo', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #1565c0, #1976d2);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 1.8;
          }
          .highlight {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 5px;
            border-right: 4px solid #1565c0;
            margin: 20px 0;
          }
          .contact-info {
            background: #f0f8ff;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>شكراً لك ${name}!</h1>
          </div>
          
          <div class="content">
            ${type === 'contact' ? `
            <p>نشكرك على تواصلك معنا في كيان الخليج للصناعة. لقد تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
            
            <div class="highlight">
              <strong>📋 ما يحدث الآن:</strong><br>
              • تم تسجيل رسالتك في نظامنا<br>
              • سيقوم فريقنا بمراجعة طلبك خلال 24 ساعة<br>
              • سنتواصل معك عبر الهاتف أو البريد الإلكتروني<br>
              • يمكنك متابعة حالة طلبك عبر موقعنا
            </div>
            ` : `
            <p>نشكرك على تقييمك لخدماتنا في كيان الخليج للصناعة. تقييمك مهم جداً لنا ويساعدنا على تحسين خدماتنا.</p>
            
            <div class="highlight">
              <strong>⭐ حول تقييمك:</strong><br>
              • تم تسجيل تقييمك في نظامنا<br>
              • سيتم مراجعة التقييم قبل النشر<br>
              • سنتواصل معك إذا احتجنا أي معلومات إضافية<br>
              • شكراً لثقتك في خدماتنا
            </div>
            `}
            
            <div class="contact-info">
              <strong>📞 للاستفسارات السريعة:</strong><br>
              الهاتف: +966545666924<br>
              البريد الإلكتروني: info@kayanfactory.com<br>
              الموقع: kayanfactory.netlify.app
            </div>
          </div>
          
          <div class="footer">
            <p>كيان الخليج للصناعة - رؤية هندسية متطورة</p>
            <p>الرياض، طريق الملك عبدالعزيز</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(to, subject, html, 'auto_reply');
  }
}

module.exports = new EmailService();
