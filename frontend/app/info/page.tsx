'use client';

import { useState, ReactNode } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// Define types for Accordion props
interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

// Accordion component for better code organization
const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 flex items-center justify-between"
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
};

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Usage & Information</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coding Agent Capabilities</h2>
        <p className="mb-4">
          This coding agent is designed to help with a variety of programming and technology topics.
          You can ask questions, request code examples, debug issues, and learn about concepts in the following areas:
        </p>
        
        <Accordion title="SQL">
          <ul className="list-disc pl-5 space-y-2">
            <li>Query writing and optimization</li>
            <li>Database design and schema creation</li>
            <li>Data manipulation and analytics</li>
            <li>SQL best practices</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://www.postgresql.org/docs/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">PostgreSQL Docs</a>,{' '}
            <a href="https://dev.mysql.com/doc/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">MySQL Docs</a>,{' '}
            <a href="https://www.sqlite.org/docs.html" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">SQLite Docs</a>
          </p>
        </Accordion>
        
        <Accordion title="Python">
          <ul className="list-disc pl-5 space-y-2">
            <li>General Python programming</li>
            <li>Data structures and algorithms</li>
            <li>Package and dependency management</li>
            <li>Testing and debugging</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://docs.python.org/3/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Python Documentation</a>,{' '}
            <a href="https://realpython.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Real Python</a>
          </p>
        </Accordion>
        
        <Accordion title="AWS">
          <ul className="list-disc pl-5 space-y-2">
            <li>AWS service overview and selection</li>
            <li>Infrastructure as Code (IaC)</li>
            <li>Deployment strategies</li>
            <li>AWS best practices</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://docs.aws.amazon.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">AWS Documentation</a>,{' '}
            <a href="https://aws.amazon.com/architecture/well-architected/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">AWS Well-Architected</a>
          </p>
        </Accordion>
        
        <Accordion title="Linux">
          <ul className="list-disc pl-5 space-y-2">
            <li>Command line usage</li>
            <li>Shell scripting</li>
            <li>System administration</li>
            <li>Service management</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://tldp.org/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Linux Documentation Project</a>,{' '}
            <a href="https://www.kernel.org/doc/man-pages/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Linux man pages</a>
          </p>
        </Accordion>
        
        <Accordion title="Docker">
          <ul className="list-disc pl-5 space-y-2">
            <li>Container creation and management</li>
            <li>Docker Compose</li>
            <li>Dockerfile optimization</li>
            <li>Container orchestration</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://docs.docker.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Docker Documentation</a>,{' '}
            <a href="https://hub.docker.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Docker Hub</a>
          </p>
        </Accordion>
        
        <Accordion title="FastAPI">
          <ul className="list-disc pl-5 space-y-2">
            <li>API development</li>
            <li>Request/response handling</li>
            <li>Authentication and middleware</li>
            <li>API documentation</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://fastapi.tiangolo.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">FastAPI Documentation</a>,{' '}
            <a href="https://github.com/tiangolo/fastapi" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">FastAPI GitHub</a>
          </p>
        </Accordion>
        
        <Accordion title="Django">
          <ul className="list-disc pl-5 space-y-2">
            <li>Web application development</li>
            <li>Models and database interactions</li>
            <li>Views and templates</li>
            <li>Authentication and security</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://docs.djangoproject.com/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Django Documentation</a>,{' '}
            <a href="https://www.django-rest-framework.org/" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Django REST Framework</a>
          </p>
        </Accordion>
        
        <Accordion title="Langchain">
          <ul className="list-disc pl-5 space-y-2">
            <li>Chain creation and management</li>
            <li>LLM integration</li>
            <li>Agent development</li>
            <li>Memory and retrieval</li>
          </ul>
          <p className="mt-4">
            <strong>Resources:</strong>{' '}
            <a href="https://python.langchain.com/docs/get_started/introduction" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Langchain Documentation</a>,{' '}
            <a href="https://github.com/langchain-ai/langchain" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Langchain GitHub</a>
          </p>
        </Accordion>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Use the Coding Agent</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium mb-4">Getting Started</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-6">
            <li>Set your API keys in the "Settings" tab</li>
            <li>Select your preferred model in the "Settings" tab</li>
            <li>Go to the "Chat" tab and start chatting!</li>
          </ol>
          
          <h3 className="text-lg font-medium mb-4">Using the Chat</h3>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Type your coding question and press Enter</li>
            <li>You can also upload images or audio for multimodal interactions</li>
            <li>Try the "Live Call" feature for real-time voice interactions</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-4">Tips for Better Results</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Be specific with your questions</li>
            <li>Provide context about your project when relevant</li>
            <li>Mention language/framework when asking for code examples</li>
            <li>For complex topics, break down your questions into smaller parts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
