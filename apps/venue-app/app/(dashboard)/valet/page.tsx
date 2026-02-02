'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Car,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    MapPin,
    User,
    Plus,
    Key,
    ArrowRight
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
    ScrollArea,
    Separator,
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'

// Mock Data
const VALET_CARS = [
    { id: 'v1', plate: '12345-DXB', owner: 'Ahmed Al Sharif', status: 'parked', location: 'A-12', timeIn: '14:20', type: 'Range Rover (Black)' },
    { id: 'v2', plate: '99882-DXB', owner: 'Sara Abdullah', status: 'requested', location: 'B-04', timeIn: '15:10', type: 'Tesla Model 3 (White)' },
    { id: 'v3', plate: '44521-SHJ', owner: 'Rashid Kareem', status: 'parked', location: 'A-02', timeIn: '13:45', type: 'Porsche 911 (Grey)' },
    { id: 'v4', plate: '77610-AD', owner: 'Mariam Hassan', status: 'delivered', location: '-', timeIn: '12:00', type: 'Mercedes G-Class (White)' },
]

export default function ValetPage() {
    const t = useTranslations('venue-admin')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCars = VALET_CARS.filter(c =>
        c.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'parked': return 'bg-blue-500/10 text-blue-600 border-blue-200'
            case 'requested': return 'bg-amber-500/10 text-amber-600 border-amber-200 animate-pulse'
            case 'delivered': return 'bg-green-500/10 text-green-600 border-green-200'
            default: return 'bg-muted text-muted-foreground'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.valet')}</h1>
                    <p className="text-muted-foreground">Digital valet management and vehicle tracking</p>
                </div>
                <Button className="h-12 px-6 gap-2 text-lg shadow-lg shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    Check-in New Vehicle
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Currently Parked</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12 Vehicles</div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-amber-600">Retrieval Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">2 Pending</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Free Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">18 Available</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by license plate or owner name..."
                        className="pl-10 h-12 text-lg border-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 px-4 gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCars.map(car => (
                    <Card key={car.id} className={cn(
                        "group relative overflow-hidden border-2 transition-all hover:shadow-xl",
                        car.status === 'requested' ? "border-amber-400 bg-amber-50/50 shadow-amber-100" : "hover:border-primary"
                    )}>
                        <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y--8 opacity-5 transition-transform group-hover:scale-110">
                            <Car className="h-full w-full" />
                        </div>

                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className={cn("px-2 py-1 uppercase font-mono text-sm border-2", getStatusColor(car.status))}>
                                    {car.status}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    In: {car.timeIn}
                                </div>
                            </div>
                            <CardTitle className="mt-4 flex items-center justify-between">
                                <span className="text-2xl font-black tracking-tighter">{car.plate}</span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Key className="h-5 w-5" />
                                </div>
                            </CardTitle>
                            <CardDescription className="text-base font-medium text-foreground/80">
                                {car.type}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Separator />
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-semibold">{car.owner}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <span>Parking Slot: <span className="font-bold">{car.location}</span></span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2 p-6 bg-muted/30">
                            {car.status === 'parked' ? (
                                <Button variant="outline" className="w-full gap-2 border-2 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
                                    Request Retrieval
                                </Button>
                            ) : car.status === 'requested' ? (
                                <Button className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white border-none h-12 text-lg font-bold">
                                    Confirm Delivery
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            ) : (
                                <Button variant="ghost" className="w-full text-muted-foreground cursor-default" disabled>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Already Delivered
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
