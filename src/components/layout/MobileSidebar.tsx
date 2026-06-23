import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet'
import { SidebarNav, type NavKey } from './SidebarNav'

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  active: NavKey
  onNavigate: (key: NavKey) => void
}

export function MobileSidebar({
  open,
  onOpenChange,
  active,
  onNavigate,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="Navegação">
        <SidebarNav
          active={active}
          onNavigate={(key) => {
            onNavigate(key)
            onOpenChange(false)
          }}
          renderItem={(node) => <SheetClose asChild>{node}</SheetClose>}
        />
      </SheetContent>
    </Sheet>
  )
}
