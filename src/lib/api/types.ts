/**
 * API Layer - Type Definitions
 * طبقة API - تعريف الأنواع
 * 
 * Unified API types for both mock and remote modes.
 * This is the contract between frontend and backend.
 */

import type { ToolResult } from '@/lib/tools/types';

// ============================================
// API Mode
// ============================================

export type ApiMode = 'mock' | 'remote';

export const API_MODE: ApiMode = (import.meta.env.VITE_API_MODE as ApiMode) || 'mock';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================
// Tool API Types
// ============================================

export interface ToolRunRequest {
  slug: string;
  input: Record<string, unknown>;
}

export interface ToolRunResponse {
  success: boolean;
  result?: ToolResult;
  error?: string;
  executionTimeMs?: number;
}

export interface ToolListResponse {
  success: boolean;
  tools: Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
    access: string;
    icon: string;
    isNew?: boolean;
    isPopular?: boolean;
  }>;
  error?: string;
}

// ============================================
// Template API Types
// ============================================

export interface TemplateRunRequest {
  slug: string;
  input: Record<string, unknown>;
}

export interface TemplateRunResponse {
  success: boolean;
  result?: {
    title: string;
    content: string;
    previewData?: Record<string, unknown>;
  };
  error?: string;
}

export interface TemplateListResponse {
  success: boolean;
  templates: Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
    access: string;
    icon: string;
    badge?: string;
  }>;
  error?: string;
}

// ============================================
// Project API Types
// ============================================

export interface SaveProjectRequest {
  type: 'tool' | 'template';
  slug: string;
  title: string;
  input: Record<string, unknown>;
  result: unknown;
}

export interface SaveProjectResponse {
  success: boolean;
  projectId?: string;
  error?: string;
}

export interface ListProjectsRequest extends PaginationParams {
  type?: 'tool' | 'template';
  slug?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  type: 'tool' | 'template';
  slug: string;
  title: string;
  input: Record<string, unknown>;
  result: unknown;
  createdAt: string;
  updatedAt: string;
  sizeEstimateBytes: number;
}

// ============================================
// User Dashboard Types
// ============================================

export interface GetUserOverviewResponse {
  success: boolean;
  overview?: {
    // Stats
    totalProjects: number;
    totalRuns: number;
    lastToolUsed: string | null;
    lastRunAt: string | null;
    
    // Plan info
    plan: {
      id: string;
      name: string;
      nameAr: string;
    };
    
    // Usage & Limits
    usage: {
      runsToday: number;
      runsLimit: number;
      runsRemaining: number;
      storageUsedBytes: number;
      storageLimitBytes: number;
      storageRemainingBytes: number;
    };
    
    // Recent activity
    recentActivity: Array<{
      id: string;
      type: string;
      toolSlug?: string;
      toolName?: string;
      timestamp: string;
      metadata?: Record<string, unknown>;
    }>;
  };
  error?: string;
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface GetAdminOverviewResponse {
  success: boolean;
  overview?: {
    // KPIs
    kpis: {
      totalVisitors: number;
      totalUsers: number;
      totalSubscribers: number;
      conversionRate: number;
      monthlyRecurringRevenue: number;
    };
    
    // Storage
    storage: {
      totalUsedBytes: number;
      averageProjectSizeBytes: number;
      projectCount: number;
    };
    
    // Top tools
    topTools: Array<{
      slug: string;
      name: string;
      runCount: number;
    }>;
    
    // Users table (mock)
    users: Array<{
      id: string;
      name: string;
      email: string;
      plan: string;
      usagePercent: number;
      createdAt: string;
    }>;
  };
  error?: string;
}

// ============================================
// Analytics/Tracking Types
// ============================================

export type AnalyticsEventType = 
  | 'page_view'
  | 'tool_opened'
  | 'tool_run_started'
  | 'tool_run_success'
  | 'tool_run_error'
  | 'tool_export'
  | 'tool_save_project'
  | 'template_opened'
  | 'template_run_started'
  | 'template_run_success'
  | 'template_run_error'
  | 'template_export'
  | 'upgrade_clicked'
  | 'payment_initiated'
  | 'payment_success'
  | 'payment_failed'
  | 'user_login'
  | 'user_register'
  | 'user_logout';

export interface TrackEventRequest {
  event: AnalyticsEventType;
  payload?: Record<string, unknown>;
  timestamp?: string;
}

export interface TrackEventResponse {
  success: boolean;
  error?: string;
}

// ============================================
// Export Types
// ============================================

export type ExportFormat = 'txt' | 'json' | 'pdf' | 'png' | 'docx';

export interface ExportResultRequest {
  format: ExportFormat;
  type: 'tool' | 'template';
  slug: string;
  result: unknown;
  title?: string;
}

export interface ExportResultResponse {
  success: boolean;
  downloadUrl?: string;
  blob?: Blob;
  error?: string;
  message?: string;
}

// ============================================
// API Error Types
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const API_ERROR_CODES = {
  NOT_CONFIGURED: 'REMOTE_BACKEND_NOT_CONFIGURED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  TOOL_LOCKED: 'TOOL_LOCKED',
} as const;

// ============================================
// Unified API Interface
// ============================================

export interface ApiInterface {
  // Tools
  getTools(): Promise<ToolListResponse>;
  runTool(request: ToolRunRequest): Promise<ToolRunResponse>;
  
  // Templates
  getTemplates(): Promise<TemplateListResponse>;
  runTemplate(request: TemplateRunRequest): Promise<TemplateRunResponse>;
  
  // Projects
  saveProject(request: SaveProjectRequest): Promise<SaveProjectResponse>;
  listProjects(params?: ListProjectsRequest): Promise<PaginatedResponse<Project>>;
  getProject(id: string): Promise<{ success: boolean; project?: Project; error?: string }>;
  deleteProject(id: string): Promise<{ success: boolean; error?: string }>;
  
  // Dashboards
  getUserOverview(): Promise<GetUserOverviewResponse>;
  getAdminOverview(): Promise<GetAdminOverviewResponse>;
  
  // Analytics
  trackEvent(request: TrackEventRequest): Promise<TrackEventResponse>;
  
  // Export
  exportResult(request: ExportResultRequest): Promise<ExportResultResponse>;
}
