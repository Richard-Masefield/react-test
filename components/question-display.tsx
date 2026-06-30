"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/types/assessment"
import { Code, CheckCircle, XCircle } from "lucide-react"

interface QuestionDisplayProps {
  question: Question
  selectedAnswer: string | number | undefined
  onAnswerChange: (answer: string | number) => void
}

export function QuestionDisplay({ question, selectedAnswer, onAnswerChange }: QuestionDisplayProps) {
  const [shortAnswer, setShortAnswer] = useState(typeof selectedAnswer === "string" ? selectedAnswer : "")

  const handleShortAnswerChange = (value: string) => {
    setShortAnswer(value)
    onAnswerChange(value)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/10 text-success border-success/30"
      case "medium":
        return "bg-warning/15 text-warning-foreground border-warning/40"
      case "hard":
        return "bg-destructive/10 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
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
    return labels[category] || category
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </Badge>
        <Badge variant="secondary">{getCategoryLabel(question.category)}</Badge>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground leading-relaxed">{question.question}</h3>

        {/* Code Block (if present) */}
        {question.code && (
          <Card className="bg-muted border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Code Review</span>
              </div>
              <pre className="text-sm font-mono bg-background p-4 rounded-md border overflow-x-auto">
                <code className="text-foreground">{question.code}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.type === "multiple-choice" && question.options && (
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => onAnswerChange(Number.parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-0.5" />
                <Label htmlFor={`option-${index}`} className="flex-1 text-sm leading-relaxed cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "code-review" && question.options && (
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => onAnswerChange(Number.parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`code-option-${index}`} className="mt-0.5" />
                <Label htmlFor={`code-option-${index}`} className="flex-1 text-sm leading-relaxed cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === "true-false" && (
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => onAnswerChange(value)}
            className="space-y-3"
          >
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedAnswer === "true"
                  ? "bg-success/10 border-success/40 shadow-sm"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="true" id="true-option" />
              <Label htmlFor="true-option" className="flex items-center gap-2 cursor-pointer flex-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className={selectedAnswer === "true" ? "font-medium text-success" : ""}>True</span>
              </Label>
            </div>
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedAnswer === "false"
                  ? "bg-destructive/10 border-destructive/40 shadow-sm"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="false" id="false-option" />
              <Label htmlFor="false-option" className="flex items-center gap-2 cursor-pointer flex-1">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className={selectedAnswer === "false" ? "font-medium text-destructive" : ""}>False</span>
              </Label>
            </div>
          </RadioGroup>
        )}

        {question.type === "short-answer" && (
          <div className="space-y-2">
            <Label htmlFor="short-answer" className="text-sm font-medium">
              Your Answer
            </Label>
            <Textarea
              id="short-answer"
              placeholder="Type your answer here..."
              value={shortAnswer}
              onChange={(e) => handleShortAnswerChange(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Provide a clear and concise answer. Consider including examples if relevant.
            </p>
          </div>
        )}
      </div>

      {/* Answer Status */}
      {selectedAnswer !== undefined && (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/30 rounded-lg">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="text-sm text-success font-medium">Answer saved</span>
        </div>
      )}
    </div>
  )
}
