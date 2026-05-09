"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const presentData = [
  { name: "Present", value: 4, color: "hsl(160, 60%, 50%)" },
  { name: "Remaining", value: 1, color: "hsl(260, 5%, 25%)" },
]

const weeklyData = [
  { day: "Mon", present: 5, absent: 0 },
  { day: "Tue", present: 4, absent: 1 },
  { day: "Wed", present: 5, absent: 0 },
  { day: "Thu", present: 5, absent: 0 },
  { day: "Fri", present: 3, absent: 0 },
]

export function AttendanceAnalytics() {
  const totalClasses = 5
  const presentClasses = 4

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Pie Chart - Present Today */}
      <Card className="border-border bg-gradient-to-br from-card to-secondary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-muted-foreground">Present Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="relative h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={presentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {presentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{presentClasses}</span>
                <span className="text-xs text-muted-foreground">of {totalClasses}</span>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div>
                <p className="text-3xl font-bold text-primary">{Math.round((presentClasses / totalClasses) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Classes attended</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Weekly Overview */}
      <Card className="border-border bg-gradient-to-br from-card to-secondary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-muted-foreground">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "hsl(0, 0%, 65%)" }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(260, 5%, 18%)",
                    border: "1px solid hsl(260, 5%, 28%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(0, 0%, 98%)" }}
                />
                <Bar 
                  dataKey="present" 
                  fill="hsl(160, 60%, 50%)" 
                  radius={[4, 4, 0, 0]} 
                  name="Present"
                />
                <Bar 
                  dataKey="absent" 
                  fill="hsl(80, 50%, 60%)" 
                  radius={[4, 4, 0, 0]} 
                  name="Absent"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Absent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
