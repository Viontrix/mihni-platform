/**
 * useGuestExport Hook
 * خطاف تصدير الضيف
 * 
 * Manages export functionality with auth gating.
 * Guests see a login modal, authenticated users can export directly.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth/store';
import { ROUTES, getPaymentUrl } from '@/lib/routes';
import { toast } from 'sonner';

export interface GuestExportState {
  isOpen: boolean;
  pendingAction: 'export' | 'save' | null;
  pendingData?: unknown;
}

export interface UseGuestExportReturn {
  // State
  isModalOpen: boolean;
  pendingAction: 'export' | 'save' | null;
  
  // Actions
  checkAuthAndProceed: (action: 'export' | 'save', data?: unknown) => boolean;
  openModal: (action: 'export' | 'save', data?: unknown) => void;
  closeModal: () => void;
  handleLogin: () => void;
  handleRegister: () => void;
  handleContinueAsGuest: () => void;
  handleUpgrade: () => void;
}

/**
 * Hook for managing export with auth gating
 * خطاف لإدارة التصدير مع بوابة المصادقة
 */
export function useGuestExport(): UseGuestExportReturn {
  const navigate = useNavigate();
  
  const [state, setState] = useState<GuestExportState>({
    isOpen: false,
    pendingAction: null,
    pendingData: undefined,
  });

  /**
   * Check if user is authenticated and proceed or show modal
   * يتحقق إذا كان المستخدم مسجل الدخول ويتابع أو يعرض النافذة
   */
  const checkAuthAndProceed = useCallback((action: 'export' | 'save', data?: unknown): boolean => {
    if (isAuthenticated()) {
      // User is authenticated, allow action
      return true;
    }
    
    // User is not authenticated, show modal
    setState({
      isOpen: true,
      pendingAction: action,
      pendingData: data,
    });
    
    return false;
  }, []);

  /**
   * Open the auth modal directly
   * يفتح نافذة المصادقة مباشرة
   */
  const openModal = useCallback((action: 'export' | 'save', data?: unknown) => {
    setState({
      isOpen: true,
      pendingAction: action,
      pendingData: data,
    });
  }, []);

  /**
   * Close the auth modal
   * يغلق نافذة المصادقة
   */
  const closeModal = useCallback(() => {
    setState({
      isOpen: false,
      pendingAction: null,
      pendingData: undefined,
    });
  }, []);

  /**
   * Navigate to login page
   * ينتقل إلى صفحة تسجيل الدخول
   */
  const handleLogin = useCallback(() => {
    closeModal();
    navigate(ROUTES.LOGIN);
  }, [navigate, closeModal]);

  /**
   * Navigate to register page
   * ينتقل إلى صفحة التسجيل
   */
  const handleRegister = useCallback(() => {
    closeModal();
    navigate(ROUTES.REGISTER);
  }, [navigate, closeModal]);

  /**
   * Continue as guest (close modal and show toast)
   * يواصل كضيف (يغلق النافذة ويعرض إشعار)
   */
  const handleContinueAsGuest = useCallback(() => {
    closeModal();
    toast.info('يمكنك متابعة الاستخدام كضيف. سجّل الدخول للحفظ والتصدير بدون علامة مائية.');
  }, [closeModal]);

  /**
   * Navigate to pricing/upgrade page
   * ينتقل إلى صفحة التسعير/الترقية
   */
  const handleUpgrade = useCallback(() => {
    closeModal();
    navigate(getPaymentUrl({ from: 'tools' }));
  }, [navigate, closeModal]);

  return {
    isModalOpen: state.isOpen,
    pendingAction: state.pendingAction,
    checkAuthAndProceed,
    openModal,
    closeModal,
    handleLogin,
    handleRegister,
    handleContinueAsGuest,
    handleUpgrade,
  };
}

export default useGuestExport;
