import { Tournament, TournamentStatus } from '@smartclub/types';
import { SportType } from '@smartclub/types';
import { TournamentFormat } from '@smartclub/types';

export const mockTournaments: Tournament[] = [
    {
        id: 'tournament-1',
        venueId: 'venue-1',
        name: 'Tehran Open 2026',
        description: 'Biggest Padel tournament of the season in Tehran.',
        sportType: SportType.PADEL,
        format: TournamentFormat.SINGLE_ELIMINATION,
        status: TournamentStatus.REGISTRATION_OPEN,
        startDate: '2026-03-01T08:00:00Z',
        endDate: '2026-03-07T20:00:00Z',
        registrationDeadline: '2026-02-25T23:59:59Z',
        maxParticipants: 32,
        entryFee: 1500000,
        currency: 'IRT',
        prizePool: '50,000,000 IRT',
        rules: 'Official FIP rules apply. Best of 3 sets.',
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
        participants: [
            { id: 'p1', tournamentId: 'tournament-1', name: 'Ali & Reza', seed: 1, registeredAt: '2026-01-20T10:00:00Z', paymentStatus: 'paid' },
            { id: 'p2', tournamentId: 'tournament-1', name: 'Naghi & Taghi', seed: 2, registeredAt: '2026-01-20T11:00:00Z', paymentStatus: 'paid' }
        ],
        stages: [
            {
                id: 'stage-1',
                tournamentId: 'tournament-1',
                name: 'Main Draw',
                order: 1,
                type: TournamentFormat.SINGLE_ELIMINATION,
                status: TournamentStatus.DRAFT,
                rounds: [
                    {
                        id: 'r1-t1',
                        stageId: 'stage-1',
                        roundNumber: 1,
                        name: 'Quarter Finals',
                        matches: [
                            {
                                id: 'live-match-1',
                                roundId: 'r1-t1',
                                participant1Id: 'p1',
                                participant2Id: 'p2',
                                score1: 1,
                                score2: 0,
                                status: 'in_progress',
                                assetId: 'court-center',
                                sets: [
                                    { setNumber: 1, score1: 6, score2: 4 },
                                    { setNumber: 2, score1: 2, score2: 5 }
                                ]
                            }
                        ]
                    }
                ],
                standings: [],
            }
        ],
        settings: {
            matchDurationMin: 90,
            restDurationMin: 30,
            courts: ['court-1', 'court-2'],
            automatedScheduling: true,
        },
        createdAt: '2026-01-15T12:00:00Z',
        updatedAt: '2026-01-15T12:00:00Z',
    },
    {
        id: 'tournament-2',
        venueId: 'venue-1',
        name: 'Weekly Americano - Advanced',
        description: 'Our regular weekly Americano for levels 4.0+.',
        sportType: SportType.PADEL,
        format: TournamentFormat.AMERICANO,
        status: TournamentStatus.IN_PROGRESS,
        startDate: '2026-02-02T18:00:00Z',
        endDate: '2026-02-02T21:00:00Z',
        registrationDeadline: '2026-02-01T18:00:00Z',
        maxParticipants: 16,
        entryFee: 500000,
        currency: 'IRT',
        prizePool: 'Voucher',
        participants: [
            { id: 'p1', tournamentId: 'tournament-2', name: 'Ali Rezai', seed: 1, registeredAt: '2026-01-20T10:00:00Z', paymentStatus: 'paid' },
            { id: 'p2', tournamentId: 'tournament-2', name: 'Sara Kamali', seed: 2, registeredAt: '2026-01-20T11:00:00Z', paymentStatus: 'paid' },
            { id: 'p3', tournamentId: 'tournament-2', name: 'Mohammad Nouri', seed: 3, registeredAt: '2026-01-21T09:00:00Z', paymentStatus: 'paid' },
            { id: 'p4', tournamentId: 'tournament-2', name: 'Zahra Karimi', seed: 4, registeredAt: '2026-01-21T14:00:00Z', paymentStatus: 'paid' },
            { id: 'p5', tournamentId: 'tournament-2', name: 'Hossein Amin', seed: 5, registeredAt: '2026-01-22T10:00:00Z', paymentStatus: 'paid' },
            { id: 'p6', tournamentId: 'tournament-2', name: 'Mina Shad', seed: 6, registeredAt: '2026-01-22T11:00:00Z', paymentStatus: 'paid' },
            { id: 'p7', tournamentId: 'tournament-2', name: 'Reza Pahlavi', seed: 7, registeredAt: '2026-01-23T09:00:00Z', paymentStatus: 'paid' },
            { id: 'p8', tournamentId: 'tournament-2', name: 'Saeed Rad', seed: 8, registeredAt: '2026-01-23T14:00:00Z', paymentStatus: 'paid' },
        ],
        stages: [
            {
                id: 'stage-americano',
                tournamentId: 'tournament-2',
                name: 'Rotation Stage',
                order: 1,
                type: TournamentFormat.AMERICANO,
                status: TournamentStatus.IN_PROGRESS,
                rounds: [
                    {
                        id: 'round-1',
                        stageId: 'stage-americano',
                        roundNumber: 1,
                        name: 'Round 1',
                        matches: [
                            {
                                id: 'match-1',
                                roundId: 'round-1',
                                team1ParticipantIds: ['p1', 'p2'],
                                team2ParticipantIds: ['p3', 'p4'],
                                score1: 12,
                                score2: 12,
                                status: 'completed',
                                assetId: 'court-1',
                            },
                            {
                                id: 'match-2',
                                roundId: 'round-1',
                                team1ParticipantIds: ['p5', 'p6'],
                                team2ParticipantIds: ['p7', 'p8'],
                                score1: 24,
                                score2: 0,
                                status: 'completed',
                                assetId: 'court-2',
                            }
                        ]
                    },
                    {
                        id: 'round-2',
                        stageId: 'stage-americano',
                        roundNumber: 2,
                        name: 'Round 2',
                        matches: [
                            {
                                id: 'match-3',
                                roundId: 'round-2',
                                team1ParticipantIds: ['p1', 'p5'],
                                team2ParticipantIds: ['p2', 'p6'],
                                status: 'scheduled',
                                assetId: 'court-1',
                            }
                        ]
                    }
                ],
                standings: [
                    { participantId: 'p5', rank: 1, played: 1, wins: 1, losses: 0, draws: 0, pointsFor: 24, pointsAgainst: 0, totalPoints: 24 },
                    { participantId: 'p6', rank: 2, played: 1, wins: 1, losses: 0, draws: 0, pointsFor: 24, pointsAgainst: 0, totalPoints: 24 },
                    { participantId: 'p1', rank: 3, played: 1, wins: 0, losses: 0, draws: 1, pointsFor: 12, pointsAgainst: 12, totalPoints: 12 },
                    { participantId: 'p2', rank: 4, played: 1, wins: 0, losses: 0, draws: 1, pointsFor: 12, pointsAgainst: 12, totalPoints: 12 },
                    { participantId: 'p3', rank: 5, played: 1, wins: 0, losses: 0, draws: 1, pointsFor: 12, pointsAgainst: 12, totalPoints: 12 },
                    { participantId: 'p4', rank: 6, played: 1, wins: 0, losses: 0, draws: 1, pointsFor: 12, pointsAgainst: 12, totalPoints: 12 },
                    { participantId: 'p7', rank: 7, played: 1, wins: 0, losses: 1, draws: 0, pointsFor: 0, pointsAgainst: 24, totalPoints: 0 },
                    { participantId: 'p8', rank: 8, played: 1, wins: 0, losses: 1, draws: 0, pointsFor: 0, pointsAgainst: 24, totalPoints: 0 },
                ],
            }
        ],
        settings: {
            americanoPoints: 24,
            matchDurationMin: 20,
        },
        createdAt: '2026-01-25T14:00:00Z',
        updatedAt: '2026-01-25T14:00:00Z',
    },
];
