// Production-ready type definitions for NAGAR-SEVA backend

export enum UserRole {
  CITIZEN = 'CITIZEN',
  ADMIN = 'ADMIN'
}

export enum IssueStatus {
  REPORTED = 'REPORTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum IssueCategory {
  ROAD_DAMAGE = 'ROAD_DAMAGE',
  STREET_LIGHT = 'STREET_LIGHT',
  GARBAGE = 'GARBAGE',
  WATER_SUPPLY = 'WATER_SUPPLY',
  ELECTRICITY = 'ELECTRICITY',
  PUBLIC_TOILET = 'PUBLIC_TOILET',
  PARK_MAINTENANCE = 'PARK_MAINTENANCE',
  TRAFFIC_SIGNAL = 'TRAFFIC_SIGNAL'
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  points: number;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  status: IssueStatus;
  image_before?: string;
  image_after?: string;
  created_at: string;
  user_id: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  image_before?: string;
}

export interface UpdateIssueStatusRequest {
  status: IssueStatus;
  image_after?: string;
  assigned_to?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface AuthResponse {
  user: AuthUser;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'ISSUE_CREATED' | 'ISSUE_UPDATED' | 'ISSUE_RESOLVED' | 'ISSUE_ASSIGNED';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
}
