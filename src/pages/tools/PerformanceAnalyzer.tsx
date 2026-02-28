"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GeneratorTypeSelector, 
  useGeneratorType
} from "@/components/tools/GeneratorTypeSelector"
import ExportGate from "@/components/ExportGate"
import { ROUTES } from "@/lib/routes"
import { 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download, 
  Users,
  Target,
  Award,
  FileText,
  Printer
} from "lucide-react"

interface StudentData {
  id: string
  name: string
  scores: number[]
  attendance: number
  participation: number
  behavior: number
  avg?: number
}

interface AnalysisResult {
  average: number
  highest: number
  lowest: number
  passRate: number
  topStudents: StudentData[]
  strugglingStudents: StudentData[]
  trend: "up" | "down" | "stable"
}

const SAMPLE_STUDENTS: StudentData[] = [
  { id: "1", name: "أحمد محمد", scores: [85, 90, 88, 92, 87], attendance: 95, participation: 90, behavior: 95 },
  { id: "2", name: "سارة عبدالله", scores: [92, 88, 95, 90, 93], attendance: 98, participation: 95, behavior: 100 },
  { id: "3", name: "خالد عمر", scores: [78, 82, 80, 85, 83], attendance: 90, participation: 85, behavior: 90 },
  { id: "4", name: "فاطمة علي", scores: [65, 70, 68, 72, 75], attendance: 85, participation: 80, behavior: 85 },
  { id: "5", name: "محمد سعيد", scores: [88, 85, 90, 87, 89], attendance: 92, participation: 88, behavior: 90 },
  { id: "6", name: "نورة أحمد", scores: [95, 92, 96, 94, 97], attendance: 100, participation: 98, behavior: 100 },
  { id: "7", name: "عبدالرحمن", scores: [55, 60, 58, 62, 65], attendance: 75, participation: 70, behavior: 80 },
  { id: "8", name: "ليلى خالد", scores: [82, 85, 88, 86, 84], attendance: 93, participation: 90, behavior: 95 },
]

function calculateAnalysis(students: StudentData[]): AnalysisResult {
  const allScores = students.flatMap(s => s.scores)
  const average = allScores.reduce((a, b) => a + b, 0) / allScores.length
  const highest = Math.max(...allScores)
  const lowest = Math.min(...allScores)
  
  const passingScores = allScores.filter(s => s >= 60)
  const passRate = (passingScores.length / allScores.length) * 100
  
  const studentAverages = students.map(s => ({
    ...s,
    avg: s.scores.reduce((a, b) => a + b, 0) / s.scores.length
  }))
  
  const sorted = [...studentAverages].sort((a, b) => b.avg - a.avg)
  
  return {
    average,
    highest,
    lowest,
    passRate,
    topStudents: sorted.slice(0, 3),
    strugglingStudents: sorted.filter(s => s.avg < 70).slice(0, 3),
    trend: sorted[0].avg > sorted[sorted.length - 1].avg ? "up" : "down",
  }
}

