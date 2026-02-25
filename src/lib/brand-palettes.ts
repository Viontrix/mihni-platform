export type BrandPalette = {
  id: string
  name: string
  colors: [string, string, string] // up to 3, always stored as 3 with fallbacks
  description?: string
}

// هذا الملف هو "مركز التحكم" لهويات الألوان في المنصة.
// أضف/عدّل أي هوية هنا، وستظهر مباشرة في أدوات الشهادات وغيرها.

export const BRAND_PALETTES: BrandPalette[] = [
  {
    id: "platform",
    name: "هوية المنصة (أخضر)",
    colors: ["#166534", "#10B981", "#EAF7F0"],
    description: "اللون الأخضر للمنصة مع لون مساعد + خلفية لطيفة",
  },
  {
    id: "moe",
    name: "وزارة التعليم (جاهز)",
    // اللون الأخضر/التركوازي الشائع لشعار الوزارة + رمادي داعم + خلفية فاتحة
    colors: ["#008A76", "#595C61", "#EAF7F0"],
    description: "Preset جاهز متناسق مع هوية وزارة التعليم",
  },
  {
    id: "emerald",
    name: "زمردي أنيق",
    colors: ["#0F766E", "#22B3A0", "#E0F6EF"],
  },
  {
    id: "gold",
    name: "ذهبي فاخر",
    colors: ["#B88700", "#2F2F2F", "#FFF7E6"],
  },
  {
    id: "navy",
    name: "كحلي رسمي",
    colors: ["#1E3A5F", "#0EA5E9", "#EFF6FF"],
  },
]

export function normalizePalette(input: { id?: string; name?: string; description?: string; colors?: string[] }) {
  const c = (input.colors ?? []).filter(Boolean)
  const c1 = c[0] ?? "#166534"
  const c2 = c[1] ?? c1
  const c3 = c[2] ?? "#EAF7F0"
  return {
    id: input.id ?? "custom",
    name: input.name ?? "هوية مخصصة",
    colors: [c1, c2, c3] as [string, string, string],
    description: input.description,
  } satisfies BrandPalette
}
