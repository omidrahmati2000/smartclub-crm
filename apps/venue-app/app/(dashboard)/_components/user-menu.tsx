'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { LogOut, User, ChevronDown, Settings, HelpCircle } from 'lucide-react'
import { Badge } from '@smartclub/ui/badge'
import { Button } from '@smartclub/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@smartclub/ui/avatar'
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

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      receptionist: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      cashier: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    }
    return colorMap[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
              className="h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
              aria-label={th('profile')}
            >
              <Avatar className="h-9 w-9 ring-2 ring-border/50">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                  {getUserInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-64 shadow-lg"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                  <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-base">
                    {getUserInitials(session.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-none truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                  {session.user.role && (
                    <Badge className={cn('w-fit text-xs font-medium mt-1.5', getRoleColor(session.user.role))}>
                      {getRoleLabel(session.user.role)}
                    </Badge>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <Settings className="mr-3 h-4 w-4" />
              <span className="font-medium">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <HelpCircle className="mr-3 h-4 w-4" />
              <span className="font-medium">Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">{tc('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-full px-2 hover:bg-muted/80 transition-all ring-2 ring-transparent hover:ring-primary/20"
        >
          <Avatar className="h-8 w-8 ring-2 ring-border/50">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
              {getUserInitials(session.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 flex-1 flex-col items-start text-left lg:flex">
            <p className="truncate text-sm font-semibold leading-tight">
              {session.user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {session.user.role && getRoleLabel(session.user.role)}
            </p>
          </div>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted-foreground lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 shadow-lg"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-base">
                {getUserInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <p className="text-sm font-semibold leading-none truncate">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {session.user.email}
              </p>
              {session.user.role && (
                <Badge className={cn('w-fit text-xs font-medium mt-1.5', getRoleColor(session.user.role))}>
                  {getRoleLabel(session.user.role)}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2.5">
          <Settings className="mr-3 h-4 w-4" />
          <span className="font-medium">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer py-2.5">
          <HelpCircle className="mr-3 h-4 w-4" />
          <span className="font-medium">Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">{tc('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
