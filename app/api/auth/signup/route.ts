import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/backend/auth';
import { ApiResponse } from '@/lib/backend/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await AuthService.signup(
      body.email,
      body.password,
      body.name,
      body.role
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 500 
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Account created successfully! Please check your email to confirm your account.'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}
