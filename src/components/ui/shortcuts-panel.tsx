import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Keyboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatKeys, type KeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'

type ShortcutsPanelProps = {
  shortcuts: KeyboardShortcut[]
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ShortcutsPanel({
  shortcuts,
  trigger,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: ShortcutsPanelProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnOpenChange || setInternalIsOpen

  const groupedShortcuts = shortcuts.reduce(
    (groups, shortcut) => {
      const category = shortcut.category || 'General'
      if (!groups[category]) groups[category] = []
      groups[category].push(shortcut)
      return groups
    },
    {} as Record<string, KeyboardShortcut[]>,
  )

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-xs font-medium">
      <Keyboard className="size-4" />
      <span className="hidden sm:inline">Shortcuts</span>
      <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0.5">
        ?
      </Badge>
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Keyboard className="size-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <AnimatePresence>
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{category}</h3>
                  <Separator className="flex-1" />
                </div>

                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <motion.div
                      key={`${category}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-sm text-foreground">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <Badge key={keyIndex} variant="outline" className="text-xs font-mono px-2 py-1 bg-muted/50">
                            {formatKeys([key])}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4 border-t border-border/50"
          >
            <p className="text-xs text-muted-foreground text-center">
              Press{' '}
              <Badge variant="outline" className="mx-1 text-xs">
                ?
              </Badge>
              or{' '}
              <Badge variant="outline" className="mx-1 text-xs">
                Shift+?
              </Badge>
              to toggle this panel
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
