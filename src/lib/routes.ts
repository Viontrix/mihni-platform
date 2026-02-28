/**
 * Routes Configuration - Single Source of Truth
 * تهيئة المسارات - مصدر الحقيقة الوحيد
 */

export const ROUTES = {
  // Landing
  HOME: '/',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Libraries
  TOOLS: '/tools',
  TOOL_DETAIL: '/tools', // + /:slug
  TEMPLATES: '/templates',
  TEMPLATE_DETAIL: '/templates', // + /:slug

  // Editor
  EDITOR: '/editor', // + /:toolId

  // System
  COMING_SOON: '/coming-soon',
  NOT_FOUND: '/*',
} as const

// Helpers
export function getToolUrl(slug: string) {
  return `${ROUTES.TOOL_DETAIL}/${slug}`
}

export function getToolsUrl() {
  return ROUTES.TOOLS
}

export function getTemplateUrl(slug: string) {
  return `${ROUTES.TEMPLATE_DETAIL}/${slug}`
}

export function getTemplatesUrl() {
  return ROUTES.TEMPLATES
}

export function getEditorUrl(toolId: string) {
  return `${ROUTES.EDITOR}/${toolId}`
}


export function getHomeSectionUrl(sectionId: string) {
  return `/?section=${encodeURIComponent(sectionId)}`
}


export function getComingSoonUrl(kind: 'tool' | 'template', slug?: string) {
  const s = slug ? `/${encodeURIComponent(slug)}` : '';
  return `/coming-soon/${kind}${s}`;
}
<<<<<<< Updated upstream
=======

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
  // Legacy tool routes - redirect broken slugs to start page
  '/tools/certificate-maker': ROUTES.START,
  '/tools/schedule-builder': ROUTES.START,
  '/tools/report-generator': ROUTES.START,
  '/tools/performance-analyzer': ROUTES.START,
  '/tools/survey-builder': ROUTES.START,
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
>>>>>>> Stashed changes
