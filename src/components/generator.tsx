import { useState, useRef } from 'react'
import { generateCodeVerifier, generateCodeChallenge } from '../lib/pkce'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCwIcon, XIcon, Copy, ClipboardCheck, Settings } from 'lucide-react'
import { toast } from 'sonner'
import InfoCard from './info-card'
import { motion, AnimatePresence } from 'framer-motion'
import { PKCEField } from '@/components/ui/pkce-field'
import { SuccessIndicator } from '@/components/ui/success-indicator'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn, getSecurityLevel } from '@/lib/utils'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { ShortcutsPanel } from '@/components/ui/shortcuts-panel'

export default function Generator() {
  const [verifier, setVerifier] = useState<string>('')
  const [challenge, setChallenge] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>('')
  const [justCopiedAll, setJustCopiedAll] = useState(false)
  const [verifierLength, setVerifierLength] = useState<number>(128)
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const generateButtonRef = useRef<HTMLButtonElement>(null)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)

  async function handleGenerate() {
    setIsGenerating(true)
    setError('')
    try {
      const pkceCodeVerifier = generateCodeVerifier(verifierLength)
      const pkceCodeChallenge = await generateCodeChallenge(pkceCodeVerifier)
      setVerifier(pkceCodeVerifier)
      setChallenge(pkceCodeChallenge)
      toast.success(`PKCE values generated with ${verifierLength} character verifier!`)
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
    setJustCopiedAll(false)
    toast.success('Values cleared')
  }

  async function handleCopyAll() {
    if (!verifier || !challenge) return

    const pkceData = {
      code_verifier: verifier,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      verifier_length: verifier.length,
      generated_at: new Date().toISOString(),
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(pkceData, null, 2))
      setJustCopiedAll(true)
      toast.success('All values copied as JSON!')

      setTimeout(() => {
        setJustCopiedAll(false)
      }, 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  async function copyVerifier() {
    if (!verifier) return
    try {
      await navigator.clipboard.writeText(verifier)
      toast.success('Code verifier copied!')
    } catch {
      toast.error('Failed to copy verifier')
    }
  }

  async function copyChallenge() {
    if (!challenge) return
    try {
      await navigator.clipboard.writeText(challenge)
      toast.success('Code challenge copied!')
    } catch {
      toast.error('Failed to copy challenge')
    }
  }

  function increaseLength() {
    setVerifierLength((prev) => Math.min(128, prev + 5))
  }

  function decreaseLength() {
    setVerifierLength((prev) => Math.max(43, prev - 5))
  }

  function toggleSettings() {
    setShowSettings((prev) => !prev)
  }

  function focusGenerateButton() {
    generateButtonRef.current?.focus()
  }

  function toggleShortcuts() {
    setShowShortcuts((prev) => !prev)
  }

  const shortcuts: KeyboardShortcut[] = [
    {
      keys: ['mod', 'g'],
      description: 'Generate new PKCE values',
      action: handleGenerate,
      category: 'Actions',
    },
    {
      keys: ['mod', 'k'],
      description: 'Clear all values',
      action: handleClear,
      category: 'Actions',
    },
    {
      keys: ['mod', 'shift', 'c'],
      description: 'Copy all as JSON',
      action: handleCopyAll,
      category: 'Copy',
    },
    {
      keys: ['mod', 'c'],
      description: 'Copy code verifier',
      action: copyVerifier,
      category: 'Copy',
    },
    {
      keys: ['mod', 'shift', 'v'],
      description: 'Copy code challenge',
      action: copyChallenge,
      category: 'Copy',
    },
    {
      keys: ['mod', ','],
      description: 'Toggle settings panel',
      action: toggleSettings,
      category: 'Navigation',
    },
    {
      keys: ['?'],
      description: 'Show keyboard shortcuts',
      action: toggleShortcuts,
      category: 'Help',
    },
    {
      keys: ['shift', '?'],
      description: 'Show keyboard shortcuts',
      action: toggleShortcuts,
      category: 'Help',
    },
    {
      keys: ['arrowup'],
      description: 'Increase verifier length (+5)',
      action: increaseLength,
      category: 'Settings',
    },
    {
      keys: ['arrowdown'],
      description: 'Decrease verifier length (-5)',
      action: decreaseLength,
      category: 'Settings',
    },
    {
      keys: ['escape'],
      description: 'Focus generate button',
      action: focusGenerateButton,
      category: 'Navigation',
    },
  ]

  useKeyboardShortcuts(shortcuts)

  const hasValues = verifier && challenge
  const security = getSecurityLevel(verifierLength)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-start">
                <ShortcutsPanel shortcuts={shortcuts} isOpen={showShortcuts} onOpenChange={setShowShortcuts} />
              </div>
              <div className="text-center">
                <CardTitle className="text-xl sm:text-2xl font-semibold text-card-foreground">
                  Generate PKCE Values
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">
                  Create a cryptographically secure code verifier and challenge pair
                </CardDescription>
              </div>
              <div className="flex-1 flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    ref={settingsButtonRef}
                    variant="ghost"
                    size="icon"
                    onClick={toggleSettings}
                    className="size-8"
                    title="Toggle settings (Cmd+,)"
                  >
                    <motion.div animate={{ rotate: showSettings ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <Settings className="size-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-8 space-y-6 sm:space-y-8">
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                  className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50 overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="length-slider" className="text-sm font-medium">
                        Code Verifier Length
                      </Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {verifierLength} chars
                        </Badge>
                        <Badge variant="secondary" className={cn('text-xs', security.color)}>
                          {security.level}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        id="length-slider"
                        value={[verifierLength]}
                        onValueChange={([value]) => setVerifierLength(value)}
                        min={43}
                        max={128}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>43 (Min)</span>
                        <span>128 (Max)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>RFC 7636 requires 43-128 characters. Higher length = better security.</span>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          ↑↓
                        </Badge>
                        <span>to adjust</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex-1"
              >
                <Button
                  ref={generateButtonRef}
                  onClick={handleGenerate}
                  className="w-full h-12 sm:h-14 text-sm sm:text-base font-medium shadow-sm"
                  size="lg"
                  disabled={isGenerating}
                  title="Generate PKCE values (Cmd+G)"
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
                    {isGenerating ? 'Generating...' : `Generate ${verifierLength}-char PKCE`}
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
                      title="Clear values (Cmd+K)"
                    >
                      <XIcon className="size-4 sm:hidden mr-2" />
                      <span className="hidden sm:inline">Clear</span>
                      <span className="sm:hidden">Clear Values</span>
                    </Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {hasValues ? (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="flex justify-center"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCopyAll}
                      variant="secondary"
                      size="sm"
                      className="gap-2 h-10 px-4 text-sm font-medium bg-accent/50 hover:bg-accent/70 border border-border/30"
                      title="Copy all as JSON (Cmd+Shift+C)"
                    >
                      <AnimatePresence mode="wait">
                        {justCopiedAll ? (
                          <motion.div
                            key="copied"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                          >
                            <ClipboardCheck className="size-4 text-success" />
                            Copied!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2"
                          >
                            <Copy className="size-4" />
                            Copy All as JSON
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>

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
                    label={`Code Verifier (${verifier.length} characters)`}
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
