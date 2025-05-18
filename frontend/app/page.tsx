'use client';

import { useState, useRef, FormEvent } from 'react';
import { useAppContext, ChatMessage } from '@/components/Providers';
import { PaperAirplaneIcon, ArrowPathIcon, MicrophoneIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function Home() {
  const { chatHistory, setChatHistory, currentModel } = useAppContext();
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    file: File;
    preview: string;
    type: string;
  }>>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'audio/*': ['.mp3', '.wav', '.ogg']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => {
        const type = file.type.startsWith('image/') ? 'image' : 'audio';
        return {
          file,
          preview: type === 'image' ? URL.createObjectURL(file) : '',
          type
        };
      });
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  });

  // Handle chat submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    // Create user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: uploadedFiles.map(file => ({
        type: file.type as 'image' | 'audio',
        data: file.preview,
        fileName: file.file.name
      }))
    };
    
    // Add to chat history
    setChatHistory([...chatHistory, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);
    
    // Scroll to bottom after message is added
    setTimeout(scrollToBottom, 100);
    
    try {
      // Call API to get response (to be implemented)
      // For now, simulate a response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: `I'm the AI assistant using ${currentModel}. I've received your message${
            userMessage.attachments && userMessage.attachments.length > 0 
              ? ` and ${userMessage.attachments.length} attachment(s)` 
              : ''
          }.`,
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      }, 1500);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
    }
  };
  
  // Handle voice input (placeholder for future functionality)
  const handleVoiceInput = () => {
    alert('Voice input feature coming soon');
  };
  
  // Handle file removal
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-bold mb-4">Coding Assistant</h1>
      
      {/* Chat history */}
      <div className="flex-grow overflow-y-auto mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-4 text-6xl">🤖</div>
            <p className="text-xl font-semibold">How can I help you today?</p>
            <p className="mt-2">Ask me about coding, development, or technology...</p>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'message-user' : 'message-ai'}`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                  ${message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  {message.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="font-medium">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              
              <div className="pl-10">
                {message.content}
                
                {/* Display attachments if any */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.attachments.map((attachment, i) => (
                      <div key={i} className="relative">
                        {attachment.type === 'image' && (
                          <div className="mt-2 relative h-32 w-32 rounded overflow-hidden">
                            <Image 
                              src={attachment.data} 
                              alt={attachment.fileName || 'Attached image'} 
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        )}
                        {attachment.type === 'audio' && (
                          <div className="mt-2">
                            <audio controls src={attachment.data}>
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* File upload preview area */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                {file.type === 'image' && (
                  <div className="relative h-16 w-16 rounded overflow-hidden">
                    <Image 
                      src={file.preview} 
                      alt={file.file.name} 
                      layout="fill"
                      objectFit="cover"
                    />
                    <button 
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                )}
                {file.type === 'audio' && (
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <span className="truncate max-w-[100px]">{file.file.name}</span>
                    <button 
                      className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {/* File upload dropzone */}
          <div 
            {...getRootProps()} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
          >
            <input {...getInputProps()} />
            <PhotoIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          
          {/* Voice input button */}
          <button 
            type="button"
            onClick={handleVoiceInput}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <MicrophoneIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Text input */}
          <div className="flex-grow relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about coding, development, or technology..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 min-h-[50px] max-h-[200px] resize-y"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          
          {/* Submit button */}
          <button 
            type="submit" 
            disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
            className="flex items-center justify-center px-4 py-2 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-full"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Drag & drop area */}
        <div 
          {...getRootProps()} 
          className="dropzone border-2 border-dashed border-gray-300 dark:border-gray-700 p-6 text-center cursor-pointer hidden"
        >
          <input {...getInputProps()} />
          <p>Drag and drop files here, or click to select files</p>
          <p className="text-xs text-gray-500">Images and audio files supported</p>
        </div>
      </form>
    </div>
  );
}
