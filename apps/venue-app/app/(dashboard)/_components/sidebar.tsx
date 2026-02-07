'use client'

import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Package,
  Users,
  UserCog,
  Banknote,
  TrendingUp,
  FileText,
  Settings,
  Trophy,
  ShoppingBag,
  CreditCard,
  Car,
  GraduationCap,
  Crown,
  Sparkles,
  Monitor,
  Percent,
  Cpu,
  ReceiptText,
} from 'lucide-react'
import { Permission } from '@smartclub/types'
import type { User } from '@smartclub/types'
import { hasPermission } from '@smartclub/types'
import { Button } from '@smartclub/ui/button'
import { ScrollArea } from '@smartclub/ui/scroll-area'
import { Separator } from '@smartclub/ui/separator'
import { NavGroup } from './nav-group'
import { UserMenu } from './user-menu'
import { useSidebarCollapsed } from '../_hooks/use-sidebar'
import { cn } from '@smartclub/utils'

import type { PermissionKey } from '@smartclub/types'

interface NavItemType {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  permission?: PermissionKey
  badge?: number
}

interface NavGroupType {
  label: string
  items: NavItemType[]
}

export function Sidebar() {
  const t = useTranslations('venue-admin')
  const { data: session } = useSession()
  const { isCollapsed, toggle } = useSidebarCollapsed()

  const user = session?.user as User | undefined

  // Define navigation groups
  const navGroups: NavGroupType[] = [
    {
      label: t('nav.groups.overview'),
      items: [
        {
          href: '/overview',
          label: t('nav.dashboard'),
          icon: LayoutDashboard,
        },
        {
          href: '/calendar',
          label: t('nav.calendar'),
          icon: Calendar,
          permission: Permission.CALENDAR_VIEW,
        },
      ],
    },
    {
      label: t('nav.groups.operations'),
      items: [
        {
          href: '/bookings',
          label: t('nav.bookings'),
          icon: BookOpen,
          permission: Permission.BOOKING_VIEW,
        },
        {
          href: '/shop',
          label: t('nav.shop'),
          icon: ShoppingBag,
        },
        {
          href: '/pos',
          label: t('nav.pos'),
          icon: ReceiptText,
        },
        {
          href: '/valet',
          label: t('nav.valet'),
          icon: Car,
        },
        {
          href: '/assets',
          label: t('nav.assets'),
          icon: Package,
          permission: Permission.ASSET_VIEW,
        },
      ],
    },
    {
      label: t('nav.groups.management'),
      items: [
        {
          href: '/customers',
          label: t('nav.customers'),
          icon: Users,
          permission: Permission.CUSTOMER_VIEW,
        },
        {
          href: '/memberships',
          label: t('nav.memberships'),
          icon: Crown,
          // permission: Permission.MEMBERSHIP_VIEW,
        },
        {
          href: '/wallet',
          label: t('nav.wallet'),
          icon: CreditCard,
        },
        {
          href: '/marketing',
          label: t('nav.marketing'),
          icon: Percent,
        },
        {
          href: '/staff',
          label: t('nav.staff'),
          icon: UserCog,
          permission: Permission.STAFF_VIEW,
        },
      ],
    },
    {
      label: t('nav.groups.competitions'),
      items: [
        {
          href: '/tournaments',
          label: t('nav.tournaments'),
          icon: Trophy,
          permission: Permission.TOURNAMENT_VIEW,
        },
        {
          href: '/scoreboard',
          label: t('nav.scoreboard'),
          icon: Monitor,
        },
        {
          href: '/coaches',
          label: t('nav.coaches'),
          icon: GraduationCap,
          // permission: Permission.COACH_VIEW,
        },
        {
          href: '/social',
          label: t('nav.social'),
          icon: Sparkles,
        },
      ],
    },
    {
      label: t('nav.groups.system'),
      items: [
        {
          href: '/automation',
          label: t('nav.automation'),
          icon: Cpu,
        },
        {
          href: '/finance',
          label: t('nav.finance'),
          icon: Banknote,
          permission: Permission.FINANCE_VIEW,
        },
        {
          href: '/reports',
          label: t('nav.reports'),
          icon: FileText,
          permission: Permission.REPORTS_VIEW,
        },
        {
          href: '/pricing',
          label: t('nav.pricing'),
          icon: TrendingUp,
          permission: Permission.PRICING_VIEW,
        },
        {
          href: '/settings',
          label: t('nav.settings'),
          icon: Settings,
          permission: Permission.VENUE_SETTINGS,
        },
      ],
    },
  ]

  // Filter groups and items based on permissions
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.permission) return true
        if (!user) return false
        return hasPermission(user, item.permission)
      }),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <aside
      className={cn(
        'hidden h-full flex-col border-e bg-background transition-all duration-300 md:flex',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                S
              </span>
            </div>
            <span className="text-lg font-semibold">SmartClub</span>
          </div>
        )}

        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className={cn('h-8 w-8', isCollapsed && 'mx-auto')}
          aria-label={isCollapsed ? t('nav.expand') : t('nav.collapse')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 overflow-hidden px-3 py-4">
        <nav className="space-y-4">
          {visibleGroups.map((group, index) => (
            <div key={group.label}>
              <NavGroup
                label={group.label}
                items={group.items}
                isCollapsed={isCollapsed}
              />
              {index < visibleGroups.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t flex-shrink-0">
        <UserMenu isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}
