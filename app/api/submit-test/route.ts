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
    const results = questions.map((question, index) => {
      const userAnswer = session.answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      const timeSpentMs = session.questionTimes?.[question.id] ?? 0

      // Resolve the human-readable answer text for choice-based questions
      const resolveAnswer = (value: string | number | undefined) => {
        if (value === undefined || value === null || value === "") return "Not answered"
        if ((question.type === "multiple-choice" || question.type === "code-review") && question.options) {
          const idx = typeof value === "number" ? value : Number.parseInt(value as string, 10)
          return Number.isNaN(idx) ? String(value) : (question.options[idx] ?? String(value))
        }
        return String(value)
      }

      return {
        number: index + 1,
        questionId: question.id,
        question: question.question,
        userAnswer,
        userAnswerText: resolveAnswer(userAnswer),
        correctAnswerText: resolveAnswer(question.correctAnswer),
        isCorrect,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        timeSpentMs,
      }
    })

    const correctAnswers = results.filter((r) => r.isCorrect).length
    const totalQuestions = questions.length
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100)

    // Create email content (HTML + plain-text fallback)
    const emailContent = generateEmailContent(session, results, finalScore)

    const emailConfig = {
      from: "React Assessment <onboarding@resend.dev>", // Using Resend's default domain for testing
      to: submissionEmails,
      subject: `Assessment Result: ${session.candidateName} — ${finalScore}% (${finalScore >= 70 ? "Pass" : "Fail"})`,
      html: emailContent.html,
      text: emailContent.text,
    }

    console.log("[v0] Email configuration:", {
      from: emailConfig.from,
      to: emailConfig.to,
      subject: emailConfig.subject,
      contentLength: emailContent.html.length,
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

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatCategory(category: string): string {
  return category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatDuration(ms: number): string {
  if (!ms || ms < 1000) return "<1s"
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function generateEmailContent(session: TestSession, results: any[], score: number): { html: string; text: string } {
  const correctAnswers = results.filter((r) => r.isCorrect).length
  const totalQuestions = results.length
  const answered = results.filter((r) => r.userAnswer !== undefined && r.userAnswer !== "").length
  const passed = score >= 70

  const startTime = new Date(session.startTime)
  const endTime = session.endTime ? new Date(session.endTime) : null
  const testDuration =
    endTime && startTime ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) : session.timeLimit
  const totalTimeMs = results.reduce((sum, r) => sum + (r.timeSpentMs ?? 0), 0)
  const avgTimeMs = totalQuestions > 0 ? totalTimeMs / totalQuestions : 0

  const categoryBreakdown = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) acc[result.category] = { correct: 0, total: 0 }
      acc[result.category].total++
      if (result.isCorrect) acc[result.category].correct++
      return acc
    },
    {} as Record<string, { correct: number; total: number }>,
  )

  const accent = passed ? "#15803d" : "#b91c1c"

  // ---- HTML version ----
  const statRow = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-collapse:separate;border-spacing:8px;">
      <tr>
        ${[
          ["Score", `${score}%`],
          ["Correct", `${correctAnswers}/${totalQuestions}`],
          ["Answered", `${answered}/${totalQuestions}`],
          ["Duration", `${testDuration}m`],
        ]
          .map(
            ([label, value]) => `
          <td align="center" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:14px 8px;">
            <div style="font-size:20px;font-weight:700;color:#0f172a;">${value}</div>
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#64748b;">${label}</div>
          </td>`,
          )
          .join("")}
      </tr>
    </table>`

  const categoryRows = Object.entries(categoryBreakdown)
    .map(([category, stats]) => {
      const pct = Math.round((stats.correct / stats.total) * 100)
      return `
        <tr>
          <td style="padding:6px 0;color:#334155;">${escapeHtml(formatCategory(category))}</td>
          <td align="right" style="padding:6px 0;color:#0f172a;font-weight:600;">${stats.correct}/${stats.total} (${pct}%)</td>
        </tr>`
    })
    .join("")

  const questionRows = results
    .map((r) => {
      const badge = r.isCorrect
        ? `<span style="color:#15803d;font-weight:700;">Correct</span>`
        : `<span style="color:#b91c1c;font-weight:700;">Incorrect</span>`
      return `
        <tr><td style="padding:16px;border:1px solid #e5e7eb;border-radius:8px;">
          <div style="font-size:12px;color:#64748b;margin-bottom:4px;">
            Q${r.number} · ${escapeHtml(formatCategory(r.category))} · ${escapeHtml(r.difficulty)} · ⏱ ${formatDuration(r.timeSpentMs)}
          </div>
          <div style="font-weight:600;color:#0f172a;margin-bottom:8px;">${escapeHtml(r.question)}</div>
          <div style="font-size:14px;color:#334155;">Candidate answer: ${escapeHtml(r.userAnswerText)} &nbsp;—&nbsp; ${badge}</div>
          <div style="font-size:14px;color:#334155;margin-top:2px;">Correct answer: ${escapeHtml(r.correctAnswerText)}</div>
          ${
            !r.isCorrect
              ? `<div style="font-size:13px;color:#64748b;margin-top:8px;border-top:1px solid #f1f5f9;padding-top:8px;">${escapeHtml(r.explanation)}</div>`
              : ""
          }
        </td></tr>
        <tr><td style="height:10px;"></td></tr>`
    })
    .join("")

  const html = `
  <div style="background:#f1f5f9;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr><td style="background:#0f172a;padding:24px 28px;">
            <div style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">Senior React Engineer Assessment</div>
            <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:4px;">${escapeHtml(session.candidateName)}</div>
            <div style="color:#cbd5e1;font-size:14px;margin-top:2px;">${escapeHtml(session.candidateEmail)}</div>
          </td></tr>
          <tr><td style="padding:24px 28px;">
            <div style="display:inline-block;background:${accent};color:#ffffff;font-size:13px;font-weight:600;padding:6px 14px;border-radius:999px;">
              ${passed ? "PASSED" : "FAILED"} · ${score}%
            </div>
            ${statRow}
            <div style="font-size:13px;color:#64748b;margin-top:4px;">
              Submitted ${escapeHtml(endTime ? endTime.toLocaleString() : new Date().toLocaleString())} ·
              Total active time ${formatDuration(totalTimeMs)} · Avg ${formatDuration(avgTimeMs)}/question
            </div>

            <h3 style="font-size:15px;color:#0f172a;margin:24px 0 8px;">Category Breakdown</h3>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${categoryRows}</table>

            <h3 style="font-size:15px;color:#0f172a;margin:24px 0 12px;">Question-by-Question</h3>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${questionRows}</table>
          </td></tr>
          <tr><td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e5e7eb;">
            <div style="font-size:12px;color:#94a3b8;">Automatically generated by the Senior React Engineer Assessment system.</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`.trim()

  // ---- Plain-text fallback ----
  const text = `
SENIOR REACT ENGINEER ASSESSMENT — RESULTS

Candidate: ${session.candidateName} <${session.candidateEmail}>
Submitted: ${endTime ? endTime.toLocaleString() : new Date().toLocaleString()}

RESULT: ${passed ? "PASSED" : "FAILED"} — ${score}% (${correctAnswers}/${totalQuestions} correct)
Answered: ${answered}/${totalQuestions}
Duration: ${testDuration} min (active ${formatDuration(totalTimeMs)}, avg ${formatDuration(avgTimeMs)}/question)

CATEGORY BREAKDOWN
${Object.entries(categoryBreakdown)
  .map(([category, stats]) => {
    const pct = Math.round((stats.correct / stats.total) * 100)
    return `  ${formatCategory(category)}: ${stats.correct}/${stats.total} (${pct}%)`
  })
  .join("\n")}

QUESTION-BY-QUESTION
${results
  .map(
    (r) =>
      `Q${r.number} [${r.isCorrect ? "CORRECT" : "INCORRECT"}] ${formatCategory(r.category)} · ${r.difficulty} · time ${formatDuration(
        r.timeSpentMs,
      )}
  ${r.question}
  Candidate: ${r.userAnswerText}
  Correct:   ${r.correctAnswerText}${r.isCorrect ? "" : `\n  Why: ${r.explanation}`}`,
  )
  .join("\n\n")}

Automatically generated by the Senior React Engineer Assessment system.
  `.trim()

  return { html, text }
}
