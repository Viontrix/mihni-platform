import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';
import { 
  ArrowLeft, 
  Sparkles, 
  Award, 
  FileText, 
  Star, 
  Zap,
  TrendingUp,
  Play,
  Download,
  Palette,
  Calculator,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

// صور العرض المتغيرة (محاكاة للوحة التحكم والأدوات)
const showcaseImages = [
  {
    id: 1,
    title: 'لوحة التحكم الذكية',
    description: 'تابع إنجازاتك وإحصائياتك في مكان واحد',
    color: 'from-green-500 to-emerald-600',
    icon: TrendingUp,
    stats: [
      { label: 'قالب مستخدم', value: '24', color: 'bg-blue-100 text-blue-600' },
      { label: 'شهادة منشأة', value: '156', color: 'bg-amber-100 text-amber-600' },
      { label: 'معدل الاستخدام', value: '89%', color: 'bg-green-100 text-green-600' },
    ],
    activities: [
      { name: 'شهادة تقدير', time: 'منذ ساعة', icon: Award },
      { name: 'تقرير تقييم', time: 'منذ 3 ساعات', icon: FileText },
    ]
  },
  {
    id: 2,
    title: 'منشئ الشهادات الاحترافي',
    description: 'صمم شهاداتك بخطوات بسيطة وسهلة',
    color: 'from-amber-500 to-orange-600',
    icon: Award,
    preview: {
      title: 'شهادة تقدير',
      subtitle: 'تقديراً للجهود المتميزة',
      recipient: 'اسم المكرم',
      date: '2026-02-20'
    }
  },
  {
    id: 3,
    title: 'حاسبة الدرجات الذكية',
    description: 'احسب درجات طلابك بسرعة ودقة',
    color: 'from-blue-500 to-cyan-600',
    icon: Calculator,
    preview: {
      subjects: [
        { name: 'الرياضيات', score: 95, total: 100 },
        { name: 'العلوم', score: 88, total: 100 },
        { name: 'اللغة العربية', score: 92, total: 100 },
      ],
      average: '91.7%'
    }
  },
  {
    id: 4,
    title: 'مولد الاختبارات',
    description: 'أنشئ اختبارات متنوعة في ثوانٍ',
    color: 'from-purple-500 to-pink-600',
    icon: FileText,
    preview: {
      questions: [
        { type: 'اختيار من متعدد', count: 10 },
        { type: 'صح أو خطأ', count: 5 },
        { type: 'مقالي', count: 3 },
      ],
      total: '18 سؤال'
    }
  },
  {
    id: 5,
    title: 'بناء الجداول الدراسية',
    description: 'نظم جداولك الأسبوعية بسهولة',
    color: 'from-teal-500 to-emerald-600',
    icon: Calendar,
    preview: {
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      classes: ['رياضيات', 'علوم', 'عربي', 'إنجليزي', 'فنية']
    }
  }
];

// Floating particles
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-green-primary/30"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%',
            opacity: 0 
          }}
          animate={{ 
            y: '-10%',
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};

// Animated gradient orbs
const GradientOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-green-primary/15 via-green-teal/10 to-transparent blur-[100px]"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-green-light/15 via-green-teal/10 to-transparent blur-[80px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

// Stats data
const stats = [
  { value: 100, suffix: '+', label: 'قالب احترافي', icon: FileText },
  { value: 50, suffix: '+', label: 'أداة ذكية', icon: Zap },
  { value: 10000, suffix: '+', label: 'مستخدم نشط', icon: Users },
  { value: 4.9, suffix: '', label: 'تقييم المستخدمين', icon: Star },
];

// Animated counter - shows numbers immediately
const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayCount(value);
        clearInterval(timer);
      } else {
        setDisplayCount(value % 1 !== 0 ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {value % 1 !== 0 ? displayCount.toFixed(1) : displayCount.toLocaleString()}{suffix}
    </span>
  );
};

