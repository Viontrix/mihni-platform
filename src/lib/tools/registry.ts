/**
 * Smart Tools Registry
 * سجل الأدوات الذكية - المصدر الوحيد للحقيقة
 * 
 * لإضافة أداة جديدة:
 * 1. أضف تعريف الأداة هنا
 * 2. أنشئ صفحة الأداة في app/tools/[slug]/page.tsx
 * 3. اربطها في main.tsx
 */

import { z } from 'zod';
import type { ToolDefinition, ToolResult } from './types';

// ============================================
// Input Schemas for each tool
// ============================================

// 1. Lesson Plan Generator
const lessonPlanSchema = z.object({
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade: z.string().min(1, 'الصف مطلوب'),
  topic: z.string().min(1, 'الموضوع مطلوب'),
  duration: z.number().min(1).max(180).default(45),
  objectives: z.string().optional(),
});
type LessonPlanInput = z.infer<typeof lessonPlanSchema>;

// 2. Quiz Generator
const quizGeneratorSchema = z.object({
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade: z.string().min(1, 'الصف مطلوب'),
  topic: z.string().min(1, 'الموضوع مطلوب'),
  questionCount: z.number().min(1).max(20).default(5),
  questionTypes: z.array(z.enum(['mcq', 'truefalse', 'essay'])).default(['mcq']),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
});
type QuizGeneratorInput = z.infer<typeof quizGeneratorSchema>;

// 3. Official Email Formatter
const emailFormatterSchema = z.object({
  recipient: z.string().min(1, 'المستلم مطلوب'),
  subject: z.string().min(1, 'الموضوع مطلوب'),
  purpose: z.enum(['request', 'announcement', 'invitation', 'complaint', 'thanks']).default('request'),
  details: z.string().min(10, 'التفاصيل مطلوبة'),
  urgency: z.enum(['normal', 'urgent']).default('normal'),
});
type EmailFormatterInput = z.infer<typeof emailFormatterSchema>;

// 4. KPI Converter
const kpiConverterSchema = z.object({
  goal: z.string().min(1, 'الهدف مطلوب'),
  timeframe: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).default('monthly'),
  department: z.string().optional(),
  measurable: z.boolean().default(true),
});
type KpiConverterInput = z.infer<typeof kpiConverterSchema>;

// 5. Text Summarizer
const textSummarizerSchema = z.object({
  text: z.string().min(50, 'النص يجب أن يكون 50 حرفاً على الأقل'),
  summaryLength: z.enum(['short', 'medium', 'long']).default('medium'),
  language: z.enum(['ar', 'en']).default('ar'),
});
type TextSummarizerInput = z.infer<typeof textSummarizerSchema>;

// 6. Rubric Generator
const rubricGeneratorSchema = z.object({
  taskName: z.string().min(1, 'اسم المهمة مطلوب'),
  taskType: z.enum(['presentation', 'essay', 'project', 'participation', 'homework']).default('project'),
  criteria: z.array(z.string()).min(1, 'معيار واحد على الأقل'),
  levels: z.number().min(3).max(5).default(4),
});
type RubricGeneratorInput = z.infer<typeof rubricGeneratorSchema>;

// 7. Weekly Teacher Plan
const weeklyPlanSchema = z.object({
  teacherName: z.string().min(1, 'اسم المعلم مطلوب'),
  subjects: z.array(z.string()).min(1, 'مادة واحدة على الأقل'),
  grade: z.string().min(1, 'الصف مطلوب'),
  weekStart: z.string().min(1, 'تاريخ بداية الأسبوع مطلوب'),
  focusAreas: z.string().optional(),
});
type WeeklyPlanInput = z.infer<typeof weeklyPlanSchema>;

// 8. Monthly Achievement Report
const monthlyReportSchema = z.object({
  teacherName: z.string().min(1, 'اسم المعلم مطلوب'),
  month: z.string().min(1, 'الشهر مطلوب'),
  subject: z.string().min(1, 'المادة مطلوبة'),
  grade: z.string().min(1, 'الصف مطلوب'),
  achievements: z.string().min(10, 'الإنجازات مطلوبة'),
  challenges: z.string().optional(),
  nextMonthGoals: z.string().optional(),
});
type MonthlyReportInput = z.infer<typeof monthlyReportSchema>;

