"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { getCurrentPlan } from "@/lib/billing/subscription"
import type { UserPlan } from "@/lib/tools/types"
import { 
  GeneratorTypeSelector, 
  useGeneratorType,
  type GeneratorType 
} from "@/components/tools/GeneratorTypeSelector"
import ExportGate from "@/components/ExportGate"
import { ROUTES } from "@/lib/routes"
import { 
  ArrowRight, 
  FileText, 
  Plus, 
  Trash2, 
  Shuffle,
  Check,
  X,
  Printer,
  Sparkles,
  Lightbulb,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Copy,
  Share2,
  Mail,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Send,
  FileSpreadsheet,
  FileType2,
  Eye,
  RefreshCw
} from "lucide-react"

type QuestionType = "mcq" | "truefalse" | "fillblank" | "essay" | "matching"
type DifficultyLevel = "easy" | "medium" | "hard" | "mixed"
type ExportFormat = "pdf" | "word" | "excel"

interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: number | boolean | string
  explanation?: string
  marks: number
  difficulty?: DifficultyLevel
}

interface QuizSettings {
  title: string
  subject: string
  grade: string
  numQuestions: number
  difficulty: DifficultyLevel
  questionTypes: QuestionType[]
  duration: number
  shuffleQuestions: boolean
  showAnswers: boolean
  includeExplanation: boolean
  language: "ar" | "en" | "both"
}

const QUESTION_TYPES = [
  { value: "mcq" as QuestionType, label: "اختيار من متعدد", icon: Check },
  { value: "truefalse" as QuestionType, label: "صح أو خطأ", icon: Check },
  { value: "fillblank" as QuestionType, label: "اكمل الفراغ", icon: FileText },
  { value: "essay" as QuestionType, label: "مقالي", icon: FileText },
  { value: "matching" as QuestionType, label: "توصيل", icon: Shuffle },
] as const

const GRADES = [
  { value: "kindergarten", label: "رياض الأطفال" },
  { value: "grade1", label: "الصف الأول الابتدائي" },
  { value: "grade2", label: "الصف الثاني الابتدائي" },
  { value: "grade3", label: "الصف الثالث الابتدائي" },
  { value: "grade4", label: "الصف الرابع الابتدائي" },
  { value: "grade5", label: "الصف الخامس الابتدائي" },
  { value: "grade6", label: "الصف السادس الابتدائي" },
  { value: "grade7", label: "الصف الأول المتوسط" },
  { value: "grade8", label: "الصف الثاني المتوسط" },
  { value: "grade9", label: "الصف الثالث المتوسط" },
  { value: "grade10", label: "الصف الأول الثانوي" },
  { value: "grade11", label: "الصف الثاني الثانوي" },
  { value: "grade12", label: "الصف الثالث الثانوي" },
  { value: "university", label: "الجامعة" },
  { value: "general", label: "عام" },
]

