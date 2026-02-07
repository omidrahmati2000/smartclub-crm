import { Tournament, TournamentStatus } from '@smartclub/types';
import { SportType } from '@smartclub/types';
import { TournamentFormat } from '@smartclub/types';

// ─────────────────────────────────────────────────────
// Tournament 1: Dubai Padel Championship 2026
// SINGLE_ELIMINATION, IN_PROGRESS, 16 participants (8 doubles teams)
// ─────────────────────────────────────────────────────
const dubaiChampionship: Tournament = {
    id: 'tournament-1',
    venueId: 'venue-1',
    name: 'Dubai Padel Championship 2026',
    description: 'The premier padel doubles tournament in the UAE. 8 seeded teams compete in a single-elimination bracket. Best of 3 sets with FIP rules. Live scoring on all courts.',
    sportType: SportType.PADEL,
    format: TournamentFormat.SINGLE_ELIMINATION,
    status: TournamentStatus.IN_PROGRESS,
    startDate: '2026-02-07T09:00:00Z',
    endDate: '2026-02-08T20:00:00Z',
    registrationDeadline: '2026-02-05T23:59:59Z',
    maxParticipants: 16,
    entryFee: 500,
    currency: 'AED',
    prizePool: '20,000 AED',
    rules: 'Official FIP rules. Best of 3 sets. Tiebreak at 6-6. No-ad scoring in third set. 90-second changeovers.',
    imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    participants: [
        { id: 'dc-p1', tournamentId: 'tournament-1', teamId: 'dc-team-1', name: 'Ahmed Al Sharif & Rashid Kareem', email: 'ahmed.sharif@gmail.com', phone: '+971501234567', seed: 1, registeredAt: '2026-01-20T08:00:00Z', paymentStatus: 'paid' },
        { id: 'dc-p2', tournamentId: 'tournament-1', teamId: 'dc-team-2', name: 'Omar Sadiq & Hussein Al Rashid', email: 'omar.sadiq@gmail.com', phone: '+971502345678', seed: 2, registeredAt: '2026-01-20T09:15:00Z', paymentStatus: 'paid' },
        { id: 'dc-p3', tournamentId: 'tournament-1', teamId: 'dc-team-3', name: 'Khalid Al Maktoum & Saeed Nouri', email: 'khalid.m@outlook.com', phone: '+971503456789', seed: 3, registeredAt: '2026-01-20T10:30:00Z', paymentStatus: 'paid' },
        { id: 'dc-p4', tournamentId: 'tournament-1', teamId: 'dc-team-4', name: 'Faisal Al Nahyan & Youssef Haddad', email: 'faisal.n@yahoo.com', phone: '+971504567890', seed: 4, registeredAt: '2026-01-20T11:45:00Z', paymentStatus: 'paid' },
        { id: 'dc-p5', tournamentId: 'tournament-1', teamId: 'dc-team-5', name: 'Tariq Hassan & Majid Al Farsi', email: 'tariq.h@gmail.com', phone: '+971505678901', seed: 5, registeredAt: '2026-01-21T08:00:00Z', paymentStatus: 'paid' },
        { id: 'dc-p6', tournamentId: 'tournament-1', teamId: 'dc-team-6', name: 'Ibrahim Zayed & Walid Mansour', email: 'ibrahim.z@gmail.com', phone: '+971506789012', seed: 6, registeredAt: '2026-01-21T09:15:00Z', paymentStatus: 'paid' },
        { id: 'dc-p7', tournamentId: 'tournament-1', teamId: 'dc-team-7', name: 'Nasser Al Khatib & Hamdan Rashed', email: 'nasser.k@hotmail.com', phone: '+971507890123', seed: 7, registeredAt: '2026-01-21T10:30:00Z', paymentStatus: 'paid' },
        { id: 'dc-p8', tournamentId: 'tournament-1', teamId: 'dc-team-8', name: 'Jassim Al Suwaidi & Adel Mahmoud', email: 'jassim.s@gmail.com', phone: '+971508901234', seed: 8, registeredAt: '2026-01-21T11:45:00Z', paymentStatus: 'paid' },
        { id: 'dc-p9', tournamentId: 'tournament-1', teamId: 'dc-team-9', name: 'Saleh Al Bloushi & Rami Khoury', email: 'saleh.b@gmail.com', phone: '+971509012345', seed: 9, registeredAt: '2026-01-22T08:00:00Z', paymentStatus: 'paid' },
        { id: 'dc-p10', tournamentId: 'tournament-1', teamId: 'dc-team-10', name: 'Abdulla Jaber & Khaled Shams', email: 'abdulla.j@outlook.com', phone: '+971509123456', seed: 10, registeredAt: '2026-01-22T09:15:00Z', paymentStatus: 'paid' },
        { id: 'dc-p11', tournamentId: 'tournament-1', teamId: 'dc-team-11', name: 'Zayed Al Dhaheri & Fahad Qasimi', email: 'zayed.d@gmail.com', phone: '+971509234567', seed: 11, registeredAt: '2026-01-22T10:30:00Z', paymentStatus: 'paid' },
        { id: 'dc-p12', tournamentId: 'tournament-1', teamId: 'dc-team-12', name: 'Mansour Al Shamsi & Bader Kamal', email: 'mansour.s@yahoo.com', phone: '+971509345678', seed: 12, registeredAt: '2026-01-22T11:45:00Z', paymentStatus: 'paid' },
        { id: 'dc-p13', tournamentId: 'tournament-1', teamId: 'dc-team-13', name: 'Hamed Al Ketbi & Suhail Obaid', email: 'hamed.k@gmail.com', phone: '+971509456789', seed: 13, registeredAt: '2026-01-23T08:00:00Z', paymentStatus: 'paid' },
        { id: 'dc-p14', tournamentId: 'tournament-1', teamId: 'dc-team-14', name: 'Rashid Al Muhairi & Dawood Nasir', email: 'rashid.m@gmail.com', phone: '+971509567890', seed: 14, registeredAt: '2026-01-23T09:15:00Z', paymentStatus: 'paid' },
        { id: 'dc-p15', tournamentId: 'tournament-1', teamId: 'dc-team-15', name: 'Sultan Al Mazrouei & Talal Othman', email: 'sultan.m@hotmail.com', phone: '+971509678901', seed: 15, registeredAt: '2026-01-23T10:30:00Z', paymentStatus: 'paid' },
        { id: 'dc-p16', tournamentId: 'tournament-1', teamId: 'dc-team-16', name: 'Mohan Pillai & Arjun Reddy', email: 'mohan.p@gmail.com', phone: '+971509789012', seed: 16, registeredAt: '2026-01-23T11:45:00Z', paymentStatus: 'paid' },
    ],
    stages: [
        {
            id: 'dc-stage-1',
            tournamentId: 'tournament-1',
            name: 'Main Draw',
            order: 1,
            type: TournamentFormat.SINGLE_ELIMINATION,
            status: TournamentStatus.IN_PROGRESS,
            rounds: [
                // ── Quarter Finals ──
                {
                    id: 'dc-qf',
                    stageId: 'dc-stage-1',
                    roundNumber: 1,
                    name: 'Quarter Finals',
                    matches: [
                        // QF1: #1 seed vs #8 seed → completed, #1 wins
                        {
                            id: 'dc-qf-1',
                            roundId: 'dc-qf',
                            participant1Id: 'dc-p1',
                            participant2Id: 'dc-p8',
                            score1: 2,
                            score2: 0,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 3 },
                                { setNumber: 2, score1: 6, score2: 4 },
                            ],
                            winnerId: 'dc-p1',
                            scheduledTime: '2026-02-07T09:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        // QF2: #4 seed vs #5 seed → completed, #4 wins
                        {
                            id: 'dc-qf-2',
                            roundId: 'dc-qf',
                            participant1Id: 'dc-p4',
                            participant2Id: 'dc-p5',
                            score1: 2,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 7, tiebreak1: 5, tiebreak2: 7 },
                                { setNumber: 2, score1: 6, score2: 2 },
                                { setNumber: 3, score1: 6, score2: 4 },
                            ],
                            winnerId: 'dc-p4',
                            scheduledTime: '2026-02-07T09:00:00Z',
                            assetId: 'asset-5',
                            status: 'completed',
                        },
                        // QF3: #2 seed vs #7 seed → completed, #2 wins
                        {
                            id: 'dc-qf-3',
                            roundId: 'dc-qf',
                            participant1Id: 'dc-p2',
                            participant2Id: 'dc-p7',
                            score1: 2,
                            score2: 0,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 2 },
                                { setNumber: 2, score1: 7, score2: 5 },
                            ],
                            winnerId: 'dc-p2',
                            scheduledTime: '2026-02-07T11:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        // QF4: #3 seed vs #6 seed → IN PROGRESS (live match)
                        {
                            id: 'dc-qf-4',
                            roundId: 'dc-qf',
                            participant1Id: 'dc-p3',
                            participant2Id: 'dc-p6',
                            score1: 1,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 4 },
                                { setNumber: 2, score1: 3, score2: 6 },
                                { setNumber: 3, score1: 4, score2: 3 },
                            ],
                            scheduledTime: '2026-02-07T11:00:00Z',
                            assetId: 'asset-5',
                            status: 'in_progress',
                        },
                    ],
                },
                // ── Semi Finals ──
                {
                    id: 'dc-sf',
                    stageId: 'dc-stage-1',
                    roundNumber: 2,
                    name: 'Semi Finals',
                    matches: [
                        // SF1: Winner QF1 (#1) vs Winner QF2 (#4) → completed, #1 wins
                        {
                            id: 'dc-sf-1',
                            roundId: 'dc-sf',
                            participant1Id: 'dc-p1',
                            participant2Id: 'dc-p4',
                            score1: 2,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 7, score2: 6, tiebreak1: 7, tiebreak2: 4 },
                                { setNumber: 2, score1: 4, score2: 6 },
                                { setNumber: 3, score1: 6, score2: 3 },
                            ],
                            winnerId: 'dc-p1',
                            scheduledTime: '2026-02-07T15:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        // SF2: Winner QF3 (#2) vs Winner QF4 (TBD) → scheduled
                        {
                            id: 'dc-sf-2',
                            roundId: 'dc-sf',
                            participant1Id: 'dc-p2',
                            // participant2Id will be set when QF4 finishes
                            scheduledTime: '2026-02-07T15:00:00Z',
                            assetId: 'asset-5',
                            status: 'scheduled',
                        },
                    ],
                },
                // ── Final ──
                {
                    id: 'dc-final',
                    stageId: 'dc-stage-1',
                    roundNumber: 3,
                    name: 'Final',
                    matches: [
                        {
                            id: 'dc-final-1',
                            roundId: 'dc-final',
                            // Both TBD until semis complete
                            participant1Id: 'dc-p1',
                            scheduledTime: '2026-02-08T16:00:00Z',
                            assetId: 'asset-1',
                            status: 'scheduled',
                        },
                    ],
                },
            ],
            standings: [],
        },
    ],
    settings: {
        matchDurationMin: 90,
        restDurationMin: 30,
        courts: ['asset-1', 'asset-5'],
        automatedScheduling: true,
    },
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-02-07T12:00:00Z',
};

