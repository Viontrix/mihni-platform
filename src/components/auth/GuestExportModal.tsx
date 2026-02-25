/**
 * Guest Export Modal with OTP Authentication
 * مودال تصدير الضيف مع مصادقة OTP
 * 
 * Unified modal for guest users to either:
 * 1. Login via OTP (phone) to export without watermark
 * 2. Download with watermark as guest
 * 3. Alternative login methods (Google, Apple, Email)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Smartphone,
  Mail,
  ArrowLeft,
  Loader2,
  Check,
  Download,
  Crown,
  Sparkles,
  Eye,
  EyeOff,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verifyOtp, loginWithPhone } from '@/lib/auth/store';

// ============================================
// Types
// ============================================

interface GuestExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAuth: () => void;
  onDownloadWithWatermark?: () => void;
  toolName?: string;
}

type Step = 'main' | 'phone' | 'otp' | 'email' | 'success';

// ============================================
// Component
// ============================================

export function GuestExportModal({
  isOpen,
  onClose,
  onSuccessAuth,
  onDownloadWithWatermark,
  toolName = 'هذه الأداة',
}: GuestExportModalProps) {
  // Step & UI states
  const [step, setStep] = useState<Step>('main');
  const [isLoading, setIsLoading] = useState(false);

  // Phone & OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpResendCountdown, setOtpResendCountdown] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Email login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Countdown for main modal (encourages quick action)
  const [mainCountdown, setMainCountdown] = useState(10);

  // OTP input refs for auto-focus
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ============================================
  // Effects
  // ============================================

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('main');
      setPhoneNumber('');
      setOtpCode('');
      setOtpResendCountdown(60);
      setCanResendOtp(false);
      setEmail('');
      setPassword('');
      setMainCountdown(10);
    }
  }, [isOpen]);

  // Main countdown timer
  useEffect(() => {
    if (isOpen && step === 'main' && mainCountdown > 0) {
      const timer = setTimeout(() => setMainCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step, mainCountdown]);

  // OTP resend countdown
  useEffect(() => {
    if (step === 'otp' && otpResendCountdown > 0) {
      const timer = setTimeout(() => setOtpResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpResendCountdown === 0) {
      setCanResendOtp(true);
    }
  }, [step, otpResendCountdown]);

  // ============================================
  // Handlers
  // ============================================

  const handleSendOtp = async () => {
    // Validate Saudi phone number
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/^0/, '');
    if (!/^5\d{8}$/.test(cleanPhone)) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);

    setStep('otp');
    setOtpResendCountdown(60);
    setCanResendOtp(false);
    setOtpCode('');
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    const result = await verifyOtp(phoneNumber, otpCode);
    setIsLoading(false);

    if (result.success) {
      // Immediately close modal and trigger export
      onSuccessAuth();
      onClose();
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setOtpResendCountdown(60);
    setCanResendOtp(false);
    setOtpCode('');
    // Focus first input
    otpInputRefs.current[0]?.focus();
  };

  const handleEmailLogin = async () => {
    if (email.length < 5 || password.length < 6) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);

    // Mock email login - in production would call API
    const result = loginWithPhone('0500000000'); // Fallback for demo
    if (result.success) {
      setStep('success');
      setTimeout(() => {
        onSuccessAuth();
        onClose();
      }, 1500);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = otpCode.split('');
    newOtp[index] = digit;
    const newOtpString = newOtp.join('');
    setOtpCode(newOtpString);

    // Auto-focus next input
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // ============================================
  // Render Helpers
  // ============================================

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 10 digits (Saudi mobile)
    const limited = digits.slice(0, 10);
    // Format as 5xx xxx xxx
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
  };

  const isValidPhone = () => {
    const clean = phoneNumber.replace(/\s/g, '').replace(/^0/, '');
    return /^5\d{8}$/.test(clean);
  };

  // ============================================
  // Render
  // ============================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-md bg-white dark:bg-[#1B2D2B] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Gradient */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-primary via-green-teal to-green-light" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Content */}
              <div className="p-6 pt-8">
                <AnimatePresence mode="wait">
                  {/* ==================== MAIN STEP ==================== */}
                  {step === 'main' && (
                    <motion.div
                      key="main"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-primary/20 to-green-teal/20 rounded-full flex items-center justify-center mb-4">
                          <Crown className="w-10 h-10 text-green-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                          احصل على تصدير احترافي
                        </h2>
                        <p className="text-gray-500 text-sm">
                          سجّل دخولك للحصول على {toolName} بدون علامة مائية
                        </p>
                      </div>

                      {/* Countdown Badge */}
                      {mainCountdown > 0 && (
                        <div className="flex justify-center">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                            <Timer className="w-4 h-4" />
                            العرض ينتهي خلال {mainCountdown} ثانية
                          </span>
                        </div>
                      )}

                      {/* Login Options */}
                      <div className="space-y-3">
                        {/* Google */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-primary/50 hover:bg-green-primary/5 transition-all"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            متابعة عبر Google
                          </span>
                        </motion.button>

                        {/* Apple */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-primary/50 hover:bg-green-primary/5 transition-all"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                          </svg>
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            متابعة عبر Apple
                          </span>
                        </motion.button>

                        {/* Phone */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep('phone')}
                          className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          <Smartphone className="w-5 h-5" />
                          <span className="font-medium">التسجيل برقم الجوال</span>
                        </motion.button>

                        {/* Email */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep('email')}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-primary/50 hover:bg-green-primary/5 transition-all"
                        >
                          <Mail className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-700 dark:text-gray-200">
                            البريد الإلكتروني
                          </span>
                        </motion.button>
                      </div>

                      {/* Watermark Option - Only show if callback provided */}
                      {onDownloadWithWatermark && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={onDownloadWithWatermark}
                            className="w-full flex items-center justify-center gap-2 p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-sm">تحميل بعلامة مائية</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ==================== PHONE STEP ==================== */}
                  {step === 'phone' && (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Back Button */}
                      <button
                        onClick={() => setStep('main')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">رجوع</span>
                      </button>

                      {/* Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Smartphone className="w-8 h-8 text-green-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-green-dark dark:text-white mb-2">
                          أدخل رقم الجوال
                        </h3>
                        <p className="text-gray-500 text-sm">
                          سوف نرسل لك رمز التحقق
                        </p>
                      </div>

                      {/* Phone Input */}
                      <div className="space-y-4">
                        <div className="relative">
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            +966
                          </span>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                            placeholder="5xx xxx xxx"
                            className="w-full pr-20 pl-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-primary focus:outline-none text-lg text-right"
                            dir="rtl"
                            maxLength={14}
                          />
                        </div>

                        <Button
                          onClick={handleSendOtp}
                          disabled={!isValidPhone() || isLoading}
                          className="w-full py-4 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-bold disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              إرسال رمز التحقق
                              <ArrowLeft className="w-4 h-4 mr-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ==================== OTP STEP ==================== */}
                  {step === 'otp' && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Back Button */}
                      <button
                        onClick={() => {
                          setStep('phone');
                          setOtpCode('');
                        }}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">رجوع</span>
                      </button>

                      {/* Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Sparkles className="w-8 h-8 text-green-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-green-dark dark:text-white mb-2">
                          أدخل رمز التحقق
                        </h3>
                        <p className="text-gray-500 text-sm">
                          تم إرسال الرمز إلى +966 {phoneNumber}
                        </p>
                      </div>

                      {/* 6-digit OTP Input */}
                      <div className="flex gap-1.5 sm:gap-2 justify-center">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <input
                            key={i}
                            ref={(el) => { otpInputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpCode[i] || ''}
                            onChange={(e) => handleOtpInput(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="w-10 h-12 sm:w-11 sm:h-14 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-primary focus:outline-none text-center text-xl sm:text-2xl font-bold transition-colors"
                            dir="ltr"
                          />
                        ))}
                      </div>

                      {/* Countdown & Resend */}
                      <div className="text-center">
                        {!canResendOtp ? (
                          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                            <Timer className="w-4 h-4" />
                            إعادة الإرسال بعد{' '}
                            <span className="font-bold text-green-primary">
                              {Math.floor(otpResendCountdown / 60).toString().padStart(1, '0')}:
                              {(otpResendCountdown % 60).toString().padStart(2, '0')}
                            </span>
                          </p>
                        ) : (
                          <button
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 text-sm text-green-primary hover:text-green-600 font-medium mx-auto"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            إعادة إرسال الرمز
                          </button>
                        )}
                      </div>

                      {/* Verify Button */}
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={otpCode.length !== 6 || isLoading}
                        className="w-full py-4 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-bold disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            تأكيد
                            <Check className="w-4 h-4 mr-2" />
                          </>
                        )}
                      </Button>

                      {/* Hint */}
                      <p className="text-center text-xs text-gray-400">
                        رمز التجربة: 123456
                      </p>
                    </motion.div>
                  )}

                  {/* ==================== EMAIL STEP ==================== */}
                  {step === 'email' && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Back Button */}
                      <button
                        onClick={() => setStep('main')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">رجوع</span>
                      </button>

                      {/* Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Mail className="w-8 h-8 text-green-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-green-dark dark:text-white mb-2">
                          تسجيل الدخول بالبريد
                        </h3>
                        <p className="text-gray-500 text-sm">
                          أدخل بريدك الإلكتروني وكلمة المرور
                        </p>
                      </div>

                      {/* Email & Password */}
                      <div className="space-y-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="بريدك@example.com"
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-primary focus:outline-none text-lg text-right"
                          dir="rtl"
                        />

                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="كلمة المرور"
                            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-primary focus:outline-none text-lg text-right"
                            dir="rtl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>

                        <Button
                          onClick={handleEmailLogin}
                          disabled={email.length < 5 || password.length < 6 || isLoading}
                          className="w-full py-4 bg-gradient-to-r from-green-primary to-green-teal text-white rounded-xl font-bold disabled:opacity-50"
                        >
                          {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              تسجيل الدخول
                              <ArrowLeft className="w-4 h-4 mr-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* ==================== SUCCESS STEP ==================== */}
                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6"
                      >
                        <Check className="w-12 h-12 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-green-dark dark:text-white mb-2">
                        تم تسجيل الدخول بنجاح!
                      </h3>
                      <p className="text-gray-500">
                        جاري تحضير التصدير بدون علامة مائية...
                      </p>

                      <motion.div
                        className="mt-6 flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Loader2 className="w-8 h-8 text-green-primary animate-spin" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GuestExportModal;
