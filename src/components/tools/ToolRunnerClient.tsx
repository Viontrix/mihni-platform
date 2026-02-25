/**
 * Tool Runner Client Component
 * عميل تشغيل الأداة - يتعامل مع النموذج والتشغيل
 * 
 * Uses API Layer only - no direct tool.run calls
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Play, Download, Copy, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { ToolDefinition, ToolResult } from '@/lib/tools/types';
import { api } from '@/lib/api';
import { PLAN_LIMITS } from '@/lib/entitlements';
import { getRunsToday } from '@/lib/api/storage';
import { UsageMeter } from './UsageMeter';
import { toast } from 'sonner';

type UserPlan = 'free' | 'pro' | 'business' | 'enterprise';

interface ToolRunnerClientProps {
  tool: ToolDefinition;
  userPlan: UserPlan;
  renderForm: (form: ReturnType<typeof useForm>) => React.ReactNode;
  className?: string;
}

export function ToolRunnerClient({
  tool,
  userPlan,
  renderForm,
  className,
}: ToolRunnerClientProps) {
  const [result, setResult] = useState<ToolResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const form = useForm({
    defaultValues: tool.defaultValues,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    // Check plan limits using entitlements
    const todayRuns = getRunsToday();
    const planLimits = PLAN_LIMITS[userPlan];
    
    if (todayRuns >= planLimits.maxRunsPerDay) {
      toast.error(`لقد وصلت للحد اليومي (${planLimits.maxRunsPerDay} تشغيل). فكر في الترقية.`);
      return;
    }

    setIsRunning(true);

    try {
      // Use API layer only - no direct tool.run
      const response = await api.runTool({
        slug: tool.slug,
        input: data,
      });

      if (response.success && response.result) {
        setResult(response.result);
        setActiveTab('output');
        
        // Track success via API
        await api.trackEvent({
          event: 'tool_run_success',
          payload: { 
            slug: tool.slug, 
            toolName: tool.name,
            plan: userPlan,
            executionTime: response.executionTimeMs,
          },
        });

        // Save project via API
        await api.saveProject({
          type: 'tool',
          slug: tool.slug,
          title: response.result.title,
          input: data,
          result: response.result,
        });
        
        toast.success('تم إنشاء النتيجة بنجاح!');
      } else {
        // Track error via API
        await api.trackEvent({
          event: 'tool_run_error',
          payload: { 
            slug: tool.slug, 
            error: response.error,
          },
        });
        toast.error(response.error || 'حدث خطأ أثناء تشغيل الأداة');
      }
    } catch (error) {
      console.error('Tool execution error:', error);
      
      // Track error via API
      await api.trackEvent({
        event: 'tool_run_error',
        payload: { 
          slug: tool.slug, 
          error: String(error),
        },
      });
      
      toast.error('حدث خطأ أثناء تشغيل الأداة. حاول مرة أخرى.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      toast.success('تم النسخ إلى الحافظة');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async (format: 'txt' | 'json') => {
    if (!result) return;

    try {
      // Use API for export
      const response = await api.exportResult({
        format,
        type: 'tool',
        slug: tool.slug,
        result,
        title: result.title,
      });

      if (response.success) {
        // Also do local export for immediate download
        let content = '';
        let filename = '';
        let mimeType = '';

        if (format === 'txt') {
          content = result.output;
          filename = `${result.title.replace(/\s+/g, '_')}.txt`;
          mimeType = 'text/plain';
        } else if (format === 'json') {
          content = JSON.stringify({
            title: result.title,
            output: result.output,
            meta: result.meta,
            timestamp: result.timestamp,
            tool: tool.name,
          }, null, 2);
          filename = `${result.title.replace(/\s+/g, '_')}.json`;
          mimeType = 'application/json';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(response.message || `تم التصدير بصيغة ${format.toUpperCase()}`);
      } else {
        toast.error(response.error || 'فشل التصدير');
      }
    } catch (error) {
      toast.error('حدث خطأ في التصدير');
    }
  };

  const handleReset = () => {
    form.reset(tool.defaultValues);
    setResult(null);
    setActiveTab('input');
  };

  const todayRuns = getRunsToday();

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">الإدخال</TabsTrigger>
          <TabsTrigger value="output" disabled={!result}>النتيجة</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderForm(form)}

              {/* Usage Warning */}
              <UsageMeter used={todayRuns} plan={userPlan} className="pt-4" />

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-green-primary hover:bg-green-dark"
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري التشغيل...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      تشغيل الأداة
                    </>
                  )}
                </Button>

                {result && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    جديد
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="output">
          {result && (
            <div className="space-y-4">
              {/* Result Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{result.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    نسخ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('txt')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    TXT
                  </Button>
                  {userPlan !== 'free' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('json')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      JSON
                    </Button>
                  )}
                </div>
              </div>

              {/* Result Content */}
              <Card className="p-6 bg-gray-50">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
                  {result.output}
                </pre>
              </Card>

              {/* Meta Info */}
              {result.meta && Object.keys(result.meta).length > 0 && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">معلومات إضافية:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Object.entries(result.meta).map(([key, value]) => (
                      <span
                        key={key}
                        className="bg-gray-100 px-2 py-1 rounded text-xs"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setActiveTab('input')}
                className="w-full"
              >
                العودة للإدخال
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
