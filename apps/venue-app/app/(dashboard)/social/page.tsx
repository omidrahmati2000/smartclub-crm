'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Sparkles,
    Trophy,
    Users,
    Search,
    MessageSquare,
    Share2,
    Award,
    Flame,
    TrendingUp,
    Handshake,
    ShieldAlert,
    MapPin,
    Plus
} from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Badge,
    ScrollArea,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Separator
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'

// Mock Data
const PARTNER_REQUESTS = [
    { id: 'm1', name: 'Hussein Al Rashid', level: 'Intermediate', time: 'Tonight 20:00', venue: 'Court 2', slots: 2, image: 'HR' },
    { id: 'm2', name: 'Fatima Al Nouri', level: 'Advanced', time: 'Tomorrow 18:00', venue: 'Any Court', slots: 1, image: 'FN' },
    { id: 'm3', name: 'Omar Sadiq', level: 'Beginner', time: 'Friday 10:00', venue: 'Court 1', slots: 3, image: 'OS' },
]

const LEADERBOARD = [
    { rank: 1, name: 'Sara Abdullah', points: 4500, level: 42, streak: 12, trend: 'up' },
    { rank: 2, name: 'Ahmed Al Sharif', points: 4250, level: 38, streak: 5, trend: 'down' },
    { rank: 3, name: 'Rashid Kareem', points: 3900, level: 35, streak: 8, trend: 'up' },
    { rank: 4, name: 'Mariam Hassan', points: 3100, level: 29, streak: 2, trend: 'up' },
]

export default function SocialPage() {
    const t = useTranslations('venue-admin')

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.social')}</h1>
                    <p className="text-muted-foreground">Community engagement, player partner-matching, and gamification</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Social Shares
                    </Button>
                    <Button className="gap-2">
                        <Trophy className="h-4 w-4" />
                        Reward Tokens
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: Player Matchmaking */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2 shadow-xl border-primary/10">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Handshake className="h-6 w-6 text-primary" />
                                    <div>
                                        <CardTitle>Partner Matching Board</CardTitle>
                                        <CardDescription>Players looking for partners or teams for their bookings</CardDescription>
                                    </div>
                                </div>
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" /> New Post
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {PARTNER_REQUESTS.map(req => (
                                    <div key={req.id} className="group relative flex flex-col gap-4 p-4 border rounded-2xl hover:bg-muted/30 transition-all active:scale-[0.98]">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                                    <AvatarFallback className="bg-primary/5 text-primary text-sm font-bold">{req.image}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-bold flex items-center gap-2">
                                                        {req.name}
                                                        <Badge variant="outline" className="text-[10px] uppercase">{req.level}</Badge>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                                        <MapPin className="h-3 w-3" /> {req.venue} • <span className="text-primary font-medium">{req.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge className="bg-primary/10 text-primary border-none font-bold">
                                                {req.slots} SLOTS OPEN
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="flex-1 gap-2 shadow-lg shadow-primary/10">
                                                <MessageSquare className="h-4 w-4" /> Accept & Join
                                            </Button>
                                            <Button variant="outline" className="h-10 w-10 p-0">
                                                <Share2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="justify-center border-t py-4">
                            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                                View All Public Matches
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none overflow-hidden relative group">
                            <div className="absolute -right-4 -bottom-4 h-32 w-32 rotate-12 bg-white/10 blur-2xl group-hover:bg-white/20 transition-all" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-6 w-6" /> Monthly Challenge
                                </CardTitle>
                                <CardDescription className="text-white/80">Play 10 matches this month to win 5,000 pts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Global Progress</span>
                                        <span>1,245 matches played</span>
                                    </div>
                                    <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden border border-white/30">
                                        <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: '45%' }} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold">
                                    Join Challenge
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="border-2 border-dashed flex flex-col items-center justify-center p-8 text-center gap-4 bg-muted/20">
                            <ShieldAlert className="h-10 w-10 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="font-bold">Community Moderation</p>
                                <p className="text-xs text-muted-foreground">Review player reports and no-show flags to maintain club quality.</p>
                            </div>
                            <Button variant="outline" size="sm">Enter Mod Panel</Button>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Gamification Leaderboard */}
                <div className="space-y-6">
                    <Card className="border-2 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <Sparkles className="h-8 w-8 text-amber-500/20 animate-pulse" />
                        </div>
                        <CardHeader className="bg-muted/50 pb-6">
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" /> Player Leaderboard
                            </CardTitle>
                            <CardDescription>Top rankings across all club members</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[500px]">
                                <div className="divide-y">
                                    {LEADERBOARD.map((p) => (
                                        <div key={p.rank} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm",
                                                    p.rank === 1 ? "bg-amber-100 text-amber-600 border-2 border-amber-500" :
                                                        p.rank === 2 ? "bg-slate-100 text-slate-600 border-2 border-slate-400" :
                                                            p.rank === 3 ? "bg-orange-100 text-orange-600 border-2 border-orange-400" :
                                                                "bg-muted text-muted-foreground"
                                                )}>
                                                    {p.rank}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{p.name}</span>
                                                    <span className="text-xs text-muted-foreground">Level {p.level}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono font-bold text-sm text-primary">{p.points.toLocaleString()} pts</span>
                                                <div className="flex items-center gap-1">
                                                    <Flame className="h-3 w-3 text-orange-500" />
                                                    <span className="text-[10px] font-bold text-orange-600">{p.streak}d Streak</span>
                                                    {p.trend === 'up' ? (
                                                        <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                                                    ) : (
                                                        <TrendingUp className="h-3 w-3 text-red-500 ml-1 rotate-90" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="bg-muted/20 justify-center py-4 border-t">
                            <Button variant="link" size="sm">View Full Rankings</Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-2 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Player Activity Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">428 Match Check-ins</div>
                            <p className="mt-1 text-xs opacity-70">+12% from same day last week</p>
                            <div className="mt-4 flex -space-x-3 overflow-hidden">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Avatar key={i} className="inline-block border-2 border-primary h-8 w-8 ring-2 ring-white/10">
                                        <AvatarFallback className="bg-primary-foreground/10 text-[8px]">U{i}</AvatarFallback>
                                    </Avatar>
                                ))}
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold border-2 border-primary ring-2 ring-white/10">
                                    +423
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
