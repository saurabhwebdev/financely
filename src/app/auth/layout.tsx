'use client'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Modern gradient background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 z-0"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden z-0">
        <div className="absolute -top-24 -left-10 w-72 h-72 bg-indigo-100 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute top-20 right-10 w-56 h-56 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
      </div>
      
      <div className="absolute bottom-0 right-0 left-0 h-40 overflow-hidden z-0">
        <div className="absolute -bottom-20 right-10 w-72 h-72 bg-indigo-100 rounded-full opacity-70 blur-3xl"></div>
        <div className="absolute -bottom-10 left-20 w-56 h-56 bg-blue-100 rounded-full opacity-70 blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
} 