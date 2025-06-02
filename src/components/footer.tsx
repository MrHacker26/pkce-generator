import { Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Built with ❤️ using React, TypeScript & Tailwind CSS</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/MrHacker26/pkce-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-105 transform"
                title="View source code"
              >
                <Github className="h-4 w-4" />
                Source
              </a>
              <a
                href="https://github.com/MrHacker26"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all hover:scale-105 transform"
                title="Visit my GitHub profile"
              >
                <ExternalLink className="h-3 w-3" />
                Profile
              </a>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">© {new Date().getFullYear()} Tarun Joshi</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
