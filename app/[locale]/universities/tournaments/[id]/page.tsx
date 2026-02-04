import TournamentBracket from "@/components/universities/TournamentBracket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Users, Calendar, Settings, Share2 } from "lucide-react";
import Link from "next/link";

// Mock tournament data
const tournament = {
  id: "1",
  name: "Spring Championship 2024",
  game: "League of Legends",
  status: "live",
  type: "single-elimination",
  participants: 16,
  startDate: "2024-03-15",
  endDate: "2024-03-17",
  prizePool: "$5,000",
  currentRound: "Semifinals",
};

// Mock matches data
const matches = [
  // Round 1 (Quarterfinals)
  { id: "1", round: 1, matchNumber: 1, team1: "Team Alpha", team2: "Team Bravo", score1: 2, score2: 1, winner: "Team Alpha", status: "completed" as const },
  { id: "2", round: 1, matchNumber: 2, team1: "Team Charlie", team2: "Team Delta", score1: 0, score2: 2, winner: "Team Delta", status: "completed" as const },
  { id: "3", round: 1, matchNumber: 3, team1: "Team Echo", team2: "Team Foxtrot", score1: 1, score2: 2, winner: "Team Foxtrot", status: "completed" as const },
  { id: "4", round: 1, matchNumber: 4, team1: "Team Golf", team2: "Team Hotel", score1: 2, score2: 0, winner: "Team Golf", status: "completed" as const },
  
  // Round 2 (Semifinals)
  { id: "5", round: 2, matchNumber: 1, team1: "Team Alpha", team2: "Team Delta", score1: 1, score2: 1, status: "live" as const },
  { id: "6", round: 2, matchNumber: 2, team1: "Team Foxtrot", team2: "Team Golf", status: "pending" as const, scheduledTime: "2024-03-16T15:00:00Z" },
  
  // Round 3 (Finals)
  { id: "7", round: 3, matchNumber: 1, status: "pending" as const, scheduledTime: "2024-03-17T18:00:00Z" },
];

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95" asChild>
            <Link href="../tournaments">
              <ArrowLeft className="h-4 w-4 mr-2" width={16} height={16} />
              Back to Tournaments
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#FF0034] text-white animate-pulse motion-reduce:animate-none hover:bg-[#E60030] transition-colors">
              ● LIVE
            </Badge>
            <Badge variant="outline" className="border-[#FF0034]/30 text-[#FF0034]">
              Semifinals
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
            <Share2 className="h-4 w-4 mr-2" width={16} height={16} />
            Share
          </Button>
          <Button variant="outline" size="sm" className="border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
            <Settings className="h-4 w-4 mr-2" width={16} height={16} />
            Manage
          </Button>
        </div>
      </div>

      <TournamentBracket tournament={tournament} matches={matches} />
    </div>
  );
}