import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.1,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="flex items-center gap-2 p-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full shadow-lg">
        <motion.a
          href="https://github.com/MrHacker26/pkce-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-accent/50 rounded-full transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <Github className="h-4 w-4" />
        </motion.a>
        <ThemeToggle />
      </div>
    </motion.nav>
  )
}
