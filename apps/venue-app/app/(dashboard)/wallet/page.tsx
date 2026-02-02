'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    CreditCard,
    Search,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    Filter,
    MoreVertical,
    PlusCircle,
    Wallet
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
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
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@smartclub/ui'

// Mock Data
const WALLET_DATA = [
    {
        id: 'u1',
        name: 'Ahmed Al Sharif',
        email: 'ahmed@example.com',
        balance: 2500000,
        lastTransaction: '2024-03-20',
        status: 'active',
        avatar: 'AS'
    },
    {
        id: 'u2',
        name: 'Sara Abdullah',
        email: 'sara@example.com',
        balance: 12000000,
        lastTransaction: '2024-03-21',
        status: 'vip',
        avatar: 'SA'
    },
    {
        id: 'u3',
        name: 'Rashid Kareem',
        email: 'rashid@example.com',
        balance: 450000,
        lastTransaction: '2024-03-18',
        status: 'active',
        avatar: 'RK'
    },
    {
        id: 'u4',
        name: 'Mariam Hassan',
        email: 'mariam@example.com',
        balance: 0,
        lastTransaction: '2024-03-10',
        status: 'inactive',
        avatar: 'MH'
    },
    {
        id: 'u5',
        name: 'Hussein Al Rashid',
        email: 'hussein@example.com',
        balance: 1500000,
        lastTransaction: '2024-03-22',
        status: 'active',
        avatar: 'HR'
    },
]

export default function WalletPage() {
    const t = useTranslations('venue-admin')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredData = WALLET_DATA.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.wallet')}</h1>
                    <p className="text-muted-foreground">Manage customer balances and prepaid credits</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Transaction
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <History className="h-4 w-4" />
                        Transaction Logs
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-80">Total Outstanding Balance</CardTitle>
                        <Wallet className="h-4 w-4 opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">16,450,000 IRT</div>
                        <p className="text-xs opacity-60">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Top-ups</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,200,000 IRT</div>
                        <p className="text-xs text-muted-foreground">24 individual top-ups</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4,150,000 IRT</div>
                        <p className="text-xs text-muted-foreground">Used for bookings & cafe</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-muted-foreground">Across all customer tiers</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 shadow-xl">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Customer Wallet Balances</CardTitle>
                            <CardDescription>View and manage individual customer credits</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customer or email..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[300px]">Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="border-2 border-background shadow-sm">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {user.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'vip' ? 'default' : user.status === 'active' ? 'secondary' : 'outline'}
                                            className={cn(
                                                user.status === 'vip' && "bg-amber-500 text-white border-none shadow-sm",
                                                "capitalize"
                                            )}
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.lastTransaction}
                                    </TableCell>
                                    <TableCell className="text-right font-mono font-bold">
                                        <span className={cn(
                                            user.balance > 5000000 ? "text-green-600" : user.balance === 0 ? "text-destructive" : ""
                                        )}>
                                            {user.balance.toLocaleString()} IRT
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2">
                                                    <Plus className="h-4 w-4" /> Top up
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <History className="h-4 w-4" /> History
                                                </DropdownMenuItem>
                                                <Separator className="my-1" />
                                                <DropdownMenuItem className="text-destructive gap-2">
                                                    <Trash2 className="h-4 w-4" /> Clear Balance
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

function Trash2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}
