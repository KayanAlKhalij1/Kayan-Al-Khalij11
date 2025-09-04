# دليل النشر النهائي - موقع كيان الخليج

## 🚀 إرشادات النشر الشاملة

### 1. التحضير للنشر

#### فحص الملفات الأساسية
```bash
# التأكد من وجود جميع الملفات المطلوبة
ls -la

# الملفات المطلوبة:
# ✅ index.html
# ✅ about.html
# ✅ products.html
# ✅ contact.html
# ✅ comments.html
# ✅ 404.html
# ✅ style.css
# ✅ script.js
# ✅ manifest.json
# ✅ sw.js
# ✅ robots.txt
# ✅ sitemap.xml
# ✅ translations.json
# ✅ .htaccess
# ✅ package.json
# ✅ README.md
```

#### فحص الأداء
```bash
# تشغيل اختبارات الأداء
npm run lighthouse
npm run accessibility
npm run validate
```

### 2. تحسين الملفات للإنتاج

#### ضغط الملفات
```bash
# ضغط CSS
npm run minify-css

# ضغط JavaScript
npm run minify-js

# تحسين الصور
npm run optimize-images
```

#### إنشاء ملفات الإنتاج
```bash
# بناء المشروع للإنتاج
npm run build

# إنشاء نسخة مضغوطة
npm run compress
```

### 3. إعداد الخادم

#### متطلبات الخادم
- **نوع الخادم**: Apache أو Nginx
- **PHP**: 7.4 أو أحدث (اختياري)
- **SSL Certificate**: مطلوب
- **Domain**: kayanfactory.com
- **Storage**: 500MB على الأقل

#### إعدادات Apache
```apache
# تفعيل mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2

# تفعيل mod_headers
sudo a2enmod headers
sudo systemctl restart apache2

# تفعيل mod_expires
sudo a2enmod expires
sudo systemctl restart apache2

# تفعيل mod_deflate
sudo a2enmod deflate
sudo systemctl restart apache2
```

#### إعدادات Nginx
```nginx
# إعدادات Nginx الأساسية
server {
    listen 80;
    server_name kayanfactory.com www.kayanfactory.com;
    root /var/www/kayan-static;
    index index.html;

    # تفعيل Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # إعدادات التخزين المؤقت
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # إعادة توجيه إلى HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kayanfactory.com www.kayanfactory.com;
    root /var/www/kayan-static;
    index index.html;

    # إعدادات SSL
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";

    # إعدادات التخزين المؤقت
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # إعدادات HTML
    location ~* \.(html|htm)$ {
        expires 1h;
        add_header Cache-Control "public";
    }

    # إعدادات JSON
    location ~* \.(json)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    # معالجة الصفحات
    location / {
        try_files $uri $uri/ /index.html;
    }

    # منع الوصول للملفات الحساسة
    location ~ /\. {
        deny all;
    }

    location ~ \.(htaccess|htpasswd|ini|log|sh|inc|bak)$ {
        deny all;
    }
}
```

### 4. رفع الملفات

#### باستخدام FTP/SFTP
```bash
# رفع الملفات باستخدام SFTP
sftp username@kayanfactory.com
cd /var/www/html
put -r ./*

# أو باستخدام rsync
rsync -avz --exclude='.git' --exclude='node_modules' ./ username@kayanfactory.com:/var/www/html/
```

#### باستخدام Git
```bash
# إعداد Git repository
git init
git add .
git commit -m "Initial deployment"

# رفع إلى الخادم
git remote add production username@kayanfactory.com:/var/www/html
git push production main
```

### 5. إعداد SSL Certificate

#### باستخدام Let's Encrypt
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-apache

# الحصول على شهادة SSL
sudo certbot --apache -d kayanfactory.com -d www.kayanfactory.com

# تجديد تلقائي
sudo crontab -e
# إضافة السطر التالي:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### باستخدام Cloudflare
1. إنشاء حساب على Cloudflare
2. إضافة النطاق kayanfactory.com
3. تغيير DNS servers
4. تفعيل SSL/TLS encryption mode: Full (strict)

### 6. اختبار الموقع

#### اختبار الوظائف الأساسية
```bash
# اختبار الصفحات
curl -I https://kayanfactory.com
curl -I https://kayanfactory.com/about.html
curl -I https://kayanfactory.com/products.html
curl -I https://kayanfactory.com/contact.html
curl -I https://kayanfactory.com/comments.html

# اختبار الملفات المهمة
curl -I https://kayanfactory.com/robots.txt
curl -I https://kayanfactory.com/sitemap.xml
curl -I https://kayanfactory.com/manifest.json
```

