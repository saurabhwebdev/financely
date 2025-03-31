'use client'

import { 
  CreditCardIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline'

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-3">
          About <span className="text-indigo-600">Financly</span>
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          A modern, user-friendly personal finance tracker designed to help you manage your money with ease.
        </p>
      </div>
      
      {/* Features section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Track Transactions</h3>
            <p className="text-gray-500 text-center">
              Monitor your income and expenses with detailed categorization and history.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Visual Analytics</h3>
            <p className="text-gray-500 text-center">
              Understand your spending habits with beautiful charts and insightful visualizations.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Secure & Private</h3>
            <p className="text-gray-500 text-center">
              Your financial data is encrypted and securely stored with industry-standard protections.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">User Friendly</h3>
            <p className="text-gray-500 text-center">
              Intuitive interface designed for ease of use and accessibility for everyone.
            </p>
          </div>
        </div>
      </div>
      
      {/* About section */}
      <div className="mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          At Financly, we believe that financial management should be accessible to everyone. Our mission is to provide a simple yet powerful tool that helps you take control of your finances.
        </p>
        <p className="text-gray-600 mb-4">
          Whether you're budgeting for your next big purchase, saving for retirement, or just trying to understand where your money goes each month, Financly gives you the insights you need to make informed decisions.
        </p>
        <div className="mt-8 bg-indigo-50 p-5 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-700 mb-2">Get Started Today</h3>
          <p className="text-indigo-600 mb-4">
            Join thousands of users who have already transformed their financial habits with Financly.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/signup'} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Sign Up - It's Free
          </button>
        </div>
      </div>
    </div>
  )
} 