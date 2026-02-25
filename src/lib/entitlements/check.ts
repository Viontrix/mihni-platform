/**
 * Entitlement Check Functions
 * دوال التحقق من الصلاحيات
 */

import type { ToolDefinition, UserPlan, ToolAccessLevel } from '../tools/types';
import { getPlanById, getUpgradeTarget } from './plans';

// ============================================
// Can Use Tool Check
// ============================================

export interface CanUseToolResult {
  allowed: boolean;
  reason?: string;
  upgradeTarget?: UserPlan;
  currentPlan?: UserPlan;
}

export function canUseTool(
  userPlan: UserPlan,
  tool: ToolDefinition
): CanUseToolResult {
  const plan = getPlanById(userPlan);
  
  if (!plan) {
    return {
      allowed: false,
      reason: 'الخطة غير معروفة',
      currentPlan: userPlan,
    };
  }

  // Check if user's plan has access to this tool level
  const hasAccess = plan.enabledAccessLevels.includes(tool.access);
  
  if (!hasAccess) {
    const upgradeTo = getUpgradeTarget(userPlan);
    return {
      allowed: false,
      reason: `هذه الأداة تتطلب خطة ${getPlanDisplayName(tool.access)} أو أعلى`,
      upgradeTarget: upgradeTo || undefined,
      currentPlan: userPlan,
    };
  }

  return {
    allowed: true,
    currentPlan: userPlan,
  };
}

// ============================================
// Helper Functions
// ============================================

function getPlanDisplayName(access: ToolAccessLevel): string {
  const names: Record<ToolAccessLevel, string> = {
    free: 'المجانية',
    pro: 'الاحترافية',
    business: 'الأعمال',
    enterprise: 'المؤسسات',
  };
  return names[access] || access;
}

// ============================================
// Get Tool Lock Reason
// ============================================

export interface ToolLockInfo {
  isLocked: boolean;
  title: string;
  message: string;
  requiredPlan: string;
  upgradeButtonText: string;
  features: string[];
}

export function getToolLockInfo(
  tool: ToolDefinition,
  userPlan: UserPlan
): ToolLockInfo {
  const result = canUseTool(userPlan, tool);
  
  if (result.allowed) {
    return {
      isLocked: false,
      title: '',
      message: '',
      requiredPlan: '',
      upgradeButtonText: '',
      features: [],
    };
  }

  const planNames: Record<ToolAccessLevel, string> = {
    free: 'المجانية',
    pro: 'الاحترافية',
    business: 'الأعمال',
    enterprise: 'المؤسسات',
  };

  const planFeatures: Record<ToolAccessLevel, string[]> = {
    free: ['3 أدوات مجانية', '10 تشغيل/يوم'],
    pro: ['5 أدوات متقدمة', '100 تشغيل/يوم', '20 مشروع'],
    business: ['7 أدوات احترافية', '500 تشغيل/يوم', '100 مشروع'],
    enterprise: ['جميع الأدوات', 'تشغيل غير محدود', 'مشاريع غير محدودة'],
  };

  return {
    isLocked: true,
    title: 'أداة مدفوعة',
    message: result.reason || 'هذه الأداة غير متوفرة في خطتك الحالية',
    requiredPlan: planNames[tool.access],
    upgradeButtonText: result.upgradeTarget 
      ? `الترقية إلى ${planNames[result.upgradeTarget]}` 
      : 'تواصل مع المبيعات',
    features: planFeatures[tool.access],
  };
}

// ============================================
// Check Plan Limits
// ============================================

export interface PlanLimitCheck {
  withinLimit: boolean;
  current: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export function checkPlanLimit(
  userPlan: UserPlan,
  currentUsage: number
): PlanLimitCheck {
  const plan = getPlanById(userPlan);
  
  if (!plan) {
    return {
      withinLimit: false,
      current: currentUsage,
      limit: 0,
      remaining: 0,
      percentage: 100,
    };
  }

  // Unlimited plans
  if (plan.maxRunsPerDay === -1) {
    return {
      withinLimit: true,
      current: currentUsage,
      limit: -1,
      remaining: -1,
      percentage: 0,
    };
  }

  const remaining = Math.max(0, plan.maxRunsPerDay - currentUsage);
  const percentage = Math.min(100, (currentUsage / plan.maxRunsPerDay) * 100);

  return {
    withinLimit: currentUsage < plan.maxRunsPerDay,
    current: currentUsage,
    limit: plan.maxRunsPerDay,
    remaining,
    percentage,
  };
}

// ============================================
// Check Projects Limit
// ============================================

export function checkProjectsLimit(
  userPlan: UserPlan,
  currentProjects: number
): PlanLimitCheck {
  const plan = getPlanById(userPlan);
  
  if (!plan) {
    return {
      withinLimit: false,
      current: currentProjects,
      limit: 0,
      remaining: 0,
      percentage: 100,
    };
  }

  // Unlimited plans
  if (plan.maxSavedProjects === -1) {
    return {
      withinLimit: true,
      current: currentProjects,
      limit: -1,
      remaining: -1,
      percentage: 0,
    };
  }

  const remaining = Math.max(0, plan.maxSavedProjects - currentProjects);
  const percentage = Math.min(100, (currentProjects / plan.maxSavedProjects) * 100);

  return {
    withinLimit: currentProjects < plan.maxSavedProjects,
    current: currentProjects,
    limit: plan.maxSavedProjects,
    remaining,
    percentage,
  };
}
