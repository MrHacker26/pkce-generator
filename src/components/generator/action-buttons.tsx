import { Button } from '@/components/ui/button'
import { RefreshCwIcon, XIcon, Copy, ClipboardCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActionButtonsProps = {
  hasValues: boolean
  isGenerating: boolean
  verifierLength: number
  justCopiedAll: boolean
  onGenerate: () => void
  onClear: () => void
  onCopyAll: () => void
  generateButtonRef: React.RefObject<HTMLButtonElement>
}

export function ActionButtons({
  hasValues,
  isGenerating,
  verifierLength,
  justCopiedAll,
  onGenerate,
  onClear,
  onCopyAll,
  generateButtonRef,
}: ActionButtonsProps) {
  return (
    <>
      <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex-1"
        >
          <Button
            ref={generateButtonRef}
            onClick={onGenerate}
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
                onClick={onClear}
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
                onClick={onCopyAll}
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
    </>
  )
}
