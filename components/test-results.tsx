"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { XCircle, Mail, Download, Trophy } from "lucide-react"
import type { TestSession, Question } from "@/types/assessment"

interface TestResultsProps {
  session: TestSession
  questions: Question[]
  score: number
  correctAnswers: number
  onStartNewTest: () => void
}

export function TestResults({ session, questions, score, correctAnswers, onStartNewTest }: TestResultsProps) {
  const totalQuestions = questions.length
  const isPassed = score >= 70
  const testDuration =
    session.endTime && session.startTime
      ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
      : session.timeLimit

  // Calculate category breakdown
  const categoryStats = questions.reduce(
    (acc, question) => {
      const category = question.category
      const userAnswer = session.answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      if (!acc[category]) {
        acc[category] = { correct: 0, total: 0, name: getCategoryName(category) }
      }
      acc[category].total++
      if (isCorrect) {
        acc[category].correct++
      }
      return acc
    },
    {} as Record<string, { correct: number; total: number; name: string }>,
  )

  function getCategoryName(category: string): string {
    const names: Record<string, string> = {
      "react-fundamentals": "React Fundamentals",
      hooks: "React Hooks",
      performance: "Performance",
      "best-practices": "Best Practices",
      "modern-web": "Modern Web",
      lifecycle: "Component Lifecycle",
      "react-19": "React 19",
      frameworks: "Frameworks & RSC",
      "state-management": "State Management",
      "data-fetching": "Data Fetching",
      ai: "AI Integration",
    }
    return names[category] || category
  }

  const downloadResults = () => {
    const results = questions.map((question, index) => {
      const userAnswer = session.answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      return {
        questionNumber: index + 1,
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correctAnswer,
        isCorrect,
        category: getCategoryName(question.category),
        difficulty: question.difficulty,
      }
    })

    const csvContent = [
      ["Question #", "Category", "Difficulty", "Question", "Your Answer", "Correct Answer", "Result"].join(","),
      ...results.map((r) =>
        [
          r.questionNumber,
          r.category,
          r.difficulty,
          `"${r.question.replace(/"/g, '""')}"`,
          `"${r.userAnswer}"`,
          `"${r.correctAnswer}"`,
          r.isCorrect ? "Correct" : "Incorrect",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `react-assessment-${session.candidateName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {isPassed ? (
                <div className="p-4 bg-success/10 rounded-full">
                  <Trophy className="h-12 w-12 text-success" />
                </div>
              ) : (
                <div className="p-4 bg-destructive/10 rounded-full">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Test {isPassed ? "Completed Successfully!" : "Completed"}
              </h1>
              <p className="text-muted-foreground mt-2">Thank you for taking the Senior React Engineer Assessment</p>
            </div>
          </div>

          {/* Overall Results */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Overall Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-foreground">{score}%</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-foreground">
                    {correctAnswers}/{totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-foreground">{testDuration}m</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <Badge variant={isPassed ? "default" : "destructive"}>{isPassed ? "PASSED" : "FAILED"}</Badge>
                </div>
                <Progress value={score} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, stats]) => {
                  const categoryScore = Math.round((stats.correct / stats.total) * 100)
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stats.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.correct}/{stats.total} ({categoryScore}%)
                        </span>
                      </div>
                      <Progress value={categoryScore} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submission Status */}
          <Card className="bg-success/10 border-success/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-success mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Test Submitted Successfully</p>
                  <p className="text-sm text-muted-foreground">
                    Your results have been automatically sent to the hiring team. You should receive a confirmation
                    email shortly.
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Submitted on {session.endTime?.toLocaleString() || new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadResults} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Results
            </Button>
            <Button onClick={onStartNewTest} className="bg-primary text-primary-foreground">
              Take Another Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
