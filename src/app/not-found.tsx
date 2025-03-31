'use client'

import { useRouter } from 'next/navigation'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25"></div>
            <div className="relative h-32 w-32 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-6xl font-bold text-indigo-400">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-indigo-600 bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors duration-200 flex items-center justify-center"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
} 