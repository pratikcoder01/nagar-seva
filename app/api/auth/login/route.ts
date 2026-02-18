import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/backend/auth';
import { ApiResponse } from '@/lib/backend/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await AuthService.login(body.email, body.password);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 
                 result.error?.code === 'INVALID_CREDENTIALS' ? 401 :
                 result.error?.code === 'EMAIL_NOT_CONFIRMED' ? 403 : 500
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Login successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    
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
