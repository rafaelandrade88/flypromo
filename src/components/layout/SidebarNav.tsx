import type { ReactNode } from 'react'
import { Search, Bot, Heart, ClipboardList, Plane } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavKey = 'search' | 'recommendations' | 'favorites' | 'history'

interface NavItem {
  key: NavKey
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { key: 'search', label: 'Buscar voos', icon: Search },
  { key: 'recommendations', label: 'Recomendações IA', icon: Bot },
  { key: 'favorites', label: 'Favoritos', icon: Heart },
  { key: 'history', label: 'Histórico', icon: ClipboardList },
]

interface SidebarNavProps {
  active: NavKey
  onNavigate: (key: NavKey) => void
  /** Wraps each item (used by the mobile sheet to auto-close on click). */
  renderItem?: (node: ReactNode, key: NavKey) => ReactNode
}

export function SidebarNav({ active, onNavigate, renderItem }: SidebarNavProps) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3" aria-label="Navegação principal">
      <div className="mb-4 flex items-center gap-2 px-2 py-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Plane className="size-5" />
        </div>
        <span className="text-lg font-bold">FlightWatch</span>
      </div>

      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = active === item.key
        const button = (
          <button
            type="button"
            key={item.key}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onNavigate(item.key)}
            className={cn(
              'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        )
        return renderItem ? renderItem(button, item.key) : button
      })}
    </nav>
  )
}
