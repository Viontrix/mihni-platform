/**
 * Templates Registry
 * سجل القوالب
 * 
 * Single source of truth for all templates.
 * Add new templates here to make them available throughout the app.
 */

import { z } from 'zod';
import type { TemplateDefinition, TemplatePreviewData } from './types';

// ============================================
// Input Schemas
// ============================================

const certificateSchema = z.object({
  recipientName: z.string().min(1, 'اسم المستلم مطلوب'),
  achievement: z.string().min(1, 'الإنجاز مطلوب'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  issuer: z.string().min(1, 'الجهة المصدرة مطلوبة'),
  signature: z.string().optional(),
});

const invitationSchema = z.object({
  eventName: z.string().min(1, 'اسم المناسبة مطلوب'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  time: z.string().min(1, 'الوقت مطلوب'),
  location: z.string().min(1, 'المكان مطلوب'),
  host: z.string().min(1, 'المضيف مطلوب'),
  rsvpContact: z.string().optional(),
});

const reportSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  department: z.string().min(1, 'القسم مطلوب'),
  period: z.string().min(1, 'الفترة مطلوبة'),
  summary: z.string().min(10, 'الملخص مطلوب'),
  achievements: z.string().min(10, 'الإنجازات مطلوبة'),
  challenges: z.string().optional(),
  recommendations: z.string().optional(),
});

// ============================================
// Template Definitions
// ============================================

