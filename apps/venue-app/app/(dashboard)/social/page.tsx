'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Sparkles,
    Trophy,
    Users,
    Settings2,
    Award,
    Flame,
    TrendingUp,
    TrendingDown,
    Shield,
    Target,
    Zap,
    Star,
    Gift,
    UserPlus,
    Share2,
    CalendarCheck,
    Cake,
    Repeat,
    Moon,
    Sunrise,
    Rocket,
    Swords,
    Check,
    X,
    Clock,
    AlertTriangle,
    Minus,
    BarChart3,
    Crown,
    Download,
    Plus,
    MoreVertical,
    Pencil,
    Trash2,
    MapPin,
    CheckCircle2,
    XCircle,
    Eye,
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
    Avatar,
    AvatarFallback,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Switch,
    Label,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Textarea,
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@smartclub/ui/use-toast'

// ──────────────────────────────────────
// API Functions
// ──────────────────────────────────────
const venueId = 'venue-1'

async function fetchStats() {
    return apiClient.get(`/venues/${venueId}/gamification/stats`).then(res => res.data)
}
async function fetchPointRules() {
    return apiClient.get(`/venues/${venueId}/gamification/point-rules`).then(res => res.data)
}
async function fetchChallenges() {
    return apiClient.get(`/venues/${venueId}/gamification/challenges`).then(res => res.data)
}
async function fetchBadges() {
    return apiClient.get(`/venues/${venueId}/gamification/badges`).then(res => res.data)
}
async function fetchLeaderboard() {
    return apiClient.get(`/venues/${venueId}/gamification/leaderboard`).then(res => res.data)
}
async function fetchOpenMatches() {
    return apiClient.get(`/venues/${venueId}/gamification/open-matches`).then(res => res.data)
}
async function fetchModeration() {
    return apiClient.get(`/venues/${venueId}/gamification/moderation`).then(res => res.data)
}

// ──────────────────────────────────────
// Icon mapping
// ──────────────────────────────────────
const ACTION_ICONS: Record<string, React.ReactNode> = {
    'calendar-check': <CalendarCheck className="h-4 w-4" />,
    'user-plus': <UserPlus className="h-4 w-4" />,
    'star': <Star className="h-4 w-4" />,
    'flame': <Flame className="h-4 w-4" />,
    'zap': <Zap className="h-4 w-4" />,
    'trophy': <Trophy className="h-4 w-4" />,
    'award': <Award className="h-4 w-4" />,
    'gift': <Gift className="h-4 w-4" />,
    'share-2': <Share2 className="h-4 w-4" />,
    'cake': <Cake className="h-4 w-4" />,
    'repeat': <Repeat className="h-4 w-4" />,
    'moon': <Moon className="h-4 w-4" />,
    'sunrise': <Sunrise className="h-4 w-4" />,
    'rocket': <Rocket className="h-4 w-4" />,
    'swords': <Swords className="h-4 w-4" />,
    'users': <Users className="h-4 w-4" />,
}

const TIER_COLORS: Record<string, string> = {
    bronze: 'bg-orange-100 text-orange-700 border-orange-300',
    silver: 'bg-slate-100 text-slate-700 border-slate-300',
    gold: 'bg-amber-100 text-amber-700 border-amber-300',
    platinum: 'bg-violet-100 text-violet-700 border-violet-300',
    diamond: 'bg-cyan-100 text-cyan-700 border-cyan-300',
}

const CATEGORY_COLORS: Record<string, string> = {
    engagement: 'bg-blue-500/10 text-blue-700 border-blue-200',
    social: 'bg-pink-500/10 text-pink-700 border-pink-200',
    achievement: 'bg-amber-500/10 text-amber-700 border-amber-200',
    loyalty: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
}

const CHALLENGE_STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-500/10 text-green-700 border-green-200',
    scheduled: 'bg-blue-500/10 text-blue-700 border-blue-200',
    completed: 'bg-slate-500/10 text-slate-600 border-slate-200',
    draft: 'bg-orange-500/10 text-orange-600 border-orange-200',
}

const SEVERITY_COLORS: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
}

