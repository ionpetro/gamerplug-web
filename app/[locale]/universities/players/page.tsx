"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import universityMockData from "@/data/universities-mock.json";

export default function UniversityPlayersPage() {
  const [search, setSearch] = useState("");
  const players = universityMockData.players;

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return players;
    const q = search.toLowerCase();
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q)
    );
  }, [players, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground mt-1">
            All players registered in your university program
          </p>
        </div>
      </div>

      <Card className="gradient-card border-border shadow-sm transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search players by name or username..."
                className="rounded-lg border-border bg-input pl-9 focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-xs">
                All games
              </Badge>
              <Badge variant="outline" className="rounded-md px-2 py-0.5 text-xs">
                All tiers
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlayers.length > 0 ? (
            <ul className="divide-y divide-border">
              {filteredPlayers.map((player) => (
                <li
                  key={player.id}
                  className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      <p className="text-muted-foreground text-sm">
                        @{player.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Badge variant="secondary" className="rounded-md text-xs">
                      {player.game}
                    </Badge>
                    <Badge variant="outline" className="rounded-md text-xs">
                      {player.tier}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
              <Users className="mb-4 h-12 w-12 opacity-50" />
              <p className="font-semibold">
                {search ? "No players match your search" : "No players yet"}
              </p>
              <p className="mt-1 text-sm">
                {search
                  ? "Try a different name or username."
                  : "Player list will appear here once your roster is set up."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
