"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface TestProgressProps {
  currentQuestion: number
  totalQuestions: number
  answeredQuestions: number
}

export function TestProgress({ currentQuestion, totalQuestions, answeredQuestions }: TestProgressProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100
  const answeredPercentage = (answeredQuestions / totalQuestions) * 100

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{answeredQuestions} answered</span>
            <span>{totalQuestions - answeredQuestions} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
