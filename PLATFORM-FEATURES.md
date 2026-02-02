# SmartClub CRM - Platform Features

## 🌍 Global & Multi-Region Platform

SmartClub CRM is designed as a **truly global platform** that can be customized for any country, region, or market.

### ✅ Current Demo Configuration
**Primary Market**: UAE & GCC Countries
**Demo Language**: English
**Demo Data**: UAE venues (Dubai, Abu Dhabi, Sharjah)

---

## 🌐 Multi-Language Support (i18n)

The platform supports **unlimited languages** with full RTL/LTR capabilities:

### Currently Supported Languages:
- **English (EN)** - Primary demo language
- **Arabic (AR)** - Regional language for GCC markets
- **Persian (FA)** - Demonstrates platform flexibility

### Easy to Add New Languages:
Simply add translation files in `packages/i18n/locales/[locale]/`:
- `common.json` - Shared translations
- `venue-admin.json` - Venue management panel
- `location-compliance.json` - Multi-region settings
- And more...

**RTL Support**: Automatic layout direction switching for Arabic, Persian, Hebrew, etc.

---

## 💰 Multi-Currency Support

The platform supports **40+ currencies** with proper formatting:

### GCC Currencies:
- **AED** - UAE Dirham (د.إ)
- **SAR** - Saudi Riyal (ر.س)
- **QAR** - Qatari Riyal (ر.ق)
- **KWD** - Kuwaiti Dinar (د.ك) - 3 decimal places
- **BHD** - Bahraini Dinar (د.ب) - 3 decimal places
- **OMR** - Omani Rial (ر.ع) - 3 decimal places

### Global Currencies:
USD, EUR, GBP, CHF, CAD, AUD, JPY, CNY, INR, SGD, MYR, THB, and 30+ more.

Each currency has:
- Native symbol (e.g., د.إ for AED)
- Correct decimal places (2 for most, 3 for KWD/BHD/OMR, 0 for JPY)
- Proper thousands/decimal separators
- Symbol positioning (before/after amount)

---

## 🌍 Country & Region Support

### Supported Countries: **30+ countries** across:
- **Middle East**: UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Oman, Turkey, Egypt, Jordan, Lebanon, Iraq, Iran
- **Europe (GDPR)**: Germany, France, UK, Spain, Italy, Netherlands, Belgium, Austria, Sweden, Portugal, Switzerland, Poland, Czech Republic, Greece, Denmark, Norway, Finland, Ireland
- **Americas**: USA, Canada, Mexico, Brazil, Argentina, Chile, Colombia
- **Asia Pacific**: Australia, India, Singapore, Malaysia, Indonesia, Thailand, Vietnam, Philippines, Japan, South Korea, China
- **Africa**: South Africa, Morocco

### Country-Specific Features:
- **Tax Systems**: VAT (EU), GST (AU/CA/IN), Sales Tax (US), customizable per venue
- **GDPR Compliance**: Auto-enabled for EU/EEA countries with data protection settings
- **State/Province Support**: For countries like US, Canada, Australia, India, Brazil
- **Timezone Handling**: Accurate timezone support for all regions
- **Postal Code Validation**: Country-specific postal code formats

---

## 🏢 Venue Customization

Each venue can be customized for its specific region:

### Location Settings:
- Country selection
- State/province (when applicable)
- City, postal code
- Timezone (automatic from location)
- GPS coordinates

### Financial Settings:
- Currency selection from 40+ options
- Tax configuration:
  - VAT (Value Added Tax) - EU standard
  - GST (Goods & Services Tax) - AU, CA, IN
  - Sales Tax (State-level) - US
  - Custom tax rates per venue
- Tax display mode (inclusive/exclusive/both)
- Tax category (standard/reduced/exempt)

### Compliance Settings:
- **GDPR Compliance** (auto-enabled for EU venues):
  - Data retention policies
  - Customer consent management
  - Data export & deletion requests
  - Breach notification workflows
  - Cookie consent settings
- **Age Verification**: Customizable per country
- **Parental Consent**: For minors
- **Privacy Policy**: Country-specific URLs

### White-Label Settings:
Each venue can have its own:
- Custom subdomain (e.g., `yourclub.smartclub.ae`)
- Brand colors (primary, secondary)
- Logo & cover images
- Meta tags (SEO) in any language
- Social media links (Instagram, Telegram, WhatsApp)

---

## 📊 Platform Architecture

### Built for Global Scale:
- **Monorepo Structure**: Shared types, UI components, utilities
- **Type-Safe**: Full TypeScript with strict mode
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with RTL support
- **i18n**: next-intl with namespace organization
- **Mock API**: MSW handlers for all features
- **Multi-Tenant**: Each venue is isolated with own settings

### Easy to Extend:
1. **Add New Country**: Update `Country` enum in `packages/types/src/enums/country.ts`
2. **Add New Currency**: Update `Currency` enum in `packages/types/src/enums/currency.ts`
3. **Add New Language**: Add locale folder in `packages/i18n/locales/[locale]/`
4. **Customize Tax**: Update tax settings per venue in venue settings

---

## 🎯 Current Demo Data

### Venues:
1. **Dubai Sports Hub** - Dubai, UAE (Padel & Tennis)
2. **GameZone Abu Dhabi** - Abu Dhabi, UAE (Gaming & Entertainment)
3. **Aqua Wellness Sharjah** - Sharjah, UAE (Swimming & Spa)

Plus international examples from:
- Berlin, Germany (GDPR compliance demo)
- Los Angeles, USA (State tax demo)
- Barcelona, Spain (Multi-language demo)

### Customers:
- Ahmed Al Sharif (Regular, VIP status)
- Sara Abdullah (VIP)
- Rashid Kareem (New customer)
- Mariam Hassan (Blacklisted - no-show demo)
- Hussein Al Rashid (Regular)
- Fatima Al Nouri (Tournament player)
- Omar Sadiq (Inactive)

### Staff:
- Mohamed Al Maktoum (Owner)
- Sara Ahmed (Manager)
- Ali Mahmoud (Receptionist)
- Fatima Kareem (Cashier)
- Hassan Nouri (Receptionist - inactive)

---

## 🚀 Key Takeaways

1. **✅ Truly Global**: 30+ countries, 40+ currencies, unlimited languages
2. **✅ Region-First**: Can focus on UAE/GCC while supporting worldwide
3. **✅ Compliance-Ready**: Built-in GDPR, tax systems, age verification
4. **✅ Customizable**: Every venue can adapt to its local market
5. **✅ Scalable**: Built with TypeScript, monorepo, modern architecture
6. **✅ Production-Ready**: All features working, builds successfully

---

**Note**: This is a demonstration platform. Backend API will be developed based on this frontend architecture. All mock data can be easily swapped with real API endpoints.
