"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutTemplate,
  Search,
  ArrowLeft,
  Loader2,
  Filter,
  Award,
  FileText,
  Calendar,
  BookOpen,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/routes';
import Navbar from '@/sections/Navbar';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Award,
  FileText,
  Calendar,
  BookOpen,
  LayoutTemplate,
};

interface Template {
  slug: string;
  name: string;
  description: string;
  category: string;
  access: string;
  icon: string;
  badge?: string;
}

const categories = [
  { id: 'all', name: 'الكل' },
  { id: 'certificates', name: 'شهادات' },
  { id: 'reports', name: 'تقارير' },
  { id: 'invitations', name: 'دعوات' },
  { id: 'presentations', name: 'عروض' },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        const response = await api.getTemplates();
        if (response.success) {
          setTemplates(response.templates);
        } else {
          setError(response.error || 'حدث خطأ في تحميل القوالب');
        }
      } catch (err) {
        setError('حدث خطأ في الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-green-primary mx-auto mb-4" />
            <p className="text-gray-500">جاري تحميل القوالب...</p>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-6"
          >
            <LayoutTemplate className="w-4 h-4" />
            مكتبة القوالب
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-dark dark:text-white mb-4">
            قوالب احترافية جاهزة
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            اختر من مجموعتنا من القوالب الاحترافية وخصصها حسب احتياجاتك
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 py-3 rounded-xl border-2 border-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, index) => {
              const Icon = iconMap[template.icon] || LayoutTemplate;
              
              return (
                <motion.div
                  key={template.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-white dark:bg-[#1B2D2B] rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-amber-400/50 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/templates/${template.slug}`)}
                >
                  {/* Preview Area */}
                  <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 bg-white dark:bg-[#1B2D2B] rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <Icon className="w-8 h-8 text-amber-500" />
                    </motion.div>
                    
                    {/* Badge */}
                    {template.badge && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                        {template.badge}
                      </span>
                    )}
                    
                    {/* Access Badge */}
                    {template.access !== 'free' && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-purple-500 text-white text-[10px] font-bold rounded-full">
                        {template.access}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{template.category}</span>
                    <h3 className="text-lg font-bold text-green-dark dark:text-white mt-1 mb-2 group-hover:text-amber-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-amber-600 font-medium text-sm flex items-center gap-1">
                        استخدم القالب
                        <ChevronRight className="w-4 h-4" />
                      </span>
                      <button 
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle favorite
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصنيف آخر</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