#### اختبار الأداء
```bash
# اختبار PageSpeed Insights
# https://pagespeed.web.dev/

# اختبار GTmetrix
# https://gtmetrix.com/

# اختبار WebPageTest
# https://www.webpagetest.org/
```

#### اختبار الأمان
```bash
# اختبار SSL
# https://www.ssllabs.com/ssltest/

# اختبار Security Headers
# https://securityheaders.com/
```

### 7. إعداد المراقبة

#### أدوات المراقبة المجانية
- **Google Search Console**: مراقبة SEO
- **Google Analytics**: مراقبة الزيارات
- **UptimeRobot**: مراقبة التوفر
- **Pingdom**: مراقبة الأداء

#### إعداد Google Search Console
1. إنشاء حساب على Google Search Console
2. إضافة النطاق kayanfactory.com
3. التحقق من الملكية
4. إرسال Sitemap
5. مراقبة الأداء

#### إعداد Google Analytics
```html
<!-- إضافة Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 8. إعداد النسخ الاحتياطية

#### النسخ الاحتياطية التلقائية
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/kayan-static"
SITE_DIR="/var/www/html"

# إنشاء نسخة احتياطية
tar -czf $BACKUP_DIR/kayan-static_$DATE.tar.gz -C $SITE_DIR .

# حذف النسخ الاحتياطية القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "kayan-static_*.tar.gz" -mtime +30 -delete

echo "Backup completed: kayan-static_$DATE.tar.gz"
```

#### جدولة النسخ الاحتياطية
```bash
# إضافة إلى crontab
crontab -e

# نسخة احتياطية يومية في الساعة 2 صباحاً
0 2 * * * /path/to/backup.sh

# نسخة احتياطية أسبوعية يوم الأحد
0 3 * * 0 /path/to/weekly-backup.sh
```

### 9. إعداد CDN

#### باستخدام Cloudflare
1. تفعيل Cloudflare على النطاق
2. تفعيل Auto Minify للـ CSS و JavaScript
3. تفعيل Brotli compression
4. تفعيل Rocket Loader
5. إعداد Page Rules

#### باستخدام AWS CloudFront
```json
{
  "DistributionConfig": {
    "Origins": {
      "Items": [
        {
          "Id": "kayan-static",
          "DomainName": "kayanfactory.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "kayan-static",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000
    }
  }
}
```

### 10. إعداد المراقبة المستمرة

#### مراقبة الأخطاء
```javascript
// إضافة مراقبة الأخطاء
window.addEventListener('error', (e) => {
  // إرسال الخطأ لخدمة المراقبة
  console.error('Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  // إرسال الخطأ لخدمة المراقبة
  console.error('Unhandled Rejection:', e.reason);
});
```

#### مراقبة الأداء
```javascript
// مراقبة Core Web Vitals
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // إرسال البيانات لخدمة المراقبة
      console.log(entry.entryType, entry);
    }
  });
  
  observer.observe({ 
    entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
  });
}
```

### 11. خطوات ما بعد النشر

#### التحقق من النشر
1. **اختبار جميع الصفحات**
   - الصفحة الرئيسية
   - صفحة من نحن
   - صفحة المنتجات
   - صفحة الاتصال
   - صفحة آراء العملاء
   - صفحة 404

2. **اختبار الوظائف**
   - تبديل اللغة
   - نموذج الاتصال
   - نظام التعليقات
   - معرض الصور
   - التنقل

3. **اختبار الأداء**
   - سرعة التحميل
   - Core Web Vitals
   - Lighthouse Score

#### إعدادات إضافية
1. **إعداد البريد الإلكتروني**
   - إعداد SPF record
   - إعداد DKIM
   - إعداد DMARC

2. **إعداد DNS**
   - إعداد A record
   - إعداد CNAME record
   - إعداد MX record

3. **إعدادات الأمان**
   - تفعيل HTTPS
   - إعداد Security Headers
   - تفعيل CSP

### 12. الصيانة المستمرة

#### المهام الدورية
- **يومياً**: مراقبة الأداء والأخطاء
- **أسبوعياً**: تحديث المحتوى والترجمات
- **شهرياً**: تحديث التبعيات والتحسينات
- **فصلياً**: مراجعة شاملة للأداء والأمان

#### أدوات الصيانة
- **Google Search Console**: مراقبة SEO
- **Google Analytics**: مراقبة الزيارات
- **Lighthouse**: مراقبة الأداء
- **Security Headers**: مراقبة الأمان

---

**ملاحظة مهمة**: تأكد من اختبار جميع الوظائف على بيئة الإنتاج قبل الإعلان عن الموقع رسمياً. 