'use client'

import { useParams } from 'next/navigation'
import { Trophy, Calendar, Users, MapPin, Share2, Info, ChevronRight } from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Badge,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Separator
} from '@smartclub/ui'

import { useTranslations } from 'next-intl'
import { RegistrationDialog } from '../_components/registration-dialog'
import { useEffect, useState } from 'react'
import { localizedFetch } from '@smartclub/utils'

export default function TournamentPublicDetailPage() {
    const { id } = useParams()
    const t = useTranslations('tournament.detail')
    const st = useTranslations('tournament.status')
    const ft = useTranslations('tournament.formats')

    const [tournament, setTournament] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRegDialogOpen, setIsRegDialogOpen] = useState(false)

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const res = await localizedFetch(`/api/tournaments/${id}`)
                const result = await res.json()
                if (result.success) {
                    setTournament(result.data)
                }
            } catch (error) {
                console.error('Failed to fetch tournament:', error)
            } finally {
                setIsLoading(false)
            }
        }
        if (id) fetchTournament()
    }, [id])

    if (isLoading) {
        return (
            <div className="bg-muted/30 min-h-screen animate-pulse">
                <div className="h-[400px] bg-muted mb-8" />
                <div className="container mx-auto py-12 px-4">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 h-96 bg-muted rounded" />
                        <div className="h-96 bg-muted rounded" />
                    </div>
                </div>
            </div>
        )
    }

    if (!tournament) return <div className="p-20 text-center">Tournament not found</div>

    const formatPrice = (p: any) => {
        if (typeof p === 'number') return `${p.toLocaleString()} ${t('currency' as any) || 'IRT'}`;
        return p || t('free' as any);
    }


    return (
        <div className="bg-muted/30 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img
                    src={tournament.imageUrl}
                    alt={tournament.name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="container absolute bottom-8 left-1/2 -translate-x-1/2 px-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-primary/90 hover:bg-primary/90 border-none px-3 py-1 text-sm font-bold">
                                {tournament.level}
                            </Badge>
                            <Badge variant="outline" className="bg-background/20 backdrop-blur-md text-white border-white/20">
                                {ft(tournament.format as any)}
                            </Badge>
                            <Badge className="bg-green-500/90 border-none text-white">
                                {st(tournament.status.toLowerCase() as any)}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            {tournament.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{tournament.location || 'Tehran'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span className="font-semibold">{new Date(tournament.startDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="bg-background/50 backdrop-blur p-1 inline-flex w-auto border">
                                <TabsTrigger value="info">{t('overview')}</TabsTrigger>
                                <TabsTrigger value="participants">{t('participants')}</TabsTrigger>
                                <TabsTrigger value="brackets">{t('brackets')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="mt-8 space-y-8">
                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold">{t('overview')}</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        {tournament.description}
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold">{t('rules')}</h2>
                                    <div className="space-y-3">
                                        {typeof tournament.rules === 'string' ? (
                                            <p className="text-muted-foreground">{tournament.rules}</p>
                                        ) : (
                                            <ul className="space-y-3">
                                                {tournament.rules?.map((rule: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                                        <ChevronRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                        <span>{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-bold">{t('location')}</h2>
                                    <Card className="overflow-hidden border-none shadow-md">
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            <MapPin className="h-12 w-12 text-muted-foreground opacity-20" />
                                            <span className="text-muted-foreground italic ml-2">Map placeholder</span>
                                        </div>
                                        <CardHeader className="bg-card">
                                            <CardTitle className="text-lg">Enghelab Sports Complex</CardTitle>
                                            <p className="text-sm text-muted-foreground">Valiasr St, Tehran, Iran</p>
                                        </CardHeader>
                                    </Card>
                                </section>
                            </TabsContent>

                            <TabsContent value="participants" className="mt-8">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {tournament.participants?.map((p: any, i: number) => (
                                        <Card key={p.id} className="flex items-center p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold">{p.name}</div>
                                                <div className="text-xs text-muted-foreground">{t('participant' as any)}</div>
                                            </div>
                                        </Card>
                                    ))}
                                    {(!tournament.participants || tournament.participants.length === 0) && (
                                        <p className="col-span-full text-center py-12 text-muted-foreground italic">
                                            {t('noParticipants' as any) || 'No participants yet. Be the first to join!'}
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="brackets" className="mt-8">
                                <div className="py-20 text-center border-2 border-dashed rounded-xl flex flex-col items-center gap-4">
                                    <Trophy className="h-12 w-12 text-muted-foreground opacity-20" />
                                    <p className="text-muted-foreground font-medium">{t('noStartedTitle')}</p>
                                    <p className="text-sm text-muted-foreground">{t('noStartedDesc')}</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <Card className="sticky top-24 border-none shadow-xl overflow-hidden">
                            <div className="p-1 bg-gradient-to-r from-primary to-primary/60" />
                            <CardContent className="p-8">
                                <div className="mb-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{t('entryFee')}</div>
                                    <div className="text-4xl font-black">{formatPrice(tournament.entryFee)}</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">{t('prizePool')}</span>
                                        <span className="font-bold text-primary">{tournament.prizePool || t('glory' as any)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">{t('deadline')}</span>
                                        <span className="font-bold">{new Date(tournament.registrationDeadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2 border-b">
                                        <span className="text-muted-foreground">{t('participants')}</span>
                                        <span className="font-bold">{tournament.participants?.length || 0} / {tournament.maxParticipants}</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <Button
                                        className="w-full text-lg h-14 font-bold rounded-xl"
                                        size="lg"
                                        onClick={() => setIsRegDialogOpen(true)}
                                    >
                                        {t('registerNow')}
                                    </Button>
                                    <Button variant="outline" className="w-full h-12 rounded-xl text-muted-foreground" size="lg">
                                        <Share2 className="h-4 w-4 me-2" />
                                        {t('invitePartner')}
                                    </Button>
                                </div>
                            </CardContent>
                            <div className="p-4 bg-muted/50 text-center border-t">
                                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                    <Info className="h-3 w-3" />
                                    <span>Refunds available until 48h before start.</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-primary/5 border-primary/20">
                            <h3 className="font-bold mb-2">{t('needPartner')}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{t('needPartnerDesc')}</p>
                            <Button
                                variant="link"
                                className="p-0 text-primary h-auto font-bold"
                                onClick={() => setIsRegDialogOpen(true)}
                            >
                                {t('findOpenTeam')} →
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>

            <RegistrationDialog
                isOpen={isRegDialogOpen}
                onClose={() => setIsRegDialogOpen(false)}
                tournament={{
                    name: tournament.name,
                    price: formatPrice(tournament.entryFee),
                    format: tournament.format
                }}
            />
        </div>
    )
}
