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
  createdAt: string;
  updatedAt: string;
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
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
];

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
    id: coachesDatabase[index].id, // Preserve ID
    venueId: coachesDatabase[index].venueId, // Preserve venueId
    rating: coachesDatabase[index].rating, // Preserve rating
    reviews: coachesDatabase[index].reviews, // Preserve reviews
    students: coachesDatabase[index].students, // Preserve students
    createdAt: coachesDatabase[index].createdAt, // Preserve createdAt
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
