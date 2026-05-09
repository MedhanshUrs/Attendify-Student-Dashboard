"use client"

import { useEffect, useState, useRef } from "react"
import { Bell, X, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSessionSync } from "@/hooks/use-session-sync"
import { toast } from "sonner"

interface StoredNotification {
  id: string
  message: string
  time: string
  type: "session_started" | "session_ended"
}

const NOTIFICATIONS_KEY = "attendify_notifications"

export function SessionNotificationBanner() {
  const { isActive, message } = useSessionSync()
  const [showBanner, setShowBanner] = useState(false)
  const [bannerMessage, setBannerMessage] = useState("")
  const [bannerType, setBannerType] = useState<"started" | "ended">("started")
  const hasInitialized = useRef(false)
  const lastSessionState = useRef<boolean | null>(null)

  // Save notification to localStorage for the Activity Feed
  const saveNotification = (notification: StoredNotification) => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY)
      const notifications: StoredNotification[] = stored ? JSON.parse(stored) : []
      
      // Add new notification at the beginning, keep max 10
      const updated = [notification, ...notifications].slice(0, 10)
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated))
      
      // Dispatch event for other components to pick up
      window.dispatchEvent(new CustomEvent("attendify_notification_added", { detail: notification }))
    } catch {
      // Ignore storage errors
    }
  }

  // Track session state changes after initial load
  useEffect(() => {
    // Skip the very first render cycle to avoid false positives
    if (!hasInitialized.current) {
      hasInitialized.current = true
      lastSessionState.current = isActive
      return
    }

    // Detect actual state change from inactive to active
    const wasInactive = lastSessionState.current === false
    const isNowActive = isActive === true
    
    if (wasInactive && isNowActive) {
      const notificationMessage = message || "Attendance Session Started"
      setBannerMessage(notificationMessage)
      setBannerType("started")
      setShowBanner(true)

      // Show toast notification
      toast.success("Class Started", {
        description: notificationMessage,
        icon: <Bell className="h-4 w-4" />,
        duration: 5000,
      })

      // Save to notifications
      saveNotification({
        id: `session-${Date.now()}`,
        message: notificationMessage,
        time: "Just now",
        type: "session_started",
      })

      // Auto-hide banner after 8 seconds
      const timer = setTimeout(() => setShowBanner(false), 8000)
      lastSessionState.current = isActive
      return () => clearTimeout(timer)
    }

    // Detect actual state change from active to inactive
    const wasActive = lastSessionState.current === true
    const isNowInactive = isActive === false
    
    if (wasActive && isNowInactive) {
      setBannerMessage("Attendance Session Ended")
      setBannerType("ended")
      setShowBanner(true)

      // Show toast notification
      toast.info("Session Ended", {
        description: "The attendance session has ended",
        duration: 4000,
      })

      // Save to notifications
      saveNotification({
        id: `session-${Date.now()}`,
        message: "Attendance Session Ended",
        time: "Just now",
        type: "session_ended",
      })

      // Auto-hide banner after 5 seconds
      const timer = setTimeout(() => setShowBanner(false), 5000)
      lastSessionState.current = isActive
      return () => clearTimeout(timer)
    }

    lastSessionState.current = isActive
  }, [isActive, message])

  if (!showBanner) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out",
        showBanner ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          bannerType === "started"
            ? "bg-gradient-to-r from-primary via-primary/90 to-primary"
            : "bg-gradient-to-r from-muted via-muted/90 to-muted"
        )}
      >
        {/* Animated background pulse */}
        {bannerType === "started" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  bannerType === "started" ? "bg-white/20" : "bg-foreground/10"
                )}
              >
                {bannerType === "started" ? (
                  <Radio className="h-4 w-4 text-primary-foreground animate-pulse" />
                ) : (
                  <Bell className="h-4 w-4 text-foreground" />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    bannerType === "started" ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {bannerType === "started" ? "Attendance Session Started" : "Session Ended"}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    bannerType === "started" ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {bannerMessage}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className={cn(
                "rounded-full p-1 transition-colors",
                bannerType === "started"
                  ? "hover:bg-white/20 text-primary-foreground"
                  : "hover:bg-foreground/10 text-foreground"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
          <div
            className={cn(
              "h-full bg-white/50 animate-shrink-width",
              bannerType === "started" ? "animation-duration-8000" : "animation-duration-5000"
            )}
            style={{
              animation: `shrinkWidth ${bannerType === "started" ? "8s" : "5s"} linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
