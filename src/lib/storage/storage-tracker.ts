/**
 * Storage Tracker
 * متتبع استخدام التخزين
 */

import { getCurrentPlan } from '@/lib/billing/subscription';

export interface StorageInfo {
  used: number; // in bytes
  limit: number; // in bytes
  percentage: number;
}

// Storage limits per plan (in MB)
const STORAGE_LIMITS = {
  free: 50,
  pro: 5 * 1024, // 5 GB
  business: 20 * 1024, // 20 GB
  enterprise: -1, // Unlimited
};

/**
 * Get storage limit for current plan
 */
export function getStorageLimit(): number {
  const plan = getCurrentPlan();
  const limitMB = STORAGE_LIMITS[plan];
  
  if (limitMB === -1) return -1; // Unlimited
  return limitMB * 1024 * 1024; // Convert to bytes
}

/**
 * Calculate localStorage usage
 */
export function calculateStorageUsage(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
      }
    }
    return total;
  } catch (error) {
    console.error('Error calculating storage:', error);
    return 0;
  }
}

/**
 * Get storage info
 */
export function getStorageInfo(): StorageInfo {
  const used = calculateStorageUsage();
  const limit = getStorageLimit();
  
  if (limit === -1) {
    return { used, limit: -1, percentage: 0 };
  }
  
  return {
    used,
    limit,
    percentage: Math.min(100, Math.round((used / limit) * 100)),
  };
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if storage is full
 */
export function isStorageFull(): boolean {
  const info = getStorageInfo();
  if (info.limit === -1) return false;
  return info.used >= info.limit;
}

/**
 * Check if storage is near limit (>80%)
 */
export function isStorageNearLimit(): boolean {
  const info = getStorageInfo();
  if (info.limit === -1) return false;
  return info.percentage >= 80;
}

/**
 * Get available storage
 */
export function getAvailableStorage(): number {
  const info = getStorageInfo();
  if (info.limit === -1) return -1;
  return Math.max(0, info.limit - info.used);
}

/**
 * Estimate item size
 */
export function estimateItemSize(data: unknown): number {
  try {
    const json = JSON.stringify(data);
    return json.length * 2; // UTF-16
  } catch {
    return 0;
  }
}

/**
 * Can add item to storage
 */
export function canAddItem(data: unknown): boolean {
  const info = getStorageInfo();
  if (info.limit === -1) return true;
  
  const itemSize = estimateItemSize(data);
  return (info.used + itemSize) <= info.limit;
}

/**
 * Get storage warning level based on percentage
 */
export function getStorageWarningLevel(percentage: number): 'normal' | 'warning' | 'critical' {
  if (percentage >= 95) return 'critical';
  if (percentage >= 80) return 'warning';
  return 'normal';
}
