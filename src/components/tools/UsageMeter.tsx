/**
 * Usage Meter Component
 * عداد الاستخدام
 */

import { cn } from '@/lib/utils';
import type { UserPlan } from '@/lib/tools/types';
import { getPlanById } from '@/lib/entitlements/plans';
import { Infinity, AlertCircle } from 'lucide-react';

interface UsageMeterProps {
  used: number;
  plan: UserPlan;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UsageMeter({ 
  used, 
  plan, 
  showLabel = true, 
  size = 'md',
  className 
}: UsageMeterProps) {
  const planDetails = getPlanById(plan);
  const limit = planDetails?.maxRunsPerDay || 10;
  
  // Unlimited plan
  if (limit === -1) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Infinity className="w-4 h-4 text-green-primary" />
        <span className="text-sm text-gray-600">غير محدود</span>
      </div>
    );
  }

  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, (used / limit) * 100);
  
  // Color based on usage
  const getColorClass = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-green-primary';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  const sizeClasses = {
    sm: { height: 'h-1.5', text: 'text-xs' },
    md: { height: 'h-2', text: 'text-sm' },
    lg: { height: 'h-3', text: 'text-base' },
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className={cn('font-medium', sizeClasses[size].text, getTextColor())}>
            {used} / {limit}
          </span>
          <span className={cn('text-gray-500', sizeClasses[size].text)}>
            {remaining === 0 ? (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                انتهى الاستخدام
              </span>
            ) : (
              `${remaining} متبقي`
            )}
          </span>
        </div>
      )}
      
      <div className={cn('relative rounded-full overflow-hidden bg-gray-100', sizeClasses[size].height)}>
        <div
          className={cn(
            'absolute top-0 right-0 h-full transition-all duration-500 rounded-full',
            getColorClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {percentage >= 90 && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          أوشكت على الوصول للحد الأقصى. فكر في الترقية.
        </p>
      )}
    </div>
  );
}

// ============================================
// Compact Usage Badge
// ============================================

interface UsageBadgeProps {
  used: number;
  plan: UserPlan;
  className?: string;
}

export function UsageBadge({ used, plan, className }: UsageBadgeProps) {
  const planDetails = getPlanById(plan);
  const limit = planDetails?.maxRunsPerDay || 10;
  
  if (limit === -1) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full', className)}>
        <Infinity className="w-3 h-3" />
        غير محدود
      </span>
    );
  }

  const percentage = (used / limit) * 100;
  
  const badgeClass = 
    percentage >= 90 ? 'bg-red-50 text-red-600' :
    percentage >= 70 ? 'bg-amber-50 text-amber-600' :
    'bg-green-50 text-green-600';

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full', badgeClass, className)}>
      {used}/{limit}
    </span>
  );
}
