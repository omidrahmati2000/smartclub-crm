'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label } from '@smartclub/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Currency,
  CURRENCY_CONFIGS,
  PaymentGateway,
  PAYMENT_GATEWAY_CONFIGS,
  getPaymentGatewayConfig,
  gatewaySupports,
  type VenuePaymentSettings,
  type GatewayCredentials,
} from '@smartclub/types';
import { getPaymentSettings, updatePaymentSettings } from '../services/payment-settings';

const MOCK_VENUE_ID = 'venue-1';

export function PaymentSettingsForm() {
  const t = useTranslations('venue-admin.settings.payment');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.IRT);
  const [enabledGateways, setEnabledGateways] = useState<PaymentGateway[]>([]);
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptCardOnSite, setAcceptCardOnSite] = useState(true);
  const [enableWallet, setEnableWallet] = useState(true);

  // Expanded gateway config (for showing credentials form)
  const [expandedGateway, setExpandedGateway] = useState<PaymentGateway | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['venue', MOCK_VENUE_ID, 'payment-settings'],
    queryFn: async () => {
      const data = await getPaymentSettings(MOCK_VENUE_ID);
      if (data) {
        setSelectedCurrency(data.displayCurrency);
        setEnabledGateways(data.enabledGateways);
        setAcceptCash(data.acceptCash);
        setAcceptCardOnSite(data.acceptCardOnSite);
        setEnableWallet(data.enableWallet);
      }
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<VenuePaymentSettings>) =>
      updatePaymentSettings(MOCK_VENUE_ID, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['venue', MOCK_VENUE_ID, 'payment-settings']);
    },
  });

  const handleSave = async () => {
    await mutation.mutateAsync({
      displayCurrency: selectedCurrency,
      defaultCurrency: selectedCurrency,
      enabledGateways,
      acceptCash,
      acceptCardOnSite,
      enableWallet,
      walletCurrency: selectedCurrency,
    });
  };

  const toggleGateway = (gateway: PaymentGateway) => {
    setEnabledGateways((prev) =>
      prev.includes(gateway) ? prev.filter((g) => g !== gateway) : [...prev, gateway]
    );
  };

  // Group gateways by region
  const gatewaysByRegion = Object.values(PaymentGateway).reduce((acc, gateway) => {
    const config = getPaymentGatewayConfig(gateway);
    if (!acc[config.region]) {
      acc[config.region] = [];
    }
    acc[config.region].push(gateway);
    return acc;
  }, {} as Record<string, PaymentGateway[]>);

  // Filter gateways by selected currency
  const compatibleGateways = Object.values(PaymentGateway).filter((gateway) =>
    gatewaySupports(gateway, selectedCurrency)
  );

  if (isLoading) {
    return <div>{tCommon('loading')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Display Currency */}
      <Card>
        <CardHeader>
          <CardTitle>{t('displayCurrency.title')}</CardTitle>
          <CardDescription>{t('displayCurrency.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayCurrency">{t('displayCurrency.label')}</Label>
            <select
              id="displayCurrency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Object.values(Currency).map((currency) => {
                const config = CURRENCY_CONFIGS[currency];
                return (
                  <option key={currency} value={currency}>
                    {config.name} ({config.symbol}) - {currency}
                  </option>
                );
              })}
            </select>
            <p className="text-xs text-muted-foreground">
              {t('displayCurrency.hint')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle>{t('gateways.title')}</CardTitle>
          <CardDescription>{t('gateways.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show warning if currency changed */}
          {selectedCurrency !== settings?.displayCurrency && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-950 p-4 text-sm text-yellow-800 dark:text-yellow-200">
              {t('gateways.currencyChangeWarning')}
            </div>
          )}

          {/* Gateway list by region */}
          {Object.entries(gatewaysByRegion).map(([region, gateways]) => {
            const compatibleInRegion = gateways.filter((g) => compatibleGateways.includes(g));
            if (compatibleInRegion.length === 0) return null;

            return (
              <div key={region} className="space-y-3">
                <h3 className="text-sm font-semibold capitalize text-muted-foreground">
                  {t(`gateways.regions.${region}`)}
                </h3>
                <div className="space-y-2">
                  {compatibleInRegion.map((gateway) => {
                    const config = getPaymentGatewayConfig(gateway);
                    const isEnabled = enabledGateways.includes(gateway);
                    const isExpanded = expandedGateway === gateway;

                    return (
                      <div
                        key={gateway}
                        className="rounded-lg border border-border p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <input
                              type="checkbox"
                              id={`gateway-${gateway}`}
                              checked={isEnabled}
                              onChange={() => toggleGateway(gateway)}
                              className="mt-1 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`gateway-${gateway}`}
                                className="font-medium cursor-pointer"
                              >
                                {config.name}
                              </label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {config.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('gateways.supportedCurrencies')}:{' '}
                                {config.supportedCurrencies.slice(0, 5).join(', ')}
                                {config.supportedCurrencies.length > 5 && '...'}
                              </p>
                            </div>
                          </div>
                          {isEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setExpandedGateway(isExpanded ? null : gateway)
                              }
                            >
                              {isExpanded ? t('gateways.hideConfig') : t('gateways.configure')}
                            </Button>
                          )}
                        </div>

                        {/* Gateway Configuration (collapsed) */}
                        {isEnabled && isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`${gateway}-test-mode`}>
                                <input
                                  type="checkbox"
                                  id={`${gateway}-test-mode`}
                                  className="mr-2 rounded border-gray-300"
                                />
                                {t('gateways.testMode')}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {t('gateways.testModeHint')}
                              </p>
                            </div>

                            {config.requiresAPIKey && (
                              <div className="space-y-1">
                                <Label htmlFor={`${gateway}-api-key`}>
                                  {t('gateways.fields.apiKey')}
                                </Label>
                                <input
                                  type="password"
                                  id={`${gateway}-api-key`}
                                  placeholder="sk_live_..."
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                              </div>
                            )}

                            {config.requiresSecretKey && (
                              <div className="space-y-1">
                                <Label htmlFor={`${gateway}-secret-key`}>
                                  {t('gateways.fields.secretKey')}
                                </Label>
                                <input
                                  type="password"
                                  id={`${gateway}-secret-key`}
                                  placeholder="whsec_..."
                                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                              </div>
                            )}

                            {config.requiresWebhook && (
                              <div className="space-y-1">
                                <Label htmlFor={`${gateway}-webhook`}>
                                  {t('gateways.fields.webhookUrl')}
                                </Label>
                                <input
                                  type="text"
                                  id={`${gateway}-webhook`}
                                  value={`https://smartclub.ir/api/webhooks/${gateway}`}
                                  readOnly
                                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                  {t('gateways.fields.webhookHint')}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline">
                                {t('gateways.testConnection')}
                              </Button>
                              <a
                                href={config.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center"
                              >
                                {t('gateways.viewDocs')} →
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {compatibleGateways.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {t('gateways.noCompatibleGateways')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Local Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>{t('localMethods.title')}</CardTitle>
          <CardDescription>{t('localMethods.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="acceptCash"
              checked={acceptCash}
              onChange={(e) => setAcceptCash(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="acceptCash" className="font-normal">
              {t('localMethods.cash')}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="acceptCardOnSite"
              checked={acceptCardOnSite}
              onChange={(e) => setAcceptCardOnSite(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="acceptCardOnSite" className="font-normal">
              {t('localMethods.cardOnSite')}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableWallet"
              checked={enableWallet}
              onChange={(e) => setEnableWallet(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="enableWallet" className="font-normal">
              {t('localMethods.wallet')}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? tCommon('saving') : tCommon('saveChanges')}
        </Button>
      </div>

      {mutation.isError && (
        <div className="text-sm text-destructive">
          {tCommon('errorSaving')}
        </div>
      )}

      {mutation.isSuccess && (
        <div className="text-sm text-green-600 dark:text-green-400">
          {tCommon('savedSuccessfully')}
        </div>
      )}
    </div>
  );
}
