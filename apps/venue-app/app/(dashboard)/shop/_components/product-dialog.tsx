'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Product, ProductCategory } from '@smartclub/types'
import { ProductStatus } from '@smartclub/types'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
} from '@smartclub/ui'

interface ProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: Product | null
    categories: ProductCategory[]
    onSave: (product: Partial<Product>) => Promise<void>
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
    categories,
    onSave,
}: ProductDialogProps) {
    const t = useTranslations('venue-admin')
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        sku: '',
        description: '',
        categoryId: '',
        price: 0,
        costPrice: 0,
        image: '',
        trackStock: true,
        currentStock: 0,
        lowStockThreshold: 10,
        status: ProductStatus.ACTIVE,
    })

    // Reset form when product changes or dialog opens
    useEffect(() => {
        if (product) {
            setFormData(product)
        } else {
            setFormData({
                name: '',
                sku: '',
                description: '',
                categoryId: categories[0]?.id || '',
                price: 0,
                costPrice: 0,
                image: '',
                trackStock: true,
                currentStock: 0,
                lowStockThreshold: 10,
                status: ProductStatus.ACTIVE,
            })
        }
    }, [product, open, categories])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSave(formData)
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to save product:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateField = (field: keyof Product, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product
                            ? t('shop.products.editProduct')
                            : t('shop.products.addProduct')}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Update product information'
                            : 'Add a new product to your shop'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            {t('shop.products.form.basicInfo')}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    {t('shop.products.form.name')} *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder={t('shop.products.form.namePlaceholder')}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku">
                                    {t('shop.products.form.sku')} *
                                </Label>
                                <Input
                                    id="sku"
                                    value={formData.sku}
                                    onChange={(e) => updateField('sku', e.target.value)}
                                    placeholder={t('shop.products.form.skuPlaceholder')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                {t('shop.products.form.description')}
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) =>
                                    updateField('description', e.target.value)
                                }
                                placeholder={t('shop.products.form.descriptionPlaceholder')}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">
                                {t('shop.products.form.category')} *
                            </Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(value) => updateField('categoryId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t('shop.products.form.selectCategory')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            {t('shop.products.form.pricing')}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    {t('shop.products.form.price')} (AED) *
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        updateField('price', parseFloat(e.target.value) || 0)
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="costPrice">
                                    {t('shop.products.form.costPrice')} (AED)
                                </Label>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.costPrice || 0}
                                    onChange={(e) =>
                                        updateField('costPrice', parseFloat(e.target.value) || 0)
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {t('shop.products.form.costPriceHelp')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            {t('shop.products.form.inventory')}
                        </h3>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{t('shop.products.form.trackStock')}</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable inventory tracking for this product
                                </p>
                            </div>
                            <Switch
                                checked={formData.trackStock}
                                onCheckedChange={(checked) =>
                                    updateField('trackStock', checked)
                                }
                            />
                        </div>

                        {formData.trackStock && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentStock">
                                        {t('shop.products.form.currentStock')}
                                    </Label>
                                    <Input
                                        id="currentStock"
                                        type="number"
                                        min="0"
                                        value={formData.currentStock || 0}
                                        onChange={(e) =>
                                            updateField(
                                                'currentStock',
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lowStockThreshold">
                                        {t('shop.products.form.lowStockThreshold')}
                                    </Label>
                                    <Input
                                        id="lowStockThreshold"
                                        type="number"
                                        min="0"
                                        value={formData.lowStockThreshold || 0}
                                        onChange={(e) =>
                                            updateField(
                                                'lowStockThreshold',
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {t('shop.products.form.lowStockHelp')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            {t('shop.products.form.image')}
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="image">
                                {t('shop.products.form.imageUrl')}
                            </Label>
                            <Input
                                id="image"
                                value={formData.image || ''}
                                onChange={(e) => updateField('image', e.target.value)}
                                placeholder={t('shop.products.form.imageUrlPlaceholder')}
                            />
                            {formData.image && (
                                <div className="flex items-center justify-center w-20 h-20 rounded-md bg-muted text-3xl">
                                    {formData.image}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {t('shop.products.form.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? product
                                    ? t('shop.products.form.updating')
                                    : t('shop.products.form.creating')
                                : t('shop.products.form.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
