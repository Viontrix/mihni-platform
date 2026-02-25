/**
 * Tool Locked Overlay Component
 * طبقة الأداة المقفلة
 */

import { Lock, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ToolDefinition, UserPlan } from '@/lib/tools/types';
import { getToolLockInfo } from '@/lib/entitlements/check';
import { trackUpgradeClicked } from '@/lib/analytics/track';

interface ToolLockedOverlayProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  onUpgrade: () => void;
  className?: string;
}

export function ToolLockedOverlay({ 
  tool, 
  userPlan, 
  onUpgrade, 
  className 
}: ToolLockedOverlayProps) {
  const lockInfo = getToolLockInfo(tool, userPlan);

  const handleUpgrade = () => {
    trackUpgradeClicked(userPlan, 'pro', 'tool_locked_overlay');
    onUpgrade();
  };

  return (
    <div className={cn(
      'absolute inset-0 z-10 flex items-center justify-center p-6',
      'bg-white/95 backdrop-blur-sm rounded-lg',
      className
    )}>
      <Card className="max-w-md w-full p-8 text-center shadow-xl border-2 border-amber-100">
        {/* Lock Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Lock className="w-10 h-10 text-amber-600" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          {lockInfo.title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {lockInfo.message}
        </p>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            مميزات خطة {lockInfo.requiredPlan}:
          </p>
          <ul className="space-y-2">
            {lockInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-primary flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade Button */}
        <Button
          onClick={handleUpgrade}
          size="lg"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {lockInfo.upgradeButtonText}
        </Button>

        {/* Current Plan */}
        <p className="text-xs text-gray-500 mt-4">
          خطتك الحالية: <span className="font-medium">{userPlan === 'free' ? 'المجانية' : userPlan}</span>
        </p>
      </Card>
    </div>
  );
}

// ============================================
// Inline Lock Message (for forms)
// ============================================

interface InlineLockMessageProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  onUpgrade: () => void;
}

export function InlineLockMessage({ tool, userPlan, onUpgrade }: InlineLockMessageProps) {
  const lockInfo = getToolLockInfo(tool, userPlan);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Lock className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 mb-1">
            أداة {tool.name} متوفرة في خطة {lockInfo.requiredPlan}
          </h4>
          <p className="text-sm text-amber-700 mb-3">
            {lockInfo.message}
          </p>
          <Button
            onClick={onUpgrade}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {lockInfo.upgradeButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
