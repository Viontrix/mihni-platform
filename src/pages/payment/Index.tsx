import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Shield, 
  Lock,
  Crown,
  Building2,
  School,
  User,
  CheckCircle2,
  Calendar,
  Percent,
  Wallet,
  Cloud,
  HardDrive,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { unifiedPlans, storageAddons, getYearlySavings } from '@/lib/entitlements/plans';
import type { UnifiedPlan } from '@/lib/entitlements/plans';
import Navbar from '@/sections/Navbar';
import { PageBackBar } from '@/components/navigation/PageBackBar';
import { ROUTES, getHomeSectionUrl, getBackDestination } from '@/lib/routes';

// Payment method logo component
const PaymentLogo = ({ src, alt }: { src: string; alt: string }) => (
  <img 
    src={src} 
    alt={alt} 
    className="w-full h-full object-contain"
    style={{ maxHeight: '100%', maxWidth: '100%' }}
  />
);

// Payment methods configuration
const paymentMethods = [
  {
    id: 'mada',
    name: 'مدى',
    description: 'الدفع عبر بطاقات مدى',
    logoSrc: '/payment-logos/mada-logo.svg',
    color: 'bg-white',
    popular: true,
    type: 'card',
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    description: 'الدفع السريع عبر Apple Pay',
    logoSrc: '/payment-logos/Pay-logo.svg',
    color: 'bg-white',
    popular: false,
    type: 'card',
  },
  {
    id: 'visa',
    name: 'Visa / Mastercard',
    description: 'الدفع عبر البطاقات الائتمانية',
    logoSrc: '/payment-logos/VISA-logo.svg',
    color: 'bg-white',
    popular: false,
    type: 'card',
  },
  {
    id: 'tabby',
    name: 'تابي',
    description: 'قسطها على 4 دفعات بدون رسوم',
    logoSrc: '/payment-logos/tabby-logo.svg',
    color: 'bg-white',
    popular: true,
    type: 'installment',
    maxInstallments: 4,
  },
  {
    id: 'tamara',
    name: 'تمارا',
    description: 'قسطها على 6 دفعات بدون رسوم',
    logoSrc: '/payment-logos/tamara-logo.svg',
    color: 'bg-white',
    popular: false,
    type: 'installment',
    maxInstallments: 6,
  },
];

// Plan icons mapping
const planIcons: Record<string, React.ElementType> = {
  free: User,
  pro: Crown,
  business: School,
  enterprise: Building2,
};

