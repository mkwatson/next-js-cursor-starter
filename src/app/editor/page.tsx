import React from 'react';
import Link from 'next/link';

/**
 * Basic editor page component.
 * This will be expanded in future tasks with actual collaborative editing features.
 * 
 * @returns Editor page component
 */
export default function EditorPage(): React.ReactNode {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Real-Time Collaborative Editor</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Editor Page</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            This is a placeholder for the collaborative editor that will be implemented in future tasks.
          </p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            The WebSocket connection has been set up and can be tested on the home page.
          </p>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-300 text-sm">
          Real-Time Collaborative Editor - WebSocket Implementation
        </div>
      </footer>
    </div>
  );
} 