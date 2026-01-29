import { NextResponse } from 'next/server';
import { allMockUsers } from '@smartclub/mock-data/fixtures';
import { UserType } from '@smartclub/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = allMockUsers.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create new customer user
    const newUser = {
      id: `user-customer-${Date.now()}`,
      email,
      phone: '',
      firstName,
      lastName,
      avatarUrl: undefined,
      userType: UserType.CUSTOMER,
      locale: 'fa',
      preferredSports: [],
      skillLevels: {} as Record<string, number>,
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock users array (in-memory for this session)
    allMockUsers.push(newUser as typeof allMockUsers[0]);

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: `${firstName} ${lastName}`.trim(),
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
