'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
    Input,
    Label,
    Tabs,
    TabsList,
    TabsTrigger,
    Badge
} from '@smartclub/ui'
import { CheckCircle2, Loader2, UserPlus, Users } from 'lucide-react'

interface RegistrationDialogProps {
    isOpen: boolean
    onClose: () => void
    tournament: {
        name: string
        price: string
        format: string
    }
}

export function RegistrationDialog({ isOpen, onClose, tournament }: RegistrationDialogProps) {
    const t = useTranslations('tournament.registration')
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [isLoading, setIsLoading] = useState(false)
    const [regType, setRegType] = useState<'individual' | 'pair'>('individual')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        setStep('success')
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose()
                setTimeout(() => setStep('form'), 300)
            }
        }}>
            <DialogContent className="sm:max-w-[500px] overflow-hidden">
                {step === 'form' ? (
                    <>
                        <DialogHeader className="text-start">
                            <DialogTitle className="text-2xl font-black">{t('title', { name: tournament.name })}</DialogTitle>
                            <DialogDescription>
                                {t('description')}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-4">
                                <Label>{t('typeLabel')}</Label>
                                <Tabs value={regType} onValueChange={(v) => setRegType(v as any)} className="w-full">
                                    <TabsList className="grid grid-cols-2 w-full h-20 p-1 bg-muted/50 rounded-xl">
                                        <TabsTrigger value="individual" className="flex flex-col gap-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <UserPlus className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">{t('individual')}</span>
                                                <span className="text-[10px] opacity-60 font-normal">{t('individualDesc')}</span>
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="pair" className="flex flex-col gap-1 h-full rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Users className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs">{t('pair')}</span>
                                                <span className="text-[10px] opacity-60 font-normal">{t('pairDesc')}</span>
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('fullName')}</Label>
                                    <Input id="name" placeholder="John Doe" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('phone')}</Label>
                                    <Input id="phone" type="tel" placeholder="0912..." required />
                                </div>

                                {regType === 'pair' && (
                                    <div className="pt-4 mt-2 border-t space-y-4 animate-in slide-in-from-top-2 duration-300">
                                        <h4 className="font-bold text-sm flex items-center gap-2 text-primary">
                                            <Users className="h-4 w-4" /> {t('partnerDetails')}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="pname">{t('partnerName')}</Label>
                                                <Input id="pname" placeholder="Jane Doe" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pphone">{t('partnerPhone')}</Label>
                                                <Input id="pphone" type="tel" placeholder="0912..." required />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-xl bg-primary/5 p-4 border border-primary/20">
                                <div className="flex justify-between items-center text-start">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t('fee')}</span>
                                        <span className="text-2xl font-black text-primary">{tournament.price}</span>
                                    </div>
                                    <Badge variant="outline" className="bg-background">{t('secured')}</Badge>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0 pt-2">
                                <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading} className="flex-1 sm:flex-none">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 sm:min-w-[150px] font-bold" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        </>
                                    ) : (
                                        t('submit')
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
                        <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">{t('successTitle')}</h2>
                        <p className="text-muted-foreground max-w-[300px] mb-8">
                            {t('successDesc', { name: tournament.name })}
                        </p>
                        <Button className="w-full h-12 font-bold text-lg" onClick={onClose}>
                            {t('awesome')}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
