'use client'

import { useTranslations } from 'next-intl'
import { Plus, Trophy, Calendar, Users, ArrowRight } from 'lucide-react'
import { Button, Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@smartclub/ui'
import Link from 'next/link'

import { useState, useEffect } from 'react'
import { localizedFetch } from '@smartclub/utils'

export default function TournamentsPage() {
    const t = useTranslations('venue-admin.tournaments')
    const [tournaments, setTournaments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                // In a real app, venueId would come from auth context
                const res = await localizedFetch('/api/tournaments?venueId=venue-1')
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
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-[300px] animate-pulse bg-muted" />
                    ))}
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <Button asChild>
                    <Link href="/tournaments/create">
                        <Plus className="me-2 h-4 w-4" />
                        {t('createTournament')}
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tournaments.map((tournament) => (
                    <Card key={tournament.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                            <img
                                src={tournament.imageUrl}
                                alt={tournament.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                        </div>
                        <CardHeader className="p-4">
                            <div className="flex items-center justify-between gap-2">
                                <Badge variant={tournament.status === 'in_progress' ? 'default' : 'secondary'}>
                                    {t(`status.${tournament.status.toLowerCase()}` as any) || tournament.status}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Calendar className="me-1 h-3 w-3" />
                                    {new Date(tournament.startDate).toLocaleDateString()}
                                </div>
                            </div>

                            <CardTitle className="mt-2 text-xl leading-tight">
                                {tournament.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {t(`formats.${tournament.format.toLowerCase()}` as any) || tournament.format}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 pt-0">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>{t('participants')}</span>
                                </div>
                                <span className="font-medium">
                                    {tournament.participants?.length || 0} / {tournament.maxParticipants}
                                </span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{
                                        width: `${((tournament.participants?.length || 0) / tournament.maxParticipants) * 100}%`,
                                    }}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="ghost" className="w-full justify-between group" asChild>
                                <Link href={`/tournaments/${tournament.id}`}>
                                    <span>{t('viewProfile')}</span>
                                    <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {tournaments.length === 0 && (
                    <Card className="flex flex-col items-center justify-center p-12 text-center col-span-full border-dashed">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <Trophy className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">{t('noTournaments')}</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mb-4">
                            Create your first tournament to start managing competitions and attracting players to your venue.
                        </p>
                        <Button asChild>
                            <Link href="/tournaments/create">
                                <Plus className="me-2 h-4 w-4" />
                                {t('createTournament')}
                            </Link>
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    )
}
