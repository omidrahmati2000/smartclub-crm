'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Download, FileText } from 'lucide-react';
import { ReportPeriod } from '@smartclub/types';
import { useToast } from '@smartclub/ui/use-toast';
import { apiClient } from '@/lib/api-client';

interface ExportButtonsProps {
  period: ReportPeriod;
  reportType: 'revenue' | 'occupancy';
}

export function ExportButtons({ period, reportType }: ExportButtonsProps) {
  const t = useTranslations('venue-admin.finance.export');
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'CSV' | 'PDF') => {
    const venueId = session?.user?.venueId;
    if (!venueId) return;

    setIsExporting(true);

    try {
      const params = new URLSearchParams({
        format,
        reportType: reportType.toUpperCase(),
        period,
      });

      // Note: For text/blob responses, we still need to use fetch directly
      const response = await fetch(`/api/venues/${venueId}/reports/export?${params}`);

      if (format === 'CSV') {
        const csv = await response.text();
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: t('success'),
          description: t('downloadStarted'),
        });
      } else {
        toast({
          title: t('comingSoon'),
          description: t('pdfComingSoon'),
        });
      }
    } catch {
      toast({
        title: t('error'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('CSV')}
        disabled={isExporting}
      >
        <Download className="h-4 w-4 ml-2" />
        {isExporting ? t('exporting') : t('exportCSV')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('PDF')}
        disabled={isExporting}
      >
        <FileText className="h-4 w-4 ml-2" />
        {t('exportPDF')}
      </Button>
    </div>
  );
}
