'use client'

import { useTranslations } from 'next-intl'
import { Trophy, MapPin, Calendar, Users, Filter, Search } from 'lucide-react'
import {
    Button,
    Input,
    Card,
    CardContent,
    CardFooter,
    Badge,
    Tabs,
    TabsList,
    TabsTrigger
} from '@smartclub/ui'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { localizedFetch } from '@smartclub/utils'

export default function TournamentsDiscoveryPage() {
    const t = useTranslations('tournament.discovery')
    const st = useTranslations('tournament.status')
    const ft = useTranslations('tournament.formats')

    const [tournaments, setTournaments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const res = await localizedFetch('/api/tournaments')
                const result = await res.json()
                if (result.success) {
                    setTournaments(result.data)
                }
            } catch (error) {
                console.error('Failed to fetch tournaments:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTournaments()
    }, [])

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4 animate-pulse">
                <div className="h-10 w-64 bg-muted rounded mb-4" />
                <div className="h-24 w-full bg-muted rounded mb-12" />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-[400px] bg-muted rounded" />
                    ))}
                </div>
            </div>
        )
    }

    const formatPrice = (p: any) => {
        if (typeof p === 'number') return `${p.toLocaleString()} ${t('currency' as any) || 'IRT'}`;
        return p || t('free' as any);
    }


    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <Badge variant="outline" className="mb-4 border-primary text-primary font-bold">
                        PRO COMPETITIONS
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10 h-11" placeholder={t('search')} />
                    </div>
                    <Button variant="outline" size="icon" className="h-11 w-11">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="mb-8" onValueChange={setFilter}>
                <TabsList className="bg-muted/50 p-1 h-11">
                    <TabsTrigger value="all" className="px-6">{t('all')}</TabsTrigger>
                    <TabsTrigger value="padel" className="px-6">{t('padel')}</TabsTrigger>
                    <TabsTrigger value="tennis" className="px-6">{t('tennis')}</TabsTrigger>
                    <TabsTrigger value="football" className="px-6">{t('football')}</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.filter(t => filter === 'all' || t.sportType?.toLowerCase() === filter).map((tournament) => (
                    <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className="group">
                        <Card className="overflow-hidden border-none shadow-lg transition-all group-hover:shadow-2xl group-hover:-translate-y-1">
                            <div className="relative aspect-[16/9]">
                                <img
                                    src={tournament.imageUrl}
                                    alt={tournament.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute top-4 left-4 flex gap-2">
                                    <Badge className="bg-primary/90 text-primary-foreground border-none px-3 py-1 font-bold">
                                        {st(tournament.status as any)}
                                    </Badge>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <Badge variant="secondary" className="mb-2 bg-white/10 backdrop-blur-sm text-white border-none font-medium text-[10px]">
                                        {tournament.sportType}
                                    </Badge>
                                    <h3 className="text-xl font-bold text-white leading-tight">
                                        {tournament.name}
                                    </h3>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-black border-none font-bold">
                                        {formatPrice(tournament.entryFee)}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <span>{tournament.location || 'Tehran'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        <span>{ft(tournament.format.toLowerCase() as any)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-muted/50 mt-2">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <Users className="h-4 w-4" />
                                    <span>{tournament.participants?.length || 0}/{tournament.maxParticipants} {t('joined')}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="font-bold text-primary group-hover:translate-x-1 transition-transform">
                                    {t('joinNow')}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
