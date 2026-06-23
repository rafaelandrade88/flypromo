import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HistoryList } from '@/components/history/HistoryList'
import type { SearchHistory } from '@/types'

interface HistoryPageProps {
  history: SearchHistory[]
  loading: boolean
  onClear: () => void
}

export function HistoryPage({ history, loading, onClear }: HistoryPageProps) {
  return (
    <div className="flex flex-col gap-4">
      {history.length > 0 ? (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="size-4" />
            Limpar histórico
          </Button>
        </div>
      ) : null}
      <HistoryList history={history} loading={loading} />
    </div>
  )
}
