import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, CalendarDays, TrendingUp, UserPlus, CalendarCheck } from "lucide-react";
import universityMockData from "@/data/universities-mock.json";

export default function UniversitiesDashboardPage() {
  const { dashboard, recentActivity } = universityMockData;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your university esports program
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total players
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold tabular-nums">
              {dashboard.totalPlayers}
            </span>
            <p className="text-muted-foreground text-xs">
              Registered players in your program
            </p>
          </CardContent>
        </Card>
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming events
            </CardTitle>
            <CalendarDays className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold tabular-nums">
              {dashboard.upcomingEvents}
            </span>
            <p className="text-muted-foreground text-xs">
              Events in the next 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active this week
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold tabular-nums">
              {dashboard.activeThisWeek}
            </span>
            <p className="text-muted-foreground text-xs">
              Players with recent activity
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Recent activity
            </CardTitle>
            <CardDescription>
              Latest sign-ups and event registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
                  >
                    {item.type === "signup" ? (
                      <UserPlus className="text-muted-foreground h-4 w-4 shrink-0" />
                    ) : (
                      <CalendarCheck className="text-muted-foreground h-4 w-4 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">{item.playerName}</span>
                      {item.type === "signup" ? (
                        <span className="text-muted-foreground">
                          {" "}
                          joined · {item.game}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {" "}
                          registered for {item.eventName}
                        </span>
                      )}
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {item.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center text-sm">
                No recent activity to show
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="gradient-card border-border shadow-sm transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Quick actions
            </CardTitle>
            <CardDescription>
              Manage your program and events
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium">
              Add player (coming soon)
            </span>
            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium">
              Create event (coming soon)
            </span>
            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium">
              Export roster (coming soon)
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
