# كيان الخليج - وثائق API

## نظرة عامة

API احترافي لموقع كيان الخليج للصناعة يتضمن إدارة الرسائل والتقييمات وتتبع الزيارات.

**Base URL**: `https://kayan-factory-backend.herokuapp.com/api`

## المصادقة

لا يتطلب API مصادقة حالياً، لكن يتم تطبيق Rate Limiting للحماية.

## Rate Limiting

- **عام**: 100 طلب كل 15 دقيقة
- **رسائل التواصل**: 5 طلبات كل 15 دقيقة
- **التقييمات**: 1 تقييم كل 24 ساعة لكل IP

## Endpoints

### 1. الرسائل (Contact Messages)

#### إرسال رسالة جديدة
```http
POST /api/contact
Content-Type: application/json

{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+966501234567",
  "message": "أريد استشارة حول الكرتن وول"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
  "data": {
    "id": 123,
    "timestamp": "2025-01-20T10:30:00.000Z"
  }
}
```

#### جلب الرسائل (إدارة)
```http
GET /api/contact?page=1&limit=10&status=all
```

**Parameters:**
- `page` (optional): رقم الصفحة (افتراضي: 1)
- `limit` (optional): عدد الرسائل في الصفحة (افتراضي: 10)
- `status` (optional): حالة الرسالة (new, read, replied, closed, all)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": 123,
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "+966501234567",
        "message": "أريد استشارة حول الكرتن وول",
        "status": "new",
        "created_at": "2025-01-20T10:30:00.000Z",
        "responded_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

#### تحديث حالة الرسالة
```http
PUT /api/contact/123/status
Content-Type: application/json

{
  "status": "replied",
  "response": "شكراً لك، سنتواصل معك قريباً"
}
```

#### حذف رسالة
```http
DELETE /api/contact/123
```

#### إحصائيات الرسائل
```http
GET /api/contact/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "new_messages": 5,
    "read_messages": 20,
    "replied_messages": 100,
    "closed_messages": 25,
    "today_messages": 3,
    "week_messages": 15
  }
}
```

### 2. التقييمات (Testimonials)

#### إرسال تقييم جديد
```http
POST /api/testimonials
Content-Type: application/json

{
  "name": "فاطمة السعيد",
  "email": "fatima@example.com",
  "service": "curtain-wall",
  "rating": 5,
  "message": "خدمة ممتازة وجودة عالية في العمل"
}
```

**Service Types:**
- `curtain-wall`: كرتن وول
- `cladding`: كلادينج
- `aluminum-windows`: نوافذ ألمنيوم
- `upvc-windows`: نوافذ UPVC
- `wpc-doors`: أبواب WPC
- `shower-cabins`: كابائن الدش
- `railings`: درابزين
- `roller-shutters`: رولر شتر
- `glass-partitions`: قواطع زجاجية
- `kitchens`: مطابخ
- `other`: أخرى

**Response:**
```json
{
  "success": true,
  "message": "شكراً لك! تم إرسال تقييمك بنجاح. سيتم مراجعته ونشره قريباً.",
  "data": {
    "id": 456,
    "timestamp": "2025-01-20T10:30:00.000Z"
  }
}
```

#### جلب التقييمات المعتمدة (عام)
```http
GET /api/testimonials/public?limit=20&service=all
```

**Parameters:**
- `limit` (optional): عدد التقييمات (افتراضي: 20)
- `service` (optional): نوع الخدمة أو "all"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "فاطمة السعيد",
      "service": "كرتن وول",
      "rating": 5,
      "message": "خدمة ممتازة وجودة عالية في العمل",
      "created_at": "2025-01-20T10:30:00.000Z"
    }
  ]
}
```

#### جلب التقييمات (إدارة)
```http
GET /api/testimonials?page=1&limit=10&status=approved&service=all&rating=all&sort=newest
```

**Parameters:**
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد التقييمات في الصفحة
- `status` (optional): الحالة (approved, pending, all)
- `service` (optional): نوع الخدمة
- `rating` (optional): التقييم (1-5 أو all)
- `sort` (optional): الترتيب (newest, oldest, rating_high, rating_low)

#### الموافقة على التقييم
```http
PUT /api/testimonials/456/approve
Content-Type: application/json

{
  "approved": true,
  "admin_notes": "تقييم ممتاز"
}
```

#### حذف تقييم
```http
DELETE /api/testimonials/456
```

#### إحصائيات التقييمات
```http
GET /api/testimonials/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "approved": 45,
    "pending": 5,
    "average_rating": 4.8,
    "five_stars": 40,
    "four_stars": 5,
    "three_stars": 0,
    "two_stars": 0,
    "one_star": 0,
    "today": 2,
    "this_week": 8,
    "service_breakdown": [
      {
        "service": "curtain-wall",
        "count": 20,
        "avg_rating": 4.9
      }
    ]
  }
}
```

### 3. التحليلات (Analytics)

#### تسجيل زيارة
```http
POST /api/analytics/visit
Content-Type: application/json

