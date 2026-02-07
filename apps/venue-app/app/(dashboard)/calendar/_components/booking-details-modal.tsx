'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { Separator } from '@smartclub/ui/separator';
import type { Booking } from '@smartclub/types';
import { BookingStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { cn } from '@smartclub/utils';
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  Users,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserMinus,
  Hash,
  Snowflake,
  Wrench,
  Crown,
  Tag,
  Globe,
  AlertTriangle,
} from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onCheckIn?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
}

export function BookingDetailsModal({
  booking,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onMarkNoShow,
}: BookingDetailsModalProps) {
  const t = useTranslations('venue-admin.bookings');
  const tc = useTranslations('venue-admin.common');
  const { data: session } = useSession();

  if (!booking) return null;

  const user = session?.user as any;
  const canEdit = user && hasPermission(user, Permission.BOOKING_EDIT);
  const canCancel = user && hasPermission(user, Permission.BOOKING_CANCEL);

  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case BookingStatus.PENDING:
        return {
          bg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
          icon: <AlertCircle className="w-4 h-4" />
        };
      case BookingStatus.CHECKED_IN:
        return {
          bg: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case BookingStatus.COMPLETED:
        return {
          bg: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
          icon: <CheckCircle2 className="w-4 h-4" />
        };
      case BookingStatus.CANCELLED:
        return {
          bg: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
          icon: <XCircle className="w-4 h-4" />
        };
      case BookingStatus.NO_SHOW:
        return {
          bg: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
          icon: <UserMinus className="w-4 h-4" />
        };
      case BookingStatus.FROZEN:
        return {
          bg: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
          icon: <Snowflake className="w-4 h-4" />
        };
      case BookingStatus.MAINTENANCE:
        return {
          bg: 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20',
          icon: <Wrench className="w-4 h-4" />
        };
      default:
        return {
          bg: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
          icon: <AlertCircle className="w-4 h-4" />
        };
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    return t(status);
  };

  const canCheckIn =
    canEdit &&
    (booking.status === BookingStatus.CONFIRMED ||
      booking.status === BookingStatus.PENDING);

  const canCancelBooking =
    canCancel &&
    booking.status !== BookingStatus.CANCELLED &&
    booking.status !== BookingStatus.COMPLETED &&
    booking.status !== BookingStatus.NO_SHOW;

  const canMarkAsNoShow =
    canEdit &&
    booking.status === BookingStatus.CONFIRMED;

  const statusStyles = getStatusStyles(booking.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-2xl border-none shadow-2xl max-h-[90vh]">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 sm:p-6 border-b">
          <DialogHeader className="p-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="outline" className={cn("px-2 py-1 gap-1.5 font-bold uppercase tracking-widest text-[10px]", statusStyles.bg)}>
                {statusStyles.icon}
                {getStatusLabel(booking.status)}
              </Badge>
              {booking.isVip && (
                <Badge variant="outline" className="px-2 py-1 gap-1 font-bold uppercase tracking-widest text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/20">
                  <Crown className="w-3 h-3 fill-amber-400" />
                  VIP
                </Badge>
              )}
              {booking.priority && booking.priority !== 'normal' && (
                <Badge variant="outline" className={cn("px-2 py-1 gap-1 font-bold uppercase tracking-widest text-[10px]", booking.priority === 'urgent' ? 'bg-red-500/10 text-red-700 border-red-500/20' : 'bg-amber-500/10 text-amber-700 border-amber-500/20')}>
                  <AlertTriangle className="w-3 h-3" />
                  {booking.priority}
                </Badge>
              )}
              {booking.bookingSource && (
                <Badge variant="outline" className="px-2 py-1 gap-1 font-bold uppercase tracking-widest text-[10px] bg-muted text-muted-foreground">
                  <Globe className="w-3 h-3" />
                  {booking.bookingSource}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-muted-foreground ml-auto bg-background/50 px-2 py-1 rounded-lg border border-border/50 shadow-sm">
                <Hash className="w-3 h-3" />
                <span className="text-[10px] font-black">{booking.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
            {booking.tags && booking.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <Tag className="w-3 h-3 text-muted-foreground" />
                {booking.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-[9px] font-bold bg-background/50 rounded-md text-muted-foreground uppercase tracking-tight border border-border/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">{t('bookingDetails')}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm font-medium text-muted-foreground/80">{t('bookingId', { id: booking.id })}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Booking Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm border border-border/50">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{t('date')}</p>
                  <p className="text-sm font-bold text-foreground">{booking.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm border border-border/50">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{t('time')}</p>
                  <p className="text-sm font-bold text-foreground">{booking.startTime} - {booking.endTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm border border-border/50">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{t('duration')}</p>
                  <p className="text-sm font-bold text-foreground">{booking.duration} {t('minutes')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm border border-border/50">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">{t('customer')}</p>
                  <p className="text-sm font-bold text-foreground truncate">{booking.participants?.[0]?.name || t('customer')}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Payment & Status */}
          <div className="bg-muted/20 border border-border/50 rounded-2xl p-4 sm:p-6 shadow-inner">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground">{t('paymentInfo')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{t('amount')}</span>
                <p className="text-xl font-black text-primary tabular-nums">
                  {formatCurrency(booking.totalPrice, booking.currency)}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{t('paymentMethod')}</span>
                <Badge variant="secondary" className="font-bold px-3 py-1 bg-background shadow-sm border border-border/50">{booking.paymentMethod}</Badge>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{t('paymentStatus')}</span>
                <Badge className={cn("font-bold px-3 py-1 shadow-sm border", booking.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 border-amber-500/20')}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Participants */}
          {booking.participants && booking.participants.length > 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{t('participants')}</h3>
                <Badge variant="outline" className="ml-auto font-black">{booking.participants.length}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {booking.participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase group-hover:scale-110 transition-transform">
                      {participant.name.substring(0, 1)}
                    </div>
                    <span className="text-sm font-bold text-foreground/80">{participant.name}</span>
                    {participant.isHost && (
                      <Badge className="ml-auto text-[9px] font-black bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                        {t('host')}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/50 p-3 sm:p-6 border-t mt-0">
          <div className="flex flex-col sm:flex-row flex-wrap w-full gap-2 sm:gap-3 sm:justify-end items-stretch sm:items-center">
            {canCheckIn && onCheckIn && (
              <Button
                onClick={() => {
                  onCheckIn(booking.id);
                  onClose();
                }}
                className="rounded-xl px-4 sm:px-8 font-black uppercase tracking-widest text-[10px] sm:text-xs h-10 sm:h-12 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t('checkIn')}
              </Button>
            )}

            {canMarkAsNoShow && onMarkNoShow && (
              <Button
                onClick={() => {
                  onMarkNoShow(booking.id);
                  onClose();
                }}
                variant="outline"
                className="rounded-xl px-4 sm:px-6 font-black uppercase tracking-widest text-[10px] sm:text-xs h-10 sm:h-12 border-orange-500/20 hover:bg-orange-500/5 hover:text-orange-600 transition-all"
              >
                <UserMinus className="w-4 h-4 mr-2" />
                {t('markNoShow')}
              </Button>
            )}

            {canCancelBooking && onCancel && (
              <Button
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
                variant="destructive"
                className="rounded-xl px-4 sm:px-6 font-black uppercase tracking-widest text-[10px] sm:text-xs h-10 sm:h-12 shadow-lg shadow-destructive/20 transition-all"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {t('cancel')}
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="ghost"
              className="rounded-xl px-4 sm:px-6 font-black uppercase tracking-widest text-[10px] sm:text-xs h-10 sm:h-12 hover:bg-background/80 transition-all"
            >
              {tc('close')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
