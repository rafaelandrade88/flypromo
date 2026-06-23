import { Heart, Plane, ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatBRL, formatTime } from '@/lib/utils'
import type { Flight, PriceCategory } from '@/types'

const CATEGORY_BADGE: Record<PriceCategory, 'success' | 'warning' | 'destructive'> = {
  low: 'success',
  medium: 'warning',
  high: 'destructive',
}

const CATEGORY_BORDER: Record<PriceCategory, string> = {
  low: 'border-l-success',
  medium: 'border-l-warning',
  high: 'border-l-destructive',
}

interface FlightCardProps {
  flight: Flight
  isFavorite: boolean
  onToggleFavorite: (flight: Flight) => void
}

function RoutePoint({
  code,
  time,
  terminal,
}: {
  code: string
  time: string
  terminal?: string | null
}) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold leading-tight">{code || '—'}</div>
      <div className="text-sm text-muted-foreground">{formatTime(time)}</div>
      {terminal ? (
        <div className="text-[0.65rem] text-muted-foreground">T{terminal}</div>
      ) : null}
    </div>
  )
}

function RouteMiddle({ duration, stops }: { duration: string; stops: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-2">
      <span className="text-xs text-muted-foreground">{duration}</span>
      <div className="flex w-full items-center gap-1">
        <span className="h-px flex-1 bg-border" />
        <Plane className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="h-px flex-1 bg-border" />
      </div>
      <span
        className={cn(
          'text-[0.7rem]',
          stops === 0 ? 'font-medium text-success' : 'text-muted-foreground',
        )}
      >
        {stops === 0 ? 'Direto' : `${stops} parada(s)`}
      </span>
    </div>
  )
}

export function FlightCard({ flight, isFavorite, onToggleFavorite }: FlightCardProps) {
  const { price } = flight
  const airlines = flight.airlines.length ? flight.airlines.join(' · ') : '—'
  const flightNums = flight.flightNumbers.slice(0, 2).join(', ')

  return (
    <Card className={cn('border-l-4', CATEGORY_BORDER[price.category])}>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {airlines}
              {flightNums ? ` · ${flightNums}` : ''}
            </p>
            {price.savings && price.savings !== 0 ? (
              <span
                className={cn(
                  'mt-0.5 inline-flex items-center gap-1 text-xs',
                  price.savings > 0 ? 'text-success' : 'text-destructive',
                )}
              >
                {price.savings > 0 ? (
                  <TrendingDown className="size-3" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {formatBRL(Math.abs(price.savings))} vs. média
              </span>
            ) : null}
          </div>
          <Badge variant={CATEGORY_BADGE[price.category]} className="shrink-0 text-sm">
            {formatBRL(price.total)}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RoutePoint
            code={flight.departure.airport}
            time={flight.departure.time}
            terminal={flight.departure.terminal}
          />
          <RouteMiddle duration={flight.duration} stops={flight.stops} />
          <RoutePoint
            code={flight.arrival.airport}
            time={flight.arrival.time}
            terminal={flight.arrival.terminal}
          />
        </div>

        {flight.returnFlight ? (
          <div className="border-t pt-3">
            <p className="mb-2 text-[0.7rem] font-medium uppercase text-muted-foreground">
              Volta
            </p>
            <div className="flex items-center justify-between gap-2">
              <RoutePoint
                code={flight.returnFlight.departure.airport}
                time={flight.returnFlight.departure.time}
              />
              <RouteMiddle duration="" stops={0} />
              <RoutePoint
                code={flight.returnFlight.arrival.airport}
                time={flight.returnFlight.arrival.time}
              />
            </div>
          </div>
        ) : null}

        {flight.extensions.length ? (
          <p className="text-[0.7rem] text-muted-foreground">
            {flight.extensions.slice(0, 2).join(' · ')}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t pt-3">
          <span className="text-xs text-muted-foreground">{flight.cabin}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={isFavorite}
              onClick={() => onToggleFavorite(flight)}
            >
              <Heart
                className={cn(isFavorite && 'fill-destructive text-destructive')}
              />
            </Button>
            <Button asChild size="sm">
              <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer">
                Reservar
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
