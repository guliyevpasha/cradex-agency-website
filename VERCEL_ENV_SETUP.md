# Vercel konfiqurasiyası

Bu sənəd `cradex-agency` layihəsinin Vercel-də necə qurulduğunu təsvir edir: environment variables, domen və Sanity inteqrasiyası.

> **Sirləri bu fayla yazma.** Real token və parollar yalnız `.env.local` (git-ə düşmür) və Vercel-in öz panelində saxlanılır. Aşağıdakı cədvəllərdə yalnız gizli olmayan dəyərlər göstərilib.

---

## Environment variables

Layihənin oxuduğu **6 dəyişən** var. Kodda başqa dəyişən istifadə olunmur.

| Dəyişən | Dəyər | Tip | Nə üçün |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `7ia9tt83` | Config | Sanity layihəsi |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Config | Sanity dataset |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | Config | Sanity API versiyası |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `994507786887` | Config | Əlaqə düyməsi |
| `NEXT_PUBLIC_SITE_URL` | `https://cradexagency.com` | Config | `metadataBase`, OG şəkli, canonical |
| `REVALIDATION_TOKEN` | *(gizli — `.env.local`-a bax)* | **Secret** | Sanity webhook autentifikasiyası |

### Config, yoxsa Secret?

Vercel dəyişəni saxlayarkən iki tip təklif edir və **seçim geri qaytarılmır** — bir dəfə Secret olaraq saxlanan dəyişəni sonradan Config-ə çevirmək mümkün deyil, yalnız silib yenidən yaratmaqla.

- **`NEXT_PUBLIC_` ilə başlayanlar → Config.** Bu dəyərlər build zamanı brauzerə göndərilən kodun içinə yazılır, yəni onsuz da gizli deyil. Config seçsən, dəyəri sonradan paneldə oxuya bilərsən.
- **Qalanlar → Secret.** `REVALIDATION_TOKEN` server tərəfində oxunur və heç vaxt brauzerə düşmür.

### Harada yerləşir

**Settings → Environments → Production → Environment Variables**

(Köhnə interfeysdəki `Settings → Environment Variables` yolu artıq yoxdur.)

### Toplu əlavə etmə

**Add Environment Variable** → **Key** xanasına `.env` formatında bir neçə sətri birdən yapışdıra bilərsən, Vercel avtomatik ayırır:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=7ia9tt83
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_WHATSAPP_NUMBER=994507786887
NEXT_PUBLIC_SITE_URL=https://cradexagency.com
```

### Redeploy şərtdir

Dəyişən əlavə etmək və ya dəyişmək **tək başına kifayət deyil** — mövcud deployment köhnə dəyərlərlə qalır.

**Deployments** → ən üstdəki → `···` → **Redeploy**. "Use existing Build Cache" qutusunu **işarələmə** — `NEXT_PUBLIC_` dəyərləri build zamanı koda yazıldığı üçün keş köhnə dəyəri saxlaya bilər.

---

## Domen

| Domen | Rolu |
|---|---|
| `cradexagency.com` | Əsas (Production) |
| `www.cradexagency.com` | 308 daimi yönləndirmə → apex |
| `cradex-agency.vercel.app` | Vercel-in avtomatik ünvanı |

### ⚠️ DNS Hostinger-dədir

Domenin nameserver-ləri Hostinger-dədir (`ns1/ns2.dns-parking.com`) və **e-poçt da orada işləyir** (`mx1/mx2.hostinger.com`).

**Nameserver-ləri Vercel-ə köçürmə.** Vercel bunu təklif edir, amma qəbul etsən MX qeydləri itər və şirkətin e-poçtu dayanar.

Doğru yol — Hostinger DNS zonasında yalnız veb qeydlərini dəyişmək:

| Type | Name | Value |
|---|---|---|
| A | `@` | `216.198.79.1` |
| CNAME | `www` | `0eaaf8b1a4004081.vercel-dns-017.com` |

`MX` və `TXT` qeydlərinə toxunma. `AAAA` qeydi silinib — qalsaydı IPv6 istifadəçiləri köhnə hostinqə düşərdi.

---

## Sanity inteqrasiyası

### CORS

Studio (`/studio`) brauzerdə işlədiyi üçün Sanity-də icazə tələb edir.

**sanity.io/manage → `7ia9tt83` → API → CORS origins:**

| Origin | Allow credentials |
|---|---|
| `https://cradexagency.com` | ✅ |
| `https://www.cradexagency.com` | ✅ |
| `http://localhost:3000` | ✅ |

