# دليل النشر - كيان الخليج Backend

## 🚀 خيارات النشر

### 1. Heroku (مستحسن)

#### الخطوات:
1. **إنشاء تطبيق Heroku**:
   ```bash
   heroku create kayan-factory-backend
   ```

2. **إضافة متغيرات البيئة**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set EMAIL_USER=info@kayanfactory.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set EMAIL_FROM=info@kayanfactory.com
   heroku config:set EMAIL_TO=info@kayanfactory.com
   ```

3. **النشر**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

4. **تهيئة قاعدة البيانات**:
   ```bash
   heroku run npm run init-db
   ```

#### المميزات:
- ✅ سهل النشر
- ✅ دعم قاعدة البيانات
- ✅ SSL مجاني
- ✅ مراقبة الأداء

### 2. Railway

#### الخطوات:
1. **ربط المستودع**:
   - اذهب إلى [railway.app](https://railway.app)
   - اربط حساب GitHub
   - اختر المستودع

2. **إضافة متغيرات البيئة**:
   - اذهب إلى Variables
   - أضف المتغيرات من `production.env`

3. **النشر**:
   - Railway سيقوم بالنشر التلقائي
   - بعد النشر، شغّل: `npm run init-db`

#### المميزات:
- ✅ نشر تلقائي
- ✅ دعم قاعدة البيانات
- ✅ SSL مجاني
- ✅ مراقبة متقدمة

### 3. Vercel

#### الخطوات:
1. **ربط المستودع**:
   - اذهب إلى [vercel.com](https://vercel.com)
   - اربط حساب GitHub
   - اختر المستودع

2. **إضافة متغيرات البيئة**:
   - اذهب إلى Settings > Environment Variables
   - أضف المتغيرات المطلوبة

3. **النشر**:
   - Vercel سيقوم بالنشر التلقائي
   - بعد النشر، شغّل: `npm run init-db`

#### المميزات:
- ✅ نشر سريع
- ✅ CDN عالمي
- ✅ SSL مجاني
- ✅ مراقبة الأداء

### 4. DigitalOcean App Platform

#### الخطوات:
1. **إنشاء تطبيق**:
   - اذهب إلى [DigitalOcean](https://cloud.digitalocean.com)
   - اختر App Platform
   - اربط المستودع

2. **إعداد البيئة**:
   - أضف متغيرات البيئة
   - اختر Node.js runtime

3. **النشر**:
   - DigitalOcean سيقوم بالنشر التلقائي
   - بعد النشر، شغّل: `npm run init-db`

### 5. AWS Elastic Beanstalk

#### الخطوات:
1. **تثبيت EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **تهيئة التطبيق**:
   ```bash
   eb init
   eb create production
   ```

3. **إضافة متغيرات البيئة**:
   ```bash
   eb setenv NODE_ENV=production EMAIL_USER=info@kayanfactory.com
   ```

4. **النشر**:
   ```bash
   eb deploy
   ```

### 6. Docker

#### الخطوات:
1. **بناء الصورة**:
   ```bash
   docker build -t kayan-factory-backend .
   ```

2. **تشغيل الحاوية**:
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e EMAIL_USER=info@kayanfactory.com \
     -e EMAIL_PASS=your-app-password \
     kayan-factory-backend
   ```

3. **استخدام Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## 🔧 إعداد متغيرات البيئة

### متغيرات مطلوبة:
```env
NODE_ENV=production
PORT=3000
EMAIL_USER=info@kayanfactory.com
EMAIL_PASS=your-app-password
EMAIL_FROM=info@kayanfactory.com
EMAIL_TO=info@kayanfactory.com
```

### متغيرات اختيارية:
```env
DB_PATH=/app/database/kayan_factory.db
JWT_SECRET=your-secret-key
API_KEY=your-api-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGINS=https://kayanfactory.netlify.app
```

## 📧 إعداد Gmail للإيميلات

### 1. تفعيل المصادقة الثنائية:
- اذهب إلى حساب Google
- الأمان → المصادقة الثنائية
- فعّل المصادقة الثنائية

### 2. إنشاء كلمة مرور التطبيق:
- اذهب إلى الأمان → كلمات مرور التطبيقات
- اختر "البريد" و "الكمبيوتر"
- انسخ كلمة المرور المولدة

### 3. استخدام كلمة المرور:
```env
EMAIL_USER=info@kayanfactory.com
EMAIL_PASS=your-16-character-app-password
```

## 🔄 تحديث Frontend

### 1. تحديث URL في script.js:
```javascript
// غيّر هذا السطر
const API_BASE_URL = 'https://your-backend-url.com/api';

// بدلاً من
const API_BASE_URL = 'https://kayan-factory-backend.herokuapp.com/api';
```

### 2. تحديث جميع استدعاءات API:
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

### 1. فحص حالة الخادم:
```bash
curl https://your-backend-url.com/api/health
```

### 2. عرض الإحصائيات:
```bash
# الرسائل
curl https://your-backend-url.com/api/contact/stats/summary

# التقييمات
curl https://your-backend-url.com/api/testimonials/stats/summary

# التحليلات
curl https://your-backend-url.com/api/analytics/stats/overview
```

### 3. استخدام لوحة الإدارة:
```bash
npm run admin
```

## 🔒 الأمان

### 1. متغيرات البيئة:
- لا تشارك ملف `.env`
- استخدم كلمات مرور قوية
- غيّر المفاتيح الافتراضية

### 2. قاعدة البيانات:
- احتفظ بنسخ احتياطية
- شفّر البيانات الحساسة
- راقب الوصول

### 3. الشبكة:
- استخدم HTTPS فقط
- فعّل CORS بشكل صحيح
- راقب الطلبات المشبوهة

## 🐛 حل المشاكل

### 1. خطأ في قاعدة البيانات:
```bash
# احذف قاعدة البيانات وأعد إنشاءها
rm -rf database/
npm run init-db
```

### 2. خطأ في الإيميل:
- تأكد من صحة كلمة مرور التطبيق
- تأكد من تفعيل المصادقة الثنائية
- تحقق من إعدادات Gmail

### 3. خطأ CORS:
- تأكد من إضافة URL الموقع في CORS origins
- تحقق من إعدادات الخادم

### 4. خطأ في النشر:
- تأكد من إضافة جميع متغيرات البيئة
- تحقق من logs الخادم
- تأكد من صحة package.json

## 📈 تحسين الأداء

### 1. قاعدة البيانات:
- استخدم الفهارس
- نظف البيانات القديمة
- راقب الاستعلامات

### 2. الشبكة:
- فعّل الضغط
- استخدم CDN
- راقب الاستجابة

### 3. الخادم:
- راقب الذاكرة
- راقب CPU
- راقب القرص

## 📞 الدعم

- **البريد الإلكتروني**: info@kayanfactory.com
- **الهاتف**: +966545666924
- **الموقع**: https://kayanfactory.netlify.app

---

**ملاحظة**: تأكد من تحديث URL الخادم في Frontend بعد النشر!
