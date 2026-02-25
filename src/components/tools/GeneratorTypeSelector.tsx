"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  School, 
  Building2, 
  Landmark, 
  User, 
  Settings2,
  FileUp,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react"

export type GeneratorType = "school" | "company" | "government" | "individual" | "custom"

interface GeneratorTypeOption {
  value: GeneratorType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  bgColor: string
}

export const GENERATOR_TYPES: GeneratorTypeOption[] = [
  { 
    value: "school", 
    label: "المدارس", 
    icon: School, 
    description: "محتوى تعليمي للطلاب والمعلمين",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200"
  },
  { 
    value: "company", 
    label: "الشركات", 
    icon: Building2, 
    description: "محتوى احترافي للأعمال والشركات",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100 border-purple-200"
  },
  { 
    value: "government", 
    label: "الجهات", 
    icon: Landmark, 
    description: "محتوى رسمي للجهات الحكومية",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
  },
  { 
    value: "individual", 
    label: "الأفراد", 
    icon: User, 
    description: "محتوى شخصي وممتع للأفراد",
    color: "text-orange-600",
    bgColor: "bg-orange-50 hover:bg-orange-100 border-orange-200"
  },
  { 
    value: "custom", 
    label: "مخصص", 
    icon: Settings2, 
    description: "تخصيص كامل مع رفع ملفات",
    color: "text-amber-600",
    bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200"
  },
]

// Preset options for each generator type
export const GENERATOR_PRESETS: Record<GeneratorType, { subjects: string[]; topics: string[]; templates: string[] }> = {
  school: {
    subjects: ["الرياضيات", "اللغة العربية", "العلوم", "اللغة الإنجليزية", "التربية الإسلامية", "الدراسات الاجتماعية"],
    topics: ["خطة درس", "اختبار", "واجب", "مشروع", "نشاط"],
    templates: ["ابتدائي", "متوسط", "ثانوي", "جامعة"]
  },
  company: {
    subjects: ["موارد بشرية", "تقنية المعلومات", "المبيعات", "التسويق", "المالية", "العمليات"],
    topics: ["تقرير", "عرض تقديمي", "خطة عمل", "مذكرة", "تعميم"],
    templates: ["تقرير شهري", "خطة سنوية", "عرض للعملاء", "مذكرة داخلية"]
  },
  government: {
    subjects: ["الشؤون الإدارية", "الموارد البشرية", "المالية", "التقنية", "القانونية", "العلاقات العامة"],
    topics: ["تعميم", "تقرير", "خطاب", "مذكرة", "قرار"],
    templates: ["تعميم رسمي", "خطاب خارجي", "تقرير أداء", "مذكرة تنفيذية"]
  },
  individual: {
    subjects: ["ثقافة عامة", "رياضة", "صحة", "تكنولوجيا", "سفر", "طعام"],
    topics: ["اختبار", "تحدي", "لعبة", "مسابقة", "تعلم"],
    templates: ["اختبار سريع", "تحدي يومي", "مسابقة مع الأصدقاء"]
  },
  custom: {
    subjects: [],
    topics: [],
    templates: []
  }
}

interface GeneratorTypeSelectorProps {
  value: GeneratorType
  onChange: (type: GeneratorType) => void
  showCustomPanel?: boolean
  customTitle?: string
  onCustomTitleChange?: (title: string) => void
  uploadedFile?: File | null
  onFileUpload?: (file: File | null) => void
  customDescription?: string
  onCustomDescriptionChange?: (desc: string) => void
}

