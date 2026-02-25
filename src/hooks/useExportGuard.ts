/**
 * useExportGuard Hook
 * خطاف حماية التصدير الموحد
 * 
 * Unified export guard that:
 * 1. Checks if user is authenticated
 * 2. If authenticated: executes export directly
 * 3. If guest: shows GuestExportModal with OTP flow
 * 
 * Use this hook in ALL tools that have export/download/print functionality.
 */

import { useState, useCallback } from 'react';
import { isAuthenticated } from '@/lib/auth/store';

export interface ExportGuardCallbacks {
  /** Called when user is authenticated and ready to export */
  onExport: () => void;
  /** Called when guest chooses to download with watermark */
  onWatermark?: () => void;
}

export interface UseExportGuardReturn {
  /** Whether the auth modal is open */
  isModalOpen: boolean;
  /** Open the modal manually (if needed) */
  openModal: () => void;
  /** Close the modal */
  closeModal: () => void;
  /** 
   * Request export - this is the main function to use
   * Checks auth and either exports directly or shows modal
   */
  requestExport: (callbacks: ExportGuardCallbacks) => void;
  /** Called when OTP login succeeds */
  handleAuthSuccess: () => void;
  /** Called when guest chooses watermark download */
  handleWatermarkDownload: () => void;
}

/**
 * Hook for unified export guarding across all tools
 * خطاف موحد لحماية التصدير في جميع الأدوات
 * 
 * @example
 * ```tsx
 * const { requestExport, isModalOpen, closeModal, handleAuthSuccess, handleWatermarkDownload } = useExportGuard();
 * 
 * // In your export button:
 * <button onClick={() => requestExport({ 
 *   onExport: () => exportWithoutWatermark(),
 *   onWatermark: () => exportWithWatermark() 
 * })}>
 *   تصدير
 * </button>
 * 
 * // Render the modal:
 * <GuestExportModal
 *   isOpen={isModalOpen}
 *   onClose={closeModal}
 *   onSuccessAuth={handleAuthSuccess}
 *   onDownloadWithWatermark={handleWatermarkDownload}
 *   toolName="منشئ الجداول"
 * />
 * ```
 */
export function useExportGuard(): UseExportGuardReturn {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCallbacks, setPendingCallbacks] = useState<ExportGuardCallbacks | null>(null);

  /**
   * Request export - checks auth and proceeds accordingly
   * يطلب التصدير - يتحقق من المصادقة ويتابع accordingly
   */
  const requestExport = useCallback((callbacks: ExportGuardCallbacks) => {
    // Store callbacks for later use
    setPendingCallbacks(callbacks);

    if (isAuthenticated()) {
      // User is authenticated, export directly
      callbacks.onExport();
    } else {
      // User is guest, show auth modal
      setIsModalOpen(true);
    }
  }, []);

  /**
   * Open modal manually
   * يفتح النافذة يدوياً
   */
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Close modal
   * يغلق النافذة
   */
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  /**
   * Handle successful authentication via OTP
   * يتعامل مع نجاح المصادقة عبر OTP
   */
  const handleAuthSuccess = useCallback(() => {
    setIsModalOpen(false);
    // Execute the pending export
    pendingCallbacks?.onExport();
  }, [pendingCallbacks]);

  /**
   * Handle watermark download choice
   * يتعامل مع اختيار التحميل بالعلامة المائية
   */
  const handleWatermarkDownload = useCallback(() => {
    setIsModalOpen(false);
    // Execute watermark export if provided
    pendingCallbacks?.onWatermark?.();
  }, [pendingCallbacks]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    requestExport,
    handleAuthSuccess,
    handleWatermarkDownload,
  };
}

export default useExportGuard;
