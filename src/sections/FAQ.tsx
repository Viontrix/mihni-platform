import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'ما هي منصة مِهني؟',
    answer: 'مِهني هي منصة رقمية متكاملة تقدم قوالب جاهزة وأدوات تنفيذية احترافية للأفراد والشركات والجهات الحكومية. توفر المنصة إمكانية التخصيص الكامل، بالإضافة إلى لوحة تحكم ذكية وتقارير تحليلية متقدمة.',
  },
  {
    question: 'هل يمكنني تجربة المنصة قبل الاشتراك؟',
    answer: 'نعم! نقدم باقة مجانية تتيح لك تجربة المنصة والوصول لـ 10 قوالب واستخدام 3 أدوات مجانية. هذه الباقة مثالية للتعرف على الميزات الأساسية قبل الاشتراك في الباقات المدفوعة.',
  },
  {
    question: 'ما الفرق بين الباقات المتاحة؟',
    answer: 'الباقة المجانية: للتجربة الشخصية المحدودة. الباقة المحترف: للأفراد والمستقلين مع 50+ قالب وجميع الأدوات. باقة الأعمال: للشركات والمؤسسات مع 100+ قالب و5 مستخدمين. باقة المؤسسات: للشركات الكبيرة والجهات مع تكامل API كامل ودعم 24/7.',
  },
  {
    question: 'هل يمكن تغيير الباقة بعد الاشتراك؟',
    answer: 'نعم، يمكنك الترقية أو التنزيل بين الباقات في أي وقت. ستبقى مميزات الباقة الحالية نشطة حتى نهاية فترة الاشتراك الحالية.',
  },
  {
    question: 'كيف يتم حماية بياناتي؟',
    answer: 'نستخدم أعلى معايير الأمان لحماية البيانات. جميع البيانات مشفرة أثناء النقل والتخزين باستخدام تقنيات تشفير متقدمة، ونلتزم بمعايير حماية البيانات الشخصية. لا نشارك البيانات مع أي طرف ثالث أبداً.',
  },
  {
    question: 'هل يمكن تخصيص القوالب بشعار مؤسستي؟',
    answer: 'نعم! تتيح لك الباقة المحترفة والأعمال تخصيص القوالب بشعار مؤسستك وألوانها الهوية البصرية. يمكن أيضاً إضافة حقول مخصصة وتعديل التصميم حسب احتياجاتك.',
  },
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل الدفع عبر البطاقات الائتمانية (Visa, MasterCard)، مدى، Apple Pay، Google Pay، تابي، تمارا، والتحويل البنكي للباقات السنوية. جميع المدفوعات آمنة وموثقة.',
  },
  {
    question: 'هل يوجد دعم فني متاح؟',
    answer: 'نعم، نوفر دعم فني عبر الدردشة المباشرة والبريد الإلكتروني. للباقة المحترفة: دعم عبر البريد. للأعمال: دعم أولوية. للمؤسسات: دعم فني 24/7 مع مدير حساب مخصص.',
  },
  {
    question: 'هل يمكن تصدير البيانات؟',
    answer: 'نعم، يمكن تصدير البيانات بصيغ متعددة تشمل PDF و Word و Excel و JPG حسب الباقة المشترك بها. تتيح لك الباقة المحترفة والأعلى تصدير التقارير التحليلية أيضاً.',
  },
  {
    question: 'كيف يمكنني إلغاء الاشتراك؟',
    answer: 'يمكنك إلغاء الاشتراك في أي وقت من لوحة التحكم. عند الإلغاء، ستبقى مميزات الباقة نشطة حتى نهاية فترة الاشتراك المدفوعة. لا يوجد التزام طويل المدى ويمكنك إلغاء الاشتراك متى شئت.',
  },
  {
    question: 'هل المنصة مناسبة للشركات والجهات الحكومية؟',
    answer: 'نعم، المنصة مصممة لتلبية احتياجات جميع الفئات. نقدم باقات خاصة للشركات والجهات الحكومية تشمل مميزات متقدمة مثل تكامل API، مستخدمين متعددين، ودعم فني مخصص.',
  },
  {
    question: 'هل يمكن استخدام المنصة من قبل فريق عمل؟',
    answer: 'نعم، باقة الأعمال والمؤسسات تتيح استخدام المنصة من قبل فريق عمل متكامل. يمكن إضافة مستخدمين متعددين مع تحديد صلاحيات لكل مستخدم.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 bg-gradient-to-b from-white to-cream dark:from-[#0D1B1A] dark:to-[#1B2D2B] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-primary/10 text-green-primary dark:text-green-light text-sm font-semibold mb-6">
            <HelpCircle className="w-4 h-4" />
            الأسئلة الشائعة
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-green-dark dark:text-white mb-6">
            كل ما تريد معرفته عن
            <span className="text-gradient"> مِهني</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل مع فريق الدعم الفني
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white dark:bg-[#1B2D2B] rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? 'border-green-primary/30 shadow-lg'
                  : 'border-green-primary/10 hover:border-green-primary/20'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-right"
              >
                <span className={`font-bold text-lg ${
                  openIndex === index ? 'text-green-primary' : 'text-green-dark dark:text-white'
                }`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-green-primary transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pr-12">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-green-primary/10 to-green-teal/10 rounded-3xl border border-green-primary/20">
            <div className="w-16 h-16 rounded-2xl bg-green-primary flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="text-center sm:text-right">
              <h3 className="text-xl font-bold text-green-dark dark:text-white mb-2">
                لم تجد إجابة لسؤالك؟
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                فريق الدعم الفني جاهز لمساعدتك في أي وقت
              </p>
            </div>
            <a href="/support">
              <Button className="bg-green-primary hover:bg-green-teal text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                تواصل مع الدعم
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