const MATCH_STATUS_COLORS: Record<string, string> = {
    pending_approval: 'bg-amber-500/10 text-amber-700 border-amber-200',
    approved: 'bg-green-500/10 text-green-700 border-green-200',
    rejected: 'bg-red-500/10 text-red-700 border-red-200',
    expired: 'bg-slate-500/10 text-slate-500 border-slate-200',
    full: 'bg-blue-500/10 text-blue-700 border-blue-200',
}

// ──────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────
export default function GamificationHubPage() {
    const t = useTranslations('venue-admin.gamification')

    const { data: stats } = useQuery({ queryKey: ['gamification-stats'], queryFn: fetchStats })
    const { data: pointRules } = useQuery({ queryKey: ['gamification-point-rules'], queryFn: fetchPointRules })
    const { data: challenges } = useQuery({ queryKey: ['gamification-challenges'], queryFn: fetchChallenges })
    const { data: badges } = useQuery({ queryKey: ['gamification-badges'], queryFn: fetchBadges })
    const { data: leaderboard } = useQuery({ queryKey: ['gamification-leaderboard'], queryFn: fetchLeaderboard })
    const { data: openMatches } = useQuery({ queryKey: ['gamification-open-matches'], queryFn: fetchOpenMatches })
    const { data: moderation } = useQuery({ queryKey: ['gamification-moderation'], queryFn: fetchModeration })

    const statsData = stats?.data || {}
    const pointRulesData = pointRules?.data || []
    const challengesData = challenges?.data || []
    const badgesData = badges?.data || []
    const leaderboardData = leaderboard?.data || []
    const openMatchesData = openMatches?.data || []
    const moderationData = moderation?.data || []

    const pendingModeration = moderationData.filter((m: any) => m.status === 'pending')?.length || 0
    const pendingMatches = openMatchesData.filter((m: any) => m.status === 'pending_approval')?.length || 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {t('leaderboard.exportCSV')}
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Settings2 className="h-4 w-4" />
                        {t('pointRules.title')}
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-80">{t('stats.totalMembers')}</CardTitle>
                        <Users className="h-4 w-4 opacity-80" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsData.totalMembers || 0}</div>
                        <p className="text-xs text-muted-foreground">{statsData.activeMembers30d || 0} active this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.pointsDistributed')}</CardTitle>
                        <Zap className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsData.totalPointsDistributed?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.allTime')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.engagementRate')}</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsData.avgEngagementRate || 0}%</div>
                        <p className="text-xs text-muted-foreground">+{statsData.monthlyGrowth || 0}% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.dailyCheckIns')}</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{statsData.dailyCheckIns || 0}</div>
                        <p className="text-xs text-muted-foreground">+{statsData.dailyCheckInsGrowth || 0}% from yesterday</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="challenges" className="w-full">
                <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
                    <TabsTrigger value="challenges" className="gap-2">
                        <Target className="h-4 w-4" />
                        {t('tabs.challenges')}
                    </TabsTrigger>
                    <TabsTrigger value="pointRules" className="gap-2">
                        <Zap className="h-4 w-4" />
                        {t('tabs.pointRules')}
                    </TabsTrigger>
                    <TabsTrigger value="badges" className="gap-2">
                        <Award className="h-4 w-4" />
                        {t('tabs.badges')}
                    </TabsTrigger>
                    <TabsTrigger value="leaderboard" className="gap-2">
                        <Crown className="h-4 w-4" />
                        {t('tabs.leaderboard')}
                    </TabsTrigger>
                    <TabsTrigger value="openMatches" className="gap-2 relative">
                        <Swords className="h-4 w-4" />
                        {t('tabs.openMatches')}
                        {pendingMatches > 0 && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">{pendingMatches}</span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="moderation" className="gap-2 relative">
                        <Shield className="h-4 w-4" />
                        {t('tabs.moderation')}
                        {pendingModeration > 0 && (
                            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{pendingModeration}</span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="challenges" className="mt-6">
                    <ChallengesTab challenges={challengesData} t={t} />
                </TabsContent>
                <TabsContent value="pointRules" className="mt-6">
                    <PointRulesTab rules={pointRulesData} t={t} />
                </TabsContent>
                <TabsContent value="badges" className="mt-6">
                    <BadgesTab badges={badgesData} t={t} />
                </TabsContent>
                <TabsContent value="leaderboard" className="mt-6">
                    <LeaderboardTab leaderboard={leaderboardData} t={t} />
                </TabsContent>
                <TabsContent value="openMatches" className="mt-6">
                    <OpenMatchesTab matches={openMatchesData} t={t} />
                </TabsContent>
                <TabsContent value="moderation" className="mt-6">
                    <ModerationTab items={moderationData} t={t} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

// ──────────────────────────────────────
// CHALLENGES TAB
// ──────────────────────────────────────
function ChallengesTab({ challenges, t }: { challenges: any[]; t: any }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [showCreate, setShowCreate] = useState(false)

    const activeChallenges = challenges.filter((c) => c.status === 'active')
    const scheduledChallenges = challenges.filter((c) => c.status === 'scheduled')
    const completedChallenges = challenges.filter((c) => c.status === 'completed')

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/gamification/challenges/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gamification-challenges'] })
            toast({ title: t('challenges.form.deleted') })
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">{t('challenges.title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('challenges.description')}</p>
                </div>
                <Button className="gap-2" onClick={() => setShowCreate(true)}>
                    <Plus className="h-4 w-4" />
                    {t('challenges.createChallenge')}
                </Button>
            </div>

            {activeChallenges.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground">{t('challenges.status.active')} ({activeChallenges.length})</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeChallenges.map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} t={t} onDelete={() => deleteMutation.mutate(challenge.id)} />
                        ))}
                    </div>
                </div>
            )}

            {scheduledChallenges.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground">{t('challenges.status.scheduled')} ({scheduledChallenges.length})</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {scheduledChallenges.map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} t={t} onDelete={() => deleteMutation.mutate(challenge.id)} />
                        ))}
                    </div>
                </div>
            )}

            {completedChallenges.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase text-muted-foreground">{t('challenges.status.completed')} ({completedChallenges.length})</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {completedChallenges.map((challenge) => (
                            <ChallengeCard key={challenge.id} challenge={challenge} t={t} onDelete={() => deleteMutation.mutate(challenge.id)} />
                        ))}
                    </div>
                </div>
            )}

            <CreateChallengeDialog open={showCreate} onOpenChange={setShowCreate} t={t} />
        </div>
    )
}

