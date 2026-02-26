"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Loader2,
  Play,
  Save,
  Download,
  AlertCircle,
  CheckCircle,
  LayoutTemplate,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ROUTES, getTemplateUrl } from '@/lib/routes';
import { templateRegistry } from '@/lib/templates/registry';
import Navbar from '@/sections/Navbar';
import { toast } from 'sonner';

// ============================================
// Types
// ============================================

interface TemplateResult {
  title: string;
  content: string;
  previewData?: Record<string, unknown>;
}

// ============================================
// Component
// ============================================

export default function TemplatePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [template, setTemplateState] = useState<ReturnType<typeof templateRegistry.getTemplate> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<TemplateResult | null>(null);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Get template from registry
    const tmpl = templateRegistry.getTemplate(slug);
    if (!tmpl) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setTemplateState(tmpl);
    setFormData(tmpl.defaultValues);
    setLoading(false);
  }, [slug]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRun = async () => {
    if (!template || !slug) return;

    setIsRunning(true);
    try {
      const response = await api.runTemplate({
        slug,
        input: formData,
      });

      if (response.success && response.result) {
        setResult(response.result);
        await api.trackEvent({
          event: 'template_run_success',
          payload: { slug, templateName: template.name },
        });
        toast.success('تم إنشاء القالب بنجاح!');
      } else {
        toast.error(response.error || 'حدث خطأ');
        await api.trackEvent({
          event: 'template_run_error',
          payload: { slug, error: response.error },
        });
      }
    } catch (err) {
      toast.error('حدث خطأ في الاتصال');
      await api.trackEvent({
        event: 'template_run_error',
        payload: { slug, error: String(err) },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    if (!template || !result) return;

    setIsSaving(true);
    try {
      const response = await api.saveProject({
        type: 'template',
        slug: template.slug,
        title: result.title,
        input: formData,
        result,
      });

      if (response.success) {
        toast.success('تم حفظ المشروع!');
        await api.trackEvent({
          event: 'tool_save_project',
          payload: { type: 'template', slug: template.slug },
        });
      } else {
        toast.error(response.error || 'فشل الحفظ');
      }
    } catch (err) {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'txt' | 'json' | 'pdf') => {
    if (!template || !result) return;

    try {
      const response = await api.exportResult({
        format,
        type: 'template',
        slug: template.slug,
        result,
        title: result.title,
      });

      if (response.success) {
        toast.success(response.message || `تم التصدير بصيغة ${format.toUpperCase()}`);
      } else {
        toast.error(response.error || 'فشل التصدير');
      }
    } catch (err) {
      toast.error('حدث خطأ في التصدير');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-green-primary" />
        </div>
      </div>
    );
  }

  // Not Found State
  if (notFound || !template) {
    const availableTemplates = templateRegistry.getAllTemplates().slice(0, 5);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
        <Navbar />
        <div className="h-[80px]" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">القالب غير موجود</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">القالب المطلوب غير متوفر</p>

            {availableTemplates.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">جرّب أحد القوالب المتاحة:</p>
                <div className="flex flex-col gap-2">
                  {availableTemplates.map((t) => (
                    <button
                      key={t.slug}
                      onClick={() => navigate(getTemplateUrl(t.slug))}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#1B2D2B] border border-gray-200 dark:border-gray-700 hover:border-amber-400/50 hover:shadow-md transition-all text-right"
                    >
                      <LayoutTemplate className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-green-dark dark:text-white truncate">{t.name}</p>
                        <p className="text-xs text-gray-400 truncate">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link to={ROUTES.TEMPLATES}>
              <Button>العودة لجميع القوالب</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      <Navbar />
      <div className="h-[80px]" />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Link 
            to={ROUTES.TEMPLATES}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>القوالب</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-green-dark dark:text-white font-medium">{template.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Template Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <LayoutTemplate className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-dark dark:text-white">{template.name}</h1>
                <p className="text-gray-500 mt-1">{template.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 text-xs rounded-full">
                    {template.category}
                  </span>
                  {template.access.tier !== 'free' && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs rounded-full">
                      {template.access.tier}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-green-dark dark:text-white mb-4">بيانات القالب</h3>
            <div className="space-y-4">
              {Object.entries(template.defaultValues).map(([field, defaultValue]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {field === 'recipientName' ? 'اسم المستلم' :
                     field === 'achievement' ? 'الإنجاز' :
                     field === 'date' ? 'التاريخ' :
                     field === 'issuer' ? 'الجهة المصدرة' :
                     field === 'eventName' ? 'اسم المناسبة' :
                     field === 'time' ? 'الوقت' :
                     field === 'location' ? 'المكان' :
                     field === 'host' ? 'المضيف' :
                     field === 'title' ? 'العنوان' :
                     field === 'department' ? 'القسم' :
                     field === 'period' ? 'الفترة' :
                     field === 'summary' ? 'الملخص' :
                     field === 'achievements' ? 'الإنجازات' :
                     field === 'courseName' ? 'اسم الدورة' :
                     field === 'institution' ? 'المؤسسة' :
                     field}
                  </label>
                  {typeof defaultValue === 'string' && (field === 'summary' || field === 'achievements' || field === 'description') ? (
                    <textarea
                      value={String(formData[field] || '')}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary focus:outline-none bg-white dark:bg-[#152B26] text-green-dark dark:text-white resize-none"
                      rows={4}
                    />
                  ) : (
                    <input
                      type={field === 'date' ? 'date' : 'text'}
                      value={String(formData[field] || '')}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-primary focus:outline-none bg-white dark:bg-[#152B26] text-green-dark dark:text-white"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Run Button */}
            <div className="mt-6">
              <Button
                onClick={handleRun}
                disabled={isRunning}
                className="w-full py-3 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-bold"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 ml-2" />
                    إنشاء القالب
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-gray-100 dark:border-gray-800"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-bold text-green-dark dark:text-white">النتيجة</h3>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-lg mb-2">{result.title}</h4>
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                    {result.content}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="outline"
                    className="border-green-primary text-green-primary hover:bg-green-primary hover:text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    ) : (
                      <Save className="w-4 h-4 ml-2" />
                    )}
                    حفظ المشروع
                  </Button>
                  
                  <Button
                    onClick={() => handleExport('txt')}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تصدير TXT
                  </Button>
                  
                  <Button
                    onClick={() => handleExport('json')}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تصدير JSON
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
