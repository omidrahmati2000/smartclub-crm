'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Textarea } from '@smartclub/ui/textarea';
import { Label } from '@smartclub/ui/label';

interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

export function AddNoteDialog({ open, onClose, onSubmit }: AddNoteDialogProps) {
  const t = useTranslations('venue-admin.customers.profile');
  const tc = useTranslations('venue-admin.common');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addNote')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-content">{t('noteContent')}</Label>
            <Textarea
              id="note-content"
              placeholder={t('notePlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {tc('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? tc('loading') : tc('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
