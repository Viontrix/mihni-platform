"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  GeneratorTypeSelector, 
  useGeneratorType
} from "@/components/tools/GeneratorTypeSelector"
import { ROUTES } from "@/lib/routes"
import { 
  ArrowRight, 
  Calculator, 
  Plus, 
  Trash2, 
  Download, 
  TrendingUp,
  GraduationCap,
  Award,
  RotateCcw,
  Save,
  Target,
  BarChart3,
  School,
  University,
  CheckCircle2,
  BookOpen
} from "lucide-react"

// Types
type CalculatorType = "school" | "university" | "target" | "statistics"
type GradingSystem = "saudi" | "american" | "british" | "gpa4" | "gpa5"

interface Subject {
  id: string
  name: string
  score: number
  maxScore: number
  weight: number
  credits?: number
}

interface StudentResult {
  name: string
  total: number
  percentage: number
  grade: string
  gpa?: number
  status: "pass" | "fail"
}

interface TargetGoal {
  subject: string
  currentScore: number
  targetScore: number
  maxScore: number
}

// Grading Systems
const GRADE_SYSTEMS: Record<GradingSystem, { min: number; max: number; grade: string; label: string; gpa?: number }[]> = {
  saudi: [
    { min: 95, max: 100, grade: "A+", label: "ممتاز مرتفع", gpa: 5.0 },
    { min: 90, max: 94, grade: "A", label: "ممتاز", gpa: 4.75 },
    { min: 85, max: 89, grade: "B+", label: "جيد جداً مرتفع", gpa: 4.5 },
    { min: 80, max: 84, grade: "B", label: "جيد جداً", gpa: 4.0 },
    { min: 75, max: 79, grade: "C+", label: "جيد مرتفع", gpa: 3.5 },
    { min: 70, max: 74, grade: "C", label: "جيد", gpa: 3.0 },
    { min: 65, max: 69, grade: "D+", label: "مقبول مرتفع", gpa: 2.5 },
    { min: 60, max: 64, grade: "D", label: "مقبول", gpa: 2.0 },
    { min: 0, max: 59, grade: "F", label: "راسب", gpa: 1.0 },
  ],
  american: [
    { min: 97, max: 100, grade: "A+", label: "Excellent", gpa: 4.0 },
    { min: 93, max: 96, grade: "A", label: "Excellent", gpa: 4.0 },
    { min: 90, max: 92, grade: "A-", label: "Excellent", gpa: 3.7 },
    { min: 87, max: 89, grade: "B+", label: "Good", gpa: 3.3 },
    { min: 83, max: 86, grade: "B", label: "Good", gpa: 3.0 },
    { min: 80, max: 82, grade: "B-", label: "Good", gpa: 2.7 },
    { min: 77, max: 79, grade: "C+", label: "Average", gpa: 2.3 },
    { min: 73, max: 76, grade: "C", label: "Average", gpa: 2.0 },
    { min: 70, max: 72, grade: "C-", label: "Average", gpa: 1.7 },
    { min: 67, max: 69, grade: "D+", label: "Below Average", gpa: 1.3 },
    { min: 65, max: 66, grade: "D", label: "Below Average", gpa: 1.0 },
    { min: 0, max: 64, grade: "F", label: "Fail", gpa: 0.0 },
  ],
  british: [
    { min: 70, max: 100, grade: "A", label: "First Class", gpa: 4.0 },
    { min: 60, max: 69, grade: "B", label: "Upper Second", gpa: 3.3 },
    { min: 50, max: 59, grade: "C", label: "Lower Second", gpa: 2.7 },
    { min: 40, max: 49, grade: "D", label: "Third Class", gpa: 2.0 },
    { min: 0, max: 39, grade: "F", label: "Fail", gpa: 0.0 },
  ],
  gpa4: [
    { min: 90, max: 100, grade: "A", label: "Outstanding", gpa: 4.0 },
    { min: 85, max: 89, grade: "B+", label: "Very Good", gpa: 3.5 },
    { min: 80, max: 84, grade: "B", label: "Good", gpa: 3.0 },
    { min: 75, max: 79, grade: "C+", label: "Above Average", gpa: 2.5 },
    { min: 70, max: 74, grade: "C", label: "Average", gpa: 2.0 },
    { min: 65, max: 69, grade: "D+", label: "Below Average", gpa: 1.5 },
    { min: 60, max: 64, grade: "D", label: "Pass", gpa: 1.0 },
    { min: 0, max: 59, grade: "F", label: "Fail", gpa: 0.0 },
  ],
  gpa5: [
    { min: 90, max: 100, grade: "A+", label: "Exceptional", gpa: 5.0 },
    { min: 85, max: 89, grade: "A", label: "Excellent", gpa: 4.75 },
    { min: 80, max: 84, grade: "B+", label: "Very Good", gpa: 4.5 },
    { min: 75, max: 79, grade: "B", label: "Good", gpa: 4.0 },
    { min: 70, max: 74, grade: "C+", label: "Above Average", gpa: 3.5 },
    { min: 65, max: 69, grade: "C", label: "Average", gpa: 3.0 },
    { min: 60, max: 64, grade: "D", label: "Pass", gpa: 2.0 },
    { min: 0, max: 59, grade: "F", label: "Fail", gpa: 0.0 },
  ],
}

