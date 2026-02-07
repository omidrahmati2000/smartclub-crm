'use client'

import { useTranslations } from 'next-intl'
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Switch,
} from '@smartclub/ui'

export function SettingsTab() {
    const t = useTranslations('venue-admin')

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('shop.settings.general')}</CardTitle>
                    <CardDescription>Configure shop and POS settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('shop.settings.enableShop')}</Label>
                            <p className="text-sm text-muted-foreground">
                                Enable shop and POS functionality
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('shop.settings.taxEnabled')}</Label>
                            <p className="text-sm text-muted-foreground">
                                Apply tax on product sales
                            </p>
                        </div>
                        <Switch />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('shop.settings.taxRate')}</Label>
                        <Input type="number" placeholder="5" className="max-w-[200px]" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t('shop.settings.receipt')}</CardTitle>
                    <CardDescription>Customize receipt appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('shop.settings.receiptHeader')}</Label>
                        <Input placeholder="Thank you for your purchase!" />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('shop.settings.receiptFooter')}</Label>
                        <Input placeholder="Visit us again soon!" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>{t('shop.settings.submit')}</Button>
            </div>
        </div>
    )
}
