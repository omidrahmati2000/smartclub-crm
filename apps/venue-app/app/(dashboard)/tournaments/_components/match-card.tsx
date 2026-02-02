'use client'

import { Card } from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import { Trophy } from 'lucide-react'

interface MatchCardProps {
    participant1?: { id: string; name: string; score?: number }
    participant2?: { id: string; name: string; score?: number }
    status: 'scheduled' | 'in_progress' | 'completed' | 'bye'
    winnerId?: string
    scheduledTime?: string
    assetName?: string
    onClick?: () => void
}

export function MatchCard({
    participant1,
    participant2,
    status,
    winnerId,
    scheduledTime,
    assetName,
    onClick
}: MatchCardProps) {
    const isWinner1 = winnerId && participant1 && winnerId === participant1.id
    const isWinner2 = winnerId && participant2 && winnerId === participant2.id

    return (
        <Card
            onClick={status !== 'bye' ? onClick : undefined}
            className={cn(
                "w-[240px] overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 cursor-pointer",
                status === 'in_progress' && "border-primary ring-1 ring-primary",
                status === 'bye' && "opacity-50 grayscale cursor-default"
            )}
        >
            <div className="p-3 space-y-2">
                {/* Participant 1 */}
                <div className={cn(
                    "flex items-center justify-between rounded px-2 py-1",
                    isWinner1 ? "bg-primary/10 font-bold" : "text-muted-foreground"
                )}>
                    <div className="flex items-center gap-2 truncate">
                        {isWinner1 && <Trophy className="h-3 w-3 text-primary shrink-0" />}
                        <span className="truncate">{participant1?.name || (status === 'bye' ? 'BYE' : 'TBD')}</span>
                    </div>
                    <span className="font-mono">{participant1?.score ?? '-'}</span>
                </div>

                {/* Participant 2 */}
                <div className={cn(
                    "flex items-center justify-between rounded px-2 py-1",
                    isWinner2 ? "bg-primary/10 font-bold" : "text-muted-foreground"
                )}>
                    <div className="flex items-center gap-2 truncate">
                        {isWinner2 && <Trophy className="h-3 w-3 text-primary shrink-0" />}
                        <span className="truncate">{participant2?.name || (status === 'bye' ? 'BYE' : 'TBD')}</span>
                    </div>
                    <span className="font-mono">{participant2?.score ?? '-'}</span>
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-muted/50 px-3 py-1 flex justify-between items-center border-t">
                {status === 'in_progress' ? (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-red-500">LIVE</span>
                    </div>
                ) : (
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {status.replace('_', ' ')}
                    </span>
                )}
                <span className="text-[10px] text-muted-foreground">
                    {scheduledTime ? new Date(scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : assetName || '-'}
                </span>
            </div>
        </Card>
    )
}
