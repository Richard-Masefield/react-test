"use client"

import { useState } from "react"
import { IntroductionScreen } from "@/components/introduction-screen"
import { TestInterface } from "@/components/test-interface"
import { TestResults } from "@/components/test-results"
import { testConfig, reactQuestions } from "@/data/questions"
import type { TestSession } from "@/types/assessment"

type AppState = "intro" | "testing" | "results"

export default function Home() {
  const [appState, setAppState] = useState<AppState>("intro")
  const [testSession, setTestSession] = useState<TestSession | null>(null)

  const handleStartTest = (candidateName: string, candidateEmail: string) => {
    const newSession: TestSession = {
      id: `test-${Date.now()}`,
      candidateName,
      candidateEmail,
      startTime: new Date(),
      timeLimit: testConfig.timeLimit,
      currentQuestionIndex: 0,
      answers: {},
      isSubmitted: false,
    }

    setTestSession(newSession)
    setAppState("testing")
  }

  const handleUpdateSession = (updatedSession: TestSession) => {
    setTestSession(updatedSession)
  }

  const handleSubmitTest = async (finalSession: TestSession) => {
    if (!finalSession) return

    try {
      // Calculate score
      const correctAnswers = reactQuestions.filter(
        (question) => finalSession.answers[question.id] === question.correctAnswer,
      ).length

      const score = Math.round((correctAnswers / reactQuestions.length) * 100)

      // Submit to API
      const response = await fetch("/api/submit-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: finalSession,
          questions: reactQuestions,
          score,
          submissionEmails: testConfig.submissionEmails,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Note: the score is intentionally NOT surfaced to the candidate.
        // Detailed results are only delivered to the hiring team via email.
        setTestSession(finalSession)
        setAppState("results")
      } else {
        console.error("Failed to submit test:", result.message)
        // In a real app, show error message to user
      }
    } catch (error) {
      console.error("Error submitting test:", error)
      // In a real app, show error message to user
    }
  }

  const handleStartNewTest = () => {
    setTestSession(null)
    setAppState("intro")
  }

  if (appState === "intro") {
    return <IntroductionScreen config={testConfig} onStartTest={handleStartTest} />
  }

  if (appState === "testing" && testSession) {
    return (
      <TestInterface
        session={testSession}
        questions={reactQuestions}
        onUpdateSession={handleUpdateSession}
        onSubmitTest={handleSubmitTest}
      />
    )
  }

  if (appState === "results" && testSession) {
    return <TestResults session={testSession} questions={reactQuestions} onStartNewTest={handleStartNewTest} />
  }

  return null
}
