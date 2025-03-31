export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-white"></div>
          </div>
        </div>
        <h2 className="mt-6 text-xl font-medium text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  )
} 