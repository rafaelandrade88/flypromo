import { useState } from 'react'
import { Plane } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type Tab = 'login' | 'register'

export function AuthScreen() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Plane className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">FlightWatch</h1>
            <p className="text-sm text-muted-foreground">
              Compare passagens aéreas com inteligência artificial
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'login'}
                onClick={() => setTab('login')}
                className={cn(
                  'rounded-md py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  tab === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Entrar
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'register'}
                onClick={() => setTab('register')}
                className={cn(
                  'rounded-md py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  tab === 'register'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Criar conta
              </button>
            </div>
            <CardTitle className="sr-only">
              {tab === 'login' ? 'Entrar' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="sr-only">
              Acesse sua conta FlightWatch
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tab === 'login' ? <LoginForm /> : <RegisterForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
