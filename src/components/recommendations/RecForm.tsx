import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import type { RecommendationParams } from '@/types'

interface RecFormProps {
  loading: boolean
  onSubmit: (params: RecommendationParams) => void
}

export function RecForm({ loading, onSubmit }: RecFormProps) {
  const [origin, setOrigin] = useState('São Paulo')
  const [budget, setBudget] = useState('')
  const [travelMonth, setTravelMonth] = useState('')
  const [preferences, setPreferences] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit({
      origin: origin.trim(),
      budget: budget || null,
      travelMonth: travelMonth || null,
      adults: 1,
      children: 0,
      preferences: preferences.trim() || null,
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-origin">Cidade de origem</Label>
              <Input
                id="r-origin"
                placeholder="São Paulo"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-budget">Orçamento (R$, opcional)</Label>
              <Input
                id="r-budget"
                type="number"
                min={0}
                placeholder="3000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-month">Mês de viagem (opcional)</Label>
              <Input
                id="r-month"
                placeholder="Dezembro"
                value={travelMonth}
                onChange={(e) => setTravelMonth(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-prefs">Preferências (opcional)</Label>
              <Input
                id="r-prefs"
                placeholder="Praia, cultura, gastronomia..."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="md:w-fit md:self-end">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? 'Gerando...' : 'Gerar recomendações'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
