# 🚀 Vercel + Sanity Real-Time Deployment Guide

Bu sənəd Vercel-ə deploy və Sanity webhook konfiqurasiyasını addım-addım izah edir.

---

## 📋 Ön Şərtlər

✅ Kod hazırdır və commit edilib:
- ISR konfiqurasiyası (60s revalidation)
- `/api/revalidate` endpoint
- Token authentication
- 16 unit test

✅ Environment variables:
- `.env.local` faylında `REVALIDATION_TOKEN` var
- `VERCEL_ENV_SETUP.md` təlimatı hazırdır

---

## 🎯 ADDIM 1: Vercel CLI Quraşdırma və Login

### 1.1. Vercel CLI quraşdırın

```bash
npm install -g vercel
```

**Yoxlama:**
```bash
vercel --version
```

### 1.2. Vercel-ə login olun

```bash
vercel login
```

Bu komanda brauzerdə açılacaq və GitHub hesabınızla login olmağı təklif edəcək.

**Uğurlu login əlaməti:**
```
✓ Success! GitHub authentication complete.
```

---

## 🚀 ADDIM 2: Production Deploy

### 2.1. Layihə qovluğuna keçin

```bash
cd "c:\Users\User\Desktop\cradexagency\Cradex Agency 2026\cradex-agency"
```

### 2.2. Production deploy başladın

```bash
vercel --prod
```

**Gözlənilən çıxış:**
```
🔍  Inspect: https://vercel.com/...
✅  Production: https://cradex-agency.vercel.app [copied to clipboard]
```

### 2.3. Deployment statusunu yoxlayın

1. Brauzerdə Vercel dashboard açın: https://vercel.com/dashboard
2. "cradex-agency" layihəsini tapın
3. "Deployments" tabına keçin
4. Status **"Ready"** olmalıdır ✅

### 2.4. Production URL-i test edin

Deployment uğurlu olduqdan sonra:

```bash
# URL-i brauzerdə açın (avtomatik clipboard-a kopyalanıb)
# Və ya
vercel --prod --yes
```

**URL format:** `https://cradex-agency-[random].vercel.app`

---

## ⚙️ ADDIM 3: Vercel Environment Variables

`VERCEL_ENV_SETUP.md` faylındakı təlimata əməl edərək bütün environment variables-ləri Vercel dashboard-da set edin.

**Xüsusilə vacib:**
- `REVALIDATION_TOKEN` - webhook authentication üçün
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity CMS üçün
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset

**Qeyd:** Environment variables set edildikdən sonra layihəni yenidən deploy edin:

```bash
vercel --prod
```

---

## 🔗 ADDIM 4: Sanity Webhook Konfiqurasiyası

### 4.1. Sanity Dashboard-a daxil olun

1. Brauzerdə açın: https://sanity.io/manage
2. Layihənizi seçin: **Cradex Agency CMS**
3. Sol menyudan **API** → **Webhooks** seçin

### 4.2. Yeni webhook yaradın

**"Create webhook"** düyməsinə klikləyin və aşağıdakı məlumatları daxil edin:

#### Ümumi Konfiqurasiya:
- **Name:** `Vercel Revalidation`
- **Description:** `Trigger Vercel ISR revalidation on content changes`
- **URL:** `https://[VERCEL-PRODUCTION-URL]/api/revalidate`
  
  **Nümunə:** `https://cradex-agency-abc123.vercel.app/api/revalidate`

#### Dataset və Trigger:
- **Dataset:** `production`
- **Trigger on:** ✅ **Create**, ✅ **Update**, ✅ **Delete**
- **Filter (optional):** Boş buraxın (bütün content types)

#### HTTP Settings:
- **HTTP method:** `POST`
- **HTTP Headers:**
  ```
  Key: Authorization
  Value: Bearer <REVALIDATION_TOKEN>
  ```
  
  ⚠️ **DİQQƏT:** `Bearer` sözündən sonra boşluq qoyun və token-i yapışdırın!

#### Projections (optional):
```json
{
  "_type": _type,
  "slug": slug.current
}
```

### 4.3. Webhook-u test edin

1. Webhook yaratdıqdan sonra **"Send test request"** düyməsinə klikləyin
2. **Gözlənilən response:**
   ```json
   {
     "success": true,
     "revalidated": true,
     "_type": "test",
     "slug": null,
     "paths": [],
     "timestamp": 1234567890
   }
   ```

