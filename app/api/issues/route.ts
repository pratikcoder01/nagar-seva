import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from '@/lib/backend/issues';
import { ApiResponse } from '@/lib/backend/types';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authorization token required'
          }
        },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      status: (searchParams.get('status') as any) || undefined,
      category: searchParams.get('category') || undefined,
      user_id: searchParams.get('user_id') || undefined
    };

    const result = await IssueService.getIssues(token, filters);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 
                 result.error?.code === 'UNAUTHORIZED' ? 401 : 500
        }
      );
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Get issues API error:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authorization token required'
          }
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const result = await IssueService.createIssue(token, body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 
                 result.error?.code === 'UNAUTHORIZED' ? 401 : 500
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Issue created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create issue API error:', error);
    
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
