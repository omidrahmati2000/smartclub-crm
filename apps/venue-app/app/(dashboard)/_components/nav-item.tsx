'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Badge } from '@smartclub/ui/badge'
import { cn } from '@smartclub/utils'

interface NavItemProps {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  isCollapsed?: boolean
}

export function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  isCollapsed = false,
}: NavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isActive = pathname === href || pathname.startsWith(href + '/')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Don't navigate if already on this page
    if (isActive) return

    // Use startTransition for non-blocking, instant visual feedback
    startTransition(() => {
      // Use View Transitions API for smooth transition if supported
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push(href)
        })
      } else {
        router.push(href)
      }
    })
  }

  // Prefetch on hover for faster navigation
  const handleMouseEnter = () => {
    if (!isActive) {
      router.prefetch(href)
    }
  }

  if (isCollapsed) {
    return (
      <a
        href={href}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={cn(
          'group relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
        title={label}
      >
        <Icon className="h-5 w-5" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
        {/* Tooltip */}
        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block">
          {label}
        </span>
      </a>
    )
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        'transition-colors duration-150',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto">
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
    </a>
  )
}
