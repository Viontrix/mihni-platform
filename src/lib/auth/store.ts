/**
 * Mock Authentication Store
 * مخزن المصادقة المحاكي
 * 
 * A localStorage-based mock auth system for demonstration.
 * In production, this would be replaced with a real auth provider (Supabase, Firebase, etc.)
 */

import { toast } from 'sonner';

// ============================================
// Types
// ============================================

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  authMethod?: 'email' | 'phone' | 'google' | 'apple';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// Storage Keys
// ============================================

const STORAGE_KEYS = {
  USER: 'mahni_auth_user',
  SESSION: 'mahni_auth_session',
  LAST_LOGIN: 'mahni_auth_last_login',
};

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// ============================================
// Auth Functions
// ============================================

/**
 * Get current authenticated user
 * يحصل على المستخدم الحالي المسجل
 */
export function getCurrentUser(): User | null {
  return getStorageItem<User | null>(STORAGE_KEYS.USER, null);
}

/**
 * Check if user is authenticated
 * يتحقق إذا كان المستخدم مسجل الدخول
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  const session = getStorageItem<{ expiresAt: number } | null>(STORAGE_KEYS.SESSION, null);
  
  if (!user || !session) return false;
  
  // Check session expiration (24 hours)
  if (Date.now() > session.expiresAt) {
    logout();
    return false;
  }
  
  return true;
}

/**
 * Register a new user
 * تسجيل مستخدم جديد
 */
