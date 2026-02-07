'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Avatar,
    AvatarFallback,
    Badge
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import { useTranslations } from 'next-intl'

interface Standing {
    participantId: string
    name: string
    rank: number
    played: number
    wins: number
    losses: number
    draws: number
    pointsFor: number
    pointsAgainst: number
    totalPoints: number
}

interface LeaderboardProps {
    standings: Standing[]
}

export function Leaderboard({ standings }: LeaderboardProps) {
    const t = useTranslations('venue-admin.tournaments.detail.standings')

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px] text-center">{t('rank')}</TableHead>
                        <TableHead>{t('player')}</TableHead>
                        <TableHead className="text-center">{t('played')}</TableHead>
                        <TableHead className="text-center">{t('wins')}</TableHead>
                        <TableHead className="text-center">{t('losses')}</TableHead>
                        <TableHead className="text-center hidden md:table-cell">{t('draws')}</TableHead>
                        <TableHead className="text-center hidden md:table-cell">{t('pfPa')}</TableHead>
                        <TableHead className="text-center font-bold text-primary">{t('points')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {standings.sort((a, b) => a.rank - b.rank).map((s, idx) => (
                        <TableRow key={s.participantId} className={cn(idx < 3 && "bg-primary/5")}>
                            <TableCell className="text-center font-bold">
                                {s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px]">{s.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{s.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">{s.played}</TableCell>
                            <TableCell className="text-center text-green-600 font-medium">{s.wins}</TableCell>
                            <TableCell className="text-center text-destructive font-medium">{s.losses}</TableCell>
                            <TableCell className="text-center hidden md:table-cell">{s.draws}</TableCell>
                            <TableCell className="text-center hidden md:table-cell text-xs text-muted-foreground">
                                {s.pointsFor} / {s.pointsAgainst}
                            </TableCell>
                            <TableCell className="text-center font-bold text-primary">
                                {s.totalPoints}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