// ============================================
// Tool Run Functions
// ============================================

function runLessonPlan(input: Record<string, unknown>): ToolResult {
  const data = input as LessonPlanInput;
  const objectives = data.objectives 
    ? data.objectives.split('\n').filter((o: string) => o.trim())
    : ['فهم المفاهيم الأساسية', 'تطبيق المهارات العملية', 'تحليل وحل المشكلات'];
  
  return {
    title: `خطة درس: ${data.topic}`,
    output: `
📚 خطة درس ${data.subject} - الصف ${data.grade}
📌 الموضوع: ${data.topic}
⏱️ المدة: ${data.duration} دقيقة

🎯 الأهداف:
${objectives.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}

📖 الاستراتيجيات:
• المقدمة (10 دقائق): تفعيل المعرفة السابقة
• العرض (20 دقيقة): شرح المفاهيم مع الأمثلة
• التطبيق (10 دقائق): تمارين جماعية
• التقييم (5 دقائق): أسئلة شفهية

📝 الموارد:
• الكتاب المدرسي
• السبورة الذكية
• أوراق العمل

✅ التقييم:
• المشاركة الفعالة
• حل التمارين
• الفهم العام للمفهوم
    `.trim(),
    meta: {
      subject: String(data.subject),
      grade: String(data.grade),
      duration: data.duration,
    },
  };
}

function runQuizGenerator(input: Record<string, unknown>): ToolResult {
  const data = input as QuizGeneratorInput;
  const questions = Array.from({ length: data.questionCount }, (_, i) => {
    const qNum = i + 1;
    if (data.questionTypes.includes('mcq')) {
      return `
${qNum}. سؤال اختياري في ${data.topic}:
أ) الخيار الأول
ب) الخيار الثاني ✓
ج) الخيار الثالث
د) الخيار الرابع
      `.trim();
    }
    return `${qNum}. سؤال في ${data.topic}؟`;
  });

  return {
    title: `اختبار ${data.subject} - ${data.topic}`,
    output: `
📝 اختبار ${data.subject} - الصف ${data.grade}
📌 الموضوع: ${data.topic}
⚡ المستوى: ${data.difficulty === 'easy' ? 'سهل' : data.difficulty === 'medium' ? 'متوسط' : 'صعب'}

${questions.join('\n\n')}

✅ الإجابات:
${questions.map((_, i) => `${i + 1}. ${['أ', 'ب', 'ج', 'د'][Math.floor(Math.random() * 4)]}`).join(' - ')}
    `.trim(),
    meta: {
      questionCount: data.questionCount,
      difficulty: data.difficulty,
    },
  };
}

function runEmailFormatter(input: Record<string, unknown>): ToolResult {
  const data = input as EmailFormatterInput;
  const greetings: Record<string, string> = {
    request: 'تحية طيبة وبعد،',
    announcement: 'السلام عليكم ورحمة الله وبركاته،',
    invitation: 'تحية طيبة ومباركة،',
    complaint: 'تحية طيبة،',
    thanks: 'تحية طيبة وشكر وتقدير،',
  };

  const closings: Record<string, string> = {
    request: 'وتفضلوا بقبول فائق الاحترام والتقدير',
    announcement: 'والسلام عليكم ورحمة الله وبركاته',
    invitation: 'وتفضلوا بقبول تحياتنا وشكرنا',
    complaint: 'وتفضلوا بقبول فائق الاحترام',
    thanks: 'وتفضلوا بقبول خالص الشكر والتقدير',
  };

  return {
    title: `تعميم: ${data.subject}`,
    output: `
الموضوع: ${data.subject}
${data.urgency === 'urgent' ? '⚠️ عاجل' : ''}

إلى: ${data.recipient}

${greetings[data.purpose]}

${data.details}

${closings[data.purpose]}

مع خالص التحية،
    `.trim(),
    meta: {
      recipient: String(data.recipient),
      urgency: data.urgency,
    },
  };
}

