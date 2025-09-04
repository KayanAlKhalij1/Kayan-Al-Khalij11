# دليل الصيانة المستمرة - موقع كيان الخليج

## 🔧 إرشادات الصيانة الشاملة

### 1. الصيانة اليومية

#### مراقبة الأداء
```bash
# فحص سرعة الموقع
curl -w "@curl-format.txt" -o /dev/null -s "https://kayanfactory.com"

# فحص حالة الخادم
uptime
df -h
free -m
```

#### مراقبة الأخطاء
```bash
# فحص سجلات الأخطاء
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log

# فحص سجلات الوصول
tail -f /var/log/apache2/access.log
```

#### مراقبة الأمان
```bash
# فحص محاولات الاختراق
grep "Failed password" /var/log/auth.log
grep "Invalid user" /var/log/auth.log

# فحص الملفات المشبوهة
find /var/www/html -name "*.php" -mtime -1
```

### 2. الصيانة الأسبوعية

#### تحديث المحتوى
- [ ] مراجعة وتحديث معلومات الشركة
- [ ] إضافة صور جديدة للمشاريع
- [ ] تحديث آراء العملاء
- [ ] مراجعة الترجمات
- [ ] تحديث معلومات الاتصال

#### فحص الأداء
```bash
# اختبار Core Web Vitals
lighthouse https://kayanfactory.com --output html

# فحص PageSpeed Insights
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://kayanfactory.com&key=YOUR_API_KEY"
```

#### فحص الأمان
```bash
# فحص الثغرات الأمنية
nmap -sV -sC kayanfactory.com

# فحص SSL
openssl s_client -connect kayanfactory.com:443 -servername kayanfactory.com
```

### 3. الصيانة الشهرية

#### تحديث التبعيات
```bash
# تحديث Node.js
npm update

# فحص التحديثات الأمنية
npm audit
npm audit fix

# تحديث المكتبات
npm outdated
npm update
```

#### تحسين قاعدة البيانات
```bash
# تنظيف الملفات المؤقتة
find /tmp -type f -atime +7 -delete

# تنظيف سجلات النظام
journalctl --vacuum-time=30d
```

#### مراجعة الأداء
- [ ] تحليل إحصائيات Google Analytics
- [ ] مراجعة تقارير Google Search Console
- [ ] تحليل Core Web Vitals
- [ ] فحص سرعة التحميل
- [ ] مراجعة معدل الارتداد

### 4. الصيانة الفصلية

#### فحص شامل للأمان
```bash
# فحص شامل للملفات
find /var/www/html -type f -exec md5sum {} \; > checksums.txt

# فحص الصلاحيات
find /var/www/html -type f -perm /o+w
find /var/www/html -type d -perm /o+w
```

#### تحسين SEO
- [ ] مراجعة وتحسين Meta tags
- [ ] تحديث Sitemap
- [ ] مراجعة الروابط المكسورة
- [ ] تحسين Structured Data
- [ ] مراجعة محتوى الصفحات

#### تحسين الأداء
```bash
# تحسين الصور
imageoptim *.png *.jpg *.jpeg

# ضغط الملفات
npm run minify-css
npm run minify-js

# تنظيف التخزين المؤقت
rm -rf /var/cache/apache2/*
rm -rf /var/cache/nginx/*
```

### 5. الصيانة السنوية

#### مراجعة شاملة
- [ ] مراجعة تصميم الموقع
- [ ] تحديث التقنيات المستخدمة
- [ ] إضافة ميزات جديدة
- [ ] تحسين تجربة المستخدم
- [ ] مراجعة استراتيجية المحتوى

#### تحديث البنية التحتية
```bash
# تحديث نظام التشغيل
sudo apt update && sudo apt upgrade

# تحديث Apache/Nginx
sudo apt install apache2 nginx

# تحديث شهادة SSL
sudo certbot renew
```

### 6. أدوات المراقبة

#### أدوات مجانية
- **Google Analytics**: مراقبة الزيارات
- **Google Search Console**: مراقبة SEO
- **UptimeRobot**: مراقبة التوفر
- **Pingdom**: مراقبة الأداء
- **GTmetrix**: تحليل الأداء

#### أدوات مدفوعة
- **New Relic**: مراقبة الأداء الشاملة
- **Datadog**: مراقبة البنية التحتية
- **Sentry**: مراقبة الأخطاء
- **LogRocket**: مراقبة تجربة المستخدم

### 7. إجراءات الطوارئ

#### في حالة تعطل الموقع
```bash
# فحص حالة الخادم
systemctl status apache2
systemctl status nginx

# إعادة تشغيل الخدمات
sudo systemctl restart apache2
sudo systemctl restart nginx

# فحص المساحة المتاحة
df -h

# فحص استخدام الذاكرة
free -h
```

#### في حالة اختراق
```bash
# فحص الملفات المشبوهة
find /var/www/html -name "*.php" -mtime -1
find /var/www/html -name "*.js" -mtime -1

# فحص الاتصالات المشبوهة
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# إيقاف الخدمات مؤقتاً
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### 8. النسخ الاحتياطية

#### النسخ الاحتياطية التلقائية
```bash
#!/bin/bash
# backup-daily.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/kayan-static"
SITE_DIR="/var/www/html"
DB_BACKUP="/backups/database"

# نسخة احتياطية للموقع
tar -czf $BACKUP_DIR/kayan-static_$DATE.tar.gz -C $SITE_DIR .

