import { z } from 'zod';
import { UserRole, IssueCategory, IssueStatus } from './types';

// Production-grade validation schemas
export const authSchemas = {
  signup: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    role: z.nativeEnum(UserRole).default(UserRole.CITIZEN)
  }),

  login: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  }),

  refreshToken: z.object({
    refresh_token: z.string().min(1, 'Refresh token is required')
  })
};

export const issueSchemas = {
  create: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must not exceed 200 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must not exceed 2000 characters'),
    category: z.nativeEnum(IssueCategory),
    latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
    longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
    image_before: z.string().url('Invalid image URL').optional()
  }),

  update: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must not exceed 200 characters').optional(),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must not exceed 2000 characters').optional(),
    category: z.nativeEnum(IssueCategory).optional()
  }),

  updateStatus: z.object({
    status: z.nativeEnum(IssueStatus),
    image_after: z.string().url('Invalid image URL').optional(),
    assigned_to: z.string().uuid('Invalid assignee ID').optional(),
    resolution_notes: z.string().min(10, 'Resolution notes must be at least 10 characters').max(1000, 'Resolution notes must not exceed 1000 characters').optional()
  })
};

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.nativeEnum(IssueStatus).optional(),
  category: z.nativeEnum(IssueCategory).optional(),
  user_id: z.string().uuid().optional()
});

export const userSchemas = {
  updateProfile: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').optional(),
    email: z.string().email('Invalid email format').optional()
  })
};

// Validation helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e: any) => e.message).join(', ');
      return { success: false, error: message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
