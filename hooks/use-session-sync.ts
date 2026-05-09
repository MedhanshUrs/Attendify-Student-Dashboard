"use client"

import { useState, useEffect, useCallback } from "react"

export interface AttendifySession {
  active: boolean
  timestamp: number
  message: string
}

const STORAGE_KEY = "attendify_session"
const POLL_INTERVAL = 1000 // 1 second
const SESSION_EXPIRY = 2 * 60 * 1000 // 2 minutes

export function useSessionSync() {
  const [session, setSession] = useState<AttendifySession | null>(null)
  const [previousSession, setPreviousSession] = useState<AttendifySession | null>(null)
  const [hasMounted, setHasMounted] = useState(false)

  const readSession = useCallback((): AttendifySession | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      
      const parsed: AttendifySession = JSON.parse(stored)
      
      // Check if session has expired (2 minutes)
      if (parsed.active && Date.now() - parsed.timestamp > SESSION_EXPIRY) {
        // Session expired, clear it
        localStorage.removeItem(STORAGE_KEY)
        return { ...parsed, active: false, message: "Session Ended (Expired)" }
      }
      
      return parsed
    } catch {
      return null
    }
  }, [])

  const checkForChanges = useCallback(() => {
    const currentSession = readSession()
    
    setSession((prev) => {
      // Detect state changes
      if (!prev && currentSession?.active) {
        // New session started
        setPreviousSession(prev)
        return currentSession
      }
      
      if (prev?.active && !currentSession?.active) {
        // Session ended
        setPreviousSession(prev)
        return currentSession
      }
      
      if (prev?.active !== currentSession?.active || prev?.timestamp !== currentSession?.timestamp) {
        setPreviousSession(prev)
        return currentSession
      }
      
      return prev
    })
  }, [readSession])

  useEffect(() => {
    setHasMounted(true)
    
    // Initial read
    checkForChanges()

    // Listen for storage events (cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        checkForChanges()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Polling fallback (same tab updates won't trigger storage event)
    const pollInterval = setInterval(checkForChanges, POLL_INTERVAL)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(pollInterval)
    }
  }, [checkForChanges])

  // Helper to detect if session just started (only after mount to avoid initial state triggering)
  const sessionJustStarted = hasMounted && (
    (previousSession?.active === false && session?.active === true) ||
    (previousSession === null && session?.active === true)
  )

  // Helper to detect if session just ended
  const sessionJustEnded = hasMounted && previousSession?.active === true && session?.active === false

  return {
    session,
    isActive: session?.active ?? false,
    sessionJustStarted,
    sessionJustEnded,
    message: session?.message ?? null,
  }
}
