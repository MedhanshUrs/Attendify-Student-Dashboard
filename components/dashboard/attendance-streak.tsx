"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Trophy, Star, Target, Zap, Award } from "lucide-react"

const achievements = [
  { id: 1, icon: "🔥", label: "Hot Streak", description: "12 days straight", unlocked: true },
  { id: 2, icon: "🏆", label: "Perfect Week", description: "100% this week", unlocked: true },
  { id: 3, icon: "⭐", label: "Rising Star", description: "Improved 15%", unlocked: true },
  { id: 4, icon: "🎯", label: "Sharpshooter", description: "Never late", unlocked: false },
]

const streakDays = [
  { day: "M", present: true },
  { day: "T", present: true },
  { day: "W", present: true },
  { day: "T", present: true },
  { day: "F", present: true },
  { day: "S", present: false },
  { day: "S", present: false },
]

export function AttendanceStreak() {
  const currentStreak = 12
  const bestStreak = 18

  return (
    <Card className="border-border bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Streak Counter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
                <span className="text-4xl">🔥</span>
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
                <Zap className="h-3 w-3" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{currentStreak}</span>
                <span className="text-lg text-muted-foreground">days</span>
              </div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="mt-1 text-xs text-primary">Best: {bestStreak} days</p>
            </div>
          </div>

          {/* Week Tracker */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">This Week</p>
            <div className="flex gap-1.5">
              {streakDays.map((d, i) => (
                <div
                  key={i}
                  className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg transition-all ${
                    d.present
                      ? "bg-primary/20 text-primary shadow-sm shadow-primary/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <span className="text-xs font-medium">{d.day}</span>
                  {d.present && <span className="text-[10px]">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-2 lg:max-w-xs">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`group relative flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:scale-105 ${
                  achievement.unlocked
                    ? "bg-secondary/80 hover:bg-secondary"
                    : "bg-secondary/30 opacity-50"
                }`}
              >
                <span className="text-xl">{achievement.icon}</span>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground">{achievement.label}</p>
                  <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