function ChallengeCard({ challenge, t, onDelete }: { challenge: any; t: any; onDelete: () => void }) {
    const progress = challenge.participantCount > 0 ? Math.round((challenge.completionCount / challenge.participantCount) * 100) : 0

    return (
        <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Badge variant="outline" className={cn('mb-2 text-[10px] uppercase font-bold', CHALLENGE_STATUS_COLORS[challenge.status])}>
                            {t(`challenges.status.${challenge.status}`)}
                        </Badge>
                        <CardTitle className="text-base">{challenge.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1 text-xs">{challenge.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" /> View Details</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><Pencil className="h-4 w-4" /> {t('challenges.editChallenge')}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive gap-2" onClick={onDelete}><Trash2 className="h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{t('challenges.participants')}</p>
                        <p className="text-lg font-bold">{challenge.participantCount}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{t('challenges.completions')}</p>
                        <p className="text-lg font-bold">{challenge.completionCount}</p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{t('challenges.reward')}</p>
                        <p className="text-lg font-bold text-primary">{(challenge.rewardPoints / 1000).toFixed(0)}k</p>
                    </div>
                </div>
                {challenge.status === 'active' && (
                    <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{t('challenges.types.' + challenge.type)}: {challenge.target}</span>
                            <span>{challenge.endDate}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                    </div>
                )}
            </CardContent>
            {challenge.rewardBadge && (
                <CardFooter className="bg-muted/30 py-2 px-6 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Award className="h-3 w-3" />
                        <span>{challenge.rewardBadge}</span>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}

function CreateChallengeDialog({ open, onOpenChange, t }: { open: boolean; onOpenChange: (v: boolean) => void; t: any }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        const form = new FormData(e.currentTarget)
        try {
            await apiClient.post(`/venues/${venueId}/gamification/challenges`, {
                name: form.get('name'),
                description: form.get('description'),
                type: form.get('type'),
                target: Number(form.get('target')),
                rewardPoints: Number(form.get('rewardPoints')),
                rewardBadge: form.get('rewardBadge') || undefined,
                startDate: form.get('startDate'),
                endDate: form.get('endDate'),
                status: 'active',
            })
            queryClient.invalidateQueries({ queryKey: ['gamification-challenges'] })
            toast({ title: t('challenges.form.created') })
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('challenges.createChallenge')}</DialogTitle>
                    <DialogDescription>{t('challenges.description')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('challenges.form.name')}</Label>
                        <Input name="name" placeholder={t('challenges.form.namePlaceholder')} required />
                    </div>
                    <div className="space-y-2">
                        <Label>{t('challenges.form.description')}</Label>
                        <Textarea name="description" placeholder={t('challenges.form.descriptionPlaceholder')} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('challenges.form.type')}</Label>
                            <select name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" defaultValue="booking_count">
                                <option value="booking_count">{t('challenges.types.booking_count')}</option>
                                <option value="streak">{t('challenges.types.streak')}</option>
                                <option value="referral_count">{t('challenges.types.referral_count')}</option>
                                <option value="tournament">{t('challenges.types.tournament')}</option>
                                <option value="social">{t('challenges.types.social')}</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t('challenges.form.target')}</Label>
                            <Input name="target" type="number" placeholder="10" required dir="ltr" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('challenges.form.rewardPoints')}</Label>
                            <Input name="rewardPoints" type="number" placeholder="5000" required dir="ltr" />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('challenges.form.rewardBadge')}</Label>
                            <Input name="rewardBadge" placeholder={t('challenges.form.rewardBadgePlaceholder')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('challenges.form.startDate')}</Label>
                            <Input name="startDate" type="date" required dir="ltr" />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('challenges.form.endDate')}</Label>
                            <Input name="endDate" type="date" required dir="ltr" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? t('challenges.form.creating') : t('challenges.form.submit')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ──────────────────────────────────────
