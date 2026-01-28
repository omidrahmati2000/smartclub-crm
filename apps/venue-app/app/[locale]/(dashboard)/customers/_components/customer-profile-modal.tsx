'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@smartclub/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import type { CustomerProfile, CustomerTag } from '@smartclub/types';
import { CustomerStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { CustomerStats } from './customer-stats';
import { AddNoteDialog } from './add-note-dialog';
import { ChangeStatusDialog } from './change-status-dialog';
import { Mail, Phone, Calendar, Tag as TagIcon, Plus, X } from 'lucide-react';

interface CustomerProfileModalProps {
  customer: CustomerProfile;
  open: boolean;
  onClose: () => void;
  onUpdate: (customer: CustomerProfile) => void;
  availableTags: CustomerTag[];
  locale: string;
}

export function CustomerProfileModal({
  customer,
  open,
  onClose,
  onUpdate,
  availableTags,
  locale,
}: CustomerProfileModalProps) {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.customers');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);

  const user = session?.user as any;
  const canManage = user && hasPermission(user, Permission.CUSTOMER_MANAGE);

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE:
        return 'bg-blue-100 text-blue-800';
      case CustomerStatus.VIP:
        return 'bg-amber-100 text-amber-800';
      case CustomerStatus.REGULAR:
        return 'bg-green-100 text-green-800';
      case CustomerStatus.NEW:
        return 'bg-sky-100 text-sky-800';
      case CustomerStatus.BLACKLISTED:
        return 'bg-red-100 text-red-800';
      case CustomerStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return name.slice(0, 2);
  };

  const handleAddTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId }),
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.data);
      }
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/tags/${tagId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.data);
      }
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleAddNote = async (content: string) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.data);
        setIsAddNoteOpen(false);
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  };

  const handleChangeStatus = async (newStatus: CustomerStatus) => {
    try {
      const response = await fetch(`/api/customers/${customer.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        onUpdate(data.data);
        setIsChangeStatusOpen(false);
      }
    } catch (error) {
      console.error('Failed to change status:', error);
      throw error;
    }
  };

  const unassignedTags = availableTags.filter(
    (tag) => !customer.customerTags.some((ct) => ct.id === tag.id)
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('profile.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{customer.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="secondary"
                  className={cn('text-sm', getStatusColor(customer.status))}
                >
                  {t(`status.${customer.status}`)}
                </Badge>
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangeStatusOpen(true)}
                  >
                    {t('actions.changeStatus')}
                  </Button>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TagIcon className="h-4 w-4" />
                  {t('profile.tags')}
                </div>
                {canManage && unassignedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingTag(!isAddingTag)}
                  >
                    <Plus className="h-4 w-4 me-1" />
                    {t('tags.add')}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {customer.customerTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    style={{
                      borderColor: tag.color,
                      color: tag.color,
                    }}
                    className="gap-1"
                  >
                    {tag.label}
                    {canManage && (
                      <button
                        onClick={() => handleRemoveTag(tag.id)}
                        className="hover:bg-black/10 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {customer.customerTags.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    {t('tags.noTags')}
                  </span>
                )}
              </div>
              {isAddingTag && unassignedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-2 bg-muted rounded">
                  {unassignedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        handleAddTag(tag.id);
                        setIsAddingTag(false);
                      }}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">{t('profile.statistics')}</TabsTrigger>
                <TabsTrigger value="notes">{t('profile.notes')}</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                <CustomerStats customer={customer} locale={locale} />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t('profile.notes')}</h3>
                  {canManage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddNoteOpen(true)}
                    >
                      <Plus className="h-4 w-4 me-1" />
                      {t('profile.addNote')}
                    </Button>
                  )}
                </div>
                {customer.notes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t('profile.noNotes')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customer.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 border rounded-lg bg-muted/30"
                      >
                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{note.createdByName}</span>
                          <span>•</span>
                          <span>{new Date(note.createdAt).toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <AddNoteDialog
        open={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onSubmit={handleAddNote}
      />

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={isChangeStatusOpen}
        onClose={() => setIsChangeStatusOpen(false)}
        currentStatus={customer.status}
        onSubmit={handleChangeStatus}
      />
    </>
  );
}
