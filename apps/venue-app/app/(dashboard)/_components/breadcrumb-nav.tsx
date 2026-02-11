'use client'

import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@smartclub/ui/breadcrumb'

export function BreadcrumbNav() {
  const pathname = usePathname()
  const t = useTranslations('venue-admin')

  // Remove locale from pathname (e.g., /en/dashboard -> /dashboard)
  const cleanPath = pathname.replace(/^\/(en|fa|ar)/, '')

  // Split path into segments
  const segments = cleanPath.split('/').filter(Boolean)

  // Map path segments to translated labels
  const getLabel = (segment: string) => {
    const navKey = segment as keyof typeof navLabels
    const navLabels = {
      dashboard: t('nav.dashboard'),
      calendar: t('nav.calendar'),
      bookings: t('nav.bookings'),
      assets: t('nav.assets'),
      customers: t('nav.customers'),
      staff: t('nav.staff'),
      finance: t('nav.finance'),
      pricing: t('nav.pricing'),
      reports: t('nav.reports'),
      settings: t('nav.settings'),
      shop: t('nav.shop'),
      pos: t('nav.pos'),
      valet: t('nav.valet'),
      memberships: t('nav.memberships'),
      wallet: t('nav.wallet'),
      marketing: t('nav.marketing'),
      tournaments: t('nav.tournaments'),
      scoreboard: t('nav.scoreboard'),
      coaches: t('nav.coaches'),
      social: t('nav.social'),
      automation: t('nav.automation'),
    }

    return navLabels[navKey] || segment
  }

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const isLast = index === segments.length - 1

    return {
      label: getLabel(segment),
      href,
      isLast,
    }
  })

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
