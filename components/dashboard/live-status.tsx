"use client"

import { Radio, Users, Clock, MapPin, CheckCircle2, Wifi, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { fetchCurrentSession, WebSocketService } from "@/lib/api"

const initialSession = {
  subject: "Artificial Intelligence",
  code: "CS403",
  room: "Lab 102",
  professor: "Dr. Rajesh Kumar",
  startTime: "14:00 PM",
  endTime: "15:30 PM",
  attendeesPresent: 0,
  totalStrength: 15,
}

export function LiveStatus() {
  const [isLive, setIsLive] = useState(false)
  const [studentStatus, setStudentStatus] = useState("pending")
  const [markedAt, setMarkedAt] = useState<string | null>(null)
  const [attendeesPresent, setAttendeesPresent] = useState(initialSession.attendeesPresent)

  // Using mock student ID 1 (Arjun Sharma) for simulation
  const myStudentId = "1"

  useEffect(() => {
    const loadCurrentSession = async () => {
      try {
        const response = await fetchCurrentSession()
        if (response?.current_session?.is_live) {
          setIsLive(true)
          setAttendeesPresent(response.current_session.attendees_present || 0)
        }
      } catch (error) {
        console.error("Failed to load current session", error)
      }
    }

    loadCurrentSession()

    const wsService = new WebSocketService(myStudentId, 'student')
    wsService.connect()

    const removeListener = wsService.addMessageListener((msg) => {
      if (msg.type === 'session_started') {
        setIsLive(true)
        setStudentStatus('pending')
        setMarkedAt(null)
        setAttendeesPresent(0)
      } else if (msg.type === 'session_ended') {
        setIsLive(false)
        setStudentStatus((prev) => (prev === 'pending' ? 'absent' : prev))
      } else if (msg.type === 'student_detected') {
        // Increment present count for class progress
        if (msg.data.status === 'present' || msg.data.status === 'late') {
          setAttendeesPresent((prev) => prev + 1)
        }
        
        // If it's this specific student
        if (msg.data.student_id === myStudentId) {
          setStudentStatus(msg.data.status)
          setMarkedAt(msg.data.detected_at)
        }
      }
    })

    return () => {
      removeListener()
      wsService.disconnect()
    }
  }, [myStudentId])

  const attendancePercentage = (attendeesPresent / initialSession.totalStrength) * 100

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
      {/* Animated background glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      
      <CardContent className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Radio className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Live Session</h3>
                <Badge className={`border-0 text-[10px] uppercase tracking-wider ${isLive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {isLive ? 'In Progress' : 'Scheduled'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {isLive ? 'Auto-monitoring active' : 'Waiting for professor to start'}
              </p>
            </div>
          </div>
          
          {/* Student Status */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
            studentStatus === 'present' ? 'bg-success/20' : 
            studentStatus === 'late' ? 'bg-warning/20' :
            studentStatus === 'absent' ? 'bg-destructive/20' : 'bg-secondary/50'
          }`}>
            {studentStatus === 'present' && <CheckCircle2 className="h-4 w-4 text-success" />}
            {studentStatus === 'late' && <Clock className="h-4 w-4 text-warning" />}
            {studentStatus === 'absent' && <Wifi className="h-4 w-4 text-destructive" />}
            {studentStatus === 'pending' && <Loader2 className={`h-4 w-4 text-muted-foreground ${isLive ? 'animate-spin' : ''}`} />}
            
            <span className={`text-sm font-medium ${
              studentStatus === 'present' ? 'text-success' : 
              studentStatus === 'late' ? 'text-warning' :
              studentStatus === 'absent' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {studentStatus === 'present' ? "You're Present" : 
               studentStatus === 'late' ? "You're Late" :
               studentStatus === 'absent' ? "Absent" : "Pending"}
            </span>
          </div>
        </div>

        {/* Class Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{initialSession.subject}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{initialSession.code} • {initialSession.professor}</p>
        </div>

        {/* Details Grid */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium text-foreground">{initialSession.startTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="text-sm font-medium text-foreground">204</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3">
            <Wifi className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Marked</p>
              <p className="text-sm font-medium text-primary">{markedAt || '--:--'}</p>
            </div>
          </div>
        </div>

        {/* Class Attendance Progress */}
        <div className="rounded-xl bg-secondary/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Class Attendance</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              {attendeesPresent}/{initialSession.totalStrength}
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000"
              style={{ width: `${attendancePercentage}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 rounded-full bg-primary/50 blur-sm transition-all duration-1000"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {Math.round(attendancePercentage)}% of students present
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
