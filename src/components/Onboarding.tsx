import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  Building2, 
  User, 
  LayoutGrid,
  Award,
  FileText,
  HelpCircle,
  ClipboardList,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Zap,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const fields = [
  { id: 'education', name: 'التعليم', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
  { id: 'business', name: 'الأعمال', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
  { id: 'government', name: 'الجهات الحكومية', icon: Building2, color: 'from-amber-500 to-orange-500' },
  { id: 'personal', name: 'الأفراد', icon: User, color: 'from-purple-500 to-pink-500' },
  { id: 'all', name: 'الكل', icon: LayoutGrid, color: 'from-gray-500 to-gray-600' },
];

const tools = [
  { id: 'certificates', name: 'شهادات', icon: Award, color: 'from-amber-500 to-orange-500' },
  { id: 'reports', name: 'تقارير', icon: FileText, color: 'from-teal-500 to-cyan-500' },
  { id: 'quizzes', name: 'اختبارات', icon: HelpCircle, color: 'from-green-500 to-emerald-500' },
  { id: 'surveys', name: 'استبيانات', icon: ClipboardList, color: 'from-purple-500 to-violet-500' },
  { id: 'schedules', name: 'جداول', icon: Calendar, color: 'from-blue-500 to-indigo-500' },
  { id: 'browse', name: 'تصفح جميع الأدوات', icon: LayoutGrid, color: 'from-gray-400 to-gray-500' },
];

const plans = [
  {
    id: 'free',
    name: 'المجانية',
    price: 'مجاني',
    description: 'للتجربة والاستخدام الشخصي',
    features: ['10 قوالب', 'استخدام محدود', 'تصدير PNG'],
    icon: Star,
    color: 'from-gray-400 to-gray-500',
    recommended: false,
  },
  {
    id: 'pro',
    name: 'المحترف',
    price: '69 ريال/شهر',
    description: 'للأفراد والمحترفين',
    features: ['جميع الأدوات', 'تخصيص كامل', 'تصدير PDF', '50+ قالب'],
    icon: Crown,
    color: 'from-green-primary to-green-teal',
    recommended: true,
  },
  {
    id: 'business',
    name: 'الأعمال',
    price: '169 ريال/شهر',
    description: 'للمدارس والمؤسسات',
    features: ['تخزين سحابي', 'تقارير متقدمة', '5 مستخدمين', 'دعم أولوية'],
    icon: Zap,
    color: 'from-blue-500 to-cyan-500',
    recommended: false,
  },
  {
    id: 'enterprise',
    name: 'المؤسسات',
    price: '399 ريال/شهر',
    description: 'للشركات الكبرى',
    features: ['مستخدمين غير محدود', 'API كامل', 'دعم 24/7', 'تخصيص كامل'],
    icon: Users,
    color: 'from-amber-500 to-orange-500',
    recommended: false,
  },
];

export default function Onboarding({ isOpen, onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter(id => id !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header with progress */}
          <div className="bg-gradient-to-r from-green-primary to-green-teal p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">م</span>
                </div>
                <span className="text-white font-bold text-xl">مِهني</span>
              </div>
              <button 
                onClick={onSkip}
                className="text-white/80 hover:text-white text-sm"
              >
                تخطي
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 right-0 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-white/80 text-xs">
              <span>الخطوة {step} من 3</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                      ما مجالك الأساسي؟
                    </h2>
                    <p className="text-gray-500">
                      سنساعدك في اختيار الأدوات المناسبة لك
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fields.map((field) => {
                      const Icon = field.icon;
                      const isSelected = selectedField === field.id;
                      return (
                        <motion.button
                          key={field.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedField(field.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? 'border-green-primary bg-green-primary/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-primary/50'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-green-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {field.name}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-2"
                            >
                              <Check className="w-5 h-5 text-green-primary mx-auto" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                      ماذا تريد إنشاءه غالبًا؟
                    </h2>
                    <p className="text-gray-500">
                      اختر ما يناسب احتياجاتك (يمكنك اختيار أكثر من واحد)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      const isSelected = selectedTools.includes(tool.id);
                      return (
                        <motion.button
                          key={tool.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleTool(tool.id)}
                          className={`p-4 rounded-2xl border-2 transition-all ${
                            isSelected
                              ? 'border-green-primary bg-green-primary/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-primary/50'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-green-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {tool.name}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 left-2"
                            >
                              <div className="w-5 h-5 bg-green-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                      اختر باقتك
                    </h2>
                    <p className="text-gray-500">
                      يمكنك الترقية لاحقًا في أي وقت
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plans.map((plan) => {
                      const Icon = plan.icon;
                      const isSelected = selectedPlan === plan.id;
                      return (
                        <motion.button
                          key={plan.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`relative p-4 rounded-2xl border-2 transition-all text-right ${
                            isSelected
                              ? 'border-green-primary bg-green-primary/10'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-primary/50'
                          }`}
                        >
                          {plan.recommended && (
                            <span className="absolute -top-2 left-4 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                              موصى به
                            </span>
                          )}
                          
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-green-dark dark:text-white">{plan.name}</span>
                                <span className="font-bold text-green-primary">{plan.price}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                              <ul className="mt-2 space-y-1">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-center gap-1 text-xs text-gray-600">
                                    <Check className="w-3 h-3 text-green-primary" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 left-2"
                            >
                              <div className="w-5 h-5 bg-green-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      <Zap className="w-4 h-4 inline-block ml-1" />
                      يمكنك الترقية في أي وقت لاحقًا من لوحة التحكم
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="px-6"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                رجوع
              </Button>

              <Button
                onClick={handleNext}
                disabled={step === 1 && !selectedField}
                className="px-6 bg-gradient-to-r from-green-primary to-green-teal text-white"
              >
                {step === 3 ? (
                  <>
                    ابدأ الآن
                    <Check className="w-4 h-4 mr-2" />
                  </>
                ) : (
                  <>
                    التالي
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
