'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, FolderOpen, Pencil, Trash2, MoreVertical } from 'lucide-react'
import type { ProductCategory } from '@smartclub/types'
import {
    Button,
    Card,
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
import { CategoryDialog } from './category-dialog'

// API functions
async function fetchCategories(): Promise<ProductCategory[]> {
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
}

async function createCategory(category: Partial<ProductCategory>): Promise<ProductCategory> {
    const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    })
    if (!res.ok) throw new Error('Failed to create category')
    return res.json()
}

async function updateCategory(
    id: string,
    category: Partial<ProductCategory>
): Promise<ProductCategory> {
    const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    })
    if (!res.ok) throw new Error('Failed to update category')
    return res.json()
}

async function deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete category')
    }
}

export function CategoriesTab() {
    const t = useTranslations('venue-admin')
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    })

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast({
                title: t('shop.categories.form.created'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to create category',
                variant: 'destructive',
            })
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            toast({
                title: t('shop.categories.form.updated'),
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Failed to update category',
                variant: 'destructive',
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast({
                title: t('shop.categories.form.deleted'),
            })
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete category',
                variant: 'destructive',
            })
        },
    })

    const handleSave = async (categoryData: Partial<ProductCategory>) => {
        if (selectedCategory) {
            await updateMutation.mutateAsync({
                id: selectedCategory.id,
                data: categoryData,
            })
        } else {
            await createMutation.mutateAsync(categoryData)
        }
    }

    const handleAdd = () => {
        setSelectedCategory(null)
        setDialogOpen(true)
    }

    const handleEdit = (category: ProductCategory) => {
        setSelectedCategory(category)
        setDialogOpen(true)
    }

    const handleDelete = async (category: ProductCategory) => {
        if (category.productCount > 0) {
            toast({
                title: 'Cannot Delete',
                description: 'This category has products. Please move or delete them first.',
                variant: 'destructive',
            })
            return
        }

        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
            await deleteMutation.mutateAsync(category.id)
        }
    }

    if (isLoading) {
        return <div>Loading categories...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('shop.categories.title')}</h2>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('shop.categories.addCategory')}
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('shop.categories.table.name')}</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">
                                {t('shop.categories.table.productCount')}
                            </TableHead>
                            <TableHead>{t('shop.categories.table.status')}</TableHead>
                            <TableHead className="w-[100px]">
                                {t('shop.categories.table.actions')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {t('shop.categories.noCategories')}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {category.description || '-'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline">{category.productCount}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="default">Active</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(category)}
                                                    disabled={category.productCount > 0}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
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

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={selectedCategory}
                onSave={handleSave}
            />
        </div>
    )
}
