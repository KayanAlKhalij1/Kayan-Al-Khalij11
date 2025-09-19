# 🏭 كيان الخليج للصناعة - Backend API

Backend احترافي ومتكامل لموقع كيان الخليج للصناعة يتضمن إدارة شاملة للرسائل والتقييمات وتتبع الزيارات مع نظام إشعارات متقدم.

## ✨ المميزات الرئيسية

- 🚀 **API احترافي**: RESTful API مع توثيق شامل
- 📧 **إدارة الرسائل**: استقبال وإدارة رسائل التواصل من العملاء
- ⭐ **نظام التقييمات**: جمع وإدارة تقييمات العملاء للخدمات
- 📊 **تتبع الزيارات**: تحليلات شاملة ومتقدمة لزوار الموقع
- 📨 **إرسال الإيميلات**: إشعارات تلقائية وردود آلية باللغة العربية
- 🗄️ **قاعدة بيانات SQLite**: تخزين آمن وموثوق للبيانات
- 🔒 **أمان متقدم**: حماية شاملة من الهجمات ومعدل الطلبات
- 🌍 **دعم متعدد اللغات**: واجهة عربية كاملة مع دعم الإنجليزية
- 📱 **تتبع الأجهزة**: تحليل أنواع الأجهزة والمتصفحات
- 📈 **إحصائيات مباشرة**: مراقبة الأداء في الوقت الفعلي

## التقنيات المستخدمة

- **Node.js** - بيئة تشغيل JavaScript
- **Express.js** - إطار عمل الويب
- **SQLite** - قاعدة البيانات
- **Nodemailer** - إرسال الإيميلات
- **Helmet** - أمان HTTP
- **CORS** - دعم الطلبات المتقاطعة
- **Rate Limiting** - حماية من الإفراط في الطلبات

## التثبيت والتشغيل

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد متغيرات البيئة

انسخ ملف `.env.example` إلى `.env` واملأ البيانات:

```bash
cp env.example .env
```

قم بتعديل الملف `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_PATH=./database/kayan_factory.db

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=info@kayanfactory.com
EMAIL_TO=info@kayanfactory.com
```

### 3. تهيئة قاعدة البيانات

```bash
npm run init-db
```

### 4. تشغيل الخادم

```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## API Endpoints

### الرسائل (Contact)

- `POST /api/contact` - إرسال رسالة جديدة
- `GET /api/contact` - جلب الرسائل (إدارة)
- `GET /api/contact/:id` - جلب رسالة محددة
- `PUT /api/contact/:id/status` - تحديث حالة الرسالة
- `DELETE /api/contact/:id` - حذف رسالة
- `GET /api/contact/stats/summary` - إحصائيات الرسائل

### التقييمات (Testimonials)

- `POST /api/testimonials` - إرسال تقييم جديد
- `GET /api/testimonials` - جلب التقييمات (إدارة)
- `GET /api/testimonials/public` - جلب التقييمات المعتمدة
- `PUT /api/testimonials/:id/approve` - الموافقة على التقييم
- `DELETE /api/testimonials/:id` - حذف تقييم
- `GET /api/testimonials/stats/summary` - إحصائيات التقييمات

### التحليلات (Analytics)

- `POST /api/analytics/visit` - تسجيل زيارة
- `PUT /api/analytics/visit/:id/duration` - تحديث مدة الزيارة
- `GET /api/analytics/visits` - جلب بيانات الزيارات
- `GET /api/analytics/stats/overview` - نظرة عامة على الإحصائيات
- `GET /api/analytics/stats/real-time` - إحصائيات مباشرة
- `GET /api/analytics/export` - تصدير البيانات

### الصحة العامة

- `GET /api/health` - فحص حالة الخادم
- `GET /` - معلومات API

## مثال على الاستخدام

### إرسال رسالة تواصل

```javascript
const response = await fetch('https://your-domain.com/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    message: 'أريد استشارة حول الكرتن وول'
  })
});

const result = await response.json();
console.log(result.message); // "تم إرسال رسالتك بنجاح!"
```

### إرسال تقييم

```javascript
const response = await fetch('https://your-domain.com/api/testimonials', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'فاطمة السعيد',
    email: 'fatima@example.com',
    service: 'curtain-wall',
    rating: 5,
    message: 'خدمة ممتازة وجودة عالية'
  })
});
```

### تتبع زيارة

```javascript
const response = await fetch('https://your-domain.com/api/analytics/visit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    page_url: window.location.href,
    page_title: document.title,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows'
  })
});
```

## إعداد الإيميل

### Gmail

1. قم بتفعيل المصادقة الثنائية
2. أنشئ كلمة مرور التطبيق
3. استخدم كلمة مرور التطبيق في `EMAIL_PASS`

### إعدادات أخرى

```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## النشر

### Heroku

1. أنشئ تطبيق Heroku
2. أضف متغيرات البيئة
3. اربط مع GitHub
4. فعّل النشر التلقائي

### Vercel

1. اربط المستودع مع Vercel
2. أضف متغيرات البيئة
3. قم بالنشر

### Railway

1. اربط المستودع مع Railway
2. أضف متغيرات البيئة
3. قم بالنشر

## الأمان

- ✅ حماية من SQL Injection
- ✅ تحقق من صحة البيانات
- ✅ Rate Limiting
- ✅ CORS Configuration
- ✅ Helmet Security Headers
- ✅ Input Sanitization

## المراقبة

- سجلات مفصلة للعمليات
- تتبع الأخطاء
- إحصائيات الأداء
- مراقبة قاعدة البيانات

## الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل:

- البريد الإلكتروني: info@kayanfactory.com
- الهاتف: +966545666924
- الموقع: https://kayanalkhalij1.github.io/Kayan-Al-Khalij11/

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

**كيان الخليج للصناعة** - رؤية هندسية متطورة