import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

type CopyButtonProps = {
  text: string
  field: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  size?: VariantProps<typeof Button>['size']
  variant?: VariantProps<typeof Button>['variant']
}

export function CopyButton({
  text,
  field,
  disabled = false,
  className,
  style,
  size = 'sm',
  variant = 'outline',
}: CopyButtonProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  async function copyToClipboard() {
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success('Copied to clipboard')
      setTimeout(() => {
        setCopiedField(null)
      }, 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  const isCopied = copiedField === field

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant={variant}
        size={size}
        onClick={copyToClipboard}
        className={cn('transition-all hover:bg-accent/50', className)}
        style={style}
        disabled={disabled || !text}
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="copied"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <CheckCircle className="size-3 mr-1.5 text-success" />
              Copied
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Copy className="size-3 mr-1.5" />
              Copy
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}
