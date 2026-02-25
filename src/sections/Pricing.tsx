import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Crown, 
  Building2, 
  School, 
  User, 
  Zap, 
  ArrowLeft,
  Users,
  Shield,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Cloud,
  Palette,
  Image,
  X,
  BarChart3,
  FileText
} from 'lucide-react';
import { unifiedPlans, featureComparison, getYearlySavings } from '@/lib/entitlements/plans';
import { ROUTES, getPaymentUrl, type PlanId } from '@/lib/routes';

// Plan Card Animation Components - Exact v50 Style for Free Plan
const FreePlanVisual = () => (
  <div className="relative w-full h-28 flex items-center justify-center">
    {/* Stacked Cards Container with subtle float animation */}
    <motion.div 
      className="relative"
      animate={{ 
        y: [0, -4, 0],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }}
    >
      {/* Back card (3rd layer) - most transparent/blurred */}
      <motion.div
        className="absolute w-[52px] h-[68px] rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30 shadow-sm"
        style={{
          top: -12,
          right: -16,
          transform: 'rotate(8deg)',
          zIndex: 1,
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      />
      
      {/* Middle card (2nd layer) - medium transparency */}
      <motion.div
        className="absolute w-[52px] h-[68px] rounded-xl bg-white/60 dark:bg-white/20 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/40 shadow-sm"
        style={{
          top: -6,
          right: -8,
          transform: 'rotate(4deg)',
          zIndex: 2,
        }}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      />
      
      {/* Front card (1st layer) - slight transparency */}
      <motion.div
        className="absolute w-[52px] h-[68px] rounded-xl bg-white/80 dark:bg-white/30 backdrop-blur-sm border border-gray-200/70 dark:border-gray-600/50 shadow-sm"
        style={{
          top: 0,
          right: 0,
          zIndex: 3,
        }}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      />
      
      {/* Main card with "10" and "قوالب" */}
      <motion.div
        className="relative w-[52px] h-[68px] rounded-xl bg-white dark:bg-[#1B2D2B]/80 border border-gray-200 dark:border-gray-700 shadow-md flex flex-col items-center justify-center z-10"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
      >
        <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">10</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">قوالب</span>
      </motion.div>
    </motion.div>
  </div>
);

const ProPlanVisual = () => (
  <div className="relative w-full h-28 flex items-center justify-center">
    <motion.div 
      className="relative"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
        <Crown className="w-8 h-8 text-white" />
      </div>
      {[Palette, Image, Cloud].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          style={{
            top: i === 0 ? '-10px' : i === 1 ? '50%' : 'auto',
            right: i === 0 ? '-10px' : i === 1 ? '-20px' : 'auto',
            bottom: i === 2 ? '-10px' : 'auto',
            left: i === 2 ? '-10px' : 'auto',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        >
          <Icon className="w-4 h-4 text-green-600" />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const BusinessPlanVisual = () => (
  <div className="relative w-full h-28 flex items-center justify-center">
    <motion.div className="relative">
      <motion.div 
        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Cloud className="w-7 h-7 text-white" />
      </motion.div>
      {[Users, BarChart3, FileText, Shield].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
          style={{ top: '50%', left: '50%' }}
          animate={{ 
            x: Math.cos((i * 90 * Math.PI) / 180) * 35 - 12,
            y: Math.sin((i * 90 * Math.PI) / 180) * 35 - 12,
          }}
        >
          <Icon className="w-3 h-3 text-blue-500" />
        </motion.div>
      ))}
    </motion.div>
  </div>
);

const EnterprisePlanVisual = () => (
  <div className="relative w-full h-28 flex items-center justify-center">
    <div className="grid grid-cols-3 gap-1.5">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            i === 4 
              ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
              : 'bg-amber-100 dark:bg-amber-900/20'
          }`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, type: 'spring' }}
        >
          {i === 4 ? (
            <Building2 className="w-4 h-4 text-white" />
          ) : (
            <Users className="w-3 h-3 text-amber-400" />
          )}
        </motion.div>
      ))}
    </div>
    <motion.div 
      className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      ∞
    </motion.div>
  </div>
);

// Map plan icons to visual components
const planVisuals: Record<string, React.FC> = {
  free: FreePlanVisual,
  pro: ProPlanVisual,
  business: BusinessPlanVisual,
  enterprise: EnterprisePlanVisual,
};

// Map plan icons to lucide icons
const planIcons: Record<string, React.ElementType> = {
  free: User,
  pro: Crown,
  business: School,
  enterprise: Building2,
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  const visibleFeatures = showAllFeatures ? featureComparison : featureComparison.slice(0, 6);

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
    <section id="pricing" className="py-24 bg-gradient-to-b from-white via-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:via-[#152B26] dark:to-[#0D1B1A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-teal/5 rounded-full blur-[80px]" />

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
            <Crown className="w-4 h-4" />
            خطط الاشتراك
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-green-dark dark:text-white mb-4">
            اختر خطتك المناسبة
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            باقات مرنة تناسب جميع الاحتياجات، من الاستخدام الشخصي إلى المؤسسات الكبيرة
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-white dark:bg-[#1B2D2B] rounded-xl shadow-lg border border-green-primary/10">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isYearly
                  ? 'bg-gradient-to-r from-green-primary to-green-teal text-white shadow-md'
                  : 'text-gray-500 hover:text-green-primary'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                isYearly
                  ? 'bg-gradient-to-r from-green-primary to-green-teal text-white shadow-md'
                  : 'text-gray-500 hover:text-green-primary'
              }`}
            >
              سنوي
              {isYearly && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  وفّر 30%
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards - Reading from unifiedPlans */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {unifiedPlans.map((plan) => {
            const VisualComponent = planVisuals[plan.id];
            const Icon = planIcons[plan.id];
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const savings = getYearlySavings(plan.id);
            
            return (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      الأكثر شيوعاً
                    </span>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ y: -8 }}
                  className={`h-full flex flex-col rounded-2xl transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-b from-white via-white to-green-primary/5 dark:from-[#1B2D2B] dark:via-[#1B2D2B] dark:to-green-primary/10 border-2 border-green-primary shadow-xl'
                      : 'bg-white dark:bg-[#1B2D2B] border border-gray-100 dark:border-gray-800 hover:border-green-primary/30 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Visual Preview */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <VisualComponent />
                  </div>

                  {/* Plan Header */}
                  <div className="p-5 text-center">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-dark dark:text-white mb-1">
                      {plan.nameAr}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="px-5 pb-5 text-center border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-baseline justify-center gap-1">
                      {price === 0 ? (
                        <span className="text-3xl font-bold text-green-dark dark:text-white">مجاني</span>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-green-dark dark:text-white">
                            {price}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">ريال/شهر</span>
                        </>
                      )}
                    </div>
                    {price > 0 && isYearly && savings.percentage > 0 && (
                      <p className="text-xs text-green-primary mt-1 font-medium">
                        وفّر {savings.percentage}% سنوياً
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 px-5 py-4 space-y-2">
                    <ul className="space-y-2">
                      {plan.features.included.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-green-primary" />
                          </div>
                          <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.features.notIncluded.length > 0 && (
                      <>
                        <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
                        <ul className="space-y-1.5">
                          {plan.features.notIncluded.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <X className="w-3 h-3 text-gray-400" />
                              </div>
                              <span className="text-xs text-gray-400 line-through">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <div className="p-5 pt-0">
                    <Link to={
                      plan.id === 'free' 
                        ? ROUTES.START
                        : getPaymentUrl({ plan: plan.id as PlanId, billing: isYearly ? 'yearly' : 'monthly', from: 'pricing' })
                    }>
                      <Button
                        className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                          plan.popular || plan.id === 'enterprise'
                            ? 'bg-gradient-to-r from-green-primary to-green-teal text-white shadow-lg hover:shadow-xl'
                            : plan.id === 'free'
                            ? 'border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white'
                            : 'bg-green-primary text-white hover:bg-green-teal shadow-md'
                        }`}
                        variant={plan.id === 'free' ? 'outline' : 'default'}
                      >
                        {plan.id === 'free' ? 'ابدأ مجاناً' : 'اشترك الآن'}
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold text-center mb-6 text-green-dark dark:text-white">مقارنة تفصيلية للمميزات</h3>
          <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-primary/10 to-green-teal/10 border-b border-green-primary/20">
                    <th className="text-right p-4 font-bold text-green-dark dark:text-white text-sm">الميزة</th>
                    <th className="text-center p-4 font-bold text-gray-500 text-sm">مجاني</th>
                    <th className="text-center p-4 font-bold text-green-primary text-sm">محترف</th>
                    <th className="text-center p-4 font-bold text-blue-500 text-sm">أعمال</th>
                    <th className="text-center p-4 font-bold text-amber-500 text-sm">مؤسسات</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFeatures.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-green-primary/5 transition-colors">
                      <td className="p-4 text-xs font-medium text-gray-700 dark:text-gray-300">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check className="w-4 h-4 text-green-primary mx-auto" /> : <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-xs text-gray-600 dark:text-gray-400">{row.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-green-primary/5">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <Check className="w-4 h-4 text-green-primary mx-auto" /> : <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.business === 'boolean' ? (
                          row.business ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-xs text-blue-600 font-medium">{row.business}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <Check className="w-4 h-4 text-amber-500 mx-auto" /> : <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Show More/Less Button */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-green-primary hover:text-green-dark font-medium transition-colors text-sm"
              >
                {showAllFeatures ? (
                  <>
                    إخفاء المميزات
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    عرض جميع المميزات
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'دفع آمن 100%', desc: 'حماية كاملة للبيانات', color: 'from-green-500 to-emerald-500' },
              { icon: Clock, title: 'تفعيل فوري', desc: 'ابدأ الاستخدام مباشرة', color: 'from-blue-500 to-cyan-500' },
              { icon: TrendingUp, title: 'دعم فني متواصل', desc: 'على مدار الساعة', color: 'from-amber-500 to-orange-500' },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 bg-white dark:bg-[#1B2D2B] rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                  <badge.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-dark dark:text-white text-sm">{badge.title}</p>
                  <p className="text-xs text-gray-500">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-6 text-center">
            جميع الأسعار بالريال السعودي (SAR) وتشمل الضريبة المضافة
          </p>
        </motion.div>
      </div>
    </section>
  );
}
