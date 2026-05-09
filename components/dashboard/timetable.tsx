"use client"

import { Calendar, Clock, MapPin, Radio, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const classes = [
  {
    id: 1,
    subject: "DBMS",
    code: "CS302",
    time: "10:00 - 11:00",
    room: "204",
    status: "ongoing",
    attended: true,
  },
  {
    id: 2,
    subject: "ATC",
    code: "CS304",
    time: "11:15 - 12:15",
    room: "108",
    status: "upcoming",
    attended: false,
  },
  {
    id: 3,
    subject: "Computer Networks",
    code: "CS306",
    time: "2:00 - 3:00",
    room: "Lab 3",
    status: "upcoming",
    attended: false,
  },
  {
    id: 4,
    subject: "Software Engg.",
    code: "CS308",
    time: "3:15 - 4:15",
    room: "302",
    status: "upcoming",
    attended: false,
  },
]

export function Timetable() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Calendar className="h-4 w-4 text-foreground" />
          </div>
          {"Today's Schedule"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className={cn(
                "relative overflow-hidden rounded-xl p-3 transition-all",
                classItem.status === "ongoing" 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              {classItem.status === "ongoing" && (
                <div className="absolute right-3 top-3">
                  <Radio className="h-4 w-4 text-primary animate-pulse" />
                </div>
              )}
              {classItem.attended && classItem.status !== "ongoing" && (
                <div className="absolute right-3 top-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              )}
              <div className="pr-8">
                <h4 className={cn(
                  "font-medium truncate",
                  classItem.status === "ongoing" ? "text-primary" : "text-foreground"
                )}>
                  {classItem.subject}
                </h4>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {classItem.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {classItem.room}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
