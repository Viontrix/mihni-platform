/**
 * Routes Configuration - Single Source of Truth
 * تهيئة المسارات - مصدر الحقيقة الوحيد
 * 
 * This file contains ALL route definitions for the application.
 * ANY hardcoded route strings elsewhere are considered legacy and should be migrated.
 */

// ============================================
// Route Constants
// ============================================

export const ROUTES = {
  // Home & Landing
  HOME: '/',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Tools
  START: '/start',                    // Tool picker page
  TOOLS: '/tools',                    // Redirects to START
  TOOL_DETAIL: '/tools/:slug',        // Individual tool page
  
  // Templates
  TEMPLATES: '/templates',
  TEMPLATE_DETAIL: '/templates/:slug',
  
  // Pricing & Payment
  PRICING: '/pricing',                // Redirects to HOME with section param
  PAYMENT: '/payment',
  
  // User Account
  ACCOUNT: '/account',
  DASHBOARD: '/dashboard',
  
  // Admin
  ADMIN: '/admin',
  
  // Support
  SUPPORT: '/support',
} as const;

// ============================================
// Home Section Query Param Helpers
// ============================================

export type HomeSection = 'hero' | 'tools' | 'templates' | 'pricing' | 'faq' | 'how-it-works';

/**
 * Generate a URL for navigating to a specific section on the homepage
 * يولد رابط للتنقل إلى قسم محدد في الصفحة الرئيسية
 */
export function getHomeSectionUrl(section: HomeSection): string {
  return `/?section=${section}`;
}

/**
 * Parse section from query params
 * يستخرج القسم من معلمات الاستعلام
 */
export function getSectionFromSearch(search: string): HomeSection | null {
  const params = new URLSearchParams(search);
  const section = params.get('section');
  if (section && ['hero', 'tools', 'templates', 'pricing', 'faq', 'how-it-works'].includes(section)) {
    return section as HomeSection;
  }
  return null;
}

// ============================================
// Payment URL Builders
// ============================================

export type PlanId = 'free' | 'pro' | 'business' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type PaymentSource = 'pricing' | 'dashboard' | 'account' | 'tools';

interface PaymentUrlParams {
  plan?: PlanId;
  billing?: BillingCycle;
  from?: PaymentSource;
  addon?: 'storage';
}

/**
 * Build payment page URL with query params
 * يبني رابط صفحة الدفع مع معلمات الاستعلام
 */
export function getPaymentUrl(params: PaymentUrlParams = {}): string {
  const searchParams = new URLSearchParams();
  
  if (params.plan) searchParams.set('plan', params.plan);
  if (params.billing) searchParams.set('billing', params.billing);
  if (params.from) searchParams.set('from', params.from);
  if (params.addon) searchParams.set('addon', params.addon);
  
  const queryString = searchParams.toString();
  return queryString ? `${ROUTES.PAYMENT}?${queryString}` : ROUTES.PAYMENT;
}

// ============================================
// Back Navigation Helpers
// ============================================

/**
 * Determine back destination based on 'from' parameter
 * يحدد وجهة الرجوع بناءً على معلمة 'from'
 */
export function getBackDestination(fromParam: string | null): { path: string; label: string } {
  switch (fromParam) {
    case 'pricing':
      return { path: getHomeSectionUrl('pricing'), label: 'رجوع' };
    case 'dashboard':
      return { path: ROUTES.DASHBOARD, label: 'العودة للوحة التحكم' };
    case 'account':
      return { path: ROUTES.ACCOUNT, label: 'العودة للحساب' };
    case 'tools':
      return { path: ROUTES.START, label: 'العودة للأدوات' };
    default:
      return { path: ROUTES.HOME, label: 'العودة للرئيسية' };
  }
}

// ============================================
// Tool URL Helpers
// ============================================

/**
 * Get tool detail page URL
 * يحصل على رابط صفحة الأداة
 */
export function getToolUrl(slug: string): string {
  return `/tools/${slug}`;
}

