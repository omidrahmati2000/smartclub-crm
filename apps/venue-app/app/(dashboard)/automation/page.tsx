'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Cpu,
    Lightbulb,
    DoorOpen,
    Thermometer,
    Power,
    Clock,
    Zap,
    AlertTriangle,
    RefreshCw,
    Settings,
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
    Switch,
    Badge,
    Alert,
    AlertDescription,
    AlertTitle,
    Progress
} from '@smartclub/ui'
import { cn } from '@smartclub/utils'
import { AddAutomationDialog } from './_components/add-automation-dialog'
import { useSession } from 'next-auth/react'

// Mock Data
const DEVICES = [
    { id: 'd1', name: 'Court 1 - Floodlights', type: 'lighting', status: 'on', power: '450W', health: 'good', autoMode: true },
    { id: 'd2', name: 'Court 2 - Floodlights', type: 'lighting', status: 'off', power: '0W', health: 'good', autoMode: true },
    { id: 'd3', name: 'Main Entrance Gate', type: 'access', status: 'locked', power: '24V', health: 'good', autoMode: false },
    { id: 'd4', name: 'Locker Room HVAC', type: 'climate', status: 'on', power: '2.5kW', health: 'warning', autoMode: true },
]

const INITIAL_RULES = [
    { id: 'rule-1', name: 'Night Mode', description: 'All floodlights OFF at 00:00 AM', trigger: 'time', isEnabled: true },
    { id: 'rule-2', name: 'Open House', description: 'Main Gate UNLOCKS at 07:00 AM', trigger: 'time', isEnabled: true },
]

export default function AutomationPage() {
    const t = useTranslations('venue-admin')
    const { data: session } = useSession()
    const venueId = session?.user?.currentVenue || 'venue-1'
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [rules, setRules] = useState(INITIAL_RULES)

    const handleRuleCreated = (newRule: any) => {
        setRules([...rules, newRule])
        setIsDialogOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('nav.automation')}</h1>
                    <p className="text-muted-foreground">Control IoT devices, lighting schedules, and access points</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Refresh Status
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Power Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            3.2 kW
                        </div>
                        <Progress value={65} className="mt-3 h-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {DEVICES.map(device => (
                    <Card key={device.id} className="flex flex-col justify-between overflow-hidden border-2 transition-all hover:border-primary/50">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {device.type === 'lighting' ? <Lightbulb className="h-5 w-5" /> :
                                        device.type === 'access' ? <DoorOpen className="h-5 w-5" /> :
                                            <Thermometer className="h-5 w-5" />}
                                    {device.name}
                                </CardTitle>
                                <CardDescription className="text-xs font-mono mt-1">ID: {device.id.toUpperCase()}</CardDescription>
                            </div>
                            <div className={cn(
                                "h-3 w-3 rounded-full shadow-[0_0_8px]",
                                device.status === 'on' || device.status === 'unlocked' ? "bg-green-500 shadow-green-500" : "bg-red-500 shadow-red-500"
                            )} />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Current State:</span>
                                <Badge variant="outline" className="capitalize font-bold">{device.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Power Draw:</span>
                                <span className="font-mono">{device.power}</span>
                            </div>
                            {device.health === 'warning' && (
                                <Alert variant="destructive" className="py-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle className="text-xs font-bold">Maintenance Required</AlertTitle>
                                </Alert>
                            )}
                        </CardContent>

                        <CardFooter className="bg-muted/30 p-4 pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Switch checked={device.autoMode} />
                                <span className="text-xs font-medium text-muted-foreground">Auto-Sync w/ Bookings</span>
                            </div>
                            <Button size="sm" variant={device.status === 'on' ? "secondary" : "default"} className="h-8 gap-2">
                                <Power className="h-3 w-3" />
                                {device.status === 'on' ? 'Turn Off' : 'Turn On'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card className="border-2 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Schedule Rules
                    </CardTitle>
                    <CardDescription>Define automated behaviors based on time or triggers</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {rules.map(rule => (
                            <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/20 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded text-blue-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{rule.name}</p>
                                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                                    </div>
                                </div>
                                <Switch checked={rule.isEnabled} />
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="ghost" className="w-full gap-2" onClick={() => setIsDialogOpen(true)}>
                        <Plus className="h-4 w-4" /> Add Automation Rule
                    </Button>
                </CardFooter>
            </Card>

            <AddAutomationDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={handleRuleCreated}
                venueId={venueId}
            />
        </div>
    )
}
