import { useState, useRef, useEffect, useId } from 'react'
import { MapPin, X, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { searchAirports, type Airport } from '@/lib/airports'

interface AirportComboboxProps {
  id?: string
  value: string // IATA code
  onChange: (iata: string) => void
  placeholder?: string
  required?: boolean
}

export function AirportCombobox({ id, value, onChange, placeholder = 'Cidade ou código', required }: AirportComboboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Airport[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Derive display text: if we have a value and no open query, show "City (IATA)"
  const selectedAirport = value ? searchAirports(value, 1).find(a => a.iata === value) : undefined

  function openWithQuery(q: string) {
    const res = searchAirports(q)
    setResults(res)
    setOpen(res.length > 0)
    setActiveIndex(-1)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    openWithQuery(q)
  }

  function selectAirport(airport: Airport) {
    onChange(airport.iata)
    setQuery('')
    setOpen(false)
    setResults([])
    setActiveIndex(-1)
  }

  function clear() {
    onChange('')
    setQuery('')
    setOpen(false)
    setResults([])
    inputRef.current?.focus()
  }

  function handleFocus() {
    if (query) openWithQuery(query)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        selectAirport(results[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const displayValue = value && !query
    ? selectedAirport
      ? `${selectedAirport.city} (${selectedAirport.iata})`
      : value
    : query

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden native input for form validation */}
      <input type="hidden" name={inputId} value={value} required={required} />

      <div className={cn(
        'flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        'transition-colors',
      )}>
        <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `airport-opt-${activeIndex}` : undefined}
          role="combobox"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded text-muted-foreground hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Limpar aeroporto"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md',
            'animate-in fade-in-0 zoom-in-95',
          )}
        >
          {results.map((airport, i) => (
            <li
              key={airport.iata}
              id={`airport-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                'flex cursor-pointer items-center gap-3 px-3 py-2 text-sm',
                i === activeIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground',
              )}
              onPointerDown={(e) => {
                e.preventDefault() // prevent blur before click
                selectAirport(airport)
              }}
            >
              <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                {airport.iata}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{airport.city}</span>
                <span className="truncate text-xs text-muted-foreground">{airport.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