# نسخة احتياطية لقاعدة البيانات (إذا كانت موجودة)
if [ -f "/var/lib/mysql/kayan_db" ]; then
  mysqldump -u root -p kayan_db > $DB_BACKUP/kayan_db_$DATE.sql
fi

# حذف النسخ الاحتياطية القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "kayan-static_*.tar.gz" -mtime +30 -delete
find $DB_BACKUP -name "kayan_db_*.sql" -mtime +30 -delete

echo "Backup completed: kayan-static_$DATE.tar.gz"
```

#### جدولة النسخ الاحتياطية
```bash
# إضافة إلى crontab
crontab -e

# نسخة احتياطية يومية في الساعة 2 صباحاً
0 2 * * * /path/to/backup-daily.sh

# نسخة احتياطية أسبوعية يوم الأحد
0 3 * * 0 /path/to/backup-weekly.sh

# نسخة احتياطية شهرية
0 4 1 * * /path/to/backup-monthly.sh
```

### 9. مراقبة الأداء

#### مراقبة Core Web Vitals
```javascript
// إضافة مراقبة الأداء في script.js
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // إرسال البيانات لخدمة المراقبة
      const data = {
        metric: entry.entryType,
        value: entry.value || entry.startTime,
        timestamp: Date.now(),
        url: window.location.href
      };
      
      // إرسال البيانات
      fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  });
  
  observer.observe({ 
    entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
  });
}
```

#### مراقبة الأخطاء
```javascript
// مراقبة الأخطاء في JavaScript
window.addEventListener('error', (e) => {
  const errorData = {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack,
    timestamp: Date.now(),
    url: window.location.href
  };
  
  // إرسال البيانات
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  });
});

// مراقبة Promise rejections
window.addEventListener('unhandledrejection', (e) => {
  const errorData = {
    message: e.reason?.message || e.reason,
    stack: e.reason?.stack,
    timestamp: Date.now(),
    url: window.location.href
  };
  
  // إرسال البيانات
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  });
});
```

### 10. تحسينات مستمرة

#### تحسين المحتوى
- [ ] إضافة محتوى جديد بانتظام
- [ ] تحديث الصور والفيديوهات
- [ ] تحسين النصوص والوصف
- [ ] إضافة شهادات واعتمادات جديدة
- [ ] تحديث معلومات المشاريع

#### تحسين التقنية
- [ ] تحديث المكتبات والتبعيات
- [ ] تحسين الكود والأداء
- [ ] إضافة ميزات جديدة
- [ ] تحسين الأمان
- [ ] تحسين إمكانية الوصول

#### تحسين SEO
- [ ] مراجعة وتحسين الكلمات المفتاحية
- [ ] تحسين Meta descriptions
- [ ] إضافة محتوى جديد لتحسين الترتيب
- [ ] تحسين سرعة الموقع
- [ ] إضافة Structured Data جديد

### 11. التقارير الدورية

#### تقرير أسبوعي
- عدد الزيارات
- مصادر الزيارات
- الصفحات الأكثر زيارة
- معدل الارتداد
- متوسط مدة الجلسة

#### تقرير شهري
- تحليل الأداء الشامل
- تقرير الأخطاء
- تحليل SEO
- توصيات التحسين
- خطة العمل للشهر القادم

#### تقرير فصلي
- مراجعة شاملة للأداء
- تحليل المنافسين
- تقرير الأمان
- خطة التطوير
- الميزانية المقترحة

### 12. إجراءات الأمان

#### فحص دوري للأمان
```bash
# فحص الملفات المشبوهة
find /var/www/html -name "*.php" -exec grep -l "eval\|base64_decode\|gzinflate" {} \;

# فحص الاتصالات المشبوهة
netstat -tulpn | grep -E ":(80|443|22|21|23|25|53|110|143|993|995|3306|5432|6379|27017)"

# فحص الملفات المخفية
find /var/www/html -name ".*" -type f
```

#### تحديثات الأمان
```bash
# تحديث نظام التشغيل
sudo apt update && sudo apt upgrade

# تحديث شهادة SSL
sudo certbot renew

# فحص التحديثات الأمنية
npm audit
npm audit fix
```

### 13. خطة الطوارئ

#### في حالة تعطل الخادم
1. **التواصل مع مزود الخدمة**
2. **تفعيل النسخة الاحتياطية**
3. **إعادة توجيه النطاق مؤقتاً**
4. **إشعار العملاء**

#### في حالة اختراق
1. **إيقاف الخدمات فوراً**
2. **عزل الخادم**
3. **فحص شامل للملفات**
4. **استعادة من نسخة احتياطية نظيفة**
5. **تحديث كلمات المرور**
6. **إشعار العملاء والسلطات**

### 14. التواصل مع العملاء

#### إشعارات التحديثات
- إشعار العملاء بالتحديثات المهمة
- نشر التحديثات على وسائل التواصل الاجتماعي
- إرسال رسائل البريد الإلكتروني للعملاء المهمين

#### الاستجابة للاستفسارات
- الرد على استفسارات العملاء بسرعة
- توفير معلومات واضحة ومفيدة
- متابعة الشكاوى وحلها

---

**ملاحظة مهمة**: يجب الاحتفاظ بنسخة من هذا الدليل في مكان آمن وتحديثه بانتظام. 