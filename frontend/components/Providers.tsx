'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our context
interface AppContextType {
  // Chat state
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  
  // Selected model
  currentModel: string;
  setCurrentModel: React.Dispatch<React.SetStateAction<string>>;
  
  // API keys
  apiKeys: {
    googleApiKey: string;
    anthropicApiKey: string;
    openaiApiKey: string;
  };
  setApiKeys: React.Dispatch<React.SetStateAction<{
    googleApiKey: string;
    anthropicApiKey: string;
    openaiApiKey: string;
  }>>;
  
  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  // For multimodal messages
  attachments?: {
    type: 'image' | 'audio' | 'code';
    data: string; // URL or base64 data
    fileName?: string;
  }[];
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  chatHistory: [],
  setChatHistory: () => {},
  currentModel: 'gemini-2.0-flash',
  setCurrentModel: () => {},
  apiKeys: {
    googleApiKey: '',
    anthropicApiKey: '',
    openaiApiKey: '',
  },
  setApiKeys: () => {},
  darkMode: false,
  toggleDarkMode: () => {},
});

// Provider component
export const Providers = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('gemini-2.0-flash');
  const [apiKeys, setApiKeys] = useState({
    googleApiKey: '',
    anthropicApiKey: '',
    openaiApiKey: '',
  });
  const [darkMode, setDarkMode] = useState<boolean>(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : false
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        currentModel,
        setCurrentModel,
        apiKeys,
        setApiKeys,
        darkMode,
        toggleDarkMode,
      }}
    >
      <div className={darkMode ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);
