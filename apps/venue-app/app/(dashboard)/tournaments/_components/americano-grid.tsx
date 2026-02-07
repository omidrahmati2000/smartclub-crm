'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Button
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import { useTranslations } from 'next-intl'
import { Edit2, CheckCircle2, PlayCircle, Clock } from 'lucide-react'

interface AmericanoMatch {
    round: number
    court: string
    team1: string[]
    team2: string[]
    score1?: number
    score2?: number
    status: 'completed' | 'in_progress' | 'scheduled'
    scheduledTime?: string
}

interface AmericanoGridProps {
    matches: AmericanoMatch[]
    onEntryScore: (matchIndex: number) => void
}

function getRoundStatus(matches: AmericanoMatch[]): 'completed' | 'in_progress' | 'scheduled' {
    if (matches.every(m => m.status === 'completed')) return 'completed'
    if (matches.some(m => m.status === 'in_progress')) return 'in_progress'
    return 'scheduled'
}

export function AmericanoGrid({ matches, onEntryScore }: AmericanoGridProps) {
    const t = useTranslations('venue-admin.tournaments.detail.grid')

    function getRoundBadge(status: 'completed' | 'in_progress' | 'scheduled') {
        switch (status) {
            case 'completed':
                return <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" /> {t('completed')}</Badge>
            case 'in_progress':
                return <Badge variant="default" className="gap-1"><PlayCircle className="h-3 w-3" /> {t('live')}</Badge>
            case 'scheduled':
                return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {t('upcoming')}</Badge>
        }
    }

    // Group matches by round
    const rounds = matches.reduce((acc, match, idx) => {
        if (!acc[match.round]) acc[match.round] = []
        acc[match.round].push({ ...match, globalIdx: idx })
        return acc
    }, {} as Record<number, (AmericanoMatch & { globalIdx: number })[]>)

    return (
        <div className="space-y-8">
            {Object.entries(rounds).map(([roundNum, roundMatches]) => {
                const roundStatus = getRoundStatus(roundMatches)
                return (
                    <div key={roundNum} className={cn(
                        "space-y-4 rounded-lg p-4 transition-colors",
                        roundStatus === 'completed' && "bg-muted/30",
                        roundStatus === 'in_progress' && "bg-primary/5 ring-1 ring-primary/20",
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-lg">{t('round', { number: roundNum })}</h3>
                                {getRoundBadge(roundStatus)}
                            </div>
                            {roundMatches[0]?.scheduledTime && (
                                <span className="text-xs text-muted-foreground">
                                    {new Date(roundMatches[0].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">{t('court')}</TableHead>
                                    <TableHead>{t('team1')}</TableHead>
                                    <TableHead className="text-center font-bold">{t('score')}</TableHead>
                                    <TableHead>{t('team2')}</TableHead>
                                    <TableHead className="text-right">{t('actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roundMatches.map((match) => (
                                    <TableRow key={match.globalIdx} className={cn(
                                        match.status === 'in_progress' && "bg-primary/5",
                                        match.status === 'completed' && "opacity-80",
                                    )}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {match.status === 'in_progress' && (
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                )}
                                                {match.court}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-semibold">{match.team1[0] || 'TBD'}</span>
                                                <span className="text-muted-foreground">{match.team1[1] || 'TBD'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2 font-mono text-xl font-bold">
                                                <span className={match.score1 !== undefined ? "text-primary" : "text-muted-foreground"}>
                                                    {match.score1 ?? '-'}
                                                </span>
                                                <span className="text-muted-foreground text-sm">-</span>
                                                <span className={match.score2 !== undefined ? "text-primary" : "text-muted-foreground"}>
                                                    {match.score2 ?? '-'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-semibold">{match.team2[0] || 'TBD'}</span>
                                                <span className="text-muted-foreground">{match.team2[1] || 'TBD'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEntryScore(match.globalIdx)}
                                                disabled={match.status === 'completed'}
                                            >
                                                <Edit2 className="h-4 w-4 me-2" />
                                                {match.status === 'completed' ? t('done') : t('result')}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
            })}
        </div>
    )
}
