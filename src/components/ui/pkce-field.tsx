import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CopyButton } from '@/components/ui/copy-button'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type PKCEFieldProps = {
  id: string
  label: string
  description: string
  value: string
  rows?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function PKCEField({ id, label, description, value, rows = 2, delay = 0, className, style }: PKCEFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay }}
      className={cn('space-y-4', className)}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor={id} className="text-base font-semibold text-foreground">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <CopyButton text={value} field={id} className="h-8 px-3 text-xs" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      >
        <Textarea
          id={id}
          value={value}
          readOnly
          className="font-mono text-sm bg-muted/30 border-2 border-border focus:border-ring transition-colors resize-none"
          rows={rows}
          style={{ minHeight: `${rows * 20 + 40}px` }}
        />
      </motion.div>
    </motion.div>
  )
}
