"use client"

import type { Question, TestConfig } from "@/types/assessment"

export const reactQuestions: Question[] = [
  // ---------- Core React & hooks (timeless fundamentals) ----------
  {
    id: "1",
    type: "multiple-choice",
    question: "What is the most common mistake when using useEffect?",
    options: [
      "Not providing a dependency array",
      "Forgetting to return a cleanup function",
      "Missing dependencies in the dependency array",
      "Using async functions directly in useEffect",
    ],
    correctAnswer: 2,
    explanation:
      "Missing dependencies in the dependency array can lead to stale closures and bugs. React's exhaustive-deps ESLint rule helps catch this.",
    difficulty: "medium",
    category: "hooks",
  },
  {
    id: "2",
    type: "code-review",
    question: "What is wrong with this React component?",
    code: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []);

  return <div>{user?.name}</div>;
}`,
    options: [
      "Missing userId in dependency array",
      "Not handling loading state",
      "Not handling error state",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "The component is missing userId in the dependency array, doesn't handle loading/error states, and could cause a race condition if userId changes mid-fetch. In modern apps this belongs in a data-fetching library, not raw useEffect.",
    difficulty: "medium",
    category: "hooks",
  },
  {
    id: "3",
    type: "multiple-choice",
    question: "Which hook memoizes the result of an expensive calculation between renders?",
    options: ["useState", "useEffect", "useMemo", "useCallback"],
    correctAnswer: 2,
    explanation:
      "useMemo memoizes the result of expensive calculations and only recalculates when its dependencies change.",
    difficulty: "easy",
    category: "performance",
  },
  {
    id: "4",
    type: "multiple-choice",
    question: "What is the correct way to update state based on the previous state?",
    options: [
      "setCount(count + 1)",
      "setCount(prev => prev + 1)",
      "setCount(this.state.count + 1)",
      "Both A and B are always equivalent",
    ],
    correctAnswer: 1,
    explanation:
      "The functional updater form guarantees you operate on the latest queued state, which matters with batching and concurrent rendering.",
    difficulty: "easy",
    category: "react-fundamentals",
  },
  {
    id: "5",
    type: "code-review",
    question: "What performance concern does this component pattern raise?",
    code: `function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => onToggle(todo.id)}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`,
    options: [
      "It is missing React.memo",
      "A new inline function is created for each row on every render",
      "It is missing a key prop",
      "onToggle must be wrapped in useState",
    ],
    correctAnswer: 1,
    explanation:
      "Inline arrow functions create a new reference each render. For memoized children this breaks referential equality. Note: the React Compiler can now optimize many of these cases automatically.",
    difficulty: "medium",
    category: "performance",
  },
  {
    id: "6",
    type: "code-review",
    question: "What is the issue with this custom hook?",
    code: `function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return { count, increment, decrement };
}`,
    options: [
      "Functions are not memoized",
      "It relies on a potentially stale count value",
      "Missing dependency array",
      "Both A and B",
    ],
    correctAnswer: 3,
    explanation:
      "increment/decrement close over count and should use the functional updater (prev => prev + 1). They should also be memoized with useCallback if passed to memoized children.",
    difficulty: "hard",
    category: "hooks",
  },
  {
    id: "7",
    type: "multiple-choice",
    question: "When should you prefer controlled vs uncontrolled form inputs?",
    options: [
      "Always use controlled components",
      "Always use uncontrolled components",
      "Controlled for live validation/derived UI, uncontrolled (or form Actions) for simple submit-only forms",
      "Use refs for all form inputs",
    ],
    correctAnswer: 2,
    explanation:
      "Controlled inputs give per-keystroke control for validation and dependent UI; uncontrolled inputs (often read via FormData in a form Action) are simpler for submit-only forms.",
    difficulty: "medium",
    category: "best-practices",
  },
  {
    id: "8",
    type: "code-review",
    question: "What is missing from this error boundary?",
    code: `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`,
    options: [
      "componentDidCatch for logging/reporting errors",
      "It must be rewritten as a function component",
      "A dependency array",
      "Nothing — error boundaries are obsolete in React 19",
    ],
    correctAnswer: 0,
    explanation:
      "Error boundaries still require class components (or a library wrapper). This one works but lacks componentDidCatch, which you need to log errors to your monitoring service.",
    difficulty: "hard",
    category: "best-practices",
  },
  {
    id: "9",
    type: "multiple-choice",
    question: "What is the modern, preferred way to share stateful logic between components?",
    options: ["Higher-Order Components (HOCs)", "Render Props", "Custom Hooks", "Mixins"],
    correctAnswer: 2,
    explanation:
      "Custom hooks are the idiomatic way to extract and reuse stateful logic in function components.",
    difficulty: "easy",
    category: "best-practices",
  },
  {
    id: "10",
    type: "true-false",
    question: "Using the array index as a list key is fine for any list, including ones that reorder or filter.",
    correctAnswer: "false",
    explanation:
      "Index keys break component identity when items are inserted, removed, or reordered, causing subtle state bugs. Use stable, unique IDs.",
    difficulty: "easy",
    category: "best-practices",
  },
  {
    id: "11",
    type: "multiple-choice",
    question: "What is the primary purpose of React.lazy + Suspense?",
    options: [
      "Code splitting: load a component's bundle on demand",
      "Delaying state updates",
      "Memoizing expensive renders",
      "Creating reusable component templates",
    ],
    correctAnswer: 0,
    explanation:
      "React.lazy enables code splitting so a component's JS is fetched only when needed, with Suspense providing the fallback UI.",
    difficulty: "medium",
    category: "performance",
  },

  // ---------- React 19 / modern React ----------
  {
    id: "12",
    type: "multiple-choice",
    question: "What does the React 19 `use()` API let you do that traditional hooks cannot?",
    options: [
      "Call it conditionally and inside loops, and read a Promise or Context",
      "Replace useState entirely",
      "Run effects on the server only",
      "Memoize values without a dependency array",
    ],
    correctAnswer: 0,
    explanation:
      "Unlike other hooks, use() can be called conditionally/inside branches. It can unwrap a Promise (suspending until it resolves) or read Context.",
    difficulty: "hard",
    category: "react-19",
  },
  {
    id: "13",
    type: "code-review",
    question: "Which React 19 hook is designed to manage form submission state with Actions?",
    code: `// Goal: handle a form submit, track pending state and the returned result
