import { useState } from 'react'
import { generateCodeVerifier, generateCodeChallenge } from '../lib/pkce'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import InfoCard from './info-card'
import { motion, AnimatePresence } from 'framer-motion'
import { PKCEField } from '@/components/ui/pkce-field'
import { SuccessIndicator } from '@/components/ui/success-indicator'

export default function Generator() {
  const [verifier, setVerifier] = useState<string>('')
  const [challenge, setChallenge] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')

  async function handleGenerate() {
    setIsGenerating(true)
    setError('')
    try {
      const v = generateCodeVerifier()
      const c = await generateCodeChallenge(v)
      setVerifier(v)
      setChallenge(c)
      toast.success('PKCE values generated successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PKCE values'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  function handleClear() {
    setVerifier('')
    setChallenge('')
    setError('')
    toast.success('Values cleared')
  }

  const hasValues = verifier && challenge

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-border/50">
            <CardTitle className="text-2xl font-semibold text-card-foreground">Generate PKCE Values</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create a cryptographically secure code verifier and challenge pair
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleGenerate}
                  className="w-full h-14 text-base font-medium shadow-sm"
                  size="lg"
                  disabled={isGenerating}
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: isGenerating ? Infinity : 0, ease: 'linear' }}
                    className="mr-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.div>
                  {isGenerating ? 'Generating...' : 'Generate New PKCE Values'}
                </Button>
              </motion.div>

              {hasValues && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={handleClear} variant="outline" size="lg" className="h-14 px-6">
                    Clear
                  </Button>
                </motion.div>
              )}
            </div>

            {error ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <p className="text-destructive text-sm font-medium">{error}</p>
              </motion.div>
            ) : null}

            <AnimatePresence>
              {hasValues ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="space-y-8 pt-6 border-t border-border/30 overflow-hidden"
                >
                  <SuccessIndicator />

                  <PKCEField
                    id="verifier"
                    label="Code Verifier"
                    description="High-entropy cryptographic random string (43-128 characters)"
                    value={verifier}
                    rows={3}
                    delay={0.1}
                  />

                  <PKCEField
                    id="challenge"
                    label="Code Challenge"
                    description="Base64url-encoded SHA256 hash of the code verifier"
                    value={challenge}
                    rows={2}
                    delay={0.2}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <InfoCard />
      </motion.div>
    </div>
  )
}
