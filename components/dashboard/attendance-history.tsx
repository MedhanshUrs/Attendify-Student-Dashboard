"use client"

import { TrendingUp, BookOpen, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const subjects = [
  {
    id: 1,
    name: "Database Management Systems",
    code: "CS302",
    attended: 28,
    total: 30,
    percentage: 93,
    trend: "up",
  },
  {
    id: 2,
    name: "Automata Theory & Computation",
    code: "CS304",
    attended: 25,
    total: 28,
    percentage: 89,
    trend: "up",
  },
  {
    id: 3,
    name: "Computer Networks",
    code: "CS306",
    attended: 22,
    total: 26,
    percentage: 85,
    trend: "down",
  },
  {
    id: 4,
    name: "Software Engineering",
    code: "CS308",
    attended: 20,
    total: 24,
    percentage: 83,
    trend: "stable",
  },
]

function getProgressColor(percentage: number) {
  if (percentage >= 90) return "bg-gradient-to-r from-success to-success/80"
  if (percentage >= 75) return "bg-gradient-to-r from-primary to-primary/80"
  if (percentage >= 60) return "bg-gradient-to-r from-warning to-warning/80"
  return "bg-gradient-to-r from-destructive to-destructive/80"
}

function getTextColor(percentage: number) {
  if (percentage >= 90) return "text-success"
  if (percentage >= 75) return "text-primary"
  if (percentage >= 60) return "text-warning"
  return "text-destructive"
}

function getBgColor(percentage: number) {
  if (percentage >= 90) return "bg-success/10"
  if (percentage >= 75) return "bg-primary/10"
  if (percentage >= 60) return "bg-warning/10"
  return "bg-destructive/10"
}

export function AttendanceHistory() {
  const overallAttendance = Math.round(
    subjects.reduce((acc, sub) => acc + sub.percentage, 0) / subjects.length
  )

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
            Subject-wise Attendance
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full px-3 py-1", getBgColor(overallAttendance))}>
              <span className={cn("text-sm font-bold", getTextColor(overallAttendance))}>
                {overallAttendance}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Overall</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div 
              key={subject.id} 
              className="group rounded-xl bg-secondary/30 p-4 transition-all hover:bg-secondary/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", getBgColor(subject.percentage))}>
                    <BookOpen className={cn("h-5 w-5", getTextColor(subject.percentage))} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">{subject.code} • {subject.attended}/{subject.total} classes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xl font-bold", getTextColor(subject.percentage))}>
                    {subject.percentage}%
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", getProgressColor(subject.percentage))}
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
