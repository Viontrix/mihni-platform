"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  GeneratorTypeSelector, 
  useGeneratorType
} from "@/components/tools/GeneratorTypeSelector"
import ExportGate from "@/components/ExportGate"
import { ROUTES } from "@/lib/routes"
import { 
  ArrowRight, 
  FileText, 
  Download, 
  Printer,
  Save,
  Calendar
} from "lucide-react"

type ReportType = "student" | "class" | "subject" | "attendance" | "behavior"
type ReportStatus = "draft" | "final"

interface ReportSection {
  id: string
  title: string
  content: string
}

interface Report {
  id: string
  type: ReportType
  title: string
  studentName?: string
  className?: string
  subject?: string
  date: string
  status: ReportStatus
  sections: ReportSection[]
}

const REPORT_TEMPLATES: Record<ReportType, { title: string; sections: string[] }> = {
  student: {
    title: "تقرير تقدم الطالب",
    sections: ["المقدمة", "الأداء الأكاديمي", "الحضور والانضباط", "المشاركة الصفية", "التوصيات"],
  },
  class: {
    title: "تقرير أداء الفصل",
    sections: ["نظرة عامة", "الإحصائيات", "الطلاب المتفوقون", "التحديات", "الخطط المستقبلية"],
  },
  subject: {
    title: "تقرير تحليل المادة",
    sections: ["أهداف المادة", "النتائج المتحققة", "الصعوبات", "الاقتراحات"],
  },
  attendance: {
    title: "تقرير الحضور والغياب",
    sections: ["إحصائيات الحضور", "الطلاب المتكرر غيابهم", "الإجراءات المتخذة"],
  },
  behavior: {
    title: "تقرير السلوك",
    sections: ["تقييم السلوك العام", "الملاحظات الإيجابية", "الملاحظات السلبية", "التوصيات"],
  },
}

const SAMPLE_CONTENT: Record<string, string> = {
  "المقدمة": "يُعد هذا التقرير ملخصاً شاملاً للأداء الأكاديمي والسلوكي للط خلال الفترة الدراسية الحالية. يهدف التقرير إلى تقديم صورة واضحة عن مستوى التحصيل الدراسي والمشاركة الفعالة في الأنشطة الصفية.",
  "الأداء الأكاديمي": "أظهر الطالب مستوى جيداً في معظم المواد الدراسية، مع ملاحظة تحسن ملحوظ في مادتي الرياضيات والعلوم. يُنصح بزيادة التمرين في اللغة العربية.",
  "الحضور والانضباط": "الحضور منتظم بنسبة 95%، والسلوك إيجابي داخل الفصل. يحترم المواعيد ويلتزم بالتعليمات.",
  "المشاركة الصفية": "المشاركة نشطة ومميزة. يتفاعل الطالب مع المناقشات ويساهم في الأنشطة الجماعية بشكل إيجابي.",
  "التوصيات": "1. الاستمرار في المذاكرة المنتظمة\n2. المشاركة في الأنشطة اللاصفية\n3. تطوير مهارات القراءة",
  "نظرة عامة": "يُقدم هذا التقرير تحليلاً شاملاً لأداء الفصل الدراسي خلال الفترة الحالية.",
  "الإحصائيات": "متوسط الفصل: 82%\nنسبة النجاح: 95%\nنسبة الحضور: 93%",
  "الطلاب المتفوقون": "تم تكريم 5 طلاب متفوقين هذا الفصل.",
  "التحديات": "بعض الطلاب يحتاجون لدعم إضافي في المواد العلمية.",
  "الخطط المستقبلية": "تنظيم ورش عمل تقوية وبرامج دعم للطلاب ذوي الأداء المنخفض.",
}

