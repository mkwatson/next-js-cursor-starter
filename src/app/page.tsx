import React from 'react';
import Image from "next/image";
import Link from 'next/link';

// WebSocket connection status component
import WebSocketStatus from '@/components/WebSocketStatus';

/**
 * Home page component for the application.
 *
 * @returns The main landing page with introductory content.
 */
export default function Home(): React.ReactNode {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center gap-16 w-full max-w-5xl">
        <div className="flex w-full items-start justify-start flex-col-reverse md:flex-row">
          <Image
            width={150}
            height={150}
            src="/next.svg"
            alt="Next.js logo"
            className="w-[100px] md:w-auto h-[100px] -mt-6 md:w-[150px] md:h-[150px]"
          />
          <div className="flex flex-col gap-4 p-8 md:px-12 md:py-12 w-full bg-black/10 dark:bg-white/5 rounded-3xl">
            <h1 className="text-4xl font-black">Cursor + Next.js</h1>
            <p className="text-gray-500 max-w-[40ch]">
              Cursor is an AI-first code editor that helps you code up to 2x
              faster. Boost your productivity by leveraging the full power of
              different AI models.
            </p>
            <div className="flex flex-col gap-2">
              <p className=" text-gray-500">
                Try a prompt (ctrl+k on Windows, cmd+k on Mac):
              </p>
              <p className="bg-black/30 dark:bg-white/10 rounded-xl py-2 px-4 italic text-blue-500 dark:text-blue-300 ">
                Use an AI command in your clipboard
              </p>
            </div>

            <a href="https://cursor.sh" target="_blank" className="mt-6 w-fit">
              <button className="rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transform transition-all w-fit px-4 py-2 ">
                Learn more about Cursor
              </button>
            </a>
          </div>
        </div>

        <div className="w-full bg-black/10 dark:bg-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Real-Time Collaborative Editor</h2>
          
          {/* WebSocket status display */}
          <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">WebSocket Connection Status</h3>
            <WebSocketStatus />
          </div>
          
          <p className="text-gray-500 mb-8">
            Real-time collaborative document editing powered by WebSockets
          </p>
          
          <div className="flex flex-col gap-4">
            <Link 
              href="/editor"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors w-fit"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcursorsdottsx%2Fnext-js-cursor-starter&project-name=next.js-cursor-app&repository-name=next.js-cursor-app"
          target="_blank"
          className="flex gap-2 items-center text-gray-500"
        >
          <div>Deploy on</div>
          <div>
            <svg
              width="76"
              height="16"
              viewBox="0 0 76 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-gray-600 dark:fill-gray-300"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M50.8010 15.9604H72.4575C74.1163 15.9604 75.4634 14.6133 75.4634 12.9546C75.4634 12.9261 75.4626 12.8977 75.4612 12.8693L75.112 3.49679C75.0668 2.02781 73.8758 0.854737 72.4068 0.829648H50.8057L50.8010 15.9604ZM58.3442 10.7693C58.3442 11.2812 57.9284 11.6969 57.4166 11.6969C56.9048 11.6969 56.489 11.2812 56.489 10.7693V6.03085C56.489 5.51902 56.9048 5.10328 57.4166 5.10328C57.9284 5.10328 58.3442 5.51902 58.3442 6.03085V10.7693ZM62.965 10.7693C62.965 11.2812 62.5493 11.6969 62.0374 11.6969C61.5256 11.6969 61.1099 11.2812 61.1099 10.7693V6.03085C61.1099 5.51902 61.5256 5.10328 62.0374 5.10328C62.5493 5.10328 62.965 5.51902 62.965 6.03085V10.7693ZM67.5859 10.7693C67.5859 11.2812 67.1702 11.6969 66.6583 11.6969C66.1465 11.6969 65.7307 11.2812 65.7307 10.7693V6.03085C65.7307 5.51902 66.1465 5.10328 66.6583 5.10328C67.1702 5.10328 67.5859 5.51902 67.5859 6.03085V10.7693Z"
              />
              <path d="M15.9602 0.839966H0.829346V15.9708H15.9602V0.839966Z" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.5233 0.839966H24.1619L31.159 10.3629L24.1085 15.9708H32.5233V0.839966ZM47.3814 0.829648H39.0199L39.0154 16.0047H47.3814V0.829648Z"
              />
            </svg>
          </div>
        </a>
        <a
          href="https://cursor.sh/docs"
          target="_blank"
          className="text-gray-500"
        >
          Cursor Docs
        </a>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          className="text-gray-500"
        >
          Next.js Docs
        </a>
      </footer>
    </div>
  );
}
