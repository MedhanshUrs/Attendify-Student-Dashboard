"use client"

import { Bell, CheckCircle2, Radio, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    type: "live",
    message: "DBMS session is now monitoring attendance",
    time: "Just now",
    icon: Radio,
  },
  {
    id: 2,
    type: "success",
    message: "Auto-marked present for DBMS",
    time: "2 min ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    type: "success",
    message: "Attendance confirmed for ATC",
    time: "1 hour ago",
    icon: CheckCircle2,
  },
  {
    id: 4,
    type: "info",
    message: "Computer Networks starts in 2 hours",
    time: "2 hours ago",
    icon: Wifi,
  },
]

const typeStyles = {
  live: "bg-primary/20 text-primary",
  info: "bg-chart-2/20 text-chart-2",
  success: "bg-success/20 text-success",
}

export function Notifications() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Bell className="h-4 w-4 text-foreground" />
          </div>
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 transition-all",
                index === 0 ? "bg-primary/5 border border-primary/20" : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div className={cn("rounded-lg p-2", typeStyles[notification.type as keyof typeof typeStyles])}>
                <notification.icon className={cn("h-4 w-4", notification.type === "live" && "animate-pulse")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{notification.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
