"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail, Clock, ListChecks } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import type { TestSession, Question } from "@/types/assessment"

interface TestResultsProps {
  session: TestSession
  questions: Question[]
  onStartNewTest: () => void
}

export function TestResults({ session, questions, onStartNewTest }: TestResultsProps) {
  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(session.answers).length

  const testDuration =
    session.endTime && session.startTime
      ? Math.max(1, Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60)))
      : session.timeLimit

  const submittedAt = session.endTime ? new Date(session.endTime) : new Date()

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* Confirmation header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-success/10 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground text-balance">Assessment Submitted</h1>
            <p className="text-muted-foreground text-pretty">
              Thank you for completing the Senior React Engineer Assessment. Your responses have been recorded and sent
              to the hiring team for review.
            </p>
          </div>
        </div>

        {/* Submission summary */}
        <Card className="bg-card border-border">
          <CardContent className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <ListChecks className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {answeredQuestions}/{totalQuestions}
                </p>
                <p className="text-xs text-muted-foreground">Questions answered</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{testDuration} min</p>
                <p className="text-xs text-muted-foreground">Time taken</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-success/10 border-success/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-success mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Results sent to the hiring team</p>
                <p className="text-sm text-muted-foreground">
                  Your detailed results are not shown here. The hiring team will be in touch regarding next steps.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Submitted on {submittedAt.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={onStartNewTest} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Return to Start
          </Button>
        </div>
      </div>
    </div>
  )
}
