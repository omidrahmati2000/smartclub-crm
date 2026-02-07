'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import type { Product } from '@smartclub/types'
import { StockAdjustmentType } from '@smartclub/types'
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
    Badge,
} from '@smartclub/ui'

interface StockAdjustmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product | null
    onSave: (adjustment: {
        type: StockAdjustmentType
        quantity: number
        reason?: string
    }) => Promise<void>
}

export function StockAdjustmentDialog({
    open,
    onOpenChange,
    product,
    onSave,
}: StockAdjustmentDialogProps) {
    const t = useTranslations('venue-admin')
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState<StockAdjustmentType>(StockAdjustmentType.INCREASE)
    const [quantity, setQuantity] = useState(1)
    const [reason, setReason] = useState('')

    useEffect(() => {
        if (open) {
            setType(StockAdjustmentType.INCREASE)
            setQuantity(1)
            setReason('')
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSave({ type, quantity, reason })
            onOpenChange(false)
        } catch (error) {
            console.error('Failed to adjust stock:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateNewStock = () => {
        const current = product?.currentStock || 0
        switch (type) {
            case StockAdjustmentType.INCREASE:
                return current + quantity
            case StockAdjustmentType.DECREASE:
                return Math.max(0, current - quantity)
            case StockAdjustmentType.SET:
                return quantity
            default:
                return current
        }
    }

    if (!product) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('shop.inventory.adjustment.title')}</DialogTitle>
                    <DialogDescription>
                        Adjust stock level for {product.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {t('shop.inventory.adjustment.product')}:
                            </span>
                            <span className="font-bold">{product.name}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {t('shop.inventory.adjustment.currentStock')}:
                            </span>
                            <Badge variant="outline">{product.currentStock || 0}</Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">
                            {t('shop.inventory.adjustment.adjustmentType')}
                        </Label>
                        <Select
                            value={type}
                            onValueChange={(value) => setType(value as StockAdjustmentType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={StockAdjustmentType.INCREASE}>
                                    {t('shop.inventory.adjustment.increase')} (+)
                                </SelectItem>
                                <SelectItem value={StockAdjustmentType.DECREASE}>
                                    {t('shop.inventory.adjustment.decrease')} (-)
                                </SelectItem>
                                <SelectItem value={StockAdjustmentType.SET}>
                                    Set Exact Amount
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            {t('shop.inventory.adjustment.adjustment')}
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            required
                        />
                    </div>

                    <div className="rounded-lg bg-primary/5 p-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {t('shop.inventory.adjustment.newStock')}:
                            </span>
                            <Badge variant="default" className="text-base">
                                {calculateNewStock()}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">
                            {t('shop.inventory.adjustment.reason')} (Optional)
                        </Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={t('shop.inventory.adjustment.reasonPlaceholder')}
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
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading
                                ? 'Adjusting...'
                                : t('shop.inventory.adjustment.submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
