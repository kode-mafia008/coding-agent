'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/components/Providers';
import { MicrophoneIcon, PhoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';

export default function LiveCall() {
  const { currentModel } = useAppContext();
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
    };
  }, [isCallActive]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start a live call
  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setTranscript('');
    setResponseText('');
    // In a real implementation, this would initialize audio streams and connection to backend
  };
  
  // End the current call
  const endCall = () => {
    setIsCallActive(false);
    setIsListening(false);
    // In a real implementation, this would close audio streams and connection to backend
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
    } else {
      // Start listening
      setIsListening(true);
      // Simulate receiving transcripts
      simulateTranscript();
    }
  };
  
  // Simulate transcript for demo purposes
  const simulateTranscript = () => {
    const phrases = [
      "Can you help me with a React component?",
      "I'm trying to implement a state management solution.",
      "How would I optimize this function?",
      "What's the best way to handle authentication in Next.js?"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < phrases.length) {
        setTranscript(prev => prev + (prev ? ' ' : '') + phrases[index]);
        
        // Simulate AI response after a short delay
        setTimeout(() => {
          const responses = [
            "I'd be happy to help with your React component.",
            "For state management, you could consider using Context API or Redux.",
            "To optimize that function, we should look at memoization techniques.",
            "For Next.js authentication, you might want to use NextAuth.js."
          ];
          
          setResponseText(prev => prev + (prev ? '\n\n' : '') + responses[index]);
        }, 1500);
        
        index++;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 3000);
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
              {transcript ? (
                <div>
                  <div className="mb-3">
                    <div className="font-medium text-sm text-gray-500 mb-1">You said:</div>
                    <div className="pl-3 border-l-2 border-primary-300">{transcript}</div>
                  </div>
                  
                  {responseText && (
                    <div className="mt-6">
                      <div className="font-medium text-sm text-gray-500 mb-1">AI response:</div>
                      <div className="pl-3 border-l-2 border-secondary-300">{responseText}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                  <p>Waiting for you to speak...</p>
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMicrophone}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <MicrophoneIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={endCall}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center"
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
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center"
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
          <li>Call transcripts can be saved to your chat history</li>
          <li>Currently using the {currentModel} model for speech processing</li>
        </ul>
      </div>
    </div>
  );
}
