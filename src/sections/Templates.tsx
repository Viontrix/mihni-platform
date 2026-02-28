import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES, getTemplateUrl } from '@/lib/routes';
import { toast } from 'sonner';
import { 
  Award, 
  FileText, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  BookOpen,
  GraduationCap,
  Medal,
  CheckCircle,
  TrendingUp,
  Star,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Download,
  Eye,
  Heart,
  Lock,
  Check,
  Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Template Badge Component
const TemplateBadge = ({ type }: { type: string }) => {
  const badges: Record<string, { bg: string; icon: React.ElementType; text: string }> = {
    free: { bg: 'bg-green-500', icon: Check, text: 'مجاني' },
    new: { bg: 'bg-blue-500', icon: Sparkles, text: 'جديد' },
    popular: { bg: 'bg-amber-500', icon: TrendingUp, text: 'شائع' },
    pro: { bg: 'bg-purple-500', icon: Lock, text: 'محترف' },
  };
  
  const badge = badges[type];
  if (!badge) return null;
  const Icon = badge.icon;
  
  return (
    <span className={`px-2 py-0.5 ${badge.bg} text-white text-[10px] font-bold rounded-full flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {badge.text}
    </span>
  );
};

// Template Card Component
const TemplateCard = ({ template, index }: { template: typeof templates[0]; index: number }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-[#1B2D2B] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      {/* Preview Image */}
      <div className={`h-36 ${template.gradient} relative overflow-hidden`}>
        {/* Template Preview Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-white/90 dark:bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg"
          >
            <template.icon className={`w-8 h-8 ${template.iconColor}`} />
          </motion.div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {template.badges.map((badge) => (
            <TemplateBadge key={badge} type={badge} />
          ))}
        </div>
        
        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-green-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="flex gap-2"
          >
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-green-primary hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-100 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
          {template.category}
        </span>
        
        {/* Title */}
        <h4 className="font-bold text-green-dark dark:text-white mt-1 mb-2 group-hover:text-green-primary transition-colors line-clamp-1">
          {template.name}
        </h4>
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            {template.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {template.rating}
          </span>
        </div>
        
        {/* Action */}
        <Link to={getTemplateUrl(template.id)}>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-xs border-green-primary/30 text-green-primary hover:bg-green-primary hover:text-white transition-all"
          >
            {template.badges.includes('free') ? 'استخدم مجاناً' : 'استخدم القالب'}
            <ChevronRight className="w-4 h-4 mr-auto" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs mt-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-green-primary/50 hover:text-green-primary transition-all"
          onClick={(e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/#${template.id}`;
            navigator.clipboard.writeText(url).then(() => {
              toast.success('تم نسخ الرابط بنجاح');
            });
          }}
        >
          <Link2 className="w-3.5 h-3.5 ml-1.5" />
          نسخ الرابط
        </Button>
      </div>
    </motion.div>
  );
};

// Template Categories
const categories = [
  { id: 'all', name: 'الكل', count: 48 },
  { id: 'certificates', name: 'شهادات', count: 12 },
  { id: 'reports', name: 'تقارير', count: 8 },
  { id: 'schedules', name: 'جداول', count: 10 },
  { id: 'forms', name: 'نماذج', count: 6 },
  { id: 'presentations', name: 'عروض', count: 12 },
];

// Templates Data
const templates = [
  {
    id: 'certificate-1',
    name: 'شهادة تقدير ملكية',
    category: 'شهادات',
    gradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    badges: ['popular', 'free'],
    icon: Award,
    iconColor: 'text-amber-500',
    downloads: '2.4k',
    rating: '4.9',
  },
  {
    id: 'certificate-2',
    name: 'شهادة شكر وتقدير',
    category: 'شهادات',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100',
    badges: ['free'],
    icon: Medal,
    iconColor: 'text-blue-500',
    downloads: '1.8k',
    rating: '4.7',
  },
  {
    id: 'report-1',
    name: 'تقرير فعالية احترافي',
    category: 'تقارير',
    gradient: 'bg-gradient-to-br from-teal-100 via-teal-50 to-cyan-100',
    badges: ['new', 'pro'],
    icon: FileText,
    iconColor: 'text-teal-500',
    downloads: '856',
    rating: '4.8',
  },
  {
    id: 'schedule-1',
    name: 'جدول أسبوعي منظم',
    category: 'جداول',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['free'],
    icon: Calendar,
    iconColor: 'text-purple-500',
    downloads: '3.2k',
    rating: '4.9',
  },
  {
    id: 'form-1',
    name: 'نموذج تقييم أداء',
    category: 'نماذج',
    gradient: 'bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100',
    badges: ['popular', 'pro'],
    icon: ClipboardList,
    iconColor: 'text-rose-500',
    downloads: '1.5k',
    rating: '4.6',
  },
  {
    id: 'presentation-1',
    name: 'عرض تقديمي تعليمي',
    category: 'عروض',
    gradient: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
    badges: ['new', 'free'],
    icon: BookOpen,
    iconColor: 'text-green-500',
    downloads: '2.1k',
    rating: '4.8',
  },
  {
    id: 'certificate-3',
    name: 'شهادة إتمام دورة',
    category: 'شهادات',
    gradient: 'bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100',
    badges: ['pro'],
    icon: GraduationCap,
    iconColor: 'text-indigo-500',
    downloads: '967',
    rating: '4.7',
  },
  {
    id: 'report-2',
    name: 'تقرير تحليلي شهري',
    category: 'تقارير',
    gradient: 'bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100',
    badges: ['free'],
    icon: BarChart3,
    iconColor: 'text-orange-500',
    downloads: '1.2k',
    rating: '4.5',
  },
];

export default function Templates() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section id="templates" className="py-24 bg-white dark:bg-[#0D1B1A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300A896' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <BookOpen className="w-4 h-4" />
            مكتبة القوالب الجاهزة
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            Template Library
            <span className="block text-2xl sm:text-3xl mt-2 text-gray-600 dark:text-gray-300">
              قوالب فردية مستقلة جاهزة للاستخدام
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            مكتبة ضخمة من القوالب الاحترافية المصممة مسبقاً، تعديل بسيط فقط بدون تخصيص متقدم
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {[
            { value: '48+', label: 'قالب جاهز', icon: FileText },
            { value: '12', label: 'تصنيف', icon: GridIcon },
            { value: '15k+', label: 'تحميل', icon: Download },
            { value: '4.8', label: 'تقييم', icon: Star },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <stat.icon className="w-4 h-4 text-green-primary" />
              <span className="font-bold text-green-dark dark:text-white">{stat.value}</span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Categories Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-green-primary text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat.name}
              <span className={`mr-1.5 text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                ({cat.count})
              </span>
            </button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {templates
            .filter((template) => activeCategory === 'all' || 
              (activeCategory === 'certificates' && template.category === 'شهادات') ||
              (activeCategory === 'reports' && template.category === 'تقارير') ||
              (activeCategory === 'schedules' && template.category === 'جداول') ||
              (activeCategory === 'forms' && template.category === 'نماذج') ||
              (activeCategory === 'presentations' && template.category === 'عروض')
            )
            .map((template, index) => (
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link to={ROUTES.TEMPLATES}>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white transition-all rounded-xl"
            >
              استعرض جميع القوالب
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Free Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-bold text-green-primary">مجاني:</span> جميع القوالب المجانية متاحة للاستخدام الفوري
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Grid Icon for stats
function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
