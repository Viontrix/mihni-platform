import { ChevronLeft, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export default function BreadcrumbBar({
  items,
  className,
  backFallback = '/',
}: {
  items: BreadcrumbItem[]
  className?: string
  backFallback?: string
}) {
  const navigate = useNavigate()

  const goBack = () => {
    // If there is history, go back; otherwise go to fallback
    if (window.history.length > 1) navigate(-1)
    else navigate(backFallback)
  }

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="outline" size="sm" onClick={goBack} className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          رجوع
        </Button>

        <div className="hidden sm:flex items-center gap-2">
          <Home className="h-4 w-4" />
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              {it.to ? (
                <Link to={it.to} className="hover:text-foreground transition-colors">
                  {it.label}
                </Link>
              ) : (
                <span className="text-foreground">{it.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
