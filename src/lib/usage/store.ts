/**
 * Usage Store - Local Storage Based
 * تخزين الاستخدام - محلي (جاهز للتحويل لقاعدة بيانات)
 * 
 * لاحقاً: استبدل localStorage بـ API calls
 */

import type { DailyUsage, UsageStats } from '../tools/types';

const STORAGE_KEY = 'mahni_usage_stats';
const DAILY_KEY = 'mahni_daily_usage';

// ============================================
// Get Today's Date String
// ============================================

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// ============================================
// Get/Set Usage Stats
// ============================================

export function getUsageStats(): UsageStats {
  if (typeof window === 'undefined') {
    return {
      totalRuns: 0,
      dailyRuns: [],
      lastResetDate: getTodayString(),
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading usage stats:', error);
  }

  return {
    totalRuns: 0,
    dailyRuns: [],
    lastResetDate: getTodayString(),
  };
}

export function saveUsageStats(stats: UsageStats): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving usage stats:', error);
  }
}

// ============================================
// Get/Set Daily Usage
// ============================================

export function getDailyUsage(): DailyUsage {
  if (typeof window === 'undefined') {
    return {
      date: getTodayString(),
      runs: 0,
      toolsUsed: [],
    };
  }

  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const data: DailyUsage = JSON.parse(stored);
      // Reset if it's a new day
      if (data.date !== getTodayString()) {
        return {
          date: getTodayString(),
          runs: 0,
          toolsUsed: [],
        };
      }
      return data;
    }
  } catch (error) {
    console.error('Error reading daily usage:', error);
  }

  return {
    date: getTodayString(),
    runs: 0,
    toolsUsed: [],
  };
}

export function saveDailyUsage(usage: DailyUsage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error('Error saving daily usage:', error);
  }
}

// ============================================
// Record Tool Run
// ============================================

export function recordToolRun(toolId: string, _toolName: string): void {
  if (typeof window === 'undefined') return;

  // Update daily usage
  const daily = getDailyUsage();
  daily.runs += 1;
  if (!daily.toolsUsed.includes(toolId)) {
    daily.toolsUsed.push(toolId);
  }
  saveDailyUsage(daily);

  // Update total stats
  const stats = getUsageStats();
  stats.totalRuns += 1;
  
  // Update or add today's entry
  const todayEntry = stats.dailyRuns.find(d => d.date === daily.date);
  if (todayEntry) {
    todayEntry.runs = daily.runs;
    todayEntry.toolsUsed = daily.toolsUsed;
  } else {
    stats.dailyRuns.push({ ...daily });
  }
  
  // Keep only last 30 days
  if (stats.dailyRuns.length > 30) {
    stats.dailyRuns = stats.dailyRuns.slice(-30);
  }
  
  saveUsageStats(stats);
}

// ============================================
// Get Today's Run Count
// ============================================

export function getTodayRunCount(): number {
  return getDailyUsage().runs;
}

// ============================================
// Get Tools Used Today
// ============================================

export function getToolsUsedToday(): string[] {
  return getDailyUsage().toolsUsed;
}

// ============================================
// Reset Usage (for testing)
// ============================================

export function resetUsage(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DAILY_KEY);
}

// ============================================
// Get Usage History
// ============================================

export function getUsageHistory(days: number = 7): DailyUsage[] {
  const stats = getUsageStats();
  return stats.dailyRuns.slice(-days);
}

// ============================================
// Check if New Day (for auto-reset)
// ============================================

export function checkAndResetIfNewDay(): void {
  const daily = getDailyUsage();
  const today = getTodayString();
  
  if (daily.date !== today) {
    // It's a new day, reset daily usage
    saveDailyUsage({
      date: today,
      runs: 0,
      toolsUsed: [],
    });
  }
}