// ─────────────────────────────────────────────────────
// Tournament 2: Weekly Americano - Advanced
// AMERICANO, IN_PROGRESS, 8 participants, 7 rounds
// ─────────────────────────────────────────────────────
const weeklyAmericano: Tournament = {
    id: 'tournament-2',
    venueId: 'venue-1',
    name: 'Weekly Americano - Advanced',
    description: 'Our regular weekly Americano for levels 4.0+. 8 players rotate partners every round so everyone plays with everyone. Points-based system up to 24 per match.',
    sportType: SportType.PADEL,
    format: TournamentFormat.AMERICANO,
    status: TournamentStatus.IN_PROGRESS,
    startDate: '2026-02-08T18:00:00Z',
    endDate: '2026-02-08T21:00:00Z',
    registrationDeadline: '2026-02-07T18:00:00Z',
    maxParticipants: 8,
    entryFee: 150,
    currency: 'AED',
    prizePool: '500 AED Voucher',
    rules: 'Americano format. Each match to 24 points. Rotating partners — every player partners with every other player exactly once over 7 rounds.',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    participants: [
        { id: 'am-p1', tournamentId: 'tournament-2', name: 'Ali Al Rashid', email: 'ali.rashid@gmail.com', phone: '+971551001001', seed: 1, registeredAt: '2026-02-01T10:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p2', tournamentId: 'tournament-2', name: 'Sara Abdullah', email: 'sara.abd@gmail.com', phone: '+971551002002', seed: 2, registeredAt: '2026-02-01T11:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p3', tournamentId: 'tournament-2', name: 'Mohammed Al Nouri', email: 'mohammed.n@outlook.com', phone: '+971551003003', seed: 3, registeredAt: '2026-02-02T09:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p4', tournamentId: 'tournament-2', name: 'Zahra Al Karimi', email: 'zahra.k@gmail.com', phone: '+971551004004', seed: 4, registeredAt: '2026-02-02T14:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p5', tournamentId: 'tournament-2', name: 'Hussein Al Amin', email: 'hussein.a@yahoo.com', phone: '+971551005005', seed: 5, registeredAt: '2026-02-03T10:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p6', tournamentId: 'tournament-2', name: 'Mina Al Hassan', email: 'mina.h@gmail.com', phone: '+971551006006', seed: 6, registeredAt: '2026-02-03T11:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p7', tournamentId: 'tournament-2', name: 'Rashid Al Maktoum', email: 'rashid.mak@hotmail.com', phone: '+971551007007', seed: 7, registeredAt: '2026-02-04T09:00:00Z', paymentStatus: 'paid' },
        { id: 'am-p8', tournamentId: 'tournament-2', name: 'Saeed Al Farsi', email: 'saeed.f@gmail.com', phone: '+971551008008', seed: 8, registeredAt: '2026-02-04T14:00:00Z', paymentStatus: 'paid' },
    ],
    stages: [
        {
            id: 'am-stage-1',
            tournamentId: 'tournament-2',
            name: 'Rotation Stage',
            order: 1,
            type: TournamentFormat.AMERICANO,
            status: TournamentStatus.IN_PROGRESS,
            rounds: [
                // R1: (P1+P2) vs (P3+P4), (P5+P6) vs (P7+P8)
                {
                    id: 'am-r1',
                    stageId: 'am-stage-1',
                    roundNumber: 1,
                    name: 'Round 1',
                    matches: [
                        {
                            id: 'am-r1-m1',
                            roundId: 'am-r1',
                            team1ParticipantIds: ['am-p1', 'am-p2'],
                            team2ParticipantIds: ['am-p3', 'am-p4'],
                            score1: 16,
                            score2: 8,
                            status: 'completed',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T18:00:00Z',
                        },
                        {
                            id: 'am-r1-m2',
                            roundId: 'am-r1',
                            team1ParticipantIds: ['am-p5', 'am-p6'],
                            team2ParticipantIds: ['am-p7', 'am-p8'],
                            score1: 14,
                            score2: 10,
                            status: 'completed',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T18:00:00Z',
                        },
                    ],
                },
                // R2: (P1+P3) vs (P5+P7), (P2+P4) vs (P6+P8)
                {
                    id: 'am-r2',
                    stageId: 'am-stage-1',
                    roundNumber: 2,
                    name: 'Round 2',
                    matches: [
                        {
                            id: 'am-r2-m1',
                            roundId: 'am-r2',
                            team1ParticipantIds: ['am-p1', 'am-p3'],
                            team2ParticipantIds: ['am-p5', 'am-p7'],
                            score1: 12,
                            score2: 12,
                            status: 'completed',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T18:20:00Z',
                        },
                        {
                            id: 'am-r2-m2',
                            roundId: 'am-r2',
                            team1ParticipantIds: ['am-p2', 'am-p4'],
                            team2ParticipantIds: ['am-p6', 'am-p8'],
                            score1: 18,
                            score2: 6,
                            status: 'completed',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T18:20:00Z',
                        },
                    ],
                },
                // R3: (P1+P4) vs (P6+P7), (P2+P3) vs (P5+P8)
                {
                    id: 'am-r3',
                    stageId: 'am-stage-1',
                    roundNumber: 3,
                    name: 'Round 3',
                    matches: [
                        {
                            id: 'am-r3-m1',
                            roundId: 'am-r3',
                            team1ParticipantIds: ['am-p1', 'am-p4'],
                            team2ParticipantIds: ['am-p6', 'am-p7'],
                            score1: 15,
                            score2: 9,
                            status: 'completed',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T18:40:00Z',
                        },
                        {
                            id: 'am-r3-m2',
                            roundId: 'am-r3',
                            team1ParticipantIds: ['am-p2', 'am-p3'],
                            team2ParticipantIds: ['am-p5', 'am-p8'],
                            score1: 10,
                            score2: 14,
                            status: 'completed',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T18:40:00Z',
                        },
                    ],
                },
                // R4: (P1+P5) vs (P3+P8), (P2+P6) vs (P4+P7)
                {
                    id: 'am-r4',
                    stageId: 'am-stage-1',
                    roundNumber: 4,
                    name: 'Round 4',
                    matches: [
                        {
                            id: 'am-r4-m1',
                            roundId: 'am-r4',
                            team1ParticipantIds: ['am-p1', 'am-p5'],
                            team2ParticipantIds: ['am-p3', 'am-p8'],
                            score1: 17,
                            score2: 7,
                            status: 'completed',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T19:00:00Z',
                        },
                        {
                            id: 'am-r4-m2',
                            roundId: 'am-r4',
                            team1ParticipantIds: ['am-p2', 'am-p6'],
                            team2ParticipantIds: ['am-p4', 'am-p7'],
                            score1: 13,
                            score2: 11,
                            status: 'completed',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T19:00:00Z',
                        },
                    ],
                },
                // R5: (P1+P6) vs (P4+P8), (P2+P7) vs (P3+P5)
                {
                    id: 'am-r5',
                    stageId: 'am-stage-1',
                    roundNumber: 5,
                    name: 'Round 5',
                    matches: [
                        {
                            id: 'am-r5-m1',
                            roundId: 'am-r5',
                            team1ParticipantIds: ['am-p1', 'am-p6'],
                            team2ParticipantIds: ['am-p4', 'am-p8'],
                            score1: 11,
                            score2: 13,
                            status: 'completed',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T19:20:00Z',
                        },
                        {
                            id: 'am-r5-m2',
                            roundId: 'am-r5',
                            team1ParticipantIds: ['am-p2', 'am-p7'],
                            team2ParticipantIds: ['am-p3', 'am-p5'],
                            score1: 16,
                            score2: 8,
                            status: 'completed',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T19:20:00Z',
                        },
                    ],
                },
                // R6: (P1+P7) vs (P3+P6), (P2+P8) vs (P4+P5) → in_progress
                {
                    id: 'am-r6',
                    stageId: 'am-stage-1',
                    roundNumber: 6,
                    name: 'Round 6',
                    matches: [
                        {
                            id: 'am-r6-m1',
                            roundId: 'am-r6',
                            team1ParticipantIds: ['am-p1', 'am-p7'],
                            team2ParticipantIds: ['am-p3', 'am-p6'],
                            score1: 14,
                            score2: 8,
                            status: 'in_progress',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T19:40:00Z',
                        },
                        {
                            id: 'am-r6-m2',
                            roundId: 'am-r6',
                            team1ParticipantIds: ['am-p2', 'am-p8'],
                            team2ParticipantIds: ['am-p4', 'am-p5'],
                            score1: 10,
                            score2: 9,
                            status: 'in_progress',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T19:40:00Z',
                        },
                    ],
                },
                // R7: (P1+P8) vs (P2+P5), (P3+P7) vs (P4+P6) → scheduled
                {
                    id: 'am-r7',
                    stageId: 'am-stage-1',
                    roundNumber: 7,
                    name: 'Round 7',
                    matches: [
                        {
                            id: 'am-r7-m1',
                            roundId: 'am-r7',
                            team1ParticipantIds: ['am-p1', 'am-p8'],
                            team2ParticipantIds: ['am-p2', 'am-p5'],
                            status: 'scheduled',
                            assetId: 'asset-1',
                            scheduledTime: '2026-02-08T20:00:00Z',
                        },
                        {
                            id: 'am-r7-m2',
                            roundId: 'am-r7',
                            team1ParticipantIds: ['am-p3', 'am-p7'],
                            team2ParticipantIds: ['am-p4', 'am-p6'],
                            status: 'scheduled',
                            assetId: 'asset-5',
                            scheduledTime: '2026-02-08T20:00:00Z',
                        },
                    ],
                },
            ],
            // Standings calculated from completed rounds (R1-R5)
            // P1: R1(16) + R2(12) + R3(15) + R4(17) + R5(11) = 71
            // P2: R1(16) + R2(18) + R3(10) + R4(13) + R5(16) = 73
            // P3: R1(8) + R2(12) + R3(10) + R4(7) + R5(8) = 45
            // P4: R1(8) + R2(18) + R3(15) + R4(11) + R5(13) = 65
            // P5: R1(14) + R2(12) + R3(14) + R4(17) + R5(8) = 65
            // P6: R1(14) + R2(6) + R3(9) + R4(13) + R5(11) = 53
            // P7: R1(10) + R2(12) + R3(9) + R4(11) + R5(16) = 58
            // P8: R1(10) + R2(6) + R3(14) + R4(7) + R5(13) = 50
            standings: [
                { participantId: 'am-p2', rank: 1, played: 5, wins: 4, losses: 1, draws: 0, pointsFor: 73, pointsAgainst: 47, totalPoints: 73 },
                { participantId: 'am-p1', rank: 2, played: 5, wins: 3, losses: 1, draws: 1, pointsFor: 71, pointsAgainst: 49, totalPoints: 71 },
                { participantId: 'am-p4', rank: 3, played: 5, wins: 3, losses: 2, draws: 0, pointsFor: 65, pointsAgainst: 55, totalPoints: 65 },
                { participantId: 'am-p5', rank: 4, played: 5, wins: 3, losses: 2, draws: 0, pointsFor: 65, pointsAgainst: 55, totalPoints: 65 },
                { participantId: 'am-p7', rank: 5, played: 5, wins: 2, losses: 2, draws: 1, pointsFor: 58, pointsAgainst: 62, totalPoints: 58 },
                { participantId: 'am-p6', rank: 6, played: 5, wins: 1, losses: 3, draws: 1, pointsFor: 53, pointsAgainst: 67, totalPoints: 53 },
                { participantId: 'am-p8', rank: 7, played: 5, wins: 1, losses: 3, draws: 1, pointsFor: 50, pointsAgainst: 70, totalPoints: 50 },
                { participantId: 'am-p3', rank: 8, played: 5, wins: 1, losses: 4, draws: 0, pointsFor: 45, pointsAgainst: 75, totalPoints: 45 },
            ],
        },
    ],
    settings: {
        americanoPoints: 24,
        matchDurationMin: 20,
        restDurationMin: 5,
        courts: ['asset-1', 'asset-5'],
        automatedScheduling: true,
    },
    createdAt: '2026-02-01T14:00:00Z',
    updatedAt: '2026-02-08T19:40:00Z',
};

