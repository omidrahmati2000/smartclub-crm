'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  Plus,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@smartclub/ui/command'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const t = useTranslations('venue-admin')

  const navigate = (href: string) => {
    router.push(href)
    onOpenChange(false)
  }

  const pages = [
    {
      icon: LayoutDashboard,
      label: t('nav.dashboard'),
      href: '/dashboard',
    },
    {
      icon: Calendar,
      label: t('nav.calendar'),
      href: '/calendar',
    },
    {
      icon: BookOpen,
      label: t('nav.bookings'),
      href: '/bookings',
    },
    {
      icon: Package,
      label: t('nav.assets'),
      href: '/assets',
    },
    {
      icon: Users,
      label: t('nav.customers'),
      href: '/customers',
    },
    {
      icon: UserCog,
      label: t('nav.staff'),
      href: '/staff',
    },
    {
      icon: Wallet,
      label: t('nav.finance'),
      href: '/finance',
    },
    {
      icon: TrendingUp,
      label: t('nav.pricing'),
      href: '/pricing',
    },
    {
      icon: FileText,
      label: t('nav.reports'),
      href: '/reports',
    },
    {
      icon: Settings,
      label: t('nav.settings'),
      href: '/settings',
    },
  ]

  const quickActions = [
    {
      icon: Plus,
      label: t('commandPalette.newBooking'),
      href: '/bookings?action=new',
    },
    {
      icon: Plus,
      label: t('commandPalette.newCustomer'),
      href: '/customers?action=new',
    },
    {
      icon: Plus,
      label: t('commandPalette.newAsset'),
      href: '/assets?action=new',
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t('commandPalette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('commandPalette.noResults')}</CommandEmpty>

        <CommandGroup heading={t('commandPalette.pages')}>
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <CommandItem
                key={page.href}
                onSelect={() => navigate(page.href)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{page.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('commandPalette.actions')}>
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <CommandItem
                key={action.href}
                onSelect={() => navigate(action.href)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{action.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
