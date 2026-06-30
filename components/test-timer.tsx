"use client"

import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestTimerProps {
  startTime: Date
  timeLimit: number // in minutes
  onTimeUp: () => void
}

export function TestTimer({ startTime, timeLimit, onTimeUp }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
      const totalSeconds = timeLimit * 60
      const remaining = Math.max(0, totalSeconds - elapsed)

      if (remaining === 0) {
        onTimeUp()
      }

      return remaining
    }

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining())

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, timeLimit, onTimeUp])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const isLowTime = timeRemaining <= 300 // 5 minutes or less
  const isCriticalTime = timeRemaining <= 60 // 1 minute or less

  return (
    <Card
      className={`${
        isCriticalTime
          ? "bg-destructive/10 border-destructive"
          : isLowTime
            ? "bg-warning/15 border-warning/40"
            : "bg-card border-border"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {isCriticalTime ? (
            <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
          ) : (
            <Clock className={`h-5 w-5 ${isLowTime ? "text-warning-foreground" : "text-accent"}`} />
          )}
          <div>
            <p className="text-sm font-medium">Time Remaining</p>
            <p
              className={`text-lg font-mono font-bold ${
                isCriticalTime ? "text-destructive" : isLowTime ? "text-warning-foreground" : "text-foreground"
              }`}
            >
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
