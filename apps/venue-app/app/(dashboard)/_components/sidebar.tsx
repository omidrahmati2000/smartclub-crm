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
  Wallet,
  TrendingUp,
  FileText,
  Settings,
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
          href: '/assets',
          label: t('nav.assets'),
          icon: Package,
          permission: Permission.ASSET_VIEW,
        },
        {
          href: '/customers',
          label: t('nav.customers'),
          icon: Users,
          permission: Permission.CUSTOMER_VIEW,
        },
      ],
    },
    {
      label: t('nav.groups.management'),
      items: [
        {
          href: '/staff',
          label: t('nav.staff'),
          icon: UserCog,
          permission: Permission.STAFF_VIEW,
        },
        {
          href: '/finance',
          label: t('nav.finance'),
          icon: Wallet,
          permission: Permission.FINANCE_VIEW,
        },
        {
          href: '/pricing',
          label: t('nav.pricing'),
          icon: TrendingUp,
          permission: Permission.PRICING_VIEW,
        },
        {
          href: '/reports',
          label: t('nav.reports'),
          icon: FileText,
          permission: Permission.REPORTS_VIEW,
        },
      ],
    },
    {
      label: t('nav.groups.system'),
      items: [
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
        'hidden h-screen flex-col border-e bg-background transition-all duration-300 md:flex',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
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
      <ScrollArea className="flex-1 px-3 py-4">
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
      <div className="border-t">
        <UserMenu isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}
