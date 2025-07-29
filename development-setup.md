# دليل إعداد بيئة التطوير - موقع كيان الخليج

## 🛠️ إعداد بيئة التطوير الشاملة

### 1. متطلبات النظام

#### المتطلبات الأساسية
- **Node.js**: 16.x أو أحدث
- **npm**: 8.x أو أحدث
- **Git**: 2.x أو أحدث
- **محرر الكود**: VS Code (موصى به)
- **المتصفح**: Chrome/Firefox/Edge حديث

#### إضافات VS Code الموصى بها
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-css-peek",
    "ms-vscode.vscode-html-css-support"
  ]
}
```

### 2. إعداد المشروع

#### تثبيت التبعيات
```bash
# تثبيت التبعيات الأساسية
npm install

# تثبيت أدوات التطوير
npm install --save-dev
```

#### إعداد Git
```bash
# تهيئة Git repository
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Initial commit - Kayan Al Khalij website"

# إضافة remote repository (إذا كان متوفر)
git remote add origin https://github.com/username/kayan-static.git
git push -u origin main
```

### 3. إعدادات VS Code

#### إعدادات Workspace
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.html": "html",
    "*.css": "css",
    "*.js": "javascript",
    "*.json": "json"
  },
  "liveServer.settings.root": "/",
  "liveServer.settings.port": 5500
}
```

#### إعدادات ESLint
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "eslint.workingDirectories": [
    "./"
  ]
}
```

### 4. أدوات التطوير

#### Live Server
```bash
# تثبيت Live Server
npm install -g live-server

# تشغيل الخادم المحلي
live-server --port=5500 --open=/index.html
```

#### Browser Sync
```bash
# تثبيت Browser Sync
npm install -g browser-sync

# تشغيل Browser Sync
browser-sync start --server --files "*.html, *.css, *.js"
```

### 5. أدوات التحسين

#### تحسين الصور
```bash
# تثبيت ImageOptim CLI
npm install -g imageoptim-cli

# تحسين جميع الصور
imageoptim *.png *.jpg *.jpeg

# أو باستخدام Sharp
npm install sharp
```

#### ضغط الملفات
```bash
# ضغط CSS
npm run minify-css

# ضغط JavaScript
npm run minify-js

# ضغط HTML
npm run minify-html
```

### 6. أدوات الاختبار

#### اختبار الأداء
```bash
# تثبيت Lighthouse CLI
npm install -g lighthouse

# اختبار الأداء
lighthouse https://localhost:5500 --output html --output-path ./lighthouse-report.html

# أو باستخدام PageSpeed Insights
npm install -g psi
psi https://localhost:5500
```

#### اختبار إمكانية الوصول
```bash
# تثبيت pa11y
npm install -g pa11y

# اختبار إمكانية الوصول
pa11y https://localhost:5500

# أو باستخدام axe-core
npm install axe-core
```

### 7. إعدادات التطوير المحسن

#### ملف .vscode/settings.json
```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "html.validate.scripts": false,
  "html.validate.styles": false
}
```

#### ملف .vscode/launch.json
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5500",
      "webRoot": "${workspaceFolder}"
    },
    {
      "name": "Launch Firefox",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:5500",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### 8. أدوات المراقبة

#### مراقبة التغييرات
```bash
# تثبيت nodemon
npm install -g nodemon

