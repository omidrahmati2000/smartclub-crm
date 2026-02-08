import { http, HttpResponse } from 'msw'
import { mockNotifications } from '../fixtures/notifications'
import type { Notification } from '@smartclub/types'

let notificationsData = [...mockNotifications]

export const notificationHandlers = [
  // GET /notifications - Get all notifications
  http.get('/api/notifications', () => {
    return HttpResponse.json({
      success: true,
      data: notificationsData.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    })
  }),

  // GET /notifications/:id - Get single notification
  http.get('/api/notifications/:id', ({ params }) => {
    const notification = notificationsData.find((n) => n.id === params.id)
    if (!notification) {
      return HttpResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json({
      success: true,
      data: notification,
    })
  }),

  // PUT /notifications/:id - Mark notification as read
  http.put('/api/notifications/:id', async ({ params, request }) => {
    const body = (await request.json()) as { isRead: boolean }
    const notification = notificationsData.find((n) => n.id === params.id)

    if (!notification) {
      return HttpResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    notification.isRead = body.isRead
    return HttpResponse.json({
      success: true,
      data: notification,
    })
  }),

  // DELETE /notifications/:id - Delete notification
  http.delete('/api/notifications/:id', ({ params }) => {
    const index = notificationsData.findIndex((n) => n.id === params.id)
    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    const [deleted] = notificationsData.splice(index, 1)
    return HttpResponse.json({
      success: true,
      data: deleted,
    })
  }),

  // POST /notifications/mark-all-as-read - Mark all as read
  http.post('/api/notifications/mark-all-as-read', () => {
    notificationsData = notificationsData.map((n) => ({
      ...n,
      isRead: true,
    }))

    return HttpResponse.json({
      success: true,
      data: { updatedCount: notificationsData.length },
    })
  }),

  // POST /notifications/delete-all - Delete all notifications
  http.post('/api/notifications/delete-all', () => {
    const count = notificationsData.length
    notificationsData = []

    return HttpResponse.json({
      success: true,
      data: { deletedCount: count },
    })
  }),

  // POST /notifications - Create new notification
  http.post('/api/notifications', async ({ request }) => {
    const body = (await request.json()) as Partial<Notification>

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: body.userId || 'user-1',
      type: body.type || 'system',
      title: body.title || 'New Notification',
      message: body.message || '',
      data: body.data,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    notificationsData.unshift(newNotification)
    return HttpResponse.json({
      success: true,
      data: newNotification,
    })
  }),
]
