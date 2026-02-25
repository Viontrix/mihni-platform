/**
 * Entitlements & Limits System
 * نظام الصلاحيات والحدود
 * 
 * Defines plan limits and checks user entitlements.
 * Used throughout the app to enforce quotas and feature access.
 */

import { getCurrentUser, getRunsToday, getTotalStorageUsed } from './api/storage';

// ============================================
// Plan Definitions
// ============================================

export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  nameAr: string;
  maxRunsPerDay: number;
  maxStorageBytes: number;
  maxProjects: number;
  enabledToolTiers: string[];
  enabledExportFormats: string[];
  features: string[];
}

export const PLAN_LIMITS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    nameAr: 'مجاني',
    maxRunsPerDay: 10,
    maxStorageBytes: 50 * 1024 * 1024, // 50 MB
    maxProjects: 5,
    enabledToolTiers: ['free'],
    enabledExportFormats: ['txt', 'json'],
    features: [
      'أدوات أساسية',
      'تصدير نصي',
      '5 مشاريع',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    nameAr: 'محترف',
    maxRunsPerDay: 50,
    maxStorageBytes: 500 * 1024 * 1024, // 500 MB
    maxProjects: 50,
    enabledToolTiers: ['free', 'pro'],
    enabledExportFormats: ['txt', 'json', 'pdf'],
    features: [
      'جميع الأدوات الأساسية',
      'تصدير PDF',
      '50 مشروع',
      'دعم فني',
    ],
  },
  business: {
    id: 'business',
    name: 'Business',
    nameAr: 'أعمال',
    maxRunsPerDay: 200,
    maxStorageBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    maxProjects: 200,
    enabledToolTiers: ['free', 'pro', 'business'],
    enabledExportFormats: ['txt', 'json', 'pdf', 'png', 'docx'],
    features: [
      'جميع الأدوات',
      'تصدير متعدد الصيغ',
      '200 مشروع',
      'دعم فني أولوي',
      'تحليلات متقدمة',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    nameAr: 'مؤسسي',
    maxRunsPerDay: 1000,
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10 GB
    maxProjects: 1000,
    enabledToolTiers: ['free', 'pro', 'business', 'enterprise'],
    enabledExportFormats: ['txt', 'json', 'pdf', 'png', 'docx'],
    features: [
      'جميع الأدوات',
      'تصدير غير محدود',
      'مشاريع غير محدودة',
      'دعم فني مخصص',
      'API access',
      'تخصيص كامل',
    ],
  },
};

// ============================================
// Entitlement Check Results
// ============================================

export interface EntitlementCheck {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
  remaining?: number;
}

// ============================================
// Check Functions
// ============================================

/**
 * Check if user can run a tool (quota check)
 */
export function canRunTool(): EntitlementCheck {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  const runsToday = getRunsToday();
  
  if (runsToday >= plan.maxRunsPerDay) {
    return {
      allowed: false,
      reason: `لقد وصلت للحد اليومي (${plan.maxRunsPerDay} تشغيل). قم بالترقية للحصول على المزيد.`,
      currentUsage: runsToday,
      limit: plan.maxRunsPerDay,
      remaining: 0,
    };
  }
  
  return {
    allowed: true,
    currentUsage: runsToday,
    limit: plan.maxRunsPerDay,
    remaining: plan.maxRunsPerDay - runsToday,
  };
}

/**
 * Check if user can save a project (storage check)
 */
export function canSaveProject(): EntitlementCheck {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  const storageUsed = getTotalStorageUsed();
  
  if (storageUsed >= plan.maxStorageBytes) {
    return {
      allowed: false,
      reason: `مساحة التخزين ممتلئة. قم بالترقية للحصول على مساحة إضافية.`,
      currentUsage: storageUsed,
      limit: plan.maxStorageBytes,
      remaining: 0,
    };
  }
  
  return {
    allowed: true,
    currentUsage: storageUsed,
    limit: plan.maxStorageBytes,
    remaining: plan.maxStorageBytes - storageUsed,
  };
}

/**
 * Check if user can access a tool by tier
 */
export function canAccessTool(toolTier: string): EntitlementCheck {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  
  if (!plan.enabledToolTiers.includes(toolTier)) {
    const requiredPlan = Object.values(PLAN_LIMITS).find(p => 
      p.enabledToolTiers.includes(toolTier)
    );
    
    return {
      allowed: false,
      reason: `هذه الأداة متاحة في باقة ${requiredPlan?.nameAr || 'أعلى'}. قم بالترقية للوصول إليها.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Check if user can export in a specific format
 */
export function canExportFormat(format: string): EntitlementCheck {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  
  if (!plan.enabledExportFormats.includes(format)) {
    const requiredPlan = Object.values(PLAN_LIMITS).find(p => 
      p.enabledExportFormats.includes(format)
    );
    
    return {
      allowed: false,
      reason: `التصدير بصيغة ${format.toUpperCase()} متاح في باقة ${requiredPlan?.nameAr || 'أعلى'}.`,
    };
  }
  
  return { allowed: true };
}

// ============================================
// Usage Helpers
// ============================================

export function getUsagePercent(): number {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  const runsToday = getRunsToday();
  
  return Math.round((runsToday / plan.maxRunsPerDay) * 100);
}

export function getStoragePercent(): number {
  const user = getCurrentUser();
  const planId = user?.plan || 'free';
  const plan = PLAN_LIMITS[planId];
  const storageUsed = getTotalStorageUsed();
  
  return Math.round((storageUsed / plan.maxStorageBytes) * 100);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
