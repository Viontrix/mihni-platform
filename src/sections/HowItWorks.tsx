import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, FileText, Share2, BarChart3, Check, ArrowLeft, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'أنشئ حسابك',
    description: 'سجل بخطوات بسيطة واختر الباقة المناسبة لاحتياجاتك',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    number: '02',
    icon: FileText,
    title: 'اختر قالب أو أداة',
    description: 'اختر من مكتبة القوالب والأدوات الذكية الاحترافية',
    color: 'from-green-primary to-green-teal',
  },
  {
    number: '03',
    icon: Share2,
    title: 'خصص وأنشئ',
    description: 'خصص القالب أو استخدم الأداة الذكية لإنشاء محتواك',
    color: 'from-purple-500 to-pink-400',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'صدّر وشارك',
    description: 'صدّر بصيغ متعددة وشارك مع فريقك أو عملائك',
    color: 'from-orange-500 to-amber-400',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress through steps
  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0D1B1A] relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            رحلتك تبدأ من هنا
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-dark dark:text-white mb-3">
            أربع خطوات
            <span className="bg-gradient-to-r from-green-primary to-green-teal bg-clip-text text-transparent"> للبدء</span>
          </h2>
          
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            رحلة بسيطة لإنجاز عملك باحترافية
          </p>
        </motion.div>

        {/* Steps - Sequential Animation */}
        <div ref={ref} className="relative">
          {/* Connection line - Desktop */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-l from-green-primary to-green-teal rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: isInView ? `${(activeStep / (steps.length - 1)) * 100}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Connection line - Mobile (vertical) */}
          <div className="lg:hidden absolute top-0 bottom-0 right-6 w-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-gradient-to-b from-green-primary to-green-teal rounded-full"
              initial={{ height: '0%' }}
              animate={{ height: isInView ? `${(activeStep / (steps.length - 1)) * 100}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;
              
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { 
                    opacity: isActive ? 1 : 0.5, 
                    y: 0,
                    scale: isCurrent ? 1.02 : 1
                  } : {}}
                  transition={{ 
                    delay: index * 0.3, 
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 100
                  }}
                  className="relative flex flex-col items-center gap-0"
                >
                  {/* Step Number Circle */}
                  <motion.div 
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                      isActive 
                        ? 'bg-gradient-to-br from-green-primary to-green-teal shadow-lg shadow-green-primary/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                    animate={{ 
                      scale: isCurrent ? [1, 1.1, 1] : 1,
                      rotate: isCurrent ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.6, repeat: isCurrent ? Infinity : 0 }}
                  >
                    {isActive ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">{step.number}</span>
                    )}
                  </motion.div>

                  {/* Card */}
                  <motion.div 
                    className={`flex-1 lg:w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-white dark:bg-[#1B2D2B] border-green-primary shadow-xl shadow-green-primary/10' 
                        : isActive
                          ? 'bg-white dark:bg-[#1B2D2B] border-green-primary/40 shadow-md'
                          : 'bg-gray-50 dark:bg-[#152B26] border-gray-200 dark:border-gray-700'
                    }`}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    {/* Icon */}
                    <motion.div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-md`}
                      animate={isCurrent ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    
                    {/* Content */}
                    <h3 className="text-base sm:text-lg font-bold text-green-dark dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-green-primary to-green-teal rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                جاهز للبدء؟
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto text-sm sm:text-base">
                انضم لآلاف المستخدمين من الأفراد والشركات والجهات
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-green-primary rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                ابدأ مجاناً
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
