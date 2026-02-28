"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  GeneratorTypeSelector, 
  useGeneratorType
} from "@/components/tools/GeneratorTypeSelector"
import ExportGate from "@/components/ExportGate"
import { ROUTES } from "@/lib/routes"
import { 
  ArrowRight, 
  Calendar, 
  Plus, 
  Trash2, 
  Download, 
  Printer,
  Palette,
  RotateCcw
} from "lucide-react"

interface ClassSession {
  id: string
  subject: string
  teacher: string
  room: string
  color: string
}

interface DaySchedule {
  day: string
  sessions: (ClassSession | null)[]
}

const DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"]

const TIME_SLOTS = [
  "7:30 - 8:15",
  "8:15 - 9:00",
  "9:00 - 9:45",
  "9:45 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:45",
  "11:45 - 12:30",
]

const SUBJECTS = [
  { name: "الرياضيات", color: "bg-blue-500" },
  { name: "اللغة العربية", color: "bg-green-500" },
  { name: "العلوم", color: "bg-purple-500" },
  { name: "اللغة الإنجليزية", color: "bg-amber-500" },
  { name: "التربية الإسلامية", color: "bg-emerald-500" },
  { name: "الدراسات الاجتماعية", color: "bg-orange-500" },
  { name: "التربية الفنية", color: "bg-pink-500" },
  { name: "التربية الرياضية", color: "bg-red-500" },
  { name: "الحاسب الآلي", color: "bg-cyan-500" },
  { name: "الفصل", color: "bg-gray-300" },
]