export function GeneratorTypeSelector({
  value,
  onChange,
  showCustomPanel = true,
  customTitle = "",
  onCustomTitleChange,
  uploadedFile,
  onFileUpload,
  customDescription = "",
  onCustomDescriptionChange
}: GeneratorTypeSelectorProps) {
  const [isCustomExpanded, setIsCustomExpanded] = useState(false)
  const fileInputRef = useState<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت")
        return
      }
      onFileUpload?.(file)
      toast.success(`تم رفع الملف: ${file.name}`)
    }
  }

  const selectedType = GENERATOR_TYPES.find(t => t.value === value)

  return (
    <div className="space-y-4">
      {/* Generator Type Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {GENERATOR_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = value === type.value
          return (
            <motion.button
              key={type.value}
              onClick={() => {
                onChange(type.value)
                if (type.value === "custom") {
                  setIsCustomExpanded(true)
                } else {
                  setIsCustomExpanded(false)
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                isSelected
                  ? `${type.bgColor} border-current ring-2 ring-offset-2 ring-${type.color.split('-')[1]}-400`
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? type.color : "text-gray-400"}`} />
              <p className={`font-semibold text-sm ${isSelected ? type.color : "text-gray-700"}`}>
                {type.label}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{type.description}</p>
              
              {isSelected && (
                <motion.div
                  layoutId="selectedIndicator"
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${type.bgColor} ${type.color} flex items-center justify-center`}
                >
                  <Sparkles className="w-3 h-3" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Custom Panel */}
      <AnimatePresence>
        {showCustomPanel && value === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    التخصيص المتقدم
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCustomExpanded(!isCustomExpanded)}
                    className="text-amber-600"
                  >
                    {isCustomExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                <AnimatePresence>
                  {isCustomExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Custom Title */}
                      <div>
                        <Label className="text-sm text-amber-700">عنوان/موضوع المحتوى</Label>
                        <Input
                          value={customTitle}
                          onChange={(e) => onCustomTitleChange?.(e.target.value)}
                          placeholder="مثال: تقرير عن الذكاء الاصطناعي في التعليم"
                          className="mt-1 bg-white border-amber-200"
                        />
                      </div>

                      {/* Custom Description */}
                      <div>
                        <Label className="text-sm text-amber-700">وصف تفصيلي (اختياري)</Label>
                        <Textarea
                          value={customDescription}
                          onChange={(e) => onCustomDescriptionChange?.(e.target.value)}
                          placeholder="اكتب وصفاً تفصيلياً لما تريد توليده..."
                          className="mt-1 bg-white border-amber-200 resize-none"
                          rows={3}
                        />
                      </div>

                      {/* File Upload */}
                      <div>
                        <Label className="text-sm text-amber-700">رفع ملف (اختياري)</Label>
                        <p className="text-xs text-amber-600 mb-2">
                          يمكنك رفع ملف PDF أو Word أو TXT وسيقوم الذكاء الاصطناعي بقراءة محتواه
                        </p>
                        
                        {!uploadedFile ? (
                          <div
                            onClick={() => fileInputRef[1](null)}
                            className="border-2 border-dashed border-amber-300 rounded-xl p-6 text-center cursor-pointer hover:bg-amber-100/50 transition-colors"
                          >
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                              id="custom-file-upload"
                            />
                            <label htmlFor="custom-file-upload" className="cursor-pointer block">
                              <FileUp className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                              <p className="text-amber-700 font-medium">اضغط لرفع ملف</p>
                              <p className="text-xs text-amber-500 mt-1">PDF, Word, TXT (الحد الأقصى 10 ميجابايت)</p>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-amber-200">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-amber-900">{uploadedFile.name}</p>
                              <p className="text-sm text-amber-600">{(uploadedFile.size / 1024).toFixed(1)} كيلوبايت</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onFileUpload?.(null)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <XCircle className="w-5 h-5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Type Badge */}
      {selectedType && value !== "custom" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <span>الوضع المحدد:</span>
          <Badge variant="outline" className={`${selectedType.bgColor} ${selectedType.color} border-current`}>
            <selectedType.icon className="w-3 h-3 ml-1" />
            {selectedType.label}
          </Badge>
        </motion.div>
      )}
    </div>
  )
}

// Hook for using generator type
export function useGeneratorType(defaultType: GeneratorType = "school") {
  const [generatorType, setGeneratorType] = useState<GeneratorType>(defaultType)
  const [customTitle, setCustomTitle] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const reset = () => {
    setGeneratorType(defaultType)
    setCustomTitle("")
    setCustomDescription("")
    setUploadedFile(null)
  }

  const presets = GENERATOR_PRESETS[generatorType]

  return {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    customDescription,
    setCustomDescription,
    uploadedFile,
    setUploadedFile,
    presets,
    reset
  }
}

// Missing import
import { Badge } from "@/components/ui/badge"
