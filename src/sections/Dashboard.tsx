import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeft, 
  Sparkles,
  FolderOpen,
  BarChart3,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

const features = [
  { icon: FolderOpen, text: 'إدارة جميع ملفاتك' },
  { icon: BarChart3, text: 'تقارير وإحصائيات' },
  { icon: Zap, text: 'وصول سريع للأدوات' },
];

export default function DashboardCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      ref={ref}
      className="py-20 lg:py-24 bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B] relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-primary/5 rounded-full blur-[120px]" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-green-primary to-green-teal rounded-3xl p-8 lg:p-12 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-8 left-8 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <FolderOpen className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </motion.div>

          <div className="relative z-10 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              لوحة تحكم متكاملة
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
            >
              لوحة تحكمك
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-lg max-w-xl mx-auto mb-8"
            >
              تابع جميع مشاريعك وإحصائياتك في مكان واحد. أدواتك، ملفاتك، تقاريرك - كلها بين يديك.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm"
                >
                  <feature.icon className="w-4 h-4" />
                  {feature.text}
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to={ROUTES.DASHBOARD}>
                <Button 
                  size="lg"
                  className="bg-white text-green-primary hover:bg-white/90 px-8 py-6 text-lg rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all group"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  اذهب للوحة التحكم
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
