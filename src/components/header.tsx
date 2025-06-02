import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'

export default function Header() {
  return (
    <div className="text-center mb-12 space-y-4">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <Lock className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        PKCE Generator
      </h1>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Generate secure Proof Key for Code Exchange (PKCE) values for OAuth 2.0 authentication flows. Essential for
        modern mobile and single-page applications.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mt-6">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          OAuth 2.0
        </Badge>
        <Badge variant="secondary">RFC 7636</Badge>
        <Badge variant="outline" className="bg-accent/50 text-accent-foreground border-accent">
          SHA256
        </Badge>
      </div>
    </div>
  )
}
