'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@smartclub/ui/form';
import { Input } from '@smartclub/ui/input';
import { Textarea } from '@smartclub/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { useToast } from '@smartclub/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { Coach, CoachSessionFixture } from '@smartclub/mock-data/src/fixtures/coaches';

interface AddSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (session: CoachSessionFixture) => void;
  coaches: Coach[];
  venueId: string;
}

export function AddSessionDialog({ open, onClose, onSuccess, coaches, venueId }: AddSessionDialogProps) {
  const t = useTranslations('venue-admin.coaches');
  const tv = useTranslations('validation');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    coachId: z.string().min(1, tv('required')),
    type: z.enum(['private', 'group', 'class']),
    title: z.string().min(3, tv('titleMin')),
    description: z.string().optional(),
    maxStudents: z.number().min(1).max(50),
    price: z.number().min(0),
    startTime: z.string().min(1, tv('timeRequired')),
    endTime: z.string().min(1, tv('timeRequired')),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coachId: '',
      type: 'group',
      title: '',
      description: '',
      maxStudents: 8,
      price: 200,
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        currency: 'AED',
      };

      const result = await apiClient.post<CoachSessionFixture>(`/venues/${venueId}/coach-sessions`, payload);

      if (result.success && result.data) {
        toast({ title: t('toast.sessionCreated') });
        onSuccess(result.data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to create session');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : t('toast.error'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('addSession.title')}</DialogTitle>
          <DialogDescription>{t('addSession.description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coachId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.coach')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('addSession.selectCoach')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coaches.map((coach) => (
                          <SelectItem key={coach.id} value={coach.id}>
                            {coach.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.type')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('addSession.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">{t('classes.type.private')}</SelectItem>
                        <SelectItem value="group">{t('classes.type.group')}</SelectItem>
                        <SelectItem value="class">{t('classes.type.class')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('addSession.sessionTitle')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('addSession.sessionTitlePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('addSession.sessionDescription')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('addSession.sessionDescriptionPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.maxStudents')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.price')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.startTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('addSession.endTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t('actions.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('addSession.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