const templates: TemplateDefinition[] = [
  // Certificate Template
  {
    slug: 'appreciation-certificate',
    name: 'شهادة تقدير',
    description: 'شهادة تقدير احترافية قابلة للتخصيص',
    category: 'certificates',
    access: { tier: 'free' },
    ui: {
      icon: 'Award',
      gradient: 'from-amber-100 via-amber-50 to-yellow-100',
      badge: 'شائع',
    },
    inputSchema: certificateSchema,
    defaultValues: {
      recipientName: '',
      achievement: '',
      date: new Date().toISOString().split('T')[0],
      issuer: '',
      signature: '',
    },
    renderPreview: (input): TemplatePreviewData => ({
      title: `شهادة تقدير - ${input.recipientName || '...'}`,
      content: `
        تُمنح هذه الشهادة إلى
        ${input.recipientName || '_______________'}
        
        تقديراً لـ
        ${input.achievement || '_______________'}
        
        التاريخ: ${input.date || '_______________'}
        الجهة المصدرة: ${input.issuer || '_______________'}
      `.trim(),
      fields: {
        'اسم المستلم': input.recipientName as string || '...',
        'الإنجاز': input.achievement as string || '...',
        'التاريخ': input.date as string || '...',
        'الجهة المصدرة': input.issuer as string || '...',
      },
    }),
    exportOptions: ['pdf', 'png'],
  },
  
  // Invitation Template
  {
    slug: 'event-invitation',
    name: 'دعوة مناسبة',
    description: 'دعوة احترافية للمناسبات والفعاليات',
    category: 'invitations',
    access: { tier: 'free' },
    ui: {
      icon: 'Calendar',
      gradient: 'from-pink-100 via-pink-50 to-rose-100',
    },
    inputSchema: invitationSchema,
    defaultValues: {
      eventName: '',
      date: '',
      time: '',
      location: '',
      host: '',
      rsvpContact: '',
    },
    renderPreview: (input): TemplatePreviewData => ({
      title: `دعوة: ${input.eventName || '...'}`,
      content: `
        ندعوكم لحضور
        ${input.eventName || '_______________'}
        
        📅 التاريخ: ${input.date || '_______________'}
        🕐 الوقت: ${input.time || '_______________'}
        📍 المكان: ${input.location || '_______________'}
        
        بتنظيم: ${input.host || '_______________'}
        ${input.rsvpContact ? `للتواصل: ${input.rsvpContact}` : ''}
      `.trim(),
      fields: {
        'المناسبة': input.eventName as string || '...',
        'التاريخ': input.date as string || '...',
        'الوقت': input.time as string || '...',
        'المكان': input.location as string || '...',
      },
    }),
    exportOptions: ['pdf', 'png'],
  },
  
  // Report Template
  {
    slug: 'monthly-report',
    name: 'تقرير شهري',
    description: 'تقرير إنجازات شهري احترافي',
    category: 'reports',
    access: { tier: 'pro' },
    ui: {
      icon: 'FileText',
      gradient: 'from-teal-100 via-teal-50 to-cyan-100',
      badge: 'محترف',
    },
    inputSchema: reportSchema,
    defaultValues: {
      title: '',
      department: '',
      period: '',
      summary: '',
      achievements: '',
      challenges: '',
      recommendations: '',
    },
    renderPreview: (input: Record<string, unknown>): TemplatePreviewData => ({
      title: (input.title as string) || 'تقرير شهري',
      content: `
        ${(input.title as string) || '_______________'}
        القسم: ${(input.department as string) || '_______________'}
        الفترة: ${(input.period as string) || '_______________'}
        
        الملخص:
        ${(input.summary as string) || '_______________'}
        
        الإنجازات:
        ${(input.achievements as string) || '_______________'}
        
        ${input.challenges ? `التحديات:\n${input.challenges}` : ''}
        ${input.recommendations ? `التوصيات:\n${input.recommendations}` : ''}
      `.trim(),
      fields: {
        'العنوان': (input.title as string) || '...',
        'القسم': (input.department as string) || '...',
        'الفترة': (input.period as string) || '...',
        'الملخص': ((input.summary as string) || '').substring(0, 50) + '...',
      },
    }),
    exportOptions: ['pdf', 'docx'],
  },
  
  // Completion Certificate
  {
    slug: 'completion-certificate',
    name: 'شهادة إتمام',
    description: 'شهادة إتمام دورة أو برنامج تدريبي',
    category: 'certificates',
    access: { tier: 'pro' },
    ui: {
      icon: 'GraduationCap',
      gradient: 'from-indigo-100 via-indigo-50 to-purple-100',
    },
    inputSchema: z.object({
      recipientName: z.string().min(1, 'اسم المستلم مطلوب'),
      courseName: z.string().min(1, 'اسم الدورة مطلوب'),
      completionDate: z.string().min(1, 'تاريخ الإتمام مطلوب'),
      institution: z.string().min(1, 'المؤسسة مطلوبة'),
      grade: z.string().optional(),
    }),
    defaultValues: {
      recipientName: '',
      courseName: '',
      completionDate: new Date().toISOString().split('T')[0],
      institution: '',
      grade: '',
    },
    renderPreview: (input): TemplatePreviewData => ({
      title: `شهادة إتمام - ${input.recipientName || '...'}`,
      content: `
        شهادة إتمام
        
        يُشهد بأن
        ${input.recipientName || '_______________'}
        
        قد أكمل بنجاح دورة:
        ${input.courseName || '_______________'}
        
        بتاريخ: ${input.completionDate || '_______________'}
        من: ${input.institution || '_______________'}
        ${input.grade ? `بتقدير: ${input.grade}` : ''}
      `.trim(),
      fields: {
        'المتدرب': input.recipientName as string || '...',
        'الدورة': input.courseName as string || '...',
        'التاريخ': input.completionDate as string || '...',
        'المؤسسة': input.institution as string || '...',
      },
    }),
    exportOptions: ['pdf', 'png'],
  },
  
  // Thank You Certificate
  {
    slug: 'thank-you-certificate',
    name: 'شهادة شكر',
    description: 'شهادة شكر وتقدير للمتطوعين أو المشاركين',
    category: 'certificates',
    access: { tier: 'free' },
    ui: {
      icon: 'Heart',
      gradient: 'from-rose-100 via-rose-50 to-pink-100',
      badge: 'جديد',
    },
    inputSchema: z.object({
      recipientName: z.string().min(1, 'اسم المستلم مطلوب'),
      contribution: z.string().min(1, 'المساهمة مطلوبة'),
      date: z.string().min(1, 'التاريخ مطلوب'),
      organization: z.string().min(1, 'المنظمة مطلوبة'),
    }),
    defaultValues: {
      recipientName: '',
      contribution: '',
      date: new Date().toISOString().split('T')[0],
      organization: '',
    },
    renderPreview: (input): TemplatePreviewData => ({
      title: `شهادة شكر - ${input.recipientName || '...'}`,
      content: `
        شهادة شكر وتقدير
        
        تُقدم إلى
        ${input.recipientName || '_______________'}
        
        تقديراً لمشاركته في:
        ${input.contribution || '_______________'}
        
        التاريخ: ${input.date || '_______________'}
        المنظمة: ${input.organization || '_______________'}
      `.trim(),
      fields: {
        'المتقدر': input.recipientName as string || '...',
        'المساهمة': input.contribution as string || '...',
        'التاريخ': input.date as string || '...',
        'المنظمة': input.organization as string || '...',
      },
    }),
    exportOptions: ['pdf', 'png'],
  },
];

// ============================================
// Registry Functions
// ============================================

class TemplateRegistry {
  private templates: Map<string, TemplateDefinition> = new Map();
  
  constructor() {
    templates.forEach(template => {
      this.templates.set(template.slug, template);
    });
  }
  
  /**
   * Get all templates
   */
  getAllTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }
  
  /**
   * Get template by slug
   */
  getTemplate(slug: string): TemplateDefinition | undefined {
    return this.templates.get(slug);
  }
  
  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }
  
  /**
   * Get templates by access tier
   */
  getTemplatesByTier(tier: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.access.tier === tier);
  }
  
  /**
   * Check if template exists
   */
  hasTemplate(slug: string): boolean {
    return this.templates.has(slug);
  }
  
  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAllTemplates().forEach(t => categories.add(t.category));
    return Array.from(categories);
  }
}

// ============================================
// Export Singleton
// ============================================

export const templateRegistry = new TemplateRegistry();
