import Image from 'next/image'
import { getAllGames } from '@/lib/games'

export const SupportedGamesPlatforms = async () => {
  const games = await getAllGames()

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {games.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No games available right now.</p>
          </div>
        ) : (
          <div className="flex flex-nowrap gap-3 md:gap-4 lg:gap-6 justify-center items-center max-w-7xl mx-auto">
            {games.map((game, idx) => (
              <div
                key={game.id || idx}
                className="flex items-center justify-center group flex-1"
                style={{ minWidth: '60px', maxWidth: '100px' }}
              >
                <div className="relative w-full aspect-square bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Image
                    src={game.image || '/placeholder.svg'}
                    alt={game.display_name}
                    fill
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
