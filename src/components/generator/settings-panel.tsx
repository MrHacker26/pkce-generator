import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn, getSecurityLevel } from '@/lib/utils'

type SettingsPanelProps = {
  showSettings: boolean
  verifierLength: number
  onLengthChange: (length: number) => void
}

export function SettingsPanel({ showSettings, verifierLength, onLengthChange }: SettingsPanelProps) {
  const security = getSecurityLevel(verifierLength)

  return (
    <AnimatePresence>
      {showSettings ? (
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
                onValueChange={([value]) => onLengthChange(value)}
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
      ) : null}
    </AnimatePresence>
  )
}
