import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllGames } from "@/lib/games"

export default async function LocalizedGames({ params }: { params: Promise<{ locale: string }> }) {
  const games = await getAllGames();
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
              {locale === 'es' ? 'Juegos Populares' : 'Popular Games'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {locale === 'es' ? 'Encuentra tu comunidad en los títulos más populares. Conecta con jugadores que comparten tu pasión y nivel.' : 'Find your gaming community in the most popular titles. Connect with players who share your passion and skill level.'}
            </p>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">{locale === 'es' ? 'No se encontraron juegos. Vuelve más tarde.' : 'No games found. Please check back later.'}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {games.map((game) => (
              <Link key={game.id} href={`/${locale}/games/${game.slug}`}>
                <Card
                  className="gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden cursor-pointer p-0"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={game.image || ''}
                      alt={game.display_name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-white text-xs font-medium">{game.rating}</span>
                    </div>
                    <Badge
                      className="absolute bottom-4 left-4 text-xs"
                      style={{ backgroundColor: game.color, border: 'none' }}
                    >
                      {game.playerCount} {locale === 'es' ? 'Jugadores' : 'Players'}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {game.display_name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(game.genres || []).slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-muted-foreground text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {locale === 'es' ? 'Comunidad activa' : 'Active Community'}
                  </div>
                </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}



