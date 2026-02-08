'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Bell, Check, Trash2, Clock } from 'lucide-react'
import { Button } from '@smartclub/ui/button'
import { Badge } from '@smartclub/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@smartclub/ui/dropdown-menu'
import { ScrollArea } from '@smartclub/ui/scroll-area'
import { cn } from '@smartclub/utils'
import { apiClient } from '@/lib/api-client'
import type { Notification } from '@smartclub/types'

const notificationIcons: Record<string, React.ReactNode> = {
  booking_confirmed: '✓',
  booking_cancelled: '✕',
  booking_reminder: '⏰',
  payment_received: '💰',
  match_invitation: '🎾',
  match_result: '🏆',
  tournament_update: '🎪',
  chat_message: '💬',
  follow: '👤',
  achievement: '⭐',
  system: '⚙️',
}

const notificationColors: Record<string, string> = {
  booking_confirmed: 'bg-green-50 dark:bg-green-950',
  booking_cancelled: 'bg-red-50 dark:bg-red-950',
  booking_reminder: 'bg-yellow-50 dark:bg-yellow-950',
  payment_received: 'bg-blue-50 dark:bg-blue-950',
  match_invitation: 'bg-purple-50 dark:bg-purple-950',
  match_result: 'bg-orange-50 dark:bg-orange-950',
  tournament_update: 'bg-indigo-50 dark:bg-indigo-950',
  chat_message: 'bg-pink-50 dark:bg-pink-950',
  follow: 'bg-sky-50 dark:bg-sky-950',
  achievement: 'bg-amber-50 dark:bg-amber-950',
  system: 'bg-gray-50 dark:bg-gray-950',
}

export function NotificationDropdown() {
  const t = useTranslations('venue-admin.notifications')
  const tc = useTranslations('venue-admin.common')
  const [open, setOpen] = useState(false)

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const result = await apiClient.get('/notifications')
      if (result.success && Array.isArray(result.data)) {
        return result.data as Notification[]
      }
      return []
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiClient.put(`/notifications/${notificationId}`, { isRead: true })
      refetch()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/mark-all-as-read', {})
      refetch()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      refetch()
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleDeleteAll = async () => {
    try {
      await apiClient.post('/notifications/delete-all', {})
      refetch()
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted/80 transition-colors"
          aria-label={t('title')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] font-bold shadow-lg animate-in fade-in zoom-in flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">{t('title')}</h2>
            <p className="text-xs text-muted-foreground">
              {unreadCount} {t('unread')}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-2 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">{tc('loading')}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="space-y-2 px-4 py-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'group relative flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                    notificationColors[notification.type],
                    !notification.isRead && 'border-l-2 border-primary'
                  )}
                >
                  {/* Icon */}
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-background text-lg">
                    {notificationIcons[notification.type] || '📌'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title={t('markAsRead')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(notification.id)}
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="outline" size="sm" className="w-full text-xs">
              {t('viewAll')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleDeleteAll}
            >
              {t('clearAll')}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
