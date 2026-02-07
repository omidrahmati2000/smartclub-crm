'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
    Trophy,
    Users,
    Settings,
    Calendar,
    BarChart,
    ChevronLeft,
    LayoutGrid,
    PlayCircle
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Badge,
    Separator,
    Label,
    Input
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import Link from 'next/link'

// Components
import { ParticipantList } from '../_components/participant-list'
import { BracketView } from '../_components/bracket-view'
import { AmericanoGrid } from '../_components/americano-grid'
import { ScoreEntryDialog } from '../_components/score-entry-dialog'
import { Leaderboard } from '../_components/leaderboard'

import { localizedFetch } from '@smartclub/utils'

// Asset ID → display name mapping
const assetNameMap: Record<string, string> = {
    'asset-1': 'Padel Court 1',
    'asset-5': 'Padel Court 2',
    'asset-6': 'Padel Court 3',
    'asset-7': 'Tennis Court 1',
    'asset-8': 'Tennis Court 2',
}

export default function TournamentDetailPage() {
    const { id } = useParams()
    const t = useTranslations('venue-admin.tournaments')

    const [tournament, setTournament] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false)
    const [selectedMatch, setSelectedMatch] = useState<any>(null)

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
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-12 w-1/3 bg-muted rounded" />
                <div className="grid gap-6 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded" />)}
                </div>
                <div className="h-64 bg-muted rounded" />
            </div>
        )
    }

    if (!tournament) return <div>Tournament not found</div>

    // Derive calculated props
    const participantsCount = tournament.participants?.length || 0
    const stage = tournament.stages?.[0]
    const rounds = stage?.rounds || []

    // Convert TournamentMatch format to BracketView format
    const bracketRounds = rounds.map((r: any) => ({
        number: r.roundNumber,
        name: r.name,
        matches: r.matches.map((m: any) => ({
            id: m.id,
            round: r.roundNumber,
            p1: m.participant1Id ? {
                id: m.participant1Id,
                name: tournament.participants.find((p: any) => p.id === m.participant1Id)?.name || 'Unknown',
                score: m.score1
            } : undefined,
            p2: m.participant2Id ? {
                id: m.participant2Id,
                name: tournament.participants.find((p: any) => p.id === m.participant2Id)?.name || 'Unknown',
                score: m.score2
            } : undefined,
            status: m.status,
            winnerId: m.winnerId,
            scheduledTime: m.scheduledTime,
            assetName: m.assetId ? (assetNameMap[m.assetId] || m.assetId) : undefined,
            sets: m.sets,
        }))
    }))

    // Convert TournamentMatch format to AmericanoGrid format
    const americanoMatches = rounds.flatMap((r: any) => r.matches.map((m: any) => ({
        round: r.roundNumber,
        court: m.assetId ? (assetNameMap[m.assetId] || m.assetId) : 'Court',
        team1: m.team1ParticipantIds?.map((pid: string) => tournament.participants.find((p: any) => p.id === pid)?.name) || [],
        team2: m.team2ParticipantIds?.map((pid: string) => tournament.participants.find((p: any) => p.id === pid)?.name) || [],
        score1: m.score1,
        score2: m.score2,
        status: m.status,
        scheduledTime: m.scheduledTime,
    })))

    const standings = stage?.standings?.map((s: any) => ({
        ...s,
        name: tournament.participants.find((p: any) => p.id === s.participantId)?.name || 'Unknown'
    })) || []

    const completedMatches = rounds.reduce((acc: number, r: any) => acc + r.matches.filter((m: any) => m.status === 'completed').length, 0)
    const totalMatches = rounds.reduce((acc: number, r: any) => acc + r.matches.length, 0)
    const activeMatches = rounds.reduce((acc: number, r: any) => acc + r.matches.filter((m: any) => m.status === 'in_progress').length, 0)

    const progress = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0

    // Get current live/scheduled matches for court overview
    const allMatches = rounds.flatMap((r: any) => r.matches)
    const courtIds = tournament.settings?.courts || []
    const courtStatuses = courtIds.map((courtId: string) => {
        const courtName = assetNameMap[courtId] || courtId
        const liveMatch = allMatches.find((m: any) => m.assetId === courtId && m.status === 'in_progress')
        const nextMatch = allMatches.find((m: any) => m.assetId === courtId && m.status === 'scheduled')

        if (liveMatch) {
            // Resolve team/participant names
            let team1Name = ''
            let team2Name = ''
            if (liveMatch.team1ParticipantIds) {
                team1Name = liveMatch.team1ParticipantIds.map((pid: string) =>
                    tournament.participants.find((p: any) => p.id === pid)?.name
                ).filter(Boolean).join(' + ')
                team2Name = liveMatch.team2ParticipantIds?.map((pid: string) =>
                    tournament.participants.find((p: any) => p.id === pid)?.name
                ).filter(Boolean).join(' + ') || 'TBD'
            } else {
                team1Name = tournament.participants.find((p: any) => p.id === liveMatch.participant1Id)?.name || 'TBD'
                team2Name = tournament.participants.find((p: any) => p.id === liveMatch.participant2Id)?.name || 'TBD'
            }
            return { courtName, status: 'live' as const, team1Name, team2Name, score: `${liveMatch.score1 ?? 0} - ${liveMatch.score2 ?? 0}` }
        }

        if (nextMatch) {
            let team1Name = ''
            let team2Name = ''
            if (nextMatch.team1ParticipantIds) {
                team1Name = nextMatch.team1ParticipantIds.map((pid: string) =>
                    tournament.participants.find((p: any) => p.id === pid)?.name
                ).filter(Boolean).join(' + ')
                team2Name = nextMatch.team2ParticipantIds?.map((pid: string) =>
                    tournament.participants.find((p: any) => p.id === pid)?.name
                ).filter(Boolean).join(' + ') || 'TBD'
            } else {
                team1Name = tournament.participants.find((p: any) => p.id === nextMatch.participant1Id)?.name || 'TBD'
                team2Name = nextMatch.participant2Id ? tournament.participants.find((p: any) => p.id === nextMatch.participant2Id)?.name || 'TBD' : 'TBD'
            }
            const time = nextMatch.scheduledTime ? new Date(nextMatch.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
            return { courtName, status: 'upcoming' as const, team1Name, team2Name, time }
        }

        return { courtName, status: 'empty' as const }
    })

    const handleMatchClick = (match: any) => {
        setSelectedMatch(match)
        setIsScoreModalOpen(true)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/tournaments">
                            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
                            <Badge variant={tournament.status === 'in_progress' ? 'default' : 'secondary'}>
                                {t(`status.${tournament.status.toLowerCase()}` as any) || tournament.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{tournament.sportType} • {t(`formats.${tournament.format.toLowerCase()}` as any) || tournament.format} • {new Date(tournament.startDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <PlayCircle className="me-2 h-4 w-4" />
                        {t('detail.startNextRound')}
                    </Button>
                    <Button>
                        <Trophy className="me-2 h-4 w-4" />
                        {t('detail.finishTournament')}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('detail.kpis.participants')}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{participantsCount} / {tournament.maxParticipants}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('detail.kpis.progress')}</CardTitle>
                        <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(progress)}%</div>
                        <div className="mt-2 h-2 w-full rounded-full bg-secondary overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('detail.kpis.activeMatches')}</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeMatches}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('detail.kpis.matchesPlayed')}</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedMatches} / {totalMatches}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="matches" className="w-full">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="overview" className="gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        {t('detail.tabs.overview')}
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="gap-2">
                        <Users className="h-4 w-4" />
                        {t('detail.tabs.participants')}
                    </TabsTrigger>
                    <TabsTrigger value="matches" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('detail.tabs.matches')}
                    </TabsTrigger>
                    <TabsTrigger value="standings" className="gap-2">
                        <Trophy className="h-4 w-4" />
                        {t('detail.tabs.standings')}
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" />
                        {t('detail.tabs.settings')}
                    </TabsTrigger>
                </TabsList>

                <Separator className="my-6" />

                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>{t('detail.courtOverview')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {courtStatuses.map((court: any) => (
                                        <div
                                            key={court.courtName}
                                            className={cn(
                                                "border rounded-lg p-4",
                                                court.status === 'live' && "bg-primary/5 border-primary",
                                                court.status === 'upcoming' && "bg-muted/30",
                                                court.status === 'empty' && "bg-muted/50",
                                            )}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold">{court.courtName}</span>
                                                {court.status === 'live' && (
                                                    <Badge>
                                                        <span className="relative flex h-2 w-2 me-1.5">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </span>
                                                        Live
                                                    </Badge>
                                                )}
                                                {court.status === 'upcoming' && <Badge variant="outline">{t('detail.nextUp')}</Badge>}
                                                {court.status === 'empty' && <Badge variant="outline">{t('detail.empty')}</Badge>}
                                            </div>
                                            {court.status === 'live' && (
                                                <>
                                                    <p className="text-sm font-semibold">{court.team1Name} vs {court.team2Name}</p>
                                                    <p className="text-lg font-mono font-bold text-primary mt-1">{court.score}</p>
                                                </>
                                            )}
                                            {court.status === 'upcoming' && (
                                                <>
                                                    <p className="text-sm font-semibold">{court.team1Name} vs {court.team2Name}</p>
                                                    {court.time && <p className="text-xs text-muted-foreground mt-1">{t('detail.scheduledAt', { time: court.time })}</p>}
                                                </>
                                            )}
                                            {court.status === 'empty' && (
                                                <p className="text-sm text-muted-foreground italic">{t('detail.noActiveMatch')}</p>
                                            )}
                                        </div>
                                    ))}
                                    {courtStatuses.length === 0 && (
                                        <p className="text-muted-foreground text-sm col-span-2">{t('detail.noCourts')}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('detail.quickRankings')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {standings.slice(0, 5).map((s: any, i: number) => (
                                        <div key={s.participantId} className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                                                <span className="text-sm font-medium">{s.name}</span>
                                            </div>
                                            <span className="text-sm font-mono font-bold">{s.totalPoints} pts</span>
                                        </div>
                                    ))}
                                    {standings.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">{t('detail.noStandings')}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="participants">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t('detail.participants.title')}</CardTitle>
                                <CardDescription>{t('detail.participants.description')}</CardDescription>
                            </div>
                            <Button size="sm">{t('detail.participants.addPlayer')}</Button>
                        </CardHeader>
                        <CardContent>
                            <ParticipantList
                                participants={tournament.participants || []}
                                onRemove={(id) => console.log('Remove', id)}
                                onUpdateStatus={(id, status) => console.log('Update', id, status)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="matches">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{t('detail.matches.title')}</CardTitle>
                                    <CardDescription>{t('detail.matches.description')}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">{t('detail.matches.exportSchedule')}</Button>
                                    <Button size="sm">{t('detail.matches.autoSchedule')}</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {tournament.format === 'AMERICANO' || tournament.format === 'MEXICANO' ? (
                                    <AmericanoGrid
                                        matches={americanoMatches}
                                        onEntryScore={(idx) => handleMatchClick(americanoMatches[idx])}
                                    />
                                ) : (
                                    <BracketView
                                        rounds={bracketRounds}
                                        onMatchClick={(matchId) => {
                                            // Find the match data from bracketRounds
                                            for (const round of bracketRounds) {
                                                const match = round.matches.find((m: any) => m.id === matchId)
                                                if (match) {
                                                    handleMatchClick(match)
                                                    return
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="standings">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('detail.tabs.standings')}</CardTitle>
                            <CardDescription>{t('detail.standings.description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Leaderboard standings={standings} />
                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" size="sm">{t('detail.standings.downloadPdf')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('detail.settings.title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t('detail.settings.matchDuration')}</Label>
                                    <Input type="number" defaultValue={tournament.settings?.matchDurationMin || 20} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('detail.settings.restDuration')}</Label>
                                    <Input type="number" defaultValue={tournament.settings?.restDurationMin || 5} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('detail.settings.courtsToUse')}</Label>
                                    <div className="flex gap-2">
                                        {courtIds.map((courtId: string) => (
                                            <Badge key={courtId}>{assetNameMap[courtId] || courtId}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button>{t('detail.settings.save')}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <ScoreEntryDialog
                isOpen={isScoreModalOpen}
                onClose={() => setIsScoreModalOpen(false)}
                onSave={async (s1, s2) => {
                    try {
                        const res = await localizedFetch(`/api/tournaments/${id}/matches/${selectedMatch.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ score1: s1, score2: s2 })
                        })
                        const result = await res.json()
                        if (result.success) {
                            // Refetch to get updated standings/brackets
                            const tournamentRes = await localizedFetch(`/api/tournaments/${id}`)
                            const tournamentResult = await tournamentRes.json()
                            if (tournamentResult.success) {
                                setTournament(tournamentResult.data)
                            }
                            setIsScoreModalOpen(false)
                        }
                    } catch (error) {
                        console.error('Failed to update score:', error)
                    }
                }}
                team1Name={Array.isArray(selectedMatch?.team1) ? selectedMatch.team1.join(' / ') : selectedMatch?.team1 || selectedMatch?.p1?.name || 'Team 1'}
                team2Name={Array.isArray(selectedMatch?.team2) ? selectedMatch.team2.join(' / ') : selectedMatch?.team2 || selectedMatch?.p2?.name || 'Team 2'}
                initialScore1={selectedMatch?.score1 || selectedMatch?.p1?.score}
                initialScore2={selectedMatch?.score2 || selectedMatch?.p2?.score}
                matchId={selectedMatch?.id}
            />
        </div>
    )
}
