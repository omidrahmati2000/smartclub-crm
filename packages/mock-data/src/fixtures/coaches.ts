export interface Coach {
  id: string;
  venueId: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: string;
  level: 'Elite' | 'Head Coach' | 'Advanced' | 'Standard';
  rating: number;
  reviews: number;
  students: number;
  hourlyRate: number;
  status: 'active' | 'inactive';
  bio?: string;
  avatar?: string;
  certifications?: { name: string; issuedBy: string; year: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface CoachSessionFixture {
  id: string;
  coachId: string;
  venueId: string;
  title: string;
  description?: string;
  type: 'private' | 'group' | 'class';
  maxStudents: number;
  enrolledCount: number;
  price: number;
  currency: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

let coachesDatabase: Coach[] = [
  {
    id: 'coach-1',
    venueId: 'venue-1',
    name: 'Juan Carlos',
    specialty: 'Professional Padel',
    email: 'juan.carlos@example.com',
    phone: '+971 50 123 4567',
    experience: '12 Years',
    level: 'Elite',
    rating: 4.9,
    reviews: 124,
    students: 45,
    hourlyRate: 500,
    status: 'active',
    bio: 'Former WPT top-50 player from Spain with over a decade of professional coaching experience. Specializes in advanced shot technique, positioning strategy, and competitive match preparation for elite-level players.',
    avatar: 'https://i.pravatar.cc/150?u=coach-1',
    certifications: [
      { name: 'WPT Certified Coach', issuedBy: 'World Padel Tour', year: 2018 },
      { name: 'FEP Level 3 Coach', issuedBy: 'Spanish Padel Federation', year: 2016 },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-2',
    venueId: 'venue-1',
    name: 'Sarah Smith',
    specialty: 'Junior Academy',
    email: 'sarah.smith@example.com',
    phone: '+971 50 987 6543',
    experience: '8 Years',
    level: 'Head Coach',
    rating: 4.8,
    reviews: 89,
    students: 62,
    hourlyRate: 350,
    status: 'active',
    bio: 'Dedicated youth development coach with a passion for introducing children and teenagers to racquet sports. Runs the Junior Academy program with age-appropriate training progressions and a focus on building lifelong athletes.',
    avatar: 'https://i.pravatar.cc/150?u=coach-2',
    certifications: [
      { name: 'ITF Youth Development Coach', issuedBy: 'International Tennis Federation', year: 2020 },
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-3',
    venueId: 'venue-1',
    name: 'Marco Rossi',
    specialty: 'Strategy & Tactics',
    email: 'marco.rossi@example.com',
    phone: '+971 50 555 6789',
    experience: '15 Years',
    level: 'Advanced',
    rating: 4.7,
    reviews: 56,
    students: 28,
    hourlyRate: 400,
    status: 'active',
    bio: 'Italian-born coach renowned for analytical approach to padel and tennis. Uses video analysis and data-driven methods to refine player tactics, court positioning, and match strategy. Ideal for intermediate to advanced players looking to break through plateaus.',
    avatar: 'https://i.pravatar.cc/150?u=coach-3',
    certifications: [
      { name: 'FIP Padel Coach Level 2', issuedBy: 'International Padel Federation', year: 2019 },
      { name: 'Sports Science Diploma', issuedBy: 'University of Rome', year: 2010 },
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-4',
    venueId: 'venue-1',
    name: 'Aisha Al Mansoori',
    specialty: "Women's Academy",
    email: 'aisha.mansoori@example.com',
    phone: '+971 55 234 5678',
    experience: '6 Years',
    level: 'Advanced',
    rating: 4.8,
    reviews: 72,
    students: 38,
    hourlyRate: 375,
    status: 'active',
    bio: "UAE national champion and passionate advocate for women's sports in the GCC region. Leads the Women's Academy with beginner-friendly programs, ladies-only sessions, and competitive training tracks. Fluent in Arabic and English.",
    avatar: 'https://i.pravatar.cc/150?u=coach-4',
    certifications: [
      { name: 'UAE Padel Federation Coach', issuedBy: 'UAE Padel Association', year: 2021 },
    ],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-5',
    venueId: 'venue-1',
    name: 'Diego Fernandez',
    specialty: 'Fitness & Conditioning',
    email: 'diego.fernandez@example.com',
    phone: '+971 52 345 6789',
    experience: '10 Years',
    level: 'Head Coach',
    rating: 4.6,
    reviews: 48,
    students: 55,
    hourlyRate: 325,
    status: 'active',
    bio: 'Certified sports fitness trainer with deep expertise in athletic conditioning for racquet sports. Designs custom strength, agility, and endurance programs that complement on-court training. Works with players of all levels to prevent injuries and maximize performance.',
    avatar: 'https://i.pravatar.cc/150?u=coach-5',
    certifications: [
      { name: 'NSCA Certified Strength Coach', issuedBy: 'National Strength & Conditioning Association', year: 2017 },
      { name: 'Sports Nutrition Specialist', issuedBy: 'ISSA', year: 2019 },
    ],
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-6',
    venueId: 'venue-1',
    name: 'Omar Khalid',
    specialty: 'Pickleball & Beginners',
    email: 'omar.khalid@example.com',
    phone: '+971 56 456 7890',
    experience: '4 Years',
    level: 'Standard',
    rating: 4.5,
    reviews: 34,
    students: 42,
    hourlyRate: 250,
    status: 'active',
    bio: 'Energetic and approachable coach specializing in beginner onboarding and pickleball programs. Known for making first-time players feel comfortable and confident on court. Runs popular social mixers and corporate team-building sessions.',
    avatar: 'https://i.pravatar.cc/150?u=coach-6',
    certifications: [
      { name: 'PPR Certified Pickleball Coach', issuedBy: 'Professional Pickleball Registry', year: 2022 },
    ],
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-7',
    venueId: 'venue-1',
    name: 'Raj Patel',
    specialty: 'Squash & Racquetball',
    email: 'raj.patel@example.com',
    phone: '+971 54 567 8901',
    experience: '9 Years',
    level: 'Advanced',
    rating: 4.7,
    reviews: 41,
    students: 22,
    hourlyRate: 375,
    status: 'active',
    bio: 'Former national-level squash player from India, now a sought-after squash and racquetball coach in the UAE. Excels at teaching fast-paced court movement, ball control, and mental toughness. Available for private sessions and group clinics.',
    avatar: 'https://i.pravatar.cc/150?u=coach-7',
    certifications: [
      { name: 'WSF Level 2 Squash Coach', issuedBy: 'World Squash Federation', year: 2018 },
    ],
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'coach-8',
    venueId: 'venue-1',
    name: 'Anna Petrova',
    specialty: 'Tennis Excellence',
    email: 'anna.petrova@example.com',
    phone: '+971 50 678 9012',
    experience: '11 Years',
    level: 'Elite',
    rating: 4.9,
    reviews: 96,
    students: 30,
    hourlyRate: 475,
    status: 'inactive',
    bio: 'Former WTA-ranked tennis professional from Russia, now coaching elite players in Dubai. Focuses on serve mechanics, net play, and tournament preparation. Currently on sabbatical but accepts select private coaching bookings.',
    avatar: 'https://i.pravatar.cc/150?u=coach-8',
    certifications: [
      { name: 'PTR Professional Tennis Coach', issuedBy: 'Professional Tennis Registry', year: 2015 },
      { name: 'ITF Coaching Excellence Award', issuedBy: 'International Tennis Federation', year: 2020 },
    ],
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
];

let sessionsDatabase: CoachSessionFixture[] = [
  {
    id: 'session-1',
    coachId: 'coach-2',
    venueId: 'venue-1',
    title: 'Junior Beginner Workshop',
    description: 'Introduction to padel for kids aged 8-12. Covers basic grip, stance, and rally fundamentals.',
    type: 'class',
    maxStudents: 10,
    enrolledCount: 8,
    price: 120,
    currency: 'AED',
    startTime: '2026-02-10T10:00:00Z',
    endTime: '2026-02-10T11:30:00Z',
    status: 'scheduled',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'session-2',
    coachId: 'coach-1',
    venueId: 'venue-1',
    title: 'Pro Drills - Match Simulation',
    description: 'Intensive match-simulation drills for advanced players preparing for competitive tournaments.',
    type: 'group',
    maxStudents: 4,
    enrolledCount: 4,
    price: 350,
    currency: 'AED',
    startTime: '2026-02-12T18:00:00Z',
    endTime: '2026-02-12T19:30:00Z',
    status: 'scheduled',
    createdAt: '2026-01-22T10:00:00Z',
  },
  {
    id: 'session-3',
    coachId: 'coach-3',
    venueId: 'venue-1',
    title: 'Tactical Analysis - Video Review',
    description: 'Small-group session reviewing recorded match footage and developing game-plan strategies.',
    type: 'group',
    maxStudents: 8,
    enrolledCount: 5,
    price: 200,
    currency: 'AED',
    startTime: '2026-02-15T14:00:00Z',
    endTime: '2026-02-15T15:30:00Z',
    status: 'scheduled',
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'session-4',
    coachId: 'coach-4',
    venueId: 'venue-1',
    title: "Ladies' Padel Introduction",
    description: "Women-only beginner session in a supportive environment. All equipment provided.",
    type: 'class',
    maxStudents: 12,
    enrolledCount: 9,
    price: 100,
    currency: 'AED',
    startTime: '2026-02-11T09:00:00Z',
    endTime: '2026-02-11T10:30:00Z',
    status: 'scheduled',
    createdAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 'session-5',
    coachId: 'coach-1',
    venueId: 'venue-1',
    title: 'Private Elite Training',
    description: 'One-on-one personalized coaching session focused on specific areas for improvement.',
    type: 'private',
    maxStudents: 1,
    enrolledCount: 1,
    price: 500,
    currency: 'AED',
    startTime: '2026-02-13T16:00:00Z',
    endTime: '2026-02-13T17:00:00Z',
    status: 'scheduled',
    createdAt: '2026-01-30T10:00:00Z',
  },
  {
    id: 'session-6',
    coachId: 'coach-5',
    venueId: 'venue-1',
    title: 'Athletic Conditioning Boot Camp',
    description: 'High-intensity fitness session designed for racquet sports athletes. Covers agility, speed, and endurance.',
    type: 'class',
    maxStudents: 16,
    enrolledCount: 11,
    price: 80,
    currency: 'AED',
    startTime: '2026-02-14T07:00:00Z',
    endTime: '2026-02-14T08:00:00Z',
    status: 'scheduled',
    createdAt: '2026-02-01T10:00:00Z',
  },
];

// Coach CRUD
export function getCoachesByVenue(venueId: string): Coach[] {
  return coachesDatabase.filter((c) => c.venueId === venueId);
}

export function getCoachById(coachId: string): Coach | undefined {
  return coachesDatabase.find((c) => c.id === coachId);
}

export function createCoach(venueId: string, data: Partial<Coach>): Coach {
  const newCoach: Coach = {
    id: `coach-${Date.now()}`,
    venueId,
    name: data.name || 'New Coach',
    specialty: data.specialty || '',
    email: data.email || '',
    phone: data.phone || '',
    experience: data.experience || '0 Years',
    level: data.level || 'Standard',
    rating: 0,
    reviews: 0,
    students: 0,
    hourlyRate: data.hourlyRate || 0,
    status: 'active',
    bio: data.bio,
    avatar: data.avatar,
    certifications: data.certifications,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  coachesDatabase.push(newCoach);
  return newCoach;
}

export function updateCoach(coachId: string, data: Partial<Coach>): Coach | undefined {
  const index = coachesDatabase.findIndex((c) => c.id === coachId);
  if (index === -1) return undefined;

  const updatedCoach = {
    ...coachesDatabase[index],
    ...data,
    id: coachesDatabase[index].id,
    venueId: coachesDatabase[index].venueId,
    rating: coachesDatabase[index].rating,
    reviews: coachesDatabase[index].reviews,
    students: coachesDatabase[index].students,
    createdAt: coachesDatabase[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  coachesDatabase[index] = updatedCoach;
  return updatedCoach;
}

export function deleteCoach(coachId: string): boolean {
  const index = coachesDatabase.findIndex((c) => c.id === coachId);
  if (index === -1) return false;

  coachesDatabase.splice(index, 1);
  return true;
}

// Session CRUD
export function getSessionsByVenue(venueId: string): CoachSessionFixture[] {
  return sessionsDatabase.filter((s) => s.venueId === venueId);
}

export function getSessionById(sessionId: string): CoachSessionFixture | undefined {
  return sessionsDatabase.find((s) => s.id === sessionId);
}

export function createSession(venueId: string, data: Partial<CoachSessionFixture>): CoachSessionFixture {
  const newSession: CoachSessionFixture = {
    id: `session-${Date.now()}`,
    coachId: data.coachId || '',
    venueId,
    title: data.title || '',
    description: data.description,
    type: data.type || 'group',
    maxStudents: data.maxStudents || 8,
    enrolledCount: 0,
    price: data.price || 0,
    currency: data.currency || 'AED',
    startTime: data.startTime || new Date().toISOString(),
    endTime: data.endTime || new Date().toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };

  sessionsDatabase.push(newSession);
  return newSession;
}

export function updateSession(sessionId: string, data: Partial<CoachSessionFixture>): CoachSessionFixture | undefined {
  const index = sessionsDatabase.findIndex((s) => s.id === sessionId);
  if (index === -1) return undefined;

  sessionsDatabase[index] = {
    ...sessionsDatabase[index],
    ...data,
    id: sessionsDatabase[index].id,
    venueId: sessionsDatabase[index].venueId,
    createdAt: sessionsDatabase[index].createdAt,
  };
  return sessionsDatabase[index];
}

export function deleteSession(sessionId: string): boolean {
  const index = sessionsDatabase.findIndex((s) => s.id === sessionId);
  if (index === -1) return false;

  sessionsDatabase.splice(index, 1);
  return true;
}