function runKpiConverter(input: Record<string, unknown>): ToolResult {
  const data = input as KpiConverterInput;
  const kpis = [
    `📊 مؤشر 1: نسبة إنجاز ${data.goal} - الهدف: 85%`,
    `📊 مؤشر 2: عدد المبادرات المحققة - الهدف: 3 مبادرات`,
    `📊 مؤشر 3: مستوى الرضا - الهدف: 4.5/5`,
  ];

  return {
    title: `KPIs: ${data.goal}`,
    output: `
🎯 الهدف: ${data.goal}
📅 الفترة: ${data.timeframe === 'weekly' ? 'أسبوعي' : data.timeframe === 'monthly' ? 'شهري' : data.timeframe === 'quarterly' ? 'ربع سنوي' : 'سنوي'}
${data.department ? `🏢 القسم: ${data.department}` : ''}

📈 مؤشرات الأداء الرئيسية (KPIs):
${kpis.join('\n')}

📋 خطة القياس:
• جمع البيانات: أسبوعياً
• مراجعة الأداء: شهرياً
• تقرير التقدم: ربع سنوي

⚠️ ملاحظة: ${data.measurable ? 'الأهداف قابلة للقياس' : 'يجب إعادة صياغة الأهداف لتصبح قابلة للقياس'}
    `.trim(),
    meta: {
      timeframe: data.timeframe,
      kpiCount: kpis.length,
    },
  };
}

function runTextSummarizer(input: Record<string, unknown>): ToolResult {
  const data = input as TextSummarizerInput;
  const sentences = data.text.split(/[.!?]/).filter((s: string) => s.trim().length > 10);
  const summaryRatio = data.summaryLength === 'short' ? 0.2 : data.summaryLength === 'medium' ? 0.4 : 0.6;
  const summaryCount = Math.max(3, Math.floor(sentences.length * summaryRatio));
  
  const keyPoints = sentences.slice(0, summaryCount).map((s: string) => `• ${s.trim()}`);

  return {
    title: 'ملخص النص',
    output: `
📄 ملخص (${data.summaryLength === 'short' ? 'قصير' : data.summaryLength === 'medium' ? 'متوسط' : 'مفصل'})

🔑 النقاط الرئيسية:
${keyPoints.join('\n')}

📊 إحصائيات:
• عدد الكلمات الأصلي: ${data.text.split(' ').length}
• عدد الجمل الملخصة: ${keyPoints.length}
• نسبة الاختصار: ${Math.round((1 - summaryRatio) * 100)}%
    `.trim(),
    meta: {
      originalLength: data.text.length,
      summaryLength: keyPoints.length,
    },
  };
}

function runRubricGenerator(input: Record<string, unknown>): ToolResult {
  const data = input as RubricGeneratorInput;
  const levelNames = ['ممتاز', 'جيد جداً', 'جيد', 'مقبول'].slice(0, data.levels);
  
  const rubricTable = data.criteria.map((criterion: string) => {
    const descriptions = levelNames.map((level: string, i: number) => {
      const score = (data.levels - i) * (100 / data.levels);
      return `${level} (${score}%): ${criterion} بمستوى ${level}`;
    });
    return `📋 ${criterion}:\n${descriptions.join('\n')}`;
  });

  return {
    title: `معايير تقييم: ${data.taskName}`,
    output: `
📊 معايير تقييم ${data.taskType === 'presentation' ? 'العرض التقديمي' : data.taskType === 'essay' ? 'المقال' : data.taskType === 'homework' ? 'الواجب' : 'المشروع'}
📌 المهمة: ${data.taskName}

${rubricTable.join('\n\n')}

📈 نظام الدرجات:
• ${levelNames.join(' > ')}
• الدرجة الكاملة: 100%
    `.trim(),
    meta: {
      criteriaCount: data.criteria.length,
      levels: data.levels,
    },
  };
}

