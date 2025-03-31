import Link from 'next/link'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Check your email</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent you a verification link to your email address. Please check your inbox and click on the link to verify your account.
        </p>
        <div className="mt-6">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  )
} 