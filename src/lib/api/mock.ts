/**
 * Mock API Implementation
 * تنفيذ API المحاكاة
 * 
 * This implements all API calls locally using:
 * - Tool registry for tool execution
 * - Template registry for template rendering
 * - localStorage for persistence
 */

import { toolsRegistry, getToolBySlug } from '@/lib/tools/registry';
import { templateRegistry } from '@/lib/templates/registry';
import {
  getProjects,
  saveProject as saveProjectToStorage,
  deleteProject as deleteProjectFromStorage,
  getProjectById,
  trackEvent as trackEventStorage,
  getUsageStats,
  getRunsToday,
  getTotalStorageUsed,
  getCurrentUser,
  getEvents,
  incrementRunCount,
  type StoredProject,
} from './storage';
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
import { PLAN_LIMITS } from '@/lib/entitlements';

// ============================================
// Delay Simulation
// ============================================

function mockDelay(ms: number = 600): Promise<void> {
  const delay = ms + Math.random() * 300; // 600-900ms
  return new Promise(resolve => setTimeout(resolve, delay));
}

// ============================================
// Tools API
// ============================================

export async function getTools(): Promise<ToolListResponse> {
  await mockDelay(400);
  
  const tools = toolsRegistry.map((tool: { slug: string; name: string; description: string; category: string; access: string; icon: string; isNew?: boolean; isPopular?: boolean }) => ({
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    access: tool.access,
    icon: tool.icon,
    isNew: tool.isNew,
    isPopular: tool.isPopular,
  }));
  
  return { success: true, tools };
}

export async function runTool(request: ToolRunRequest): Promise<ToolRunResponse> {
  await mockDelay();
  
  const tool = getToolBySlug(request.slug);
  
  if (!tool) {
    return {
      success: false,
      error: `الأداة "${request.slug}" غير موجودة`,
    };
  }
  
  // Validate input
  const validation = tool.inputSchema.safeParse(request.input);
  if (!validation.success) {
    const errorMessage = validation.error instanceof Error ? validation.error.message : 'خطأ في الإدخال';
    return {
      success: false,
      error: `خطأ في الإدخال: ${errorMessage}`,
    };
  }
  
  try {
    const startTime = performance.now();
    const result = await Promise.resolve(tool.run(request.input));
    const executionTimeMs = Math.round(performance.now() - startTime);
    
    // Track usage
    incrementRunCount(tool.slug);
    
    return {
      success: true,
      result,
      executionTimeMs,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
    };
  }
}

// ============================================
// Templates API
// ============================================

export async function getTemplates(): Promise<TemplateListResponse> {
  await mockDelay(400);
  
  const templates = templateRegistry.getAllTemplates().map(template => ({
    slug: template.slug,
    name: template.name,
    description: template.description,
    category: template.category,
    access: template.access.tier,
    icon: template.ui.icon,
    badge: template.ui.badge,
  }));
  
  return { success: true, templates };
}