// POINT RULES TAB
// ──────────────────────────────────────
function PointRulesTab({ rules, t }: { rules: any[]; t: any }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
            await apiClient.put(`/gamification/point-rules/${id}`, { isEnabled })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gamification-point-rules'] })
            toast({ title: t('pointRules.saved') })
        },
    })

    const groupedRules = rules.reduce((acc: Record<string, any[]>, rule: any) => {
        const cat = rule.category || 'engagement'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(rule)
        return acc
    }, {})

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('pointRules.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('pointRules.description')}</p>
            </div>

            {Object.entries(groupedRules).map(([category, categoryRules]) => (
                <Card key={category} className="border-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Badge variant="outline" className={cn('text-[10px] uppercase font-bold', CATEGORY_COLORS[category])}>
                                {t(`pointRules.categories.${category}`)}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {(categoryRules as any[]).map((rule: any) => (
                                <div key={rule.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {ACTION_ICONS[rule.icon] || <Zap className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{rule.action}</p>
                                            <p className="text-xs text-muted-foreground">{rule.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-lg text-primary">+{rule.points}</span>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('pointRules.points')}</p>
                                        </div>
                                        <Switch
                                            checked={rule.isEnabled}
                                            onCheckedChange={(checked) => toggleMutation.mutate({ id: rule.id, isEnabled: checked })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// ──────────────────────────────────────
// BADGES TAB
// ──────────────────────────────────────
function BadgesTab({ badges, t }: { badges: any[]; t: any }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('badges.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('badges.description')}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {badges.map((badge: any) => (
                    <Card key={badge.id} className="overflow-hidden border-2 hover:border-primary/30 transition-all text-center">
                        <CardContent className="pt-6 pb-4 px-4 space-y-3">
                            <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2', TIER_COLORS[badge.tier])}>
                                {ACTION_ICONS[badge.icon] ? <div className="scale-150">{ACTION_ICONS[badge.icon]}</div> : <Award className="h-7 w-7" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{badge.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                            </div>
                            <Badge variant="outline" className={cn('text-[10px] uppercase font-bold', TIER_COLORS[badge.tier])}>
                                {t(`badges.tiers.${badge.tier}`)}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-bold text-foreground">{badge.earnedCount}</span> {t('badges.earned')}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// ──────────────────────────────────────
// LEADERBOARD TAB
// ──────────────────────────────────────
function LeaderboardTab({ leaderboard, t }: { leaderboard: any[]; t: any }) {
    const RANK_STYLES: Record<number, string> = {
        1: 'bg-amber-100 text-amber-700 border-2 border-amber-400',
        2: 'bg-slate-100 text-slate-700 border-2 border-slate-400',
        3: 'bg-orange-100 text-orange-700 border-2 border-orange-400',
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">{t('leaderboard.title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('leaderboard.description')}</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('leaderboard.exportCSV')}
                </Button>
            </div>

            <Card className="border-2 shadow-xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-[60px]">{t('leaderboard.rank')}</TableHead>
                                <TableHead>{t('leaderboard.player')}</TableHead>
                                <TableHead className="text-center">{t('leaderboard.level')}</TableHead>
                                <TableHead className="text-center">{t('leaderboard.streak')}</TableHead>
                                <TableHead className="text-center hidden md:table-cell">{t('leaderboard.matches')}</TableHead>
                                <TableHead className="text-center hidden md:table-cell">{t('leaderboard.badges')}</TableHead>
                                <TableHead className="text-center">{t('leaderboard.trend')}</TableHead>
                                <TableHead className="text-right">{t('leaderboard.points')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((entry: any) => (
                                <TableRow key={entry.rank} className={cn('hover:bg-muted/30 transition-colors', entry.rank <= 3 && 'bg-primary/[0.02]')}>
                                    <TableCell>
                                        <div className={cn('h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm', RANK_STYLES[entry.rank] || 'bg-muted text-muted-foreground')}>
                                            {entry.rank}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                    {entry.name.split(' ').map((n: string) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm">{entry.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{t('leaderboard.memberSince')}: {entry.memberSince}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="font-mono text-xs">{entry.level}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {entry.streak > 0 ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <Flame className="h-3 w-3 text-orange-500" />
                                                <span className="text-xs font-bold text-orange-600">{entry.streak}d</span>
                                            </div>
                                        ) : (
                                            <Minus className="h-4 w-4 text-muted-foreground mx-auto" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center hidden md:table-cell font-mono text-sm">{entry.matchesPlayed}</TableCell>
                                    <TableCell className="text-center hidden md:table-cell font-mono text-sm">{entry.badgeCount}</TableCell>
                                    <TableCell className="text-center">
                                        {entry.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />}
                                        {entry.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />}
                                        {entry.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground mx-auto" />}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-mono font-bold text-primary">{entry.points.toLocaleString()}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

// ──────────────────────────────────────
// OPEN MATCHES TAB
// ──────────────────────────────────────
function OpenMatchesTab({ matches, t }: { matches: any[]; t: any }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const updateMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await apiClient.put(`/gamification/open-matches/${id}`, { status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gamification-open-matches'] })
            toast({ title: 'Match status updated' })
        },
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('openMatches.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('openMatches.description')}</p>
            </div>

            {matches.length === 0 ? (
                <Card className="border-2 border-dashed p-12 text-center">
                    <Swords className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="font-bold">{t('openMatches.noRequests')}</p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {matches.map((match: any) => (
                        <Card key={match.id} className={cn('border-2 overflow-hidden transition-all', match.status === 'pending_approval' && 'border-amber-200 shadow-amber-50 shadow-lg')}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-11 w-11 border-2 border-background shadow-md">
                                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                                {match.hostName.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-sm">{match.hostName}</p>
                                                <Badge variant="outline" className="text-[10px] uppercase">{match.hostLevel}</Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3" /> {match.courtPreference} &bull; {match.sportType}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={cn('text-[10px] uppercase font-bold', MATCH_STATUS_COLORS[match.status])}>
                                        {t(`openMatches.status.${match.status}`)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-lg bg-muted/50 p-2">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Date</p>
                                        <p className="text-sm font-bold">{match.date}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-2">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Time</p>
                                        <p className="text-sm font-bold">{match.startTime} - {match.endTime}</p>
                                    </div>
                                    <div className="rounded-lg bg-muted/50 p-2">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">{t('openMatches.slots')}</p>
                                        <p className="text-sm font-bold">{match.slotsFilled}/{match.slotsTotal}</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <Badge variant="secondary" className="text-[10px]">
                                        {match.isCompetitive ? t('openMatches.competitive') : t('openMatches.casual')}
                                    </Badge>
                                </div>
                            </CardContent>
                            {match.status === 'pending_approval' && (
                                <CardFooter className="border-t bg-muted/20 py-3 gap-2">
                                    <Button size="sm" className="flex-1 gap-2" onClick={() => updateMutation.mutate({ id: match.id, status: 'approved' })}>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {t('openMatches.approve')}
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1 gap-2" onClick={() => updateMutation.mutate({ id: match.id, status: 'rejected' })}>
                                        <XCircle className="h-4 w-4" />
                                        {t('openMatches.reject')}
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

// ──────────────────────────────────────
// MODERATION TAB
// ──────────────────────────────────────
function ModerationTab({ items, t }: { items: any[]; t: any }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const updateMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await apiClient.put(`/gamification/moderation/${id}`, { status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gamification-moderation'] })
            toast({ title: 'Moderation item updated' })
        },
    })

    const pendingItems = items.filter((i: any) => i.status === 'pending')
    const resolvedItems = items.filter((i: any) => i.status !== 'pending')

    const TYPE_ICONS: Record<string, React.ReactNode> = {
        no_show: <Clock className="h-4 w-4" />,
        inappropriate: <AlertTriangle className="h-4 w-4" />,
        spam: <X className="h-4 w-4" />,
        dispute: <Swords className="h-4 w-4" />,
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('moderation.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('moderation.description')}</p>
            </div>

            {items.length === 0 ? (
                <Card className="border-2 border-dashed p-12 text-center">
                    <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="font-bold">{t('moderation.noItems')}</p>
                </Card>
            ) : (
                <div className="space-y-6">
                    {pendingItems.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                {t('moderation.status.pending')} ({pendingItems.length})
                            </h3>
                            <div className="space-y-3">
                                {pendingItems.map((item: any) => (
                                    <Card key={item.id} className="border-2 border-red-100">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl shrink-0', SEVERITY_COLORS[item.severity])}>
                                                    {TYPE_ICONS[item.type]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Badge variant="outline" className="text-[10px] uppercase font-bold">{t(`moderation.types.${item.type}`)}</Badge>
                                                        <Badge variant="outline" className={cn('text-[10px] uppercase font-bold', SEVERITY_COLORS[item.severity])}>{t(`moderation.severity.${item.severity}`)}</Badge>
                                                    </div>
                                                    <p className="font-medium text-sm mt-1">{item.reportedUser}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-2">{t('moderation.reportedBy')}: {item.reportedBy} &bull; {new Date(item.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <Button size="sm" className="gap-1" onClick={() => updateMutation.mutate({ id: item.id, status: 'resolved' })}>
                                                        <Check className="h-3 w-3" />
                                                        {t('moderation.resolve')}
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="gap-1" onClick={() => updateMutation.mutate({ id: item.id, status: 'dismissed' })}>
                                                        <X className="h-3 w-3" />
                                                        {t('moderation.dismiss')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {resolvedItems.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase text-muted-foreground">{t('moderation.status.resolved')} / {t('moderation.status.dismissed')} ({resolvedItems.length})</h3>
                            <div className="space-y-3">
                                {resolvedItems.map((item: any) => (
                                    <Card key={item.id} className="border bg-muted/20 opacity-60">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted shrink-0">
                                                    {TYPE_ICONS[item.type]}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] uppercase">{t(`moderation.types.${item.type}`)}</Badge>
                                                        <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                                                            {t(`moderation.status.${item.status}`)}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm mt-1">{item.reportedUser} — {item.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
