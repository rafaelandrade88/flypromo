import { useState } from 'react'
import type { ReactNode } from 'react'
import { Menu, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SidebarNav, type NavKey } from './SidebarNav'
import { MobileSidebar } from './MobileSidebar'
import type { Profile } from '@/types'

const APP_VERSION = 'v1.2.0'

interface AppLayoutProps {
  active: NavKey
  onNavigate: (key: NavKey) => void
  user: User | null
  profile: Profile | null
  onSignOut: () => void
  title: string
  children: ReactNode
}

export function AppLayout({
  active,
  onNavigate,
  user,
  profile,
  onSignOut,
  title,
  children,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayName =
    profile?.full_name || user?.email?.split('@')[0] || 'Usuário'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop persistent sidebar — part of flex flow, pushes content (Bug 3) */}
      <aside className="hidden w-[260px] shrink-0 border-r bg-sidebar md:block">
        <div className="sticky top-0 h-svh overflow-y-auto">
          <SidebarNav active={active} onNavigate={onNavigate} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <MobileSidebar
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        active={active}
        onNavigate={onNavigate}
      />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <h1 className="truncate text-lg font-semibold">{title}</h1>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {APP_VERSION}
          </Badge>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                aria-hidden="true"
              >
                {initials}
              </div>
              <span className="max-w-[140px] truncate text-sm font-medium">
                {displayName}
              </span>
            </div>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sair"
              onClick={onSignOut}
            >
              <LogOut className="size-5" />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
