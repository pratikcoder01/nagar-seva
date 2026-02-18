import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/backend/auth';
import { ApiResponse } from '@/lib/backend/types';

export async function POST(request: NextRequest) {
  try {
    const result = await AuthService.logout();

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout API error:', error);
    
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
