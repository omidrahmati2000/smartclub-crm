import { http, HttpResponse } from 'msw';
import { mockTournaments } from '../fixtures/tournaments';

export const tournamentHandlers = [
    // List tournaments
    http.get('/api/tournaments', ({ request }) => {
        const url = new URL(request.url);
        const venueId = url.searchParams.get('venueId');

        let filtered = [...mockTournaments];
        if (venueId) {
            filtered = filtered.filter((t) => t.venueId === venueId);
        }

        return HttpResponse.json({
            success: true,
            data: filtered,
        });
    }),

    // Get single tournament
    http.get('/api/tournaments/:id', ({ params }) => {
        const { id } = params;
        const tournament = mockTournaments.find((t) => t.id === id);

        if (!tournament) {
            return HttpResponse.json(
                { success: false, error: 'Tournament not found' },
                { status: 404 }
            );
        }

        return HttpResponse.json({
            success: true,
            data: tournament,
        });
    }),

    // Create tournament
    http.post('/api/tournaments', async ({ request }) => {
        const dynamicData = (await request.json()) as any;

        const newTournament = {
            ...dynamicData,
            id: `tournament-${Math.random().toString(36).substr(2, 9)}`,
            status: 'draft',
            participants: [],
            rounds: [],
            standings: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // In a real mock DB, we would push to local storage or an in-memory array
        // For now, just return it as success
        return HttpResponse.json({
            success: true,
            data: newTournament,
        });
    }),

    // Update match score
    http.patch('/api/tournaments/:id/matches/:matchId', async ({ params, request }) => {
        const { id, matchId } = params;
        const { score1, score2 } = (await request.json()) as any;

        return HttpResponse.json({
            success: true,
            data: { id: matchId, score1, score2, status: 'completed' },
        });
    }),
];

