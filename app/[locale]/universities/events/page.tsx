import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus } from "lucide-react";
import universityMockData from "@/data/universities-mock.json";

function formatEventDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UniversityEventsPage() {
  const events = universityMockData.events;
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const completedEvents = events.filter((e) => e.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">
            Tournaments and events organized by your university
          </p>
        </div>
        <Button
          disabled
          className="h-10 gap-2 rounded-lg px-6 font-bold transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Create event
        </Button>
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wider">
            Upcoming
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="gradient-card border-border shadow-sm transition-all duration-300 "
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CalendarDays className="h-4 w-4" />
                    <span>{event.game}</span>
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {event.name}
                  </CardTitle>
                  <CardDescription>
                    {formatEventDate(event.date)} · {event.participants}{" "}
                    participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Event details and registration will be available here.
                  </p>
                  <Badge className="mt-2 rounded-md" variant="secondary">
                    {event.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedEvents.length > 0 && (
        <div>
          <h2 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wider">
            Past events
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedEvents.map((event) => (
              <Card
                key={event.id}
                className="gradient-card border-border opacity-90 shadow-sm transition-all duration-300 "
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <CalendarDays className="h-4 w-4" />
                    <span>{event.game}</span>
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {event.name}
                  </CardTitle>
                  <CardDescription>
                    {formatEventDate(event.date)} · {event.participants}{" "}
                    participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="rounded-md">
                    {event.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="text-muted-foreground mb-4 h-12 w-12 opacity-50" />
            <p className="text-muted-foreground text-center text-sm">
              Create your first event to get started. Events you organize will
              appear on this page.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
