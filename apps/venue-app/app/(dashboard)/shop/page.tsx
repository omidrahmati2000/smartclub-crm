'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Search,
    ShoppingBag,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    User,
    ChevronRight,
    Filter
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
    ScrollArea,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'

// Mock Data
const CATEGORIES = [
    { id: 'all', label: 'All Items' },
    { id: 'drinks', label: 'Beverages' },
    { id: 'food', label: 'Snacks & Food' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'rental', label: 'Rentals' },
]

const PRODUCTS = [
    { id: 'p1', name: 'Espresso', price: 150000, category: 'drinks', image: '☕' },
    { id: 'p2', name: 'Water (500ml)', price: 50000, category: 'drinks', image: '💧' },
    { id: 'p3', name: 'Energy Drink', price: 120000, category: 'drinks', image: '⚡' },
    { id: 'p4', name: 'Protein Bar', price: 95000, category: 'food', image: '🍫' },
    { id: 'p5', name: 'Sandwich', price: 280000, category: 'food', image: '🥪' },
    { id: 'p6', name: 'Padel Balls (3-pack)', price: 450000, category: 'equipment', image: '🎾' },
    { id: 'p7', name: 'Overgrip', price: 85000, category: 'equipment', image: '🎾' },
    { id: 'p8', name: 'Racket Rental - Pro', price: 350000, category: 'rental', image: '🏓' },
    { id: 'p9', name: 'Racket Rental - Basic', price: 200000, category: 'rental', image: '🏓' },
    { id: 'p10', name: 'Smoothie', price: 180000, category: 'drinks', image: '🍹' },
]

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

export default function ShopPage() {
    const t = useTranslations('venue-admin')
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [cart, setCart] = useState<CartItem[]>([])

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const addToCart = (product: typeof PRODUCTS[0]) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
        })
    }

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden">
            {/* Left Side: Product Selection */}
            <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.shop')}</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
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

                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
                    <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 p-1">
                        {CATEGORIES.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id} className="min-w-[100px]">
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <ScrollArea className="flex-1 pr-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map(product => (
                            <Card
                                key={product.id}
                                className="group cursor-pointer overflow-hidden border-2 transition-all hover:border-primary hover:shadow-xl active:scale-95"
                                onClick={() => addToCart(product)}
                            >
                                <div className="flex h-32 items-center justify-center bg-muted/30 text-5xl transition-transform group-hover:scale-110">
                                    {product.image}
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base">{product.name}</CardTitle>
                                    <CardDescription className="font-mono text-primary">
                                        {product.price.toLocaleString()} IRT
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="p-4 pt-0">
                                    <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Plus className="h-4 w-4" />
                                        Add to Order
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Side: Cart / Checkout */}
            <div className="flex w-96 flex-col overflow-hidden rounded-2xl border-2 bg-background shadow-2xl">
                <div className="bg-primary/5 p-6 border-b-2">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold">Current Order</h2>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <Badge variant="outline" className="px-3 py-1">
                            Table #12
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={() => setCart([])}>
                            <Trash2 className="h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                            <div className="rounded-full bg-muted p-6">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Your order is empty</p>
                                <p className="text-sm text-muted-foreground/60">Add products from the menu to start</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="group relative flex items-center justify-between space-x-3 rounded-lg border p-3 hover:bg-muted/30">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{(item.price * item.quantity).toLocaleString()} IRT</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-md hover:bg-background"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-background transition-colors"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="border-t-2 bg-muted/10 p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{(total * 1.0).toLocaleString()} IRT</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (0%)</span>
                            <span>0 IRT</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">{total.toLocaleString()} IRT</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="gap-2 border-2 h-12">
                            <Banknote className="h-4 w-4" />
                            Cash
                        </Button>
                        <Button className="gap-2 h-12">
                            <CreditCard className="h-4 w-4" />
                            Card
                        </Button>
                    </div>

                    <Button variant="secondary" className="w-full gap-2 border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 h-12 text-primary font-bold">
                        <User className="h-4 w-4" />
                        Charge to Customer Wallet
                    </Button>

                    <Button className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 group" disabled={cart.length === 0}>
                        Complete Payment
                        <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
