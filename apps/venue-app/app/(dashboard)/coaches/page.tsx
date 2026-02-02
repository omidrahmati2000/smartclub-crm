'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    GraduationCap,
    Search,
    Plus,
    Calendar,
    Star,
    Users,
    Clock,
    Award,
    BookOpen,
    Mail,
    MoreVertical
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
    AvatarImage,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@smartclub/ui'

// Mock Data
const COACHES = [
    {
        id: 'c1',
        name: 'Juan Carlos',
        specialty: 'Professional Padel',
        rating: 4.9,
        reviews: 124,
        students: 45,
        level: 'Elite',
        experience: '12 Years',
        image: 'JC'
    },
    {
        id: 'c2',
        name: 'Sarah Smith',
        specialty: 'Junior Academy',
        rating: 4.8,
        reviews: 89,
        students: 62,
        level: 'Head Coach',
        experience: '8 Years',
        image: 'SS'
    },
    {
        id: 'c3',
        name: 'Marco Rossi',
        specialty: 'Strategy & Tactics',
        rating: 4.7,
        reviews: 56,
        students: 28,
        level: 'Advanced',
        experience: '15 Years',
        image: 'MR'
    },
]

const CLASSES = [
    { id: 'l1', title: 'Beginner Workshop', coach: 'Sarah Smith', time: 'Monday 10:00', price: 150000, students: '8/10' },
    { id: 'l2', title: 'Pro Drills', coach: 'Juan Carlos', time: 'Wednesday 18:00', price: 450000, students: '4/4' },
    { id: 'l3', title: 'Tactical Analysis', coach: 'Marco Rossi', time: 'Saturday 14:00', price: 300000, students: '5/8' },
]

export default function CoachesPage() {
    const t = useTranslations('venue-admin')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.coaches')}</h1>
                    <p className="text-muted-foreground">Manage training programs, professional coaches, and academies</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Academy Settings
                    </Button>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Register New Coach
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="coaches" className="w-full">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="coaches" className="gap-2">
                        <Users className="h-4 w-4" />
                        Coach Roster
                    </TabsTrigger>
                    <TabsTrigger value="classes" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Scheduled Classes
                    </TabsTrigger>
                    <TabsTrigger value="curriculum" className="gap-2">
                        <Award className="h-4 w-4" />
                        Training Levels
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="coaches" className="mt-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search coaches by name or specialty..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {COACHES.map(coach => (
                            <Card key={coach.id} className="overflow-hidden border-2 hover:border-primary transition-all group">
                                <CardHeader className="p-0">
                                    <div className="bg-muted h-32 flex items-center justify-center text-4xl font-bold text-muted-foreground/30 group-hover:bg-primary/5 transition-colors">
                                        {coach.image}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{coach.name}</CardTitle>
                                            <CardDescription className="text-primary font-medium">{coach.specialty}</CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                            {coach.level}
                                        </Badge>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground uppercase font-bold">Experience</span>
                                            <span className="text-sm font-semibold">{coach.experience}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground uppercase font-bold">Rating</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-sm font-semibold">{coach.rating}</span>
                                                <span className="text-[10px] text-muted-foreground">({coach.reviews})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{coach.students} Active Students</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 gap-2">
                                    <Button variant="outline" className="flex-1 gap-2">
                                        <Mail className="h-4 w-4" />
                                        Contact
                                    </Button>
                                    <Button className="flex-1">View Schedule</Button>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="classes" className="mt-6">
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle>Upcoming Group Sessions</CardTitle>
                            <CardDescription>Academy classes scheduled for this week</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {CLASSES.map(cls => (
                                    <div key={cls.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Calendar className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{cls.title}</p>
                                                <p className="text-sm text-muted-foreground">{cls.coach} • {cls.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Price</p>
                                                <p className="font-mono font-bold">{cls.price.toLocaleString()} IRT</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Availability</p>
                                                <p className="font-bold">{cls.students}</p>
                                            </div>
                                            <Button variant="ghost">Manage</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function Filter(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    )
}
