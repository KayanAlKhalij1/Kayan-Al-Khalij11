# دليل التشغيل السريع - كيان الخليج Backend

## 🚀 التشغيل السريع

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
```bash
# انسخ ملف البيئة
cp env.example .env

# عدّل الملف .env وأضف بيانات الإيميل
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
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

## 📧 إعداد Gmail للإيميلات

1. **تفعيل المصادقة الثنائية**:
   - اذهب إلى حساب Google
   - الأمان → المصادقة الثنائية
   - فعّل المصادقة الثنائية

2. **إنشاء كلمة مرور التطبيق**:
   - اذهب إلى الأمان → كلمات مرور التطبيقات
   - اختر "البريد" و "الكمبيوتر"
   - انسخ كلمة المرور المولدة

3. **استخدم كلمة المرور في .env**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## 🌐 النشر على Heroku

### 1. إنشاء تطبيق Heroku
```bash
# تثبيت Heroku CLI
# إنشاء تطبيق
heroku create kayan-factory-backend

# إضافة متغيرات البيئة
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASS=your-app-password
heroku config:set EMAIL_FROM=info@kayanfactory.com
heroku config:set EMAIL_TO=info@kayanfactory.com
```

### 2. النشر
```bash
# رفع الكود
git add .
git commit -m "Initial commit"
git push heroku main

# تشغيل تهيئة قاعدة البيانات
heroku run npm run init-db
```

## 🌐 النشر على Vercel

### 1. ربط المستودع
- اذهب إلى [vercel.com](https://vercel.com)
- اربط حساب GitHub
- اختر المستودع

### 2. إضافة متغيرات البيئة
```env
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=info@kayanfactory.com
EMAIL_TO=info@kayanfactory.com
```

### 3. النشر
- Vercel سيقوم بالنشر التلقائي
- بعد النشر، شغّل: `npm run init-db`

## 🌐 النشر على Railway

### 1. ربط المستودع
- اذهب إلى [railway.app](https://railway.app)
- اربط حساب GitHub
- اختر المستودع

### 2. إضافة متغيرات البيئة
- اذهب إلى Variables
- أضف المتغيرات المطلوبة

### 3. النشر
- Railway سيقوم بالنشر التلقائي
- بعد النشر، شغّل: `npm run init-db`

## 🔧 تحديث Frontend

### 1. تحديث URL في script.js
```javascript
// غيّر هذا السطر في script.js
const API_BASE_URL = 'https://your-backend-url.com/api';

// بدلاً من
const API_BASE_URL = 'https://kayan-factory-backend.herokuapp.com/api';
```

### 2. تحديث جميع استدعاءات API
```javascript
// مثال
const response = await fetch(`${API_BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(data)
});
```

## 📊 مراقبة الأداء

### 1. فحص حالة الخادم
```bash
curl https://your-backend-url.com/api/health
```

### 2. عرض الإحصائيات
```bash
# الرسائل
curl https://your-backend-url.com/api/contact/stats/summary

# التقييمات
curl https://your-backend-url.com/api/testimonials/stats/summary

# التحليلات
curl https://your-backend-url.com/api/analytics/stats/overview
```

## 🐛 حل المشاكل الشائعة

### 1. خطأ في قاعدة البيانات
```bash
# احذف قاعدة البيانات وأعد إنشاءها
rm -rf database/
npm run init-db
```

### 2. خطأ في الإيميل
- تأكد من صحة كلمة مرور التطبيق
- تأكد من تفعيل المصادقة الثنائية
- تحقق من إعدادات Gmail

### 3. خطأ CORS
- تأكد من إضافة URL الموقع في CORS origins
- تحقق من إعدادات الخادم

### 4. خطأ في النشر
- تأكد من إضافة جميع متغيرات البيئة
- تحقق من logs الخادم
- تأكد من صحة package.json

## 📞 الدعم

- **البريد الإلكتروني**: info@kayanfactory.com
- **الهاتف**: +966545666924
- **الموقع**: https://kayanfactory.netlify.app

---

**ملاحظة**: تأكد من تحديث URL الخادم في Frontend بعد النشر!
