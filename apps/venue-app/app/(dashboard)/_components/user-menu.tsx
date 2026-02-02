'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { LogOut, User, ChevronUp } from 'lucide-react'
import { Badge } from '@smartclub/ui/badge'
import { Button } from '@smartclub/ui/button'
import { Separator } from '@smartclub/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@smartclub/ui/dropdown-menu'
import { cn } from '@smartclub/utils'

interface UserMenuProps {
  isCollapsed?: boolean
}

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const { data: session } = useSession()
  const t = useTranslations('venue-admin.staff')
  const tc = useTranslations('common')
  const th = useTranslations('venue-admin.header')

  if (!session?.user) {
    return null
  }

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      owner: t('owner'),
      manager: t('manager'),
      receptionist: t('receptionist'),
      cashier: t('cashier'),
    }
    return roleMap[role] || role
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (isCollapsed) {
    return (
      <div className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg"
              aria-label={th('profile')}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            {session.user.role && (
              <div className="px-2 py-1.5">
                <Badge variant="secondary" className="text-xs">
                  {getRoleLabel(session.user.role)}
                </Badge>
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-muted-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{tc('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-between px-2 py-2 hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <p className="truncate text-sm font-medium">
                  {session.user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session.user.role && getRoleLabel(session.user.role)}
                </p>
              </div>
            </div>
            <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="end"
          className="w-56"
          sideOffset={8}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          {session.user.role && (
            <div className="px-2 py-1.5">
              <Badge variant="secondary" className="text-xs">
                {getRoleLabel(session.user.role)}
              </Badge>
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{tc('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
