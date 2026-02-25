/**
 * Individual Tool Page
 * صفحة الأداة الفردية
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToolBySlug } from '@/lib/tools/registry';
import { ToolShell, ToolRunnerClient } from '@/components/tools';
import { getCurrentPlan } from '@/lib/billing/subscription';
import { toast } from 'sonner';
import type { UserPlan } from '@/lib/tools/types';
import { ROUTES, getHomeSectionUrl } from '@/lib/routes';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderToolForm(toolId: string, form: { control: any }) {
  switch (toolId) {
    case 'lesson-plan-generator':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المادة الدراسية</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الرياضيات" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الصف الدراسي</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الثالث المتوسط" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموضوع</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: المعادلات الخطية" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدة (دقيقة)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={180} {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="objectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الأهداف (اختياري)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="أدخل الأهداف، كل هدف في سطر" 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case 'quiz-generator':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المادة</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: العلوم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الصف</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الخامس الابتدائي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموضوع</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: دورة الماء" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="questionCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الأسئلة</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={20} {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المستوى</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">سهل</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="hard">صعب</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 'email-formatter':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المستلم</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: إدارة المدرسة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الموضوع</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: طلب إجازة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الغرض</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="request">طلب</SelectItem>
                    <SelectItem value="announcement">إعلان</SelectItem>
                    <SelectItem value="invitation">دعوة</SelectItem>
                    <SelectItem value="complaint">شكوى</SelectItem>
                    <SelectItem value="thanks">شكر</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التفاصيل</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="اكتب تفاصيل رسالتك هنا..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case 'kpi-converter':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الهدف</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: تحسين أداء الطلاب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفترة الزمنية</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="quarterly">ربع سنوي</SelectItem>
                    <SelectItem value="yearly">سنوي</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>القسم (اختياري)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: قسم الرياضيات" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case 'text-summarizer':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>النص</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="الصق النص الذي تريد تلخيصه هنا..."
                    className="min-h-[200px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="summaryLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>طول الملخص</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">قصير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="long">مفصل</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اللغة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">الإنجليزية</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );

    case 'rubric-generator':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المهمة</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مشروع البحث العلمي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taskType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نوع المهمة</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="presentation">عرض تقديمي</SelectItem>
                    <SelectItem value="essay">مقال</SelectItem>
                    <SelectItem value="project">مشروع</SelectItem>
                    <SelectItem value="participation">مشاركة</SelectItem>
                    <SelectItem value="homework">واجب</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="levels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عدد المستويات</FormLabel>
                <FormControl>
                  <Input type="number" min={3} max={5} {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case 'weekly-teacher-plan':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="teacherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المعلم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الصف</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الأول المتوسط" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weekStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>بداية الأسبوع</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="focusAreas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>مجالات التركيز (اختياري)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="ما هي مجالات التركيز لهذا الأسبوع؟"
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    case 'monthly-achievement-report':
      return (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="teacherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم المعلم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسمك" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشهر</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: يناير 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المادة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: الرياضيات" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الصف</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الثالث المتوسط" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="achievements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الإنجازات</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="اذكر أهم إنجازاتك هذا الشهر..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="challenges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التحديات (اختياري)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="ما التحديات التي واجهتك؟"
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );

    default:
      return <p>نموذج غير متوفر</p>;
  }
}

export default function ToolPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState<UserPlan>('free');

  useEffect(() => {
    setUserPlan(getCurrentPlan());
  }, []);

  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">الأداة غير موجودة</h1>
          <p className="text-gray-600 mb-4">الأداة التي تبحث عنها غير متوفرة</p>
          <Button onClick={() => navigate(ROUTES.START)}>العودة للأدوات</Button>
        </div>
      </div>
    );
  }

  const handleUpgrade = () => {
    navigate(getHomeSectionUrl('pricing'));
  };

  const handleSave = () => {
    toast.info('سيتم حفظ المشروع قريباً');
  };

  const handleShowHistory = () => {
    navigate('/account?tab=history');
  };

  return (
    <ToolShell
      tool={tool}
      userPlan={userPlan}
      onUpgrade={handleUpgrade}
      onSave={handleSave}
      onShowHistory={handleShowHistory}
    >
      <ToolRunnerClient
        tool={tool}
        userPlan={userPlan}
        renderForm={(form) => renderToolForm(tool.id, form)}
      />
    </ToolShell>
  );
}
