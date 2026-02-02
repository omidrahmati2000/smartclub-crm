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
import { Edit2 } from 'lucide-react'

interface AmericanoMatch {
    round: number
    court: string
    team1: [string, string]
    team2: [string, string]
    score1?: number
    score2?: number
    status: 'pending' | 'completed'
}

interface AmericanoGridProps {
    matches: AmericanoMatch[]
    onEntryScore: (matchIndex: number) => void
}

export function AmericanoGrid({ matches, onEntryScore }: AmericanoGridProps) {
    // Group matches by round
    const rounds = matches.reduce((acc, match) => {
        if (!acc[match.round]) acc[match.round] = []
        acc[match.round].push(match)
        return acc
    }, {} as Record<number, AmericanoMatch[]>)

    return (
        <div className="space-y-8">
            {Object.entries(rounds).map(([roundNum, roundMatches]) => (
                <div key={roundNum} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg">Round {roundNum}</h3>
                        <Badge variant="outline">In Progress</Badge>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Court</TableHead>
                                <TableHead>Team 1</TableHead>
                                <TableHead className="text-center font-bold">Score</TableHead>
                                <TableHead>Team 2</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roundMatches.map((match, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{match.court}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-semibold">{match.team1[0]}</span>
                                            <span className="text-muted-foreground">{match.team1[1]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2 font-mono text-xl font-bold">
                                            <span className={match.score1 !== undefined ? "text-primary" : "text-muted-foreground"}>
                                                {match.score1 ?? 0}
                                            </span>
                                            <span className="text-muted-foreground text-sm">-</span>
                                            <span className={match.score2 !== undefined ? "text-primary" : "text-muted-foreground"}>
                                                {match.score2 ?? 0}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-semibold">{match.team2[0]}</span>
                                            <span className="text-muted-foreground">{match.team2[1]}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => onEntryScore(idx)}>
                                            <Edit2 className="h-4 w-4 me-2" />
                                            Result
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    )
}