export default function ReportGeneratorPage() {
  const [mounted, setMounted] = useState(false)
  const [reportType, setReportType] = useState<ReportType>("student")
  const [report, setReport] = useState<Report>({
    id: Date.now().toString(),
    type: "student",
    title: "",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    sections: [],
  })
  const [savedReports, setSavedReports] = useState<Report[]>([])
  
  // Generator type hook
  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    customDescription,
    setCustomDescription,
    uploadedFile,
    setUploadedFile
  } = useGeneratorType("school")

  // Update templates based on generator type
  useEffect(() => {
    if (generatorType === "company") {
      setReportType("subject")
      loadTemplate("subject")
    } else if (generatorType === "government") {
      setReportType("class")
      loadTemplate("class")
    } else {
      setReportType("student")
      loadTemplate("student")
    }
  }, [generatorType])

  useEffect(() => {
    setMounted(true)
    loadTemplate("student")
  }, [])

  const loadTemplate = (type: ReportType) => {
    const template = REPORT_TEMPLATES[type]
    setReportType(type)
    setReport({
      ...report,
      type,
      title: template.title,
      sections: template.sections.map((title, index) => ({
        id: `section-${index}`,
        title,
        content: SAMPLE_CONTENT[title] || "",
      })),
    })
  }

  const updateSection = (id: string, content: string) => {
    setReport({
      ...report,
      sections: report.sections.map(s => s.id === id ? { ...s, content } : s),
    })
  }

  const saveReport = () => {
    const newReport = { ...report, status: "final" as ReportStatus }
    setSavedReports([...savedReports, newReport])
    alert("تم حفظ التقرير بنجاح!")
  }

  const exportReport = () => {
    const reportText = `
${report.title}
================
التاريخ: ${report.date}
${report.studentName ? `الطالب: ${report.studentName}` : ""}
${report.className ? `الفصل: ${report.className}` : ""}
${report.subject ? `المادة: ${report.subject}` : ""}

${report.sections.map(s => `
${s.title}
${"-".repeat(s.title.length)}
${s.content}
`).join("\n")}
    `.trim()

    const blob = new Blob(["\ufeff" + reportText], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${report.title}-${report.date}.txt`
    link.click()
  }

  const printReport = () => {
    window.print()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <FileText className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
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
            <Link to={ROUTES.HOME}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                الأدوات
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <FileText className="w-5 h-5 text-rose-500" />
            <h1 className="text-lg font-bold">منشئ التقارير</h1>
          </div>

          <div className="flex items-center gap-2">
            <ExportGate 
              onExport={printReport}
              onDownloadWithWatermark={printReport}
              exportLabel="طباعة"
              variant="outline"
              size="sm"
              projectName="التقرير"
            >
              <Printer className="w-4 h-4 ml-1" />
              طباعة
            </ExportGate>
            <Button variant="outline" size="sm" onClick={saveReport}>
              <Save className="w-4 h-4 ml-1" />
              حفظ
            </Button>
            <ExportGate 
              onExport={exportReport}
              onDownloadWithWatermark={exportReport}
              exportLabel="تصدير"
              variant="default"
              size="sm"
              className="bg-rose-500 hover:bg-rose-600"
              projectName="التقرير"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير
            </ExportGate>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        {/* Generator Type Selector */}
        <Card className="mb-6 border-rose-100">
          <CardContent className="p-6">
            <Label className="text-sm font-medium mb-3 block">اختر نوع التقرير</Label>
            <GeneratorTypeSelector
              value={generatorType}
              onChange={setGeneratorType}
              customTitle={customTitle}
              onCustomTitleChange={setCustomTitle}
              customDescription={customDescription}
              onCustomDescriptionChange={setCustomDescription}
              uploadedFile={uploadedFile}
              onFileUpload={setUploadedFile}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:block">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Report Type */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-500" />
                  نوع التقرير
                </h3>
                
                <Select value={reportType} onValueChange={(v) => loadTemplate(v as ReportType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">تقرير طالب</SelectItem>
                    <SelectItem value="class">تقرير فصل</SelectItem>
                    <SelectItem value="subject">تقرير مادة</SelectItem>
                    <SelectItem value="attendance">تقرير حضور</SelectItem>
                    <SelectItem value="behavior">تقرير سلوك</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Report Info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  معلومات التقرير
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-xs">عنوان التقرير</Label>
                  <Input
                    value={report.title}
                    onChange={(e) => setReport({ ...report, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">التاريخ</Label>
                  <Input
                    type="date"
                    value={report.date}
                    onChange={(e) => setReport({ ...report, date: e.target.value })}
                  />
                </div>

                {reportType === "student" && (
                  <div className="space-y-2">
                    <Label className="text-xs">اسم الطالب</Label>
                    <Input
                      value={report.studentName || ""}
                      onChange={(e) => setReport({ ...report, studentName: e.target.value })}
                      placeholder="أدخل اسم الطالب"
                    />
                  </div>
                )}

                {(reportType === "class" || reportType === "attendance" || reportType === "behavior") && (
                  <div className="space-y-2">
                    <Label className="text-xs">الفصل</Label>
                    <Select value={report.className} onValueChange={(v) => setReport({ ...report, className: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفصل" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={`الصف ${i + 1}`}>الصف {i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(reportType === "subject" || reportType === "student") && (
                  <div className="space-y-2">
                    <Label className="text-xs">المادة</Label>
                    <Select value={report.subject} onValueChange={(v) => setReport({ ...report, subject: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المادة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الرياضيات">الرياضيات</SelectItem>
                        <SelectItem value="اللغة العربية">اللغة العربية</SelectItem>
                        <SelectItem value="العلوم">العلوم</SelectItem>
                        <SelectItem value="اللغة الإنجليزية">اللغة الإنجليزية</SelectItem>
                        <SelectItem value="التربية الإسلامية">التربية الإسلامية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Reports */}
            {savedReports.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3">التقارير المحفوظة</h3>
                  <div className="space-y-2">
                    {savedReports.map((r, i) => (
                      <div key={i} className="p-2 bg-muted/30 rounded-lg text-sm">
                        <p className="font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Report Editor */}
          <div className="lg:col-span-3 print:w-full">
            <Card className="print:border-0 print:shadow-none">
              <CardContent className="p-6 print:p-0">
                {/* Print Header */}
                <div className="hidden print:block text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
                  <p className="text-muted-foreground">{report.date}</p>
                  {report.studentName && <p>الطالب: {report.studentName}</p>}
                  {report.className && <p>الفصل: {report.className}</p>}
                  {report.subject && <p>المادة: {report.subject}</p>}
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {report.sections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <Label className="font-bold text-lg flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        {section.title}
                      </Label>
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        rows={4}
                        className="print:border-0 print:bg-transparent print:p-0 print:resize-none"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Signature Area - Print Only */}
                <div className="hidden print:block mt-12 pt-8 border-t">
                  <div className="flex justify-between">
                    <div className="text-center">
                      <p className="mb-8">توقيع المعلم</p>
                      <p>_________________</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-8">توقيع المرشد الطلابي</p>
                      <p>_________________</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-8">توقيع المدير</p>
                      <p>_________________</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