3. **Status:** `200 OK` ✅

**Əgər 401 Unauthorized alırsınızsa:**
- Authorization header-i yoxlayın
- `Bearer` sözü və boşluq düzgündürmü?
- Token-in dəyəri `.env.local`-dakı ilə eynidir?

---

## 🔴 ADDIM 5: GitHub Pages-i Deaktiv Edin

GitHub Pages-i söndürək ki, yalnız Vercel istifadə olundu.

### 5.1. GitHub Actions workflow-unu deaktiv edin

**Terminal:**
```bash
cd "c:\Users\User\Desktop\cradexagency\Cradex Agency 2026"

# Workflow faylını rename edin
move ".github\workflows\deploy.yml" ".github\workflows\deploy.yml.disabled"

# Git commit
git add .
git commit -m "Disable GitHub Pages, switch to Vercel"
git push origin main
```

### 5.2. GitHub Pages settings-i deaktiv edin

1. GitHub repo açın: https://github.com/guliyevpasha/cradex-agency-website
2. **Settings** tabına keçin
3. Sol menyudan **Pages** seçin
4. **Source** dropdown-dan **"None"** seçin
5. **Save** düyməsinə klikləyin

✅ GitHub Pages indi söndürülüb, yalnız Vercel aktiv.

---

## ✅ ADDIM 6: Testing və Verification

### 6.1. ISR (60 saniyə) Test

1. Vercel production URL-i açın
2. Homepage-i yoxlayın (portfolio, testimonials görünür)
3. 60 saniyə gözləyin
4. Səhifəni yeniləyin (refresh)
5. Vercel logs-a baxın: https://vercel.com/[your-org]/cradex-agency/logs

**Gözlənilən:** İlk yükləmədən 60 saniyə sonra background revalidation baş verir.

### 6.2. Webhook Test (Real-Time Update)

**Test senariosi:**

1. Sanity Studio açın: https://cradexagency.sanity.studio/
2. Yeni blog məqaləsi yaradın:
   - Title (AZ): "Test Məqaləsi"
   - Slug: `test-meqalesi`
   - Content: İstənilən mətn
   - **Publish** düyməsinə basın

3. **5-10 saniyə gözləyin** (webhook + revalidation)

4. Vercel production URL-də journal səhifəsini açın:
   ```
   https://[vercel-url]/az/journal
   ```

5. **Yoxlama:** Yeni məqalə siyahıda görünməlidir! ✅

**Əgər görünmürsə:**
- Sanity webhook logs-a baxın (Dashboard → Webhooks → webhook seç → Logs)
- Vercel function logs-a baxın
- Brauzerin cache-ni təmizləyin (Ctrl+Shift+R)

### 6.3. Content Type Test

Hər content type üçün test edin:

| Content Type | Test Əməliyyatı | Hansı Səhifə Yenilənməli |
|--------------|----------------|--------------------------|
| **Blog/Article** | Yeni məqalə publish | `/[locale]/journal` və detail |
| **Portfolio** | Yeni portfolio əlavə | `/[locale]/portfolio` və `/` (homepage) |
| **Testimonial** | Yeni rəy əlavə | `/` (homepage) |
| **Partner** | Yeni logo əlavə | `/` (homepage) |

### 6.4. Vercel Logs Monitoring

Real-time logs izləmək üçün:

**Dashboard:**
1. https://vercel.com/[your-org]/cradex-agency
2. **Logs** tabı
3. **Function Logs** filter: `/api/revalidate`

**CLI:**
```bash
vercel logs https://[vercel-production-url] --follow
```

**Gözlənilən log output (webhook trigger olduqda):**
```
[Revalidate] Incoming request at 2024-...
[Revalidate] Request details: { contentType: 'blog', slug: 'test-meqalesi' }
[Revalidate] Starting revalidation for content type: blog
[Revalidate] Revalidated journal listing pages for all locales
[Revalidate] Revalidated article page with slug: test-meqalesi
[Revalidate] ✓ Revalidation successful
[Revalidate] Total paths revalidated: 8
```

---

## 📊 ADDIM 7: Performance Yoxlaması

### 7.1. ISR Performans

