import Generator from './components/generator'
import Header from './components/header'
import { Footer } from './components/footer'
import { Navigation } from './components/navigation'
import { motion } from 'framer-motion'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/30 flex flex-col">
      <Navigation />
      <div className="flex-1">
        <motion.div
          className="container mx-auto py-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <Generator />
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
