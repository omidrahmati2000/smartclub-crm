'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Crown,
    Check,
    Users,
    BarChart,
    Zap,
    ShieldCheck,
    Search,
    Settings,
    MoreHorizontal,
    Plus
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
    Avatar,
    AvatarFallback,
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'

// Mock Data
const PLANS = [
    {
        id: 'p1',
        name: 'Silver Member',
        price: 3500000,
        period: 'Quarterly',
        color: 'bg-slate-400',
        subscribers: 124,
        features: ['10% discount on bookings', 'Free water every visit', 'Priority standby']
    },
    {
        id: 'p2',
        name: 'Gold Elite',
        price: 12000000,
        period: 'Annual',
        color: 'bg-amber-400',
        subscribers: 45,
        features: ['25% discount on bookings', 'Free racket rental', 'Locker access', 'Valet included']
    },
    {
        id: 'p3',
        name: 'Founder / VIP',
        price: 50000000,
        period: 'Lifetime',
        color: 'bg-indigo-600',
        subscribers: 12,
        features: ['Fixed court priority', 'Private lounge access', 'Full VIP concierge', 'Family matching']
    },
]

const RECENT_SUBSCRIBERS = [
    { id: 's1', name: 'Ahmed Al Sharif', plan: 'Gold Elite', date: '2024-03-20', status: 'Active' },
    { id: 's2', name: 'Sara Abdullah', plan: 'Founder / VIP', date: '2024-03-18', status: 'Active' },
    { id: 's3', name: 'Rashid Kareem', plan: 'Silver Member', date: '2024-03-15', status: 'Pending Approval' },
    { id: 's4', name: 'Mariam Hassan', plan: 'Gold Elite', date: '2024-03-10', status: 'Expired' },
]

export default function MembershipsPage() {
    const t = useTranslations('venue-admin')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.memberships')}</h1>
                    <p className="text-muted-foreground">Manage tiered subscription plans and exclusive club benefits</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Benefit Rules
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Plan
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {PLANS.map(plan => (
                    <Card key={plan.id} className="relative overflow-hidden border-2 transition-all hover:shadow-2xl hover:scale-[1.02]">
                        <div className={cn("absolute top-0 left-0 h-2 w-full", plan.color)} />
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    <CardDescription>
                                        <span className="text-2xl font-bold text-foreground">{plan.price.toLocaleString()}</span>
                                        <span className="text-sm font-medium"> IRT / {plan.period}</span>
                                    </CardDescription>
                                </div>
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-white", plan.color)}>
                                    <Crown className="h-5 w-5" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {plan.subscribers} Active Members
                            </div>
                            <Separator />
                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">Edit Plan & Perks</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 shadow-xl border-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Subscriber Directory</CardTitle>
                                <CardDescription>Members currently on an active or pending plan</CardDescription>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search members..." className="pl-8" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Member</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Since</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {RECENT_SUBSCRIBERS.map(sub => (
                                    <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="text-[10px]">{sub.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-semibold">{sub.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-medium">{sub.plan}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{sub.date}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={sub.status === 'Active' ? 'default' : sub.status === 'Expired' ? 'destructive' : 'outline'}
                                                className={cn(sub.status === 'Active' && "bg-green-500/10 text-green-600 border-green-200")}
                                            >
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="shadow-xl border-2 bg-muted/20">
                    <CardHeader>
                        <CardTitle>Member Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <BarChart className="h-4 w-4" /> Revenue Contribution
                                </span>
                                <span className="font-bold">65%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Zap className="h-4 w-4" /> Retention Rate
                                </span>
                                <span className="font-bold">92%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '92%' }} />
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="rounded-xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center gap-2">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                                <p className="text-xs font-medium">Club Governance</p>
                                <p className="text-[10px] text-muted-foreground">VIP members have voting rights on new features and asset types.</p>
                                <Button variant="link" size="sm" className="h-auto p-0 text-xs">Manage Voting</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
