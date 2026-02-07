'use client';

import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@smartclub/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@smartclub/ui/form';
import { Input } from '@smartclub/ui/input';
import { Button } from '@smartclub/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@smartclub/ui/select';
import { Textarea } from '@smartclub/ui/textarea';
import { BookingType } from '@smartclub/types';
import { useCreateBooking } from '@/hooks/use-bookings';
import { useToast } from '@smartclub/ui/use-toast';
import {
    User,
    Phone,
    Calendar,
    Clock,
    Zap,
    StickyNote,
    PlusCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@smartclub/utils';

interface CreateBookingDialogProps {
    open: boolean;
    onClose: () => void;
    assetId?: string;
    assetName?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
}

export function CreateBookingDialog({
    open,
    onClose,
    assetId,
    assetName,
    date,
    startTime,
    endTime,
}: CreateBookingDialogProps) {
    const t = useTranslations('venue-admin.calendar');
    const createBooking = useCreateBooking();
    const { toast } = useToast();

    const form = useForm({
        defaultValues: {
            customerName: '',
            customerPhone: '',
            type: BookingType.SLOT_BASED,
            notes: '',
        },
    });

    const onSubmit = (data: any) => {
        if (!assetId || !date || !startTime) return;

        createBooking.mutate({
            assetId,
            date,
            startTime,
            endTime,
            type: data.type,
            notes: data.notes,
            participants: [{ name: data.customerName, phone: data.customerPhone, isHost: true }],
        }, {
            onSuccess: () => {
                toast({ title: t('toast.created') });
                form.reset();
                onClose();
            },
            onError: (error: any) => {
                toast({ title: t('toast.error'), description: error.message || t('toast.failedCreate'), variant: 'destructive' });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl overflow-hidden p-0 rounded-2xl border-none shadow-2xl max-h-[90vh]">
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 border-b relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 hidden sm:block">
                        <PlusCircle className="w-24 h-24" />
                    </div>
                    <DialogHeader className="p-0 relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-primary/20 p-1.5 rounded-lg">
                                <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('quickBooking')}</span>
                        </div>
                        <DialogTitle className="text-xl sm:text-2xl font-black text-foreground">{t('createBooking')}</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm font-medium text-muted-foreground/80">
                            {t('registrationDescription')}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-4 sm:p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50">
                            <Calendar className="w-4 h-4 text-primary/60 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">{t('date')}</p>
                                <p className="text-xs font-bold">{date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border/50">
                            <Clock className="w-4 h-4 text-primary/60 shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none mb-1">{t('schedule')}</p>
                                <p className="text-xs font-bold">{startTime} - {endTime}</p>
                            </div>
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-primary/5 border border-primary/20">
                            <Zap className="w-4 h-4 text-primary shrink-0" />
                            <div>
                                <p className="text-[10px] font-black uppercase text-primary/60 leading-none mb-1">{t('resource')}</p>
                                <p className="text-xs font-black text-primary">{assetName || t('standardAsset')}</p>
                            </div>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    rules={{ required: t('nameRequired') }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                <User className="w-3 h-3" />
                                                {t('customerName')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('searchOrEnterName')} {...field} className="rounded-xl bg-muted/20 border-border/50 h-11 focus:bg-background transition-all" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="customerPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                <Phone className="w-3 h-3" />
                                                {t('phoneNumber')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder={t('phonePlaceholder')} {...field} className="rounded-xl bg-muted/20 border-border/50 h-11 focus:bg-background transition-all" />
                                            </FormControl>
                                            <FormMessage className="text-[10px] font-bold" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t('bookingType')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-xl bg-muted/20 border-border/50 h-11">
                                                    <SelectValue placeholder={t('selectType')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value={BookingType.SLOT_BASED}>{t('slotBased')}</SelectItem>
                                                <SelectItem value={BookingType.DURATION_BASED}>{t('durationBased')}</SelectItem>
                                                <SelectItem value={BookingType.CAPACITY_BASED}>{t('capacityBased')}</SelectItem>
                                                <SelectItem value={BookingType.OPEN_SESSION}>{t('openSession')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            <StickyNote className="w-3 h-3" />
                                            {t('notes')}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('notesPlaceholder')}
                                                {...field}
                                                className="rounded-xl bg-muted/20 border-border/50 min-h-[100px] focus:bg-background transition-all resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4 border-t gap-2 sm:gap-3 flex-col-reverse sm:flex-row">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="rounded-xl px-6 font-black uppercase tracking-widest text-xs h-10 sm:h-12 w-full sm:w-auto"
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createBooking.isPending}
                                    className="rounded-xl px-6 sm:px-10 font-black uppercase tracking-widest text-xs h-10 sm:h-12 shadow-xl shadow-primary/20 w-full sm:w-auto"
                                >
                                    {createBooking.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                    )}
                                    {t('confirmBooking')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
