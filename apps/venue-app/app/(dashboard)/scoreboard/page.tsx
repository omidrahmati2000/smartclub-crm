'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
    Monitor,
    Settings,
    Maximize2,
    Activity,
    Trophy,
    Wifi,
    WifiOff,
    Clock,
    ExternalLink,
    ChevronRight,
    Play
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Badge,
    Separator,
    Switch,
    Label,
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'

// Mock Data
const COURTS = [
    {
        id: 'court-1',
        name: 'Court 1 (Panoramic)',
        status: 'live',
        match: {
            team1: ['Juan Carlos', 'Ahmed Al Sharif'],
            team2: ['Sara Abdullah', 'Hassan Nouri'],
            sets: [[6, 4], [2, 3]],
            currentScore: '30 - 15',
            duration: '45 min',
            isTournament: true,
            tournamentName: 'Summer Open'
        },
        iotStatus: 'online'
    },
    {
        id: 'court-2',
        name: 'Court 2',
        status: 'live',
        match: {
            team1: ['Marco Rossi', 'Hussein'],
            team2: ['Mina', 'Sara Smith'],
            sets: [[4, 6], [1, 1]],
            currentScore: 'Deuce',
            duration: '52 min',
            isTournament: false
        },
        iotStatus: 'online'
    },
    {
        id: 'court-3',
        name: 'Court 3 (VIP)',
        status: 'idle',
        iotStatus: 'online'
    },
    {
        id: 'court-4',
        name: 'Court 4',
        status: 'live',
        match: {
            team1: ['Ali', 'Reza'],
            team2: ['Morteza', 'Saeed'],
            sets: [[7, 5], [6, 6]],
            currentScore: 'Tie-break (4-2)',
            duration: '88 min',
            isTournament: true,
            tournamentName: 'Weekend Smash'
        },
        iotStatus: 'offline'
    },
]

export default function ScoreboardPage() {
    const t = useTranslations('venue-admin')
    const [autoRefresh, setAutoRefresh] = useState(true)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.scoreboard')}</h1>
                    <p className="text-muted-foreground">Monitor and manage live court scores and board displays</p>
                </div>
                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border">
                    <div className="flex items-center gap-2 px-2">
                        <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                        <Label htmlFor="auto-refresh" className="text-xs font-bold uppercase">Auto-Refresh</Label>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button className="gap-2">
                        <Maximize2 className="h-4 w-4" />
                        Full Screen TV Mode
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {COURTS.map(court => (
                    <Card key={court.id} className={cn(
                        "overflow-hidden border-2 transition-all hover:shadow-2xl",
                        court.status === 'live' ? "border-primary/20 shadow-primary/5" : "bg-muted/10 opacity-60"
                    )}>
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "h-3 w-3 rounded-full",
                                        court.status === 'live' ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-muted-foreground/30"
                                    )} />
                                    <CardTitle className="text-lg">{court.name}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2 font-mono text-xs">
                                    {court.iotStatus === 'online' ? (
                                        <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-200">
                                            <Wifi className="h-3 w-3" /> IoT ONLINE
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="gap-1">
                                            <WifiOff className="h-3 w-3" /> OFFLINE
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {court.status === 'live' && court.match ? (
                                <div className="divide-y">
                                    {/* Score Display */}
                                    <div className="grid grid-cols-2 p-6 bg-gradient-to-br from-background to-muted/20">
                                        <div className="space-y-4">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">TEAM 1</p>
                                            {court.match.team1.map(name => (
                                                <p key={name} className="flex items-center gap-2 font-bold text-lg">
                                                    {name}
                                                </p>
                                            ))}
                                        </div>
                                        <div className="space-y-4 text-right">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">TEAM 2</p>
                                            {court.match.team2.map(name => (
                                                <p key={name} className="flex items-center justify-end gap-2 font-bold text-lg">
                                                    {name}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Matrix Style Scorer */}
                                    <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white font-mono">
                                        <div className="flex gap-4 items-center">
                                            {court.match.sets.map((set, i) => (
                                                <div key={i} className="flex flex-col items-center">
                                                    <span className="text-[8px] text-white/40 mb-1">SET {i + 1}</span>
                                                    <div className="bg-white/10 px-2 py-1 rounded border border-white/20 text-xl font-black">
                                                        {set[0]}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="h-8 w-px bg-white/10 mx-2" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] text-primary mb-1">GAME</span>
                                                <div className="bg-primary/20 text-primary px-3 py-1 rounded border border-primary/50 text-2xl font-black animate-pulse">
                                                    {court.match.currentScore.split(' - ')[0]}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-4xl font-black text-white/10">VS</div>

                                        <div className="flex gap-4 items-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] text-primary mb-1 text-right w-full">GAME</span>
                                                <div className="bg-primary/20 text-primary px-3 py-1 rounded border border-primary/50 text-2xl font-black animate-pulse">
                                                    {court.match.currentScore.split(' - ')[1] || court.match.currentScore}
                                                </div>
                                            </div>
                                            <div className="h-8 w-px bg-white/10 mx-2" />
                                            {court.match.sets.map((set, i) => (
                                                <div key={i} className="flex flex-col items-center">
                                                    <span className="text-[8px] text-white/40 mb-1">SET {i + 1}</span>
                                                    <div className="bg-white/10 px-2 py-1 rounded border border-white/20 text-xl font-black">
                                                        {set[1]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-48 flex-col items-center justify-center p-6 text-center space-y-4">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                                        <Activity className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-muted-foreground">Court is Idle</p>
                                        <p className="text-xs text-muted-foreground/60 leading-relaxed">No active match or scoreboard stream detected on this court.</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Play className="h-3 w-3" /> Start Manual Session
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        {court.status === 'live' && (
                            <CardFooter className="bg-muted/10 p-4 flex justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" /> {court.match?.duration}
                                    </div>
                                    {court.match?.isTournament && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                            <Trophy className="h-3 w-3" /> {court.match?.tournamentName}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                        Override
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 px-2 gap-1.5">
                                        Stream <ExternalLink className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3 pt-6">
                <Card className="md:col-span-2 border-2 shadow-lg bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-primary" /> Integrated TV Boards
                        </CardTitle>
                        <CardDescription className="text-white/60">Configure public displays throughout the club</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: 'Cafe Main Display', url: 'smartclub.io/live/cafe-1', status: 'online' },
                                { name: 'Reception Video Wall', url: 'smartclub.io/live/lobby-wall', status: 'offline' },
                            ].map(tv => (
                                <div key={tv.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2 w-2 rounded-full", tv.status === 'online' ? "bg-green-400" : "bg-red-400")} />
                                        <span className="text-sm font-medium">{tv.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <code className="text-[10px] text-white/40">{tv.url}</code>
                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8">Reset</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-dashed flex flex-col items-center justify-center p-8 text-center gap-4 bg-muted/20">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Activity className="h-6 w-6" />
                    </div>
                    <p className="font-bold">Hardware Bridge</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">Connect physical scoreboards via Raspberry Pi or Arduino Bridge.</p>
                    <Button size="sm" variant="outline">Install Driver</Button>
                </Card>
            </div>
        </div>
    )
}
