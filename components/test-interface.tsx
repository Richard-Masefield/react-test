"use client"

import { useState, useCallback, useRef } from "react"
import { TestTimer } from "./test-timer"
import { TestProgress } from "./test-progress"
import { QuestionDisplay } from "./question-display"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { TestSession, Question } from "@/types/assessment"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"

interface TestInterfaceProps {
  session: TestSession
  questions: Question[]
  onUpdateSession: (session: TestSession) => void
  onSubmitTest: (session: TestSession) => void
}

export function TestInterface({ session, questions, onUpdateSession, onSubmitTest }: TestInterfaceProps) {
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)

  const currentQuestion = questions[session.currentQuestionIndex]
  const answeredQuestions = Object.keys(session.answers).length

  // Accumulated time spent per question (ms), seeded from any existing session data
  const questionTimesRef = useRef<Record<string, number>>({ ...(session.questionTimes ?? {}) })
  // The question currently being viewed and when the view started
  const activeQuestionRef = useRef<{ id: string; startedAt: number }>({
    id: currentQuestion.id,
    startedAt: Date.now(),
  })

  // Add the time spent on the active question to the running totals
  const flushActiveTime = useCallback(() => {
    const { id, startedAt } = activeQuestionRef.current
    const elapsed = Date.now() - startedAt
    questionTimesRef.current[id] = (questionTimesRef.current[id] ?? 0) + elapsed
    activeQuestionRef.current = { id, startedAt: Date.now() }
  }, [])

  const handleAnswerChange = useCallback(
    (questionId: string, answer: string | number) => {
      const updatedSession = {
        ...session,
        answers: {
          ...session.answers,
          [questionId]: answer,
        },
      }
      onUpdateSession(updatedSession)
    },
    [session, onUpdateSession],
  )

  const handleNavigateQuestion = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "prev"
          ? Math.max(0, session.currentQuestionIndex - 1)
          : Math.min(questions.length - 1, session.currentQuestionIndex + 1)

      // Record time on the question we're leaving, then start tracking the new one
      flushActiveTime()
      activeQuestionRef.current = { id: questions[newIndex].id, startedAt: Date.now() }

      const updatedSession = {
        ...session,
        currentQuestionIndex: newIndex,
        questionTimes: { ...questionTimesRef.current },
      }
      onUpdateSession(updatedSession)
    },
    [session, questions, onUpdateSession, flushActiveTime],
  )

  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true)
  }, [])

  const handleSubmitTest = useCallback(() => {
    flushActiveTime()
    const finalSession = {
      ...session,
      endTime: new Date(),
      isSubmitted: true,
      questionTimes: { ...questionTimesRef.current },
    }
    onSubmitTest(finalSession)
  }, [session, onSubmitTest, flushActiveTime])

  const canGoPrev = session.currentQuestionIndex > 0
  const canGoNext = session.currentQuestionIndex < questions.length - 1
  const isLastQuestion = session.currentQuestionIndex === questions.length - 1

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-card-foreground">Senior React Engineer Assessment</h1>
              <p className="text-sm text-muted-foreground">Candidate: {session.candidateName}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto sm:items-center">
              <TestTimer startTime={session.startTime} timeLimit={session.timeLimit} onTimeUp={handleTimeUp} />
              <TestProgress
                currentQuestion={session.currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestions}
              />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="space-y-6">
          {/* Question Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Question {session.currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionDisplay
                question={currentQuestion}
                selectedAnswer={session.answers[currentQuestion.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => handleNavigateQuestion("prev")}
              disabled={!canGoPrev}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {isLastQuestion ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={() => handleNavigateQuestion("next")}
                  disabled={!canGoNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your test? You have answered {answeredQuestions} out of {questions.length}{" "}
              questions. Once submitted, you cannot make any changes to your answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest} className="bg-primary text-primary-foreground">
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog} onOpenChange={() => {}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your time has expired. The test will be automatically submitted with your current answers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmitTest} className="bg-primary text-primary-foreground">
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
