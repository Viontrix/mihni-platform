/**
 * Remote API Implementation
 * تنفيذ API البعيد
 * 
 * This is a placeholder for the real backend API.
 * When VITE_API_MODE=remote, these functions will call the actual backend.
 * 
 * For now, if backend is not configured, it returns a friendly error message.
 */

import { API_BASE_URL } from './types';
import type {
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
} from './types';

// ============================================
// Configuration Check
// ============================================

const isBackendConfigured = (): boolean => {
  // Check if API_BASE_URL is set and not localhost (for production)
  const baseUrl = API_BASE_URL;
  return baseUrl && !baseUrl.includes('localhost');
};

// ============================================
// Error Handler
// ============================================

function createNotConfiguredError(): { success: false; error: string } {
  return {
    success: false,
    error: 'الخادم البعيد غير مهيأ. يرجى ضبط VITE_API_BASE_URL أو استخدام الوضع المحلي (mock).',
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | { success: false; error: string }> {
  if (!isBackendConfigured()) {
    return createNotConfiguredError() as T;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `خطأ ${response.status}: ${response.statusText}`,
      } as T;
    }

    return await response.json() as T;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في الاتصال بالخادم',
    } as T;
  }
}

// ============================================
// Tools API
// ============================================

export async function getTools(): Promise<ToolListResponse> {
  const result = await apiRequest<ToolListResponse>('/tools', { method: 'GET' });
  if ('error' in result && !('tools' in result)) {
    return { success: false, tools: [], error: result.error };
  }
  return result as ToolListResponse;
}

export async function runTool(req: ToolRunRequest): Promise<ToolRunResponse> {
  const result = await apiRequest<ToolRunResponse>('/tools/run', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if ('error' in result && !('result' in result)) {
    return { success: false, error: result.error };
  }
  return result as ToolRunResponse;
}

// ============================================
// Templates API
// ============================================

export async function getTemplates(): Promise<TemplateListResponse> {
  const result = await apiRequest<TemplateListResponse>('/templates', { method: 'GET' });
  if ('error' in result && !('templates' in result)) {
    return { success: false, templates: [], error: result.error };
  }
  return result as TemplateListResponse;
}

export async function runTemplate(req: TemplateRunRequest): Promise<TemplateRunResponse> {
  const result = await apiRequest<TemplateRunResponse>('/templates/run', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if ('error' in result && !('result' in result)) {
    return { success: false, error: result.error };
  }
  return result as TemplateRunResponse;
}

// ============================================
// Projects API
// ============================================

export async function saveProject(req: SaveProjectRequest): Promise<SaveProjectResponse> {
  const result = await apiRequest<SaveProjectResponse>('/projects', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if ('error' in result && !('projectId' in result)) {
    return { success: false, error: result.error };
  }
  return result as SaveProjectResponse;
}

export async function listProjects(params: ListProjectsRequest = {}): Promise<PaginatedResponse<Project>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.type) searchParams.set('type', params.type);
  if (params.slug) searchParams.set('slug', params.slug);
  
  const queryString = searchParams.toString();
  const endpoint = queryString ? `/projects?${queryString}` : '/projects';
  
  const result = await apiRequest<PaginatedResponse<Project>>(endpoint, { method: 'GET' });
  if ('error' in result && !('data' in result)) {
    return { 
      success: false, 
      data: [], 
      total: 0, 
      page: 1, 
      limit: 10, 
      totalPages: 0, 
      hasNext: false, 
      hasPrev: false,
      error: result.error 
    } as unknown as PaginatedResponse<Project>;
  }
  return result as PaginatedResponse<Project>;
}

export async function getProject(id: string): Promise<{ success: boolean; project?: Project; error?: string }> {
  return apiRequest<{ success: boolean; project?: Project; error?: string }>(`/projects/${id}`, { method: 'GET' });
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  return apiRequest<{ success: boolean; error?: string }>(`/projects/${id}`, { method: 'DELETE' });
}

// ============================================
// Dashboard APIs
// ============================================

export async function getUserOverview(): Promise<GetUserOverviewResponse> {
  return apiRequest<GetUserOverviewResponse>('/me/overview', { method: 'GET' });
}

export async function getAdminOverview(): Promise<GetAdminOverviewResponse> {
  return apiRequest<GetAdminOverviewResponse>('/admin/overview', { method: 'GET' });
}

// ============================================
// Analytics API
// ============================================

export async function trackEvent(req: TrackEventRequest): Promise<TrackEventResponse> {
  const result = await apiRequest<TrackEventResponse>('/events', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if ('error' in result) {
    return { success: false, error: result.error };
  }
  return { success: true };
}

// ============================================
// Export API
// ============================================

export async function exportResult(req: ExportResultRequest): Promise<ExportResultResponse> {
  const result = await apiRequest<ExportResultResponse>('/exports', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  if ('error' in result) {
    return { success: false, error: result.error };
  }
  return result as ExportResultResponse;
}
