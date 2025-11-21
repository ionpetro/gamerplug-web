import { GamesPageSkeleton } from "@/components/skeletons/GamesPageSkeleton"

export default function GamesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
              Popular Games
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find your gaming community in the most popular titles. Connect with players who share your passion and skill level.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <GamesPageSkeleton className="max-w-7xl mx-auto" />
        </div>
      </section>
    </div>
  )
}
