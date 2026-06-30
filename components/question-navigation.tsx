"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

interface QuestionNavigationProps {
  totalQuestions: number
  currentQuestionIndex: number
  answeredQuestions: Record<string, string | number>
  questionIds: string[]
  onNavigateToQuestion: (index: number) => void
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  questionIds,
  onNavigateToQuestion,
}: QuestionNavigationProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-card-foreground">Question Navigation</h3>
            <Badge variant="secondary">
              {Object.keys(answeredQuestions).length} / {totalQuestions} answered
            </Badge>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => {
              const questionId = questionIds[index]
              const isAnswered = questionId && answeredQuestions[questionId] !== undefined
              const isCurrent = index === currentQuestionIndex

              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : "outline"}
                  size="sm"
                  onClick={() => onNavigateToQuestion(index)}
                  className={`relative h-10 w-full ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isAnswered
                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        : "hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                  {isAnswered && !isCurrent && (
                    <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-background rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              <span>Not answered</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 bg-primary rounded-full" />
              <span>Current</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
