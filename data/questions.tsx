"use client"

import type { Question, TestConfig } from "@/types/assessment"

export const reactQuestions: Question[] = [
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
      "The component is missing userId in the dependency array, doesn't handle loading/error states, and could cause memory leaks if unmounted during fetch.",
    difficulty: "medium",
    category: "hooks",
  },
  {
    id: "3",
    type: "multiple-choice",
    question: "Which hook should you use to prevent expensive calculations on every render?",
    options: ["useState", "useEffect", "useMemo", "useCallback"],
    correctAnswer: 2,
    explanation:
      "useMemo memoizes the result of expensive calculations and only recalculates when dependencies change.",
    difficulty: "easy",
    category: "performance",
  },
  {
    id: "4",
    type: "true-false",
    question: "React components should always be pure functions.",
    correctAnswer: "false",
    explanation:
      "While functional components should be pure regarding their props, they can have side effects through hooks like useEffect.",
    difficulty: "medium",
    category: "react-fundamentals",
  },
  {
    id: "5",
    type: "multiple-choice",
    question: "What is the correct way to update state based on previous state?",
    options: [
      "setState(state + 1)",
      "setState(prevState => prevState + 1)",
      "setState(this.state.count + 1)",
      "Both A and B are correct",
    ],
    correctAnswer: 1,
    explanation:
      "Using the functional update pattern ensures you get the latest state value, especially important with concurrent features.",
    difficulty: "easy",
    category: "react-fundamentals",
  },
  {
    id: "6",
    type: "code-review",
    question: "What performance issue does this component have?",
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
      "Missing React.memo",
      "Creating new function on every render",
      "Not using useCallback for onToggle",
      "Missing key prop",
    ],
    correctAnswer: 1,
    explanation:
      "The arrow function in onClick creates a new function on every render, causing unnecessary re-renders of child components.",
    difficulty: "medium",
    category: "performance",
  },
  {
    id: "7",
    type: "multiple-choice",
    question: "When should you use useLayoutEffect instead of useEffect?",
    options: [
      "When you need to measure DOM elements",
      "When you need synchronous execution",
      "When you need to prevent visual flickering",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "useLayoutEffect runs synchronously after all DOM mutations, making it perfect for DOM measurements and preventing visual flickering.",
    difficulty: "hard",
    category: "hooks",
  },
  {
    id: "8",
    type: "multiple-choice",
    question: "What is the purpose of React.StrictMode?",
    options: [
      "Improves performance in production",
      "Helps identify unsafe lifecycles and side effects",
      "Enables concurrent features",
      "Prevents memory leaks",
    ],
    correctAnswer: 1,
    explanation:
      "StrictMode helps identify problems by intentionally double-invoking functions and effects to catch side effects.",
    difficulty: "medium",
    category: "best-practices",
  },
  {
    id: "9",
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
      "Using stale closure in increment/decrement",
      "Missing dependency array",
      "Both A and B",
    ],
    correctAnswer: 3,
    explanation:
      "The functions capture stale count values and should use functional updates. They should also be memoized with useCallback.",
    difficulty: "hard",
    category: "hooks",
  },
  {
    id: "10",
    type: "multiple-choice",
    question: "Which is the best practice for handling forms in React?",
    options: [
      "Always use controlled components",
      "Always use uncontrolled components",
      "Use controlled for validation, uncontrolled for simple forms",
      "Use refs for all form inputs",
    ],
    correctAnswer: 2,
    explanation:
      "Controlled components give you more control for validation and complex logic, while uncontrolled can be simpler for basic forms.",
    difficulty: "medium",
    category: "best-practices",
  },
  {
    id: "11",
    type: "multiple-choice",
    question: "What is the main benefit of React Server Components?",
    options: [
      "Faster client-side rendering",
      "Reduced bundle size and server-side data fetching",
      "Better SEO optimization",
      "Improved accessibility",
    ],
    correctAnswer: 1,
    explanation:
      "Server Components run on the server, reducing bundle size and allowing direct server-side data access without client-server waterfalls.",
    difficulty: "hard",
    category: "modern-web",
  },
  {
    id: "12",
    type: "true-false",
    question: "useCallback and useMemo should be used for every function and calculation to optimize performance.",
    correctAnswer: "false",
    explanation:
      "Overusing useCallback and useMemo can actually hurt performance. Only use them when you have measured performance issues or expensive calculations.",
    difficulty: "medium",
    category: "performance",
  },
  {
    id: "13",
    type: "multiple-choice",
    question: "What happens when you call setState multiple times in the same event handler?",
    options: [
      "Each call triggers a separate re-render",
      "React batches the updates into a single re-render",
      "Only the last setState call takes effect",
      "It causes an infinite loop",
    ],
    correctAnswer: 1,
    explanation:
      "React automatically batches state updates in event handlers and other React-controlled contexts for better performance.",
    difficulty: "medium",
    category: "react-fundamentals",
  },
  {
    id: "14",
    type: "code-review",
    question: "What is the problem with this error boundary?",
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
      "Missing componentDidCatch method",
      "Not logging errors for debugging",
      "Should use hooks instead of class component",
      "Both A and B",
    ],
    correctAnswer: 3,
    explanation:
      "While functional, it's missing componentDidCatch for error logging and reporting, which is crucial for debugging in production.",
    difficulty: "hard",
    category: "best-practices",
  },
  {
    id: "15",
    type: "multiple-choice",
    question: "Which pattern is recommended for sharing logic between components?",
    options: ["Higher-Order Components (HOCs)", "Render Props", "Custom Hooks", "Context API"],
    correctAnswer: 2,
    explanation:
      "Custom hooks are the modern, preferred way to share stateful logic between components in functional React.",
    difficulty: "easy",
    category: "best-practices",
  },
  {
    id: "16",
    type: "multiple-choice",
    question: "What is the correct way to handle async operations in useEffect?",
    options: [
      "Make useEffect async directly",
      "Create an async function inside useEffect",
      "Use .then() chains",
      "Both B and C are correct",
    ],
    correctAnswer: 3,
    explanation:
      "useEffect cannot be async directly. You should either create an async function inside it or use .then() chains.",
    difficulty: "medium",
    category: "hooks",
  },
  {
    id: "17",
    type: "true-false",
    question: "React keys should be array indices for optimal performance.",
    correctAnswer: "false",
    explanation:
      "Using array indices as keys can cause performance issues and bugs when the list order changes. Use stable, unique identifiers instead.",
    difficulty: "easy",
    category: "best-practices",
  },
  {
    id: "18",
    type: "multiple-choice",
    question: "What is the purpose of React.lazy()?",
    options: [
      "Lazy loading of components for code splitting",
      "Delaying component rendering",
      "Optimizing component performance",
      "Creating reusable component templates",
    ],
    correctAnswer: 0,
    explanation:
      "React.lazy() enables code splitting by allowing you to load components dynamically, reducing initial bundle size.",
    difficulty: "medium",
    category: "performance",
  },
  {
    id: "19",
    type: "multiple-choice",
    question: "Which lifecycle method is equivalent to componentDidMount in functional components?",
    options: [
      "useEffect with empty dependency array",
      "useEffect with no dependency array",
      "useLayoutEffect with empty dependency array",
      "Both A and C",
    ],
    correctAnswer: 3,
    explanation:
      "Both useEffect and useLayoutEffect with empty dependency arrays run once after mount, similar to componentDidMount.",
    difficulty: "easy",
    category: "lifecycle",
  },
  {
    id: "20",
    type: "code-review",
    question: "What modern React pattern could improve this component?",
    code: `function DataFetcher({ url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}`,
    options: [
      "Use React Query/SWR for data fetching",
      "Use Suspense for loading states",
      "Extract logic into a custom hook",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "Modern React apps benefit from data fetching libraries, Suspense for loading states, and custom hooks for reusable logic.",
    difficulty: "hard",
    category: "modern-web",
  },
]

export const testConfig: TestConfig = {
  title: "React Senior Developer Assessment",
  description:
    "A comprehensive test covering React fundamentals, hooks, performance optimization, and modern web development practices.",
  timeLimit: 20, // Changed from 45 to 20 minutes (1 minute per question)
  totalQuestions: 20,
  passingScore: 70,
  submissionEmails: ["rmasefieldreapit@gmail.com"], // Replace with your actual email addresses
}
