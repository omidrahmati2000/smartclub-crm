import { http, HttpResponse } from 'msw';
import { mockTournaments } from '../fixtures/tournaments';

// Mutable state — handlers operate on this copy
let tournaments = [...mockTournaments];

export const tournamentHandlers = [
    // List tournaments
    http.get('/api/tournaments', ({ request }) => {
        const url = new URL(request.url);
        const venueId = url.searchParams.get('venueId');

        let filtered = [...tournaments];
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
        const tournament = tournaments.find((t) => t.id === id);

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
            stages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tournaments.push(newTournament);

        return HttpResponse.json({
            success: true,
            data: newTournament,
        });
    }),

    // Update match score
    http.patch('/api/tournaments/:id/matches/:matchId', async ({ params, request }) => {
        const { id, matchId } = params;
        const body = (await request.json()) as any;

        const tournament = tournaments.find((t) => t.id === id);
        if (!tournament) {
            return HttpResponse.json(
                { success: false, error: 'Tournament not found' },
                { status: 404 }
            );
        }

        // Find and update the match in all stages/rounds
        for (const stage of tournament.stages) {
            for (const round of stage.rounds) {
                const match = round.matches.find((m) => m.id === matchId);
                if (match) {
                    if (body.score1 !== undefined) match.score1 = body.score1;
                    if (body.score2 !== undefined) match.score2 = body.score2;
                    if (body.sets) match.sets = body.sets;
                    if (body.winnerId) match.winnerId = body.winnerId;
                    if (body.status) match.status = body.status;
                    else match.status = 'completed';

                    tournament.updatedAt = new Date().toISOString();

                    return HttpResponse.json({
                        success: true,
                        data: tournament,
                    });
                }
            }
        }

        return HttpResponse.json(
            { success: false, error: 'Match not found' },
            { status: 404 }
        );
    }),

    // Delete tournament
    http.delete('/api/tournaments/:id', ({ params }) => {
        const { id } = params;
        const idx = tournaments.findIndex((t) => t.id === id);

        if (idx === -1) {
            return HttpResponse.json(
                { success: false, error: 'Tournament not found' },
                { status: 404 }
            );
        }

        tournaments.splice(idx, 1);

        return HttpResponse.json({
            success: true,
            data: null,
        });
    }),
];