// ─────────────────────────────────────────────────────
// Tournament 3: Friday Night Mexicano
// MEXICANO, REGISTRATION_OPEN, 12 of 16 registered
// ─────────────────────────────────────────────────────
const fridayMexicano: Tournament = {
    id: 'tournament-3',
    venueId: 'venue-1',
    name: 'Friday Night Mexicano',
    description: 'Fun Mexicano format for all levels! After each round, teams are re-formed based on current standings. Top players pair with bottom players for balanced matches. Great for meeting new playing partners.',
    sportType: SportType.PADEL,
    format: TournamentFormat.MEXICANO,
    status: TournamentStatus.REGISTRATION_OPEN,
    startDate: '2026-02-13T19:00:00Z',
    endDate: '2026-02-13T22:00:00Z',
    registrationDeadline: '2026-02-12T18:00:00Z',
    maxParticipants: 16,
    entryFee: 100,
    currency: 'AED',
    prizePool: '300 AED Voucher',
    rules: 'Mexicano format. After each round, #1 ranked pairs with #8, #2 with #7, etc. Each match to 24 points. 6 rounds total.',
    imageUrl: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80',
    participants: [
        { id: 'mx-p1', tournamentId: 'tournament-3', name: 'Fatima Al Nouri', email: 'fatima.n@gmail.com', phone: '+971551101001', registeredAt: '2026-02-05T10:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p2', tournamentId: 'tournament-3', name: 'Yousuf Al Balushi', email: 'yousuf.b@gmail.com', phone: '+971551102002', registeredAt: '2026-02-05T10:30:00Z', paymentStatus: 'paid' },
        { id: 'mx-p3', tournamentId: 'tournament-3', name: 'Layla Haddad', email: 'layla.h@outlook.com', phone: '+971551103003', registeredAt: '2026-02-05T11:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p4', tournamentId: 'tournament-3', name: 'Karim Al Jabri', email: 'karim.j@gmail.com', phone: '+971551104004', registeredAt: '2026-02-05T12:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p5', tournamentId: 'tournament-3', name: 'Noura Al Shamsi', email: 'noura.s@yahoo.com', phone: '+971551105005', registeredAt: '2026-02-06T09:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p6', tournamentId: 'tournament-3', name: 'Ahmad Mansoor', email: 'ahmad.m@gmail.com', phone: '+971551106006', registeredAt: '2026-02-06T09:30:00Z', paymentStatus: 'paid' },
        { id: 'mx-p7', tournamentId: 'tournament-3', name: 'Reem Al Suwaidi', email: 'reem.s@gmail.com', phone: '+971551107007', registeredAt: '2026-02-06T10:00:00Z', paymentStatus: 'pending' },
        { id: 'mx-p8', tournamentId: 'tournament-3', name: 'Bilal Khoury', email: 'bilal.k@hotmail.com', phone: '+971551108008', registeredAt: '2026-02-06T11:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p9', tournamentId: 'tournament-3', name: 'Hessa Al Ketbi', email: 'hessa.k@gmail.com', phone: '+971551109009', registeredAt: '2026-02-06T14:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p10', tournamentId: 'tournament-3', name: 'Marwan Obaid', email: 'marwan.o@gmail.com', phone: '+971551110010', registeredAt: '2026-02-07T08:00:00Z', paymentStatus: 'pending' },
        { id: 'mx-p11', tournamentId: 'tournament-3', name: 'Dana Al Falasi', email: 'dana.f@outlook.com', phone: '+971551111011', registeredAt: '2026-02-07T09:00:00Z', paymentStatus: 'paid' },
        { id: 'mx-p12', tournamentId: 'tournament-3', name: 'Sami Al Dhaheri', email: 'sami.d@gmail.com', phone: '+971551112012', registeredAt: '2026-02-07T10:00:00Z', paymentStatus: 'pending' },
    ],
    stages: [
        {
            id: 'mx-stage-1',
            tournamentId: 'tournament-3',
            name: 'Mexicano Rotation',
            order: 1,
            type: TournamentFormat.MEXICANO,
            status: TournamentStatus.REGISTRATION_OPEN,
            rounds: [],
            standings: [],
        },
    ],
    settings: {
        americanoPoints: 24,
        matchDurationMin: 20,
        restDurationMin: 5,
        courts: ['asset-1', 'asset-5', 'asset-6'],
        automatedScheduling: true,
    },
    createdAt: '2026-02-03T10:00:00Z',
    updatedAt: '2026-02-07T10:00:00Z',
};

