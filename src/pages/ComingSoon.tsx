import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Home } from "lucide-react";

export default function ComingSoon() {
  const { kind, slug } = useParams();

  const title =
    kind === "tool"
      ? "هذه الأداة قيد الإعداد"
      : kind === "template"
        ? "هذا القالب قيد الإعداد"
        : "المحتوى قيد الإعداد";

  const subtitle =
    slug
      ? `العنصر: ${decodeURIComponent(slug)}`
      : "سيتم توفيره قريباً بإذن الله.";

  return (
    <div dir="rtl" className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl rounded-2xl shadow-sm">
        <CardContent className="p-8 text-center space-y-5">
          <div className="text-5xl font-extrabold text-emerald-700">⏳</div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600">{subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ChevronRight className="ms-2 h-4 w-4" />
              رجوع
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="ms-2 h-4 w-4" />
                العودة للرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
