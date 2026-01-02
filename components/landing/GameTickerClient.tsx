'use client'

export const GameTicker = () => {
  const games = ["VALORANT", "APEX LEGENDS", "LEAGUE OF LEGENDS", "CALL OF DUTY", "OVERWATCH 2", "FORTNITE", "CS:GO", "MINECRAFT", "ROCKET LEAGUE", "DOTA 2"]

  return (
    <div className="hidden md:block py-12 bg-background border-y border-border overflow-hidden flex relative z-20">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none"></div>
      <div className="flex gap-16 whitespace-nowrap">
        {[...games, ...games].map((game, i) => (
          <span key={i} className="text-5xl md:text-6xl font-black text-muted-foreground/50 uppercase tracking-tighter hover:text-primary transition-colors cursor-default italic">
            {game}
          </span>
        ))}
      </div>
    </div>
  )
}
