# 🚀 دليل البدء السريع - كيان الخليج Backend

## 📋 المتطلبات

- Node.js 16+ 
- npm أو yarn
- حساب Gmail للإيميلات

## ⚡ التشغيل السريع (5 دقائق)

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد البيئة
```bash
# انسخ ملف البيئة
cp env.example .env

# عدّل الملف .env
nano .env
```

### 3. إعداد Gmail
1. فعّل المصادقة الثنائية في Gmail
2. أنشئ كلمة مرور التطبيق
3. أضف كلمة المرور في `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### 4. تهيئة قاعدة البيانات
```bash
npm run init-db
```

### 5. تشغيل الخادم
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

### 6. اختبار API
```bash
# فحص الصحة
curl http://localhost:3000/api/health

# إرسال رسالة تجريبية
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "message": "أريد استشارة حول الكرتن وول"
  }'
```

## 🌐 النشر السريع

### Heroku (الأسهل)
```bash
# تثبيت Heroku CLI
# إنشاء تطبيق
heroku create kayan-factory-backend

# إضافة متغيرات البيئة
heroku config:set EMAIL_USER=info@kayanfactory.com
heroku config:set EMAIL_PASS=your-app-password

# النشر
git push heroku main

# تهيئة قاعدة البيانات
heroku run npm run init-db
```

### Railway
1. اذهب إلى [railway.app](https://railway.app)
2. اربط GitHub
3. اختر المستودع
4. أضف متغيرات البيئة
5. انتظر النشر التلقائي

## 🔧 إدارة النظام

### لوحة الإدارة
```bash
npm run admin
```

### الاختبارات
```bash
# تشغيل الاختبارات
npm test

# اختبارات مع تغطية
npm run test:coverage
```

### مراقبة الأداء
```bash
# فحص الصحة
curl https://your-backend-url.com/api/health

# إحصائيات الرسائل
curl https://your-backend-url.com/api/contact/stats/summary

# إحصائيات التقييمات
curl https://your-backend-url.com/api/testimonials/stats/summary
```

## 📱 تحديث Frontend

### 1. تحديث URL في script.js
```javascript
// غيّر هذا السطر
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### 2. اختبار الاتصال
```javascript
// في console المتصفح
fetch('https://your-backend-url.com/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🐛 حل المشاكل السريع

### خطأ في قاعدة البيانات
```bash
rm -rf database/
npm run init-db
```

### خطأ في الإيميل
- تأكد من كلمة مرور التطبيق
- تأكد من تفعيل المصادقة الثنائية

### خطأ CORS
- تأكد من إضافة URL الموقع في CORS origins

### خطأ في النشر
- تأكد من إضافة جميع متغيرات البيئة
- تحقق من logs الخادم

## 📊 مراقبة النظام

### الإحصائيات المباشرة
- **الرسائل**: `/api/contact/stats/summary`
- **التقييمات**: `/api/testimonials/stats/summary`
- **التحليلات**: `/api/analytics/stats/overview`

### لوحة الإدارة
- تشغيل: `npm run admin`
- عرض الرسائل والتقييمات
- إدارة قاعدة البيانات
- تصدير البيانات

## 🔗 روابط مفيدة

- **وثائق API**: [API-DOCS.md](./API-DOCS.md)
- **دليل النشر**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **دليل التشغيل السريع**: [QUICK-START.md](./QUICK-START.md)

## 📞 الدعم

- **البريد الإلكتروني**: info@kayanfactory.com
- **الهاتف**: +966545666924
- **الموقع**: https://kayanfactory.netlify.app

---

**🎉 تهانينا!** لقد نجحت في تشغيل Backend كيان الخليج بنجاح!
