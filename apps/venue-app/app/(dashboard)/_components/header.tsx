'use client'

import { Menu, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@smartclub/ui/button'
import { BreadcrumbNav } from './breadcrumb-nav'
import { UserMenu } from './user-menu'

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const t = useTranslations('venue-admin')

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label={t('nav.menu')}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo - Desktop only */}
        <div className="hidden md:flex md:w-64 md:items-center md:gap-2 md:px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-lg font-semibold">SmartClub</span>
        </div>

        {/* Breadcrumb - Desktop */}
        <div className="hidden flex-1 md:block">
          <BreadcrumbNav />
        </div>

        {/* Page Title - Mobile */}
        <div className="flex-1 md:hidden">
          <h1 className="text-lg font-semibold">SmartClub</h1>
        </div>

        {/* Search Button */}
        <Button
          variant="outline"
          className="hidden h-9 w-full max-w-sm items-center gap-2 px-3 text-sm text-muted-foreground md:inline-flex"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">{t('header.search')}</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onSearchClick}
          aria-label={t('header.search')}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  )
}