async function updateName(prevState, formData) {
  const name = formData.get("name");
  return await save(name);
}`,
    options: [
      "useReducer",
      "useActionState",
      "useDeferredValue",
      "useSyncExternalStore",
    ],
    correctAnswer: 1,
    explanation:
      "useActionState wraps an async Action and returns [state, formAction, isPending], letting forms submit without manual loading/error wiring.",
    difficulty: "hard",
    category: "react-19",
  },
  {
    id: "14",
    type: "multiple-choice",
    question: "What problem does the React 19 `useOptimistic` hook solve?",
    options: [
      "Caching server responses across routes",
      "Showing an immediate, expected UI update while an async action is still in flight",
      "Preventing unnecessary re-renders",
      "Lazy-loading components",
    ],
    correctAnswer: 1,
    explanation:
      "useOptimistic lets you render an optimistic state immediately (e.g. an added comment) and automatically reconcile once the real result returns.",
    difficulty: "hard",
    category: "react-19",
  },
  {
    id: "15",
    type: "true-false",
    question:
      "With the React Compiler enabled, you must still manually wrap every value in useMemo/useCallback for good performance.",
    correctAnswer: "false",
    explanation:
      "The React Compiler auto-memoizes components and values at build time, removing most manual useMemo/useCallback. You add them only for specific cases the compiler can't cover.",
    difficulty: "medium",
    category: "react-19",
  },

  // ---------- Frameworks: RSC, Server Actions, React vs Next.js ----------
  {
    id: "16",
    type: "multiple-choice",
    question: "Which is NOT allowed inside a React Server Component?",
    options: [
      "Directly awaiting a database query",
      "Importing a Node-only module",
      "Using useState or useEffect",
      "Rendering a Client Component as a child",
    ],
    correctAnswer: 2,
    explanation:
      "Server Components have no client interactivity or lifecycle, so hooks like useState/useEffect aren't available. Interactive logic belongs in Client Components.",
    difficulty: "hard",
    category: "frameworks",
  },
  {
    id: "17",
    type: "multiple-choice",
    question: "What is a React/Next.js Server Action?",
    options: [
      "A client-side reducer for global state",
      "A function marked to run on the server that you can call from client components/forms",
      "A way to lazy-load images",
      "A replacement for React Context",
    ],
    correctAnswer: 1,
    explanation:
      "Server Actions ('use server') run on the server and can be invoked from forms or event handlers, handling mutations without manually building an API route.",
    difficulty: "medium",
    category: "frameworks",
  },
  {
    id: "18",
    type: "multiple-choice",
    question: "When is reaching for a framework like Next.js most justified over plain client-side React (e.g. Vite SPA)?",
    options: [
      "When you need SSR/SSG, server components, routing, and data-fetching conventions out of the box",
      "Only when the app is very small",
      "Never — a framework always adds overhead with no benefit",
      "Only for static marketing sites with no interactivity",
    ],
    correctAnswer: 0,
    explanation:
      "Next.js shines when you want server rendering, SEO, file-based routing, server components/actions, and caching conventions. A pure SPA can be fine for internal, behind-auth tools where SEO/SSR don't matter.",
    difficulty: "medium",
    category: "frameworks",
  },

  // ---------- State management: Redux / RTK / Saga / server state ----------
  {
    id: "19",
    type: "multiple-choice",
    question: "Why is Redux Toolkit (RTK) recommended over hand-written 'classic' Redux today?",
    options: [
      "It removes the need for a single store",
      "It reduces boilerplate (createSlice, immutable updates via Immer, configured store) and bakes in best practices",
      "It makes Redux synchronous",
      "It replaces React's component model",
    ],
    correctAnswer: 1,
    explanation:
      "RTK is the official, recommended approach: createSlice generates actions/reducers, Immer allows 'mutating' syntax, and configureStore sets up sane defaults and middleware.",
    difficulty: "medium",
    category: "state-management",
  },
  {
    id: "20",
    type: "multiple-choice",
    question: "When would redux-saga be a better fit than redux-thunk?",
    options: [
      "For simple one-off async calls",
      "For complex, long-lived async flows — cancellation, debouncing, concurrency, and orchestration of many effects",
      "When you want to avoid any middleware",
      "Only for synchronous state updates",
    ],
    correctAnswer: 1,
    explanation:
      "Thunks are great for simple async logic. Sagas (generator-based) shine for complex orchestration: cancellation, racing, debouncing, and coordinating long-running side effects.",
    difficulty: "hard",
    category: "state-management",
  },
  {
    id: "21",
    type: "multiple-choice",
    question:
      "For caching server data (fetching, revalidation, deduping), what is the modern recommendation over storing it in a Redux slice?",
    options: [
      "Always normalize it into Redux manually",
      "Use a server-state library like RTK Query, TanStack Query, or SWR",
      "Store it in a global variable",
      "Refetch on every render",
    ],
    correctAnswer: 1,
    explanation:
      "Server state has different needs than client state (caching, background refetch, deduping, invalidation). RTK Query, TanStack Query, or SWR handle this far better than a hand-rolled Redux slice.",
    difficulty: "medium",
    category: "data-fetching",
  },
  {
    id: "22",
    type: "true-false",
    question:
      "For purely local or simple global UI state, lightweight libraries like Zustand or Jotai can be a reasonable alternative to Redux.",
    correctAnswer: "true",
    explanation:
      "Redux is powerful but can be heavy for simple needs. Zustand/Jotai (and React Context for small cases) are valid, lower-ceremony choices depending on app complexity.",
    difficulty: "medium",
    category: "state-management",
  },

  // ---------- AI in React apps ----------
  {
    id: "23",
    type: "multiple-choice",
    question:
      "In a React app using the Vercel AI SDK, what is the main benefit of the `useChat` hook for an LLM chat UI?",
    options: [
      "It trains the model in the browser",
      "It manages streamed messages, input, and loading state, wiring the UI to a streaming chat endpoint",
      "It stores chat history in localStorage automatically",
      "It replaces the need for any backend",
    ],
    correctAnswer: 1,
    explanation:
      "useChat manages the message list, user input, and streaming state, consuming a streamed response from your server route so tokens render progressively as they arrive.",
    difficulty: "medium",
    category: "ai",
  },
]

export const testConfig: TestConfig = {
  title: "Senior React Engineer Assessment",
  description:
    "A modern assessment covering React fundamentals and hooks, React 19 features, Server Components & frameworks, state management (Redux/RTK/Saga), data fetching, and AI integration.",
  timeLimit: 23, // ~1 minute per question
  totalQuestions: 23,
  passingScore: 70,
  submissionEmails: ["rmasefieldreapit@gmail.com"],
}
