import Generator from './components/generator'
import { Toaster } from 'sonner'
import Header from './components/header'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/30">
      <div className="container mx-auto py-12 px-4">
        <Header />
        <Generator />
      </div>
      <Toaster
        position="bottom-right"
        richColors
        theme="system"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--card-foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  )
}