{
  "page_url": "https://kayanfactory.netlify.app/",
  "page_title": "كيان الخليج للصناعة | الصفحة الرئيسية",
  "referrer": "https://www.google.com",
  "device_type": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "screen_resolution": "1920x1080",
  "language": "ar",
  "session_id": "sess_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الزيارة بنجاح",
  "data": {
    "visit_id": 789,
    "session_id": "sess_abc123",
    "timestamp": "2025-01-20T10:30:00.000Z"
  }
}
```

#### تحديث مدة الزيارة
```http
PUT /api/analytics/visit/789/duration
Content-Type: application/json

{
  "duration": 120
}
```

#### جلب بيانات الزيارات
```http
GET /api/analytics/visits?page=1&limit=50&date_from=2025-01-01&date_to=2025-01-31&device_type=all&page_url=
```

**Parameters:**
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد الزيارات في الصفحة
- `date_from` (optional): تاريخ البداية (YYYY-MM-DD)
- `date_to` (optional): تاريخ النهاية (YYYY-MM-DD)
- `device_type` (optional): نوع الجهاز (desktop, mobile, tablet, all)
- `page_url` (optional): رابط الصفحة للبحث

#### نظرة عامة على الإحصائيات
```http
GET /api/analytics/stats/overview?period=7d
```

**Parameters:**
- `period` (optional): الفترة (1d, 7d, 30d, 90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_visits": 1250,
      "unique_sessions": 800,
      "unique_visitors": 600,
      "avg_duration": 120
    },
    "device_breakdown": [
      {
        "device_type": "desktop",
        "count": 800
      },
      {
        "device_type": "mobile",
        "count": 400
      }
    ],
    "browser_breakdown": [
      {
        "browser": "Chrome",
        "count": 700
      }
    ],
    "top_pages": [
      {
        "page_url": "https://kayanfactory.netlify.app/",
        "page_title": "الصفحة الرئيسية",
        "visits": 500
      }
    ],
    "hourly_distribution": [
      {
        "hour": "09",
        "visits": 50
      }
    ],
    "daily_trend": [
      {
        "date": "2025-01-20",
        "visits": 100
      }
    ]
  }
}
```

#### الإحصائيات المباشرة
```http
GET /api/analytics/stats/real-time
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_hour": {
      "visits_last_hour": 25,
      "unique_sessions_last_hour": 20,
      "unique_visitors_last_hour": 15
    },
    "active_sessions": 5,
    "last_updated": "2025-01-20T10:30:00.000Z"
  }
}
```

#### تصدير البيانات
```http
GET /api/analytics/export?format=json&date_from=2025-01-01&date_to=2025-01-31
```

**Parameters:**
- `format` (optional): نوع التصدير (json, csv)
- `date_from` (optional): تاريخ البداية
- `date_to` (optional): تاريخ النهاية

### 4. الصحة العامة

#### فحص حالة الخادم
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

#### معلومات API
```http
GET /
```

**Response:**
```json
{
  "message": "Kayan Factory Backend API",
  "version": "1.0.0",
  "endpoints": {
    "contact": "/api/contact",
    "testimonials": "/api/testimonials",
    "analytics": "/api/analytics",
    "health": "/api/health"
  }
}
```

## رموز الحالة

- `200` - نجح الطلب
- `201` - تم إنشاء البيانات بنجاح
- `400` - بيانات غير صحيحة
- `404` - البيانات غير موجودة
- `429` - تجاوز حد الطلبات
- `500` - خطأ في الخادم

## أمثلة على الاستخدام

### JavaScript (Frontend)

```javascript
// إرسال رسالة تواصل
async function sendContactMessage(data) {
  try {
    const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('تم إرسال الرسالة:', result.message);
      return result;
    } else {
      throw new Error(result.message || 'فشل في إرسال الرسالة');
    }
  } catch (error) {
    console.error('خطأ:', error.message);
    throw error;
  }
}

// إرسال تقييم
async function submitTestimonial(data) {
  try {
    const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في إرسال التقييم:', error);
    throw error;
  }
}

// تتبع زيارة
async function trackVisit(visitData) {
  try {
    const response = await fetch('https://kayan-factory-backend.herokuapp.com/api/analytics/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(visitData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في تتبع الزيارة:', error);
  }
}
```

### cURL

```bash
# إرسال رسالة
curl -X POST https://kayan-factory-backend.herokuapp.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "message": "أريد استشارة حول الكرتن وول"
  }'

# جلب التقييمات المعتمدة
curl https://kayan-factory-backend.herokuapp.com/api/testimonials/public?limit=10

# فحص حالة الخادم
curl https://kayan-factory-backend.herokuapp.com/api/health
```

## الأخطاء الشائعة

### 1. خطأ CORS
```
Access to fetch at 'https://kayan-factory-backend.herokuapp.com/api/contact' from origin 'https://kayanfactory.netlify.app' has been blocked by CORS policy
```

**الحل**: تأكد من إضافة Origin الصحيح في CORS configuration.

### 2. خطأ Rate Limiting
```json
{
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

**الحل**: انتظر 15 دقيقة أو قلل من عدد الطلبات.

### 3. خطأ التحقق من البيانات
```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": [
    {
      "msg": "البريد الإلكتروني غير صحيح",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**الحل**: تأكد من صحة البيانات المرسلة.

## الدعم

- **البريد الإلكتروني**: info@kayanfactory.com
- **الهاتف**: +966545666924
- **الموقع**: https://kayanfactory.netlify.app

---

**كيان الخليج للصناعة** - رؤية هندسية متطورة
