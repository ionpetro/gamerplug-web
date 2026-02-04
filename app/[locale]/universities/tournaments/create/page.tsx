"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const games = [
  "League of Legends",
  "Valorant", 
  "Counter-Strike: Global Offensive",
  "Overwatch 2",
  "Apex Legends",
  "Rocket League",
  "Dota 2",
  "Rainbow Six Siege"
];

const tournamentTypes = [
  { value: "single-elimination", label: "Single Elimination" },
  { value: "double-elimination", label: "Double Elimination" },
  { value: "round-robin", label: "Round Robin" },
  { value: "swiss", label: "Swiss System" }
];

export default function CreateTournamentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    type: "",
    startDate: "",
    endDate: "",
    prizePool: "",
    maxParticipants: "",
    description: ""
  });

  const [rules, setRules] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRule = () => {
    setRules(prev => [...prev, ""]);
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, value: string) => {
    setRules(prev => prev.map((rule, i) => i === index ? value : rule));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to tournaments page
      router.push("../tournaments");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="../tournaments">
            <ArrowLeft className="h-4 w-4 mr-2" width={16} height={16} />
            Back to Tournaments
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Tournament</h1>
          <p className="text-muted-foreground mt-1">
            Set up a new tournament for your university
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="gradient-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Tournament Name
                </label>
                <Input
                  id="name"
                  placeholder="e.g., Spring Championship 2024"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="game" className="block text-sm font-medium mb-2">
                  Game
                </label>
                <select
                  id="game"
                  value={formData.game}
                  onChange={(e) => handleInputChange("game", e.target.value)}
                  autoComplete="off"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a game</option>
                  {games.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Describe your tournament..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-2">
                  Tournament Type
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  autoComplete="off"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select tournament type</option>
                  {tournamentTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium mb-2">
                  Max Participants
                </label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 16"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                  min="2"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Schedule & Prizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="prizePool" className="block text-sm font-medium mb-2">
                Prize Pool
              </label>
                <Input
                  id="prizePool"
                  placeholder="e.g., $5,000"
                  value={formData.prizePool}
                  onChange={(e) => handleInputChange("prizePool", e.target.value)}
                  autoComplete="off"
                />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tournament Rules</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addRule} className="border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300">
                <Plus className="h-4 w-4" width={16} height={16} />
                Add Rule
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Rule ${index + 1}`}
                  value={rule}
                  onChange={(e) => updateRule(index, e.target.value)}
                  className="flex-1"
                />
                {rules.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRule(index)}
                    className="border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    <X className="h-4 w-4" width={16} height={16} />
                  </Button>
                )}
              </div>
            ))}
            {rules.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No rules added yet. Click "Add Rule" to get started.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" className="rounded-xl border-[#FF0034]/30 text-[#FF0034] hover:bg-[#FF0034] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95" asChild>
            <Link href="../tournaments">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#FF0034] hover:bg-[#E60030] text-white shadow-lg shadow-[#FF0034]/25 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
            {isSubmitting ? "Creating Tournament..." : "Create Tournament"}
          </Button>
        </div>
      </form>
    </div>
  );
}