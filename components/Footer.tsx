export function Footer() {
  return (
    <footer className="py-12 px-4 bg-card/50 border-t border-border/50">
      <div className="container mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GamerPlug
          </h3>
          <p className="text-muted-foreground mb-6">Connecting gamers, building communities, creating legends.</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-6">© 2025 GamerPlug. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}