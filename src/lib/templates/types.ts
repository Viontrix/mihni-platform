/**
 * Templates - Type Definitions
 * القوالب - تعريف الأنواع
 */

import { z } from 'zod';

// ============================================
// Template Categories
// ============================================

export type TemplateCategory = 
  | 'certificates'
  | 'reports'
  | 'schedules'
  | 'forms'
  | 'presentations'
  | 'invitations'
  | 'letters';

// ============================================
// Template Access
// ============================================

export interface TemplateAccess {
  tier: 'free' | 'pro' | 'business' | 'enterprise';
}

// ============================================
// Template UI
// ============================================

export interface TemplateUI {
  icon: string;
  gradient: string;
  badge?: string;
}

// ============================================
// Template Preview Data
// ============================================

export interface TemplatePreviewData {
  title: string;
  content: string;
  fields: Record<string, string | string[]>;
}

// ============================================
// Template Definition
// ============================================

export interface TemplateDefinition {
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  access: TemplateAccess;
  ui: TemplateUI;
  inputSchema: z.ZodType<unknown>;
  defaultValues: Record<string, unknown>;
  renderPreview: (input: Record<string, unknown>) => TemplatePreviewData;
  exportOptions: ('pdf' | 'png' | 'docx')[];
}
