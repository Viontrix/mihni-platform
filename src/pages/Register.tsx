import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Eye, EyeOff, Mail, Lock, User, Building, ArrowLeft, Check } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const plans = [
  { name: 'مجانية', price: '0', features: ['10 قوالب', '3 أدوات', '50 MB تخزين'] },
  { name: 'محترف', price: '69', features: ['50+ قالب', 'جميع الأدوات', '5 GB تخزين'] },
  { name: 'أعمال', price: '169', features: ['100+ قالب', '5 مستخدمين', '20 GB تخزين'] },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    organization: '',
    agreeTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // إنشاء الحساب و الانتقال للدفع أو لوحة التحكم
      const selectedPlanData = plans[selectedPlan];
      if (selectedPlanData.price === '0') {
        // الباقة المجانية - الانتقال مباشرة للوحة التحكم
        navigate('/dashboard');
      } else {
        // باقة مدفوعة - الانتقال لصفحة الدفع مع تمرير الباقة المختارة
        navigate('/payment', { state: { plan: selectedPlanData, planIndex: selectedPlan } });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero dark:bg-gradient-dark-hero relative overflow-hidden py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-grid opacity-50" />
      
      {/* Floating Shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-green-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-green-teal/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-lg px-4">
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

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl border border-green-primary/10 p-8"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-green-primary' : 'text-gray-medium'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-green-primary text-white' : 'bg-gray-light text-gray-medium'
              }`}>
                1
              </div>
              <span className="text-sm hidden sm:inline">البيانات</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-light">
              <div className={`h-full bg-green-primary transition-all duration-300 ${step >= 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-green-primary' : 'text-gray-medium'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-green-primary text-white' : 'bg-gray-light text-gray-medium'
              }`}>
                2
              </div>
              <span className="text-sm hidden sm:inline">الباقة</span>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                  إنشاء حساب جديد
                </h1>
                <p className="text-gray-medium dark:text-gray-light text-sm">
                  ابدأ رحلتك مع مِهني في دقائق
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-green-dark dark:text-white">
                    الاسم الكامل
                  </Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="محمد أحمد"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pr-10 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                      required
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pr-10 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
                      required
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-green-dark dark:text-white">
                    المؤسسة (اختياري)
                  </Label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-medium" />
                    <Input
                      id="organization"
                      type="text"
                      placeholder="اسم المدرسة أو المؤسسة"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="pr-10 h-12 bg-cream dark:bg-[#152B26] border-green-primary/20 focus:border-green-primary"
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    className="mt-1 border-green-primary/30 data-[state=checked]:bg-green-primary data-[state=checked]:border-green-primary"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-medium cursor-pointer leading-relaxed">
                    أوافق على{' '}
                    <a href="#" className="text-green-primary hover:underline">شروط الاستخدام</a>
                    {' '}و{' '}
                    <a href="#" className="text-green-primary hover:underline">سياسة الخصوصية</a>
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl shadow-btn hover:shadow-card-hover transition-all hover:-translate-y-0.5"
                >
                  متابعة
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                  اختر باقتك
                </h1>
                <p className="text-gray-medium dark:text-gray-light text-sm">
                  يمكنك تغيير الباقة لاحقاً من إعدادات الحساب
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  {plans.map((plan, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedPlan(index)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === index
                          ? 'border-green-primary bg-green-primary/5'
                          : 'border-green-primary/10 hover:border-green-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === index ? 'border-green-primary' : 'border-gray-medium'
                          }`}>
                            {selectedPlan === index && <Check className="w-4 h-4 text-green-primary" />}
                          </div>
                          <div>
                            <p className="font-bold text-green-dark dark:text-white">{plan.name}</p>
                            <p className="text-xs text-gray-medium">{plan.features.join(' • ')}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-green-primary">{plan.price}</p>
                          <p className="text-xs text-gray-medium">ريال/شهر</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 border-green-primary text-green-primary hover:bg-green-primary/10"
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl shadow-btn hover:shadow-card-hover transition-all hover:-translate-y-0.5"
                  >
                    إنشاء الحساب
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-medium">
            لديك حساب بالفعل؟{' '}
            <Link to={ROUTES.LOGIN} className="text-green-primary hover:underline font-medium">
              تسجيل الدخول
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
