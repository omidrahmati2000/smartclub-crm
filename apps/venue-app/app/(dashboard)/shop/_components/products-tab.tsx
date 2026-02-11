'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, MoreVertical, Pencil, Trash2, Package } from 'lucide-react'
import type { Product, ProductCategory } from '@smartclub/types'
import {
    Button,
    Card,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    toast,
} from '@smartclub/ui'
import { apiClient } from '@/lib/api-client'
import { ProductDialog } from './product-dialog'

// API functions
async function fetchProducts(): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/products')
    if (!res.success) throw new Error(res.error || 'Failed to fetch products')
    return res.data || []
}

async function fetchCategories(): Promise<ProductCategory[]> {
    const res = await apiClient.get<ProductCategory[]>('/categories')
    if (!res.success) throw new Error(res.error || 'Failed to fetch categories')
    return res.data || []
}

async function createProduct(product: Partial<Product>): Promise<Product> {
    const res = await apiClient.post<Product>('/products', product)
    if (!res.success || !res.data) throw new Error(res.error || 'Failed to create product')
    return res.data
}

async function updateProduct(
    id: string,
    product: Partial<Product>
): Promise<Product> {
    const res = await apiClient.put<Product>(`/products/${id}`, product)
    if (!res.success || !res.data) throw new Error(res.error || 'Failed to update product')
    return res.data
}

async function deleteProduct(id: string): Promise<void> {
    const res = await apiClient.delete(`/products/${id}`)
    if (!res.success) throw new Error(res.error || 'Failed to delete product')
}

export function ProductsTab() {
    const t = useTranslations('venue-admin')
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    // Queries
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    })

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    })

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast({
                title: t('shop.products.form.created'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create product',
                variant: 'destructive',
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast({
                title: t('shop.products.form.updated'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update product',
                variant: 'destructive',
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast({
                title: t('shop.products.form.deleted'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to delete product',
                variant: 'destructive',
            })
        },
    })

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default">{t('shop.products.status.active')}</Badge>
            case 'inactive':
                return (
                    <Badge variant="secondary">{t('shop.products.status.inactive')}</Badge>
                )
            case 'out_of_stock':
                return (
                    <Badge variant="destructive">
                        {t('shop.products.status.out_of_stock')}
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleSave = async (productData: Partial<Product>) => {
        if (selectedProduct) {
            await updateMutation.mutateAsync({
                id: selectedProduct.id,
                data: productData,
            })
        } else {
            await createMutation.mutateAsync(productData)
        }
    }

    const handleAdd = () => {
        setSelectedProduct(null)
        setDialogOpen(true)
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setDialogOpen(true)
    }

    const handleDelete = async (product: Product) => {
        if (confirm(t('shop.products.actions.confirmDelete'))) {
            await deleteMutation.mutateAsync(product.id)
        }
    }

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || categoryId
    }

    if (isLoading) {
        return <div>Loading products...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('shop.products.search')}
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('shop.products.addProduct')}
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">
                                {t('shop.products.table.image')}
                            </TableHead>
                            <TableHead>{t('shop.products.table.name')}</TableHead>
                            <TableHead>{t('shop.products.table.sku')}</TableHead>
                            <TableHead>{t('shop.products.table.category')}</TableHead>
                            <TableHead className="text-right">
                                {t('shop.products.table.price')}
                            </TableHead>
                            <TableHead className="text-center">
                                {t('shop.products.table.stock')}
                            </TableHead>
                            <TableHead>{t('shop.products.table.status')}</TableHead>
                            <TableHead className="w-[70px]">
                                {t('shop.products.table.actions')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {t('shop.products.noProducts')}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-2xl">
                                            {product.image}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {product.price.toLocaleString()} AED
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.trackStock ? (
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
                                                {product.currentStock}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                N/A
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    {t('shop.products.actions.edit')}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(product)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {t('shop.products.actions.delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <div className="text-sm text-muted-foreground">
                {t('shop.products.showingResults', { count: filteredProducts.length })}
            </div>

            <ProductDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={selectedProduct}
                categories={categories}
                onSave={handleSave}
            />
        </div>
    )
}
