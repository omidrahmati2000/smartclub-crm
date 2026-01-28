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
import { Textarea } from '@smartclub/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { useToast } from '@smartclub/ui/use-toast';
import { VenueRole, StaffStatus, type StaffMember, type UpdateStaffDTO } from '@smartclub/types';
import { Loader2 } from 'lucide-react';

interface EditStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (staff: StaffMember) => void;
  staff: StaffMember;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  role: z.nativeEnum(VenueRole),
  status: z.nativeEnum(StaffStatus),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditStaffDialog({ open, onClose, onSuccess, staff }: EditStaffDialogProps) {
  const t = useTranslations('venue-admin.staff');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
      notes: staff.notes || '',
    },
  });

  // Update form when staff prop changes
  useEffect(() => {
    form.reset({
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
      notes: staff.notes || '',
    });
  }, [staff, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const dto: UpdateStaffDTO = {
        name: values.name,
        phone: values.phone,
        role: values.role,
        status: values.status,
        notes: values.notes,
      };

      const response = await fetch(`/api/staff/${staff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t('form.updated'),
          variant: 'default',
        });
        onSuccess(data.data);
      } else {
        throw new Error(data.error || 'Failed to update staff member');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('editStaff')}</DialogTitle>
          <DialogDescription>{t('form.title')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
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

              {/* Email (read-only) */}
              <FormItem>
                <FormLabel>{t('form.email')}</FormLabel>
                <FormControl>
                  <Input value={staff.email} disabled dir="ltr" />
                </FormControl>
              </FormItem>

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.phone')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.phonePlaceholder')}
                        {...field}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.role')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={VenueRole.OWNER}>
                          {t('roles.OWNER')}
                        </SelectItem>
                        <SelectItem value={VenueRole.MANAGER}>
                          {t('roles.MANAGER')}
                        </SelectItem>
                        <SelectItem value={VenueRole.RECEPTIONIST}>
                          {t('roles.RECEPTIONIST')}
                        </SelectItem>
                        <SelectItem value={VenueRole.CASHIER}>
                          {t('roles.CASHIER')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('table.status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={StaffStatus.ACTIVE}>
                          {t('status.ACTIVE')}
                        </SelectItem>
                        <SelectItem value={StaffStatus.INACTIVE}>
                          {t('status.INACTIVE')}
                        </SelectItem>
                        <SelectItem value={StaffStatus.INVITED}>
                          {t('status.INVITED')}
                        </SelectItem>
                        <SelectItem value={StaffStatus.SUSPENDED}>
                          {t('status.SUSPENDED')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role Description */}
            {form.watch('role') && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {t(`roleDescriptions.${form.watch('role').toUpperCase()}`)}
                </p>
              </div>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.notes')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('form.notesPlaceholder')}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 ltr:mr-2 rtl:ml-2 animate-spin" />}
                {isSubmitting ? t('form.updating') : t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
