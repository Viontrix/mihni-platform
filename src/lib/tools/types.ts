/**
 * Smart Tools - Type Definitions
 * نظام الأدوات الذكية - تعريف الأنواع
 */

import { z } from 'zod';

// ============================================
// Tool Access Levels
// ============================================
export type ToolAccessLevel = 'free' | 'pro' | 'business' | 'enterprise';

// ============================================
// Tool Categories
// ============================================
export type ToolCategory = 
  | 'planning' 
  | 'assessment' 
  | 'communication' 
  | 'analysis' 
  | 'productivity';

// ============================================
// Tool Input/Output Types
// ============================================
export interface ToolResult {
  title: string;
  output: string;
  meta?: Record<string, string | number>;
  timestamp?: number;
}

export interface ToolHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  input: Record<string, unknown>;
  result: ToolResult;
  timestamp: number;
}

export interface SavedProject {
  id: string;
  name: string;
  toolId: string;
  toolName: string;
  data: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Tool Definition
// ============================================
export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  access: ToolAccessLevel;
  isNew?: boolean;
  isPopular?: boolean;
  icon: string;
  inputSchema: z.ZodType<unknown>;
  defaultValues: Record<string, unknown>;
  run: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
}

// ============================================
// User Plan Types
// ============================================
export type UserPlan = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanFeatures {
  id: UserPlan;
  name: string;
  nameAr: string;
  maxRunsPerDay: number;
  enabledAccessLevels: ToolAccessLevel[];
  maxSavedProjects: number;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  color: string;
}

// ============================================
// Usage Tracking Types
// ============================================
export interface DailyUsage {
  date: string;
  runs: number;
  toolsUsed: string[];
}

export interface UsageStats {
  totalRuns: number;
  dailyRuns: DailyUsage[];
  lastResetDate: string;
}

// ============================================
// Analytics Event Types
// ============================================
export type AnalyticsEvent = 
  | 'tool_opened'
  | 'tool_run'
  | 'tool_export'
  | 'tool_saved_project'
  | 'upgrade_clicked'
  | 'project_created'
  | 'project_deleted';

export interface AnalyticsPayload {
  toolId?: string;
  toolName?: string;
  plan?: UserPlan;
  metadata?: Record<string, unknown>;
}

// ============================================
// UI Component Props
// ============================================
export interface ToolCardProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  onClick: () => void;
}

export interface ToolShellProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export interface UsageMeterProps {
  used: number;
  limit: number;
  plan: UserPlan;
}

export interface ToolLockedOverlayProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  onUpgrade: () => void;
}
