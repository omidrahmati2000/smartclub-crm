'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Download, FileText } from 'lucide-react';
import { ReportPeriod } from '@smartclub/types';
import { useToast } from '@smartclub/ui/use-toast';

interface ExportButtonsProps {
  period: ReportPeriod;
  reportType: 'revenue' | 'occupancy';
}

export function ExportButtons({ period, reportType }: ExportButtonsProps) {
  const t = useTranslations('venue-admin.finance.export');
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'CSV' | 'PDF') => {
    setIsExporting(true);

    try {
      // TODO: Implement actual export logic with MSW
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (format === 'PDF') {
        toast({
          title: 'Coming Soon',
          description: 'PDF export will be available soon.',
        });
      } else {
        toast({
          title: t('success'),
          description: `${reportType === 'revenue' ? 'Revenue' : 'Occupancy'} report downloaded`,
        });
      }
    } catch (error) {
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
