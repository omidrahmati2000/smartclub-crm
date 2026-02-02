'use client'

import { useState, useEffect } from 'react'
import { localizedFetch } from '@smartclub/utils'
import { Card, Badge, Button } from '@smartclub/ui'
import { Trophy, Clock, Zap, Maximize2, Minimize2 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function LiveScoreboardPage() {
    const { matchId } = useParams()
    const [matchData, setMatchData] = useState<any>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Mock data fetching - normally would poll or use key
    useEffect(() => {
        const fetchMatch = async () => {
            // Need a special handler to find match by ID deeply or pass tournamentId
            // For now, we fetch the known tournament-1 and extract the match
            try {
                const res = await localizedFetch('/api/tournaments/tournament-1')
                const data = await res.json()
                if (data.success && data.data) {
                    // Search through all rounds in all stages
                    let match: any = null;
                    for (const stage of data.data.stages) {
                        for (const round of stage.rounds) {
                            const m = round.matches.find((m: any) => m.id === matchId)
                            if (m) {
                                match = m;
                                break;
                            }
                        }
                        if (match) break;
                    }

                    if (!match) return; // Match not found in this tournament

                    // Enrich with names
                    const p1 = data.data.participants.find((p: any) => p.id === match.participant1Id)
                    const p2 = data.data.participants.find((p: any) => p.id === match.participant2Id)

                    setMatchData({
                        ...match,
                        p1Name: p1?.name || 'Team 1',
                        p2Name: p2?.name || 'Team 2',
                        tournamentName: data.data.name
                    })
                }
            } catch (e) {
                console.error("Failed to fetch live match", e)
            }
        }

        // Initial fetch
        fetchMatch()

        // Poll every 5s
        const interval = setInterval(fetchMatch, 5000)
        return () => clearInterval(interval)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
                setIsFullscreen(false)
            }
        }
    }

    if (!matchData) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4 animate-pulse">
                    <Trophy className="h-16 w-16 text-yellow-500" />
                    <div className="text-2xl font-bold tracking-widest">LOADING LIVE SCORE...</div>
                </div>
            </div>
        )
    }

    const { p1Name, p2Name, liveState, tournamentName } = matchData
    const sets = liveState?.sets || []

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black overflow-hidden flex flex-col">

            {/* Top Bar */}
            <div className="flex justify-between items-center px-8 py-6 bg-gradient-to-b from-white/10 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-500 text-black font-bold px-3 py-1 rounded text-sm tracking-wider uppercase">Live</div>
                    <h1 className="text-xl font-light tracking-widest uppercase opacity-80">{tournamentName}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-yellow-500 font-mono text-xl">
                        <Clock className="h-5 w-5 animate-pulse" />
                        <span>01:14:32</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/10">
                        {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                    </Button>
                </div>
            </div>

            {/* Main Score Area */}
            <div className="flex-1 flex flex-col justify-center max-w-[90%] mx-auto w-full gap-8">

                {/* Team 1 Row */}
                <div className="flex items-center gap-4 group">
                    {/* Serving Indicator */}
                    <div className={`w-4 h-4 rounded-full ${liveState?.servingSide === 'p1' ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'bg-transparent'}`} />

                    {/* Name */}
                    <Card className="flex-1 bg-white/5 border-white/10 p-6 flex justify-between items-center backdrop-blur-md relative overflow-hidden">
                        <span className="text-5xl md:text-7xl font-black tracking-tight uppercase truncate z-10">{p1Name}</span>
                        {liveState?.isGoldenPoint && (
                            <div className="absolute right-0 top-0 bottom-0 bg-yellow-500/20 px-4 flex items-center border-l border-yellow-500/50">
                                <Zap className="h-8 w-8 text-yellow-500 animate-pulse" />
                            </div>
                        )}
                    </Card>

                    {/* Sets History */}
                    {sets.map((set: any, i: number) => (
                        <div key={`s1-${i}`} className={`w-24 h-32 md:w-32 md:h-40 flex items-center justify-center text-4xl md:text-6xl font-bold rounded-lg border-2 ${liveState.currentSet === i + 1 ? 'bg-white/5 border-white/20' : 'bg-transparent border-transparent text-white/40'}`}>
                            {set.score1}
                        </div>
                    ))}

                    {/* Current Points */}
                    <div className="w-40 h-40 md:w-52 md:h-52 bg-yellow-500 text-black flex items-center justify-center rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.3)] transform transition-transform group-hover:scale-105">
                        <span className="text-8xl md:text-9xl font-black tracking-tighter">{liveState?.points1 || '0'}</span>
                    </div>
                </div>

                {/* Team 2 Row */}
                <div className="flex items-center gap-4 group">
                    {/* Serving Indicator */}
                    <div className={`w-4 h-4 rounded-full ${liveState?.servingSide === 'p2' ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'bg-transparent'}`} />

                    {/* Name */}
                    <Card className="flex-1 bg-white/5 border-white/10 p-6 flex justify-between items-center backdrop-blur-md">
                        <span className="text-5xl md:text-7xl font-black tracking-tight uppercase truncate">{p2Name}</span>
                    </Card>

                    {/* Sets History */}
                    {sets.map((set: any, i: number) => (
                        <div key={`s2-${i}`} className={`w-24 h-32 md:w-32 md:h-40 flex items-center justify-center text-4xl md:text-6xl font-bold rounded-lg border-2 ${liveState.currentSet === i + 1 ? 'bg-white/5 border-white/20' : 'bg-transparent border-transparent text-white/40'}`}>
                            {set.score2}
                        </div>
                    ))}

                    {/* Current Points */}
                    <div className="w-40 h-40 md:w-52 md:h-52 bg-yellow-500 text-black flex items-center justify-center rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.3)] transform transition-transform group-hover:scale-105">
                        <span className="text-8xl md:text-9xl font-black tracking-tighter">{liveState?.points2 || '0'}</span>
                    </div>
                </div>

            </div>

            {/* Footer / Sponsors */}
            <div className="py-12 px-8 flex justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Placeholders for logos */}
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse" />
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse delay-75" />
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse delay-150" />
            </div>
        </div>
    )
}
