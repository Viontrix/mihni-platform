import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/sections/Navbar';
import { ROUTES } from '@/lib/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      {/* Unified Navbar */}
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-[80px]" />

      <div className="flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-8"
          >
            <div className="w-40 h-40 mx-auto relative">
              {/* Background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-primary/20 to-green-teal/20 rounded-full" />
              
              {/* Inner circle with icon */}
              <div className="absolute inset-4 bg-gradient-to-br from-green-primary to-green-teal rounded-full flex items-center justify-center shadow-xl">
                <span className="text-6xl font-bold text-white">404</span>
              </div>
              
              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <Search className="w-4 h-4 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-2 -left-2 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-green-dark dark:text-white mb-4"
          >
            الصفحة غير موجودة
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
          >
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            <br />
            يمكنك العودة إلى الصفحة الرئيسية أو استكشاف أدواتنا.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={ROUTES.HOME}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-semibold px-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <Link to={ROUTES.START}>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white rounded-xl font-semibold px-8 transition-all"
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                استكشف الأدوات
              </Button>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 p-6 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10 shadow-sm"
          >
            <h3 className="text-lg font-bold text-green-dark dark:text-white mb-4">
              روابط قد تفيدك
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link 
                to={ROUTES.SUPPORT}
                className="px-4 py-2 text-sm text-green-primary hover:bg-green-primary/10 rounded-xl transition-colors"
              >
                مركز المساعدة
              </Link>
              <Link 
                to={ROUTES.START}
                className="px-4 py-2 text-sm text-green-primary hover:bg-green-primary/10 rounded-xl transition-colors"
              >
                الأدوات الذكية
              </Link>
              <Link 
                to={ROUTES.LOGIN}
                className="px-4 py-2 text-sm text-green-primary hover:bg-green-primary/10 rounded-xl transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