export default function ScheduleBuilderPage() {
  const [mounted, setMounted] = useState(false)
  const [scheduleTitle, setScheduleTitle] = useState("جدول الحصص الدراسية")
  const [grade, setGrade] = useState("")
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    DAYS.map(day => ({
      day,
      sessions: Array(TIME_SLOTS.length).fill(null),
    }))
  )
  const [selectedCell, setSelectedCell] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
  
  // Generator type hook
  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    uploadedFile,
    setUploadedFile
  } = useGeneratorType("school")

  // Update title based on generator type
  useEffect(() => {
    if (generatorType === "company") {
      setScheduleTitle("جدول اجتماعات الأسبوع")
    } else if (generatorType === "government") {
      setScheduleTitle("جدول المواعيد الرسمية")
    } else if (generatorType === "individual") {
      setScheduleTitle("جدولي الأسبوعي")
    } else {
      setScheduleTitle("جدول الحصص الدراسية")
    }
  }, [generatorType])

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateSession = (dayIndex: number, slotIndex: number, session: ClassSession | null) => {
    const newSchedule = [...schedule]
    newSchedule[dayIndex].sessions[slotIndex] = session
    setSchedule(newSchedule)
  }

  const clearSchedule = () => {
    setSchedule(DAYS.map(day => ({
      day,
      sessions: Array(TIME_SLOTS.length).fill(null),
    })))
  }

  const exportSchedule = () => {
    const scheduleData = {
      title: scheduleTitle,
      grade,
      schedule,
    }
    
    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `schedule-${grade || "class"}.json`
    link.click()
  }

  const printSchedule = () => {
    window.print()
  }

  const copyDay = (fromDayIndex: number, toDayIndex: number) => {
    const newSchedule = [...schedule]
    newSchedule[toDayIndex].sessions = [...newSchedule[fromDayIndex].sessions]
    setSchedule(newSchedule)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Calendar className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
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
            <Calendar className="w-5 h-5 text-teal-500" />
            <h1 className="text-lg font-bold">منشئ جداول الحصص</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearSchedule}>
              <RotateCcw className="w-4 h-4 ml-1" />
              مسح
            </Button>
            <ExportGate 
              onExport={printSchedule}
              onDownloadWithWatermark={printSchedule}
              exportLabel="طباعة"
              variant="outline"
              size="sm"
              projectName="الجدول"
            >
              <Printer className="w-4 h-4 ml-1" />
              طباعة
            </ExportGate>
            <ExportGate 
              onExport={exportSchedule}
              onDownloadWithWatermark={exportSchedule}
              exportLabel="تصدير"
              variant="default"
              size="sm"
              className="bg-teal-500 hover:bg-teal-600"
              projectName="الجدول"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير
            </ExportGate>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8">
        {/* Generator Type Selector */}
        <Card className="mb-6 border-teal-100">
          <CardContent className="p-6">
            <Label className="text-sm font-medium mb-3 block">اختر نوع الجدول</Label>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:block">
          {/* Settings & Subjects */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Schedule Info */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-500" />
                  معلومات الجدول
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-xs">عنوان الجدول</Label>
                  <Input
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">الصف / الفصل</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={`grade${i + 1}`}>الصف {i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Subjects */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" />
                  المواد الدراسية
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject.name}
                      className={`p-2 rounded-lg text-xs text-white font-medium ${subject.color} hover:opacity-80 transition-opacity`}
                      onClick={() => {
                        if (selectedCell) {
                          updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                            id: Date.now().toString(),
                            subject: subject.name,
                            teacher: "",
                            room: "",
                            color: subject.color,
                          })
                        }
                      }}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  اختر خلية في الجدول ثم اضغط على المادة
                </p>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-3">مفتاح الألوان</h3>
                <div className="space-y-2">
                  {SUBJECTS.slice(0, 6).map((subject) => (
                    <div key={subject.name} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${subject.color}`} />
                      <span className="text-sm">{subject.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Grid */}
          <div className="lg:col-span-3 print:w-full">
            <Card className="print:border-0 print:shadow-none overflow-x-auto">
              <CardContent className="p-4 print:p-0">
                {/* Title for print */}
                <div className="hidden print:block text-center mb-6">
                  <h1 className="text-2xl font-bold">{scheduleTitle}</h1>
                  {grade && <p className="text-muted-foreground">الصف {grade.replace("grade", "")}</p>}
                </div>

                <div className="min-w-[800px] print:min-w-0">
                  {/* Header Row */}
                  <div className="grid grid-cols-8 gap-1 mb-1">
                    <div className="p-3 bg-muted/50 rounded-lg font-bold text-center text-sm">
                      اليوم / الحصة
                    </div>
                    {TIME_SLOTS.map((slot, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs font-bold">الحصة {index + 1}</p>
                        <p className="text-[10px] text-muted-foreground">{slot}</p>
                      </div>
                    ))}
                  </div>

                  {/* Days Rows */}
                  <div className="space-y-1">
                    {schedule.map((day, dayIndex) => (
                      <div key={day.day} className="grid grid-cols-8 gap-1">
                        {/* Day Label */}
                        <div className="p-3 bg-teal-500 text-white rounded-lg font-bold text-center text-sm flex items-center justify-center print:hidden">
                          <div>
                            <p>{day.day}</p>
                            <button
                              className="text-[10px] opacity-70 hover:opacity-100 mt-1"
                              onClick={() => {
                                const targetDay = (dayIndex + 1) % 5
                                copyDay(dayIndex, targetDay)
                              }}
                            >
                              نسخ ▼
                            </button>
                          </div>
                        </div>
                        <div className="hidden print:flex p-2 bg-teal-100 rounded-lg font-bold text-center text-sm items-center justify-center">
                          {day.day}
                        </div>

                        {/* Sessions */}
                        {day.sessions.map((session, slotIndex) => (
                          <motion.div
                            key={`${dayIndex}-${slotIndex}`}
                            whileHover={{ scale: 1.02 }}
                            className={`
                              p-2 rounded-lg min-h-[80px] cursor-pointer transition-all
                              ${selectedCell?.dayIndex === dayIndex && selectedCell?.slotIndex === slotIndex 
                                ? 'ring-2 ring-teal-500 ring-offset-2' 
                                : 'hover:ring-1 hover:ring-teal-300'
                              }
                              ${session ? session.color : 'bg-muted/30 border-2 border-dashed border-muted'}
                            `}
                            onClick={() => setSelectedCell({ dayIndex, slotIndex })}
                          >
                            {session ? (
                              <div className="h-full flex flex-col justify-between text-white">
                                <p className="text-xs font-bold truncate">{session.subject}</p>
                                {session.teacher && (
                                  <p className="text-[10px] opacity-80 truncate">{session.teacher}</p>
                                )}
                                {session.room && (
                                  <p className="text-[10px] opacity-80">{session.room}</p>
                                )}
                                <button
                                  className="absolute top-1 left-1 opacity-0 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateSession(dayIndex, slotIndex, null)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-muted-foreground">
                                <Plus className="w-5 h-5" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Editor */}
            {selectedCell && schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex] && (
              <Card className="mt-4 print:hidden">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-4">
                    تعديل: {DAYS[selectedCell.dayIndex]} - الحصة {selectedCell.slotIndex + 1}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs">المادة</Label>
                      <Input
                        value={schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]?.subject || ""}
                        onChange={(e) => {
                          const session = schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]
                          if (session) {
                            updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                              ...session,
                              subject: e.target.value,
                            })
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">المعلم</Label>
                      <Input
                        value={schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]?.teacher || ""}
                        onChange={(e) => {
                          const session = schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]
                          if (session) {
                            updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                              ...session,
                              teacher: e.target.value,
                            })
                          }
                        }}
                        placeholder="اسم المعلم"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">الفصل / القاعة</Label>
                      <Input
                        value={schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]?.room || ""}
                        onChange={(e) => {
                          const session = schedule[selectedCell.dayIndex].sessions[selectedCell.slotIndex]
                          if (session) {
                            updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                              ...session,
                              room: e.target.value,
                            })
                          }
                        }}
                        placeholder="رقم الفصل"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
