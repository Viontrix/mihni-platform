/**
 * Tool Card Component
 * بطاقة الأداة
 */

import { 
  BookOpen, 
  HelpCircle, 
  Mail, 
  Target, 
  FileText, 
  ClipboardCheck, 
  Calendar, 
  TrendingUp,
  Lock,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ToolDefinition, UserPlan } from '@/lib/tools/types';
import { canUseTool } from '@/lib/entitlements/check';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  HelpCircle,
  Mail,
  Target,
  FileText,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  BarChart3,
  Zap,
};

const accessColors: Record<string, string> = {
  free: 'bg-green-100 text-green-700 border-green-200',
  pro: 'bg-blue-100 text-blue-700 border-blue-200',
  business: 'bg-purple-100 text-purple-700 border-purple-200',
  enterprise: 'bg-amber-100 text-amber-700 border-amber-200',
};

const accessLabels: Record<string, string> = {
  free: 'مجاني',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

interface ToolCardProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  onClick: () => void;
  compact?: boolean;
}

export function ToolCard({ tool, userPlan, onClick, compact = false }: ToolCardProps) {
  const accessCheck = canUseTool(userPlan, tool);
  const isLocked = !accessCheck.allowed;
  
  const Icon = iconMap[tool.icon] || Zap;

  if (compact) {
    return (
      <Card
        onClick={onClick}
        className={cn(
          'p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
          isLocked && 'opacity-75'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            'bg-gradient-to-br from-green-primary/20 to-green-teal/20'
          )}>
            <Icon className="w-5 h-5 text-green-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
              {isLocked && <Lock className="w-3 h-3 text-gray-400" />}
            </div>
            <p className="text-xs text-gray-500 truncate">{tool.description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative p-6 cursor-pointer transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        'border-2 border-transparent hover:border-green-primary/20',
        isLocked && 'opacity-90'
      )}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {tool.isNew && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <Sparkles className="w-3 h-3 mr-1" />
            جديد
          </Badge>
        )}
        {tool.isPopular && (
          <Badge className="bg-rose-100 text-rose-700 border-rose-200">
            <Zap className="w-3 h-3 mr-1" />
            شائع
          </Badge>
        )}
      </div>

      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
        'bg-gradient-to-br from-green-primary/10 to-green-teal/10',
        'group-hover:from-green-primary/20 group-hover:to-green-teal/20',
        'transition-all duration-300'
      )}>
        <Icon className="w-7 h-7 text-green-primary" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold mb-2 group-hover:text-green-primary transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {tool.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Badge 
          variant="outline" 
          className={cn('text-xs', accessColors[tool.access])}
        >
          {accessLabels[tool.access]}
        </Badge>
        
        {isLocked ? (
          <div className="flex items-center gap-1 text-amber-600 text-sm">
            <Lock className="w-4 h-4" />
            <span>مقفلة</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-green-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>جربها الآن</span>
            <span>←</span>
          </div>
        )}
      </div>

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white shadow-lg rounded-full p-3">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      )}
    </Card>
  );
}