function runWeeklyPlan(input: Record<string, unknown>): ToolResult {
  const data = input as WeeklyPlanInput;
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const schedule = days.map((day, i) => {
    const subject = data.subjects[i % data.subjects.length];
    return `📅 ${day}: ${subject || 'مراجعة عامة'}`;
  });

  return {
    title: `خطة أسبوعية - ${data.teacherName}`,
    output: `
👨‍🏫 المعلم: ${data.teacherName}
📚 الصف: ${data.grade}
📅 أسبوع: ${data.weekStart}

📖 المواد: ${data.subjects.join(' - ')}

🗓️ الجدول الأسبوعي:
${schedule.join('\n')}

${data.focusAreas ? `🎯 مجالات التركيز:\n${data.focusAreas}` : ''}

✅ المهام الأسبوعية:
• تحضير الدروس
• تصحيح الواجبات
• متابعة الطلاب
• اجتماع الفريق
    `.trim(),
    meta: {
      subjects: data.subjects.length,
      weekStart: String(data.weekStart),
    },
  };
}

function runMonthlyReport(input: Record<string, unknown>): ToolResult {
  const data = input as MonthlyReportInput;
  return {
    title: `تقرير إنجاز ${data.month}`,
    output: `
📊 تقرير الإنجاز الشهري
👨‍🏫 المعلم: ${data.teacherName}
📚 المادة: ${data.subject} - الصف ${data.grade}
📅 الشهر: ${data.month}

✅ الإنجازات:
${data.achievements}

⚠️ التحديات:
${data.challenges || '• لا توجد تحديات كبيرة'}

🎯 أهداف الشهر القادم:
${data.nextMonthGoals || '• الاستمرار في تحسين الأداء'}

📈 التوصيات:
• الاستمرار في الأداء المتميز
• تبادل الخبرات مع الزملاء
• متابعة تطور الطلاب

✍️ توقيع المعلم: _______________
✍️ توقيع المرشد: _______________
    `.trim(),
    meta: {
      month: String(data.month),
      subject: String(data.subject),
    },
  };
}

// ============================================
// Tool Registry
// ============================================

