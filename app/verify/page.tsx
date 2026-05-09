"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, Loader2, UserRound, XCircle } from 'lucide-react'

import { verifyQrAttendance } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function VerifyPage() {
  const [token, setToken] = useState('')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [studentId, setStudentId] = useState('1')
  const [cameraReady, setCameraReady] = useState(false)
  const [useMockFlow, setUseMockFlow] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setToken(params.get('token') || '')
    }
  }, [])

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      if (typeof navigator === 'undefined') {
        setUseMockFlow(true)
        setCameraReady(true)
        return
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setUseMockFlow(true)
        setCameraReady(true)
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraReady(true)
          setUseMockFlow(false)
        }
      } catch (error) {
        console.error('Camera access denied', error)
        setUseMockFlow(true)
        setCameraReady(true)
      }
    }

    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const captureSelfieBlob = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    })
  }

  const handleVerify = async () => {
    setResult(null)
    if (!token) {
      setResult({ ok: false, message: 'Missing QR token in URL.' })
      return
    }
    if (!studentId.trim()) {
      setResult({ ok: false, message: 'Enter student ID.' })
      return
    }

    if (useMockFlow) {
      setSubmitting(true)
      setTimeout(() => {
        setResult({ ok: true, message: 'Verification complete (mock mode).' })
        setSubmitting(false)
      }, 700)
      return
    }

    const selfieBlob = await captureSelfieBlob()
    if (!selfieBlob) {
      setResult({ ok: false, message: 'Unable to capture selfie.' })
      return
    }

    try {
      setSubmitting(true)
      const response = await verifyQrAttendance({
        token,
        studentId: studentId.trim(),
        selfieBlob,
      })
      setResult({
        ok: Boolean(response.ok),
        message: response.message || 'Verification complete.',
      })
    } catch (error) {
      setResult({
        ok: false,
        message: error instanceof Error ? error.message : 'Verification failed',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              QR Attendance Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID (1-4)</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                maxLength={2}
              />
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-secondary/30">
              {useMockFlow ? (
                <div className="flex h-[320px] w-full items-center justify-center text-sm text-muted-foreground">
                  Camera preview unavailable in this environment. Using mock verification mode.
                </div>
              ) : (
                <video ref={videoRef} className="h-[320px] w-full object-cover" muted playsInline />
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />

            <Button onClick={handleVerify} disabled={!cameraReady || submitting} className="w-full gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
              {submitting ? 'Verifying...' : 'Capture Selfie & Verify'}
            </Button>

            {result && (
              <div
                className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                  result.ok ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                }`}
              >
                {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{result.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
