'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/components/Providers';
import { MicrophoneIcon, PhoneIcon, PhoneXMarkIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function LiveCall() {
  const pathname = usePathname();
  const { currentModel } = useAppContext();
  
  // Call state
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  
  // Audio recording state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [tempTranscript, setTempTranscript] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Audio refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Conversation history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  // Call timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Cleanup any active streams on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start audio recording
  const startRecording = useCallback(async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      // Start recording in 1-second chunks
      mediaRecorder.start(1000);
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Unable to access microphone. Please check your browser permissions.');
      setIsListening(false);
    }
  }, []);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      
      // Stop all tracks on the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isListening]);
  
  // Process audio and get transcription
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setTempTranscript('Processing audio...');
      
      // In a real implementation, you would send the audio to your API for transcription
      // For this demo, we'll use a timeout to simulate processing and random transcriptions
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample transcriptions
      const sampleTranscriptions = [
        "Can you help me with a React component for form validation?",
        "I'm trying to implement a state management solution for my Next.js app.",
        "How would I optimize a recursive function in JavaScript?",
        "What's the best way to handle authentication in a Next.js application?",
        "Can you explain how context API works in React?"
      ];
      
      // Select a random transcription
      const randomIndex = Math.floor(Math.random() * sampleTranscriptions.length);
      const transcription = sampleTranscriptions[randomIndex];
      
      setTempTranscript('');
      setTranscript(transcription);
      
      // Add to chat history
      const userMessage: ChatMessage = {
        role: 'user',
        content: transcription
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      
      // Get AI response
      await getAIResponse(transcription);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Error processing your audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get AI response from Gemini
  const getAIResponse = async (userText: string) => {
    try {
      setResponseText('Thinking...');
      
      // In a real implementation, you would call your API endpoint that interfaces with Gemini
      // For this demo, we'll use a timeout to simulate processing and generate mock responses
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create contextual responses based on the transcript
      let aiResponse = '';
      
      if (userText.includes('React component') || userText.includes('form validation')) {
        aiResponse = "For a React form validation component, I recommend using either Formik or React Hook Form. Here's a simple example with React Hook Form:\n\n```jsx\nimport { useForm } from 'react-hook-form';\n\nfunction ValidatedForm() {\n  const { register, handleSubmit, errors } = useForm();\n  \n  const onSubmit = (data) => {\n    console.log(data);\n  };\n  \n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input \n        name=\"email\" \n        ref={register({ \n          required: 'Email is required', \n          pattern: {\n            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,\n            message: 'Invalid email address'\n          }\n        })} \n      />\n      {errors.email && <span>{errors.email.message}</span>}\n      \n      <button type=\"submit\">Submit</button>\n    </form>\n  );\n}\n```";
      } else if (userText.includes('state management') || userText.includes('context API')) {
        aiResponse = "For state management in Next.js, you have several options:\n\n1. **React Context API** - Built into React, good for simple state needs\n2. **Redux** - Powerful but has more boilerplate\n3. **Zustand** - Simple and lightweight\n4. **Jotai** - Atomic state management\n\nHere's a simple Context API example:\n\n```jsx\n// Create a context\nconst StateContext = createContext();\n\n// Provider component\nfunction StateProvider({ children }) {\n  const [state, setState] = useState({});\n  \n  return (\n    <StateContext.Provider value={{ state, setState }}>\n      {children}\n    </StateContext.Provider>\n  );\n}\n\n// Usage in component\nfunction MyComponent() {\n  const { state, setState } = useContext(StateContext);\n  // Use state here\n}\n```";
      } else if (userText.includes('optimize') || userText.includes('recursive')) {
        aiResponse = "To optimize a recursive function in JavaScript, you can use techniques like:\n\n1. **Memoization** - Cache results to avoid recalculating\n2. **Tail Call Optimization** - Write recursive calls in tail position\n3. **Convert to Iteration** - Replace recursion with loops\n\nHere's a memoized fibonacci example:\n\n```javascript\nfunction fibMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  \n  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n  return memo[n];\n}\n```";
      } else if (userText.includes('authentication') || userText.includes('Next.js')) {
        aiResponse = "For authentication in Next.js, NextAuth.js is the recommended solution. Here's how to set it up:\n\n1. Install NextAuth.js: `npm install next-auth`\n\n2. Create an API route at `pages/api/auth/[...nextauth].js`:\n\n```javascript\nimport NextAuth from 'next-auth';\nimport Providers from 'next-auth/providers';\n\nexport default NextAuth({\n  providers: [\n    Providers.GitHub({\n      clientId: process.env.GITHUB_ID,\n      clientSecret: process.env.GITHUB_SECRET,\n    }),\n    // Add other providers as needed\n  ],\n  // Add custom options here\n});\n```\n\n3. Use the session in your components:\n\n```jsx\nimport { useSession, signIn, signOut } from 'next-auth/client';\n\nexport default function Component() {\n  const [session, loading] = useSession();\n  \n  if (loading) return <div>Loading...</div>;\n  \n  if (session) {\n    return <button onClick={() => signOut()}>Sign out</button>;\n  }\n  \n  return <button onClick={() => signIn()}>Sign in</button>;\n}\n```";
      } else {
        aiResponse = "I'd be happy to help with your coding question. Could you provide some more specific details about what you're trying to accomplish? I can help with React, Next.js, JavaScript optimization, or any other web development topics.";
      }
      
      setResponseText(aiResponse);
      
      // Add to chat history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Error communicating with AI. Please try again.');
      setResponseText('');
    }
  };
  
  // Start a live call
  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setTranscript('');
    setResponseText('');
    setError('');
    setChatHistory([]);
  };
  
  // End the current call
  const endCall = () => {
    stopRecording();
    setIsCallActive(false);
    setIsListening(false);
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Live Call with AI</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="ml-4">
              <h2 className="font-medium text-lg">AI Assistant</h2>
              <p className="text-sm text-gray-500">{currentModel}</p>
            </div>
          </div>
          
          {isCallActive && (
            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {formatTime(callDuration)}
            </div>
          )}
        </div>
        
        {isCallActive ? (
          <div className="space-y-6">
            {/* Live transcript area */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
              {error && (
                <div className="text-red-500 mb-4 p-2 bg-red-100 dark:bg-red-900/20 rounded">
                  {error}
                </div>
              )}
              
              {tempTranscript && (
                <div className="text-gray-500 mb-4 flex items-center">
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  {tempTranscript}
                </div>
              )}
              
              {chatHistory.length > 0 ? (
                <div className="space-y-6">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`message ${msg.role === 'user' ? 'mb-4' : 'mt-4'}`}>
                      <div className="font-medium text-sm text-gray-500 mb-1">
                        {msg.role === 'user' ? 'You said:' : 'AI response:'}
                      </div>
                      <div className={`pl-3 border-l-2 ${msg.role === 'user' ? 'border-primary-300' : 'border-secondary-300'}`}>
                        {msg.role === 'assistant' ? (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : transcript ? (
                <div>
                  <div className="mb-3">
                    <div className="font-medium text-sm text-gray-500 mb-1">You said:</div>
                    <div className="pl-3 border-l-2 border-primary-300">{transcript}</div>
                  </div>
                  
                  {responseText && (
                    <div className="mt-6">
                      <div className="font-medium text-sm text-gray-500 mb-1">AI response:</div>
                      <div className="pl-3 border-l-2 border-secondary-300 whitespace-pre-wrap">{responseText}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                  <p>Press the microphone button and start speaking...</p>
                </div>
              )}
              
              {isProcessing && !tempTranscript && (
                <div className="flex justify-center mt-4">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-primary-500" />
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMicrophone}
                disabled={isProcessing}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {isListening ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <MicrophoneIcon className="h-6 w-6" />
                )}
              </button>
              
              <button
                onClick={endCall}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <PhoneXMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12">
            <p className="text-lg mb-8 text-center text-gray-600 dark:text-gray-400">
              Start a live conversation with the AI assistant to get real-time help with your coding questions
            </p>
            
            <button
              onClick={startCall}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center transition-colors"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Start Call
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">About Live Call</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Speak directly to the AI assistant for real-time coding help</li>
          <li>Perfect for brainstorming or when you need quick answers</li>
          <li>Your questions will be transcribed and processed by our AI</li>
          <li>Press the microphone button to start/stop recording</li>
          <li>All calls are processed using {currentModel}</li>
        </ul>
      </div>
    </div>
  );
}
