import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from '@/lib/backend/issues';
import { ApiResponse } from '@/lib/backend/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await IssueService.getIssueById(token, params.id);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 
                 result.error?.code === 'UNAUTHORIZED' ? 401 :
                 result.error?.code === 'FORBIDDEN' ? 403 :
                 result.error?.code === 'NOT_FOUND' ? 404 : 500
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get issue API error:', error);
    
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const result = await IssueService.updateIssueStatus(token, params.id, body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'VALIDATION_ERROR' ? 400 : 
                 result.error?.code === 'UNAUTHORIZED' ? 401 :
                 result.error?.code === 'FORBIDDEN' ? 403 :
                 result.error?.code === 'NOT_FOUND' ? 404 : 500
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Issue updated successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update issue API error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await IssueService.deleteIssue(token, params.id);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          success: false
        },
        { 
          status: result.error?.code === 'UNAUTHORIZED' ? 401 :
                 result.error?.code === 'FORBIDDEN' ? 403 :
                 result.error?.code === 'NOT_FOUND' ? 404 : 500
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Issue deleted successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete issue API error:', error);
    
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
