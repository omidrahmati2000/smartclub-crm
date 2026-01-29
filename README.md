# 🏆 SmartClub CRM - Universal Leisure Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-red)](https://turbo.build/)
[![i18n](https://img.shields.io/badge/i18n-FA%20%7C%20EN-green)](https://next-intl-docs.vercel.app/)
[![License](https://img.shields.io/badge/License-Private-yellow)]()

> یک پلتفرم جامع مدیریت رزرو و بوکینگ برای مراکز تفریحی و ورزشی - "سیستم عامل سرگرمی"

**SmartClub CRM** is a comprehensive booking and management system for leisure and sports venues. Built with modern web technologies for scalability, performance, and multi-language support (Persian RTL + English LTR).

**رقبا:** Playtomic, Padel360

---

## 📋 فهرست محتوا

- [ویژگی‌های کلیدی](#️-ویژگیهای-کلیدی)
- [وضعیت پروژه](#-وضعیت-پروژه)
- [فناوری‌ها](#️-فناوریها)
- [ساختار پروژه](#-ساختار-پروژه)
- [نصب و راه‌اندازی](#-نصب-و-راهاندازی)
- [اجرای پروژه](#-اجرای-پروژه)
- [تست](#-تست)
- [چندزبانگی](#-چندزبانگی)
- [اکانت‌های دمو](#-اکانتهای-دمو)
- [داکیومنت](#-داکیومنت)

---

## 🎯 ویژگی‌های کلیدی

### ✅ Venue App (پنل مدیریت باشگاه) - **100% تکمیل شده**
- ✅ **Dashboard**: نمایش KPI ها (رزروها، درآمد، اشغال، pending)
- ✅ **تقویم Gantt**: نمای روزانه با تایم‌لاین 30 دقیقه‌ای
- ✅ **مدیریت رزرو**: CRUD کامل با جستجو و فیلتر
- ✅ **مدیریت امکانات**: پشتیبانی از 4 نوع بوکینگ (Slot, Duration, Capacity, Open-session)
- ✅ **تنظیمات باشگاه**: پروفایل، ساعات کاری، قوانین رزرو، White-label، اعلان‌ها
- ✅ **CRM مشتریان**: پروفایل، آمار، تگ‌ها، یادداشت‌ها
- ✅ **مدیریت کارکنان**: RBAC با 4 نقش (Owner, Manager, Receptionist, Cashier)
- ✅ **گزارشات مالی**: درآمد، Occupancy heatmap، نمودارهای تحلیلی
- ✅ **قیمت‌گذاری پویا**: 6 نوع قانون، 5 نوع تنظیم قیمت، Priority system

### 🔄 Web App (پنل مشتری) - **شروع شده**
- ✅ API Routes برای venues, assets, slots, bookings
- 🚧 صفحات UI (در حال توسعه)

### 🔴 Admin App (پنل ادمین پلتفرم) - **شروع نشده**
- مدیریت تمام باشگاه‌ها
- مدیریت کاربران
- گزارشات پلتفرم

### 🔴 Coach App (پنل مربی) - **شروع نشده**
- تقویم چند باشگاهی
- مدیریت دانشجویان
- ردیابی درآمد

---

## 📊 وضعیت پروژه

| اپلیکیشن | وضعیت | پیشرفت | آخرین بروزرسانی |
|---------|-------|--------|-----------------|
| **venue-app** | ✅ کامل | 100% | 2026-01-28 |
| **web-app** | 🟡 شروع شده | 5% | 2026-01-29 |
| **admin-app** | 🔴 شروع نشده | 0% | - |
| **coach-app** | 🔴 شروع نشده | 0% | - |

### آمار Venue App:
- **10 ماژول کامل**
- **79 کامپوننت React**
- **35+ API endpoint** (MSW mock)
- **15 UI primitive** (shadcn/ui)
- **50+ TypeScript interface**
- **10 fixture** برای mock data
- **Build موفق** ✅

---

## 🛠️ فناوری‌ها

```
Frontend Framework    → Next.js 15 (App Router) + TypeScript
Monorepo             → Turborepo + pnpm workspaces
UI Components        → shadcn/ui + Tailwind CSS v4
State Management     → TanStack Query + React Context
Mock API             → MSW (Mock Service Worker)
Authentication       → NextAuth.js
i18n                 → next-intl (FA RTL + EN LTR)
Forms                → React Hook Form + Zod
Date/Time            → date-fns + date-fns-jalali
Charts               → Recharts
Drag & Drop          → @dnd-kit
```

---

## 📁 ساختار پروژه

```
smartClubCRM/
├── apps/                           # اپلیکیشن‌ها
│   ├── venue-app/                  # ✅ پنل مدیریت باشگاه (100%)
│   ├── web-app/                    # 🟡 پنل مشتری (5%)
│   ├── admin-app/                  # 🔴 پنل ادمین پلتفرم
│   └── coach-app/                  # 🔴 پنل مربی
├── packages/                       # پکیج‌های مشترک
│   ├── ui/                         # ✅ کامپوننت‌های shadcn/ui
│   ├── types/                      # ✅ TypeScript types
│   ├── utils/                      # ✅ توابع کمکی
│   ├── i18n/                       # ✅ ترجمه‌های فارسی/انگلیسی
│   ├── mock-data/                  # ✅ MSW handlers + mock fixtures
│   └── config/                     # ✅ کانفیگ‌های مشترک
├── docs/                           # ✅ مستندات کامل
│   ├── ARCHITECTURE.md             # معماری پروژه
│   ├── FEATURES.md                 # لیست ویژگی‌ها
│   ├── ROADMAP.md                  # نقشه راه
│   ├── CURRENT-STATUS.md           # وضعیت فعلی
│   ├── TESTING.md                  # راهنمای تست
│   └── CHANGELOG.md                # تغییرات
├── CLAUDE.md                       # ✅ حافظه پروژه برای AI
├── README.md                       # ✅ این فایل
├── turbo.json                      # کانفیگ Turborepo
└── package.json                    # پکیج اصلی
```

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها

```bash
Node.js >= 18.x
pnpm >= 8.x
```

### 1️⃣ نصب dependencies

```bash
# نصب pnpm (اگر نصب نیست)
npm install -g pnpm

# کلون پروژه
git clone <repo-url>
cd smartClubCRM

# نصب تمام dependencies
pnpm install
```

### 2️⃣ تنظیم Environment Variables

```bash
# برای هر اپ یک فایل .env.local بسازید
cp apps/venue-app/.env.example apps/venue-app/.env.local
cp apps/web-app/.env.example apps/web-app/.env.local
```

**محتوای `.env.local`:**
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## ▶️ اجرای پروژه

### Development Mode

```bash
# اجرای همه اپ‌ها به صورت همزمان
pnpm turbo dev

# یا فقط یک اپ خاص:
pnpm turbo dev --filter=@smartclub/venue-app
pnpm turbo dev --filter=@smartclub/web-app
```

**URLها:**
- Venue App: http://localhost:3001
- Web App: http://localhost:3000
- Admin App: http://localhost:3002
- Coach App: http://localhost:3003

### Production Build

```bash
# بیلد همه اپ‌ها
pnpm turbo build

# یا فقط یک اپ:
pnpm turbo build --filter=@smartclub/venue-app

# اجرای پروداکشن
cd apps/venue-app
pnpm start
```

### دستورات مفید

```bash
# لینت کردن
pnpm turbo lint

# فرمت کردن کدها
pnpm turbo format

# پاک کردن cache
pnpm turbo clean

# نصب یک پکیج برای workspace خاص
pnpm add <package> --filter @smartclub/venue-app
```

---

## 🧪 تست

### اجرای تست‌ها

```bash
# تست اپ venue-app
cd apps/venue-app
pnpm dev

# باز کردن مرورگر:
# Persian: http://localhost:3001/fa/login
# English: http://localhost:3001/en/login
```

### سناریوهای تست

**1. ورود به سیستم:**
- برو به `/fa/login`
- ایمیل: `venue-owner@test.com`
- پسورد: هر چیزی (مثلاً `123`)
- کلیک روی "ورود"

**2. مشاهده Dashboard:**
- بعد از لاگین به `/fa/overview` منتقل می‌شی
- مشاهده 4 کارت KPI
- لیست رزروهای اخیر
- Quick actions

**3. تست تقویم:**
- برو به `/fa/calendar`
- مشاهده نمای روزانه Gantt
- کلیک روی یک booking برای مشاهده جزئیات

**4. تست CRUD رزرو:**
- برو به `/fa/bookings`
- کلیک "افزودن رزرو جدید"
- پر کردن فرم
- ذخیره و مشاهده در لیست

**تست‌های بیشتر:** مستندات کامل در `docs/TESTING.md`

---

## 🌍 چندزبانگی

پروژه از **2 زبان** به صورت کامل پشتیبانی می‌کند:

### زبان‌های موجود

| زبان | کد | جهت | وضعیت | تعداد کلیدها |
|------|-----|-----|-------|--------------|
| **فارسی** | `fa` | RTL | ✅ کامل | ~500 کلید |
| **انگلیسی** | `en` | LTR | ✅ کامل | ~500 کلید |
| **عربی** | `ar` | RTL | ✅ کامل | ~500 کلید |

### ساختار فایل‌های ترجمه

```
packages/i18n/locales/
├── fa/                              # فارسی (اصلی) - RTL
│   ├── common.json                  # کلمات مشترک
│   ├── auth.json                    # احراز هویت
│   ├── venue-admin.json             # پنل باشگاه
│   ├── booking.json                 # رزرو
│   ├── explore.json                 # جستجو
│   ├── my-bookings.json             # رزروهای من
│   └── venue.json                   # اطلاعات باشگاه
├── en/                              # English (secondary) - LTR
│   ├── common.json
│   ├── auth.json
│   ├── venue-admin.json
│   ├── booking.json
│   ├── explore.json
│   ├── my-bookings.json
│   └── venue.json
└── ar/                              # العربية - RTL
    ├── common.json
    ├── auth.json
    ├── venue-admin.json
    ├── booking.json
    ├── explore.json
    ├── my-bookings.json
    └── venue.json
```

### استفاده از ترجمه در کد

```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### تغییر زبان

```typescript
// در URL:
/fa/overview  → فارسی
/en/overview  → انگلیسی
/ar/overview  → عربی

// در کد:
import { useRouter, usePathname } from 'next/navigation';

const router = useRouter();
const pathname = usePathname();

// تغییر به انگلیسی
router.push(pathname.replace('/fa/', '/en/'));
```

### RTL/LTR Support

پروژه به صورت خودکار جهت متن را بر اساس زبان تنظیم می‌کند:

```css
/* در فارسی */
html[dir="rtl"] { ... }

/* در انگلیسی */
html[dir="ltr"] { ... }
```

### نکات مهم:

✅ **همه** متن‌های کاربر باید از i18n بیان (هیچ hardcoded string نباید باشه)
✅ فارسی زبان **اصلی** پروژه است
✅ همه ترجمه‌ها به صورت همزمان در هر دو زبان نگهداری می‌شن
✅ از `date-fns-jalali` برای تقویم شمسی استفاده می‌شه
✅ تمام UI کامپوننت‌ها RTL-ready هستن

---

## 👤 اکانت‌های دمو

تمام اکانت‌های زیر با **هر پسوردی** کار می‌کنند (authentication mock است):

### Venue Staff (پرسنل باشگاه)

| ایمیل | نقش | دسترسی |
|-------|-----|---------|
| `venue-owner@test.com` | Owner | همه دسترسی‌ها |
| `venue-manager@test.com` | Manager | بدون حذف و تنظیمات |
| `receptionist@test.com` | Receptionist | رزرو + مشتریان |
| `cashier@test.com` | Cashier | مشاهده مالی |

### سایر کاربران

| ایمیل | نوع کاربر |
|-------|-----------|
| `customer@test.com` | مشتری |
| `coach@test.com` | مربی |
| `admin@test.com` | ادمین پلتفرم |

**نکته:** برای لاگین سریع، می‌تونید از دکمه‌های Quick Login در صفحه ورود استفاده کنید.

---

## 📚 داکیومنت

مستندات کامل در پوشه `docs/`:

| فایل | محتوا |
|------|-------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | معماری و ساختار سیستم |
| [FEATURES.md](docs/FEATURES.md) | لیست کامل ویژگی‌ها |
| [ROADMAP.md](docs/ROADMAP.md) | نقشه راه توسعه |
| [CURRENT-STATUS.md](docs/CURRENT-STATUS.md) | وضعیت فعلی پروژه |
| [TESTING.md](docs/TESTING.md) | راهنمای تست و سناریوها |
| [CHANGELOG.md](docs/CHANGELOG.md) | تاریخچه تغییرات |
| [DATA-STRUCTURE.md](docs/DATA-STRUCTURE.md) | ساختار دیتابیس و typeها |
| [CLAUDE.md](CLAUDE.md) | حافظه پروژه برای AI |

---

## 🎨 UI Components

پروژه از **shadcn/ui** استفاده می‌کند. کامپوننت‌های موجود:

### Form Components
- Button, Input, Textarea, Select
- Checkbox, RadioGroup, Switch
- DatePicker, Calendar
- Label, Form (with React Hook Form)

### Layout Components
- Card, Dialog, Sheet
- Tabs, Accordion
- Table, DataTable
- Skeleton

### Feedback Components
- Badge, Avatar
- Tooltip, Popover
- Alert, Toast
- Progress, Spinner

### Navigation
- DropdownMenu
- NavigationMenu
- Breadcrumb

**همه کامپوننت‌ها RTL-ready و i18n-enabled هستن.**

---

## 🔒 Permission System (RBAC)

پروژه یک سیستم کامل RBAC دارد:

### Venue Roles

```typescript
enum VenueRole {
  OWNER       = 'OWNER',       // همه دسترسی‌ها
  MANAGER     = 'MANAGER',     // بدون حذف و تنظیمات
  RECEPTIONIST = 'RECEPTIONIST', // رزرو + مشتری
  CASHIER     = 'CASHIER'      // فقط مشاهده
}
```

### Permissions

```typescript
const Permission = {
  // Venue
  VENUE_VIEW, VENUE_EDIT, VENUE_DELETE, VENUE_SETTINGS,

  // Bookings
  BOOKING_VIEW, BOOKING_CREATE, BOOKING_EDIT, BOOKING_CANCEL,

  // Assets
  ASSET_VIEW, ASSET_CREATE, ASSET_EDIT, ASSET_DELETE,

  // Customers
  CUSTOMER_VIEW, CUSTOMER_MANAGE,

  // Staff
  STAFF_VIEW, STAFF_MANAGE,

  // Finance
  FINANCE_VIEW, FINANCE_MANAGE,

  // Reports
  REPORTS_VIEW,

  // Pricing
  PRICING_VIEW, PRICING_MANAGE,

  // ... و بیشتر
}
```

### استفاده در کد

```typescript
import { hasPermission } from '@smartclub/types';

if (hasPermission(user, Permission.BOOKING_CREATE)) {
  // نمایش دکمه "افزودن رزرو"
}
```

---

## 🗂️ Mock Data & MSW

تمام APIها با **MSW (Mock Service Worker)** شبیه‌سازی شدن:

### Handlers موجود:
- `authHandlers` - احراز هویت
- `venueHandlers` - مدیریت باشگاه
- `assetHandlers` - امکانات
- `bookingHandlers` - رزروها
- `customerHandlers` - مشتریان (CRM)
- `staffHandlers` - کارکنان
- `financialReportHandlers` - گزارشات مالی
- `pricingRuleHandlers` - قیمت‌گذاری پویا
- `venueSettingsHandlers` - تنظیمات

### Fixtures (داده‌های mock):
- `mockVenues` - 3 باشگاه نمونه
- `mockAssets` - 10 امکان
- `mockBookings` - 7 رزرو
- `mockUsers` - 6 کاربر
- `mockCustomers` - 15 مشتری
- `mockStaff` - 4 عضو تیم
- `mockPricingRules` - 6 قانون قیمت
- ... و بیشتر

**تمام mock data آماده جایگزینی با Backend واقعی هست.**

---

## 🚧 کارهای باقیمانده

### Web App (پنل مشتری) - اولویت 1
- [ ] صفحه اصلی و لندینگ
- [ ] لیست و جستجوی باشگاه‌ها
- [ ] صفحه جزئیات باشگاه
- [ ] فرآیند رزرو (Slot-based & Duration-based)
- [ ] پنل "رزروهای من"
- [ ] White-label pages (subdomain)

### Admin App (پنل ادمین) - اولویت 2
- [ ] Dashboard کلی پلتفرم
- [ ] مدیریت باشگاه‌ها
- [ ] مدیریت کاربران
- [ ] گزارشات مالی پلتفرم
- [ ] تنظیمات سیستم

### Coach App (پنل مربی) - اولویت 3
- [ ] Dashboard مربی
- [ ] تقویم چند باشگاهی
- [ ] مدیریت دانشجویان
- [ ] مدیریت کلاس‌ها
- [ ] پروفایل عمومی مربی

### بهبودهای Venue App
- [ ] نمای هفتگی و ماهانه تقویم
- [ ] Drag & drop برای رزروها
- [ ] CSV export برای bookings
- [ ] عملیات bulk برای رزروها

---

## 🤝 مشارکت

این پروژه فعلاً **خصوصی** است.

---

## 📄 License

Private - All Rights Reserved

---

## 📧 تماس

برای سوالات یا مشکلات، issue بسازید.

---

**ساخته شده با ❤️ برای صنعت تفریح و ورزش ایران**