export function register(email: string, password: string, name: string): { success: boolean; error?: string } {
  // Check if user already exists
  const existingUsers = getStorageItem<Array<{ email: string }>>('mahni_users', []);
  
  if (existingUsers.some(u => u.email === email)) {
    return { success: false, error: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  
  // Create new user
  const newUser: User = {
    id: generateId(),
    email,
    name,
    avatar: name.charAt(0).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  
  // Save to users list (with password - in real app, this would be hashed)
  const updatedUsers = [...existingUsers, { ...newUser, password }];
  setStorageItem('mahni_users', updatedUsers);
  
  // Auto login after registration
  setStorageItem(STORAGE_KEYS.USER, newUser);
  setStorageItem(STORAGE_KEYS.SESSION, {
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  setStorageItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
  
  toast.success('تم إنشاء الحساب بنجاح!');
  return { success: true };
}

/**
 * Login user
 * تسجيل دخول المستخدم
 */
export function login(email: string, password: string): { success: boolean; error?: string } {
  const users = getStorageItem<Array<{ email: string; password: string } & User>>('mahni_users', []);
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
  
  // Create session
  const { password: _, ...userWithoutPassword } = user;
  setStorageItem(STORAGE_KEYS.USER, userWithoutPassword);
  setStorageItem(STORAGE_KEYS.SESSION, {
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  setStorageItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
  
  toast.success(`مرحباً بك، ${user.name}!`);
  return { success: true };
}

/**
 * Logout user
 * تسجيل خروج المستخدم
 */
export function logout(): void {
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.SESSION);
  toast.info('تم تسجيل الخروج');
}

/**
 * Update user profile
 * تحديث بيانات المستخدم
 */
export function updateProfile(updates: Partial<User>): { success: boolean; error?: string } {
  const user = getCurrentUser();
  
  if (!user) {
    return { success: false, error: 'المستخدم غير مسجل الدخول' };
  }
  
  const updatedUser = { ...user, ...updates };
  setStorageItem(STORAGE_KEYS.USER, updatedUser);
  
  // Update in users list too
  const users = getStorageItem<Array<User>>('mahni_users', []);
  const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updates } : u);
  setStorageItem('mahni_users', updatedUsers);
  
  toast.success('تم تحديث البيانات بنجاح');
  return { success: true };
}

/**
 * Change password
 * تغيير كلمة المرور
 */
export function changePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const user = getCurrentUser();
  
  if (!user) {
    return { success: false, error: 'المستخدم غير مسجل الدخول' };
  }
  
  const users = getStorageItem<Array<{ id: string; password: string }>>('mahni_users', []);
  const userRecord = users.find(u => u.id === user.id);
  
  if (!userRecord || userRecord.password !== currentPassword) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }
  
  // Update password
  const updatedUsers = users.map(u => 
    u.id === user.id ? { ...u, password: newPassword } : u
  );
  setStorageItem('mahni_users', updatedUsers);
  
  toast.success('تم تغيير كلمة المرور بنجاح');
  return { success: true };
}

/**
 * Request password reset (mock)
 * طلب إعادة تعيين كلمة المرور (محاكاة)
 */
export function requestPasswordReset(email: string): { success: boolean; message: string } {
  const users = getStorageItem<Array<{ email: string }>>('mahni_users', []);
  
  if (!users.some(u => u.email === email)) {
    // Don't reveal if email exists or not for security
    return { 
      success: true, 
      message: 'إذا كان البريد مسجلاً، ستصلك رسالة بإعادة التعيين' 
    };
  }
  
  // In real app, send email here
  return { 
    success: true, 
    message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني' 
  };
}

/**
 * Delete account
 * حذف الحساب
 */
export function deleteAccount(password: string): { success: boolean; error?: string } {
  const user = getCurrentUser();
  
  if (!user) {
    return { success: false, error: 'المستخدم غير مسجل الدخول' };
  }
  
  const users = getStorageItem<Array<{ id: string; password: string }>>('mahni_users', []);
  const userRecord = users.find(u => u.id === user.id);
  
  if (!userRecord || userRecord.password !== password) {
    return { success: false, error: 'كلمة المرور غير صحيحة' };
  }
  
  // Remove user
  const updatedUsers = users.filter(u => u.id !== user.id);
  setStorageItem('mahni_users', updatedUsers);
  
  // Clear session
  logout();
  
  toast.success('تم حذف الحساب بنجاح');
  return { success: true };
}

// ============================================
// Demo/Development Helpers
// ============================================

/**
 * Login with phone number (OTP)
 * تسجيل الدخول برقم الجوال
 */
export function loginWithPhone(phone: string): { success: boolean; error?: string } {
  // Validate phone number format (Saudi)
  const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '');
  if (!/^5\d{8}$/.test(cleanPhone)) {
    return { success: false, error: 'رقم الجوال غير صحيح' };
  }
  
  const fullPhone = '+966' + cleanPhone;
  
  // Check if user exists with this phone
  const users = getStorageItem<Array<User & { phone?: string }>>('mahni_users', []);
  let user = users.find(u => u.phone === fullPhone);
  
  // Create new user if not exists
  if (!user) {
    user = {
      id: generateId(),
      phone: fullPhone,
      name: 'مستخدم مِهني',
      avatar: 'م',
      createdAt: new Date().toISOString(),
      authMethod: 'phone',
    };
    users.push(user as User & { phone?: string });
    setStorageItem('mahni_users', users);
  }
  
  // Create session
  const { phone: _, ...userWithoutPhone } = user;
  setStorageItem(STORAGE_KEYS.USER, userWithoutPhone);
  setStorageItem(STORAGE_KEYS.SESSION, {
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  });
  setStorageItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
  
  toast.success('تم تسجيل الدخول بنجاح!');
  return { success: true };
}

/**
 * Verify OTP (mock)
 * التحقق من رمز OTP (محاكاة)
 * 
 * NOTE: This is a mock implementation that accepts ANY 6-digit code.
 * In production, this would validate against a real OTP service.
 */
export function verifyOtp(phone: string, otp: string): { success: boolean; error?: string } {
  // Mock OTP verification - accepts any 6 digits for demo
  if (!/^\d{6}$/.test(otp)) {
    return { success: false, error: 'يجب إدخال 6 أرقام' };
  }
  
  return loginWithPhone(phone);
}

/**
 * Create a demo user for testing
 * إنشاء مستخدم تجريبي للاختبار
 */
export function createDemoUser(): void {
  const demoUser: User = {
    id: 'demo-user-001',
    email: 'demo@mahni.sa',
    name: 'أحمد محمد',
    avatar: 'أ',
    createdAt: new Date().toISOString(),
  };
  
  setStorageItem(STORAGE_KEYS.USER, demoUser);
  setStorageItem(STORAGE_KEYS.SESSION, {
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  
  // Also save to users list
  const users = getStorageItem<Array<User & { password: string }>>('mahni_users', []);
  if (!users.some(u => u.email === demoUser.email)) {
    users.push({ ...demoUser, password: 'demo123' });
    setStorageItem('mahni_users', users);
  }
}

/**
 * Clear all auth data
 * مسح جميع بيانات المصادقة
 */
export function clearAuthData(): void {
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.SESSION);
  removeStorageItem(STORAGE_KEYS.LAST_LOGIN);
  removeStorageItem('mahni_users');
}
