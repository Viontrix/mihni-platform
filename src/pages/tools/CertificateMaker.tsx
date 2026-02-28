"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  GeneratorTypeSelector,
  useGeneratorType
} from "@/components/tools/GeneratorTypeSelector"
import ExportGate from "@/components/ExportGate"
import { ROUTES } from "@/lib/routes"
import {
  ArrowRight,
  Award,
  Download,
  Printer,
  Upload,
  Check,
  Plus,
  Trash2,
  Globe,
  Pencil,
  Eraser,
  FileSpreadsheet,
  Share2,
  Link2,
  Mail,
  MessageCircle,
  Maximize2,
  Minimize2,
  Square,
  Minus,
  Palette,
  Type,
  Layout,
  FileText,
  Calendar,
  Sparkles,
  Crown,
  Star,
} from "lucide-react"

// ============================================================
// Types
// ============================================================

type Orientation = "portrait" | "landscape"
type CertificateType =
  | "appreciation"
  | "honor"
  | "attendance"
  | "participation"
  | "completion"
  | "excellence"
type TemplateStyle =
  | "elegant"
  | "corporate"
  | "academic"
  | "modern"
  | "islamic"
  | "minimal"
  | "luxury"
  | "geometric"
  | "nature"
  | "tech"
  | "custom"
  | "blank"
type RecipientBoxStyle =
  | "rounded"
  | "sharp"
  | "dotted"
  | "solid"
  | "thin-border"
  | "none"
type DateFormat =
  | "d-m-y-text"
  | "d-m-y-num"
  | "y-m-d-num"
  | "full-text"
  | "short"

interface SignatureField {
  id: string
  label: string
  name: string
  title: string
  signatureImage: string | null
  position: { x: number; y: number }
  scale: number
}

type LogoAlignment = "right" | "center" | "left"

interface LogoConfig {
  id: string
  src: string
  name: string
  position: LogoAlignment
  size: number
}

interface CertificateData {
  type: CertificateType
  title: string
  subtitle: string
  recipientName: string
  introText: string
  description: string
  date: string
  signatures: SignatureField[]
  logos: LogoConfig[]
  useHijriDate: boolean
  dateFormat: DateFormat
}

// ============================================================
// Constants
// ============================================================

const CERTIFICATE_TYPES = [
  {
    value: "appreciation",
    label: "شهادة تقدير",
    icon: Star,
    defaults: {
      title: "شهادة تقدير",
      subtitle: "تقديراً للجهود المتميزة",
      description: "تقديراً للجهود المتميزة والإنجازات القيمة",
    },
  },
  {
    value: "honor",
    label: "شهادة تفوق",
    icon: Crown,
    defaults: {
      title: "شهادة تفوق",
      subtitle: "التفوق الأكاديمي",
      description: "تقديراً للتفوق الدراسي والإنجازات الأكاديمية",
    },
  },
  {
    value: "attendance",
    label: "شهادة حضور",
    icon: Calendar,
    defaults: {
      title: "شهادة حضور",
      subtitle: "الالتزام والانتظام",
      description: "شهادة حضور وانضباط طوال فترة البرنامج",
    },
  },
  {
    value: "participation",
    label: "شهادة مشاركة",
    icon: Sparkles,
    defaults: {
      title: "شهادة مشاركة",
      subtitle: "المشاركة الفعالة",
      description: "تقديراً للمشاركة الإيجابية والتفاعل المتميز",
    },
  },
  {
    value: "completion",
    label: "شهادة إتمام",
    icon: Check,
    defaults: {
      title: "شهادة إتمام",
      subtitle: "إتمام البرنامج بنجاح",
      description: "تم بحمد الله إتمام البرنامج التدريبي بنجاح",
    },
  },
  {
    value: "excellence",
    label: "شهادة امتياز",
    icon: Award,
    defaults: {
      title: "شهادة امتياز",
      subtitle: "التميز في الأداء",
      description: "تقديراً للأداء المتميز والإنجازات الاستثنائية",
    },
  },
] as const

const TEMPLATES = [
  { id: "elegant", label: "أنيق", icon: Crown },
  { id: "corporate", label: "شركات", icon: Layout },
  { id: "academic", label: "أكاديمي", icon: Award },
  { id: "modern", label: "عصري", icon: Sparkles },
  { id: "islamic", label: "إسلامي", icon: Star },
  { id: "minimal", label: "بسيط", icon: Minus },
  { id: "luxury", label: "فاخر", icon: Crown },
  { id: "geometric", label: "هندسي", icon: Square },
  { id: "nature", label: "طبيعة", icon: Layout },
  { id: "tech", label: "تقني", icon: Sparkles },
  { id: "custom", label: "مخصص", icon: Upload },
  { id: "blank", label: "فارغ", icon: Square },
] as const

const RECIPIENT_BOX_STYLES = [
  { value: "rounded", label: "زوايا ناعمة" },
  { value: "sharp", label: "زوايا حادة" },
  { value: "dotted", label: "خط منقط" },
  { value: "solid", label: "حدود كاملة" },
  { value: "thin-border", label: "حد نحيف" },
  { value: "none", label: "بدون مستطيل" },
] as const

const DATE_FORMATS = [
  { value: "d-m-y-text", label: "15 - فبراير - 2024" },
  { value: "d-m-y-num", label: "15 / 02 / 2024" },
  { value: "y-m-d-num", label: "2024 / 02 / 15" },
  { value: "full-text", label: "الخميس 15 فبراير 2024" },
  { value: "short", label: "15/02/24" },
] as const

