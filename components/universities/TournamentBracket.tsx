"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ChevronRight } from "lucide-react";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric", 
    year: "numeric",
  }).format(new Date(isoDate));
}

interface Match {
  id: string;
  round: number;
  matchNumber: number;
  team1?: string;
  team2?: string;
  score1?: number;
  score2?: number;
  winner?: string;
  status: "pending" | "live" | "completed";
  scheduledTime?: string;
}

interface BracketProps {
  tournament: {
    id: string;
    name: string;
    game: string;
    status: string;
    type: string;
    participants: number;
    startDate: string;
    endDate: string;
    prizePool: string;
    winner?: string;
  };
  matches: Match[];
}

// Mock data for demonstration
const mockMatches: Match[] = [
  // Round 1 (Quarterfinals)
  { id: "1", round: 1, matchNumber: 1, team1: "Team Alpha", team2: "Team Bravo", score1: 2, score2: 1, winner: "Team Alpha", status: "completed" },
  { id: "2", round: 1, matchNumber: 2, team1: "Team Charlie", team2: "Team Delta", score1: 0, score2: 2, winner: "Team Delta", status: "completed" },
  { id: "3", round: 1, matchNumber: 3, team1: "Team Echo", team2: "Team Foxtrot", score1: 1, score2: 2, winner: "Team Foxtrot", status: "completed" },
  { id: "4", round: 1, matchNumber: 4, team1: "Team Golf", team2: "Team Hotel", score1: 2, score2: 0, winner: "Team Golf", status: "completed" },
  
  // Round 2 (Semifinals)
  { id: "5", round: 2, matchNumber: 1, team1: "Team Alpha", team2: "Team Delta", score1: 1, score2: 1, status: "live" },
  { id: "6", round: 2, matchNumber: 2, team1: "Team Foxtrot", team2: "Team Golf", status: "pending", scheduledTime: "2024-03-16T15:00:00Z" },
  
  // Round 3 (Finals)
  { id: "7", round: 3, matchNumber: 1, status: "pending", scheduledTime: "2024-03-17T18:00:00Z" },
];

export default function TournamentBracket({ tournament, matches = mockMatches }: BracketProps) {
  const rounds = Array.from(new Set(matches.map(match => match.round))).sort((a, b) => a - b);
  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds) return "Finals";
    if (round === totalRounds - 1) return "Semifinals";
    if (round === totalRounds - 2) return "Quarterfinals";
    return `Round ${round}`;
  };

  const getMatchStatusVariant = (status: string) => {
    switch (status) {
      case "live": return "destructive";
      case "completed": return "outline";
      default: return "secondary";
    }
  };

  const getRoundMatches = (round: number) => {
    return matches.filter(match => match.round === round);
  };

  const getWinnerFromPreviousRound = (round: number, matchNumber: number) => {
    const previousRoundMatches = matches.filter(m => m.round === round - 1);
    const index = (matchNumber - 1) * 2;
    const winner1 = previousRoundMatches[index]?.winner;
    const winner2 = previousRoundMatches[index + 1]?.winner;
    return { team1: winner1, team2: winner2 };
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white">{tournament.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" width={16} height={16} />
                  <span>{tournament.participants} teams</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" width={16} height={16} />
                  <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                </div>
                <Badge variant="outline" className="text-xs border-[#FF0034]/30 text-[#FF0034]">
                  {tournament.type}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Prize Pool</div>
              <div className="text-xl font-bold text-[#FF0034]">{tournament.prizePool}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex gap-8 pb-8">
            {rounds.map((round) => (
              <div key={round} className="flex-1 min-w-64">
                <h3 className="text-lg font-semibold mb-4 text-center text-white">
                  {getRoundName(round, rounds.length)}
                </h3>
                <div className="space-y-4">
                  {getRoundMatches(round).map((match, index) => (
                    <Card key={match.id} className="gradient-card border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#FF0034]/20 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-[#FF0034] focus-within:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={match.status === "live" ? "default" : match.status === "completed" ? "outline" : "secondary"}
                              className={`text-xs ${
                                match.status === "live" 
                                  ? "bg-[#FF0034] text-white hover:bg-[#E60030]" 
                                  : match.status === "completed"
                                  ? "border-green-500/30 text-green-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {match.status === "live" && "● LIVE"}
                              {match.status === "completed" && "✓ COMPLETED"}
                              {match.status === "pending" && "⏳ UPCOMING"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {match.scheduledTime && new Date(match.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className={`flex items-center justify-between p-2 rounded-md ${
                              match.winner === match.team1 
                                ? 'bg-[#FF0034]/10 border border-[#FF0034]/30' 
                                : 'bg-muted/30'
                            }`}>
                              <span className={`text-sm font-medium ${
                                match.winner === match.team1 ? 'text-[#FF0034]' : 'text-white'
                              }`}>{match.team1 || "TBD"}</span>
                              {match.status !== "pending" && (
                                <span className="text-sm font-bold text-white">{match.score1 ?? 0}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <div className="text-xs text-muted-foreground">VS</div>
                            </div>
                            
                            <div className={`flex items-center justify-between p-2 rounded-md ${
                              match.winner === match.team2 
                                ? 'bg-[#FF0034]/10 border border-[#FF0034]/30' 
                                : 'bg-muted/30'
                            }`}>
                              <span className={`text-sm font-medium ${
                                match.winner === match.team2 ? 'text-[#FF0034]' : 'text-white'
                              }`}>{match.team2 || "TBD"}</span>
                              {match.status !== "pending" && (
                                <span className="text-sm font-bold text-white">{match.score2 ?? 0}</span>
                              )}
                            </div>
                          </div>
                          
                          {match.status === "live" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100" 
                              aria-label={`View live score for ${match.team1} vs ${match.team2}`}
                            >
                              Live Score
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {matches.some(m => m.status === "completed") && (
        <Card className="gradient-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {matches
                .filter(m => m.status === "completed")
                .slice(-5)
                .reverse()
                .map(match => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-yellow-500" width={16} height={16} aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium text-white">{match.winner} wins</div>
                      <div className="text-xs text-muted-foreground">
                        {match.team1} {match.score1} - {match.score2} {match.team2}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-[#FF0034]/30 text-[#FF0034]">
                    {getRoundName(match.round, rounds.length)}
                  </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}