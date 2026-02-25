import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Award, 
  HelpCircle, 
  Calendar, 
  BarChart3, 
  FileText,
  Sparkles,
  Zap,
  Check,
  ChevronRight,
  Lock,
  Crown,
  Star,
  TrendingUp,
  ClipboardList,
  Clock,
  Play,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHomeSectionUrl, getToolUrl } from '@/lib/routes';

// Tool Card with Internal Tabs Preview
const ToolPreview = ({ tool }: { tool: typeof tools[0] }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tool.tabs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tool.tabs.length]);

  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-white dark:from-[#152B26] dark:to-[#1B2D2B] rounded-xl overflow-hidden border border-green-primary/10 p-3">
      {/* Internal Tabs */}
      <div className="flex gap-1 mb-3">
        {tool.tabs.map((tab, i) => (
          <motion.div
            key={tab}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-medium text-center transition-all ${
              activeTab === i 
                ? 'bg-green-primary text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
            animate={{ scale: activeTab === i ? 1.02 : 1 }}
          >
            {tab}
          </motion.div>
        ))}
      </div>
      
      {/* Preview Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="h-28 flex items-center justify-center"
        >
          {tool.id === 'certificate-maker' && (
            <div className="relative w-28 h-32 bg-gradient-to-b from-amber-50 to-white rounded-lg shadow-lg border border-amber-200 flex flex-col items-center justify-center overflow-hidden">
              {/* Decorative border */}
              <div className="absolute inset-1 border-2 border-amber-300/50 rounded" />
              {/* Top ribbon */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-lg" />
              {/* Star badge */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-2 shadow-md"
              >
                <Award className="w-5 h-5 text-white" />
              </motion.div>
              {/* Certificate lines */}
              <div className="w-16 h-1.5 bg-amber-200 rounded mb-1" />
              <div className="w-12 h-1 bg-amber-100 rounded" />
              {/* Bottom seal */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-red-400 rounded-full opacity-80" />
            </div>
          )}
          {tool.id === 'quiz-generator' && (
            <div className="flex flex-col items-center gap-2">
              {/* Question number circles */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num, i) => (
                  <motion.div
                    key={num}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === activeTab % 5
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-green-100 text-green-600'
                    }`}
                    animate={{ scale: i === activeTab % 5 ? 1.15 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              {/* Question preview */}
              <div className="w-32 h-16 bg-white rounded-lg shadow-sm border border-green-100 p-2 mt-1">
                <div className="w-20 h-2 bg-gray-200 rounded mb-2" />
                <div className="flex gap-1.5">
                  <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-[10px] text-green-600">أ</div>
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">ب</div>
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">ج</div>
                </div>
              </div>
            </div>
          )}
          {tool.id === 'schedule-builder' && (
            <div className="flex flex-col items-center">
              {/* Table grid visualization */}
              <div className="grid grid-cols-4 gap-1 p-2 bg-white rounded-lg shadow-sm border border-purple-100">
                {/* Header row */}
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">اليوم</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">1</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">2</div>
                <div className="w-8 h-6 rounded bg-purple-200 flex items-center justify-center text-[8px] text-purple-700 font-bold">3</div>
                {/* Data rows with animation */}
                {['أ', 'إ', 'ث', 'أ', 'خ'].slice(0, 3).map((day, rowIdx) => (
                  <>
                    <motion.div
                      key={`day-${rowIdx}`}
                      className="w-8 h-6 rounded bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold"
                      animate={{ opacity: rowIdx === activeTab % 3 ? 1 : 0.7 }}
                    >
                      {day}
                    </motion.div>
                    {[0, 1, 2].map((colIdx) => (
                      <motion.div
                        key={`cell-${rowIdx}-${colIdx}`}
                        className={`w-8 h-6 rounded flex items-center justify-center text-[8px] ${
                          rowIdx === activeTab % 3 && colIdx === (activeTab % 3)
                            ? 'bg-purple-400 text-white'
                            : 'bg-purple-50 text-purple-400'
                        }`}
                        animate={{ 
                          scale: rowIdx === activeTab % 3 && colIdx === (activeTab % 3) ? 1.1 : 1 
                        }}
                      >
                        {['ع', 'ر', 'ح'][colIdx]}
                      </motion.div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          )}
          {tool.id === 'performance-analyzer' && (
            <div className="flex items-end gap-2 h-20">
              {[40, 65, 85, 55, 70].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-6 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
          {tool.id === 'report-builder' && (
            <div className="space-y-2 w-full px-4">
              <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-teal-500 rounded-full"
                  animate={{ width: ['0%', '70%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-teal-500" />
                </div>
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-teal-500" />
                </div>
              </div>
            </div>
          )}
          {tool.id === 'survey-builder' && (
            <div className="text-center">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <span className="text-xs text-gray-400">قريباً</span>
            </div>
          )}
          {tool.id === 'question-maker' && (
            <div className="flex flex-col items-center gap-2">
              {/* Question cards stack */}
              <div className="relative w-24 h-20">
                {[2, 1, 0].map((offset) => (
                  <motion.div
                    key={offset}
                    className="absolute w-20 h-14 bg-white rounded-lg shadow-sm border border-indigo-100 flex items-center justify-center"
                    style={{
                      top: offset * 6,
                      right: offset * 4,
                      zIndex: 3 - offset,
                    }}
                    animate={{ 
                      y: offset === 0 ? [0, -3, 0] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: offset * 0.2 }}
                  >
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-indigo-400 font-medium">بنك أسئلة</span>
            </div>
          )}
          {tool.id === 'invitation-maker' && (
            <div className="flex flex-col items-center">
              {/* Invitation card */}
              <motion.div
                className="relative w-24 h-28 bg-gradient-to-b from-pink-50 to-white rounded-lg shadow-md border border-pink-200 overflow-hidden"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Decorative top */}
                <div className="h-6 bg-gradient-to-r from-pink-400 to-rose-400" />
                {/* Content */}
                <div className="p-2 flex flex-col items-center">
                  <Calendar className="w-6 h-6 text-pink-400 mb-1" />
                  <div className="w-14 h-1.5 bg-pink-200 rounded mb-1" />
                  <div className="w-10 h-1 bg-pink-100 rounded" />
                </div>
                {/* Corner decoration */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-rose-300 rounded-full opacity-60" />
              </motion.div>
            </div>
          )}
          {tool.id === 'letter-maker' && (
            <div className="flex flex-col items-center">
              {/* Letter/document */}
              <motion.div
                className="relative w-20 h-24 bg-white rounded-lg shadow-md border border-cyan-100 p-2"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Header line */}
                <div className="w-full h-2 bg-cyan-100 rounded mb-2" />
                {/* Content lines */}
                <div className="space-y-1.5">
                  <div className="w-full h-1 bg-gray-100 rounded" />
                  <div className="w-4/5 h-1 bg-gray-100 rounded" />
                  <div className="w-full h-1 bg-gray-100 rounded" />
                  <div className="w-3/5 h-1 bg-gray-100 rounded" />
                </div>
                {/* Stamp */}
                <motion.div
                  className="absolute bottom-2 left-2 w-6 h-6 bg-cyan-400 rounded-full opacity-80"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {tool.tabs.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-all ${activeTab === i ? 'bg-green-primary w-3' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

// Tool Badge Component
const ToolBadge = ({ type }: { type: string }) => {
  const badges: Record<string, { bg: string; icon: React.ElementType; text: string }> = {
    free: { bg: 'bg-green-500', icon: Check, text: 'مجاني' },
    new: { bg: 'bg-blue-500', icon: Sparkles, text: 'جديد' },
    popular: { bg: 'bg-amber-500', icon: TrendingUp, text: 'شائع' },
    pro: { bg: 'bg-purple-500', icon: Crown, text: 'يتطلب ترقية' },
    soon: { bg: 'bg-gray-400', icon: Clock, text: 'قريباً' },
  };
  
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  
  return (
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-2.5 py-1 ${badge.bg} text-white text-[10px] font-bold rounded-full flex items-center gap-1`}
    >
      <Icon className="w-3 h-3" />
      {badge.text}
    </motion.span>
  );
};

const tools = [
  {
    id: 'certificate-maker',
    name: 'منشئ الشهادات',
    description: 'صمم شهادات شكر وتقدير احترافية بخطوات بسيطة مع إمكانية التخصيص الكامل',
    icon: Award,
    tabs: ['اختيار التصميم', 'إدخال البيانات', 'إضافة الشعار', 'التصدير'],
    features: [
      { text: '12+ تصميم فاخر', locked: false },
      { text: 'تخصيص الألوان والخطوط', locked: false },
      { text: 'إضافة الشعارات والتوقيعات', locked: true },
      { text: 'تصدير PDF عالي الجودة', locked: true },
    ],
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    badges: ['popular', 'pro'],
  },
  {
    id: 'quiz-generator',
    name: 'منشئ الاختبارات',
    description: 'أنشئ اختبارات متنوعة ذكية حسب الموضوع والمستوى بأنواع مختلفة من الأسئلة',
    icon: HelpCircle,
    tabs: ['اختياري', 'صح/خطأ', 'مقالي', 'التصدير'],
    features: [
      { text: 'أسئلة اختيار من متعدد', locked: false },
      { text: 'أسئلة صح/خطأ', locked: false },
      { text: 'أسئلة مقالية', locked: true },
      { text: 'توليد ذكي للأسئلة', locked: true },
    ],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    badges: ['new', 'pro'],
  },
  {
    id: 'schedule-builder',
    name: 'منشئ الجداول',
    description: 'أنشئ جداول أسبوعية منظمة بسهولة مع جميع المواد والأوقات',
    icon: Calendar,
    tabs: ['الأيام', 'المواد', 'الأوقات', 'التصدير'],
    features: [
      { text: 'جدول أسبوعي كامل', locked: false },
      { text: 'إضافة المواد والأوقات', locked: false },
      { text: 'تخصيص الألوان', locked: false },
      { text: 'حفظ في السحابة', locked: true },
    ],
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    badges: ['free'],
  },
  {
    id: 'performance-analyzer',
    name: 'محلل الأداء',
    description: 'حلل أداء الطلاب والمعلمين مع تقارير تفصيلية ورسوم بيانية',
    icon: BarChart3,
    tabs: ['الإحصائيات', 'الرسوم', 'المقارنة', 'التقرير'],
    features: [
      { text: 'تحليل النتائج الشامل', locked: false },
      { text: 'رسوم بيانية تفاعلية', locked: true },
      { text: 'مقارنة الفصول', locked: true },
      { text: 'تقارير دورية', locked: true },
    ],
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    badges: ['popular', 'pro'],
  },
  {
    id: 'report-builder',
    name: 'منشئ التقارير',
    description: 'أنشئ تقارير احترافية لتوثيق الفعاليات والبرامج التعليمية',
    icon: FileText,
    tabs: ['القالب', 'المحتوى', 'الصور', 'التصدير'],
    features: [
      { text: 'قوالب تقارير جاهزة', locked: false },
      { text: 'إضافة الصور والجداول', locked: true },
      { text: 'تخصيص التصميم', locked: true },
      { text: 'توقيع إلكتروني', locked: true },
    ],
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    badges: ['pro'],
  },
  {
    id: 'survey-builder',
    name: 'منشئ الاستبيانات',
    description: 'صمم استبيانات احترافية لجمع الآراء والتقييمات بسهولة',
    icon: ClipboardList,
    tabs: ['الأسئلة', 'التصميم', 'النشر', 'التحليل'],
    features: [
      { text: 'أنواع متعددة من الأسئلة', locked: false },
      { text: 'تخصيص التصميم', locked: false },
      { text: 'مشاركة سهلة', locked: false },
      { text: 'تحليل النتائج', locked: false },
    ],
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-500/10',
    badges: ['soon'],
  },
  {
    id: 'question-maker',
    name: 'منشئ الأسئلة',
    description: 'أنشئ بنك أسئلة تعليمية متنوعة مع خيارات متعددة للإجابات',
    icon: HelpCircle,
    tabs: ['الموضوع', 'النوع', 'العدد', 'التوليد'],
    features: [
      { text: 'توليد أسئلة ذكي', locked: false },
      { text: 'تخصيص مستوى الصعوبة', locked: false },
      { text: 'تصدير بنك الأسئلة', locked: true },
      { text: 'تصنيف حسب الموضوع', locked: true },
    ],
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    badges: ['soon'],
  },
  {
    id: 'invitation-maker',
    name: 'منشئ الدعوات',
    description: 'صمم دعوات احترافية للمناسبات والفعاليات بأنماط متعددة',
    icon: Calendar,
    tabs: ['القالب', 'التفاصيل', 'التصميم', 'المشاركة'],
    features: [
      { text: 'قوالب دعوات جاهزة', locked: false },
      { text: 'تخصيص الألوان والخطوط', locked: false },
      { text: 'إضافة خريطة الموقع', locked: true },
      { text: 'تأكيد الحضور', locked: true },
    ],
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    badges: ['soon'],
  },
  {
    id: 'letter-maker',
    name: 'منشئ الخطابات',
    description: 'أنشئ خطابات رسمية وإدارية بصيغ احترافية متعددة',
    icon: FileText,
    tabs: ['النوع', 'المحتوى', 'التنسيق', 'التصدير'],
    features: [
      { text: 'قوالب خطابات رسمية', locked: false },
      { text: 'تنسيق احترافي', locked: false },
      { text: 'توقيع إلكتروني', locked: true },
      { text: 'تتبع المرسلات', locked: true },
    ],
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
    badges: ['soon'],
  },
];

export default function Tools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section id="tools" className="py-24 bg-gradient-to-b from-[#F8FAF9] via-white to-[#F8FAF9] dark:from-[#0D1B1A] dark:via-[#1B2D2B] dark:to-[#0D1B1A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-teal/5 rounded-full blur-[100px]" />
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-32 right-32 w-16 h-16 bg-amber-400/10 rounded-full blur-xl"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-32 left-32 w-20 h-20 bg-blue-400/10 rounded-full blur-xl"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="w-4 h-4" />
            الأدوات الذكية
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            Smart Tools
            <span className="block text-2xl sm:text-3xl mt-2 bg-gradient-to-r from-green-primary to-green-teal bg-clip-text text-transparent">
              أدوات تنفيذ احترافية متقدمة
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            أدوات ذكية قابلة للتخصيص الكامل، مصممة لتبسيط مهامك اليومية ورفع إنتاجيتك بكفاءة واحترافية
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative p-5 bg-white dark:bg-[#1B2D2B] rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col overflow-hidden">
                  
                  {/* Badges Row */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 max-w-[calc(100%-2rem)]">
                    {tool.badges.map((badge) => (
                      <ToolBadge key={badge} type={badge} />
                    ))}
                  </div>

                  {/* Preview */}
                  <div className="mb-4 mt-8">
                    <ToolPreview tool={tool} />
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-dark dark:text-white group-hover:text-green-primary transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                    {tool.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feature.locked ? 'bg-amber-100' : 'bg-green-primary/10'
                          }`}>
                            {feature.locked ? (
                              <Lock className="w-2.5 h-2.5 text-amber-600" />
                            ) : (
                              <Check className="w-2.5 h-2.5 text-green-primary" />
                            )}
                          </div>
                          <span className={`text-xs ${feature.locked ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {feature.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link to={tool.badges.includes('soon') ? '#' : getToolUrl(tool.id)}>
                    <Button
                      variant="outline"
                      disabled={tool.badges.includes('soon')}
                      className={`w-full py-3 rounded-xl font-medium transition-all ${
                        tool.badges.includes('soon')
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-2 border-green-primary/30 text-green-primary hover:bg-green-primary hover:text-white hover:border-green-primary'
                      }`}
                    >
                      {tool.badges.includes('soon') ? (
                        <>
                          <Clock className="w-4 h-4 ml-2" />
                          قريباً
                        </>
                      ) : tool.badges.includes('free') ? (
                        <>
                          <Play className="w-4 h-4 ml-2" />
                          استخدم مجاناً
                        </>
                      ) : (
                        <>
                          <Crown className="w-4 h-4 ml-2" />
                          استكشف الأداة
                        </>
                      )}
                      <ChevronRight className="w-4 h-4 mr-auto" />
                    </Button>
                  </Link>

                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Plan CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-gradient-to-r from-green-primary/5 to-green-teal/5 rounded-2xl border border-green-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-primary" />
              </div>
              <div className="text-right">
                <p className="font-bold text-green-dark dark:text-white">احصل على المزيد من المميزات</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">ترقية للباقة المحترفة تفتح لك جميع الأدوات</p>
              </div>
            </div>
            <Link to={getHomeSectionUrl('pricing')}>
              <Button className="bg-gradient-to-r from-green-primary to-green-teal text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                <Star className="w-4 h-4 ml-2" />
                اكتشف الباقات
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
