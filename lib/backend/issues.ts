import { createClient } from '../supabase/server';
import { validateRequest, issueSchemas, paginationSchema } from './validation';
import { ApiResponse, Issue, CreateIssueRequest, UpdateIssueStatusRequest, IssueStatus, UserRole } from './types';
import { RBACService } from './rbac';

export class IssueService {
  private static async getSupabase() {
    return await createClient();
  }

  static async createIssue(token: string, issueData: CreateIssueRequest): Promise<ApiResponse<Issue>> {
    try {
      // Validate input
      const validation = validateRequest(issueSchemas.create, issueData);
      if (!validation.success) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error!
          }
        };
      }

      // Verify user authentication
      const userId = await RBACService.requireCitizen(token);
      if (!userId) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required to create issues'
          }
        };
      }

      const supabase = await this.getSupabase();
      
      const { data, error } = await supabase
        .from('issues')
        .insert({
          ...validation.data,
          user_id: userId,
          status: IssueStatus.REPORTED
        })
        .select()
        .single();

      if (error) {
        console.error('Create issue error:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create issue'
          }
        };
      }

      // Fetch issue with user details
      const { data: issueWithUser, error: fetchError } = await supabase
        .from('issues')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Fetch issue with user error:', fetchError);
      }

      return { 
        success: true, 
        data: issueWithUser as Issue 
      };

    } catch (error) {
      console.error('Create issue service error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      };
    }
  }

  static async getIssues(token: string, filters?: {
    page?: number;
    limit?: number;
    status?: IssueStatus;
    category?: string;
    user_id?: string;
  }): Promise<ApiResponse<Issue[]>> {
    try {
      // Validate pagination
      const validation = validateRequest(paginationSchema, filters || {});
      if (!validation.success) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error!
          }
        };
      }

      // Verify authentication
      const auth = await RBACService.requireAuth(token);
      if (!auth) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        };
      }

      const supabase = await this.getSupabase();
      let query = supabase
        .from('issues')
        .select(`
          *,
          user:users(name, email)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (validation.data.status) {
        query = query.eq('status', validation.data.status);
      }

      if (validation.data.category) {
        query = query.eq('category', validation.data.category);
      }

      // Citizens can only see their own issues
      if (auth.role === 'CITIZEN') {
        query = query.eq('user_id', auth.userId);
      }

      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Count error:', countError);
      }

      // Apply pagination
      const { data, error } = await query
        .range(
          (validation.data.page - 1) * validation.data.limit,
          validation.data.page * validation.data.limit - 1
        );

      if (error) {
        console.error('Get issues error:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch issues'
          }
        };
      }

      return {
        success: true,
        data: data as Issue[],
        meta: {
          pagination: {
            page: validation.data.page,
            limit: validation.data.limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / validation.data.limit)
          }
        }
      };

    } catch (error) {
      console.error('Get issues service error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      };
    }
  }

  static async getIssueById(token: string, issueId: string): Promise<ApiResponse<Issue>> {
    try {
      // Validate issue ID
      if (!issueId || typeof issueId !== 'string') {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Valid issue ID is required'
          }
        };
      }

      const auth = await RBACService.requireAuth(token);
      if (!auth) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        };
      }

      const supabase = await this.getSupabase();
      
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', issueId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Issue not found'
            }
          };
        }

        console.error('Get issue error:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch issue'
          }
        };
      }

      // Check access permissions
      const hasAccess = RBACService.canUserAccessIssue(auth.userId, data.user_id, auth.role);
      if (!hasAccess) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this issue'
          }
        };
      }

      return { success: true, data: data as Issue };

    } catch (error) {
      console.error('Get issue service error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      };
    }
  }

  static async updateIssueStatus(token: string, issueId: string, updateData: UpdateIssueStatusRequest): Promise<ApiResponse<Issue>> {
    try {
      // Validate input
      const validation = validateRequest(issueSchemas.updateStatus, updateData);
      if (!validation.success) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error!
          }
        };
      }

      const auth = await RBACService.requireAuth(token);
      if (!auth) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        };
      }

      // Check if user can update issue status
      const canUpdate = RBACService.canUserUpdateIssueStatus(auth.userId, '', auth.role);
      if (!canUpdate) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only administrators can update issue status'
          }
        };
      }

      const supabase = await this.getSupabase();
      
      const { data, error } = await supabase
        .from('issues')
        .update({
          status: validation.data.status,
          image_after: validation.data.image_after,
          assigned_to: validation.data.assigned_to,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'Issue not found'
            }
          };
        }

        console.error('Update issue error:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update issue'
          }
        };
      }

      // Fetch updated issue with user details
      const { data: updatedIssue, error: fetchError } = await supabase
        .from('issues')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Fetch updated issue error:', fetchError);
      }

      return { 
        success: true, 
        data: updatedIssue as Issue 
      };

    } catch (error) {
      console.error('Update issue service error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      };
    }
  }

  static async deleteIssue(token: string, issueId: string): Promise<ApiResponse<null>> {
    try {
      const auth = await RBACService.requireAuth(token);
      if (!auth) {
        return {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        };
      }

      // Only admins can delete issues
      if (auth.role !== UserRole.ADMIN) {
        return {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Only administrators can delete issues'
          }
        };
      }

      const supabase = await this.getSupabase();
      
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', issueId);

      if (error) {
        console.error('Delete issue error:', error);
        return {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to delete issue'
          }
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Delete issue service error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred'
        }
      };
    }
  }
}
