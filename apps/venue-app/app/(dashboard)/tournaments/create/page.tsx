'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Trophy, Calendar, Users, Info, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@smartclub/ui'
import { cn, localizedFetch } from '@smartclub/utils'

export default function CreateTournamentPage() {
    const t = useTranslations('venue-admin.tournaments.create')
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const STEPS = [
        { id: 'basic', label: t('steps.basic'), icon: Info },
        { id: 'format', label: t('steps.format'), icon: Trophy },
        { id: 'schedule', label: t('steps.schedule'), icon: Calendar },
        { id: 'registration', label: t('steps.registration'), icon: Users },
    ]

    const [formData, setFormData] = useState({
        name: '',
        sport: 'padel',
        description: '',
        format: 'single_elimination',
        metric: 'points',
        startDate: '',
        endDate: '',
        assets: [] as string[],
        entryFee: '',
        maxParticipants: '16',
        registrationDeadline: ''
    })

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            // Submit form
            setIsLoading(true)
            try {
                const res = await localizedFetch('/api/tournaments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                const result = await res.json()
                if (result.success) {
                    router.push('/tournaments')
                    router.refresh()
                }
            } catch (error) {
                console.error('Failed to create tournament:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        } else {
            router.back()
        }
    }

    return (
        <div className="mx-auto max-w-4xl py-6">
            <div className="mb-8">
                <Button variant="ghost" onClick={handleBack} className="mb-4">
                    <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" />
                    {t('actions.back')}
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            </div>

            {/* Stepper */}
            <div className="relative mb-8 pb-4">
                <div className="absolute top-5 left-0 h-0.5 w-full bg-secondary" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon
                        const isCompleted = index < currentStep
                        const isActive = index === currentStep

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                                        isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                            isActive ? "bg-background border-primary text-primary" :
                                                "bg-background border-secondary text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                <span className={cn(
                                    "mt-2 text-xs font-medium",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{STEPS[currentStep].label}</CardTitle>
                    <CardDescription>
                        {/* Dynamic description could be added here if needed */}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('fields.name')}</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="e.g. Summer Smash Padel Open"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sport">{t('fields.sport')}</Label>
                                <Select value={formData.sport} onValueChange={(v) => updateField('sport', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="padel">Padel</SelectItem>
                                        <SelectItem value="tennis">Tennis</SelectItem>
                                        <SelectItem value="football">Football</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">{t('fields.description')}</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Tell players what to expect..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                { id: 'single_elimination', title: t('formats.singleTitle'), desc: t('formats.singleDesc'), color: 'from-blue-500/20' },
                                { id: 'double_elimination', title: t('formats.doubleTitle'), desc: t('formats.doubleDesc'), color: 'from-purple-500/20' },
                                { id: 'round_robin', title: t('formats.roundTitle'), desc: t('formats.roundDesc'), color: 'from-orange-500/20' },
                                { id: 'americano', title: t('formats.americanoTitle'), desc: t('formats.americanoDesc'), color: 'from-green-500/20' },
                                { id: 'mexicano', title: t('formats.mexicanoTitle'), desc: t('formats.mexicanoDesc'), color: 'from-pink-500/20' },
                            ].map((format) => (
                                <div
                                    key={format.id}
                                    className={cn(
                                        "group relative flex cursor-pointer items-start space-x-3 rounded-xl border-2 p-4 transition-all hover:border-primary hover:shadow-md",
                                        formData.format === format.id ? "border-primary bg-primary/5" : `bg-gradient-to-br ${format.color} to-transparent`
                                    )}
                                    onClick={() => updateField('format', format.id)}
                                >
                                    <div className="flex-1">
                                        <div className="font-bold text-lg group-hover:text-primary transition-colors">{format.title}</div>
                                        <div className="text-sm text-muted-foreground">{format.desc}</div>
                                    </div>
                                    <div className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted group-hover:border-primary",
                                        formData.format === format.id ? "bg-primary border-primary" : "group-hover:bg-primary"
                                    )}>
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            formData.format === format.id ? "bg-white" : "bg-transparent group-hover:bg-white"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>{t('fields.startDate')}</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => updateField('startDate', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('fields.endDate')}</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => updateField('endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('fields.assets')}</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Court 1', 'Court 2', 'Court 3', 'Court 4'].map((court) => (
                                        <div key={court} className="flex items-center space-x-2 border rounded p-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={formData.assets.includes(court)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        updateField('assets', [...formData.assets, court])
                                                    } else {
                                                        updateField('assets', formData.assets.filter(a => a !== court))
                                                    }
                                                }}
                                            />
                                            <span className="text-sm">{court}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>{t('fields.entryFee')}</Label>
                                    <Input
                                        type="number"
                                        placeholder="500,000"
                                        value={formData.entryFee}
                                        onChange={(e) => updateField('entryFee', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>{t('fields.maxParticipants')}</Label>
                                    <Input
                                        type="number"
                                        placeholder="32"
                                        value={formData.maxParticipants}
                                        onChange={(e) => updateField('maxParticipants', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>{t('fields.registrationDeadline')}</Label>
                                <Input
                                    type="datetime-local"
                                    value={formData.registrationDeadline}
                                    onChange={(e) => updateField('registrationDeadline', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                        {currentStep === 0 ? t('actions.cancel') : t('actions.back')}
                    </Button>
                    <Button onClick={handleNext} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {currentStep === STEPS.length - 1 ? t('actions.create') : t('actions.next')}
                        {currentStep !== STEPS.length - 1 && <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
