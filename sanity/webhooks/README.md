# Sanity Webhook Configuration

Bu sənəd Sanity Studio-da webhook-ları necə konfiqurasiya etməyi izah edir.

## Problem: Slug dəyişdikdə 404 Error

Sanity CMS-də content slug-unu dəyişdirdikdə (məsələn: `sued-s-b-ti` → `sud-sebeti` → `sued-s-b-ti`), köhnə slug-la olan səhifə Next.js cache-də qalır və 404 error verir.

## Həll: Webhook Konfiqurasiyası

### 1. Sanity Dashboard-a daxil ol
https://www.sanity.io/manage

### 2. Cradex Agency layihəsini seç

### 3. API → Webhooks → Create Webhook

### 4. Webhook konfiqurasiyası:

**Name:** `Vercel On-Demand Revalidation`

**URL:** `https://cradexagency.com/api/revalidate`

**Trigger on:** 
- ✅ Create
- ✅ Update
- ✅ Delete

**Dataset:** `production`

**Filter:**
```groq
_type in ["portfolio", "portfolioItem", "blog", "article", "testimonial", "partner", "comboPackage", "workCase"]
```

**Projection (CRITICAL - bu köhnə slug-u da göndərir):**
```groq
{
  "_type": _type,
  "slug": slug.current,
  "previousSlug": before().slug.current
}
```

**HTTP method:** `POST`

**HTTP Headers:**
```
Authorization: Bearer 2c1c6a4b03ff9a518aca57d6ee06baf4e0b6927c2041f32c11cf62c4456593d7
```

**API version:** `2024-01-01` (və ya ən son)

### 5. Save Webhook

## Necə işləyir?

1. Sanity-də slug dəyişdirəndə webhook tetiklənir
2. `previousSlug` köhnə slug-u göndərir
3. API həm yeni həm də köhnə slug-ları revalidate edir
4. Köhnə slug 404-dən redirect və ya ISR ilə yenilənir
5. Problem həll olunur ✅

## Test

Webhook-u test etmək üçün:

1. Sanity Studio-da bir portfolio item-ın slug-unu dəyiş
2. Publish et
3. Webhook logs-a bax (Sanity Dashboard → API → Webhooks → View logs)
4. Response-da `previousSlug` olmalıdır

## Manual Revalidation

Əgər webhook işləməzsə, PowerShell-lə manual revalidate et:

```powershell
cd cradex-agency

$headers = @{ 
    "Content-Type" = "application/json"
    "Authorization" = "Bearer 2c1c6a4b03ff9a518aca57d6ee06baf4e0b6927c2041f32c11cf62c4456593d7" 
}

$body = @{
    _type = "portfolioItem"
    slug = "sued-s-b-ti"
    previousSlug = "sud-sebeti"
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri "https://cradexagency.com/api/revalidate" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

## Əlavə Məlumat

- Revalidation token `.env.local`-da saxlanılır
- API route `app/api/revalidate/route.ts`-dədir
- Webhook logs Sanity Dashboard-da görünür
- Vercel deployment logs-da revalidation görünür

---

**Müəllif:** Paşa Quliyev — Cradex Agency  
**Son yeniləmə:** 2026-11-10
