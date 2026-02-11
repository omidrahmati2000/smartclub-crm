import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const isActive = pathname === href || pathname.startsWith(href + '/')

  const commonClasses = cn(
    'transition-colors duration-150',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  )

  if (isCollapsed) {
    return (
      <Link
        href={href}
        className={cn(
          'group relative flex h-9 w-9 items-center justify-center rounded-lg',
          commonClasses
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
        <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block transition-all z-50">
          {label}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        commonClasses
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant={isActive ? 'secondary' : 'default'} className="ml-auto">
          {badge > 99 ? '99+' : badge}
        </Badge>
      )}
    </Link>
  )
}

