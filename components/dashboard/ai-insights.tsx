"use client"

import { Sparkles, TrendingUp, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const insights = [
  {
    icon: TrendingUp,
    title: "Attendance improving",
    description: "Your attendance is up 12% compared to last month",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Peak performance time",
    description: "You perform best in morning classes (9-11 AM)",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: BookOpen,
    title: "Focus area",
    description: "Consider prioritizing Computer Networks attendance",
    color: "text-warning",
    bg: "bg-warning/10",
  },
]

export function AIInsights() {
  return (
    <Card className="border-border bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          AI Insights
          <span className="ml-auto text-[10px] font-normal text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
            Beta
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="group flex items-start gap-3 rounded-xl bg-secondary/30 p-3 transition-all hover:bg-secondary/50"
          >
            <div className={`rounded-lg p-2 ${insight.bg}`}>
              <insight.icon className={`h-4 w-4 ${insight.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{insight.title}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
        <div className="pt-2 text-center">
          <p className="text-[10px] text-muted-foreground">
            Powered by AI analysis • Updated daily
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
