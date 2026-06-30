import { type NextRequest, NextResponse } from "next/server"
import type { TestSession, Question } from "@/types/assessment"
import { Resend } from "resend"

interface SubmissionData {
  session: TestSession
  questions: Question[]
  score: number
  submissionEmails: string[]
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Environment check - NODE_ENV:", process.env.NODE_ENV)
    console.log(
      "[v0] Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("RESEND")),
    )

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("[v0] RESEND_API_KEY environment variable is not set")
      console.error("[v0] All environment variables:", Object.keys(process.env))
      return NextResponse.json(
        {
          success: false,
          message: "Email service not configured. Please contact administrator.",
        },
        { status: 500 },
      )
    }

    if (!apiKey.startsWith("re_")) {
      console.error("[v0] Invalid RESEND_API_KEY format - should start with 're_'")
      return NextResponse.json(
        {
          success: false,
          message: "Email service misconfigured. Please contact administrator.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] API Key found and validated, initializing Resend...")
    const resend = new Resend(apiKey)

    const data: SubmissionData = await request.json()
    const { session, questions, score, submissionEmails } = data

    console.log("[v0] Processing submission for:", session.candidateName)
    console.log("[v0] Sending to emails:", submissionEmails)

    // Calculate detailed results
    const results = questions.map((question) => {
      const userAnswer = session.answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
      }
    })

    const correctAnswers = results.filter((r) => r.isCorrect).length
    const totalQuestions = questions.length
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)

    // Create email content
    const emailContent = generateEmailContent(session, results, finalScore)

    const emailConfig = {
      from: "React Assessment <onboarding@resend.dev>", // Using Resend's default domain for testing
      to: submissionEmails,
      subject: `React Senior Developer Assessment - ${session.candidateName}`,
      text: emailContent,
    }

    console.log("[v0] Email configuration:", {
      from: emailConfig.from,
      to: emailConfig.to,
      subject: emailConfig.subject,
      contentLength: emailContent.length,
    })

    try {
      console.log("[v0] Attempting to send email...")
      const emailResult = await resend.emails.send(emailConfig)

      console.log("[v0] Email sent successfully:", emailResult)

      return NextResponse.json({
        success: true,
        score: finalScore,
        correctAnswers,
        totalQuestions,
        message: "Test submitted and email sent successfully",
        emailId: emailResult.data?.id,
      })
    } catch (emailError) {
      console.error("[v0] Failed to send email:", emailError)
      console.error("[v0] Email error details:", {
        message: emailError instanceof Error ? emailError.message : "Unknown error",
        stack: emailError instanceof Error ? emailError.stack : undefined,
      })

      // Still return success for the test submission, but log the email failure
      return NextResponse.json({
        success: true,
        score: finalScore,
        correctAnswers,
        totalQuestions,
        message: "Test submitted successfully, but email delivery failed",
        emailError: emailError instanceof Error ? emailError.message : "Unknown email error",
      })
    }
  } catch (error) {
    console.error("[v0] Error submitting test:", error)
    return NextResponse.json({ success: false, message: "Failed to submit test" }, { status: 500 })
  }
}

function generateEmailContent(session: TestSession, results: any[], score: number): string {
  const correctAnswers = results.filter((r) => r.isCorrect).length
  const totalQuestions = results.length

  const startTime = new Date(session.startTime)
  const endTime = session.endTime ? new Date(session.endTime) : null

  const testDuration =
    endTime && startTime ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : session.timeLimit

  const categoryBreakdown = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = { correct: 0, total: 0 }
      }
      acc[result.category].total++
      if (result.isCorrect) {
        acc[result.category].correct++
      }
      return acc
    },
    {} as Record<string, { correct: number; total: number }>,
  )

  return `
React Senior Developer Assessment Results

Candidate Information:
- Name: ${session.candidateName}
- Email: ${session.candidateEmail}
- Test Date: ${startTime.toLocaleDateString()}
- Test Duration: ${testDuration} minutes

Overall Results:
- Score: ${score}% (${correctAnswers}/${totalQuestions})
- Status: ${score >= 70 ? "PASSED" : "FAILED"}

Category Breakdown:
${Object.entries(categoryBreakdown)
  .map(([category, stats]) => {
    const categoryScore = Math.round((stats.correct / stats.total) * 100)
    const categoryName = category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    return `- ${categoryName}: ${categoryScore}% (${stats.correct}/${stats.total})`
  })
  .join("\n")}

Detailed Results:
${results
  .map(
    (result, index) => `
Question ${index + 1}: ${result.isCorrect ? "✓" : "✗"}
Category: ${result.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
Difficulty: ${result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)}
Question: ${result.question}
User Answer: ${result.userAnswer}
Correct Answer: ${result.correctAnswer}
${!result.isCorrect ? `Explanation: ${result.explanation}` : ""}
`,
  )
  .join("\n---\n")}

This assessment was automatically generated and submitted through the React Senior Developer Assessment System.
  `.trim()
}
