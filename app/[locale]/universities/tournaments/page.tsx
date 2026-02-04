import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Users, Calendar, Gamepad2 } from "lucide-react";
import Link from "next/link";

// Mock tournament data
const tournaments = [
  {
    id: "1",
    name: "Spring Championship 2024",
    game: "League of Legends",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    status: "live" as const,
    participants: 16,
    type: "single-elimination" as const,
    prizePool: "$5,000",
    currentRound: "Semifinals",
  },
  {
    id: "2",
    name: "Valorant Invitational",
    game: "Valorant",
    startDate: "2024-03-20",
    endDate: "2024-03-22",
    status: "upcoming" as const,
    participants: 8,
    type: "double-elimination" as const,
    prizePool: "$3,000",
    currentRound: null,
  },
  {
    id: "3",
    name: "CS:GO Winter Cup",
    game: "Counter-Strike: Global Offensive",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "completed" as const,
    participants: 12,
    type: "swiss" as const,
    prizePool: "$2,500",
    currentRound: null,
    winner: "Team Alpha",
  },
];

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "live":
      return "default";
    case "upcoming":
      return "secondary";
    case "completed":
      return "outline";
    default:
      return "secondary";
  }
}

export default function UniversityTournamentsPage() {
  const liveTournaments = tournaments.filter((t) => t.status === "live");
  const upcomingTournaments = tournaments.filter((t) => t.status === "upcoming");
  const completedTournaments = tournaments.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track tournament brackets and results
          </p>
        </div>
        <Button
          className="h-10 gap-2 rounded-xl px-6 font-bold bg-[#FF0034] hover:bg-[#E60030] text-white shadow-lg shadow-[#FF0034]/25 transition-all duration-300 hover:scale-105 active:scale-95"
          asChild
        >
          <Link href="tournaments/create">
            <Plus className="h-4 w-4" width={16} height={16} />
            Create Tournament
          </Link>
        </Button>
      </div>

      {liveTournaments.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wider">
            Live Now
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="gradient-card border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#FF0034]/20 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-[#FF0034] focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Gamepad2 className="h-4 w-4" width={16} height={16} aria-hidden="true" />
                      <span>{tournament.game}</span>
                    </div>
                    <Badge className="bg-[#FF0034] text-white animate-pulse motion-reduce:animate-none hover:bg-[#E60030] transition-colors">
                      ● LIVE
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {tournament.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" width={12} height={12} />
                      <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" width={16} height={16} />
                      <span>{tournament.participants} teams</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-[#FF0034]/30 text-[#FF0034]">
                      {tournament.type}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium text-green-400">
                    Current: {tournament.currentRound}
                  </div>
                  <div className="text-sm font-bold text-[#FF0034]">
                    Prize Pool: {tournament.prizePool}
                  </div>
                  <Button className="w-full mt-3 border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300" variant="outline" asChild>
                    <Link href={`tournaments/${tournament.id}`}>
                      View Bracket
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {upcomingTournaments.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wider">
            Upcoming
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="gradient-card border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#FF0034]/20 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-[#FF0034] focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Gamepad2 className="h-4 w-4" width={16} height={16} aria-hidden="true" />
                      <span>{tournament.game}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(tournament.status)}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {tournament.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" width={12} height={12} />
                      <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" width={16} height={16} />
                      <span>{tournament.participants} teams</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-[#FF0034]/30 text-[#FF0034]">
                      {tournament.type}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-[#FF0034]">
                    Prize Pool: {tournament.prizePool}
                  </div>
                  <Button className="w-full mt-3 border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300" variant="outline" asChild>
                    <Link href={`tournaments/${tournament.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedTournaments.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wider">
            Completed
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="gradient-card border-border opacity-90 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-lg hover:shadow-[#FF0034]/20 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-[#FF0034] focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                      <Gamepad2 className="h-4 w-4" width={16} height={16} aria-hidden="true" />
                      <span>{tournament.game}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(tournament.status)}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {tournament.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" width={12} height={12} />
                      <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" width={16} height={16} />
                      <span>{tournament.participants} teams</span>
                    </div>
                    <Badge variant="outline" className="text-xs border-[#FF0034]/30 text-[#FF0034]">
                      {tournament.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-yellow-500" width={16} height={16} />
                    <span className="font-medium text-white">{tournament.winner}</span>
                  </div>
                  <Button className="w-full mt-3 border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300" variant="outline" asChild>
                    <Link href={`tournaments/${tournament.id}`}>
                      View Results
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tournaments.length === 0 && (
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="text-muted-foreground mb-4 h-12 w-12 opacity-50" width={48} height={48} />
            <p className="text-muted-foreground text-center text-sm">
              Create your first tournament to get started. Tournaments you organize
              will appear on this page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}