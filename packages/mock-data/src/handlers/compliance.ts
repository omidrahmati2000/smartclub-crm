import { http, HttpResponse } from 'msw';
import type {
  VenueComplianceSettings,
  DataDeletionRequest,
  DataExportRequest,
} from '@smartclub/types';
import { getDefaultGDPRSettings } from '@smartclub/types';
import { mockVenueSettings } from '../fixtures/venue-settings';

// In-memory storage for requests
const dataDeletionRequests: DataDeletionRequest[] = [];
const dataExportRequests: DataExportRequest[] = [];

/**
 * Compliance and GDPR API handlers
 */
export const complianceHandlers = [
  // GET /api/venues/:venueId/compliance
  http.get('/api/venues/:venueId/compliance', ({ params }) => {
    const { venueId } = params;
    const settings = mockVenueSettings[venueId as string];

    if (!settings) {
      return HttpResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Return compliance settings or default
    const complianceSettings =
      settings.complianceSettings || getDefaultComplianceSettings(venueId as string);

    return HttpResponse.json({
      success: true,
      data: complianceSettings,
    });
  }),

  // PUT /api/venues/:venueId/compliance
  http.put('/api/venues/:venueId/compliance', async ({ params, request }) => {
    const { venueId } = params;
    const updates = (await request.json()) as Partial<VenueComplianceSettings>;

    const settings = mockVenueSettings[venueId as string];

    if (!settings) {
      return HttpResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update compliance settings
    const updatedSettings: VenueComplianceSettings = {
      ...(settings.complianceSettings || getDefaultComplianceSettings(venueId as string)),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    settings.complianceSettings = updatedSettings;

    return HttpResponse.json({
      success: true,
      data: updatedSettings,
    });
  }),

  // GET /api/venues/:venueId/compliance/gdpr
  http.get('/api/venues/:venueId/compliance/gdpr', ({ params }) => {
    const { venueId } = params;
    const settings = mockVenueSettings[venueId as string];

    if (!settings) {
      return HttpResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    const gdprSettings =
      settings.complianceSettings?.gdprSettings || getDefaultGDPRSettings();

    return HttpResponse.json({
      success: true,
      data: {
        enabled: settings.complianceSettings?.gdprEnabled ?? false,
        settings: gdprSettings,
      },
    });
  }),

  // POST /api/venues/:venueId/gdpr/data-export-request
  http.post(
    '/api/venues/:venueId/gdpr/data-export-request',
    async ({ params, request }) => {
      const { venueId } = params;
      const body = (await request.json()) as {
        customerId: string;
        format: 'JSON' | 'CSV' | 'PDF';
      };

      const newRequest: DataExportRequest = {
        id: `export-${Date.now()}`,
        customerId: body.customerId,
        venueId: venueId as string,
        requestedAt: new Date().toISOString(),
        status: 'pending',
        format: body.format,
      };

      dataExportRequests.push(newRequest);

      // Simulate processing - in real app this would be async
      setTimeout(() => {
        const req = dataExportRequests.find((r) => r.id === newRequest.id);
        if (req) {
          req.status = 'completed';
          req.downloadUrl = `/api/gdpr/exports/${req.id}/download`;
          req.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        }
      }, 2000);

      return HttpResponse.json({
        success: true,
        data: newRequest,
        message: 'Data export request submitted successfully',
      });
    }
  ),

  // POST /api/venues/:venueId/gdpr/data-deletion-request
  http.post(
    '/api/venues/:venueId/gdpr/data-deletion-request',
    async ({ params, request }) => {
      const { venueId } = params;
      const body = (await request.json()) as {
        customerId: string;
        dataCategoriesToDelete: string[];
        reason?: string;
      };

      const newRequest: DataDeletionRequest = {
        id: `delete-${Date.now()}`,
        customerId: body.customerId,
        venueId: venueId as string,
        requestedAt: new Date().toISOString(),
        status: 'pending',
        dataCategoriesToDelete: body.dataCategoriesToDelete,
        identityVerified: false,
      };

      dataDeletionRequests.push(newRequest);

      return HttpResponse.json({
        success: true,
        data: newRequest,
        message:
          'Data deletion request submitted. You will receive a verification email.',
      });
    }
  ),

  // GET /api/venues/:venueId/gdpr/deletion-requests
  http.get('/api/venues/:venueId/gdpr/deletion-requests', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let requests = dataDeletionRequests.filter((r) => r.venueId === venueId);

    if (status) {
      requests = requests.filter((r) => r.status === status);
    }

    return HttpResponse.json({
      success: true,
      data: requests,
      total: requests.length,
    });
  }),

  // PUT /api/venues/:venueId/gdpr/deletion-requests/:requestId
  http.put(
    '/api/venues/:venueId/gdpr/deletion-requests/:requestId',
    async ({ params, request }) => {
      const { requestId } = params;
      const body = (await request.json()) as {
        status: 'processing' | 'completed' | 'rejected';
        rejectionReason?: string;
        processedBy?: string;
      };

      const requestIndex = dataDeletionRequests.findIndex((r) => r.id === requestId);

      if (requestIndex === -1) {
        return HttpResponse.json(
          { success: false, error: 'Request not found' },
          { status: 404 }
        );
      }

      dataDeletionRequests[requestIndex] = {
        ...dataDeletionRequests[requestIndex],
        status: body.status,
        rejectionReason: body.rejectionReason,
        processedBy: body.processedBy,
        processedAt:
          body.status === 'completed' || body.status === 'rejected'
            ? new Date().toISOString()
            : undefined,
      };

      return HttpResponse.json({
        success: true,
        data: dataDeletionRequests[requestIndex],
      });
    }
  ),

  // GET /api/venues/:venueId/gdpr/export-requests
  http.get('/api/venues/:venueId/gdpr/export-requests', ({ params }) => {
    const { venueId } = params;
    const requests = dataExportRequests.filter((r) => r.venueId === venueId);

    return HttpResponse.json({
      success: true,
      data: requests,
      total: requests.length,
    });
  }),

  // GET /api/venues/:venueId/customers/:customerId/consents
  http.get('/api/venues/:venueId/customers/:customerId/consents', ({ params }) => {
    // Mock consent data
    const consents = [
      {
        id: 'consent-1',
        categoryId: 'necessary',
        granted: true,
        grantedAt: new Date().toISOString(),
      },
      {
        id: 'consent-2',
        categoryId: 'marketing',
        granted: false,
      },
      {
        id: 'consent-3',
        categoryId: 'analytics',
        granted: true,
        grantedAt: new Date().toISOString(),
      },
    ];

    return HttpResponse.json({
      success: true,
      data: consents,
    });
  }),

  // PUT /api/venues/:venueId/customers/:customerId/consents/:categoryId
  http.put(
    '/api/venues/:venueId/customers/:customerId/consents/:categoryId',
    async ({ params, request }) => {
      const { categoryId } = params;
      const body = (await request.json()) as { granted: boolean };

      return HttpResponse.json({
        success: true,
        data: {
          id: `consent-${Date.now()}`,
          categoryId,
          granted: body.granted,
          grantedAt: body.granted ? new Date().toISOString() : undefined,
          revokedAt: !body.granted ? new Date().toISOString() : undefined,
        },
      });
    }
  ),
];

/**
 * Get default compliance settings for a venue
 */
function getDefaultComplianceSettings(venueId: string): VenueComplianceSettings {
  return {
    id: `compliance-${venueId}`,
    venueId,
    gdprEnabled: false,
    ageVerificationRequired: false,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };
}
