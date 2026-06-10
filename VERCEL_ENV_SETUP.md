# Vercel Dashboard-da Environment Variables Konfiqurasiyası

Bu sənəd Vercel dashboard-da environment variables-lərin necə qurulacağını addım-addım izah edir.

## 📋 İlkin Məlumat

**Nə üçün lazımdır?**  
Environment variables layihənizin konfiqurasiya məlumatlarını (API açarları, token-lər və s.) təhlükəsiz şəkildə saxlayır və production mühitində istifadə edilir.

**Vacib:** Bu təlimatı izləyərkən `.env.local` faylınızdakı məlumatları Vercel-ə köçürəcəksiniz.

---

## 🔗 Addım 1: Vercel Dashboard-a daxil olun

1. Brauzerdə açın: **https://vercel.com/dashboard**
2. Hesabınıza daxil olun (GitHub hesabı ilə login)
3. Sol menyudan layihənizi tapın və açın: **`cradex-agency`** (və ya layihənizin adı)

---

## ⚙️ Addım 2: Settings Bölməsinə Keçin

1. Layihə səhifəsində yuxarıdakı naviqasiyada **"Settings"** tabına klikləyin
2. Sol menyudan **"Environment Variables"** seçin

![Settings → Environment Variables yolu](https://vercel.com/docs/environment-variables)

---

## ➕ Addım 3: Environment Variables Əlavə Edin

Hər bir environment variable üçün aşağıdakı addımları təkrarlayın:

### 3.1. Sanity CMS Variables

#### Variable 1: `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Name (Ad):** `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Value (Dəyər):** `7ia9tt83`
- **Environment (Mühit):** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

#### Variable 2: `NEXT_PUBLIC_SANITY_DATASET`
- **Name:** `NEXT_PUBLIC_SANITY_DATASET`
- **Value:** `production`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

#### Variable 3: `NEXT_PUBLIC_SANITY_API_VERSION`
- **Name:** `NEXT_PUBLIC_SANITY_API_VERSION`
- **Value:** `2024-01-01`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.2. Contact Form (Resend) Variables

#### Variable 4: `RESEND_API_KEY`
- **Name:** `RESEND_API_KEY`
- **Value:** `re_xxxxxxxxxxxxxxxxxxxx` (`.env.local` faylınızdan əsl açarı kopyalayın)
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

#### Variable 5: `CONTACT_EMAIL`
- **Name:** `CONTACT_EMAIL`
- **Value:** `info@cradexagency.com`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.3. WhatsApp Variables

#### Variable 6: `NEXT_PUBLIC_WHATSAPP_NUMBER`
- **Name:** `NEXT_PUBLIC_WHATSAPP_NUMBER`
- **Value:** `994507786887`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.4. Site URL Variables

#### Variable 7: `NEXT_PUBLIC_SITE_URL`
- **Name:** `NEXT_PUBLIC_SITE_URL`
- **Value:** `https://cradexagency.com`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.5. Admin Panel Variables

#### Variable 8: `ADMIN_PASSWORD`
- **Name:** `ADMIN_PASSWORD`
- **Value:** `Cradex2026Admin!` (və ya öz admin şifrəniz)
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.6. GitHub Integration Variables

#### Variable 9: `GITHUB_TOKEN`
- **Name:** `GITHUB_TOKEN`
- **Value:** `.env.local` faylınızdan əsl GitHub token-ini kopyalayın (başlanğıcı `ghp_` ilə)
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

**Qeyd:** GitHub Token-i yoxdursa, buradan yaradın:  
https://github.com/settings/tokens → "Generate new token (classic)" → `repo` icazəsini seçin

#### Variable 10: `GITHUB_REPO`
- **Name:** `GITHUB_REPO`
- **Value:** `guliyevpasha/cradex-agency-website`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

#### Variable 11: `GITHUB_BRANCH`
- **Name:** `GITHUB_BRANCH`
- **Value:** `main`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

---

### 3.7. Revalidation Token (ƏN VACİB!)

Bu token Sanity webhook-unun Vercel API-ni təhlükəsiz şəkildə çağırması üçün lazımdır.

#### Variable 12: `REVALIDATION_TOKEN`
- **Name:** `REVALIDATION_TOKEN`
- **Value:** `2c1c6a4b03ff9a518aca57d6ee06baf4e0b6927c2041f32c11cf62c4456593d7`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **"Add"** düyməsinə klikləyin

**⚠️ DİQQƏT:** Bu token-i Sanity webhook konfiqurasiyasında da istifadə edəcəksiniz!

---

## ✅ Addım 4: Yoxlama və Tamamlama

1. **Bütün 12 variable əlavə olunduğunu yoxlayın:**
   - NEXT_PUBLIC_SANITY_PROJECT_ID ✅
   - NEXT_PUBLIC_SANITY_DATASET ✅
   - NEXT_PUBLIC_SANITY_API_VERSION ✅
   - RESEND_API_KEY ✅
   - CONTACT_EMAIL ✅
   - NEXT_PUBLIC_WHATSAPP_NUMBER ✅
   - NEXT_PUBLIC_SITE_URL ✅
   - ADMIN_PASSWORD ✅
   - GITHUB_TOKEN ✅
   - GITHUB_REPO ✅
   - GITHUB_BRANCH ✅
   - REVALIDATION_TOKEN ✅

2. **Hər variable üçün 3 mühitin də (Production, Preview, Development) seçildiyini təsdiqləyin**

3. **Səhifəni yeniləyin** və environment variables-lərin siyahısını görün

---

## 🔄 Addım 5: Redeploy (Yenidən Deploy)

Environment variables dəyişdikdən sonra layihəni yenidən deploy etmək lazımdır:

### Üsul 1: Vercel Dashboard-dan
1. Layihənizin **"Deployments"** tabına gedin
2. Ən son deployment-in sağ tərəfindəki **3 nöqtə (⋯)** düyməsinə klikləyin
3. **"Redeploy"** seçin
4. **"Redeploy"** düyməsini təsdiqləyin

### Üsul 2: Git Push (Tövsiyə olunur)
```bash
# Terminaldə:
git add .
git commit -m "Update environment variables"
git push origin main
```

Vercel avtomatik olaraq yeni deployment başladacaq.

---

## 📊 Addım 6: Deployment Status-u Yoxlayın

1. **"Deployments"** tabında deployment statusunu izləyin
2. Status **"Ready"** olduqda ✅ deployment uğurludur
3. **"Visit"** düyməsinə klikləyərək canlı saytı açın və test edin

---

## 🔐 Təhlükəsizlik Qeydləri

1. **Heç vaxt environment variables-ləri publik yerlərdə paylaşmayın**
2. **REVALIDATION_TOKEN** və **GITHUB_TOKEN** xüsusilə gizli saxlanmalıdır
3. **ADMIN_PASSWORD** güclü və unikal olmalıdır
4. Əgər token-lərdən biri sızdırılarsa, dərhal yeniləyin:
   - GitHub Token: https://github.com/settings/tokens
   - Resend API Key: https://resend.com/api-keys
   - REVALIDATION_TOKEN: Yeni random token yaradın

---

## 🆘 Troubleshooting

### Problem: Deployment fail olur
**Həll:** 
- Environment variables-lərin adlarını yoxlayın (böyük/kiçik hərf duyarlıdır)
- Value-lərdə əlavə boşluq olmadığından əmin olun
- Vercel Logs-a baxın: Deployments → Failed deployment → "View Function Logs"

### Problem: Sanity məlumatları yüklənmir
**Həll:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` düzgün olduğunu yoxlayın
- Sanity dashboard-da project ID-ni təsdiqləyin: https://sanity.io/manage

### Problem: Contact form işləmir
**Həll:**
- `RESEND_API_KEY` düzgün və aktiv olduğunu yoxlayın
- Resend dashboard-da API key statusunu yoxlayın: https://resend.com/api-keys

---

## 📚 Əlavə Resurlar

- **Vercel Environment Variables Dokumentasiyası:**  
  https://vercel.com/docs/environment-variables

- **Sanity Environment Setup:**  
  https://www.sanity.io/docs/environment-variables

- **Next.js Environment Variables:**  
  https://nextjs.org/docs/basic-features/environment-variables

---

## ✨ Növbəti Addımlar

Environment variables konfiqurasiyasından sonra:

1. ✅ **Task 3.4 tamamlandı** - Environment variables Vercel-də quruldu
2. 🔜 **Task 3.5** - Sanity webhook-u konfiqurasiya edin
3. 🔜 **Task 3.6** - Test edin: Sanity-də content dəyişikliyi → canlı saytda avtomatik yenilənmə

---

**Müvəffəqiyyətlər! 🚀**

Əgər sualınız varsa və ya köməyə ehtiyacınız varsa, development komandası ilə əlaqə saxlayın.