// Dashboard Preview Component
const DashboardPreview = ({ data }: { data: typeof showcaseImages[0] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl overflow-hidden border border-green-primary/10"
    >
      {/* Browser Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 text-green-primary" />
            mahni.edu.sa
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-green-dark dark:text-white flex items-center gap-2">
              مرحباً بك! 👋
            </h3>
            <p className="text-sm text-gray-500">لديك 5 قوالب جديدة</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">باقة المحترف</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {data.stats?.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-3 bg-gray-50 dark:bg-[#152B26] rounded-xl text-center"
            >
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xl font-bold text-green-dark dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Activities */}
        <div className="space-y-2">
          {data.activities?.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#152B26] rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-green-primary/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-green-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-dark dark:text-white">{item.name}</p>
              </div>
              <span className="text-xs text-gray-400">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Certificate Preview Component
const CertificatePreview = ({ data }: { data: typeof showcaseImages[1] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl overflow-hidden border border-green-primary/10"
    >
      {/* Browser Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm text-gray-500">
            <Award className="w-4 h-4 text-green-primary" />
            منشئ الشهادات
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Certificate Preview */}
        <div className="aspect-[1.4/1] bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-xl border-4 border-double border-amber-300 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Decorative Frame */}
          <div className="absolute inset-3 border-2 border-amber-400/50 rounded-lg" />
          <div className="absolute inset-6 border border-amber-300/30 rounded-lg" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-amber-700 mb-2">{data.preview?.title}</h3>
            <p className="text-amber-600 text-sm mb-4">{data.preview?.subtitle}</p>
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-gray-800 mb-2">{data.preview?.recipient}</p>
            <p className="text-gray-500 text-sm">{data.preview?.date}</p>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">جاهز للتحميل</p>
      </div>
    </motion.div>
  );
};

// Calculator Preview Component
const CalculatorPreview = ({ data }: { data: typeof showcaseImages[2] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl overflow-hidden border border-green-primary/10"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm text-gray-500">
            <Calculator className="w-4 h-4 text-blue-500" />
            حاسبة الدرجات
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {data.preview?.subjects?.map((subject: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#152B26] rounded-xl"
            >
              <span className="text-sm font-medium text-green-dark dark:text-white">{subject.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.score}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="text-sm font-bold text-blue-600">{subject.score}/{subject.total}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center"
        >
          <p className="text-sm text-gray-500">المعدل العام</p>
          <p className="text-3xl font-bold text-blue-600">{data.preview?.average || '0%'}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Quiz Preview Component
const QuizPreview = ({ data }: { data: typeof showcaseImages[3] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl overflow-hidden border border-green-primary/10"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm text-gray-500">
            <FileText className="w-4 h-4 text-purple-500" />
            مولد الاختبارات
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {data.preview?.questions?.map((q: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center"
            >
              <p className="text-2xl font-bold text-purple-600">{q.count}</p>
              <p className="text-xs text-gray-500">{q.type}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-center"
        >
          <p className="text-sm opacity-80">إجمالي الأسئلة</p>
          <p className="text-2xl font-bold">{data.preview?.total || '0'}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Schedule Preview Component
const SchedulePreview = ({ data }: { data: typeof showcaseImages[4] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl overflow-hidden border border-green-primary/10"
    >
      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 dark:bg-[#152B26] border-b border-green-primary/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#0D1B1A] rounded-lg text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-teal-500" />
            الجدول الدراسي
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {data.preview?.days?.map((day: string, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="text-center"
            >
              <div className="text-xs text-gray-500 mb-2">{day}</div>
              <div className="space-y-1">
                {data.preview?.classes?.slice(0, 3).map((cls: string, j: number) => (
                  <motion.div 
                    key={j}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 + j * 0.03 }}
                    className={`text-[10px] p-1 rounded ${
                      j === 0 ? 'bg-blue-100 text-blue-700' :
                      j === 1 ? 'bg-green-100 text-green-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {cls}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  return (
    <>
      {/* Top Right - Lightning */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -right-3 sm:-right-4 lg:-right-5 w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [-8, 8, -8], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />
      </motion.div>
      
      {/* Top Left - Star */}
      <motion.div
        className="absolute -top-3 sm:-top-4 lg:-top-5 -left-3 sm:-left-4 lg:-left-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [6, -6, 6], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
      
      {/* Bottom Left - Download */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -left-3 sm:-left-4 lg:-left-5 w-9 sm:w-10 lg:w-12 h-9 sm:h-10 lg:h-12 bg-gradient-to-br from-green-primary to-green-teal rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Download className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
      </motion.div>
      
      {/* Bottom Right - Award */}
      <motion.div
        className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 -right-3 sm:-right-4 lg:-right-5 w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl z-30"
        animate={{ y: [-6, 6, -6], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Award className="w-5 sm:w-5 lg:w-6 h-5 sm:h-5 lg:h-6 text-white" />
      </motion.div>
    </>
  );
};

// Main Showcase Component
const ImageShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % showcaseImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentData = showcaseImages[currentIndex];

  const renderPreview = () => {
    switch (currentData.id) {
      case 1:
        return <DashboardPreview data={currentData} />;
      case 2:
        return <CertificatePreview data={currentData} />;
      case 3:
        return <CalculatorPreview data={currentData} />;
      case 4:
        return <QuizPreview data={currentData} />;
      case 5:
        return <SchedulePreview data={currentData} />;
      default:
        return <DashboardPreview data={currentData} />;
    }
  };

  return (
    <div className="relative">
      {/* Main Preview with Floating Elements */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {renderPreview()}
        </AnimatePresence>
        
        {/* Floating Elements - positioned relative to the preview card */}
        <FloatingElements />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {showcaseImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex 
                ? 'w-8 bg-green-primary' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Title Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 text-center"
        >
          <p className="text-sm sm:text-base font-bold text-green-dark dark:text-white">{currentData.title}</p>
          <p className="text-xs text-gray-500">{currentData.description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F0F9F4] via-[#E8F5E9] to-[#C8E6C9] dark:from-[#0A1F1A] dark:via-[#0D1B1A] dark:to-[#0A1512]"
    >
      {/* Background Effects */}
      <GradientOrbs />
      <FloatingParticles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45, 106, 79, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 106, 79, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-28 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-right order-2 lg:order-1 pt-4 lg:pt-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <motion.span 
                className="inline-flex items-center gap-2 text-green-primary dark:text-green-light text-sm font-bold"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4" />
                منصة مِهني - احترافية في كل تفصيلة
              </motion.span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <h1 className="text-5xl sm:text-5xl lg:text-7xl xl:text-8xl font-extrabold leading-tight">
                <span className="text-green-dark dark:text-white lg:inline block">
                  منصة{' '}
                </span>
                <span className="bg-gradient-to-r from-green-primary via-green-teal to-green-light bg-clip-text text-transparent">
                  مِهني
                </span>
              </h1>
            </motion.div>

            {/* Marketing Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="text-green-primary font-bold">وفّر وقتك</span> وأنجز عملك باحترافية مع{' '}
                <span className="font-semibold">قوالب جاهزة</span> وأدوات تنفيذية متكاملة
              </p>
              <p className="text-gray-500 mt-3">
                شهادات • تقييمات • خطط • تقارير • اختبارات • جداول • تصاميم
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            >
              {[
                { icon: Palette, text: 'تخصيص سهل' },
                { icon: Download, text: 'تصدير فوري' },
                { icon: Clock, text: 'توفر الوقت' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#1B2D2B]/60 rounded-full border border-green-primary/10"
                >
                  <feature.icon className="w-4 h-4 text-green-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to={ROUTES.HOME}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-primary to-green-teal text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all group font-bold"
                  >
                    ابدأ مجاناً
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to={getHomeSectionUrl('templates')}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-primary/30 text-green-primary hover:bg-green-primary/10 hover:border-green-primary px-8 py-6 text-lg rounded-2xl transition-all font-bold bg-white/50 backdrop-blur-sm"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    استكشف القوالب
                  </Button>
                </Link>
              </motion.div>
            </motion.div>


          </div>

          {/* Right Side - Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative pb-16 lg:pb-20"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-green-primary/20 via-green-teal/20 to-green-light/20 rounded-[2rem] lg:rounded-[3rem] blur-2xl lg:blur-3xl opacity-60" />
            
            {/* Image Showcase Container */}
            <div className="relative mx-auto lg:mx-0 max-w-[320px] sm:max-w-[400px] lg:max-w-[480px]">
              <ImageShowcase />
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 lg:mt-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500', 
                'from-purple-500 to-violet-500',
                'from-amber-500 to-orange-500'
              ];
              const bgColors = [
                'bg-blue-50',
                'bg-green-50',
                'bg-purple-50',
                'bg-amber-50'
              ];
              
              return (
                <motion.div 
                  key={index}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`relative ${bgColors[index]} dark:bg-opacity-10 rounded-xl p-3 sm:p-4 border border-transparent hover:border-green-primary/20 transition-all overflow-hidden group`}
                >
                  {/* Top icon with gradient */}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-2 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  
                  {/* Number */}
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-dark dark:text-white mb-0.5">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  
                  {/* Label */}
                  <div className="text-[10px] sm:text-xs text-gray-500">{stat.label}</div>
                  
                  {/* Subtle decoration */}
                  <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br ${colors[index]} opacity-10 group-hover:opacity-20 transition-opacity`} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

    </section>
  );
}