export const toolsRegistry: ToolDefinition[] = [
  // ============================================
  // FREE TOOLS
  // ============================================
  
  {
    id: 'lesson-plan-generator',
    slug: 'lesson-plan-generator',
    name: 'مولد خطة الدرس',
    description: 'أنشئ خطط درس احترافية متكاملة مع الأهداف والاستراتيجيات والتقييم',
    category: 'planning',
    access: 'free',
    isPopular: true,
    icon: 'BookOpen',
    inputSchema: lessonPlanSchema,
    defaultValues: {
      subject: '',
      grade: '',
      topic: '',
      duration: 45,
      objectives: '',
    },
    run: runLessonPlan,
  },

  {
    id: 'quiz-generator',
    slug: 'quiz-generator',
    name: 'مولد أسئلة الاختبار',
    description: 'ولد أسئلة اختبار متنوعة (اختياري، صح/خطأ، مقالي) مع الإجابات',
    category: 'assessment',
    access: 'free',
    isPopular: true,
    icon: 'HelpCircle',
    inputSchema: quizGeneratorSchema,
    defaultValues: {
      subject: '',
      grade: '',
      topic: '',
      questionCount: 5,
      questionTypes: ['mcq'],
      difficulty: 'medium',
    },
    run: runQuizGenerator,
  },

  {
    id: 'email-formatter',
    slug: 'email-formatter',
    name: 'منسق التعاميم الرسمية',
    description: 'صيغ رسائل رسمية وتعاميم بأسلوب احترافي مناسب',
    category: 'communication',
    access: 'free',
    icon: 'Mail',
    inputSchema: emailFormatterSchema,
    defaultValues: {
      recipient: '',
      subject: '',
      purpose: 'request',
      details: '',
      urgency: 'normal',
    },
    run: runEmailFormatter,
  },

  // ============================================
  // PRO TOOLS
  // ============================================
  
  {
    id: 'kpi-converter',
    slug: 'kpi-converter',
    name: 'محول الأهداف إلى KPIs',
    description: 'حول أهدافك إلى مؤشرات أداء قابلة للقياس والتتبع',
    category: 'analysis',
    access: 'pro',
    isNew: true,
    icon: 'Target',
    inputSchema: kpiConverterSchema,
    defaultValues: {
      goal: '',
      timeframe: 'monthly',
      department: '',
      measurable: true,
    },
    run: runKpiConverter,
  },

  {
    id: 'text-summarizer',
    slug: 'text-summarizer',
    name: 'ملخص النصوص',
    description: 'لخص النصوص الطويلة إلى نقاط رئيسية واضحة ومفيدة',
    category: 'productivity',
    access: 'pro',
    icon: 'FileText',
    inputSchema: textSummarizerSchema,
    defaultValues: {
      text: '',
      summaryLength: 'medium',
      language: 'ar',
    },
    run: runTextSummarizer,
  },

  // ============================================
  // BUSINESS TOOLS
  // ============================================
  
  {
    id: 'rubric-generator',
    slug: 'rubric-generator',
    name: 'مولد معايير التقييم (Rubric)',
    description: 'أنشئ معايير تقييم احترافية لمهام الطلاب المختلفة',
    category: 'assessment',
    access: 'business',
    icon: 'ClipboardCheck',
    inputSchema: rubricGeneratorSchema,
    defaultValues: {
      taskName: '',
      taskType: 'project',
      criteria: ['المحتوى', 'التنظيم', 'العرض'],
      levels: 4,
    },
    run: runRubricGenerator,
  },

  {
    id: 'weekly-teacher-plan',
    slug: 'weekly-teacher-plan',
    name: 'خطة المعلم الأسبوعية',
    description: 'خطط أسبوعك الدراسي كاملاً مع المواد والأهداف والموارد',
    category: 'planning',
    access: 'business',
    icon: 'Calendar',
    inputSchema: weeklyPlanSchema,
    defaultValues: {
      teacherName: '',
      subjects: [],
      grade: '',
      weekStart: '',
      focusAreas: '',
    },
    run: runWeeklyPlan,
  },

  // ============================================
  // ENTERPRISE TOOLS
  // ============================================
  
  {
    id: 'monthly-achievement-report',
    slug: 'monthly-achievement-report',
    name: 'تقرير الإنجاز الشهري',
    description: 'ولد تقارير إنجاز شاملة للمعلمين والإداريين',
    category: 'analysis',
    access: 'enterprise',
    icon: 'TrendingUp',
    inputSchema: monthlyReportSchema,
    defaultValues: {
      teacherName: '',
      month: '',
      subject: '',
      grade: '',
      achievements: '',
      challenges: '',
      nextMonthGoals: '',
    },
    run: runMonthlyReport,
  },
];

// ============================================
// Helper Functions
// ============================================

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolsRegistry.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return toolsRegistry.filter(tool => tool.category === category);
}

export function getToolsByAccess(access: string): ToolDefinition[] {
  return toolsRegistry.filter(tool => tool.access === access);
}

export function getFreeTools(): ToolDefinition[] {
  return toolsRegistry.filter(tool => tool.access === 'free');
}

export function getPopularTools(): ToolDefinition[] {
  return toolsRegistry.filter(tool => tool.isPopular);
}

export function getNewTools(): ToolDefinition[] {
  return toolsRegistry.filter(tool => tool.isNew);
}

export const categories = [
  { id: 'planning', name: 'التخطيط', icon: 'Calendar' },
  { id: 'assessment', name: 'التقييم', icon: 'ClipboardCheck' },
  { id: 'communication', name: 'التواصل', icon: 'Mail' },
  { id: 'analysis', name: 'التحليل', icon: 'BarChart3' },
  { id: 'productivity', name: 'الإنتاجية', icon: 'Zap' },
] as const;
