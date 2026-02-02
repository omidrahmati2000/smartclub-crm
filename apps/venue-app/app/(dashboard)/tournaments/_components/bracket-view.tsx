'use client'

import { MatchCard } from './match-card'
import { ScrollArea, ScrollBar } from '@smartclub/ui'

interface BracketMatch {
    id: string
    round: number
    p1?: { id: string; name: string; score?: number }
    p2?: { id: string; name: string; score?: number }
    status: 'scheduled' | 'in_progress' | 'completed' | 'bye'
    winnerId?: string
}

interface BracketViewProps {
    rounds: {
        number: number
        name: string
        matches: BracketMatch[]
    }[]
    onMatchClick?: (matchId: string) => void
}

export function BracketView({ rounds, onMatchClick }: BracketViewProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-muted/5">
            <div className="flex p-8 gap-16 min-h-[500px] justify-start px-12">
                {rounds.map((round, roundIdx) => (
                    <div key={round.number} className="flex flex-col justify-around gap-8 min-w-[280px]">
                        <div className="text-center mb-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground bg-background py-1 px-3 rounded-full border inline-block">
                                {round.name || `Round ${round.number}`}
                            </h3>
                        </div>

                        <div className="flex flex-col justify-around flex-grow gap-12 relative">
                            {round.matches.map((match, matchIdx) => (
                                <div key={match.id} className="relative z-10">
                                    <MatchCard
                                        participant1={match.p1}
                                        participant2={match.p2}
                                        status={match.status}
                                        winnerId={match.winnerId}
                                        onClick={() => onMatchClick?.(match.id)}
                                    />

                                    {/* Connector Lines to Next Round */}
                                    {roundIdx < rounds.length - 1 && (
                                        <>
                                            {/* Horizontal line out */}
                                            <div className="absolute top-1/2 -right-16 w-8 h-[2px] bg-border" />

                                            {/* Vertical joiner line (only for the first match of a pair) */}
                                            {matchIdx % 2 === 0 && (
                                                <div
                                                    className="absolute -right-8 bg-border w-[2px]"
                                                    style={{
                                                        top: '50%',
                                                        height: 'calc(100% + 48px)', // Halfway down to the next pair's midpoint
                                                    }}
                                                />
                                            )}

                                            {/* Horizontal line into next round (only for the second match of a pair to simplify) */}
                                            {matchIdx % 2 === 0 && (
                                                <div
                                                    className="absolute -right-16 w-8 h-[2px] bg-border"
                                                    style={{ top: 'calc(100% + 24px + 50%)' }} // Midpoint between current pair
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {rounds.length === 0 && (
                    <div className="w-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-background/50">
                        <p className="text-muted-foreground font-medium italic">No matches generated yet.</p>
                    </div>
                )}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}