const COLOR_PALETTES = [
  { id: "royal", name: "ملكي", primary: "#1e3a8a", secondary: "#fbbf24" },
  { id: "emerald", name: "زمردي", primary: "#064e3b", secondary: "#10b981" },
  { id: "crimson", name: "قرمزي", primary: "#7f1d1d", secondary: "#dc2626" },
  { id: "midnight", name: "ليلي", primary: "#0f172a", secondary: "#3b82f6" },
  { id: "golden", name: "ذهبي", primary: "#78350f", secondary: "#f59e0b" },
  { id: "purple", name: "بنفسجي", primary: "#581c87", secondary: "#a855f7" },
  { id: "teal", name: "فيروزي", primary: "#134e4a", secondary: "#14b8a6" },
  { id: "rose", name: "وردي", primary: "#881337", secondary: "#f43f5e" },
  { id: "slate", name: "رمادي", primary: "#1e293b", secondary: "#64748b" },
  { id: "orange", name: "برتقالي", primary: "#7c2d12", secondary: "#f97316" },
  { id: "navy", name: "كحلي", primary: "#1e3a5f", secondary: "#2563eb" },
  { id: "burgundy", name: "خمري", primary: "#4c0519", secondary: "#be123c" },
]

const ARABIC_FONTS = [
  { label: "Cairo", value: "Cairo" },
  { label: "Tajawal", value: "Tajawal" },
  { label: "Almarai", value: "Almarai" },
  { label: "Amiri", value: "Amiri" },
  { label: "Changa", value: "Changa" },
  { label: "Noto Kufi Arabic", value: "Noto Kufi Arabic" },
  { label: "Reem Kufi", value: "Reem Kufi" },
  { label: "IBM Plex Sans Arabic", value: "IBM Plex Sans Arabic" },
  { label: "Scheherazade New", value: "Scheherazade New" },
  { label: "Noto Naskh Arabic", value: "Noto Naskh Arabic" },
  { label: "Lateef", value: "Lateef" },
  { label: "Jomhuria", value: "Jomhuria" },
  { label: "Mada", value: "Mada" },
  { label: "Baloo Bhaijaan 2", value: "Baloo Bhaijaan 2" },
  { label: "El Messiri", value: "El Messiri" },
  { label: "Lalezar", value: "Lalezar" },
]

// Predefined logos
const PRESET_LOGOS = [
  {
    id: "education",
    name: "وزارة التعليم",
    src: "https://www.arrajol.com/sites/default/files/styles/amp_800x800_1/public/2022-02/Ministry%20Of%20Education%20%281%29.jpg",
    defaultPosition: "right" as LogoAlignment,
  },
  {
    id: "vision2030",
    name: "رؤية 2030",
    src: "https://arpng.deminasi.com/wp-content/uploads/2021/08/%D8%B4%D8%B9%D8%A7%D8%B1-%D8%B1%D8%A4%D9%8A%D8%A9-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-2030-PNG.png",
    defaultPosition: "left" as LogoAlignment,
  },
]

function getGoogleFontsLink(fonts: string[]) {
  const uniqueFonts = [...new Set([...fonts, ...ARABIC_FONTS.map((f) => f.value)])]
  const families = uniqueFonts
    .map((f) => f.replace(/ /g, "+") + ":wght@300;400;500;600;700;800;900")
    .join("&family=")
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function gregorianToHijri(date: Date): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  } catch {
    return date.toLocaleDateString("ar-SA")
  }
}

function formatDate(dateStr: string, useHijri: boolean, format: DateFormat): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  if (useHijri) {
    return gregorianToHijri(date)
  }

  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const y = date.getFullYear()
  const shortY = y.toString().slice(-2)

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ]
  const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

  switch (format) {
    case "d-m-y-text":
      return `${d} - ${months[date.getMonth()]} - ${y}`
    case "d-m-y-num":
      return `${d} / ${m} / ${y}`
    case "y-m-d-num":
      return `${y} / ${m} / ${d}`
    case "full-text":
      return `${days[date.getDay()]} ${d} ${months[date.getMonth()]} ${y}`
    case "short":
      return `${d}/${m}/${shortY}`
    default:
      return date.toLocaleDateString("ar-SA")
  }
}

// ============================================================
// Signature Canvas Component
// ============================================================

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void
  onCancel: () => void
  existingSignature?: string | null
}

