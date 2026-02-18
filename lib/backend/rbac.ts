import { createClient } from '../supabase/server';
import { UserRole } from './types';

export class RBACService {
  private static async getSupabase() {
    return await createClient();
  }

  static async requireAuth(token: string): Promise<{ userId: string; role: UserRole } | null> {
    try {
      const supabase = await this.getSupabase();
      
      // Verify JWT token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }

      // Get user role from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return null;
      }

      return {
        userId: user.id,
        role: profile.role
      };

    } catch (error) {
      console.error('Auth verification error:', error);
      return null;
    }
  }

  static async requireRole(token: string, requiredRole: UserRole): Promise<string | null> {
    const auth = await this.requireAuth(token);
    
    if (!auth) {
      return null;
    }

    if (auth.role !== requiredRole) {
      return null;
    }

    return auth.userId;
  }

  static async requireAdmin(token: string): Promise<string | null> {
    return this.requireRole(token, UserRole.ADMIN);
  }

  static async requireCitizen(token: string): Promise<string | null> {
    return this.requireRole(token, UserRole.CITIZEN);
  }

  static canUserAccessIssue(userId: string, issueUserId: string, userRole: UserRole): boolean {
    // Citizens can only access their own issues
    if (userRole === UserRole.CITIZEN) {
      return userId === issueUserId;
    }
    
    // Admins can access all issues
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    
    return false;
  }

  static canUserUpdateIssueStatus(userId: string, issueUserId: string, userRole: UserRole): boolean {
    // Citizens cannot update issue status (only admins can)
    if (userRole === UserRole.CITIZEN) {
      return false;
    }
    
    // Admins can update any issue status
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    
    return false;
  }
}