export async function runTemplate(request: TemplateRunRequest): Promise<TemplateRunResponse> {
  await mockDelay();
  
  const template = templateRegistry.getTemplate(request.slug);
  
  if (!template) {
    return {
      success: false,
      error: `القالب "${request.slug}" غير موجود`,
    };
  }
  
  // Validate input
  const validation = template.inputSchema.safeParse(request.input);
  if (!validation.success) {
    const errorMessage = validation.error instanceof Error ? validation.error.message : 'خطأ في الإدخال';
    return {
      success: false,
      error: `خطأ في الإدخال: ${errorMessage}`,
    };
  }
  
  try {
    const previewData = template.renderPreview(request.input);
    
    return {
      success: true,
      result: {
        title: previewData.title,
        content: previewData.content,
        previewData: previewData.fields,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
    };
  }
}

// ============================================
// Projects API
// ============================================

export async function saveProject(request: SaveProjectRequest): Promise<SaveProjectResponse> {
  await mockDelay(300);
  
  const user = getCurrentUser();
  const projectId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Estimate size
  const sizeEstimateBytes = new Blob([JSON.stringify(request)]).size;
  
  const project: StoredProject = {
    id: projectId,
    ownerId: user?.id || 'guest',
    type: request.type,
    slug: request.slug,
    title: request.title,
    input: request.input,
    result: request.result,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeEstimateBytes,
  };
  
  saveProjectToStorage(project);
  
  return {
    success: true,
    projectId,
  };
}

export async function listProjects(params: ListProjectsRequest = {}): Promise<PaginatedResponse<Project>> {
  await mockDelay(400);
  
  const user = getCurrentUser();
  let projects = getProjects().filter(p => p.ownerId === (user?.id || 'guest'));
  
  // Filter by type
  if (params.type) {
    projects = projects.filter(p => p.type === params.type);
  }
  
  // Filter by slug
  if (params.slug) {
    projects = projects.filter(p => p.slug === params.slug);
  }
  
  // Sort by date (newest first)
  projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = projects.slice(start, end);
  
  return {
    data: paginatedData as Project[],
    total: projects.length,
    page,
    limit,
    totalPages: Math.ceil(projects.length / limit),
    hasNext: end < projects.length,
    hasPrev: page > 1,
  };
}

export async function getProject(id: string): Promise<{ success: boolean; project?: Project; error?: string }> {
  await mockDelay(200);
  
  const project = getProjectById(id);
  
  if (!project) {
    return { success: false, error: 'المشروع غير موجود' };
  }
  
  return { success: true, project: project as Project };
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  await mockDelay(300);
  
  const success = deleteProjectFromStorage(id);
  
  if (!success) {
    return { success: false, error: 'المشروع غير موجود' };
  }
  
  return { success: true };
}

// ============================================
// User Dashboard API
// ============================================

export async function getUserOverview(): Promise<GetUserOverviewResponse> {
  await mockDelay(500);
  
  const user = getCurrentUser();
  const projects = getProjects().filter(p => p.ownerId === (user?.id || 'guest'));
  const usageStats = getUsageStats();
  const events = getEvents();
  const runsToday = getRunsToday();
  const storageUsed = getTotalStorageUsed();
  
  // Get last tool used
  const toolRuns = events
    .filter(e => e.event === 'tool_run_success')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const lastTool = toolRuns[0];
  const lastToolSlug = lastTool?.payload?.slug as string | undefined;
  const lastToolName = lastToolSlug 
    ? getToolBySlug(lastToolSlug)?.name 
    : null;
  
  // Get plan limits
  const planId = user?.plan || 'free';
  const planLimits = PLAN_LIMITS[planId];
  
  // Recent activity
  const recentActivity = events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .map(e => ({
      id: e.id,
      type: e.event,
      toolSlug: e.payload?.slug as string | undefined,
      toolName: e.payload?.slug 
        ? getToolBySlug(e.payload.slug as string)?.name 
        : undefined,
      timestamp: e.timestamp,
      metadata: e.payload,
    }));
  
  return {
    success: true,
    overview: {
      totalProjects: projects.length,
      totalRuns: usageStats.totalRuns,
      lastToolUsed: lastToolName || null,
      lastRunAt: lastTool?.timestamp || null,
      
      plan: {
        id: planId,
        name: planLimits.name,
        nameAr: planLimits.nameAr,
      },
      
      usage: {
        runsToday,
        runsLimit: planLimits.maxRunsPerDay,
        runsRemaining: Math.max(0, planLimits.maxRunsPerDay - runsToday),
        storageUsedBytes: storageUsed,
        storageLimitBytes: planLimits.maxStorageBytes,
        storageRemainingBytes: Math.max(0, planLimits.maxStorageBytes - storageUsed),
      },
      
      recentActivity,
    },
  };
}

// ============================================
// Admin Dashboard API
// ============================================

// Mock admin data
const MOCK_USERS = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', plan: 'pro', usagePercent: 45, createdAt: '2024-01-15' },
  { id: '2', name: 'سارة عبدالله', email: 'sara@example.com', plan: 'business', usagePercent: 78, createdAt: '2024-02-01' },
  { id: '3', name: 'خالد العمري', email: 'khaled@example.com', plan: 'free', usagePercent: 12, createdAt: '2024-02-10' },
  { id: '4', name: 'نورة السالم', email: 'noura@example.com', plan: 'pro', usagePercent: 92, createdAt: '2024-01-20' },
  { id: '5', name: 'فهد الدوسري', email: 'fahad@example.com', plan: 'enterprise', usagePercent: 34, createdAt: '2023-12-05' },
  { id: '6', name: 'ليلى الحربي', email: 'laila@example.com', plan: 'free', usagePercent: 8, createdAt: '2024-03-01' },
  { id: '7', name: 'عمر الزهراني', email: 'omar@example.com', plan: 'pro', usagePercent: 67, createdAt: '2024-01-28' },
  { id: '8', name: 'مها القحطاني', email: 'maha@example.com', plan: 'business', usagePercent: 55, createdAt: '2024-02-15' },
  { id: '9', name: 'ياسر الشمري', email: 'yaser@example.com', plan: 'free', usagePercent: 23, createdAt: '2024-03-10' },
  { id: '10', name: 'هند البقمي', email: 'hind@example.com', plan: 'pro', usagePercent: 89, createdAt: '2024-01-05' },
];

