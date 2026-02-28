"use client"

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award,
  FileText,
  ClipboardList,
  Calendar,
  BarChart3,
  BookOpen,
  GraduationCap,
  Medal,
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
  Search,
  Link2,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/sections/Navbar';
import { ROUTES, getTemplateUrl } from '@/lib/routes';
import { toast } from 'sonner';

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
const TemplateCard = ({ template, index }: { template: typeof allTemplates[0]; index: number }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-[#1B2D2B] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-green-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      {/* Preview Image */}
      <div className={`h-40 ${template.gradient} relative overflow-hidden`}>
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-100 hover:text-red-500'
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
            const url = `${window.location.origin}/#${getTemplateUrl(template.id)}`;
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

// All Templates Data (expanded)
const allTemplates = [
  // شهادات
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
    id: 'certificate-4',
    name: 'شهادة مشاركة',
    category: 'شهادات',
    gradient: 'bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100',
    badges: ['free', 'new'],
    icon: Award,
    iconColor: 'text-rose-500',
    downloads: '756',
    rating: '4.6',
  },
  // تقارير
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
  {
    id: 'report-3',
    name: 'تقرير زيارة ميدانية',
    category: 'تقارير',
    gradient: 'bg-gradient-to-br from-cyan-100 via-cyan-50 to-blue-100',
    badges: ['pro'],
    icon: FileText,
    iconColor: 'text-cyan-500',
    downloads: '623',
    rating: '4.4',
  },
  // جداول
  {
    id: 'schedule-1',
    name: 'جدول أسبوعي منظم',
    category: 'جداول',
    gradient: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
    badges: ['free', 'popular'],
    icon: Calendar,
    iconColor: 'text-purple-500',
    downloads: '3.2k',
    rating: '4.9',
  },
  {
    id: 'schedule-2',
    name: 'جدول امتحانات',
    category: 'جداول',
    gradient: 'bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100',
    badges: ['free'],
    icon: Calendar,
    iconColor: 'text-pink-500',
    downloads: '1.5k',
    rating: '4.6',
  },
  {
    id: 'schedule-3',
    name: 'جدول الحصص الدراسية',
    category: 'جداول',
    gradient: 'bg-gradient-to-br from-violet-100 via-violet-50 to-purple-100',
    badges: ['pro'],
    icon: Calendar,
    iconColor: 'text-violet-500',
    downloads: '2.1k',
    rating: '4.8',
  },
  // نماذج
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
    id: 'form-2',
    name: 'نموذج استبيان رضا',
    category: 'نماذج',
    gradient: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-green-100',
    badges: ['free'],
    icon: ClipboardList,
    iconColor: 'text-emerald-500',
    downloads: '987',
    rating: '4.5',
  },
  // عروض
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
    id: 'presentation-2',
    name: 'عرض نتائج الطلاب',
    category: 'عروض',
    gradient: 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100',
    badges: ['pro'],
    icon: BookOpen,
    iconColor: 'text-blue-500',
    downloads: '1.3k',
    rating: '4.7',
  },
];

// Categories
const categories = [
  { id: 'all', name: 'الكل', count: 48 },
  { id: 'شهادات', name: 'شهادات', count: 12 },
  { id: 'تقارير', name: 'تقارير', count: 8 },
  { id: 'جداول', name: 'جداول', count: 10 },
  { id: 'نماذج', name: 'نماذج', count: 6 },
  { id: 'عروض', name: 'عروض', count: 12 },
];

export default function TemplatesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates
  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white dark:bg-[#0D1B1A]">
      {/* Navbar */}
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-[80px]" />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-primary/10 to-green-teal/10 text-green-primary text-sm font-semibold mb-6 border border-green-primary/20"
            >
              <BookOpen className="w-4 h-4" />
              مكتبة القوالب
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-dark dark:text-white mb-4">
              جميع <span className="text-green-primary">القوالب</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              استعرض مجموعتنا الكاملة من القوالب الاحترافية الجاهزة للاستخدام
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-xl mx-auto mb-8"
            >
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن قالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-14 py-6 text-lg rounded-2xl border-2 border-green-primary/20 focus:border-green-primary bg-white dark:bg-[#1B2D2B] shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {[
                { value: '48+', label: 'قالب', icon: FileText },
                { value: '6', label: 'تصنيفات', icon: Filter },
                { value: '15k+', label: 'تحميل', icon: Download },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1B2D2B] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <stat.icon className="w-4 h-4 text-green-primary" />
                  <span className="font-bold text-green-dark dark:text-white">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Templates */}
      <section className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Categories Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                    ? 'bg-green-primary text-white shadow-lg shadow-green-primary/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 hover:scale-105'
                  }`}
              >
                {cat.name}
                <span className={`mr-1.5 text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                  ({cat.count})
                </span>
              </button>
            ))}
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              عرض <span className="font-bold text-green-dark dark:text-white">{filteredTemplates.length}</span> قالب
            </p>
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredTemplates.map((template, index) => (
                <TemplateCard key={template.id} template={template} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصنيف آخر</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Back to Home */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#1B2D2B] rounded-full shadow-xl border border-green-primary/10 hover:border-green-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1"
        >
          <ArrowLeft className="w-5 h-5 text-green-primary" />
          <span className="text-sm font-medium text-green-dark dark:text-white">العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