const SAMPLE_QUESTIONS: Record<string, Record<DifficultyLevel, string[]>> = {
  // School subjects
  math: {
    easy: ["ما هو حاصل ضرب 5 × 6؟", "أوجد مجموع 15 + 27", "ما هو ناتج 48 ÷ 8؟"],
    medium: ["احسب مساحة المستطيل طوله 12 سم وعرضه 7 سم", "ما هو القاسم المشترك الأكبر للعددين 36 و 48؟", "حل المعادلة: 3x + 7 = 22"],
    hard: ["احسب مشتقة الدالة f(x) = 3x² + 2x - 5", "أوجد قيمة x في المعادلة التفاضلية: dy/dx = 2x", "احسب تكامل الدالة ∫(4x³ + 3x²)dx"],
    mixed: ["ما هو حاصل ضرب 7 × 8؟", "احسب مساحة المستطيل طوله 10 سم وعرضه 5 سم", "ما هو القاسم المشترك الأكبر للعددين 24 و 36؟"],
  },
  arabic: {
    easy: ["ما هو جمع كلمة (كتاب)؟", "أعرب كلمة (المعلم) في الجملة: جاء المعلم", "ما هو ضد كلمة (صغير)؟"],
    medium: ["استخرج من الجملة: (ذهب الولد إلى المدرسة) الفاعل والمفعول به", "ما هو جمع التكسير لكلمة (صندوق)؟", "أعرب الجملة: الكتاب مفيد"],
    hard: ["اشرح إعراب الجملة: إنَّ العدل أساس الملك", "ما الفرق بين المفعول المطلق والمفعول لأجله؟", "استخرج من النص الأسلوبية البلاغية المستخدمة"],
    mixed: ["ما هو جمع كلمة (كتاب)؟", "أعرب كلمة (المعلم) في الجملة: جاء المعلم", "ما هو ضد كلمة (صغير)؟"],
  },
  science: {
    easy: ["ما هي عاصمة الدم؟", "كم عدد كواكب المجموعة الشمسية؟", "ما هو الغاز الأساسي في الهواء؟"],
    medium: ["اشرح دورة حياة النبات", "ما هي وظيفة الميتوكوندريا في الخلية؟", "اذكر ثلاثة أنواع من الصخور"],
    hard: ["اشرح عملية البناء الضوئي بالتفصيل", "ما هي النظرية النسبية لأينشتاين؟", "اشرح آلية عمل القلب في ضخ الدم"],
    mixed: ["ما هي عاصمة الدم؟", "كم عدد كواكب المجموعة الشمسية؟", "ما هو الغاز الأساسي في الهواء؟"],
  },
  // Company departments
  hr: {
    easy: ["ما هي وظيفة الموارد البشرية؟", "اذكر نوعين من أنواع التوظيف", "ما الفرق بين الموظف الدائم والمؤقت؟"],
    medium: ["اشرح عملية تقييم الأداء الوظيفي", "ما هي استراتيجيات الاحتفاظ بالمواهب؟", "كيف تتم إدارة الصراعات في العمل؟"],
    hard: ["صمم نظام تعويضات شامل للشركة", "كيف تبني ثقافة شركات ناجحة؟", "اشرح إطار إدارة المواهب المتكامل"],
    mixed: ["ما هي وظيفة الموارد البشرية؟", "اشرح عملية تقييم الأداء الوظيفي", "ما هي استراتيجيات الاحتفاظ بالمواهب؟"],
  },
  finance: {
    easy: ["ما هو الفرق بين الأصول والخصوم؟", "اذكر نوعين من أنواع الميزانيات", "ما معنى التدفق النقدي؟"],
    medium: ["اشرح مفهوم العائد على الاستثمار ROI", "ما هي أنواع التكاليف في الشركة؟", "كيف تُحسب نسبة السيولة؟"],
    hard: ["حلل بيان مالي لشركة واستخرج النسب المالية", "صمم خطة مالية لخمس سنوات", "اشرح مفهوم التحوط المالي"],
    mixed: ["ما هو الفرق بين الأصول والخصوم؟", "اشرح مفهوم العائد على الاستثمار ROI", "ما هي أنواع التكاليف في الشركة؟"],
  },
  marketing: {
    easy: ["ما هي عناصر المزيج التسويقي 4P؟", "اذكر نوعين من قنوات التسويق", "ما الفرق بين العلامة التجارية والمنتج؟"],
    medium: ["اشرح استراتيجية التسويق بالمحتوى", "ما هي مراحل رحلة العميل؟", "كيف تقيس فعالية الحملة التسويقية؟"],
    hard: ["صمم خطة تسويقية متكاملة لمنتج جديد", "اشرح مفهوم التسويق بالمؤثرين", "كيف تبني ولاء العملاء؟"],
    mixed: ["ما هي عناصر المزيج التسويقي 4P؟", "اشرح استراتيجية التسويق بالمحتوى", "ما هي مراحل رحلة العميل؟"],
  },
  it: {
    easy: ["ما هو الفرق بين البرمجيات والأجهزة؟", "اذكر نوعين من أنظمة التشغيل", "ما معنى الأمن السيبراني؟"],
    medium: ["اشرح مفهوم الحوسبة السحابية", "ما هي أفضل ممارسات حماية البيانات؟", "كيف تُدار مشاريع تطوير البرمجيات؟"],
    hard: ["صمم بنية تحتية تكنولوجية للشركة", "اشرح مفهوم DevOps وتطبيقاته", "كيف تبني استراتيجية تحول رقمي؟"],
    mixed: ["ما هو الفرق بين البرمجيات والأجهزة؟", "اشرح مفهوم الحوسبة السحابية", "ما هي أفضل ممارسات حماية البيانات؟"],
  },
  // Government departments
  legal: {
    easy: ["ما هي أنواع العقود الحكومية؟", "اذكر حقوق الموظف العام", "ما هي الإجراءات الإدارية؟"],
    medium: ["اشرح عملية التقاضي الإداري", "ما هي صلاحيات الجهات الرقابية؟", "كيف تُنظم المناقصات الحكومية؟"],
    hard: ["حلل قضية قانونية إدارية", "صمم إطار حوكمة متكامل", "اشرح مفهوم المساءلة المؤسسية"],
    mixed: ["ما هي أنواع العقود الحكومية؟", "اشرح عملية التقاضي الإداري", "ما هي صلاحيات الجهات الرقابية؟"],
  },
  admin: {
    easy: ["ما هي وظائف الإدارة العامة؟", "اذكر أنواع المراسلات الرسمية", "ما هي قنوات التواصل الحكومي؟"],
    medium: ["اشرح دورة المستندات الإدارية", "ما هي معايير الجودة في الخدمات؟", "كيف تُدار الموارد البشرية الحكومية؟"],
    hard: ["صمم نظام إداري متكامل للجهة", "اشرح مفهوم التحول الرقمي الحكومي", "كيف تُبنى القدرات المؤسسية؟"],
    mixed: ["ما هي وظائف الإدارة العامة؟", "اشرح دورة المستندات الإدارية", "ما هي معايير الجودة في الخدمات؟"],
  },
  // Individual topics
  general: {
    easy: ["ما هي عاصمة المملكة العربية السعودية؟", "كم عدد أيام الأسبوع؟", "ما هو أكبر كوكب في المجموعة الشمسية؟"],
    medium: ["اذكر خمسة من أعضاء جسم الإنسان", "ما هي عجائب الدنيا السبع؟", "من هو مختراع المصباح الكهربائي؟"],
    hard: ["اشرح نظرية النسبية باختصار", "ما هي أسباب الحرب العالمية الثانية؟", "من هم الفائزون بجائزة نوبل من العرب؟"],
    mixed: ["ما هي عاصمة المملكة العربية السعودية؟", "اذكر خمسة من أعضاء جسم الإنسان", "ما هي عجائب الدنيا السبع؟"],
  },
  sports: {
    easy: ["كم عدد لاعبي فريق كرة القدم؟", "ما هي الرياضة الأكثر شعبية؟", "كم دقيقة في مباراة كرة القدم؟"],
    medium: ["من هو أكثر لاعب تسجيلاً للأهداف؟", "ما هي بطولات كرة القدم الكبرى؟", "اشرح قواعد لعبة التنس"],
    hard: ["تحلل تاريخ كأس العالم", "ما هي استراتيجيات التدريب الرياضي؟", "اشرح علم وظائف الأعضاء الرياضي"],
    mixed: ["كم عدد لاعبي فريق كرة القدم؟", "من هو أكثر لاعب تسجيلاً للأهداف؟", "ما هي بطولات كرة القدم الكبرى؟"],
  },
  technology: {
    easy: ["ما هو الفرق بين الهاتف والكمبيوتر؟", "ما هي أشهر شبكات التواصل؟", "ما معنى الذكاء الاصطناعي؟"],
    medium: ["اشرح مفهوم إنترنت الأشياء IoT", "ما هي تقنيات Blockchain؟", "كيف تعمل السيارات الكهربائية؟"],
    hard: ["تحلل تأثير التكنولوجيا على المجتمع", "ما هي مستقبلات الذكاء الاصطناعي؟", "اشرح مفهوم الحوسبة الكمية"],
    mixed: ["ما هو الفرق بين الهاتف والكمبيوتر؟", "اشرح مفهوم إنترنت الأشياء IoT", "ما هي تقنيات Blockchain؟"],
  },
}

