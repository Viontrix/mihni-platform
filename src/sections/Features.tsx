import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FileText, 
  BarChart3, 
  Share2, 
  Shield, 
  Zap, 
  Users,
  Download,
  Palette
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'نماذج جاهزة متنوعة',
    description: 'مكتبة غنية بأكثر من 100 نموذج تعليمي جاهز للاستخدام الفوري في مختلف المجالات التربوية',
    color: 'from-green-primary to-green-teal',
    bgColor: 'bg-green-primary/10',
  },
  {
    icon: BarChart3,
    title: 'تقارير تحليلية متقدمة',
    description: 'احصل على تقارير مفصلة ورسوم بيانية تفاعلية لتحليل البيانات واتخاذ قرارات مدروسة',
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Share2,
    title: 'مشاركة سهلة وسريعة',
    description: 'شارك النماذج عبر روابط مباشرة أو البريد الإلكتروني أو تكامل مع المنصات التعليمية',
    color: 'from-purple-500 to-pink-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Shield,
    title: 'أمان وحماية البيانات',
    description: 'نظام أمان متكامل يضمن حماية بيانات المستخدمين والطلاب بأعلى معايير الأمان',
    color: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Zap,
    title: 'تعبئة ذكية وسريعة',
    description: 'تجربة تعبئة سلسة مع حفظ تلقائي للبيانات وإكمال ذكي للحقول المتكررة',
    color: 'from-yellow-500 to-amber-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Users,
    title: 'إدارة متعددة المستخدمين',
    description: 'نظام صلاحيات مرن يسمح بإدارة فرق العمل والأقسام المختلفة بسهولة',
    color: 'from-rose-500 to-pink-400',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: Download,
    title: 'تصدير متعدد الصيغ',
    description: 'صدّر البيانات بصيغ متعددة PDF, Word, Excel, CSV حسب احتياجاتك',
    color: 'from-teal-500 to-emerald-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Palette,
    title: 'تخصيص كامل',
    description: 'خصص النماذج بشعار مؤسستك وألوانها الهوية البصرية الخاصة بك',
    color: 'from-indigo-500 to-violet-400',
    bgColor: 'bg-indigo-500/10',
  },
];

export default function Features() {
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
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section id="features" className="py-24 bg-white dark:bg-[#0D1B1A] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-medium mb-4">
            لماذا تختار نماذجي؟
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-dark dark:text-white mb-6">
            مميزات تجعل عملك
            <span className="text-gradient"> أسهل وأكثر كفاءة</span>
          </h2>
          <p className="text-lg text-gray-medium dark:text-gray-light max-w-2xl mx-auto">
            منصة متكاملة توفر لك كل ما تحتاجه لإدارة النماذج التعليمية باحترافية
            وتوفير الوقت والجهد
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-6 bg-cream dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10 hover:border-green-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 bg-gradient-to-br ${feature.color} text-white rounded-lg p-1.5`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-green-dark dark:text-white mb-3 group-hover:text-green-primary dark:group-hover:text-green-light transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-medium dark:text-gray-light text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-medium dark:text-gray-light mb-6">
            واكتشف المزيد من المميزات الرائعة
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 text-green-primary dark:text-green-light font-medium hover:underline"
          >
            اطلع على الباقات المتاحة
            <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