"Allow credentials" işarəsiz olsa, Studio səhifəsi açılar, amma giriş edə bilməzsən.

### Revalidation webhook

Sanity-də kontent dəyişəndə saytın avtomatik yenilənməsini təmin edir.

**sanity.io/manage → API → Webhooks:**

| Sahə | Dəyər |
|---|---|
| URL | `https://cradexagency.com/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete — **hər üçü** |
| HTTP method | `POST` |
| Filter | `_type in ["article","blog","portfolio","portfolioItem","testimonial","partner"]` |
| Projection | `{"_type": _type, "slug": slug.current}` |
| HTTP header | `Authorization: Bearer <REVALIDATION_TOKEN>` |
| Drafts | ❌ söndürülü |
| Versions | ❌ söndürülü |

**Projection vacibdir.** Sanity-də `slug` obyektdir (`{current: "..."}`), `app/api/revalidate/route.ts` isə sadə mətn gözləyir.

**Drafts söndürülü qalmalıdır.** Açıq olsa, Studio-da hər hərfə webhook işə düşər. Sayt onsuz da yalnız dərc edilmiş sənədləri oxuyur.

**Trigger-lərin hamısını işarələ.** Yalnız `Create` seçilsə, mövcud məqalənin redaktəsi saytda görünməz.

### Token dəyişdikdə

`REVALIDATION_TOKEN` yeniləndikdə **iki yerdə** eyni anda dəyişməlidir: Vercel-də dəyişən, Sanity-də webhook başlığı. Biri köhnə qalsa, endpoint `401` qaytarar.

Yeni token yaratmaq:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Yoxlama

```bash
# Domen Vercel-ə baxır?
curl -sI https://cradexagency.com | grep -i server

# www apex-ə yönləndirir?
curl -sI https://www.cradexagency.com | grep -i location

# E-poçt qeydləri yerindədir?
nslookup -type=MX cradexagency.com

# Revalidation endpoint tokeni tanıyır?
curl -s -X POST https://cradexagency.com/api/revalidate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"_type":"article","slug":"test"}'
```

Sonuncu `{"success":true,...}` qaytarmalıdır. Tokensiz `401` gəlməlidir.

---

## Problemlər

**Deployment uğursuzdur** — dəyişən adlarında böyük/kiçik hərfə və dəyərlərdə artıq boşluğa bax. Deployments → uğursuz deploy → build loglarını oxu.

**Sanity kontenti gəlmir** — `NEXT_PUBLIC_SANITY_PROJECT_ID` dəyərini `sanity.io/manage`-dəki ID ilə tutuşdur.

**`/studio` açılır, amma qoşulmur** — CORS origin əlavə edilməyib və ya "Allow credentials" işarəsizdir.

**Sanity-də dəyişiklik saytda görünmür** — webhook loglarına bax (API → Webhooks → webhook → delivery attempts). `401` görsənsə tokenlər uyğun gəlmir; heç nə görünmürsə trigger-lər və ya filter səhvdir.

**OG şəkli və ya canonical səhv domeni göstərir** — `NEXT_PUBLIC_SITE_URL` dəyərini yoxla, sonra **keşsiz** redeploy et.

---

## Əlaqəli sənədlər

- [SANITY_SETUP_GUIDE.md](./SANITY_SETUP_GUIDE.md) — Sanity layihəsinin qurulması
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) — ümumi deploy prosesi
- [.env.local.example](./.env.local.example) — lokal mühit şablonu
