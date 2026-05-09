"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle2, Radio, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StoredNotification {
  id: string
  message: string
  time: string
  type: "session_started" | "session_ended"
}

const NOTIFICATIONS_KEY = "attendify_notifications"

const defaultNotifications = [
  {
    id: "default-1",
    type: "live",
    message: "DBMS session is now monitoring attendance",
    time: "Just now",
    icon: Radio,
  },
  {
    id: "default-2",
    type: "success",
    message: "Auto-marked present for DBMS",
    time: "2 min ago",
    icon: CheckCircle2,
  },
  {
    id: "default-3",
    type: "success",
    message: "Attendance confirmed for ATC",
    time: "1 hour ago",
    icon: CheckCircle2,
  },
  {
    id: "default-4",
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
  session_started: "bg-primary/20 text-primary",
  session_ended: "bg-muted text-muted-foreground",
}

export function Notifications() {
  const [sessionNotifications, setSessionNotifications] = useState<StoredNotification[]>([])

  // Load stored notifications on mount
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY)
        if (stored) {
          setSessionNotifications(JSON.parse(stored))
        }
      } catch {
        // Ignore storage errors
      }
    }

    loadNotifications()

    // Listen for new notifications
    const handleNewNotification = (e: CustomEvent<StoredNotification>) => {
      setSessionNotifications((prev) => [e.detail, ...prev].slice(0, 10))
    }

    window.addEventListener("attendify_notification_added", handleNewNotification as EventListener)

    // Poll for changes (in case of cross-tab updates)
    const pollInterval = setInterval(loadNotifications, 2000)

    return () => {
      window.removeEventListener("attendify_notification_added", handleNewNotification as EventListener)
      clearInterval(pollInterval)
    }
  }, [])

  // Combine session notifications with default ones
  const allNotifications = [
    ...sessionNotifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      time: n.time,
      icon: n.type === "session_started" ? Radio : Bell,
      isSessionNotification: true,
    })),
    ...defaultNotifications.map((n) => ({
      ...n,
      isSessionNotification: false,
    })),
  ].slice(0, 6) // Show max 6 notifications

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
          {allNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 transition-all",
                index === 0 && notification.isSessionNotification
                  ? "bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-500"
                  : index === 0
                    ? "bg-primary/5 border border-primary/20"
                    : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-2",
                  typeStyles[notification.type as keyof typeof typeStyles]
                )}
              >
                <notification.icon
                  className={cn(
                    "h-4 w-4",
                    (notification.type === "live" || notification.type === "session_started") &&
                      "animate-pulse"
                  )}
                />
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