// Preset subjects for different levels
const PRESET_SUBJECTS = {
  elementary: ["الرياضيات", "اللغة العربية", "العلوم", "التربية الإسلامية", "اللغة الإنجليزية", "الدراسات الاجتماعية"],
  middle: ["الرياضيات", "اللغة العربية", "الفيزياء", "الكيمياء", "الأحياء", "اللغة الإنجليزية", "التربية الإسلامية"],
  high: ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "اللغة الإنجليزية"],
  university: ["مادة 1", "مادة 2", "مادة 3", "مادة 4", "مادة 5"],
}

function getGrade(percentage: number, system: GradingSystem) {
  const gradeInfo = GRADE_SYSTEMS[system].find(g => percentage >= g.min && percentage <= g.max)
  return gradeInfo || { grade: "F", label: "راسب", gpa: 0 }
}

function getStatusColor(percentage: number) {
  if (percentage >= 90) return "text-green-500"
  if (percentage >= 80) return "text-emerald-500"
  if (percentage >= 70) return "text-blue-500"
  if (percentage >= 60) return "text-yellow-500"
  return "text-red-500"
}

function getStatusBgColor(percentage: number) {
  if (percentage >= 90) return "bg-green-500"
  if (percentage >= 80) return "bg-emerald-500"
  if (percentage >= 70) return "bg-blue-500"
  if (percentage >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export default function GradeCalculatorPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<CalculatorType>("school")
  
  // Generator type hook
  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    uploadedFile,
    setUploadedFile
  } = useGeneratorType("school")
  
  // School Calculator State
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "الرياضيات", score: 85, maxScore: 100, weight: 1 },
    { id: "2", name: "اللغة العربية", score: 90, maxScore: 100, weight: 1 },
    { id: "3", name: "العلوم", score: 78, maxScore: 100, weight: 1 },
  ])
  const [studentName, setStudentName] = useState("")
  const [gradeSystem, setGradeSystem] = useState<GradingSystem>("saudi")
  const [results, setResults] = useState<StudentResult[]>([])
  
  // University Calculator State
  const [uniSubjects, setUniSubjects] = useState<Subject[]>([
    { id: "1", name: "مادة 1", score: 85, maxScore: 100, weight: 1, credits: 3 },
    { id: "2", name: "مادة 2", score: 78, maxScore: 100, weight: 1, credits: 3 },
    { id: "3", name: "مادة 3", score: 92, maxScore: 100, weight: 1, credits: 4 },
  ])
  const [uniSystem, setUniSystem] = useState<GradingSystem>("gpa4")
  
  // Target Calculator State
  const [targetGoals, setTargetGoals] = useState<TargetGoal[]>([
    { subject: "الرياضيات", currentScore: 75, targetScore: 90, maxScore: 100 },
    { subject: "اللغة العربية", currentScore: 80, targetScore: 95, maxScore: 100 },
  ])
  
  // Statistics State
  const [statsData, setStatsData] = useState<{ subject: string; score: number; maxScore: number }[]>([
    { subject: "الرياضيات", score: 85, maxScore: 100 },
    { subject: "اللغة العربية", score: 90, maxScore: 100 },
    { subject: "العلوم", score: 78, maxScore: 100 },
    { subject: "الإنجليزي", score: 82, maxScore: 100 },
    { subject: "الإسلامية", score: 95, maxScore: 100 },
  ])

  // Update calculator type based on generator type
  useEffect(() => {
    if (generatorType === "company" || generatorType === "government") {
      setActiveTab("university")
    } else if (generatorType === "individual") {
      setActiveTab("statistics")
    } else {
      setActiveTab("school")
    }
  }, [generatorType])

  useEffect(() => {
    setMounted(true)
  }, [])

  // School Calculator Functions
  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: "",
      score: 0,
      maxScore: 100,
      weight: 1,
    }
    setSubjects([...subjects, newSubject])
  }

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const loadPresetSubjects = (level: keyof typeof PRESET_SUBJECTS) => {
    const presets = PRESET_SUBJECTS[level]
    setSubjects(presets.map((name, i) => ({
      id: Date.now().toString() + i,
      name,
      score: 0,
      maxScore: 100,
      weight: 1,
    })))
  }

  const calculateResults = () => {
    const validSubjects = subjects.filter(s => s.name && s.maxScore > 0)
    if (validSubjects.length === 0) return

    const totalWeightedScore = validSubjects.reduce((sum, s) => sum + (s.score * s.weight), 0)
    const totalWeightedMax = validSubjects.reduce((sum, s) => sum + (s.maxScore * s.weight), 0)
    const percentage = totalWeightedMax > 0 ? (totalWeightedScore / totalWeightedMax) * 100 : 0
    const gradeInfo = getGrade(percentage, gradeSystem)

    const newResult: StudentResult = {
      name: studentName || `طالب ${results.length + 1}`,
      total: Math.round(totalWeightedScore),
      percentage: Math.round(percentage * 100) / 100,
      grade: gradeInfo.grade,
      gpa: gradeInfo.gpa,
      status: percentage >= 60 ? "pass" : "fail",
    }

    setResults([...results, newResult])
  }

  const resetCalculator = () => {
    setSubjects([
      { id: Date.now().toString(), name: "", score: 0, maxScore: 100, weight: 1 },
    ])
    setStudentName("")
    setResults([])
  }

  // University Calculator Functions
  const calculateGPA = () => {
    const validSubjects = uniSubjects.filter(s => s.name && s.maxScore > 0)
    if (validSubjects.length === 0) return { gpa: 0, totalCredits: 0 }

    let totalPoints = 0
    let totalCredits = 0

    validSubjects.forEach(s => {
      const percentage = (s.score / s.maxScore) * 100
      const gradeInfo = getGrade(percentage, uniSystem)
      const credits = s.credits || 1
      totalPoints += (gradeInfo.gpa || 0) * credits
      totalCredits += credits
    })

    return {
      gpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
      totalCredits,
    }
  }

  // Statistics Functions
  const calculateStats = () => {
    const scores = statsData.map(d => (d.score / d.maxScore) * 100)
    const sum = scores.reduce((a, b) => a + b, 0)
    const avg = sum / scores.length
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const sorted = [...scores].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    const median = sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid]

    return { avg, min, max, median }
  }

  const exportToExcel = () => {
    const csvContent = [
      ["الاسم", "المجموع", "النسبة", "التقدير", "المعدل", "الحالة"],
      ...results.map(r => [r.name, r.total, r.percentage + "%", r.grade, r.gpa, r.status === "pass" ? "ناجح" : "راسب"]),
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "results.csv"
    link.click()
  }

  // Calculations
  const currentTotal = subjects.reduce((sum, s) => sum + (s.score * s.weight), 0)
  const currentMax = subjects.reduce((sum, s) => sum + (s.maxScore * s.weight), 0)
  const currentPercentage = currentMax > 0 ? (currentTotal / currentMax) * 100 : 0
  const currentGrade = getGrade(currentPercentage, gradeSystem)
  const { gpa: currentGPA, totalCredits } = calculateGPA()
  const stats = calculateStats()

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Calculator className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1B2D2B]/95 backdrop-blur border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={ROUTES.HOME}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                الأدوات
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Calculator className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-bold">حاسبة النتائج</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetCalculator}>
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة
            </Button>
            <Button variant="default" size="sm" onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-600">
              <Download className="w-4 h-4 ml-1" />
              تصدير
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        {/* Generator Type Selector */}
        <Card className="mb-6 border-blue-100">
          <CardContent className="p-6">
            <Label className="text-sm font-medium mb-3 block">اختر نوع الحساب</Label>
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CalculatorType)} className="space-y-6">
          {/* Calculator Type Tabs */}
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="school" className="flex items-center gap-2">
              <School className="w-4 h-4" />
              <span className="hidden sm:inline">المدارس</span>
            </TabsTrigger>
            <TabsTrigger value="university" className="flex items-center gap-2">
              <University className="w-4 h-4" />
              <span className="hidden sm:inline">الجامعة</span>
            </TabsTrigger>
            <TabsTrigger value="target" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">الأهداف</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">الإحصائيات</span>
            </TabsTrigger>
          </TabsList>

          {/* School Calculator */}
          <TabsContent value="school" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Result Circle */}
              <div className="space-y-6">
                <Card className="border-2 border-blue-500/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-4">النتيجة الحالية</h3>
                    
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(currentPercentage / 100) * 440} 440`}
                          className={`${getStatusBgColor(currentPercentage)} transition-all duration-500`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{Math.round(currentPercentage)}%</span>
                        <span className={`text-lg font-bold ${getStatusColor(currentPercentage)}`}>{currentGrade.grade}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع:</span>
                        <span className="font-medium">{currentTotal} / {currentMax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التقدير:</span>
                        <Badge className={getStatusBgColor(currentPercentage)}>{currentGrade.grade}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الوصف:</span>
                        <span className="font-medium">{currentGrade.label}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Grade Scale */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      مقياس التقديرات
                    </h3>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {GRADE_SYSTEMS[gradeSystem].map((g, i) => (
                        <div key={i} className={`flex items-center justify-between text-sm py-1 px-2 rounded ${
                          currentGrade.grade === g.grade ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-muted/50'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="font-bold w-8">{g.grade}</span>
                            <span className="text-muted-foreground text-xs">{g.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{g.min}-{g.max}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Student Info */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">اسم الطالب</Label>
                        <Input
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="أدخل اسم الطالب"
                          className="mt-1"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <Label className="text-sm font-medium">نظام التقييم</Label>
                        <Select value={gradeSystem} onValueChange={(v) => setGradeSystem(v as GradingSystem)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="saudi">النظام السعودي</SelectItem>
                            <SelectItem value="american">النظام الأمريكي</SelectItem>
                            <SelectItem value="british">النظام البريطاني</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-muted-foreground">تحميل سريع:</span>
                      {Object.keys(PRESET_SUBJECTS).map((level) => (
                        <button
                          key={level}
                          onClick={() => loadPresetSubjects(level as keyof typeof PRESET_SUBJECTS)}
                          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {level === "elementary" ? "ابتدائي" :
                           level === "middle" ? "متوسط" :
                           level === "high" ? "ثانوي" : "جامعة"}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" />
                        المواد الدراسية
                      </h3>
                      <Button size="sm" variant="outline" onClick={addSubject}>
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة مادة
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {subjects.map((subject, index) => (
                          <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="col-span-4">
                              <Input
                                value={subject.name}
                                onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                                placeholder={`مادة ${index + 1}`}
                                className="text-sm"
                              />
                            </div>
                            <div className="col-span-3">
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={subject.score}
                                  onChange={(e) => updateSubject(subject.id, "score", Number(e.target.value))}
                                  className="text-sm"
                                  min={0}
                                />
                                <span className="text-xs text-muted-foreground">/</span>
                                <Input
                                  type="number"
                                  value={subject.maxScore}
                                  onChange={(e) => updateSubject(subject.id, "maxScore", Number(e.target.value))}
                                  className="text-sm"
                                  min={1}
                                />
                              </div>
                            </div>
                            <div className="col-span-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">الوزن:</span>
                                <Input
                                  type="number"
                                  value={subject.weight}
                                  onChange={(e) => updateSubject(subject.id, "weight", Number(e.target.value))}
                                  className="text-sm"
                                  min={0.1}
                                  step={0.1}
                                />
                              </div>
                            </div>
                            <div className="col-span-2 flex justify-end">
                              {subjects.length > 1 && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeSubject(subject.id)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600" onClick={calculateResults}>
                      <Save className="w-4 h-4 ml-1" />
                      حفظ النتيجة
                    </Button>
                  </CardContent>
                </Card>

                {/* Results History */}
                {results.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        سجل النتائج
                      </h3>
                      <div className="space-y-2">
                        {results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium">{result.name}</p>
                              <p className="text-xs text-muted-foreground">{result.total} / {currentMax}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className={result.status === "pass" ? "bg-green-500" : "bg-red-500"}>
                                {result.grade}
                              </Badge>
                              <span className="font-bold">{result.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* University Calculator */}
          <TabsContent value="university" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GPA Result */}
              <div className="space-y-6">
                <Card className="border-2 border-purple-500/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-4">المعدل التراكمي</h3>
                    
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-purple-600">{currentGPA.toFixed(2)}</span>
                      </div>
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          stroke="#9333ea"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(currentGPA / (uniSystem === "gpa5" ? 5 : 4)) * 440} 440`}
                        />
                      </svg>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">إجمالي الساعات:</span>
                        <span className="font-medium">{totalCredits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التقدير:</span>
                        <Badge className="bg-purple-500">
                          {currentGPA >= 3.5 ? "ممتاز" : currentGPA >= 3.0 ? "جيد جداً" : currentGPA >= 2.5 ? "جيد" : "مقبول"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* University Subjects Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-48">
                        <Label className="text-sm font-medium">نظام المعدل</Label>
                        <Select value={uniSystem} onValueChange={(v) => setUniSystem(v as GradingSystem)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpa4">GPA من 4</SelectItem>
                            <SelectItem value="gpa5">GPA من 5</SelectItem>
                            <SelectItem value="american">النظام الأمريكي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        المواد والساعات
                      </h3>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setUniSubjects([...uniSubjects, { id: Date.now().toString(), name: "", score: 0, maxScore: 100, weight: 1, credits: 3 }])}
                      >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة مادة
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {uniSubjects.map((subject, index) => (
                        <div key={subject.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-muted/30 rounded-lg">
                          <div className="col-span-3">
                            <Input
                              value={subject.name}
                              onChange={(e) => {
                                const newSubjects = [...uniSubjects]
                                newSubjects[index].name = e.target.value
                                setUniSubjects(newSubjects)
                              }}
                              placeholder={`مادة ${index + 1}`}
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={subject.credits}
                              onChange={(e) => {
                                const newSubjects = [...uniSubjects]
                                newSubjects[index].credits = Number(e.target.value)
                                setUniSubjects(newSubjects)
                              }}
                              placeholder="الساعات"
                              className="text-sm"
                              min={1}
                            />
                          </div>
                          <div className="col-span-4">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={subject.score}
                                onChange={(e) => {
                                  const newSubjects = [...uniSubjects]
                                  newSubjects[index].score = Number(e.target.value)
                                  setUniSubjects(newSubjects)
                                }}
                                className="text-sm"
                                min={0}
                              />
                              <span className="text-xs text-muted-foreground">/</span>
                              <Input
                                type="number"
                                value={subject.maxScore}
                                onChange={(e) => {
                                  const newSubjects = [...uniSubjects]
                                  newSubjects[index].maxScore = Number(e.target.value)
                                  setUniSubjects(newSubjects)
                                }}
                                className="text-sm"
                                min={1}
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Badge variant="outline" className="text-xs">
                              {getGrade((subject.score / subject.maxScore) * 100, uniSystem).grade}
                            </Badge>
                          </div>
                          <div className="col-span-1 flex justify-end">
                            {uniSubjects.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => setUniSubjects(uniSubjects.filter((_, i) => i !== index))}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Target Calculator */}
          <TabsContent value="target" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    أهدافك الدراسية
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setTargetGoals([...targetGoals, { subject: "", currentScore: 0, targetScore: 0, maxScore: 100 }])}
                  >
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة هدف
                  </Button>
                </div>

                <div className="space-y-4">
                  {targetGoals.map((goal, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label className="text-xs text-muted-foreground">المادة</Label>
                        <Input
                          value={goal.subject}
                          onChange={(e) => {
                            const newGoals = [...targetGoals]
                            newGoals[index].subject = e.target.value
                            setTargetGoals(newGoals)
                          }}
                          placeholder="اسم المادة"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">الدرجة الحالية</Label>
                        <Input
                          type="number"
                          value={goal.currentScore}
                          onChange={(e) => {
                            const newGoals = [...targetGoals]
                            newGoals[index].currentScore = Number(e.target.value)
                            setTargetGoals(newGoals)
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">الدرجة المستهدفة</Label>
                        <Input
                          type="number"
                          value={goal.targetScore}
                          onChange={(e) => {
                            const newGoals = [...targetGoals]
                            newGoals[index].targetScore = Number(e.target.value)
                            setTargetGoals(newGoals)
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">الحد الأقصى</Label>
                        <Input
                          type="number"
                          value={goal.maxScore}
                          onChange={(e) => {
                            const newGoals = [...targetGoals]
                            newGoals[index].maxScore = Number(e.target.value)
                            setTargetGoals(newGoals)
                          }}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label className="text-xs text-muted-foreground">الفجوة</Label>
                          <div className="h-10 flex items-center">
                            <Badge className={goal.targetScore > goal.currentScore ? "bg-amber-500" : "bg-green-500"}>
                              {goal.targetScore - goal.currentScore > 0 ? "+" : ""}
                              {goal.targetScore - goal.currentScore}
                            </Badge>
                          </div>
                        </div>
                        {targetGoals.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-10 w-10 p-0" 
                            onClick={() => setTargetGoals(targetGoals.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ملخص الأهداف
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">إجمالي الأهداف:</span>
                      <span className="font-bold mr-2">{targetGoals.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">المحقق:</span>
                      <span className="font-bold mr-2 text-green-600">
                        {targetGoals.filter(g => g.currentScore >= g.targetScore).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">قيد التحقيق:</span>
                      <span className="font-bold mr-2 text-amber-600">
                        {targetGoals.filter(g => g.currentScore < g.targetScore).length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <Card className="lg:col-span-1">
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-500" />
                    الإحصائيات
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">المتوسط</p>
                      <p className="text-2xl font-bold text-cyan-600">{stats.avg.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">الأعلى</p>
                      <p className="text-2xl font-bold text-green-600">{stats.max.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">الأدنى</p>
                      <p className="text-2xl font-bold text-red-600">{stats.min.toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">الوسيط</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.median.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="lg:col-span-3">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">رسم بياني للدرجات</h3>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setStatsData([...statsData, { subject: `مادة ${statsData.length + 1}`, score: 0, maxScore: 100 }])}
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      إضافة
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {statsData.map((item, index) => {
                      const percentage = (item.score / item.maxScore) * 100
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Input
                                value={item.subject}
                                onChange={(e) => {
                                  const newData = [...statsData]
                                  newData[index].subject = e.target.value
                                  setStatsData(newData)
                                }}
                                className="w-32 text-sm"
                              />
                              <Input
                                type="number"
                                value={item.score}
                                onChange={(e) => {
                                  const newData = [...statsData]
                                  newData[index].score = Number(e.target.value)
                                  setStatsData(newData)
                                }}
                                className="w-20 text-sm"
                              />
                              <span className="text-muted-foreground">/</span>
                              <Input
                                type="number"
                                value={item.maxScore}
                                onChange={(e) => {
                                  const newData = [...statsData]
                                  newData[index].maxScore = Number(e.target.value)
                                  setStatsData(newData)
                                }}
                                className="w-20 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold w-12 text-left">{percentage.toFixed(0)}%</span>
                              {statsData.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => setStatsData(statsData.filter((_, i) => i !== index))}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full ${getStatusBgColor(percentage)}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