1. Homepage açın: `https://[vercel-url]/az`
2. DevTools açın (F12) → Network tab
3. Səhifəni yeniləyin
4. **X-Vercel-Cache** header-i yoxlayın:
   - `HIT` = Cache-dən gəldi (sürətli) ✅
   - `MISS` = Yeni build (60s keçib)
   - `STALE` = Köhnə, background-da yenilənir

### 7.2. API Response Time

```bash
# /api/revalidate endpoint-ini test et
curl -X POST https://[vercel-url]/api/revalidate \
  -H "Authorization: Bearer <REVALIDATION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"_type":"blog","slug":"test"}'
```

**Gözlənilən:**
- Status: `200 OK`
- Response time: < 500ms
- Response body: `{"success":true,"revalidated":true,...}`

---

## 🆘 Troubleshooting

### Problem 1: Deployment uğursuz olur

**Əlamətlər:**
```
Error: Build failed
```

**Həll:**
1. Environment variables düzgündürmü? (`VERCEL_ENV_SETUP.md` yoxlayın)
2. TypeScript kompilyasiya errorları varmı?
   ```bash
   npm run build
   ```
3. Vercel logs-a baxın:
   ```bash
   vercel logs [deployment-url]
   ```

---

### Problem 2: Webhook işləmir (401 Unauthorized)

**Həll:**
1. Sanity webhook Authorization header-i yoxlayın:
   - Format: `Bearer [TOKEN]`
   - `Bearer` sözündən sonra boşluq var?
   - Token `.env.local`-dakı ilə eyni?

2. Vercel environment variables-də `REVALIDATION_TOKEN` set edilib?

3. Webhook test request göndərin və response-a baxın

---

### Problem 3: Content dəyişikliyi saytda görünmür

**Diaqnoz:**

1. **ISR yoxla (60s keçib?):**
   - Əgər 60s keçməyibsə, gözləyin və ya manual refresh edin

2. **Webhook logs yoxla:**
   - Sanity Dashboard → Webhooks → Logs
   - Status `200` olmalı, əks halda error var

3. **Vercel logs yoxla:**
   ```bash
   vercel logs https://[vercel-url] --follow
   ```
   - `[Revalidate]` logları görünməlidir

4. **Cache təmizlə:**
   - Browser: Ctrl+Shift+R (hard refresh)
   - Vercel: Yenidən deploy et

---

### Problem 4: Sanity CMS məlumatları yüklənmir

**Həll:**
1. Environment variables yoxla:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID=7ia9tt83`
   - `NEXT_PUBLIC_SANITY_DATASET=production`

2. Sanity API token düzgündür?

3. Network tab-da Sanity API request-ləri uğurludur?

---

## 📚 Əlavə Resurlar

### Vercel
- Dashboard: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs
- CLI Reference: https://vercel.com/docs/cli

### Sanity
- Dashboard: https://sanity.io/manage
- Webhooks: https://www.sanity.io/docs/webhooks
- API: https://www.sanity.io/docs/http-api

### Next.js ISR
- ISR Documentation: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
- On-Demand Revalidation: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation

---

## ✨ Uğurlu Deployment Əlamətləri

Hər şey düzgün işləyirsə:

✅ Vercel production deployment "Ready" statusunda  
✅ Production URL açılır və homepage görünür  
✅ Sanity-də content dəyişikliyi → 5-10 saniyə sonra saytda görünür  
✅ ISR cache 60 saniyə interval ilə işləyir  
✅ Webhook test request `200 OK` qaytarır  
✅ GitHub Pages deaktiv edilib  
✅ Vercel logs-da `[Revalidate]` mesajları görünür  

---

## 🎉 Təbriklər!

Sisteminiz tam hazırdır və real-time content update işləyir! 🚀

**Növbəti addımlar:**
1. Custom domain əlavə edin (Vercel dashboard → Settings → Domains)
2. Analytics quraşdırın (Vercel Analytics və ya Google Analytics)
3. Performance monitoring (Vercel Speed Insights)
4. Production məlumatlarını Sanity-ə əlavə edin

**Suallarınız varsa:**
- Vercel Logs-a baxın
- Sanity Webhook Logs-a baxın
- Bu guide-dakı Troubleshooting bölməsini oxuyun

---

**Son yeniləmə:** 2024
**Versiay:** 1.0
**Müəllif:** Kiro AI Assistant
