export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'payment_received'
  | 'match_invitation'
  | 'match_result'
  | 'tournament_update'
  | 'chat_message'
  | 'follow'
  | 'achievement'
  | 'system';
