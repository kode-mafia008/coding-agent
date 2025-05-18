import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { jetBrainsMono } from '@/components/FontLoader';

// Font is loaded from FontLoader component

export const metadata: Metadata = {
  title: 'Coding Agent Assistant',
  description: 'AI-powered coding assistant with multimodal capabilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.variable} font-mono`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 dark:bg-gray-900 py-4">
              <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Coding Agent Assistant. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
