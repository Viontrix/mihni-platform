/**
 * Projects - Type Definitions
 * المشاريع - تعريف الأنواع
 * 
 * Unified project model for saved tool/template outputs.
 */

// ============================================
// Project Types
// ============================================

export type ProjectType = 'tool' | 'template';

// ============================================
// Project Model
// ============================================

export interface Project {
  id: string;
  ownerId: string;
  type: ProjectType;
  slug: string;
  title: string;
  input: Record<string, unknown>;
  result: unknown;
  createdAt: string;
  updatedAt: string;
  sizeEstimateBytes: number;
}

// ============================================
// Project List Item (for lists)
// ============================================

export interface ProjectListItem {
  id: string;
  type: ProjectType;
  slug: string;
  title: string;
  toolName?: string;
  templateName?: string;
  createdAt: string;
  updatedAt: string;
  sizeEstimateBytes: number;
}

// ============================================
// Project Filters
// ============================================

export interface ProjectFilters {
  type?: ProjectType;
  slug?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// Project Sort Options
// ============================================

export type ProjectSortBy = 'createdAt' | 'updatedAt' | 'title';
export type ProjectSortOrder = 'asc' | 'desc';
