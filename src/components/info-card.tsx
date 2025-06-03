import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Info } from 'lucide-react'

export default function InfoCard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <Info className="size-5 text-primary" />
            Usage Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>
              <strong className="text-foreground">1. Authorization Request:</strong> Send the code_challenge and
              code_challenge_method=S256 to the authorization server
            </p>
            <p>
              <strong className="text-foreground">2. Token Exchange:</strong> Include the code_verifier when exchanging
              the authorization code for tokens
            </p>
            <p>
              <strong className="text-foreground">3. Security:</strong> Keep the code_verifier secret in your
              application
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-card-foreground">
            <CheckCircle className="size-5 text-success" />
            Security Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p>
              <strong className="text-foreground">Protection:</strong> Prevents authorization code interception attacks
            </p>
            <p>
              <strong className="text-foreground">No Client Secret:</strong> Suitable for public clients (mobile apps,
              SPAs)
            </p>
            <p>
              <strong className="text-foreground">Standard:</strong> RFC 7636 compliant implementation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