// Export functions based on plan
function getAllowedExports(plan: UserPlan): ExportFormat[] {
  switch (plan) {
    case 'free':
      return []
    case 'pro':
      return ['pdf']
    case 'business':
      return ['pdf', 'word']
    case 'enterprise':
      return ['pdf', 'word', 'excel']
    default:
      return []
  }
}

function getExportIcon(format: ExportFormat) {
  switch (format) {
    case 'pdf':
      return { icon: FileType2, color: 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100' }
    case 'word':
      return { icon: FileText, color: 'text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100' }
    case 'excel':
      return { icon: FileSpreadsheet, color: 'text-green-500 bg-green-50 border-green-200 hover:bg-green-100' }
  }
}

export default function QuizGeneratorPage() {
  const [mounted, setMounted] = useState(false)
  const [userPlan, setUserPlan] = useState<UserPlan>('free')
  const [step, setStep] = useState<"form" | "generating" | "result">("form")
  const [questions, setQuestions] = useState<Question[]>([])
  const [settings, setSettings] = useState<QuizSettings>({
    title: "",
    subject: "",
    grade: "",
    numQuestions: 5,
    difficulty: "mixed",
    questionTypes: ["mcq"],
    duration: 30,
    shuffleQuestions: false,
    showAnswers: true,
    includeExplanation: false,
    language: "ar",
  })
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  
  // Use the generator type hook
  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    customDescription,
    setCustomDescription,
    uploadedFile,
    setUploadedFile,
    presets
  } = useGeneratorType("school")

  useEffect(() => {
    setMounted(true)
    setUserPlan(getCurrentPlan())
  }, [])

  // Update subject options when generator type changes
  useEffect(() => {
    if (presets.subjects.length > 0 && !settings.subject) {
      setSettings(prev => ({ ...prev, subject: presets.subjects[0] }))
    }
  }, [generatorType, presets.subjects])

  const handleQuestionTypeToggle = (type: QuestionType) => {
    setSettings(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }))
  }

  const generateQuestions = async () => {
    if (settings.questionTypes.length === 0) {
      toast.error("يرجى اختيار نوع واحد من الأسئلة على الأقل")
      return
    }

    setIsGenerating(true)
    setStep("generating")
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Determine subject key based on generator type and selected subject
    let subjectKey = "math"
    const selectedSubject = settings.subject
    
    if (generatorType === "school") {
      // Map school subjects to sample question keys
      const schoolSubjectMap: Record<string, string> = {
        "الرياضيات": "math",
        "اللغة العربية": "arabic",
        "العلوم": "science",
        "اللغة الإنجليزية": "general",
        "التربية الإسلامية": "arabic",
        "الدراسات الاجتماعية": "general",
      }
      subjectKey = schoolSubjectMap[selectedSubject] || "math"
    } else if (generatorType === "company") {
      // Map company departments
      const companySubjectMap: Record<string, string> = {
        "موارد بشرية": "hr",
        "تقنية المعلومات": "it",
        "المبيعات": "marketing",
        "التسويق": "marketing",
        "المالية": "finance",
        "العمليات": "admin",
      }
      subjectKey = companySubjectMap[selectedSubject] || "hr"
    } else if (generatorType === "government") {
      // Map government departments
      const govSubjectMap: Record<string, string> = {
        "الشؤون الإدارية": "admin",
        "الموارد البشرية": "hr",
        "المالية": "finance",
        "التقنية": "it",
        "القانونية": "legal",
        "العلاقات العامة": "admin",
      }
      subjectKey = govSubjectMap[selectedSubject] || "legal"
    } else if (generatorType === "individual") {
      // Map individual topics
      const individualSubjectMap: Record<string, string> = {
        "ثقافة عامة": "general",
        "رياضة": "sports",
        "صحة": "general",
        "تكنولوجيا": "technology",
        "سفر": "general",
        "طعام": "general",
      }
      subjectKey = individualSubjectMap[selectedSubject] || "general"
    } else if (generatorType === "custom") {
      // For custom, use the custom title as the subject
      subjectKey = "general"
    }
    
    const difficulty = settings.difficulty
    const samples = SAMPLE_QUESTIONS[subjectKey]?.[difficulty] || SAMPLE_QUESTIONS.general.mixed
    
    const newQuestions: Question[] = []
    for (let i = 0; i < settings.numQuestions; i++) {
      const questionType = settings.questionTypes[i % settings.questionTypes.length]
      let sampleQuestion = samples[i % samples.length] || `سؤال ${i + 1}`
      
      // Use custom title/description if available
      if (customTitle) {
        sampleQuestion = `${customTitle}: ${sampleQuestion}`
      }
      if (uploadedFile) {
        sampleQuestion = `[من ملف ${uploadedFile.name}] ${sampleQuestion}`
      }
      
      const newQuestion: Question = {
        id: (Date.now() + i).toString(),
        type: questionType,
        question: sampleQuestion,
        options: questionType === "mcq" ? ["12", "56", "64", "72"] : 
                 questionType === "truefalse" ? ["صح", "خطأ"] : 
                 questionType === "matching" ? ["أ", "ب", "ج", "د"] : undefined,
        correctAnswer: questionType === "mcq" ? 1 : questionType === "truefalse" ? true : "",
        marks: questionType === "essay" ? 5 : 1,
        difficulty: difficulty,
      }
      
      newQuestions.push(newQuestion)
    }
    
    setQuestions(newQuestions)
    setIsGenerating(false)
    setStep("result")
    setPreviewMode(true)
  }

  const regenerateQuestions = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.map((q, i) => ({ ...q, id: Date.now().toString() + i })))
    setIsGenerating(false)
    toast.success("تم توليد أسئلة جديدة")
  }

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: "",
      options: type === "mcq" ? ["", "", "", ""] : type === "truefalse" ? ["صح", "خطأ"] : type === "matching" ? ["أ", "ب", "ج", "د"] : undefined,
      correctAnswer: type === "mcq" ? 0 : type === "truefalse" ? true : "",
      marks: type === "essay" ? 5 : 1,
      difficulty: "medium",
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestion(newQuestion)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
    if (activeQuestion?.id === id) setActiveQuestion(null)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
    if (activeQuestion?.id === id) {
      setActiveQuestion({ ...activeQuestion, ...updates })
    }
  }

  const exportQuiz = (format: ExportFormat) => {
    const allowedExports = getAllowedExports(userPlan)
    if (!allowedExports.includes(format)) {
      toast.error(`التصدير بصيغة ${format.toUpperCase()} غير متوفر في خطتك الحالية`)
      return
    }
    
    if (format === "pdf") {
      toast.success("جاري تحضير ملف PDF...")
      setTimeout(() => {
        const content = generateExportContent()
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${settings.title || "questions"}.txt`
        link.click()
      }, 500)
    } else if (format === "word") {
      toast.success("جاري تحضير ملف Word...")
      const content = generateExportContent()
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${settings.title || "questions"}.doc`
      link.click()
    } else if (format === "excel") {
      toast.success("جاري تحضير ملف Excel...")
      let csv = "الرقم,السؤال,النوع,الدرجة,الإجابة الصحيحة\n"
      questions.forEach((q, i) => {
        csv += `${i + 1},"${q.question}",${QUESTION_TYPES.find(t => t.value === q.type)?.label},${q.marks},${q.correctAnswer}\n`
      })
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `${settings.title || "questions"}.csv`
      link.click()
    }
  }

  const generateExportContent = () => {
    let content = `${settings.title || "أسئلة"}\n`
    content += `================================\n\n`
    content += `المادة: ${settings.subject}\n`
    content += `عدد الأسئلة: ${questions.length}\n`
    content += `إجمالي الدرجات: ${totalMarks}\n\n`
    
    questions.forEach((q, i) => {
      content += `${i + 1}. ${q.question} (${q.marks} درجة)\n`
      if (q.type === "mcq" && q.options) {
        q.options.forEach((opt, j) => {
          content += `   ${String.fromCharCode(1611 + j)}. ${opt}\n`
        })
      }
      content += "\n"
    })
    
    if (settings.showAnswers) {
      content += "\n================================\n"
      content += "نموذج الإجابات:\n"
      content += "================================\n\n"
      questions.forEach((q, i) => {
        content += `${i + 1}. ${q.type === "mcq" ? String.fromCharCode(1611 + (q.correctAnswer as number || 0)) : q.correctAnswer}\n`
      })
    }
    
    return content
  }

  const printQuiz = () => {
    window.print()
  }

  const copyAllQuestions = () => {
    const content = generateExportContent()
    navigator.clipboard.writeText(content)
    toast.success("تم نسخ الأسئلة")
  }

  const shareQuiz = (platform: string) => {
    const text = `شاهد ${questions.length} سؤال تم توليدهم باستخدام مولد الأسئلة!`
    const url = window.location.href
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank')
        break
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent("أسئلة مولدة")}&body=${encodeURIComponent(text + "\n\n" + url)}`, '_blank')
        break
      default:
        navigator.clipboard.writeText(url)
        toast.success("تم نسخ الرابط")
    }
  }

  const resetQuiz = () => {
    setQuestions([])
    setStep("form")
    setActiveQuestion(null)
    setPreviewMode(false)
    setSettings({
      title: "",
      subject: "",
      grade: "",
      numQuestions: 5,
      difficulty: "mixed",
      questionTypes: ["mcq"],
      duration: 30,
      shuffleQuestions: false,
      showAnswers: true,
      includeExplanation: false,
      language: "ar",
    })
    setCustomTitle("")
    setCustomDescription("")
    setUploadedFile(null)
  }

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0)
  const allowedExports = getAllowedExports(userPlan)

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
            <Separator className="h-6" />
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <h1 className="text-lg font-bold">مولد الأسئلة</h1>
          </div>

          {step === "result" && (
            <div className="flex items-center gap-2">
              {/* Export Buttons with Icons */}
              {allowedExports.length > 0 && (
                <div className="flex items-center gap-1">
                  {allowedExports.map((format) => {
                    const { icon: Icon, color } = getExportIcon(format)
                    return (
                      <ExportGate
                        key={format}
                        onExport={() => exportQuiz(format)}
                        onDownloadWithWatermark={() => exportQuiz(format)}
                        variant="outline"
                        size="sm"
                        className={`px-2 ${color}`}
                        projectName="الاختبار"
                      >
                        <Icon className="w-4 h-4" />
                      </ExportGate>
                    )
                  })}
                </div>
              )}

              {/* Share Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 ml-1" />
                    مشاركة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>مشاركة الأسئلة</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-3 py-4">
                    <button
                      onClick={() => shareQuiz("twitter")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <Twitter className="w-6 h-6 text-sky-500" />
                      </div>
                      <span className="text-xs">تويتر</span>
                    </button>
                    <button
                      onClick={() => shareQuiz("facebook")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Facebook className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs">فيسبوك</span>
                    </button>
                    <button
                      onClick={() => shareQuiz("whatsapp")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <span className="text-xs">واتساب</span>
                    </button>
                    <button
                      onClick={() => shareQuiz("telegram")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <Send className="w-6 h-6 text-sky-500" />
                      </div>
                      <span className="text-xs">تيليجرام</span>
                    </button>
                    <button
                      onClick={() => shareQuiz("linkedin")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Linkedin className="w-6 h-6 text-blue-700" />
                      </div>
                      <span className="text-xs">لينكد إن</span>
                    </button>
                    <button
                      onClick={() => shareQuiz("email")}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-600" />
                      </div>
                      <span className="text-xs">بريد</span>
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              <ExportGate 
                onExport={printQuiz}
                onDownloadWithWatermark={printQuiz}
                exportLabel="طباعة"
                variant="outline"
                size="sm"
                projectName="الاختبار"
              >
                <Printer className="w-4 h-4 ml-1" />
                طباعة
              </ExportGate>
              <Button variant="default" size="sm" onClick={resetQuiz} className="bg-purple-500 hover:bg-purple-600">
                <RotateCcw className="w-4 h-4 ml-1" />
                جديد
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        {/* Form Step */}
        {step === "form" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Title Section */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                <HelpCircle className="w-10 h-10 text-purple-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                مولد الأسئلة
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                أنشئ أسئلة متنوعة بضغطة زر
              </p>
            </div>

            {/* Main Form Card */}
            <Card className="shadow-xl border-purple-100">
              <CardContent className="p-8 space-y-6">
                {/* Generator Type Selector */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">اختر نوع المولد</Label>
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
                </div>

                <Separator />

                {/* Subject Selection - Dynamic based on generator type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {generatorType === "school" ? "المادة" : 
                       generatorType === "company" ? "القسم" : 
                       generatorType === "government" ? "المجال" : 
                       generatorType === "individual" ? "الموضوع" : "الموضوع"}
                    </Label>
                    <Select 
                      value={settings.subject} 
                      onValueChange={(v) => setSettings({ ...settings, subject: v })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        {presets.subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grade - Only for school */}
                  {generatorType === "school" && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">الصف</Label>
                      <Select value={settings.grade} onValueChange={(v) => setSettings({ ...settings, grade: v })}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الصف" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((grade) => (
                            <SelectItem key={grade.value} value={grade.value}>{grade.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Number of Questions */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">عدد الأسئلة</Label>
                    <Select 
                      value={settings.numQuestions.toString()} 
                      onValueChange={(v) => setSettings({ ...settings, numQuestions: parseInt(v) })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="عدد الأسئلة" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num} سؤال</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    خيارات متقدمة
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Difficulty */}
                    <div className="space-y-2">
                      <Label className="text-sm">مستوى الصعوبة</Label>
                      <div className="flex gap-2">
                        {[
                          { value: "easy" as DifficultyLevel, label: "سهل", color: "bg-green-100 text-green-700 border-green-200" },
                          { value: "medium" as DifficultyLevel, label: "متوسط", color: "bg-blue-100 text-blue-700 border-blue-200" },
                          { value: "hard" as DifficultyLevel, label: "صعب", color: "bg-red-100 text-red-700 border-red-200" },
                          { value: "mixed" as DifficultyLevel, label: "مختلط", color: "bg-purple-100 text-purple-700 border-purple-200" },
                        ].map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setSettings({ ...settings, difficulty: level.value })}
                            className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                              settings.difficulty === level.value 
                                ? level.color + " ring-2 ring-offset-1" 
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question Types */}
                    <div className="space-y-2">
                      <Label className="text-sm">أنواع الأسئلة</Label>
                      <div className="flex flex-wrap gap-2">
                        {QUESTION_TYPES.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => handleQuestionTypeToggle(type.value)}
                            className={`py-2 px-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                              settings.questionTypes.includes(type.value)
                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm">خلط الأسئلة</Label>
                      <Switch
                        checked={settings.shuffleQuestions}
                        onCheckedChange={(v) => setSettings({ ...settings, shuffleQuestions: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm">إظهار الإجابات</Label>
                      <Switch
                        checked={settings.showAnswers}
                        onCheckedChange={(v) => setSettings({ ...settings, showAnswers: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm">إضافة تفسير</Label>
                      <Switch
                        checked={settings.includeExplanation}
                        onCheckedChange={(v) => setSettings({ ...settings, includeExplanation: v })}
                      />
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateQuestions}
                  disabled={isGenerating || settings.questionTypes.length === 0}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                      جاري توليد الأسئلة...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="w-5 h-5 ml-2" />
                      توليد الأسئلة
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Generating Step */}
        {step === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 rounded-full border-4 border-purple-100 border-t-purple-500"
              />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mt-6 mb-2">جاري توليد الأسئلة...</h3>
            <p className="text-gray-500">نقوم بإنشاء {settings.numQuestions} سؤال متنوع لك</p>
          </motion.div>
        )}

        {/* Result Step */}
        {step === "result" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block"
          >
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 print:hidden">
              {/* Quiz Info */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    معلومات الأسئلة
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">النوع:</span>
                      <Badge variant="outline">{GENERATOR_TYPES.find(t => t.value === generatorType)?.label}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المادة/الموضوع:</span>
                      <span className="font-medium">{settings.subject || "غير محدد"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">عدد الأسئلة:</span>
                      <Badge variant="secondary">{questions.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">إجمالي الدرجات:</span>
                      <Badge className="bg-purple-500">{totalMarks}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">قائمة الأسئلة</h3>
                    <Badge variant="secondary">{questions.length}</Badge>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <AnimatePresence>
                      {questions.map((q, index) => (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            activeQuestion?.id === q.id ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-muted/30 hover:bg-muted/50'
                          }`}
                          onClick={() => setActiveQuestion(q)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="text-sm truncate max-w-[150px]">
                                {q.question || "سؤال جديد"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {QUESTION_TYPES.find(t => t.value === q.type)?.label}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeQuestion(q.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Add Question Buttons */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">إضافة سؤال:</p>
                    <div className="flex flex-wrap gap-1">
                      {QUESTION_TYPES.slice(0, 4).map((type) => (
                        <Button
                          key={type.value}
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => addQuestion(type.value)}
                        >
                          <Plus className="w-3 h-3 ml-1" />
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <Button variant="outline" className="w-full" onClick={copyAllQuestions}>
                    <Copy className="w-4 h-4 ml-2" />
                    نسخ جميع الأسئلة
                  </Button>
                  <Button variant="outline" className="w-full" onClick={regenerateQuestions}>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    إعادة توليد
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview / Editor */}
            <div className="lg:col-span-2 print:w-full">
              {previewMode && !activeQuestion ? (
                // Preview Mode - Shows all questions
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-500" />
                        معاينة الأسئلة
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveQuestion(questions[0])}>
                          <Sparkles className="w-4 h-4 ml-1" />
                          تعديل
                        </Button>
                        <Button variant="default" size="sm" onClick={regenerateQuestions} className="bg-purple-500 hover:bg-purple-600">
                          <RefreshCw className="w-4 h-4 ml-1" />
                          توليد جديد
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {questions.map((q, index) => (
                        <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium mb-2">{q.question}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {QUESTION_TYPES.find(t => t.value === q.type)?.label}
                                </Badge>
                                <span className="text-xs text-gray-500">{q.marks} درجة</span>
                              </div>
                              {q.type === "mcq" && q.options && (
                                <div className="grid grid-cols-2 gap-2 mr-2">
                                  {q.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <span className="w-5 h-5 border rounded-full flex items-center justify-center text-xs">
                                        {String.fromCharCode(1611 + i)}
                                      </span>
                                      <span className="text-gray-600">{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : activeQuestion ? (
                // Edit Mode
                <Card className="print:border-0 print:shadow-none">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between print:hidden">
                      <h3 className="font-bold">تعديل السؤال</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveQuestion(null)}>
                          <Eye className="w-4 h-4 ml-1" />
                          معاينة
                        </Button>
                        <span className="text-xs text-muted-foreground">الدرجة:</span>
                        <Input
                          type="number"
                          value={activeQuestion.marks}
                          onChange={(e) => updateQuestion(activeQuestion.id, { marks: Number(e.target.value) })}
                          className="w-16 text-center"
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>نص السؤال</Label>
                      <Textarea
                        value={activeQuestion.question}
                        onChange={(e) => updateQuestion(activeQuestion.id, { question: e.target.value })}
                        placeholder="أدخل نص السؤال هنا..."
                        rows={3}
                      />
                    </div>

                    {activeQuestion.type === "mcq" && (
                      <div className="space-y-3">
                        <Label>الخيارات</Label>
                      {activeQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Button
                              variant={activeQuestion.correctAnswer === index ? "default" : "outline"}
                              size="sm"
                              className={`w-8 h-8 p-0 ${activeQuestion.correctAnswer === index ? 'bg-green-500' : ''}`}
                              onClick={() => updateQuestion(activeQuestion.id, { correctAnswer: index })}
                            >
                              {String.fromCharCode(1611 + index)}
                            </Button>
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(activeQuestion.options || [])]
                                newOptions[index] = e.target.value
                                updateQuestion(activeQuestion.id, { options: newOptions })
                              }}
                              placeholder={`الخيار ${String.fromCharCode(1611 + index)}`}
                            />
                          </div>
                        ))}
                        <p className="text-xs text-muted-foreground">اضغط على الحرف لتحديد الإجابة الصحيحة</p>
                      </div>
                    )}

                    {activeQuestion.type === "truefalse" && (
                      <div className="space-y-3">
                        <Label>الإجابة الصحيحة</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={activeQuestion.correctAnswer === true ? "default" : "outline"}
                            className={`flex-1 ${activeQuestion.correctAnswer === true ? 'bg-green-500' : ''}`}
                            onClick={() => updateQuestion(activeQuestion.id, { correctAnswer: true })}
                          >
                            <Check className="w-4 h-4 ml-1" />
                            صح
                          </Button>
                          <Button
                            variant={activeQuestion.correctAnswer === false ? "default" : "outline"}
                            className={`flex-1 ${activeQuestion.correctAnswer === false ? 'bg-red-500' : ''}`}
                            onClick={() => updateQuestion(activeQuestion.id, { correctAnswer: false })}
                          >
                            <X className="w-4 h-4 ml-1" />
                            خطأ
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeQuestion.type === "fillblank" && (
                      <div className="space-y-3">
                        <Label>الإجابة الصحيحة</Label>
                        <Input
                          value={activeQuestion.correctAnswer as string}
                          onChange={(e) => updateQuestion(activeQuestion.id, { correctAnswer: e.target.value })}
                          placeholder="أدخل الإجابة الصحيحة"
                        />
                      </div>
                    )}

                    {settings.includeExplanation && (
                      <div className="space-y-2">
                        <Label>تفسير الإجابة</Label>
                        <Textarea
                          value={activeQuestion.explanation || ""}
                          onChange={(e) => updateQuestion(activeQuestion.id, { explanation: e.target.value })}
                          placeholder="أضف تفسيراً للإجابة الصحيحة..."
                          rows={2}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Generator Types for display
const GENERATOR_TYPES = [
  { value: "school" as GeneratorType, label: "المدارس" },
  { value: "company" as GeneratorType, label: "الشركات" },
  { value: "government" as GeneratorType, label: "الجهات" },
  { value: "individual" as GeneratorType, label: "الأفراد" },
  { value: "custom" as GeneratorType, label: "مخصص" },
]