function getGradeColor(score: number) {
  if (score >= 90) return "text-green-500"
  if (score >= 80) return "text-emerald-500"
  if (score >= 70) return "text-blue-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

function getGradeBg(score: number) {
  if (score >= 90) return "bg-green-500"
  if (score >= 80) return "bg-emerald-500"
  if (score >= 70) return "bg-blue-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export default function PerformanceAnalyzerPage() {
  const [mounted, setMounted] = useState(false)
  const [students] = useState<StudentData[]>(SAMPLE_STUDENTS)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [className, setClassName] = useState("الصف الثالث المتوسط - أ")
  const [subject, setSubject] = useState("الرياضيات")
  
  // Generator type hook
  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    uploadedFile,
    setUploadedFile
  } = useGeneratorType("school")

  useEffect(() => {
    setMounted(true)
    setAnalysis(calculateAnalysis(SAMPLE_STUDENTS))
  }, [])

  const exportReport = () => {
    const reportData = {
      className,
      subject,
      analysis,
      students,
      generatedAt: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `performance-report-${Date.now()}.json`
    link.click()
  }

  const printReport = () => {
    window.print()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1B2D2B]/95 backdrop-blur border-b border-border print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={ROUTES.START}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                الأدوات
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h1 className="text-lg font-bold">محلل الأداء</h1>
          </div>

          <div className="flex items-center gap-2">
            <ExportGate 
              onExport={printReport}
              onDownloadWithWatermark={printReport}
              exportLabel="طباعة"
              variant="outline"
              size="sm"
              projectName="تحليل الأداء"
            >
              <Printer className="w-4 h-4 ml-1" />
              طباعة
            </ExportGate>
            <ExportGate 
              onExport={exportReport}
              onDownloadWithWatermark={exportReport}
              exportLabel="تصدير التقرير"
              variant="default"
              size="sm"
              className="bg-indigo-500 hover:bg-indigo-600"
              projectName="تحليل الأداء"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير التقرير
            </ExportGate>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        {/* Generator Type Selector */}
        <Card className="mb-6 border-indigo-100">
          <CardContent className="p-6">
            <Label className="text-sm font-medium mb-3 block">اختر نوع التحليل</Label>
            <GeneratorTypeSelector
              value={generatorType}
              onChange={setGeneratorType}
              customTitle={customTitle}
              onCustomTitleChange={setCustomTitle}
              uploadedFile={uploadedFile}
              onFileUpload={setUploadedFile}
            />
          </CardContent>
        </Card>

        {/* Class Info */}
        <Card className="mb-6 print:border-0 print:shadow-none">
          <CardContent className="p-4 print:p-0">
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <div className="flex-1">
                <Label className="text-xs">الفصل الدراسي / القسم</Label>
                <Input
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">المادة / المجال</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Print Header */}
            <div className="hidden print:block text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">تقرير تحليل الأداء</h1>
              <p className="text-muted-foreground">{className} - {subject}</p>
              <p className="text-muted-foreground text-sm">تاريخ التقرير: {new Date().toLocaleDateString("ar-SA")}</p>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Tabs defaultValue="overview" className="print:block">
            <TabsList className="mb-6 print:hidden">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4 ml-1" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="w-4 h-4 ml-1" />
                الطلاب
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="w-4 h-4 ml-1" />
                التفاصيل
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 print:block">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">المعدل العام</p>
                    <p className={`text-3xl font-bold ${getGradeColor(analysis.average)}`}>
                      {analysis.average.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">أعلى درجة</p>
                    <p className="text-3xl font-bold text-green-500">{analysis.highest}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">أقل درجة</p>
                    <p className="text-3xl font-bold text-red-500">{analysis.lowest}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">نسبة النجاح</p>
                    <p className="text-3xl font-bold text-blue-500">{analysis.passRate.toFixed(0)}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Distribution */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-500" />
                      توزيع الدرجات
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "ممتاز (90-100%)", min: 90, max: 100, color: "bg-green-500" },
                        { label: "جيد جداً (80-89%)", min: 80, max: 89, color: "bg-emerald-500" },
                        { label: "جيد (70-79%)", min: 70, max: 79, color: "bg-blue-500" },
                        { label: "مقبول (60-69%)", min: 60, max: 69, color: "bg-yellow-500" },
                        { label: "راسب (< 60%)", min: 0, max: 59, color: "bg-red-500" },
                      ].map((range) => {
                        const count = students.filter(s => {
                          const avg = s.scores.reduce((a, b) => a + b, 0) / s.scores.length
                          return avg >= range.min && avg <= range.max
                        }).length
                        const percentage = (count / students.length) * 100
                        
                        return (
                          <div key={range.label} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{range.label}</span>
                              <span className="font-medium">{count} طالب ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className={`h-full ${range.color}`}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      المتفوقون
                    </h3>
                    <div className="space-y-3">
                      {analysis.topStudents.map((student, index) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                          <Badge className={getGradeBg(student.avg || 0)}>
                            {(student.avg || 0).toFixed(1)}%
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Students Needing Attention */}
              {analysis.strugglingStudents.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
                      <Target className="w-5 h-5" />
                      طلاب يحتاجون للدعم
                    </h3>
                    <div className="space-y-3">
                      {analysis.strugglingStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div>
                            <span className="font-medium">{student.name}</span>
                            <p className="text-xs text-muted-foreground">
                              الحضور: {student.attendance}% | المشاركة: {student.participation}%
                            </p>
                          </div>
                          <Badge variant="destructive">{(student.avg || 0).toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="students" className="print:block">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4">قائمة الطلاب</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right py-3 px-2">#</th>
                          <th className="text-right py-3 px-2">الاسم</th>
                          <th className="text-right py-3 px-2">المعدل</th>
                          <th className="text-right py-3 px-2">الحضور</th>
                          <th className="text-right py-3 px-2">المشاركة</th>
                          <th className="text-right py-3 px-2">السلوك</th>
                          <th className="text-right py-3 px-2">التقدير</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...students]
                          .sort((a, b) => (b.scores.reduce((x, y) => x + y, 0) / b.scores.length) - (a.scores.reduce((x, y) => x + y, 0) / a.scores.length))
                          .map((student, index) => {
                            const avg = student.scores.reduce((a, b) => a + b, 0) / student.scores.length
                            return (
                              <tr key={student.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-2">{index + 1}</td>
                                <td className="py-3 px-2 font-medium">{student.name}</td>
                                <td className={`py-3 px-2 font-bold ${getGradeColor(avg)}`}>
                                  {avg.toFixed(1)}%
                                </td>
                                <td className="py-3 px-2">{student.attendance}%</td>
                                <td className="py-3 px-2">{student.participation}%</td>
                                <td className="py-3 px-2">{student.behavior}%</td>
                                <td className="py-3 px-2">
                                  <Badge className={getGradeBg(avg)}>
                                    {avg >= 90 ? "ممتاز" : avg >= 80 ? "جيد جداً" : avg >= 70 ? "جيد" : avg >= 60 ? "مقبول" : "راسب"}
                                  </Badge>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="print:block">
              <Card>
                <CardContent className="p-4 space-y-6">
                  <h3 className="font-bold">ملخص التحليل</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-bold mb-2">نقاط القوة</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>المعدل العام للفصل ({analysis.average.toFixed(1)}%) يعكس مستوى جيد</li>
                        <li>نسبة النجاح ({analysis.passRate.toFixed(0)}%) ممتازة</li>
                        <li>{analysis.topStudents.length} طلاب في مستوى ممتاز</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-bold mb-2">مجالات التحسين</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {analysis.strugglingStudents.length > 0 && (
                          <li>{analysis.strugglingStudents.length} طلاب يحتاجون للدعم الإضافي</li>
                        )}
                        <li>مراجعة طرق التدريس لتحسين الفهم</li>
                        <li>تنويع أنشطة التقييم</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-bold mb-2">التوصيات</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>تنظيم جلسات دعم للطلاب ذوي الأداء المنخفض</li>
                        <li>تكريم المتفوقين لتحفيز باقي الطلاب</li>
                        <li>متابعة الحضور والانضباط بشكل دوري</li>
                        <li>تنويع أساليب التدريس لتلبية احتياجات جميع الطلاب</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
