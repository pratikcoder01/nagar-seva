import { createClient } from '../supabase/server';
import { validateRequest, authSchemas } from './validation';
import { ApiResponse, AuthResponse, UserRole } from './types';

export class AuthService {
  private static async getSupabase() {
    return await createClient();
  }

  static async signup(email: string, password: string, name?: string, role: UserRole = UserRole.CITIZEN): Promise<ApiResponse<AuthResponse>> {
    try {
      // Validate input
      const validation = validateRequest(authSchemas.signup, { email, password, name, role });
      if (!validation.success) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error!
          }
        };
      }

      const supabase = await this.getSupabase();
      
      // Create user in Supabase Auth with auto-confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: undefined, // No email confirmation needed
        }
      });

      if (authError) {
        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: authError.message
          }
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: {
            code: 'USER_CREATION_FAILED',
            message: 'Failed to create user account'
          }
        };
      }

      // User profile will be created automatically by trigger
      return {
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            name: name || authData.user.email!.split('@')[0],
            role,
            points: 0,
            created_at: authData.user.created_at
          },
          session: {
            access_token: authData.session?.access_token || '',
            refresh_token: authData.session?.refresh_token || '',
            expires_at: authData.session?.expires_at || 0
          }
        }
      };

    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred during signup'
        }
      };
    }
  }

  static async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      // Validate input
      const validation = validateRequest(authSchemas.login, { email, password });
      if (!validation.success) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error!
          }
        };
      }

      const supabase = await this.getSupabase();
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        // Handle specific auth errors (no email confirmation needed)
        if (authError.message?.includes('Invalid login credentials')) {
          return {
            success: false,
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password.'
            }
          };
        }

        return {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: authError.message
          }
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: {
            code: 'LOGIN_FAILED',
            message: 'Failed to authenticate user'
          }
        };
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role, points')
        .eq('id', authData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      }

      return {
        success: true,
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            name: authData.user.user_metadata?.name || authData.user.email!.split('@')[0],
            role: profile?.role || UserRole.CITIZEN,
            points: profile?.points || 0,
            created_at: authData.user.created_at
          },
          session: {
            access_token: authData.session?.access_token || '',
            refresh_token: authData.session?.refresh_token || '',
            expires_at: authData.session?.expires_at || 0
          }
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred during login'
        }
      };
    }
  }

  static async logout(): Promise<ApiResponse<null>> {
    try {
      const supabase = await this.getSupabase();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: {
            code: 'LOGOUT_ERROR',
            message: error.message
          }
        };
      }

      return { success: true };

    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred during logout'
        }
      };
    }
  }

  static async getCurrentUser(token: string): Promise<ApiResponse<{ id: string; email: string; name: string; role: UserRole; points: number; created_at: string }>> {
    try {
      const supabase = await this.getSupabase();
      
      const { data: user, error } = await supabase.auth.api.getUser(token);

      if (error) {
        return {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired authentication token'
          }
        };
      }

      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        };
      }

      return { success: true, data: user };

    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to authenticate user'
        }
      };
    }
  }
}
