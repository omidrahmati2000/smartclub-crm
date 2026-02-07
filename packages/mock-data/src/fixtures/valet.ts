export interface Vehicle {
  id: string;
  venueId: string;
  plate: string;
  owner: string;
  ownerPhone: string;
  type: string;
  status: 'parked' | 'requested' | 'delivered';
  location: string;
  timeIn: string;
  timeOut?: string;
  notes?: string;
}

let vehiclesDatabase: Vehicle[] = [
  {
    id: 'v1',
    venueId: 'venue-1',
    plate: '12345-DXB',
    owner: 'Ahmed Al Sharif',
    ownerPhone: '+971 50 123 4567',
    type: 'Range Rover (Black)',
    status: 'parked',
    location: 'A-12',
    timeIn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    notes: 'VIP reserved parking',
  },
  {
    id: 'v2',
    venueId: 'venue-1',
    plate: '99882-DXB',
    owner: 'Sara Abdullah',
    ownerPhone: '+971 50 234 5678',
    type: 'Tesla Model 3 (White)',
    status: 'requested',
    location: 'B-04',
    timeIn: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    notes: 'Requested for pickup',
  },
  {
    id: 'v3',
    venueId: 'venue-1',
    plate: '44521-SHJ',
    owner: 'Rashid Kareem',
    ownerPhone: '+971 50 345 6789',
    type: 'Porsche 911 (Grey)',
    status: 'parked',
    location: 'A-02',
    timeIn: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    notes: 'Premium member',
  },
  {
    id: 'v4',
    venueId: 'venue-1',
    plate: '77610-AD',
    owner: 'Mariam Hassan',
    ownerPhone: '+971 50 456 7890',
    type: 'Mercedes G-Class (White)',
    status: 'delivered',
    location: '-',
    timeIn: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    timeOut: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export function getVehiclesByVenue(venueId: string): Vehicle[] {
  return vehiclesDatabase.filter((v) => v.venueId === venueId);
}

export function getVehicleById(vehicleId: string): Vehicle | undefined {
  return vehiclesDatabase.find((v) => v.id === vehicleId);
}

export function checkInVehicle(venueId: string, data: Partial<Vehicle>): Vehicle {
  const newVehicle: Vehicle = {
    id: `vehicle-${Date.now()}`,
    venueId,
    plate: data.plate || '',
    owner: data.owner || '',
    ownerPhone: data.ownerPhone || '',
    type: data.type || '',
    status: 'parked',
    location: data.location || 'Pending',
    timeIn: new Date().toISOString(),
    notes: data.notes,
  };

  vehiclesDatabase.push(newVehicle);
  return newVehicle;
}

export function updateVehicle(vehicleId: string, data: Partial<Vehicle>): Vehicle | undefined {
  const index = vehiclesDatabase.findIndex((v) => v.id === vehicleId);
  if (index === -1) return undefined;

  const updatedVehicle: Vehicle = {
    ...vehiclesDatabase[index],
    ...data,
    id: vehiclesDatabase[index].id,
    venueId: vehiclesDatabase[index].venueId,
    timeIn: vehiclesDatabase[index].timeIn,
  };

  vehiclesDatabase[index] = updatedVehicle;
  return updatedVehicle;
}

export function checkOutVehicle(vehicleId: string): boolean {
  const index = vehiclesDatabase.findIndex((v) => v.id === vehicleId);
  if (index === -1) return false;

  vehiclesDatabase[index] = {
    ...vehiclesDatabase[index],
    status: 'delivered',
    timeOut: new Date().toISOString(),
    location: '-',
  };

  return true;
}
