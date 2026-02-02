'use client'

import { NavItem } from './nav-item'
import { cn } from '@smartclub/utils'

interface NavItemType {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroupProps {
  label: string
  items: NavItemType[]
  isCollapsed: boolean
}

export function NavGroup({ label, items, isCollapsed }: NavGroupProps) {
  return (
    <div className="space-y-1">
      {!isCollapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            badge={item.badge}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  )
}
