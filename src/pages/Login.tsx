import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // محاكاة تسجيل الدخول - الانتقال للوحة التحكم
    console.log({ email, password, rememberMe });
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-dark-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      
      {/* Floating Shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-green-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-green-teal/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-primary to-green-teal flex items-center justify-center shadow-btn">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-dark dark:text-white">مِهني</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl border border-green-primary/10 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-gray-medium dark:text-gray-light text-sm">
              أدخل بياناتك للوصول إلى قوالبك وأدواتك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-dark dark:text-white">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-dark dark:text-white">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-12 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-green-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-green-primary/30 data-[state=checked]:bg-green-primary data-[state=checked]:border-green-primary"
                />
                <Label htmlFor="remember" className="text-sm text-gray-medium cursor-pointer">
                  تذكرني
                </Label>
              </div>
              <a href="#" className="text-sm text-green-primary hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl shadow-btn hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
              تسجيل الدخول
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-[#1B2D2B] text-gray-medium text-sm">أو</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-[#152B26] border border-green-primary/20 rounded-xl hover:bg-cream dark:hover:bg-[#0D1B1A] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-green-dark dark:text-white">الدخول بحساب Google</span>
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-medium">
            ليس لديك حساب؟{' '}
            <Link to={ROUTES.REGISTER} className="text-green-primary hover:underline font-medium">
              سجل الآن
            </Link>
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-6"
        >
          <Link to="/" className="text-gray-medium hover:text-green-primary transition-colors text-sm">
            العودة للصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
