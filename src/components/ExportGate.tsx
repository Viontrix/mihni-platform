/**
 * ExportGate Component
 * بوابة التصدير الموحدة
 * 
 * Unified export gate that wraps around export buttons.
 * - If user is authenticated: executes export directly
 * - If guest: shows GuestExportModal with OTP flow
 * 
 * Use this component in ALL tools that have export functionality.
 */

'use client';

import { useState } from 'react';
import { isAuthenticated } from '@/lib/auth/store';
import { GuestExportModal } from '@/components/auth/GuestExportModal';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// ============================================
// Types
// ============================================

interface ExportGateProps {
  /** Button content (can be ReactNode or string) */
  children?: React.ReactNode;
  /** Called when user is authenticated or after successful OTP login */
  onExport: () => void;
  /** Called when guest chooses to download with watermark */
  onDownloadWithWatermark?: () => void;
  /** Tool name shown in modal (legacy: projectName) */
  toolName?: string;
  /** Legacy prop - alias for toolName */
  projectName?: string;
  /** Legacy prop - label for the button if children not provided */
  exportLabel?: string;
  /** Legacy prop - button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  /** Legacy prop - button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Legacy prop - additional classes */
  className?: string;
  /** Legacy prop - whether to show watermark option */
  showWatermarkOption?: boolean;
}

// ============================================
// Component
// ============================================

/**
 * ExportGate - Unified export button wrapper
 * 
 * @example
 * ```tsx
 * // Modern usage:
 * <ExportGate
 *   onExport={() => exportWithoutWatermark()}
 *   onDownloadWithWatermark={() => exportWithWatermark()}
 *   toolName="منشئ الجداول"
 * >
 *   <Button>تصدير</Button>
 * </ExportGate>
 * 
 * // Legacy usage (still supported):
 * <ExportGate 
 *   onExport={printSchedule}
 *   onDownloadWithWatermark={printSchedule}
 *   exportLabel="طباعة"
 *   variant="outline"
 *   size="sm"
 *   projectName="الجدول"
 * >
 *   <Printer className="w-4 h-4 ml-1" />
 *   طباعة
 * </ExportGate>
 * ```
 */
export default function ExportGate({
  children,
  onExport,
  onDownloadWithWatermark,
  toolName,
  projectName,
  exportLabel = 'تحميل PDF',
  variant = 'default',
  size = 'sm',
  className = '',
  showWatermarkOption = true,
}: ExportGateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use projectName as fallback for toolName (backward compatibility)
  const displayToolName = toolName || projectName || 'هذه الأداة';

  const handleClick = () => {
    if (isAuthenticated()) {
      // User is authenticated, export directly
      onExport();
    } else {
      // User is guest, show auth modal
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessAuth = () => {
    setIsModalOpen(false);
    // Execute export after successful auth
    onExport();
  };

  const handleWatermarkDownload = () => {
    setIsModalOpen(false);
    // Execute watermark export if provided
    onDownloadWithWatermark?.();
  };

  // Render button content
  const renderButton = () => {
    // If children is provided, use it directly
    if (children) {
      return (
        <div onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
          {children}
        </div>
      );
    }

    // Otherwise, render a default Button
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={className}
      >
        <Download className="w-4 h-4 ml-1" />
        {exportLabel}
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      <GuestExportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccessAuth={handleSuccessAuth}
        onDownloadWithWatermark={showWatermarkOption ? handleWatermarkDownload : undefined}
        toolName={displayToolName}
      />
    </>
  );
}

// Re-export for convenience
export { GuestExportModal } from '@/components/auth/GuestExportModal';
