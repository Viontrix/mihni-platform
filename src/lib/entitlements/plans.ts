/**
 * Plans & Entitlements System - Single Source of Truth
 * نظام الخطط والصلاحيات - مصدر الحقيقة الوحيد
 * 
 * هذا الملف هو المصدر الوحيد للباقات والأسعار والمميزات
 * جميع الصفحات تقرأ من هذا الملف مباشرة
 */

import type { UserPlan, ToolAccessLevel } from '../tools/types';

// ============================================
// Unified Plan Definitions - Single Source of Truth
// ============================================

export interface UnifiedPlan {
  id: UserPlan;
  name: string; // English name
  nameAr: string; // Arabic name
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscountPercent: number;
  popular: boolean;
  color: string;
  icon: string; // Icon name reference
  maxRunsPerDay: number;
  maxSavedProjects: number;
  storageGB: number; // -1 for unlimited
  enabledAccessLevels: ToolAccessLevel[];
  features: {
    included: string[];
    notIncluded: string[];
  };
}

export const unifiedPlans: UnifiedPlan[] = [
  {
    id: 'free',
    name: 'Free',
    nameAr: 'المجانية',
    description: 'للتجربة والاستخدام الشخصي المحدود',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscountPercent: 0,
    popular: false,
    color: 'from-gray-400 to-gray-500',
    icon: 'User',
    maxRunsPerDay: 10,
    maxSavedProjects: 3,
    storageGB: 0.05, // 50 MB
    enabledAccessLevels: ['free'],
    features: {
      included: [
        'استخدام القوالب فقط',
        '3 مشاريع محفوظة',
        '10 تشغيل/يوم',
        'تصدير PNG',
      ],
      notIncluded: [
        'الأدوات الذكية',
        'تخصيص الألوان',
        'رفع الشعار',
        'تصدير PDF',
        'التخزين السحابي',
      ],
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    nameAr: 'المحترف',
    description: 'للأفراد والمحترفين',
    monthlyPrice: 99,
    yearlyPrice: 69,
    yearlyDiscountPercent: 30,
    popular: true,
    color: 'from-green-primary to-green-teal',
    icon: 'Crown',
    maxRunsPerDay: 100,
    maxSavedProjects: 20,
    storageGB: 5,
    enabledAccessLevels: ['free', 'pro'],
    features: {
      included: [
        'جميع الأدوات الذكية',
        '20 مشروع محفوظ',
        '100 تشغيل/يوم',
        'تخصيص كامل للألوان',
        'رفع الشعار الخاص',
        'تصدير PDF عالي الجودة',
        'تخزين 5 جيجابايت',
      ],
      notIncluded: [
        'التقارير المتقدمة',
        'إزالة العلامة المائية',
        'مستخدمين متزامنين',
      ],
    },
  },
  {
    id: 'business',
    name: 'Business',
    nameAr: 'الأعمال',
    description: 'للمدارس والمؤسسات الصغيرة',
    monthlyPrice: 199,
    yearlyPrice: 169,
    yearlyDiscountPercent: 15,
    popular: false,
    color: 'from-blue-500 to-cyan-500',
    icon: 'School',
    maxRunsPerDay: 500,
    maxSavedProjects: 100,
    storageGB: 20,
    enabledAccessLevels: ['free', 'pro', 'business'],
    features: {
      included: [
        'كل مميزات المحترف',
        '100 مشروع محفوظ',
        '500 تشغيل/يوم',
        'تخزين سحابي 20 جيجا',
        'تقارير متقدمة',
        'إزالة العلامة المائية',
        '5 مستخدمين متزامنين',
        'دعم فني أولوية',
      ],
      notIncluded: [
        'إدارة الفريق',
        'لوحة تحكم إدارية',
      ],
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    description: 'للشركات الكبرى والجهات الحكومية',
    monthlyPrice: 499,
    yearlyPrice: 399,
    yearlyDiscountPercent: 20,
    popular: false,
    color: 'from-amber-500 to-orange-500',
    icon: 'Building2',
    maxRunsPerDay: -1, // Unlimited
    maxSavedProjects: -1, // Unlimited
    storageGB: -1, // Unlimited
    enabledAccessLevels: ['free', 'pro', 'business', 'enterprise'],
    features: {
      included: [
        'جميع المميزات السابقة',
        'مشاريع غير محدودة',
        'تشغيل غير محدود',
        'تخزين غير محدود',
        'إدارة فريق متكاملة',
        'حسابات متعددة غير محدودة',
        'لوحة تحكم إدارية',
        'تكامل API كامل',
        'دعم فني 24/7',
      ],
      notIncluded: [],
    },
  },
];

// ============================================
// Storage Add-ons
// ============================================

export interface StorageAddon {
  id: string;
  sizeGB: number;
  monthlyPrice: number;
  yearlyPrice: number;
  label: string;
}

export const storageAddons: StorageAddon[] = [
  { id: 'storage-1gb', sizeGB: 1, monthlyPrice: 9, yearlyPrice: 90, label: '+1 جيجابايت' },
  { id: 'storage-5gb', sizeGB: 5, monthlyPrice: 29, yearlyPrice: 290, label: '+5 جيجابايت' },
  { id: 'storage-20gb', sizeGB: 20, monthlyPrice: 79, yearlyPrice: 790, label: '+20 جيجابايت' },
];

// ============================================
// Feature Comparison Table
// ============================================

export const featureComparison = [
  { feature: 'استخدام القوالب', free: true, pro: true, business: true, enterprise: true },
  { feature: 'الأدوات الذكية', free: false, pro: true, business: true, enterprise: true },
  { feature: 'عدد المشاريع', free: '3', pro: '20', business: '100', enterprise: 'غير محدود' },
  { feature: 'التشغيل اليومي', free: '10', pro: '100', business: '500', enterprise: 'غير محدود' },
  { feature: 'سعة التخزين', free: '50 ميجا', pro: '5 جيجا', business: '20 جيجا', enterprise: 'غير محدود' },
  { feature: 'تخصيص الألوان', free: false, pro: true, business: true, enterprise: true },
  { feature: 'رفع الشعار', free: false, pro: true, business: true, enterprise: true },
  { feature: 'تصدير PDF', free: false, pro: true, business: true, enterprise: true },
  { feature: 'تصدير Word/Excel', free: false, pro: true, business: true, enterprise: true },
  { feature: 'إزالة العلامة المائية', free: false, pro: false, business: true, enterprise: true },
  { feature: 'التقارير المتقدمة', free: false, pro: false, business: true, enterprise: true },
  { feature: 'المستخدمين المتزامنين', free: '1', pro: '1', business: '5', enterprise: 'غير محدود' },
  { feature: 'إدارة الفريق', free: false, pro: false, business: false, enterprise: true },
  { feature: 'لوحة تحكم إدارية', free: false, pro: false, business: false, enterprise: true },
  { feature: 'تكامل API', free: false, pro: false, business: 'محدود', enterprise: true },
  { feature: 'دعم فني 24/7', free: false, pro: false, business: false, enterprise: true },
];

// ============================================
// Helper Functions
// ============================================

export function getPlanById(id: UserPlan): UnifiedPlan | undefined {
  return unifiedPlans.find(plan => plan.id === id);
}

export function getPlanDisplayName(id: UserPlan): string {
  const plan = getPlanById(id);
  return plan?.nameAr || id;
}

export function getPlanPrice(id: UserPlan, billing: 'monthly' | 'yearly' = 'monthly'): number {
  const plan = getPlanById(id);
  if (!plan) return 0;
  return billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
}

export function getYearlySavings(id: UserPlan): { amount: number; percentage: number } {
  const plan = getPlanById(id);
  if (!plan || plan.monthlyPrice === 0) return { amount: 0, percentage: 0 };
  
  const yearlyFromMonthly = plan.monthlyPrice * 12;
  const yearlyPrice = plan.yearlyPrice * 12;
  const savings = yearlyFromMonthly - yearlyPrice;
  const percentage = (savings / yearlyFromMonthly) * 100;
  
  return {
    amount: Math.round(savings),
    percentage: Math.round(percentage),
  };
}

// ============================================
// Access Level Hierarchy
// ============================================

const accessLevelHierarchy: ToolAccessLevel[] = ['free', 'pro', 'business', 'enterprise'];

export function getAccessLevelIndex(level: ToolAccessLevel): number {
  return accessLevelHierarchy.indexOf(level);
}

export function isAccessLevelHigherOrEqual(
  userLevel: ToolAccessLevel,
  requiredLevel: ToolAccessLevel
): boolean {
  return getAccessLevelIndex(userLevel) >= getAccessLevelIndex(requiredLevel);
}

// ============================================
// Upgrade Path
// ============================================

export function getUpgradeTarget(currentPlan: UserPlan): UserPlan | null {
  const upgradePath: Record<UserPlan, UserPlan | null> = {
    free: 'pro',
    pro: 'business',
    business: 'enterprise',
    enterprise: null,
  };
  return upgradePath[currentPlan];
}

export function getUpgradeButtonText(currentPlan: UserPlan): string {
  const target = getUpgradeTarget(currentPlan);
  if (!target) return 'أنت في أعلى خطة';
  const targetPlan = getPlanById(target);
  return `الترقية إلى ${targetPlan?.nameAr}`;
}

// ============================================
// Storage Helpers
// ============================================

export function formatStorage(sizeGB: number): string {
  if (sizeGB === -1) return 'غير محدود';
  if (sizeGB < 1) return `${Math.round(sizeGB * 1024)} ميجابايت`;
  return `${sizeGB} جيجابايت`;
}

export function getStorageWarningLevel(percentage: number): 'normal' | 'warning' | 'critical' {
  if (percentage >= 95) return 'critical';
  if (percentage >= 80) return 'warning';
  return 'normal';
}

// ============================================
// Legacy exports for backward compatibility
// ============================================

export const plans = unifiedPlans;

export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): {
  amount: number;
  percentage: number;
} {
  const yearlyFromMonthly = monthlyPrice * 12;
  const savings = yearlyFromMonthly - (yearlyPrice * 12);
  const percentage = yearlyFromMonthly > 0 ? (savings / yearlyFromMonthly) * 100 : 0;

  return {
    amount: Math.round(savings),
    percentage: Math.round(percentage),
  };
}
