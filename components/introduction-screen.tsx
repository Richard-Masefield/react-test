"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Clock, FileText } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import type { TestConfig } from "@/types/assessment"

interface IntroductionScreenProps {
  config: TestConfig
  onStartTest: (candidateName: string, candidateEmail: string) => void
}

export function IntroductionScreen({ config, onStartTest }: IntroductionScreenProps) {
  const [candidateName, setCandidateName] = useState("")
  const [candidateEmail, setCandidateEmail] = useState("")
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {}

    if (!candidateName.trim()) {
      newErrors.name = "Name is required"
    }

    if (!candidateEmail.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateEmail)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartTest = () => {
    if (validateForm()) {
      onStartTest(candidateName.trim(), candidateEmail.trim())
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Technical Assessment
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{config.title}</h1>
          <p className="text-muted-foreground text-lg text-pretty">{config.description}</p>
        </div>

        {/* Test Information Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <FileText className="h-5 w-5" />
              Test Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">Duration</p>
                  <p className="text-muted-foreground text-sm">{config.timeLimit} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">Questions</p>
                  <p className="text-muted-foreground text-sm">{config.totalQuestions} total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Instructions</CardTitle>
            <CardDescription>Please read carefully before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm text-card-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent font-medium">•</span>
                You have {config.timeLimit} minutes to complete {config.totalQuestions} questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-medium">•</span>
                Questions span React fundamentals & hooks, React 19, Server Components, state management
                (Redux/RTK/Saga), data fetching, and AI integration
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-medium">•</span>
                Each question is presented one at a time - you can navigate back and forth
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-medium">•</span>
                Your progress is automatically saved as you answer questions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent font-medium">•</span>
                Once submitted, you cannot modify your answers
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Warning Card */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-foreground">Important Notice</p>
                <p className="text-sm text-muted-foreground">
                  Once you submit your test, you will not be able to make any changes. Make sure to review your answers
                  before final submission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Information Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Candidate Information</CardTitle>
            <CardDescription>Please provide your details to begin the assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <Button
              onClick={handleStartTest}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
