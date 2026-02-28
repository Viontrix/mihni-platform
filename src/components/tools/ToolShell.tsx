/**
 * Tool Shell Component
 * هيكل الأداة - التخطيط الرئيسي لصفحات الأدوات
 */

import { ArrowRight, Save, History, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ToolDefinition, UserPlan } from '@/lib/tools/types';
import { UsageMeter, UsageBadge } from './UsageMeter';
import { ToolLockedOverlay } from './ToolLockedOverlay';
import { canUseTool } from '@/lib/entitlements/check';
import { getTodayRunCount } from '@/lib/usage/store';
import { trackToolOpened } from '@/lib/analytics/track';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ToolShellProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  children: React.ReactNode;
  onUpgrade: () => void;
  onSave?: () => void;
  onShowHistory?: () => void;
  showHistory?: boolean;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
  backFallback?: string;
}

export function ToolShell({
  tool,
  userPlan,
  children,
  onUpgrade,
  onSave,
  onShowHistory,
  showHistory = true,
  className,
  breadcrumbs,
  backFallback = '/',
}: ToolShellProps) {
  const navigate = useNavigate();
  const [todayRuns, setTodayRuns] = useState(0);
  
  useEffect(() => {
    setTodayRuns(getTodayRunCount());
    trackToolOpened(tool.id, tool.name, userPlan);
  }, [tool.id, tool.name, userPlan]);

  const accessCheck = canUseTool(userPlan, tool);
  const isLocked = !accessCheck.allowed;

  const accessLabels: Record<string, string> = {
    free: 'مجاني',
    pro: 'Pro',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const accessColors: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    pro: 'bg-blue-100 text-blue-700',
    business: 'bg-purple-100 text-purple-700',
    enterprise: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className={cn('min-h-screen bg-gray-50/50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbBar items={breadcrumbs ?? [{ label: 'الرئيسية', to: '/' }]} backFallback={backFallback} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BreadcrumbBar items={breadcrumbs ?? [{ label: 'الرئيسية', to: '/' }]} backFallback={backFallback} />
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-primary/10 to-green-teal/10 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-green-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
                  <Badge className={accessColors[tool.access]}>
                    {accessLabels[tool.access]}
                  </Badge>
                </div>
                <p className="text-gray-600">{tool.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Back / Home */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="hidden sm:flex"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                رجوع
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  الرئيسية
                </Link>
              </Button>
              {showHistory && onShowHistory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowHistory}
                  className="hidden sm:flex"
                >
                  <History className="w-4 h-4 mr-2" />
                  السجل
                </Button>
              )}
              {onSave && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  className="hidden sm:flex"
                >
                  <Save className="w-4 h-4 mr-2" />
                  حفظ
                </Button>
              )}
              
              {/* Usage Badge */}
              <UsageBadge used={todayRuns} plan={userPlan} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <Card className="relative p-6">
              {isLocked && (
                <ToolLockedOverlay
                  tool={tool}
                  userPlan={userPlan}
                  onUpgrade={onUpgrade}
                />
              )}
              {children}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Card */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-primary" />
                استخدامك اليوم
              </h3>
              <UsageMeter used={todayRuns} plan={userPlan} />
            </Card>

            {/* Tips Card */}
            <Card className="p-5">
              <h3 className="font-semibold mb-3">نصائح للاستخدام</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-0.5">•</span>
                  أدخل معلومات دقيقة للحصول على نتائج أفضل
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-0.5">•</span>
                  يمكنك حفظ النتائج في مشاريع للوصول إليها لاحقاً
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-primary mt-0.5">•</span>
                  استخدم زر التصدير لمشاركة النتائج
                </li>
              </ul>
            </Card>

            {/* Upgrade CTA (for free users) */}
            {userPlan === 'free' && (
              <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">
                  احصل على المزيد من الأدوات!
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  ترقية إلى Pro تفتح لك 5 أدوات متقدمة مع 100 تشغيل يومياً
                </p>
                <Button
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  الترقية الآن
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
