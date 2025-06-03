import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function SuccessIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 mb-6 justify-center"
    >
      <CheckCircle className="size-5 text-success" />
      <span className="font-medium text-success">PKCE values generated successfully</span>
    </motion.div>
  )
}
