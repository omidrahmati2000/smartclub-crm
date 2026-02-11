'use client'

import { Menu, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@smartclub/ui/button'
import { BreadcrumbNav } from './breadcrumb-nav'
import { UserMenu } from './user-menu'
import { NotificationDropdown } from './notification-dropdown'

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const t = useTranslations('venue-admin')

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-muted/80 transition-colors"
          onClick={onMenuClick}
          aria-label={t('nav.menu')}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Desktop only */}
        <div className="hidden md:flex md:w-64 md:items-center md:gap-3 md:px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
            <span className="text-base font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            SmartClub
          </span>
        </div>

        {/* Breadcrumb - Desktop */}
        <div className="hidden flex-1 md:block">
          <BreadcrumbNav />
        </div>

        {/* Actions Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button - Desktop */}
          <Button
            variant="outline"
            className="hidden h-10 w-full max-w-xs items-center gap-2 px-4 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all lg:inline-flex lg:max-w-sm shadow-sm"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">{t('header.search')}</span>
            <kbd className="pointer-events-none ml-auto hidden h-6 select-none items-center gap-1 rounded-md border border-border/50 bg-muted/50 px-2 font-mono text-[10px] font-medium opacity-100 lg:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-muted/80 transition-colors"
            onClick={onSearchClick}
            aria-label={t('header.search')}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Divider */}
          <div className="hidden h-8 w-px bg-border/60 sm:block" />

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
