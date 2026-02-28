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
