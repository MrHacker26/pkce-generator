import { useState } from 'react'
import { generateCodeVerifier, generateCodeChallenge } from '../lib/pkce'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCwIcon, XIcon } from 'lucide-react'
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
      const pkceCodeVerifier = generateCodeVerifier()
      const pkceCodeChallenge = await generateCodeChallenge(pkceCodeVerifier)
      setVerifier(pkceCodeVerifier)
      setChallenge(pkceCodeChallenge)
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
            <CardTitle className="text-xl sm:text-2xl font-semibold text-card-foreground">
              Generate PKCE Values
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Create a cryptographically secure code verifier and challenge pair
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex-1"
              >
                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 sm:h-14 text-sm sm:text-base font-medium shadow-sm"
                  size="lg"
                  disabled={isGenerating}
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
                    transition={{
                      duration: 1,
                      repeat: isGenerating ? Infinity : 0,
                      ease: 'linear',
                      repeatType: 'loop',
                    }}
                    className="mr-2"
                  >
                    <RefreshCwIcon className="size-4 sm:h-5 sm:w-5" />
                  </motion.div>
                  <span className="hidden sm:inline">
                    {isGenerating ? 'Generating...' : 'Generate New PKCE Values'}
                  </span>
                  <span className="sm:hidden">{isGenerating ? 'Generating...' : 'Generate PKCE'}</span>
                </Button>
              </motion.div>

              <AnimatePresence>
                {hasValues ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.8, height: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="sm:flex-shrink-0"
                  >
                    <Button
                      onClick={handleClear}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-12 sm:h-14 px-4 sm:px-6 text-sm sm:text-base"
                    >
                      <XIcon className="h-4 w-4 sm:hidden mr-2" />
                      <span className="hidden sm:inline">Clear</span>
                      <span className="sm:hidden">Clear Values</span>
                    </Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <p className="text-destructive text-xs sm:text-sm font-medium">{error}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {hasValues ? (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0.0, 0.2, 1],
                    height: { duration: 0.4 },
                  }}
                  className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border/30 overflow-hidden"
                  style={{ originY: 0 }}
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
