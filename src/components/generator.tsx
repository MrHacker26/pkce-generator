import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import InfoCard from './info-card'
import { motion, AnimatePresence } from 'framer-motion'
import { PKCEField } from '@/components/ui/pkce-field'
import { SuccessIndicator } from '@/components/ui/success-indicator'
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { ShortcutsPanel } from '@/components/ui/shortcuts-panel'
import { usePKCEGenerator } from '@/hooks/use-pkce-generator'
import { useCopyActions } from '@/hooks/use-copy-actions'
import { SettingsPanel } from './generator/settings-panel'
import { ActionButtons } from './generator/action-buttons'

export default function Generator() {
  const [showSettings, setShowSettings] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const generateButtonRef = useRef<HTMLButtonElement>(null!)
  const settingsButtonRef = useRef<HTMLButtonElement>(null!)

  const pkce = usePKCEGenerator()
  const copy = useCopyActions()

  function toggleSettings() {
    setShowSettings((prev) => !prev)
  }

  function toggleShortcuts() {
    setShowShortcuts((prev) => !prev)
  }

  function focusGenerateButton() {
    generateButtonRef.current?.focus()
  }

  function handleClear() {
    pkce.clear()
    if (copy.justCopiedAll) {
      setShowShortcuts(false)
    }
  }

  const shortcuts: KeyboardShortcut[] = [
    {
      keys: ['mod', 'g'],
      description: 'Generate new PKCE values',
      action: pkce.generate,
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
      action: () => {
        copy.copyAll(pkce.verifier, pkce.challenge)
      },
      category: 'Copy',
    },
    {
      keys: ['mod', 'c'],
      description: 'Copy code verifier',
      action: () => {
        copy.copyVerifier(pkce.verifier)
      },
      category: 'Copy',
    },
    {
      keys: ['mod', 'shift', 'v'],
      description: 'Copy code challenge',
      action: () => {
        copy.copyChallenge(pkce.challenge)
      },
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
      action: pkce.increaseLength,
      category: 'Settings',
    },
    {
      keys: ['arrowdown'],
      description: 'Decrease verifier length (-5)',
      action: pkce.decreaseLength,
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
              <div className="hidden sm:flex flex-1 justify-start">
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
            <SettingsPanel
              showSettings={showSettings}
              verifierLength={pkce.verifierLength}
              onLengthChange={pkce.setVerifierLength}
            />

            <ActionButtons
              hasValues={pkce.hasValues}
              isGenerating={pkce.isGenerating}
              verifierLength={pkce.verifierLength}
              justCopiedAll={copy.justCopiedAll}
              onGenerate={pkce.generate}
              onClear={handleClear}
              onCopyAll={() => copy.copyAll(pkce.verifier, pkce.challenge)}
              generateButtonRef={generateButtonRef}
            />

            <AnimatePresence>
              {pkce.error ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <p className="text-destructive text-xs sm:text-sm font-medium">{pkce.error}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {pkce.hasValues ? (
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
                    label={`Code Verifier (${pkce.verifier.length} characters)`}
                    description="High-entropy cryptographic random string (43-128 characters)"
                    value={pkce.verifier}
                    rows={3}
                    delay={0.1}
                  />

                  <PKCEField
                    id="challenge"
                    label="Code Challenge"
                    description="Base64url-encoded SHA256 hash of the code verifier"
                    value={pkce.challenge}
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
