import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, Award, Users, FileText, TrendingUp } from 'lucide-react';

const testimonials = [
  // Companies
  {
    name: 'عبدالله القحطاني',
    role: 'مدير الموارد البشرية',
    organization: 'شركة التقنية المتقدمة',
    image: '/testimonials/person1.jpg',
    content: 'منصة مِهني ساعدتنا في تبسيط عمليات إصدار الشهادات والتقارير للموظفين. وفرنا أكثر من 50% من الوقت المخصص للمهام الإدارية.',
    rating: 5,
  },
  {
    name: 'نورة السبيعي',
    role: 'مديرة التسويق',
    organization: 'مجموعة الأعمال الوطنية',
    image: '/testimonials/person2.jpg',
    content: 'القوالب الاحترافية والأدوات الذكية في مِهني ساعدتنا في إنشاء محتوى تسويقي متميز بسرعة وكفاءة. أنصح بها لكل شركة.',
    rating: 5,
  },
  // Government
  {
    name: 'محمد الزهراني',
    role: 'مسؤول الشؤون الإدارية',
    organization: 'إدارة حكومية',
    image: '/testimonials/person3.jpg',
    content: 'المنصة تلبي جميع المعايير الرسمية والأنظمة. ساعدتنا في توحيد الهوية البصرية للوثائق الرسمية بشكل احترافي.',
    rating: 5,
  },
  {
    name: 'سارة العتيبي',
    role: 'مشرفة قسم التدريب',
    organization: 'جهة حكومية',
    image: '/testimonials/person4.jpg',
    content: 'استخدمنا مِهني لإصدار شهادات الدورات التدريبية. التصاميم الرسمية والاحترافية نالت إعجاب جميع المتدربين.',
    rating: 5,
  },
  // Individuals
  {
    name: 'فهد الشمري',
    role: 'مستقل',
    organization: 'عميل فردي',
    image: '/testimonials/person5.jpg',
    content: 'كشخص يعمل بشكل مستقل، مِهني وفرت لي أدوات احترافية بأسعار معقولة. أستطيع الآن إنشاء تقارير وشهارات بجودة عالية.',
    rating: 5,
  },
  {
    name: 'لمى الحربي',
    role: 'صاحبة مشروع صغير',
    organization: 'متجر إلكتروني',
    image: '/testimonials/person6.jpg',
    content: 'ساعدتني مِهني في إنشاء شهادات شكر للعملاء وتقارير المبيعات. سهولة الاستخدام والتصاميم الجميلة مذهلة.',
    rating: 5,
  },
];

const stats = [
  { value: '10,000+', label: 'مستخدم نشط', icon: Users },
  { value: '500+', label: 'جهات وأفراد', icon: Award },
  { value: '50,000+', label: 'قالب تم استخدامه', icon: FileText },
  { value: '99%', label: 'معدل الرضا', icon: TrendingUp },
];

export default function Testimonials() {
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <section className="py-28 bg-white dark:bg-[#0D1B1A] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-teal/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6">
            <Quote className="w-4 h-4" />
            آراء عملائنا
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-dark dark:text-white mb-6">
            ماذا يقولون عن
            <span className="text-gradient"> منصة مِهني</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            انضم لآلاف المستخدمين الذين يثقون بمنصة مِهني لإدارة قوالبهم التعليمية
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="relative p-8 bg-cream dark:bg-[#1B2D2B] rounded-3xl border border-green-primary/10 hover:border-green-primary/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-xl h-full">
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-green-primary/10 flex items-center justify-center group-hover:bg-green-primary/20 transition-colors">
                  <Quote className="w-6 h-6 text-green-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-base">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-green-primary/10">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-green-primary/20 group-hover:border-green-primary/40 transition-colors"
                  />
                  <div>
                    <h4 className="font-bold text-green-dark dark:text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} - {testimonial.organization}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-8 bg-cream dark:bg-[#1B2D2B] rounded-3xl border border-green-primary/10 hover:border-green-primary/30 transition-all hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-green-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-green-primary" />
              </div>
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