function SignatureCanvas({ onSave, onCancel, existingSignature }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(2)

  useEffect(() => {
    if (existingSignature && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          }
        }
      }
      img.src = existingSignature
    }
  }, [existingSignature])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = (e as React.MouseEvent<HTMLCanvasElement>).clientX
      clientY = (e as React.MouseEvent<HTMLCanvasElement>).clientY
    }
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    const { x, y } = getCoordinates(e)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(x, y)
        ctx.strokeStyle = color
        ctx.lineWidth = brushSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => setIsDrawing(false)

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer)
        const isEmpty = !pixelBuffer.some((color) => color !== 0)
        onSave(isEmpty ? "" : canvas.toDataURL("image/png"))
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-[#1B2D2B] rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <h3 className="text-lg font-bold mb-4 text-center">رسم التوقيع</h3>
        <div className="mb-4 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <Label className="text-xs">اللون:</Label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">الحجم:</Label>
            <input
              type="range"
              min="1"
              max="5"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={350}
          height={150}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-full cursor-crosshair touch-none bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <p className="text-xs text-muted-foreground text-center mt-2">
          يمكنك الرسم بالماوس أو بالإصبع
        </p>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={clearCanvas} className="flex-1">
            <Eraser className="w-4 h-4 ml-1" />
            مسح
          </Button>
          <Button variant="outline" size="sm" onClick={onCancel} className="flex-1">
            إلغاء
          </Button>
          <Button size="sm" onClick={handleSave} className="flex-1 bg-green-primary hover:bg-green-teal">
            <Check className="w-4 h-4 ml-1" />
            حفظ
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// Main Component
// ============================================================

export default function CertificateMakerPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [orientation, setOrientation] = useState<Orientation>("landscape")
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>("elegant")
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0])
  const [customPrimary, setCustomPrimary] = useState("#1e3a8a")
  const [customSecondary, setCustomSecondary] = useState("#fbbf24")
  const [titleFont, setTitleFont] = useState("Cairo")
  const [bodyFont, setBodyFont] = useState("Tajawal")
  const [titleSize, setTitleSize] = useState(42)
  const [bodySize, setBodySize] = useState(18)
  const [subtitleSize] = useState(20)
  const [recipientNameSize, setRecipientNameSize] = useState(32)
  const [borderWidth] = useState(4)
  const [borderRadius] = useState(0)
  const [drawingSignatureId, setDrawingSignatureId] = useState<string | null>(null)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [recipientBoxStyle, setRecipientBoxStyle] = useState<RecipientBoxStyle>("rounded")

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

  // Certificate defaults based on generator type
  const getCertificateDefaults = () => {
    switch (generatorType) {
      case "company":
        return {
          type: "appreciation" as CertificateType,
          title: "شهادة تقدير",
          subtitle: "تقديراً للإنجازات المتميزة",
          introText: "تُمنح هذه الشهادة لـ",
          description: "تقديراً للجهود المتميزة والمساهمة في نجاح الفريق",
          signatures: [
            { id: "s1", label: "المدير التنفيذي", name: "", title: "", signatureImage: null, position: { x: 50, y: 20 }, scale: 1 },
            { id: "s2", label: "مدير الموارد البشرية", name: "", title: "", signatureImage: null, position: { x: 200, y: 20 }, scale: 1 },
          ]
        }
      case "government":
        return {
          type: "honor" as CertificateType,
          title: "شهادة تكريم",
          subtitle: "تقديراً للخدمات المتميزة",
          introText: "تُمنح هذه الشهادة لـ",
          description: "تقديراً للخدمات المتميزة والالتزام بالمهنية العالية",
          signatures: [
            { id: "s1", label: "سعادة الوزير", name: "", title: "", signatureImage: null, position: { x: 50, y: 20 }, scale: 1 },
            { id: "s2", label: "سعادة الوكيل", name: "", title: "", signatureImage: null, position: { x: 200, y: 20 }, scale: 1 },
          ]
        }
      case "individual":
        return {
          type: "participation" as CertificateType,
          title: "شهادة مشاركة",
          subtitle: "شكراً لمشاركتكم",
          introText: "تُمنح هذه الشهادة لـ",
          description: "شكراً على المشاركة الفعالة والتفاعل الإيجابي",
          signatures: [
            { id: "s1", label: "منظم الفعالية", name: "", title: "", signatureImage: null, position: { x: 50, y: 20 }, scale: 1 },
          ]
        }
      default: // school
        return {
          type: "appreciation" as CertificateType,
          title: "شهادة تقدير",
          subtitle: "تقديراً للجهود المتميزة",
          introText: "يسرنا",
          description: "تقديراً للجهود المتميزة والإنجازات القيمة",
          signatures: [
            { id: "s1", label: "المدير", name: "", title: "", signatureImage: null, position: { x: 50, y: 20 }, scale: 1 },
            { id: "s2", label: "المعلم", name: "", title: "", signatureImage: null, position: { x: 200, y: 20 }, scale: 1 },
          ]
        }
    }
  }

  const [certificate, setCertificate] = useState<CertificateData>({
    type: "appreciation",
    title: "شهادة تقدير",
    subtitle: "تقديراً للجهود المتميزة",
    recipientName: "",
    introText: "يسرنا",
    description: "تقديراً للجهود المتميزة والإنجازات القيمة",
    date: new Date().toISOString().split("T")[0],
    signatures: [
      {
        id: "s1",
        label: "المدير",
        name: "",
        title: "",
        signatureImage: null,
        position: { x: 50, y: 20 },
        scale: 1,
      },
      {
        id: "s2",
        label: "المعلم",
        name: "",
        title: "",
        signatureImage: null,
        position: { x: 200, y: 20 },
        scale: 1,
      },
    ],
    logos: [],
    useHijriDate: false,
    dateFormat: "d-m-y-text",
  })

  // Update certificate when generator type changes
  useEffect(() => {
    const defaults = getCertificateDefaults()
    setCertificate(prev => ({
      ...prev,
      type: defaults.type,
      title: defaults.title,
      subtitle: defaults.subtitle,
      introText: defaults.introText,
      description: defaults.description,
      signatures: defaults.signatures
    }))
  }, [generatorType])

  const [batchMode, setBatchMode] = useState(false)
  const [batchNames, setBatchNames] = useState("")
  const [customTemplateImage, setCustomTemplateImage] = useState<string | null>(null)

  const certRef = useRef<HTMLDivElement>(null)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const templateFileRef = useRef<HTMLInputElement>(null)
  const excelFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const allFonts = [...ARABIC_FONTS.map((f) => f.value)]
    const id = "cert-google-fonts"
    const existingLink = document.getElementById(id)
    if (existingLink) existingLink.remove()
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = getGoogleFontsLink(allFonts)
    document.head.appendChild(link)
  }, [])

  const primaryColor = customPrimary
  const secondaryColor = customSecondary

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCertificate((prev) => ({ ...prev, date: e.target.value }))
  }

  const toggleHijriDate = (checked: boolean) => {
    setCertificate((prev) => ({ ...prev, useHijriDate: checked }))
  }

  const handleTypeChange = (type: CertificateType) => {
    const config = CERTIFICATE_TYPES.find((t) => t.value === type)
    if (config) {
      setCertificate((prev) => ({
        ...prev,
        type,
        title: config.defaults.title,
        subtitle: config.defaults.subtitle,
        description: config.defaults.description,
      }))
    }
  }

  const handlePaletteChange = (paletteId: string) => {
    const p = COLOR_PALETTES.find((c) => c.id === paletteId)
    if (p) {
      setSelectedPalette(p)
      setCustomPrimary(p.primary)
      setCustomSecondary(p.secondary)
    }
  }

  const addLogo = (src: string, name: string, position: LogoAlignment) => {
    const newLogo: LogoConfig = {
      id: `logo-${Date.now()}`,
      src,
      name,
      position,
      size: 60,
    }
    setCertificate((prev) => ({ ...prev, logos: [...prev.logos, newLogo] }))
  }

  const removeLogo = (id: string) => {
    setCertificate((prev) => ({
      ...prev,
      logos: prev.logos.filter((l) => l.id !== id),
    }))
  }

  const updateLogoPosition = (id: string, position: LogoAlignment) => {
    setCertificate((prev) => ({
      ...prev,
      logos: prev.logos.map((l) => (l.id === id ? { ...l, position } : l)),
    }))
  }

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => addLogo(reader.result as string, file.name, "center")
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleTemplateUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCustomTemplateImage(reader.result as string)
      setTemplateStyle("custom")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const loadTemplateFromURL = () => {
    const url = prompt("أدخل رابط صورة التصميم:")
    if (url) {
      setCustomTemplateImage(url)
      setTemplateStyle("custom")
    }
  }

  const handleExcelImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split(/\r?\n/).filter((line) => line.trim())
        const names = lines
          .map((line) => line.split(",")[0]?.trim())
          .filter(Boolean)
          .join("\n")
        setBatchNames(names)
        setBatchMode(true)
        alert(`تم استيراد ${names.split("\n").filter(Boolean).length} اسم`)
      } catch {
        alert("خطأ في قراءة الملف")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const addSignature = () => {
    setCertificate((prev) => ({
      ...prev,
      signatures: [
        ...prev.signatures,
        {
          id: `s${Date.now()}`,
          label: "توقيع جديد",
          name: "",
          title: "",
          signatureImage: null,
          position: { x: 50 + prev.signatures.length * 150, y: 20 },
          scale: 1,
        },
      ],
    }))
  }

  const removeSignature = (id: string) => {
    setCertificate((prev) => ({
      ...prev,
      signatures: prev.signatures.filter((s) => s.id !== id),
    }))
  }

  const updateSignature = (id: string, field: keyof SignatureField, value: any) => {
    setCertificate((prev) => ({
      ...prev,
      signatures: prev.signatures.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }))
  }

  const handleSignatureImageUpload = (e: ChangeEvent<HTMLInputElement>, sigId: string) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateSignature(sigId, "signatureImage", reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleShare = async (type: string) => {
    const url = window.location.href
    const text = `شهادة: ${certificate.title} - ${certificate.recipientName}`

    switch (type) {
      case "copy":
        await navigator.clipboard.writeText(url)
        alert("تم نسخ الرابط!")
        break
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
        break
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(certificate.title)}&body=${encodeURIComponent(text + "\n" + url)}`
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        )
        break
    }
    setShowShareMenu(false)
  }

  const handlePrint = () => {
    const el = certRef.current
    if (!el) return
    const pw = window.open("", "_blank")
    if (!pw) return

    const isLandscape = orientation === "landscape"
    const w = isLandscape ? "297mm" : "210mm"
    const h = isLandscape ? "210mm" : "297mm"
    const allFonts = [...ARABIC_FONTS.map((f) => f.value)]
    const fontLinks = getGoogleFontsLink(allFonts)

    const printContent =
      batchMode && batchNames.trim()
        ? batchNames
            .split("\n")
            .map((n) => n.trim())
            .filter(Boolean)
            .map(
              (name) =>
                `<div class="page">${el.outerHTML.replace(
                  certificate.recipientName || "_______________",
                  name
                )}</div>`
            )
            .join("")
        : `<div class="page">${el.outerHTML}</div>`

    pw.document.write(
      `<!DOCTYPE html><html dir="rtl" lang="ar"><head>
      <meta charset="UTF-8"><title>${certificate.title}</title>
      <link rel="stylesheet" href="${fontLinks}">
      <style>
        @page { size: ${w} ${h}; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: '${bodyFont}', sans-serif; }
        .page { width: ${w}; height: ${h}; page-break-after: always; display: flex; align-items: center; justify-content: center; position: relative; }
        .page > div { width: 100% !important; height: 100% !important; }
      </style></head><body>${printContent}</body></html>`
    )

    pw.document.close()
    pw.focus()
    setTimeout(() => pw.print(), 600)
  }

  const getTemplateStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: `'${bodyFont}', sans-serif`,
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#fff",
      borderRadius: `${borderRadius}px`,
    }

    if (templateStyle === "blank") return { ...base, backgroundColor: "#fff" }
    if (templateStyle === "custom" && customTemplateImage) {
      return {
        ...base,
        backgroundImage: `url(${customTemplateImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }

    const p = primaryColor
    const s = secondaryColor

    switch (templateStyle) {
      case "elegant":
        return {
          ...base,
          background: `linear-gradient(135deg, ${hexToRgba(p, 0.03)} 0%, #fff 50%, ${hexToRgba(s, 0.03)} 100%)`,
          border: `${borderWidth}px solid ${p}`,
        }
      case "corporate":
        return {
          ...base,
          background: `#fff`,
          borderTop: `${borderWidth * 2}px solid ${p}`,
          borderBottom: `${borderWidth * 2}px solid ${s}`,
        }
      case "academic":
        return {
          ...base,
          background: `linear-gradient(to bottom, ${hexToRgba(p, 0.05)} 0%, #fff 20%, #fff 80%, ${hexToRgba(p, 0.05)} 100%)`,
          border: `${borderWidth}px double ${p}`,
        }
      case "modern":
        return {
          ...base,
          background: `#fff`,
          border: `${borderWidth}px solid ${p}`,
          clipPath: orientation === "landscape" 
            ? "polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)" 
            : "polygon(0 0, 100% 0, 100% 98%, 90% 100%, 0 100%)",
        }
      case "islamic":
        return {
          ...base,
          background: `radial-gradient(circle at 20% 50%, ${hexToRgba(p, 0.05)} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${hexToRgba(s, 0.05)} 0%, transparent 50%), #fff`,
          border: `${borderWidth}px solid ${p}`,
        }
      case "minimal":
        return {
          ...base,
          background: `#fff`,
          borderTop: `${borderWidth}px solid ${p}`,
          borderRight: `${borderWidth}px solid ${s}`,
        }
      case "luxury":
        return {
          ...base,
          background: `linear-gradient(135deg, ${hexToRgba(s, 0.1)} 0%, #fff 30%, #fff 70%, ${hexToRgba(p, 0.05)} 100%)`,
          border: `${borderWidth + 2}px solid ${s}`,
        }
      case "geometric":
        return {
          ...base,
          background: `repeating-linear-gradient(45deg, ${hexToRgba(p, 0.02)}, ${hexToRgba(p, 0.02)} 10px, transparent 10px, transparent 20px)`,
          border: `${borderWidth}px solid ${p}`,
        }
      case "nature":
        return {
          ...base,
          background: `linear-gradient(180deg, ${hexToRgba(s, 0.1)} 0%, #fff 100%)`,
          border: `${borderWidth}px solid ${p}`,
        }
      case "tech":
        return {
          ...base,
          background: `linear-gradient(135deg, #f8fafc 0%, #fff 100%)`,
          border: `${borderWidth}px solid ${p}`,
          boxShadow: `inset 0 0 20px ${hexToRgba(p, 0.1)}`,
        }
      default:
        return base
    }
  }

  const getRecipientBoxStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-block",
      padding: "0.5rem 2rem",
    }

    switch (recipientBoxStyle) {
      case "rounded":
        return {
          ...base,
          borderRadius: "0.5rem",
          border: `2px solid ${hexToRgba(primaryColor, 0.3)}`,
          background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.08)}, ${hexToRgba(secondaryColor, 0.08)})`,
        }
      case "sharp":
        return {
          ...base,
          borderRadius: "0",
          border: `2px solid ${hexToRgba(primaryColor, 0.3)}`,
          background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.08)}, ${hexToRgba(secondaryColor, 0.08)})`,
        }
      case "dotted":
        return {
          ...base,
          borderRadius: "0.5rem",
          border: `2px dotted ${hexToRgba(primaryColor, 0.5)}`,
          background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.05)}, ${hexToRgba(secondaryColor, 0.05)})`,
        }
      case "solid":
        return {
          ...base,
          borderRadius: "0.5rem",
          border: `3px solid ${primaryColor}`,
          background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.1)}, ${hexToRgba(secondaryColor, 0.1)})`,
        }
      case "thin-border":
        return {
          ...base,
          borderRadius: "0.25rem",
          border: `1px solid ${hexToRgba(primaryColor, 0.4)}`,
          background: "transparent",
        }
      case "none":
        return {
          background: "transparent",
          border: "none",
          padding: "0.25rem 1rem",
        }
      default:
        return base
    }
  }

  const logosByPosition = useMemo(() => {
    const grouped = {
      right: [] as LogoConfig[],
      center: [] as LogoConfig[],
      left: [] as LogoConfig[],
    }
    certificate.logos.forEach((logo) => grouped[logo.position].push(logo))
    return grouped
  }, [certificate.logos])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Award className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    )
  }

  const isLandscape = orientation === "landscape"
  const certWidth = isLandscape ? 800 : 565
  const certHeight = isLandscape ? 565 : 800

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {drawingSignatureId && (
        <SignatureCanvas
          onSave={(data) => {
            updateSignature(drawingSignatureId, "signatureImage", data)
            setDrawingSignatureId(null)
          }}
          onCancel={() => setDrawingSignatureId(null)}
          existingSignature={
            certificate.signatures.find((s) => s.id === drawingSignatureId)?.signatureImage
          }
        />
      )}

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
            <Award className="w-5 h-5 text-green-primary" />
            <h1 className="text-lg font-bold">منشئ الشهادات</h1>
          </div>

          <div className="flex items-center gap-2">
            <ExportGate 
              onExport={handlePrint}
              onDownloadWithWatermark={handlePrint}
              exportLabel="طباعة"
              variant="outline"
              size="sm"
              projectName="الشهادة"
            >
              <Printer className="w-4 h-4 ml-1" />
              طباعة
            </ExportGate>
            <ExportGate 
              onExport={handlePrint}
              onDownloadWithWatermark={handlePrint}
              exportLabel="تحميل PDF"
              variant="default"
              size="sm"
              className="bg-green-primary hover:bg-green-teal"
              projectName="الشهادة"
            >
              <Download className="w-4 h-4 ml-1" />
              تحميل PDF
            </ExportGate>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 left-0 bg-white dark:bg-[#1B2D2B] border rounded-xl shadow-xl p-2 flex flex-col gap-1 z-50 min-w-[140px]"
                  >
                    <Button variant="ghost" size="sm" className="justify-start text-xs" onClick={() => handleShare("copy")}>
                      <Link2 className="w-3 h-3 ml-2" />
                      نسخ الرابط
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-xs" onClick={() => handleShare("whatsapp")}>
                      <MessageCircle className="w-3 h-3 ml-2" />
                      واتساب
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-xs" onClick={() => handleShare("email")}>
                      <Mail className="w-3 h-3 ml-2" />
                      بريد
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start text-xs" onClick={() => handleShare("twitter")}>
                      <Globe className="w-3 h-3 ml-2" />
                      تويتر
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-0 min-h-[calc(100vh-60px)]">
        {/* Sidebar with Tabs */}
        <aside className="w-full lg:w-[400px] border-l border-border bg-white dark:bg-[#1B2D2B] overflow-y-auto lg:max-h-[calc(100vh-60px)]">
          {/* Generator Type Selector */}
          <div className="p-4 border-b border-border">
            <Label className="text-sm font-medium mb-3 block">اختر نوع الشهادة</Label>
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none border-b bg-muted/50 p-0 h-12">
              <TabsTrigger value="content" className="rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-[#1B2D2B] data-[state=active]:border-b-2 data-[state=active]:border-green-primary">
                <FileText className="w-4 h-4 ml-1" />
                المحتوى
              </TabsTrigger>
              <TabsTrigger value="design" className="rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-[#1B2D2B] data-[state=active]:border-b-2 data-[state=active]:border-green-primary">
                <Palette className="w-4 h-4 ml-1" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="fonts" className="rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-[#1B2D2B] data-[state=active]:border-b-2 data-[state=active]:border-green-primary">
                <Type className="w-4 h-4 ml-1" />
                الخطوط
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="p-4 space-y-5 mt-0">
              {/* Certificate Type */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">نوع الشهادة</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CERTIFICATE_TYPES.map((ct) => (
                    <Button
                      key={ct.value}
                      variant={certificate.type === ct.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeChange(ct.value as CertificateType)}
                      className={`text-xs justify-start h-auto py-2 ${certificate.type === ct.value ? 'bg-green-primary hover:bg-green-teal' : ''}`}
                    >
                      <ct.icon className="w-4 h-4 ml-1" />
                      {ct.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Content Fields */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">بيانات الشهادة</Label>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">عنوان الشهادة</Label>
                  <Input
                    value={certificate.title}
                    onChange={(e) => setCertificate((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">العنوان الفرعي</Label>
                  <Input
                    value={certificate.subtitle}
                    onChange={(e) => setCertificate((prev) => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">نص المقدمة</Label>
                  <Input
                    value={certificate.introText}
                    onChange={(e) => setCertificate((prev) => ({ ...prev, introText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">اسم المكرم</Label>
                  <Input
                    value={certificate.recipientName}
                    onChange={(e) => setCertificate((prev) => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="أدخل اسم المكرم"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">الوصف</Label>
                  <Textarea
                    value={certificate.description}
                    onChange={(e) => setCertificate((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Date */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">التاريخ</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={certificate.date}
                    onChange={handleDateChange}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2 bg-muted px-3 rounded-md">
                    <Switch
                      checked={certificate.useHijriDate}
                      onCheckedChange={toggleHijriDate}
                      id="hijri"
                    />
                    <Label htmlFor="hijri" className="text-xs cursor-pointer">
                      هجري
                    </Label>
                  </div>
                </div>
                <Select
                  value={certificate.dateFormat}
                  onValueChange={(v: DateFormat) => setCertificate((prev) => ({ ...prev, dateFormat: v }))}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((df) => (
                      <SelectItem key={df.value} value={df.value} className="text-xs">
                        {df.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Signatures */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold">التوقيعات</Label>
                  <Button size="sm" variant="outline" onClick={addSignature}>
                    <Plus className="w-3 h-3 ml-1" />
                    إضافة
                  </Button>
                </div>

                {certificate.signatures.map((sig, idx) => (
                  <div key={sig.id} className="p-3 border rounded-lg bg-muted/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">توقيع {idx + 1}</span>
                      {certificate.signatures.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeSignature(sig.id)}>
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="اللقب (مثال: المدير)"
                      value={sig.label}
                      onChange={(e) => updateSignature(sig.id, "label", e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      placeholder="الاسم"
                      value={sig.name}
                      onChange={(e) => updateSignature(sig.id, "name", e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setDrawingSignatureId(sig.id)}>
                        <Pencil className="w-3 h-3 ml-1" />
                        رسم
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => document.getElementById(`sig-upload-${sig.id}`)?.click()}
                      >
                        <Upload className="w-3 h-3 ml-1" />
                        رفع
                      </Button>
                      <input
                        id={`sig-upload-${sig.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSignatureImageUpload(e, sig.id)}
                      />
                    </div>
                    {sig.signatureImage && (
                      <img src={sig.signatureImage} alt="توقيع" className="w-full h-16 object-contain bg-white rounded border" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Batch Mode */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold">وضع الدفعة</Label>
                  <Switch checked={batchMode} onCheckedChange={setBatchMode} />
                </div>
                {batchMode && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">استيراد أسماء (Excel/CSV)</Label>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => excelFileRef.current?.click()}>
                      <FileSpreadsheet className="w-4 h-4 ml-1" />
                      اختيار ملف
                    </Button>
                    <input ref={excelFileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelImport} />
                    <textarea
                      value={batchNames}
                      onChange={(e) => setBatchNames(e.target.value)}
                      placeholder="أدخل اسم في كل سطر"
                      className="w-full h-24 p-2 text-xs border rounded-md bg-background"
                    />
                    <p className="text-xs text-muted-foreground">{batchNames.split("\n").filter(Boolean).length} اسم</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="p-4 space-y-5 mt-0">
              {/* Orientation */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">الاتجاه</Label>
                <div className="flex gap-2">
                  <Button
                    variant={orientation === "landscape" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrientation("landscape")}
                    className={`flex-1 ${orientation === "landscape" ? 'bg-green-primary hover:bg-green-teal' : ''}`}
                  >
                    <Maximize2 className="w-4 h-4 ml-1" />
                    عرضي
                  </Button>
                  <Button
                    variant={orientation === "portrait" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOrientation("portrait")}
                    className={`flex-1 ${orientation === "portrait" ? 'bg-green-primary hover:bg-green-teal' : ''}`}
                  >
                    <Minimize2 className="w-4 h-4 ml-1" />
                    طولي
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Template Style */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">نمط القالب</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((t) => (
                    <Button
                      key={t.id}
                      variant={templateStyle === t.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTemplateStyle(t.id as TemplateStyle)}
                      className={`text-xs h-auto py-2 flex flex-col gap-1 ${templateStyle === t.id ? 'bg-green-primary hover:bg-green-teal' : ''}`}
                    >
                      <t.icon className="w-4 h-4" />
                      <span className="text-[10px]">{t.label}</span>
                    </Button>
                  ))}
                </div>

                {templateStyle === "custom" && (
                  <div className="space-y-2 pt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => templateFileRef.current?.click()}>
                      <Upload className="w-4 h-4 ml-1" />
                      رفع تصميم مخصص
                    </Button>
                    <input ref={templateFileRef} type="file" accept="image/*" className="hidden" onChange={handleTemplateUpload} />
                    <Button variant="outline" size="sm" className="w-full" onClick={loadTemplateFromURL}>
                      <Link2 className="w-4 h-4 ml-1" />
                      من رابط
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Color Palette */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">لوحة الألوان</Label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PALETTES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePaletteChange(p.id)}
                      className={`p-2 rounded-lg border-2 transition-all ${selectedPalette.id === p.id ? 'border-green-primary ring-2 ring-green-primary/20' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <div
                        className="w-full h-8 rounded-md mb-1"
                        style={{ background: `linear-gradient(135deg, ${p.primary}, ${p.secondary})` }}
                      />
                      <span className="text-[10px]">{p.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">لون أساسي</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-xs font-mono">{customPrimary}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">لون ثانوي</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="w-10 h-10 p-1"
                      />
                      <span className="text-xs font-mono">{customSecondary}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Logos */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">الشعارات</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_LOGOS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 flex flex-col gap-1"
                      onClick={() => addLogo(preset.src, preset.name, preset.defaultPosition)}
                    >
                      <img src={preset.src} alt={preset.name} className="w-8 h-8 object-contain" />
                      <span className="text-[10px]">{preset.name}</span>
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => logoFileRef.current?.click()}>
                  <Upload className="w-3 h-3 ml-1" />
                  رفع شعار
                </Button>
                <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />

                {certificate.logos.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-xs text-muted-foreground">الشعارات المضافة</Label>
                    {certificate.logos.map((logo) => (
                      <div key={logo.id} className="p-2 border rounded-lg bg-muted/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <img src={logo.src} alt={logo.name} className="w-8 h-8 object-contain" />
                          <span className="text-xs flex-1 truncate">{logo.name}</span>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeLogo(logo.id)}>
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Select value={logo.position} onValueChange={(v: LogoAlignment) => updateLogoPosition(logo.id, v)}>
                            <SelectTrigger className="text-xs h-8 flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="right">يمين</SelectItem>
                              <SelectItem value="center">وسط</SelectItem>
                              <SelectItem value="left">يسار</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Fonts Tab */}
            <TabsContent value="fonts" className="p-4 space-y-5 mt-0">
              {/* Fonts */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">الخطوط</Label>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">خط العنوان</Label>
                  <Select value={titleFont} onValueChange={setTitleFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ARABIC_FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">خط المحتوى</Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ARABIC_FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Font Sizes */}
              <div className="space-y-4">
                <Label className="text-sm font-bold">أحجام الخطوط</Label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">حجم العنوان</Label>
                    <span className="text-xs">{titleSize}px</span>
                  </div>
                  <Slider value={[titleSize]} onValueChange={(v) => setTitleSize(v[0])} min={24} max={72} step={2} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">حجم النص</Label>
                    <span className="text-xs">{bodySize}px</span>
                  </div>
                  <Slider value={[bodySize]} onValueChange={(v) => setBodySize(v[0])} min={12} max={32} step={1} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs text-muted-foreground">حجم خط الاسم</Label>
                    <span className="text-xs">{recipientNameSize}px</span>
                  </div>
                  <Slider value={[recipientNameSize]} onValueChange={(v) => setRecipientNameSize(v[0])} min={20} max={56} step={2} />
                </div>
              </div>

              <Separator />

              {/* Recipient Box Style */}
              <div className="space-y-3">
                <Label className="text-sm font-bold">نمط مستطيل الاسم</Label>
                <Select value={recipientBoxStyle} onValueChange={(v: RecipientBoxStyle) => setRecipientBoxStyle(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECIPIENT_BOX_STYLES.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Preview */}
        <main className="flex-1 bg-gray-50 dark:bg-[#0D1B1A] p-4 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Certificate Preview */}
            <div className="flex justify-center">
              <motion.div
                ref={certRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  ...getTemplateStyles(),
                  width: certWidth,
                  height: certHeight,
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Logos Row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-24">
                    {logosByPosition.right[0] && (
                      <img
                        src={logosByPosition.right[0].src}
                        alt="logo"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: logosByPosition.right[0].size }}
                      />
                    )}
                  </div>
                  <div className="flex-1 flex justify-center">
                    {logosByPosition.center[0] && (
                      <img
                        src={logosByPosition.center[0].src}
                        alt="logo"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: logosByPosition.center[0].size }}
                      />
                    )}
                  </div>
                  <div className="w-24 flex justify-end">
                    {logosByPosition.left[0] && (
                      <img
                        src={logosByPosition.left[0].src}
                        alt="logo"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: logosByPosition.left[0].size }}
                      />
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="text-center mb-4">
                  <h1
                    style={{
                      fontFamily: titleFont,
                      fontSize: titleSize,
                      color: primaryColor,
                      fontWeight: 800,
                    }}
                  >
                    {certificate.title}
                  </h1>
                  <p
                    style={{
                      fontFamily: bodyFont,
                      fontSize: subtitleSize,
                      color: secondaryColor,
                      marginTop: "8px",
                    }}
                  >
                    {certificate.subtitle}
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center items-center text-center px-8">
                  <p
                    style={{
                      fontFamily: bodyFont,
                      fontSize: bodySize,
                      color: "#374151",
                      lineHeight: 1.8,
                    }}
                  >
                    {certificate.introText}
                  </p>

                  {/* Recipient Name Box */}
                  <div className="my-6" style={getRecipientBoxStyles()}>
                    <p
                      style={{
                        fontFamily: titleFont,
                        fontSize: recipientNameSize,
                        color: primaryColor,
                        fontWeight: 700,
                      }}
                    >
                      {certificate.recipientName || "اسم المكرم"}
                    </p>
                  </div>

                  <p
                    style={{
                      fontFamily: bodyFont,
                      fontSize: bodySize,
                      color: "#374151",
                      lineHeight: 1.8,
                    }}
                  >
                    {certificate.description}
                  </p>

                  {/* Date */}
                  <div className="mt-6 px-6 py-2 bg-gray-50 rounded-lg border">
                    <p className="text-xs text-gray-400 mb-1">التاريخ</p>
                    <p
                      style={{
                        fontFamily: bodyFont,
                        fontSize: bodySize,
                        color: primaryColor,
                        fontWeight: 600,
                      }}
                    >
                      {formatDate(certificate.date, certificate.useHijriDate, certificate.dateFormat) || "../../...."}
                    </p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="mt-auto pt-6">
                  <div className="flex justify-center gap-8">
                    {certificate.signatures
                      .filter((s) => s.name || s.signatureImage)
                      .map((sig) => (
                        <div key={sig.id} className="text-center">
                          {sig.signatureImage && (
                            <img
                              src={sig.signatureImage}
                              alt="توقيع"
                              className="w-24 h-12 object-contain mx-auto mb-2"
                            />
                          )}
                          {!sig.signatureImage && sig.name && <div className="w-24 h-px bg-gray-300 mx-auto mb-2" />}
                          <p
                            style={{
                              fontFamily: bodyFont,
                              fontSize: 12,
                              color: "#6B7280",
                            }}
                          >
                            {sig.label}
                          </p>
                          <p
                            style={{
                              fontFamily: titleFont,
                              fontSize: 14,
                              color: primaryColor,
                              fontWeight: 600,
                            }}
                          >
                            {sig.name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
