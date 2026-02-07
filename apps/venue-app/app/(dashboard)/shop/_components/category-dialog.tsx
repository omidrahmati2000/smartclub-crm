'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { ProductCategory } from '@smartclub/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Input,
    Label,
    Textarea,
} from '@smartclub/ui'

interface CategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: ProductCategory | null
    onSave: (category: Partial<ProductCategory>) => Promise<void>
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryDialogProps) {
    const t = useTranslations('venue-admin')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<ProductCategory>>({
        name: '',
        description: '',
    })

    useEffect(() => {
        if (category) {
            setFormData(category)
        } else {
            setFormData({
                name: '',
                description: '',
            })
        }
    }, [category, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSave(formData)
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to save category:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateField = (field: keyof ProductCategory, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {category
                            ? t('shop.categories.editCategory')
                            : t('shop.categories.addCategory')}
                    </DialogTitle>
                    <DialogDescription>
                        {category
                            ? 'Update category information'
                            : 'Add a new product category'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            {t('shop.categories.form.name')} *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder={t('shop.categories.form.namePlaceholder')}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t('shop.categories.form.description')}
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder={t('shop.categories.form.descriptionPlaceholder')}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {t('shop.categories.form.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? category
                                    ? 'Updating...'
                                    : 'Creating...'
                                : t('shop.categories.form.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
