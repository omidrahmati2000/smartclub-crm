'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Package, TrendingUp, Edit } from 'lucide-react'
import type { Product } from '@smartclub/types'
import { StockAdjustmentType } from '@smartclub/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    toast,
} from '@smartclub/ui'
import { apiClient } from '@/lib/api-client'
import { StockAdjustmentDialog } from './stock-adjustment-dialog'

// API functions
async function fetchProducts(): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/products')
    if (!res.success) throw new Error(res.error || 'Failed to fetch products')
    return res.data || []
}

async function fetchLowStockProducts(): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/products/low-stock')
    if (!res.success) throw new Error(res.error || 'Failed to fetch low stock products')
    return res.data || []
}

async function fetchOutOfStockProducts(): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/products/out-of-stock')
    if (!res.success) throw new Error(res.error || 'Failed to fetch out of stock products')
    return res.data || []
}

async function adjustStock(
    productId: string,
    adjustment: { type: StockAdjustmentType; quantity: number; reason?: string }
): Promise<void> {
    const res = await apiClient.post(`/products/${productId}/adjust-stock`, {
        ...adjustment,
        createdBy: 'current-user', // TODO: Get from session
    })
    if (!res.success) throw new Error(res.error || 'Failed to adjust stock')
}

export function InventoryTab() {
    const t = useTranslations('venue-admin')
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    })

    const { data: lowStockProducts = [] } = useQuery({
        queryKey: ['low-stock-products'],
        queryFn: fetchLowStockProducts,
    })

    const { data: outOfStockProducts = [] } = useQuery({
        queryKey: ['out-of-stock-products'],
        queryFn: fetchOutOfStockProducts,
    })

    const adjustMutation = useMutation({
        mutationFn: ({ productId, adjustment }: {
            productId: string
            adjustment: { type: StockAdjustmentType; quantity: number; reason?: string }
        }) => adjustStock(productId, adjustment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['low-stock-products'] })
            queryClient.invalidateQueries({ queryKey: ['out-of-stock-products'] })
            toast({
                title: t('shop.inventory.adjustment.success'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to adjust stock',
                variant: 'destructive',
            })
        },
    })

    const totalStockValue = products.reduce((sum, p) => {
        if (p.trackStock && p.currentStock && p.costPrice) {
            return sum + p.currentStock * p.costPrice
        }
        return sum
    }, 0)

    const handleAdjustStock = (product: Product) => {
        setSelectedProduct(product)
        setDialogOpen(true)
    }

    const handleSaveAdjustment = async (adjustment: {
        type: StockAdjustmentType
        quantity: number
        reason?: string
    }) => {
        if (selectedProduct) {
            await adjustMutation.mutateAsync({
                productId: selectedProduct.id,
                adjustment,
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('shop.inventory.lowStock')}
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Products need restocking
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('shop.inventory.outOfStock')}
                        </CardTitle>
                        <Package className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{outOfStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">Products out of stock</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalStockValue.toLocaleString()} AED
                        </div>
                        <p className="text-xs text-muted-foreground">Across all products</p>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Products */}
            {lowStockProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Low Stock Alert
                        </CardTitle>
                        <CardDescription>
                            Products below minimum stock threshold
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-center">Current Stock</TableHead>
                                    <TableHead className="text-center">Threshold</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowStockProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-lg">
                                                    {product.image}
                                                </div>
                                                {product.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {product.sku}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="secondary">
                                                {product.currentStock}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">
                                                {product.lowStockThreshold}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAdjustStock(product)}
                                            >
                                                <Edit className="mr-1 h-3 w-3" />
                                                Adjust
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Out of Stock Products */}
            {outOfStockProducts.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <Package className="h-5 w-5" />
                            Out of Stock
                        </CardTitle>
                        <CardDescription>Products with zero inventory</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {outOfStockProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-lg">
                                                    {product.image}
                                                </div>
                                                {product.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {product.sku}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => handleAdjustStock(product)}
                                            >
                                                <Edit className="mr-1 h-3 w-3" />
                                                Restock
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* All Products Inventory */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('shop.inventory.title')}</CardTitle>
                    <CardDescription>Complete inventory list</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-center">Stock</TableHead>
                                <TableHead className="text-right">Value (AED)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products
                                .filter((p) => p.trackStock)
                                .map((product) => {
                                    const stockValue =
                                        (product.currentStock || 0) * (product.costPrice || 0)
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-lg">
                                                        {product.image}
                                                    </div>
                                                    {product.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {product.sku}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        product.currentStock === 0
                                                            ? 'destructive'
                                                            : (product.currentStock || 0) <
                                                                (product.lowStockThreshold || 0)
                                                                ? 'secondary'
                                                                : 'outline'
                                                    }
                                                >
                                                    {product.currentStock || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {stockValue.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAdjustStock(product)}
                                                >
                                                    <Edit className="mr-1 h-3 w-3" />
                                                    Adjust
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <StockAdjustmentDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                onSave={handleSaveAdjustment}
            />
        </div>
    )
}
