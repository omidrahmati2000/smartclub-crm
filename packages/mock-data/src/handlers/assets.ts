import { http, HttpResponse } from 'msw';
import { mockAssets } from '../fixtures/venues';
import type { Asset } from '@smartclub/types';

// In-memory storage for assets (initialized with fixtures)
const assetsStore: Asset[] = [...mockAssets];

export const assetHandlers = [
  // Get all assets for a venue
  http.get('/api/venues/:venueId/assets', ({ params }) => {
    const assets = assetsStore.filter((a) => a.venueId === params.venueId);

    return HttpResponse.json({
      data: assets,
      success: true,
    });
  }),

  // Get single asset
  http.get('/api/assets/:assetId', ({ params }) => {
    const asset = assetsStore.find((a) => a.id === params.assetId);

    if (!asset) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Asset not found',
          statusCode: 404,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      data: asset,
      success: true,
    });
  }),

  // Create new asset
  http.post('/api/venues/:venueId/assets', async ({ request, params }) => {
    const body = (await request.json()) as any;

    const newAsset: Asset = {
      id: `asset-${Date.now()}`,
      venueId: params.venueId as string,
      name: body.name,
      type: body.type,
      bookingType: body.bookingType,
      pricePerSlot: body.pricePerSlot,
      pricePerHour: body.pricePerHour,
      pricePerSession: body.pricePerSession,
      pricePerMinute: body.pricePerMinute,
      currency: body.currency || 'IRT',
      capacity: body.capacity,
      minDuration: body.minDuration,
      maxDuration: body.maxDuration,
      slotDuration: body.slotDuration,
      customAttributes: body.customAttributes,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assetsStore.push(newAsset);

    return HttpResponse.json({
      data: newAsset,
      success: true,
      message: 'Asset created successfully',
    });
  }),

  // Update asset
  http.put('/api/assets/:assetId', async ({ request, params }) => {
    const body = (await request.json()) as any;
    const assetIndex = assetsStore.findIndex((a) => a.id === params.assetId);

    if (assetIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Asset not found',
          statusCode: 404,
        },
        { status: 404 },
      );
    }

    const updatedAsset: Asset = {
      ...assetsStore[assetIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    assetsStore[assetIndex] = updatedAsset;

    return HttpResponse.json({
      data: updatedAsset,
      success: true,
      message: 'Asset updated successfully',
    });
  }),

  // Delete asset
  http.delete('/api/assets/:assetId', ({ params }) => {
    const assetIndex = assetsStore.findIndex((a) => a.id === params.assetId);

    if (assetIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Asset not found',
          statusCode: 404,
        },
        { status: 404 },
      );
    }

    assetsStore.splice(assetIndex, 1);

    return HttpResponse.json({
      success: true,
      message: 'Asset deleted successfully',
    });
  }),

  // Toggle asset status
  http.patch('/api/assets/:assetId/status', ({ params }) => {
    const assetIndex = assetsStore.findIndex((a) => a.id === params.assetId);

    if (assetIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: 'Asset not found',
          statusCode: 404,
        },
        { status: 404 },
      );
    }

    assetsStore[assetIndex].isActive = !assetsStore[assetIndex].isActive;
    assetsStore[assetIndex].updatedAt = new Date().toISOString();

    return HttpResponse.json({
      data: assetsStore[assetIndex],
      success: true,
      message: 'Asset status updated successfully',
    });
  }),
];
