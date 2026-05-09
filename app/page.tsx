import { StudentHeader } from "@/components/dashboard/student-header"
import { LiveStatus } from "@/components/dashboard/live-status"
import { Notifications } from "@/components/dashboard/notifications"
import { Timetable } from "@/components/dashboard/timetable"
import { AttendanceHistory } from "@/components/dashboard/attendance-history"
import { AttendanceAnalytics } from "@/components/dashboard/attendance-analytics"
import { AttendanceStreak } from "@/components/dashboard/attendance-streak"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { SessionNotificationBanner } from "@/components/dashboard/session-notification-banner"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SessionNotificationBanner />
      <StudentHeader />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Good Morning Mohan! 👋</h1>
          <p className="mt-1 text-muted-foreground">{"Here's your real-time attendance overview"}</p>
        </div>

        {/* Streak Section */}
        <div className="mb-8">
          <AttendanceStreak />
        </div>

        {/* Analytics Charts */}
        <div className="mb-8">
          <AttendanceAnalytics />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Live Session & History */}
          <div className="space-y-6 lg:col-span-2">
            <LiveStatus />
            <AttendanceHistory />
          </div>

          {/* Right Column - Schedule, Insights & Notifications */}
          <div className="space-y-6">
            <Timetable />
            <AIInsights />
            <Notifications />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            AttendX • Smart Classroom Attendance & Session Monitoring System
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Powered by AI-based attendance verification • Real-time classroom monitoring
          </p>
        </footer>
      </main>
    </div>
  )
}
