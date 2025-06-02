import { useState } from 'react'
import { generateCodeVerifier, generateCodeChallenge } from '../lib/pkce'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import InfoCard from './info-card'

export default function Generator() {
  const [verifier, setVerifier] = useState<string>('')
  const [challenge, setChallenge] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate() {
    setIsGenerating(true)
    try {
      const v = generateCodeVerifier()
      const c = await generateCodeChallenge(v)
      setVerifier(v)
      setChallenge(c)
      toast.success('PKCE values generated successfully!')
    } catch {
      toast.error('Failed to generate PKCE values')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-border/50">
          <CardTitle className="text-2xl font-semibold text-card-foreground">Generate PKCE Values</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a cryptographically secure code verifier and challenge pair
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <Button
            onClick={handleGenerate}
            className="w-full h-14 text-base font-medium shadow-sm"
            size="lg"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Generate New PKCE Values
              </>
            )}
          </Button>

          {verifier || challenge ? (
            <div className="space-y-8 pt-6 border-t border-border/30">
              {verifier ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="verifier" className="text-base font-semibold text-foreground">
                        Code Verifier
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        High-entropy cryptographic random string (43-128 characters)
                      </p>
                    </div>
                  </div>
                  <Textarea
                    id="verifier"
                    value={verifier}
                    readOnly
                    className="font-mono text-sm min-h-[80px] bg-muted/30 border-2 border-border focus:border-ring transition-colors resize-none"
                    rows={3}
                  />
                </div>
              ) : null}

              {challenge ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="challenge" className="text-base font-semibold text-foreground">
                        Code Challenge
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Base64url-encoded SHA256 hash of the code verifier
                      </p>
                    </div>
                  </div>
                  <Textarea
                    id="challenge"
                    value={challenge}
                    readOnly
                    className="font-mono text-sm min-h-[60px] bg-muted/30 border-2 border-border focus:border-ring transition-colors resize-none"
                    rows={2}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <InfoCard />
    </div>
  )
}
