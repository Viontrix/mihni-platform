/**
 * Unified API Layer
 * طبقة API الموحدة
 * 
 * This is the single entry point for all API operations.
 * It automatically switches between mock and remote based on VITE_API_MODE.
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const result = await api.runTool({ slug: 'quiz-generator', input: {...} });
 */

import { API_MODE } from './types';
import * as mockApi from './mock';
import * as remoteApi from './remote';
import type { ApiInterface } from './types';

// ============================================
// Export API Mode for reference
// ============================================

export { API_MODE, API_BASE_URL } from './types';
export type { ApiMode } from './types';

// ============================================
// Unified API Export
// ============================================

/**
 * Unified API instance
 * Automatically uses mock or remote based on VITE_API_MODE environment variable
 */
export const api: ApiInterface = API_MODE === 'remote' ? remoteApi : mockApi;

// ============================================
// Re-export types for convenience
// ============================================

export type {
  ToolListResponse,
  ToolRunRequest,
  ToolRunResponse,
  TemplateListResponse,
  TemplateRunRequest,
  TemplateRunResponse,
  SaveProjectRequest,
  SaveProjectResponse,
  ListProjectsRequest,
  Project,
  PaginatedResponse,
  GetUserOverviewResponse,
  GetAdminOverviewResponse,
  TrackEventRequest,
  TrackEventResponse,
  ExportResultRequest,
  ExportResultResponse,
  ExportFormat,
  AnalyticsEventType,
  ApiError,
} from './types';

export { API_ERROR_CODES } from './types';

// ============================================
// Re-export storage utilities
// ============================================

export {
  getJson,
  setJson,
  pushJson,
  removeJson,
  getProjects,
  saveProject,
  deleteProject,
  getProjectById,
  getEvents,
  trackEvent as trackEventStorage,
  getRecentEvents,
  getUsageStats,
  incrementRunCount,
  getRunsToday,
  getTotalStorageUsed,
  getCurrentUser,
  setCurrentUser,
  isAdmin,
  clearAllStorage,
  exportAllData,
  STORAGE_KEYS,
} from './storage';

export type { StoredProject, StoredEvent, StoredUser } from './storage';
