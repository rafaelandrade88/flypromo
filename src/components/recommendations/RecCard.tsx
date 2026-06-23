import { Globe, ArrowUpRight, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PriceCategory, Recommendation } from '@/types'

const CATEGORY_BADGE: Record<PriceCategory, 'success' | 'warning' | 'destructive'> = {
  low: 'success',
  medium: 'warning',
  high: 'destructive',
}

export function RecCard({ rec }: { rec: Recommendation }) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
              {rec.rank}
            </span>
            <Badge variant="outline">{rec.iataCode}</Badge>
          </div>
          <Badge variant={CATEGORY_BADGE[rec.priceCategory] ?? 'secondary'}>
            {rec.estimatedPrice}
          </Badge>
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-tight">{rec.destination}</h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Globe className="size-3.5" aria-hidden="true" />
            {rec.country}
          </p>
        </div>

        {rec.bestMonths?.length ? (
          <p className="text-xs text-muted-foreground">
            Melhores meses: {rec.bestMonths.join(', ')}
          </p>
        ) : null}

        {rec.highlights?.length ? (
          <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
            {rec.highlights.slice(0, 3).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : null}

        {rec.tip ? (
          <p className="flex gap-2 rounded-md bg-muted p-3 text-xs">
            <Lightbulb className="size-4 shrink-0 text-warning" aria-hidden="true" />
            {rec.tip}
          </p>
        ) : null}

        <Button asChild variant="outline" size="sm" className="mt-auto">
          <a href={rec.bookingUrl} target="_blank" rel="noopener noreferrer">
            Buscar voos
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