# مراقبة التغييرات في الملفات
nodemon --watch *.html --watch *.css --watch *.js --exec "live-server"
```

#### مراقبة الأداء
```javascript
// إضافة مراقبة الأداء في script.js
if (process.env.NODE_ENV === 'development') {
  // مراقبة وقت التحميل
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page load time: ${loadTime}ms`);
  });

  // مراقبة استخدام الذاكرة
  if ('memory' in performance) {
    console.log('Memory usage:', performance.memory);
  }
}
```

### 9. إعدادات Git Hooks

#### ملف .git/hooks/pre-commit
```bash
#!/bin/bash
# فحص الأخطاء قبل الـ commit

echo "Running pre-commit checks..."

# فحص ESLint
npm run lint

# فحص الأداء
npm run test-performance

# فحص إمكانية الوصول
npm run test-accessibility

echo "Pre-commit checks completed!"
```

#### ملف .git/hooks/post-commit
```bash
#!/bin/bash
# إجراءات بعد الـ commit

echo "Running post-commit actions..."

# إنشاء نسخة احتياطية
npm run backup

# تحديث التوثيق
npm run update-docs

echo "Post-commit actions completed!"
```

### 10. أدوات التطوير المتقدمة

#### Webpack (اختياري)
```bash
# تثبيت Webpack
npm install --save-dev webpack webpack-cli

# إعداد Webpack
npm install --save-dev webpack-dev-server
```

#### Babel (اختياري)
```bash
# تثبيت Babel
npm install --save-dev @babel/core @babel/preset-env

# إعداد Babel
npm install --save-dev babel-loader
```

### 11. إعدادات البيئة

#### ملف .env.development
```env
NODE_ENV=development
PORT=5500
API_URL=http://localhost:3000
DEBUG=true
```

#### ملف .env.production
```env
NODE_ENV=production
PORT=80
API_URL=https://api.kayanfactory.com
DEBUG=false
```

### 12. أدوات التطوير الإضافية

#### أدوات مفيدة
```bash
# تثبيت أدوات مفيدة
npm install -g serve
npm install -g http-server
npm install -g concurrently
npm install -g cross-env
```

#### سكريبتات التطوير
```json
{
  "scripts": {
    "dev": "concurrently \"npm run serve\" \"npm run watch\"",
    "serve": "live-server --port=5500",
    "watch": "nodemon --watch *.html --watch *.css --watch *.js",
    "build": "npm run minify-css && npm run minify-js",
    "test": "npm run test-performance && npm run test-accessibility",
    "deploy": "npm run build && npm run upload"
  }
}
```

### 13. إعدادات الأمان للتطوير

#### ملف .env.local
```env
# متغيرات محلية للتطوير
FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

#### إعدادات HTTPS للتطوير
```bash
# إنشاء شهادة SSL محلية
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# تشغيل خادم HTTPS محلي
live-server --https --port=5500
```

### 14. أدوات التحليل

#### تحليل الكود
```bash
# تثبيت أدوات التحليل
npm install --save-dev bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# تحليل حجم الحزم
npm run analyze
```

#### تحليل الأداء
```javascript
// إضافة تحليل الأداء
if (process.env.NODE_ENV === 'development') {
  // مراقبة Core Web Vitals
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`${entry.entryType}:`, entry);
      }
    });
    
    observer.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    });
  }
}
```

### 15. إعدادات التطوير النهائية

#### ملف package.json محسن
```json
{
  "name": "kayan-static",
  "version": "2.0.0",
  "description": "Kayan Al Khalij Manufacturing Website",
  "main": "index.html",
  "scripts": {
    "start": "live-server --port=5500",
    "dev": "concurrently \"npm run serve\" \"npm run watch\"",
    "serve": "live-server --port=5500 --open=/index.html",
    "watch": "nodemon --watch *.html --watch *.css --watch *.js",
    "build": "npm run minify-css && npm run minify-js && npm run optimize-images",
    "minify-css": "cleancss -o style.min.css style.css",
    "minify-js": "uglifyjs script.js -o script.min.js",
    "optimize-images": "imageoptim *.png *.jpg *.jpeg",
    "test": "npm run test-performance && npm run test-accessibility",
    "test-performance": "lighthouse http://localhost:5500 --output html",
    "test-accessibility": "pa11y http://localhost:5500",
    "lint": "eslint *.js",
    "format": "prettier --write \"**/*.{js,css,html,json}\"",
    "backup": "tar -czf backup-$(date +%Y%m%d).tar.gz .",
    "deploy": "npm run build && rsync -avz --exclude=node_modules ./ user@server:/var/www/html/"
  },
  "keywords": ["kayan", "manufacturing", "aluminum", "curtain-wall", "cladding"],
  "author": "Kayan Al Khalij Manufacturing",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^7.6.0",
    "cross-env": "^7.0.3",
    "eslint": "^8.40.0",
    "prettier": "^2.8.8",
    "nodemon": "^2.0.22",
    "lighthouse": "^11.2.0",
    "pa11y": "^6.2.0",
    "cleancss": "^5.3.2",
    "uglify-js": "^3.17.4"
  }
}
```

---

**ملاحظة**: تأكد من تثبيت جميع الأدوات المطلوبة قبل البدء في التطوير. 