export async function getAdminOverview(): Promise<GetAdminOverviewResponse> {
  await mockDelay(600);
  
  const user = getCurrentUser();
  
  if (user?.role !== 'admin') {
    return {
      success: false,
      error: 'غير مصرح',
    };
  }
  
  const allProjects = getProjects();
  const totalStorage = getTotalStorageUsed();
  const events = getEvents();
  
  // Calculate top tools
  const toolRuns = events.filter(e => e.event === 'tool_run_success');
  const toolCounts: Record<string, number> = {};
  
  toolRuns.forEach(e => {
    const slug = e.payload?.slug as string;
    if (slug) {
      toolCounts[slug] = (toolCounts[slug] || 0) + 1;
    }
  });
  
  const topTools = Object.entries(toolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, count]) => ({
      slug,
      name: getToolBySlug(slug)?.name || slug,
      runCount: count,
    }));
  
  return {
    success: true,
    overview: {
      kpis: {
        totalVisitors: 15234,
        totalUsers: MOCK_USERS.length,
        totalSubscribers: MOCK_USERS.filter(u => u.plan !== 'free').length,
        conversionRate: 28.5,
        monthlyRecurringRevenue: 8750,
      },
      
      storage: {
        totalUsedBytes: totalStorage,
        averageProjectSizeBytes: allProjects.length > 0 ? totalStorage / allProjects.length : 0,
        projectCount: allProjects.length,
      },
      
      topTools: topTools.length > 0 ? topTools : [
        { slug: 'lesson-plan', name: 'منشئ خطط الدروس', runCount: 145 },
        { slug: 'quiz-generator', name: 'مولد الاختبارات', runCount: 98 },
        { slug: 'email-formatter', name: 'منسق الرسائل الرسمية', runCount: 76 },
      ],
      
      users: MOCK_USERS,
    },
  };
}

// ============================================
// Analytics API
// ============================================

export async function trackEvent(request: TrackEventRequest): Promise<TrackEventResponse> {
  // No delay for tracking - fire and forget
  
  trackEventStorage(request.event, {
    ...request.payload,
    timestamp: request.timestamp || new Date().toISOString(),
  });
  
  return { success: true };
}

// ============================================
// Export API
// ============================================

export async function exportResult(request: ExportResultRequest): Promise<ExportResultResponse> {
  await mockDelay(800);
  
  // In mock mode, we simulate export by returning a message
  // In real implementation, this would generate a file
  
  const formatLabels: Record<string, string> = {
    txt: 'ملف نصي',
    json: 'JSON',
    pdf: 'PDF',
    png: 'صورة PNG',
    docx: 'Word',
  };
  
  return {
    success: true,
    message: `تم إعداد التصدير بصيغة ${formatLabels[request.format] || request.format}`,
    // In real implementation:
    // downloadUrl: `/api/exports/${exportId}`,
    // blob: generatedBlob,
  };
}