export default function PaymentPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const planParam = searchParams.get('plan');
  const billingParam = searchParams.get('billing');
  const addonParam = searchParams.get('addon');
  const fromParam = searchParams.get('from');
  
  // Determine initial mode: plan subscription or storage addon
  const isStorageAddonMode = addonParam === 'storage';
  
  // Determine back button destination based on source using centralized helper
  const backDestination = getBackDestination(fromParam);
  
  // Get initial plan from URL or default to pro
  const getInitialPlan = (): UnifiedPlan => {
    if (planParam) {
      const foundPlan = unifiedPlans.find(p => p.id === planParam.toLowerCase());
      if (foundPlan) return foundPlan;
    }
    return unifiedPlans.find(p => p.id === 'pro') || unifiedPlans[1];
  };
  
  const [selectedPlan, setSelectedPlan] = useState<UnifiedPlan>(getInitialPlan());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(billingParam === 'monthly' ? 'monthly' : 'yearly');
  const [selectedPayment, setSelectedPayment] = useState<string>('mada');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [installmentMonths, setInstallmentMonths] = useState<number>(4);
  const [showInstallmentOptions, setShowInstallmentOptions] = useState(false);
  
  // Storage addon state
  const [selectedStorageAddon, setSelectedStorageAddon] = useState<string | null>(null);
  const [showStorageAddons, setShowStorageAddons] = useState(isStorageAddonMode);

  // Update plan when URL changes
  useEffect(() => {
    if (planParam) {
      const foundPlan = unifiedPlans.find(p => p.id === planParam.toLowerCase());
      if (foundPlan) {
        setSelectedPlan(foundPlan);
      }
    }
    if (billingParam) {
      setBillingCycle(billingParam === 'monthly' ? 'monthly' : 'yearly');
    }
    if (addonParam === 'storage') {
      setShowStorageAddons(true);
    }
  }, [planParam, billingParam, addonParam]);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessDialog(true);
    }, 2000);
  };

  // Calculate prices
  const planPrice = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;
  
  // Storage addon price
  const storageAddon = selectedStorageAddon 
    ? storageAddons.find(a => a.id === selectedStorageAddon)
    : null;
  const storageAddonPrice = storageAddon
    ? (billingCycle === 'monthly' ? storageAddon.monthlyPrice : storageAddon.yearlyPrice)
    : 0;
  
  // Total amount
  const totalAmount = planPrice + storageAddonPrice;
  
  // Installment calculation
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedPayment);
  const isInstallment = selectedPaymentMethod?.type === 'installment';
  const installmentAmount = isInstallment && installmentMonths > 0 
    ? Math.round(totalAmount / installmentMonths) 
    : totalAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAF9] to-white dark:from-[#0D1B1A] dark:to-[#1B2D2B]">
      {/* Unified Navbar */}
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-[80px]" />

      <PageBackBar className="pt-4" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-green-dark dark:text-white mb-3">
            {isStorageAddonMode ? 'زيادة سعة التخزين' : 'إتمام عملية الدفع'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isStorageAddonMode 
              ? 'اختر سعة التخزين الإضافية المناسبة لاحتياجاتك'
              : 'اختر الباقة المناسبة وطريقة الدفع المفضلة'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Plan Selection & Storage Addons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Billing Cycle Toggle */}
            {!isStorageAddonMode && (
              <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-2 border border-green-primary/10">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-green-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      شهري
                    </div>
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-green-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Percent className="w-4 h-4" />
                      سنوي
                      <Badge className="bg-white/20 text-white text-xs">وفّر 30%</Badge>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Plans List - Only show if not in storage addon mode */}
            {!isStorageAddonMode && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-green-dark dark:text-white mb-4">اختر الباقة</h3>
                {unifiedPlans.filter(p => p.id !== 'free').map((plan) => {
                  const Icon = planIcons[plan.id];
                  const isSelected = selectedPlan.id === plan.id;
                  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                  const savings = getYearlySavings(plan.id);
                  
                  return (
                    <motion.button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full p-5 rounded-2xl border-2 transition-all text-right ${
                        isSelected
                          ? 'border-green-primary bg-green-primary/5 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B] hover:border-green-primary/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-dark dark:text-white">{plan.nameAr}</h4>
                            <p className="text-sm text-gray-500">{plan.description}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-green-dark dark:text-white">
                            {price} <span className="text-sm font-normal">ريال/شهر</span>
                          </div>
                          {billingCycle === 'yearly' && savings.percentage > 0 && (
                            <div className="text-xs text-green-primary">
                              وفّر {savings.percentage}%
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-green-primary/20"
                        >
                          <ul className="space-y-2">
                            {plan.features.included.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Check className="w-4 h-4 text-green-primary" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Storage Add-ons Section */}
            <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10 overflow-hidden">
              <button
                onClick={() => setShowStorageAddons(!showStorageAddons)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-green-dark dark:text-white">زيادة سعة التخزين</h3>
                    <p className="text-sm text-gray-500">أضف مساحة إضافية لاحتياجاتك</p>
                  </div>
                </div>
                {showStorageAddons ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {showStorageAddons && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-gray-100 dark:border-gray-800 p-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {storageAddons.map((addon) => {
                      const isSelected = selectedStorageAddon === addon.id;
                      const price = billingCycle === 'monthly' ? addon.monthlyPrice : addon.yearlyPrice;
                      
                      return (
                        <motion.button
                          key={addon.id}
                          onClick={() => setSelectedStorageAddon(isSelected ? null : addon.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                        >
                          <Cloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <div className="font-bold text-green-dark dark:text-white">{addon.label}</div>
                          <div className="text-lg font-bold text-blue-500">{price} ريال</div>
                          <div className="text-xs text-gray-500">{billingCycle === 'monthly' ? '/شهر' : '/سنة'}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-6 p-4 bg-white dark:bg-[#1B2D2B] rounded-2xl border border-green-primary/10">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock className="w-5 h-5 text-green-primary" />
                <span>دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-5 h-5 text-green-primary" />
                <span>حماية البيانات</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-green-primary" />
                <span>تفعيل فوري</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Payment Methods & Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Order Summary */}
            <div className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 border border-green-primary/10">
              <h3 className="text-lg font-bold text-green-dark dark:text-white mb-4">ملخص الطلب</h3>
              <div className="space-y-3 mb-4">
                {!isStorageAddonMode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">الباقة</span>
                    <span className="font-medium">{selectedPlan.nameAr}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">الفترة</span>
                  <span className="font-medium">{billingCycle === 'monthly' ? 'شهري' : 'سنوي (12 شهر)'}</span>
                </div>
                {!isStorageAddonMode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">سعر الباقة</span>
                    <span className="font-medium">{planPrice} ريال/شهر</span>
                  </div>
                )}
                {selectedStorageAddon && storageAddon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{storageAddon.label}</span>
                    <span className="font-medium">{storageAddonPrice} ريال/شهر</span>
                  </div>
                )}
                {isInstallment && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">عدد الدفعات</span>
                    <span className="font-medium">{installmentMonths} دفعات</span>
                  </div>
                )}
              </div>
              <div className="border-t border-green-primary/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-dark dark:text-white">الإجمالي</span>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-green-primary">
                      {totalAmount} ريال
                    </div>
                    {isInstallment && (
                      <div className="text-sm text-green-primary">
                        {installmentAmount} ريال × {installmentMonths} دفعة
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      {billingCycle === 'yearly' ? 'للسنة' : 'شهرياً'} (شامل الضريبة)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-bold text-green-dark dark:text-white mb-4">اختر طريقة الدفع</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id);
                      if (method.type === 'installment') {
                        setShowInstallmentOptions(true);
                      } else {
                        setShowInstallmentOptions(false);
                      }
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-right ${
                      selectedPayment === method.id
                        ? 'border-green-primary bg-green-primary/5'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1B2D2B] hover:border-green-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-28 h-14 ${method.color} rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-200 p-2`}>
                          <PaymentLogo src={method.logoSrc} alt={method.name} />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-dark dark:text-white flex items-center gap-2">
                            {method.name}
                            {method.popular && (
                              <Badge className="bg-green-primary text-white text-xs">الأكثر استخداماً</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id
                          ? 'border-green-primary bg-green-primary'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Installment Options */}
            {showInstallmentOptions && selectedPaymentMethod?.type === 'installment' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-5 border border-green-primary/10"
              >
                <h4 className="font-bold text-green-dark dark:text-white mb-3 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-primary" />
                  اختر عدد الدفعات
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: selectedPaymentMethod.maxInstallments || 3 }, (_, i) => i + 1).map((months) => (
                    <button
                      key={months}
                      onClick={() => setInstallmentMonths(months)}
                      className={`py-3 px-2 rounded-xl font-medium transition-all ${
                        installmentMonths === months
                          ? 'bg-green-primary text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-green-primary/10'
                      }`}
                    >
                      <div className="text-lg font-bold">{months}</div>
                      <div className="text-xs">شهر</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-primary/5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">قيمة كل دفعة:</span>
                    <span className="text-lg font-bold text-green-primary">
                      {Math.round(totalAmount / installmentMonths)} ريال
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Pay Button */}
            <motion.button
              onClick={handlePayment}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري معالجة الدفع...
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  {isInstallment 
                    ? `ادفع ${installmentAmount} ريال × ${installmentMonths} دفعة`
                    : `ادفع ${totalAmount} ريال`
                  }
                </>
              )}
            </motion.button>

            <p className="text-center text-sm text-gray-500">
              بالضغط على زر الدفع، أنت توافق على{' '}
              <a href="#" className="text-green-primary hover:underline">شروط الاستخدام</a>
              {' '}و{' '}
              <a href="#" className="text-green-primary hover:underline">سياسة الخصوصية</a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-primary" />
            </motion.div>
            <h3 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
              تم الدفع بنجاح!
            </h3>
            <p className="text-gray-500 mb-6">
              {isStorageAddonMode 
                ? 'تمت إضافة سعة التخزين بنجاح. يمكنك الآن حفظ المزيد من المشاريع.'
                : `تم تفعيل باقة ${selectedPlan.nameAr} بنجاح. يمكنك الآن الاستفادة من جميع المميزات.`
              }
            </p>
            <div className="flex gap-3">
              <Link to={ROUTES.DASHBOARD} className="flex-1">
                <Button className="w-full bg-green-primary text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  الذهاب للوحة التحكم
                </Button>
              </Link>
              <Link to={getHomeSectionUrl('templates')} className="flex-1">
                <Button variant="outline" className="w-full border-green-primary text-green-primary">
                  استكشف القوالب
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
