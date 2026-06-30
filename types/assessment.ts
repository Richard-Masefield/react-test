export interface Question {
  id: string
  type: "multiple-choice" | "code-review" | "true-false" | "short-answer"
  question: string
  code?: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  category:
    | "react-fundamentals"
    | "hooks"
    | "performance"
    | "best-practices"
    | "modern-web"
    | "lifecycle"
    | "react-19"
    | "frameworks"
    | "state-management"
    | "data-fetching"
    | "ai"
}

export interface TestSession {
  id: string
  candidateName: string
  candidateEmail: string
  startTime: Date
  endTime?: Date
  timeLimit: number // in minutes
  currentQuestionIndex: number
  answers: Record<string, string | number>
  // Time spent on each question, keyed by question id, in milliseconds
  questionTimes?: Record<string, number>
  isSubmitted: boolean
  score?: number
}

export interface TestConfig {
  title: string
  description: string
  timeLimit: number // in minutes
  totalQuestions: number
  passingScore: number
  submissionEmails: string[]
}
