'use client';

import { useState, useEffect } from 'react';
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
import type { Coach } from '@smartclub/mock-data/src/fixtures/coaches';

interface EditCoachDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (coach: Coach) => void;
  coach: Coach;
}

export function EditCoachDialog({ open, onClose, onSuccess, coach }: EditCoachDialogProps) {
  const t = useTranslations('venue-admin.coaches');
  const tv = useTranslations('validation');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, tv('nameMin')),
    email: z.string().email(tv('emailInvalid')),
    phone: z.string().min(10, tv('phoneInvalid')),
    specialty: z.string().min(3, tv('specialtyRequired')),
    experience: z.string().min(1, tv('experienceRequired')),
    level: z.enum(['Elite', 'Head Coach', 'Advanced', 'Standard']),
    hourlyRate: z.number().min(0, tv('hourlyRatePositive')),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialty: coach.specialty,
      experience: coach.experience,
      level: coach.level,
      hourlyRate: coach.hourlyRate,
    },
  });

  useEffect(() => {
    if (open && coach) {
      form.reset({
        name: coach.name,
        email: coach.email,
        phone: coach.phone,
        specialty: coach.specialty,
        experience: coach.experience,
        level: coach.level,
        hourlyRate: coach.hourlyRate,
      });
    }
  }, [open, coach, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await apiClient.put<Coach>(`/coaches/${coach.id}`, values);

      if (result.success && result.data) {
        toast({ title: t('toast.updated') });
        onSuccess(result.data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to update coach');
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
          <DialogTitle>{t('editDialog.title')}</DialogTitle>
          <DialogDescription>{t('editDialog.description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.phonePlaceholder')} {...field} dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.specialty')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.specialtyPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.experience')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('form.experiencePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.level')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.selectLevel')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Elite">Elite</SelectItem>
                        <SelectItem value="Head Coach">Head Coach</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.hourlyRate')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t('form.hourlyRatePlaceholder')}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
