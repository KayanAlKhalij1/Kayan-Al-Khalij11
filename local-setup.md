# 🛠️ إعداد البيئة المحلية - كيان الخليج Backend

## 📋 المتطلبات الأساسية

### 1. Node.js
```bash
# تحقق من الإصدار
node --version  # يجب أن يكون 16+ 

# تحقق من npm
npm --version
```

### 2. Git
```bash
# تحقق من Git
git --version
```

### 3. محرر النصوص
- VS Code (مستحسن)
- أو أي محرر آخر

## 🚀 خطوات الإعداد

### 1. استنساخ المشروع
```bash
git clone https://github.com/your-username/kayan-factory-backend.git
cd kayan-factory-backend
```

### 2. تثبيت المتطلبات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
```bash
# انسخ ملف البيئة
cp env.example .env

# عدّل الملف
nano .env
# أو
code .env
```

### 4. إعداد Gmail للإيميلات

#### أ. تفعيل المصادقة الثنائية
1. اذهب إلى [myaccount.google.com](https://myaccount.google.com)
2. اختر "الأمان"
3. فعّل "المصادقة الثنائية"

#### ب. إنشاء كلمة مرور التطبيق
1. اذهب إلى "كلمات مرور التطبيقات"
2. اختر "البريد" و "الكمبيوتر"
3. انسخ كلمة المرور المولدة (16 حرف)

#### ج. إضافة كلمة المرور في .env
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=info@kayanfactory.com
EMAIL_TO=info@kayanfactory.com
```

### 5. تهيئة قاعدة البيانات
```bash
npm run init-db
```

### 6. تشغيل الخادم
```bash
# للتطوير (مع إعادة التشغيل التلقائي)
npm run dev

# للإنتاج
npm start
```

## 🧪 اختبار النظام

### 1. فحص الصحة
```bash
curl http://localhost:3000/api/health
```

**النتيجة المتوقعة:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### 2. اختبار إرسال رسالة
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "message": "أريد استشارة حول الكرتن وول"
  }'
```

### 3. اختبار إرسال تقييم
```bash
curl -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "فاطمة السعيد",
    "email": "fatima@example.com",
    "service": "curtain-wall",
    "rating": 5,
    "message": "خدمة ممتازة وجودة عالية"
  }'
```

### 4. اختبار تتبع الزيارة
```bash
curl -X POST http://localhost:3000/api/analytics/visit \
  -H "Content-Type: application/json" \
  -d '{
    "page_url": "http://localhost:3000/",
    "page_title": "Test Page",
    "device_type": "desktop",
    "browser": "Chrome",
    "os": "Windows"
  }'
```

## 🔧 إدارة النظام

### 1. لوحة الإدارة
```bash
npm run admin
```

**الخيارات المتاحة:**
- عرض الإحصائيات العامة
- إدارة الرسائل
- إدارة التقييمات
- عرض تحليلات الموقع
- إدارة الإيميلات
- تنظيف قاعدة البيانات
- تصدير البيانات

### 2. الاختبارات
```bash
# تشغيل جميع الاختبارات
npm test

# اختبارات مع إعادة التشغيل التلقائي
npm run test:watch

# اختبارات مع تغطية الكود
npm run test:coverage
```

### 3. مراقبة الأداء
```bash
# فحص الذاكرة
node --inspect server.js

# مراقبة العمليات
pm2 monit
```

## 📊 قاعدة البيانات

### 1. موقع قاعدة البيانات
```
./database/kayan_factory.db
```

### 2. الجداول المتاحة
- `contact_messages` - رسائل التواصل
- `testimonials` - التقييمات
- `website_analytics` - تحليلات الموقع
- `email_logs` - سجلات الإيميلات
- `system_settings` - إعدادات النظام

### 3. إدارة قاعدة البيانات
```bash
# عرض قاعدة البيانات
sqlite3 database/kayan_factory.db

# عرض الجداول
.tables

# عرض هيكل جدول
.schema contact_messages

# تشغيل استعلام
SELECT * FROM contact_messages LIMIT 5;

# الخروج
.quit
```

## 🐛 حل المشاكل

### 1. خطأ "Port already in use"
```bash
# ابحث عن العملية
lsof -ti:3000

# أوقف العملية
kill -9 $(lsof -ti:3000)

# أو استخدم منفذ آخر
PORT=3001 npm start
```

### 2. خطأ في قاعدة البيانات
```bash
# احذف قاعدة البيانات
rm -rf database/

# أعد إنشاءها
npm run init-db
```

### 3. خطأ في الإيميل
```bash
# تحقق من متغيرات البيئة
echo $EMAIL_USER
echo $EMAIL_PASS

# اختبر الاتصال
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.error('Error:', error);
  else console.log('Email service ready');
});
"
```

### 4. خطأ في CORS
```bash
# تحقق من إعدادات CORS في server.js
# تأكد من إضافة localhost في CORS origins
```

## 📁 هيكل المشروع

```
kayan-factory-backend/
├── config/
│   └── database.js          # إعداد قاعدة البيانات
├── routes/
│   ├── contact.js           # مسارات الرسائل
│   ├── testimonials.js      # مسارات التقييمات
│   └── analytics.js         # مسارات التحليلات
├── services/
│   └── emailService.js      # خدمة الإيميلات
├── scripts/
│   ├── init-database.js     # تهيئة قاعدة البيانات
│   └── admin.js             # لوحة الإدارة
├── tests/
│   ├── api.test.js          # اختبارات API
│   └── setup.js             # إعداد الاختبارات
├── database/
│   └── kayan_factory.db     # قاعدة البيانات
├── server.js                # الخادم الرئيسي
├── package.json             # إعدادات المشروع
├── .env.example             # مثال متغيرات البيئة
├── README.md                # دليل المشروع
├── API-DOCS.md              # وثائق API
├── DEPLOYMENT.md            # دليل النشر
└── GETTING-STARTED.md       # دليل البدء السريع
```

## 🔗 روابط مفيدة

- **وثائق API**: [API-DOCS.md](./API-DOCS.md)
- **دليل النشر**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **دليل التشغيل السريع**: [QUICK-START.md](./QUICK-START.md)
- **دليل البدء**: [GETTING-STARTED.md](./GETTING-STARTED.md)

## 📞 الدعم

- **البريد الإلكتروني**: info@kayanfactory.com
- **الهاتف**: +966545666924
- **الموقع**: https://kayanalkhalij1.github.io/Kayan-Al-Khalij11/

---

**🎉 تهانينا!** لقد نجحت في إعداد البيئة المحلية بنجاح!