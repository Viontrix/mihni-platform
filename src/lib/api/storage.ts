/**
 * API Storage - LocalStorage Wrapper
 * تخزين API - غلاف LocalStorage
 * 
 * Unified storage layer for mock API operations.
 * All data is prefixed with 'app.' to avoid conflicts.
 */

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  PROJECTS: 'app.projects',
  EVENTS: 'app.events',
  USER: 'app.user',
  SETTINGS: 'app.settings',
  LIMITS: 'app.limits',
  USAGE: 'app.usage',
  SESSION: 'app.session',
} as const;

// ============================================
// Core Storage Functions
// ============================================

/**
 * Get item from localStorage as JSON
 */
export function getJson<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Set item in localStorage as JSON
 */
export function setJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
}

/**
 * Push item to array in localStorage
 */
export function pushJson<T>(key: string, item: T): T[] {
  const array = getJson<T[]>(key, []);
  array.push(item);
  setJson(key, array);
  return array;
}

/**
 * Remove item from localStorage
 */
export function removeJson(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
}

// ============================================
// Project Storage
// ============================================

export interface StoredProject {
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

export function getProjects(): StoredProject[] {
  return getJson<StoredProject[]>(STORAGE_KEYS.PROJECTS, []);
}

export function saveProject(project: StoredProject): void {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  setJson(STORAGE_KEYS.PROJECTS, projects);
}

export function deleteProject(projectId: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  
  if (filtered.length === projects.length) {
    return false;
  }
  
  setJson(STORAGE_KEYS.PROJECTS, filtered);
  return true;
}

export function getProjectById(projectId: string): StoredProject | null {
  const projects = getProjects();
  return projects.find(p => p.id === projectId) || null;
}

// ============================================
// Event/Analytics Storage
// ============================================

export interface StoredEvent {
  id: string;
  event: string;
  payload?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export function getEvents(): StoredEvent[] {
  return getJson<StoredEvent[]>(STORAGE_KEYS.EVENTS, []);
}

export function trackEvent(event: string, payload?: Record<string, unknown>): StoredEvent {
  const events = getEvents();
  const user = getJson<{ id: string } | null>(STORAGE_KEYS.USER, null);
  
  const newEvent: StoredEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    event,
    payload,
    timestamp: new Date().toISOString(),
    userId: user?.id,
  };
  
  // Keep only last 1000 events to prevent storage bloat
  events.push(newEvent);
  if (events.length > 1000) {
    events.shift();
  }
  
  setJson(STORAGE_KEYS.EVENTS, events);
  return newEvent;
}

export function getEventsByType(eventType: string): StoredEvent[] {
  return getEvents().filter(e => e.event === eventType);
}

export function getRecentEvents(limit: number = 10): StoredEvent[] {
  return getEvents()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// ============================================
// Usage Tracking Storage
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

export function getUsageStats(): UsageStats {
  return getJson<UsageStats>(STORAGE_KEYS.USAGE, {
    totalRuns: 0,
    dailyRuns: [],
    lastResetDate: new Date().toISOString(),
  });
}

export function incrementRunCount(toolSlug: string): void {
  const stats = getUsageStats();
  const today = new Date().toISOString().split('T')[0];
  
  stats.totalRuns++;
  
  const todayIndex = stats.dailyRuns.findIndex(d => d.date === today);
  if (todayIndex >= 0) {
    stats.dailyRuns[todayIndex].runs++;
    if (!stats.dailyRuns[todayIndex].toolsUsed.includes(toolSlug)) {
      stats.dailyRuns[todayIndex].toolsUsed.push(toolSlug);
    }
  } else {
    stats.dailyRuns.push({
      date: today,
      runs: 1,
      toolsUsed: [toolSlug],
    });
  }
  
  // Keep only last 30 days
  if (stats.dailyRuns.length > 30) {
    stats.dailyRuns = stats.dailyRuns.slice(-30);
  }
  
  setJson(STORAGE_KEYS.USAGE, stats);
}

export function getRunsToday(): number {
  const stats = getUsageStats();
  const today = new Date().toISOString().split('T')[0];
  const todayStats = stats.dailyRuns.find(d => d.date === today);
  return todayStats?.runs || 0;
}

// ============================================
// User Storage
// ============================================

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  createdAt: string;
  avatar?: string;
}

export function getCurrentUser(): StoredUser | null {
  return getJson<StoredUser | null>(STORAGE_KEYS.USER, null);
}

export function setCurrentUser(user: StoredUser | null): void {
  setJson(STORAGE_KEYS.USER, user);
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

// ============================================
// Storage Utilities
// ============================================

export function getTotalStorageUsed(): number {
  const projects = getProjects();
  return projects.reduce((total, p) => total + (p.sizeEstimateBytes || 0), 0);
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

export function exportAllData(): Record<string, unknown> {
  return {
    projects: getProjects(),
    events: getEvents(),
    usage: getUsageStats(),
    user: getCurrentUser(),
  };
}