// ─────────────────────────────────────────────────────
// Tournament 4: January Classic (COMPLETED)
// SINGLE_ELIMINATION, COMPLETED, 8 teams
// ─────────────────────────────────────────────────────
const januaryClassic: Tournament = {
    id: 'tournament-4',
    venueId: 'venue-1',
    name: 'January Classic 2026',
    description: 'The first padel doubles tournament of the year. 8 teams competed in a single-elimination bracket. Congratulations to the champions!',
    sportType: SportType.PADEL,
    format: TournamentFormat.SINGLE_ELIMINATION,
    status: TournamentStatus.COMPLETED,
    startDate: '2026-01-18T10:00:00Z',
    endDate: '2026-01-18T18:00:00Z',
    registrationDeadline: '2026-01-16T23:59:59Z',
    maxParticipants: 8,
    entryFee: 300,
    currency: 'AED',
    prizePool: '8,000 AED',
    rules: 'Official FIP rules. Best of 3 sets. Tiebreak at 6-6.',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    participants: [
        { id: 'jc-p1', tournamentId: 'tournament-4', teamId: 'jc-team-1', name: 'Ahmed Al Sharif & Rashid Kareem', email: 'ahmed.sharif@gmail.com', phone: '+971501234567', seed: 1, registeredAt: '2026-01-05T08:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p2', tournamentId: 'tournament-4', teamId: 'jc-team-2', name: 'Omar Sadiq & Hussein Al Rashid', email: 'omar.sadiq@gmail.com', phone: '+971502345678', seed: 2, registeredAt: '2026-01-05T09:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p3', tournamentId: 'tournament-4', teamId: 'jc-team-3', name: 'Khalid Al Maktoum & Saeed Nouri', email: 'khalid.m@outlook.com', phone: '+971503456789', seed: 3, registeredAt: '2026-01-06T08:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p4', tournamentId: 'tournament-4', teamId: 'jc-team-4', name: 'Faisal Al Nahyan & Youssef Haddad', email: 'faisal.n@yahoo.com', phone: '+971504567890', seed: 4, registeredAt: '2026-01-06T09:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p5', tournamentId: 'tournament-4', teamId: 'jc-team-5', name: 'Tariq Hassan & Majid Al Farsi', email: 'tariq.h@gmail.com', phone: '+971505678901', seed: 5, registeredAt: '2026-01-07T08:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p6', tournamentId: 'tournament-4', teamId: 'jc-team-6', name: 'Ibrahim Zayed & Walid Mansour', email: 'ibrahim.z@gmail.com', phone: '+971506789012', seed: 6, registeredAt: '2026-01-07T09:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p7', tournamentId: 'tournament-4', teamId: 'jc-team-7', name: 'Nasser Al Khatib & Hamdan Rashed', email: 'nasser.k@hotmail.com', phone: '+971507890123', seed: 7, registeredAt: '2026-01-08T08:00:00Z', paymentStatus: 'paid' },
        { id: 'jc-p8', tournamentId: 'tournament-4', teamId: 'jc-team-8', name: 'Jassim Al Suwaidi & Adel Mahmoud', email: 'jassim.s@gmail.com', phone: '+971508901234', seed: 8, registeredAt: '2026-01-08T09:00:00Z', paymentStatus: 'paid' },
    ],
    stages: [
        {
            id: 'jc-stage-1',
            tournamentId: 'tournament-4',
            name: 'Main Draw',
            order: 1,
            type: TournamentFormat.SINGLE_ELIMINATION,
            status: TournamentStatus.COMPLETED,
            rounds: [
                // ── Quarter Finals ──
                {
                    id: 'jc-qf',
                    stageId: 'jc-stage-1',
                    roundNumber: 1,
                    name: 'Quarter Finals',
                    matches: [
                        {
                            id: 'jc-qf-1',
                            roundId: 'jc-qf',
                            participant1Id: 'jc-p1',
                            participant2Id: 'jc-p8',
                            score1: 2,
                            score2: 0,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 2 },
                                { setNumber: 2, score1: 6, score2: 1 },
                            ],
                            winnerId: 'jc-p1',
                            scheduledTime: '2026-01-18T10:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        {
                            id: 'jc-qf-2',
                            roundId: 'jc-qf',
                            participant1Id: 'jc-p4',
                            participant2Id: 'jc-p5',
                            score1: 2,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 4 },
                                { setNumber: 2, score1: 3, score2: 6 },
                                { setNumber: 3, score1: 7, score2: 5 },
                            ],
                            winnerId: 'jc-p4',
                            scheduledTime: '2026-01-18T10:00:00Z',
                            assetId: 'asset-5',
                            status: 'completed',
                        },
                        {
                            id: 'jc-qf-3',
                            roundId: 'jc-qf',
                            participant1Id: 'jc-p2',
                            participant2Id: 'jc-p7',
                            score1: 2,
                            score2: 0,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 3 },
                                { setNumber: 2, score1: 6, score2: 4 },
                            ],
                            winnerId: 'jc-p2',
                            scheduledTime: '2026-01-18T12:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        {
                            id: 'jc-qf-4',
                            roundId: 'jc-qf',
                            participant1Id: 'jc-p3',
                            participant2Id: 'jc-p6',
                            score1: 2,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 4, score2: 6 },
                                { setNumber: 2, score1: 6, score2: 3 },
                                { setNumber: 3, score1: 6, score2: 4 },
                            ],
                            winnerId: 'jc-p3',
                            scheduledTime: '2026-01-18T12:00:00Z',
                            assetId: 'asset-5',
                            status: 'completed',
                        },
                    ],
                },
                // ── Semi Finals ──
                {
                    id: 'jc-sf',
                    stageId: 'jc-stage-1',
                    roundNumber: 2,
                    name: 'Semi Finals',
                    matches: [
                        {
                            id: 'jc-sf-1',
                            roundId: 'jc-sf',
                            participant1Id: 'jc-p1',
                            participant2Id: 'jc-p4',
                            score1: 2,
                            score2: 0,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 3 },
                                { setNumber: 2, score1: 6, score2: 4 },
                            ],
                            winnerId: 'jc-p1',
                            scheduledTime: '2026-01-18T14:00:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                        {
                            id: 'jc-sf-2',
                            roundId: 'jc-sf',
                            participant1Id: 'jc-p2',
                            participant2Id: 'jc-p3',
                            score1: 1,
                            score2: 2,
                            sets: [
                                { setNumber: 1, score1: 6, score2: 4 },
                                { setNumber: 2, score1: 4, score2: 6 },
                                { setNumber: 3, score1: 3, score2: 6 },
                            ],
                            winnerId: 'jc-p3',
                            scheduledTime: '2026-01-18T14:00:00Z',
                            assetId: 'asset-5',
                            status: 'completed',
                        },
                    ],
                },
                // ── Final ──
                {
                    id: 'jc-final',
                    stageId: 'jc-stage-1',
                    roundNumber: 3,
                    name: 'Final',
                    matches: [
                        {
                            id: 'jc-final-1',
                            roundId: 'jc-final',
                            participant1Id: 'jc-p1',
                            participant2Id: 'jc-p3',
                            score1: 2,
                            score2: 1,
                            sets: [
                                { setNumber: 1, score1: 3, score2: 6 },
                                { setNumber: 2, score1: 7, score2: 6, tiebreak1: 7, tiebreak2: 3 },
                                { setNumber: 3, score1: 6, score2: 2 },
                            ],
                            winnerId: 'jc-p1',
                            scheduledTime: '2026-01-18T16:30:00Z',
                            assetId: 'asset-1',
                            status: 'completed',
                        },
                    ],
                },
            ],
            standings: [],
        },
    ],
    settings: {
        matchDurationMin: 90,
        restDurationMin: 30,
        courts: ['asset-1', 'asset-5'],
        automatedScheduling: true,
    },
    createdAt: '2026-01-02T12:00:00Z',
    updatedAt: '2026-01-18T18:30:00Z',
};

export const mockTournaments: Tournament[] = [
    dubaiChampionship,
    weeklyAmericano,
    fridayMexicano,
    januaryClassic,
];
