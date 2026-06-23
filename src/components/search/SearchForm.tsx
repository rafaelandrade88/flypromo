import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AirportCombobox } from '@/components/ui/airport-combobox'
import { todayISO } from '@/lib/utils'
import type { SearchParams } from '@/types'

interface SearchFormProps {
  loading: boolean
  onSearch: (params: SearchParams) => void
}

export function SearchForm({ loading, onSearch }: SearchFormProps) {
  const today = todayISO()
  const [origin, setOrigin] = useState('GRU')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  function submit() {
    onSearch({
      originCode: origin.trim(),
      destinationCode: destination.trim(),
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children,
    })
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    submit()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-origin">Origem</Label>
              <AirportCombobox
                id="s-origin"
                value={origin}
                onChange={setOrigin}
                placeholder="Cidade ou GRU"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-dest">Destino</Label>
              <AirportCombobox
                id="s-dest"
                value={destination}
                onChange={setDestination}
                placeholder="Cidade ou MIA"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-departure">Ida</Label>
              <Input
                id="s-departure"
                type="date"
                min={today}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-return">Volta (opcional)</Label>
              <Input
                id="s-return"
                type="date"
                min={departureDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-adults">Adultos</Label>
              <Input
                id="s-adults"
                type="number"
                min={1}
                max={9}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value) || 1)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="s-children">Crianças</Label>
              <Input
                id="s-children"
                type="number"
                min={0}
                max={9}
                value={children}
                onChange={(e) => setChildren(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="md:w-fit md:self-end">
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? 'Buscando...' : 'Buscar voos'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
