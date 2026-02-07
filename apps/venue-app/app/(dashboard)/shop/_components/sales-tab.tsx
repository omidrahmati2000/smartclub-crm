'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react'
import type { SalesReport } from '@smartclub/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@smartclub/ui'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

// API function
async function fetchSalesReport(days: number): Promise<SalesReport> {
    const res = await fetch(`/api/sales/report?days=${days}`)
    if (!res.ok) throw new Error('Failed to fetch sales report')
    return res.json()
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function SalesTab() {
    const t = useTranslations('venue-admin')
    const [period, setPeriod] = useState('30')

    const { data: report, isLoading } = useQuery({
        queryKey: ['sales-report', period],
        queryFn: () => fetchSalesReport(parseInt(period)),
    })

    if (isLoading) {
        return <div>Loading sales report...</div>
    }

    if (!report) {
        return <div>No data available</div>
    }

    // Prepare chart data
    const topProductsData = report.topProducts.slice(0, 5).map((p) => ({
        name: p.productName.length > 15 ? p.productName.substring(0, 15) + '...' : p.productName,
        revenue: p.revenue,
        quantity: p.quantity,
    }))

    const categoryData = report.salesByCategory.map((c) => ({
        name: c.categoryName,
        value: c.revenue,
    }))

    const trendData = report.salesTrend.slice(-14).map((d) => ({
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: d.revenue,
        orders: d.orders,
    }))

    return (
        <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t('shop.sales.title')}</h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {t('shop.sales.period')}:
                    </span>
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('shop.sales.totalSales')}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.totalSales.toLocaleString()} AED
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {period === '7' ? 'This week' : period === '30' ? 'This month' : 'Last 3 months'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('shop.sales.totalOrders')}
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{report.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            {period === '7' ? 'This week' : period === '30' ? 'This month' : 'Last 3 months'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t('shop.sales.averageOrderValue')}
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {report.averageOrderValue.toFixed(0)} AED
                        </div>
                        <p className="text-xs text-muted-foreground">Average per order</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('shop.sales.salesTrend')}</CardTitle>
                    <CardDescription>Daily revenue and order count</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                                <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    name="Revenue (AED)"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                    name="Orders"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Top Products Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('shop.sales.topProducts')}</CardTitle>
                        <CardDescription>Top 5 best-selling products</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProductsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        style={{ fontSize: '11px' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue (AED)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales by Category Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('shop.sales.salesByCategory')}</CardTitle>
                        <CardDescription>Revenue distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Products</CardTitle>
                    <CardDescription>Best-selling products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {report.topProducts.slice(0, 10).map((product, index) => (
                            <div
                                key={product.productId}
                                className="flex items-center justify-between border-b pb-2 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium">{product.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.quantity} units sold
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">
                                        {product.revenue.toLocaleString()} AED
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
