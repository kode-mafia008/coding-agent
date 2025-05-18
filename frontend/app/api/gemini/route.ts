import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * API route for Gemini AI integration
 * In a production environment, this would connect to Google's Generative AI API
 * For this demo, we'll simulate responses with predefined content
 */
export async function POST(request: NextRequest) {
  try {
    // Get the text and conversation context from the request
    const { text, context } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }
    
    // For demo purposes, we'll simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate response based on user input patterns
    let response = '';
    
    if (text.includes('React component') || text.includes('form validation')) {
      response = "For a React form validation component, I recommend using either Formik or React Hook Form. Here's a simple example with React Hook Form:\n\n```jsx\nimport { useForm } from 'react-hook-form';\n\nfunction ValidatedForm() {\n  const { register, handleSubmit, errors } = useForm();\n  \n  const onSubmit = (data) => {\n    console.log(data);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input \n        name=\"email\" \n        ref={register({ \n          required: 'Email is required', \n          pattern: {\n            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,\n            message: 'Invalid email address'\n          }\n        })} \n      />\n      {errors.email && <span>{errors.email.message}</span>}\n      \n      <button type=\"submit\">Submit</button>\n    </form>\n  );\n}\n```";
    } else if (text.includes('state management') || text.includes('context API')) {
      response = "For state management in Next.js, you have several options:\n\n1. **React Context API** - Built into React, good for simple state needs\n2. **Redux** - Powerful but has more boilerplate\n3. **Zustand** - Simple and lightweight\n4. **Jotai** - Atomic state management\n\nHere's a simple Context API example:\n\n```jsx\n// Create a context\nconst StateContext = createContext();\n\n// Provider component\nfunction StateProvider({ children }) {\n  const [state, setState] = useState({});\n  \n  return (\n    <StateContext.Provider value={{ state, setState }}>\n      {children}\n    </StateContext.Provider>\n  );\n}\n\n// Usage in component\nfunction MyComponent() {\n  const { state, setState } = useContext(StateContext);\n  // Use state here\n}\n```";
    } else if (text.includes('optimize') || text.includes('recursive')) {
      response = "To optimize a recursive function in JavaScript, you can use techniques like:\n\n1. **Memoization** - Cache results to avoid recalculating\n2. **Tail Call Optimization** - Write recursive calls in tail position\n3. **Convert to Iteration** - Replace recursion with loops\n\nHere's a memoized fibonacci example:\n\n```javascript\nfunction fibMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  \n  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n  return memo[n];\n}\n```";
    } else if (text.includes('authentication') || text.includes('Next.js')) {
      response = "For authentication in Next.js, NextAuth.js is the recommended solution. Here's how to set it up:\n\n1. Install NextAuth.js: `npm install next-auth`\n\n2. Create an API route at `pages/api/auth/[...nextauth].js`:\n\n```javascript\nimport NextAuth from 'next-auth';\nimport Providers from 'next-auth/providers';\n\nexport default NextAuth({\n  providers: [\n    Providers.GitHub({\n      clientId: process.env.GITHUB_ID,\n      clientSecret: process.env.GITHUB_SECRET,\n    }),\n    // Add other providers as needed\n  ],\n  // Add custom options here\n});\n```\n\n3. Use the session in your components:\n\n```jsx\nimport { useSession, signIn, signOut } from 'next-auth/client';\n\nexport default function Component() {\n  const [session, loading] = useSession();\n  \n  if (loading) return <div>Loading...</div>;\n  \n  if (session) {\n    return <button onClick={() => signOut()}>Sign out</button>;\n  }\n  \n  return <button onClick={() => signIn()}>Sign in</button>;\n}\n```";
    } else if (text.includes('useMemo') || text.includes('useCallback')) {
      response = "The key difference between `useMemo` and `useCallback` in React:\n\n- `useMemo` memoizes a **computed value**:\n```jsx\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);\n```\n\n- `useCallback` memoizes a **function**:\n```jsx\nconst memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);\n```\n\nUse `useMemo` when you want to avoid expensive recalculations on every render. Use `useCallback` when you want to prevent a function from being recreated on every render, especially when passing it to optimized child components that rely on reference equality to prevent unnecessary renders.";
    } else if (text.includes('server-side rendering') || text.includes('SSR')) {
      response = "For server-side rendering in Next.js, you have several options:\n\n1. **getServerSideProps** - Runs on every request\n```jsx\nexport async function getServerSideProps(context) {\n  return {\n    props: { data: await fetchData() }\n  };\n}\n```\n\n2. **getStaticProps** - Runs at build time\n```jsx\nexport async function getStaticProps() {\n  return {\n    props: { data: await fetchData() },\n    revalidate: 60 // Optional: revalidate after 60 seconds\n  };\n}\n```\n\n3. **getStaticPaths** - For dynamic routes with getStaticProps\n```jsx\nexport async function getStaticPaths() {\n  const paths = await fetchPaths();\n  return {\n    paths,\n    fallback: false // or 'blocking' or true\n  };\n}\n```\n\nChoose based on your needs: getServerSideProps for always-fresh data, getStaticProps for content that doesn't change often.";
    } else if (text.includes('API requests') || text.includes('fetching data')) {
      response = "Best practices for handling API requests in React:\n\n1. **Use React Query or SWR** for data fetching:\n```jsx\nconst { data, isLoading, error } = useQuery('posts', fetchPosts);\n```\n\n2. **Create custom hooks** for API logic:\n```jsx\nfunction useUsers() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    async function fetchUsers() {\n      try {\n        setLoading(true);\n        const response = await fetch('/api/users');\n        const data = await response.json();\n        setUsers(data);\n      } catch (err) {\n        setError(err);\n      } finally {\n        setLoading(false);\n      }\n    }\n    fetchUsers();\n  }, []);\n\n  return { users, loading, error };\n}\n```\n\n3. **Handle loading and error states** consistently\n4. **Use AbortController** to cancel requests when components unmount\n5. **Implement proper error boundaries** for failed requests";
    } else {
      response = "I'd be happy to help with your coding question. Could you provide some more specific details about what you're trying to accomplish? I can help with React, Next.js, JavaScript optimization, or any other web development topics.";
    }
    
    // In a production environment, this would be using Gemini API
    // For example:
    // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const chat = model.startChat({ history: context || [] });
    // const result = await chat.sendMessage(text);
    // const response = result.response.text();
    
    return NextResponse.json({
      text: response
    });
  } catch (error) {
    console.error('Error getting AI response:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
