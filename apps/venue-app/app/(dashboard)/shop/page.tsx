'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Package, Plus, Search } from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@smartclub/ui'

import { ProductsTab } from './_components/products-tab'
import { CategoriesTab } from './_components/categories-tab'
import { InventoryTab } from './_components/inventory-tab'
import { SalesTab } from './_components/sales-tab'
import { SettingsTab } from './_components/settings-tab'

export default function ShopManagementPage() {
    const t = useTranslations('venue-admin')

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('shop.title')}</h1>
                    <p className="text-muted-foreground">{t('shop.description')}</p>
                </div>
            </div>

            <Tabs defaultValue="products" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="products">{t('shop.tabs.products')}</TabsTrigger>
                    <TabsTrigger value="categories">{t('shop.tabs.categories')}</TabsTrigger>
                    <TabsTrigger value="inventory">{t('shop.tabs.inventory')}</TabsTrigger>
                    <TabsTrigger value="sales">{t('shop.tabs.sales')}</TabsTrigger>
                    <TabsTrigger value="settings">{t('shop.tabs.settings')}</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4">
                    <ProductsTab />
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <CategoriesTab />
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                    <InventoryTab />
                </TabsContent>

                <TabsContent value="sales" className="space-y-4">
                    <SalesTab />
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <SettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
