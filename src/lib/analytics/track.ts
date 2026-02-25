/**
 * Analytics Tracking System
 * نظام تتبع التحليلات
 * 
 * Events: tool_opened, tool_run, tool_export, tool_saved_project, upgrade_clicked
 * لاحقاً: استبدل localStorage بـ API calls
 */

import type { AnalyticsEvent, AnalyticsPayload, UserPlan } from '../tools/types';

const ANALYTICS_KEY = 'mahni_analytics_events';
const SESSION_KEY = 'mahni_analytics_session';

// ============================================
// Analytics Event Interface
// ============================================

interface TrackedEvent {
  id: string;
  event: AnalyticsEvent;
  payload: AnalyticsPayload;
  timestamp: number;
  sessionId: string;
}

interface AnalyticsSession {
  id: string;
  startedAt: number;
  userPlan: UserPlan;
}

// ============================================
// Generate IDs
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Session Management
// ============================================

export function getOrCreateSession(userPlan: UserPlan = 'free'): AnalyticsSession {
  if (typeof window === 'undefined') {
    return { id: generateId(), startedAt: Date.now(), userPlan };
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: AnalyticsSession = JSON.parse(stored);
      // Check if session is still valid (less than 24 hours)
      if (Date.now() - session.startedAt < 24 * 60 * 60 * 1000) {
        return session;
      }
    }
  } catch (error) {
    console.error('Error reading analytics session:', error);
  }

  const newSession: AnalyticsSession = {
    id: generateId(),
    startedAt: Date.now(),
    userPlan,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  } catch (error) {
    console.error('Error saving analytics session:', error);
  }

  return newSession;
}

// ============================================
// Get Stored Events
// ============================================

export function getStoredEvents(): TrackedEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading analytics events:', error);
  }

  return [];
}

// ============================================
// Save Events
// ============================================

function saveEvents(events: TrackedEvent[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Keep only last 1000 events to prevent storage overflow
    const trimmedEvents = events.slice(-1000);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedEvents));
  } catch (error) {
    console.error('Error saving analytics events:', error);
  }
}

// ============================================
// Track Event (Main Function)
// ============================================

export function track(
  eventName: AnalyticsEvent,
  payload: AnalyticsPayload = {},
  userPlan: UserPlan = 'free'
): void {
  const session = getOrCreateSession(userPlan);
  
  const event: TrackedEvent = {
    id: generateId(),
    event: eventName,
    payload,
    timestamp: Date.now(),
    sessionId: session.id,
  };

  // Store in localStorage
  const events = getStoredEvents();
  events.push(event);
  saveEvents(events);

  // Log to console for debugging
  console.log('[Analytics]', eventName, {
    ...payload,
    plan: userPlan,
    timestamp: new Date(event.timestamp).toISOString(),
  });

  // TODO: Later - Send to analytics API
  // sendToAnalyticsAPI(event);
}

// ============================================
// Convenience Functions
// ============================================

export function trackToolOpened(toolId: string, toolName: string, userPlan: UserPlan): void {
  track('tool_opened', { toolId, toolName }, userPlan);
}

export function trackToolRun(toolId: string, toolName: string, userPlan: UserPlan): void {
  track('tool_run', { toolId, toolName }, userPlan);
}

export function trackToolExport(
  toolId: string, 
  toolName: string, 
  format: string, 
  userPlan: UserPlan
): void {
  track('tool_export', { toolId, toolName, metadata: { format } }, userPlan);
}

export function trackToolSavedProject(
  toolId: string, 
  toolName: string, 
  projectName: string, 
  userPlan: UserPlan
): void {
  track('tool_saved_project', { toolId, toolName, metadata: { projectName } }, userPlan);
}

export function trackUpgradeClicked(
  fromPlan: UserPlan, 
  toPlan: UserPlan, 
  source: string
): void {
  track('upgrade_clicked', { 
    plan: fromPlan, 
    metadata: { toPlan, source } 
  }, fromPlan);
}

export function trackProjectCreated(projectName: string, toolId: string, userPlan: UserPlan): void {
  track('project_created', { toolId, metadata: { projectName } }, userPlan);
}

export function trackProjectDeleted(projectId: string, userPlan: UserPlan): void {
  track('project_deleted', { metadata: { projectId } }, userPlan);
}

// ============================================
// Analytics Queries
// ============================================

export function getEventsByType(eventName: AnalyticsEvent): TrackedEvent[] {
  const events = getStoredEvents();
  return events.filter(e => e.event === eventName);
}

export function getToolUsageStats(toolId: string): {
  opens: number;
  runs: number;
  exports: number;
  saves: number;
} {
  const events = getStoredEvents();
  
  return {
    opens: events.filter(e => e.event === 'tool_opened' && e.payload.toolId === toolId).length,
    runs: events.filter(e => e.event === 'tool_run' && e.payload.toolId === toolId).length,
    exports: events.filter(e => e.event === 'tool_export' && e.payload.toolId === toolId).length,
    saves: events.filter(e => e.event === 'tool_saved_project' && e.payload.toolId === toolId).length,
  };
}

export function getMostUsedTools(limit: number = 5): { toolId: string; toolName: string; count: number }[] {
  const events = getStoredEvents().filter(e => e.event === 'tool_run');
  const counts: Record<string, { toolId: string; toolName: string; count: number }> = {};

  events.forEach(event => {
    const toolId = event.payload.toolId;
    const toolName = event.payload.toolName;
    if (toolId && toolName) {
      if (!counts[toolId]) {
        counts[toolId] = { toolId, toolName, count: 0 };
      }
      counts[toolId].count++;
    }
  });

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getDailyStats(days: number = 7): { date: string; runs: number; opens: number }[] {
  const events = getStoredEvents();
  const stats: Record<string, { runs: number; opens: number }> = {};

  // Initialize last N days
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    stats[dateStr] = { runs: 0, opens: 0 };
  }

  // Count events
  events.forEach(event => {
    const dateStr = new Date(event.timestamp).toISOString().split('T')[0];
    if (stats[dateStr]) {
      if (event.event === 'tool_run') {
        stats[dateStr].runs++;
      } else if (event.event === 'tool_opened') {
        stats[dateStr].opens++;
      }
    }
  });

  return Object.entries(stats)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ============================================
// Clear Analytics (for testing/privacy)
// ============================================

export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ANALYTICS_KEY);
  localStorage.removeItem(SESSION_KEY);
  console.log('[Analytics] All data cleared');
}

// ============================================
// Export for API (future use)
// ============================================

export function exportAnalyticsForAPI(): {
  events: TrackedEvent[];
  session: AnalyticsSession | null;
  exportedAt: number;
} {
  return {
    events: getStoredEvents(),
    session: typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
      : null,
    exportedAt: Date.now(),
  };
}
