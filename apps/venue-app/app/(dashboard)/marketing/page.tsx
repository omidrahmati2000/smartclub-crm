'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Percent,
    MessageCircle,
    Ticket,
    Search,
    Plus,
    Send,
    Users,
    Copy,
    CalendarClock
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Badge,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea
} from '@smartclub/ui'

// Mock Data
const VOUCHERS = [
    { code: 'SUMMER20', type: 'Percentage', value: '20%', uses: '124/500', status: 'active', expires: '2024-08-31' },
    { code: 'WELCOME10', type: 'Fixed Amount', value: '100,000 IRT', uses: '45/1000', status: 'active', expires: 'No Expiry' },
    { code: 'VIPFREE', type: 'Free Service', value: '1 Free Booking', uses: '12/50', status: 'expired', expires: '2024-01-01' },
]

export default function MarketingPage() {
    const t = useTranslations('venue-admin')

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.marketing')}</h1>
                    <p className="text-muted-foreground">Manage discounts, vouchers, and customer communication</p>
                </div>
            </div>

            <Tabs defaultValue="vouchers" className="w-full">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="vouchers" className="gap-2">
                        <Ticket className="h-4 w-4" />
                        Vouchers & Coupons
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Campaigns
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="vouchers" className="mt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search coupons..." className="pl-8" />
                        </div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Create Voucher
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Usage</TableHead>
                                        <TableHead>Expiry</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {VOUCHERS.map((v, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-mono font-bold">
                                                <div className="flex items-center gap-2">
                                                    {v.code}
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>{v.value}</TableCell>
                                            <TableCell>{v.uses}</TableCell>
                                            <TableCell>{v.expires}</TableCell>
                                            <TableCell>
                                                <Badge variant={v.status === 'active' ? 'default' : 'secondary'}>{v.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="whatsapp" className="mt-6 grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Bulk Message</CardTitle>
                            <CardDescription>Send notifications or offers to customer segments via WhatsApp API</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Audience</label>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">All Members</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">VIP Only</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">Inactive (30d)</Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message Body</label>
                                <Textarea placeholder="Type your message here..." className="h-32" />
                                <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                <CalendarClock className="h-3 w-3" /> Scheduled: Immediately
                            </div>
                            <Button className="gap-2">
                                <Send className="h-4 w-4" /> Send Campaign
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-6">
                        <Card className="bg-green-500/10 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-green-700 flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" /> WhatsApp API Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-bold text-green-700">Connected</span>
                                </div>
                                <p className="text-sm text-green-600 mt-2">1,500 messages quota remaining today.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Campaigns</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-medium">Summer Promo Blast</p>
                                                <p className="text-xs text-muted-foreground">Sent to 450 users • 2 days ago</p>
                                            </div>
                                            <Badge variant="outline">Delivered</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