/**
 * Get template detail page URL
 * يحصل على رابط صفحة القالب
 */
export function getTemplateUrl(slug: string): string {
  return `/templates/${slug}`;
}

// ============================================
// Account URL Helpers
// ============================================

export type AccountTab = 'overview' | 'subscription' | 'projects' | 'history' | 'settings';

/**
 * Build account page URL with tab
 * يبني رابط صفحة الحساب مع تبويب
 */
export function getAccountUrl(tab?: AccountTab): string {
  if (tab) {
    return `${ROUTES.ACCOUNT}?tab=${tab}`;
  }
  return ROUTES.ACCOUNT;
}

// ============================================
// Legacy Route Redirects Map
// ============================================

/**
 * Map of legacy routes to their new equivalents
 * خريطة المسارات القديمة إلى نظيراتها الجديدة
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/#pricing': getHomeSectionUrl('pricing'),
  '/#tools': getHomeSectionUrl('tools'),
  '/#templates': getHomeSectionUrl('templates'),
  '/#faq': getHomeSectionUrl('faq'),
  '/#hero': getHomeSectionUrl('hero'),
  '/pricing': getHomeSectionUrl('pricing'),
  '/tools': ROUTES.START,
  '/templates': ROUTES.TEMPLATES,
  // Legacy tool routes - redirect to dynamic routes
  '/tools/certificate-maker': getToolUrl('certificate'),
  '/tools/quiz-generator': getToolUrl('quiz-generator'),
  '/tools/schedule-builder': getToolUrl('schedule-builder'),
  '/tools/report-generator': getToolUrl('report-generator'),
  '/tools/performance-analyzer': getToolUrl('performance-analyzer'),
  '/tools/survey-builder': getToolUrl('survey-builder'),
};

/**
 * Check if a path is a legacy route and get its replacement
 * يتحقق إذا كان المسار قديماً ويحصل على البديل
 */
export function getLegacyRedirect(path: string): string | null {
  return LEGACY_REDIRECTS[path] || null;
}

// ============================================
// Navigation Helper for External Usage
// ============================================

export const NAV_LINKS = {
  home: { name: 'الرئيسية', href: getHomeSectionUrl('hero'), type: 'section' as const, sectionId: 'hero' },
  tools: { name: 'أدوات ذكية', href: getHomeSectionUrl('tools'), type: 'section' as const, sectionId: 'tools' },
  templates: { name: 'القوالب', href: getHomeSectionUrl('templates'), type: 'section' as const, sectionId: 'templates' },
  pricing: { name: 'الباقات', href: getHomeSectionUrl('pricing'), type: 'section' as const, sectionId: 'pricing' },
  support: { name: 'الدعم', href: ROUTES.SUPPORT, type: 'page' as const },
  start: { name: 'ابدأ مجاناً', href: ROUTES.START, type: 'page' as const },
  login: { name: 'تسجيل الدخول', href: ROUTES.LOGIN, type: 'page' as const },
  dashboard: { name: 'لوحة التحكم', href: ROUTES.DASHBOARD, type: 'page' as const },
  account: { name: 'حسابي', href: ROUTES.ACCOUNT, type: 'page' as const },
};

// ============================================
// Footer Links
// ============================================

export const FOOTER_LINKS = {
  product: [
    { name: 'القوالب', href: getHomeSectionUrl('templates') },
    { name: 'الأدوات الذكية', href: getHomeSectionUrl('tools') },
    { name: 'الباقات', href: getHomeSectionUrl('pricing') },
  ],
  company: [
    { name: 'الدعم', href: ROUTES.SUPPORT },
  ],
  resources: [
    { name: 'مركز المساعدة', href: ROUTES.SUPPORT },
    { name: 'الأسئلة الشائعة', href: getHomeSectionUrl('faq') },
  ],
  support: [
    { name: 'الدردشة المباشرة', href: ROUTES.SUPPORT },
    { name: 'الدعم الفني', href: ROUTES.SUPPORT },
  ],
};
