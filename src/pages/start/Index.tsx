"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Search,
  FileText,
  Award,
  HelpCircle,
  ClipboardList,
  Calendar,
  TrendingUp,
  Zap,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/sections/Navbar';
import { api } from '@/lib/api';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Award,
  HelpCircle,
  ClipboardList,
  FileText,
  Calendar,
  TrendingUp,
  Zap,
  LayoutTemplate,
  Search,
};

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  access: string;
  icon: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface Template {
  slug: string;
  name: string;
  description: string;
  category: string;
  access: string;
  icon: string;
  badge?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function StartPage() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [toolsRes, templatesRes] = await Promise.all([
          api.getTools(),
          api.getTemplates(),
        ]);

        if (toolsRes.success) {
          setTools(toolsRes.tools);
        }
        if (templatesRes.success) {
          setTemplates(templatesRes.templates);
        }
      } catch (err) {
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleToolSelect = (slug: string) => {
    setSelectedItem(slug);
    setTimeout(() => {
      navigate(`/tools/${slug}`);
    }, 200);
  };

  const handleTemplateSelect = (slug: string) => {
    setSelectedItem(slug);
    setTimeout(() => {
      navigate(`/templates/${slug}`);
    }, 200);
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-green-primary mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل الأدوات...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      <Navbar />
      <div className="h-[80px]" />

      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            ابدأ مجاناً - لا يتطلب تسجيل
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-dark dark:text-white mb-4">
            اختر ما تريد إنشاءه اليوم
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            أدوات احترافية وقوالب جاهزة للاستخدام الفوري
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن أداة أو قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 py-3 rounded-xl border-2 border-green-primary/20 focus:border-green-primary"
            />
          </div>
        </motion.div>

        {/* Tools Section */}
        {filteredTools.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-dark dark:text-white">الأدوات الذكية</h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredTools.map((tool) => {
                const Icon = iconMap[tool.icon] || Zap;
                const isSelected = selectedItem === tool.slug;
                
                return (
                  <motion.button
                    key={tool.slug}
                    variants={itemVariants}
                    onClick={() => handleToolSelect(tool.slug)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative group text-right p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-green-primary bg-green-primary/5 shadow-xl'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B] hover:border-green-primary/50 hover:shadow-lg'
                    }`}
                  >
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      {tool.isPopular && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                          شائع
                        </span>
                      )}
                      {tool.isNew && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                          جديد
                        </span>
                      )}
                      {tool.access !== 'free' && (
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                          {tool.access}
                        </span>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center mb-4 shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-green-dark dark:text-white mb-1 group-hover:text-green-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {tool.description}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          </section>
        )}

        {/* Templates Section */}
        {filteredTemplates.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-dark dark:text-white">القوالب الجاهزة</h2>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredTemplates.map((template) => {
                const Icon = iconMap[template.icon] || LayoutTemplate;
                const isSelected = selectedItem === template.slug;
                
                return (
                  <motion.button
                    key={template.slug}
                    variants={itemVariants}
                    onClick={() => handleTemplateSelect(template.slug)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative group text-right p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-xl'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B] hover:border-amber-400/50 hover:shadow-lg'
                    }`}
                  >
                    {/* Badge */}
                    {template.badge && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                        {template.badge}
                      </span>
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-md">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-green-dark dark:text-white mb-1 group-hover:text-amber-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {template.description}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          </section>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-green-primary/5 to-green-teal/5 rounded-2xl border border-green-primary/10">
            <CheckCircle className="w-6 h-6 text-green-primary" />
            <p className="text-gray-600 dark:text-gray-300">
              جميع الأدوات متاحة للاستخدام الفوري
            </p>
            <Link to={getHomeSectionUrl('pricing')}>
              <Button variant="outline" className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white">
                اكتشف الباقات
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
