'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ChartBarIcon, CreditCardIcon, ArrowTrendingUpIcon, ShieldCheckIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export default function Home() {
  // Subtle parallax effect
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden pt-10">
      {/* Gradient Background with Blur */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[20%] -left-[5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[90px] opacity-50"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px] opacity-50"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <div className="sm:mt-4 lg:mt-0" 
                   style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl tracking-tight">
                  <span className="block">Smarter finance,</span>
                  <span className="block text-indigo-600">simpler life</span>
          </h1>
                <p className="mt-6 text-lg text-gray-600 max-w-lg">
                  Track expenses, manage budgets, and grow your wealth with powerful tools that make personal finance feel effortless.
          </p>
                <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
              <Link
                    href="/auth/signup" 
                    className="group bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-center font-medium flex items-center justify-center sm:justify-start"
                  >
                    Get Started for Free
                    <ArrowRightIcon className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <p className="mt-4 sm:mt-0 sm:ml-6 text-sm text-gray-500">
                    No credit card required • Free 30-day trial
                  </p>
                </div>
                
                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="border border-gray-100 rounded-lg p-4 shadow-sm bg-white">
                    <p className="text-3xl font-bold text-indigo-600">98%</p>
                    <p className="text-sm text-gray-600">User satisfaction</p>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4 shadow-sm bg-white">
                    <p className="text-3xl font-bold text-indigo-600">$2.5M</p>
                    <p className="text-sm text-gray-600">Monthly savings by users</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
              <div 
                className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md"
                style={{ transform: `translateY(${scrollY * -0.03}px)` }}
              >
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="aspect-w-10 aspect-h-7 w-full">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 w-full h-96 rounded-lg border border-gray-200 flex items-center justify-center">
                      <div className="relative w-[90%] h-[80%] overflow-hidden rounded-lg shadow-xl">
                        {/* This would be a real dashboard preview image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 p-6">
                          <div className="h-5 w-1/2 bg-indigo-100 rounded mb-4"></div>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="h-24 w-full bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col justify-center items-center p-2">
                              <div className="h-8 w-8 rounded-full bg-green-100 mb-2 flex items-center justify-center">
                                <ChartBarIcon className="h-5 w-5 text-green-600" />
                              </div>
                              <div className="h-2 w-12 bg-gray-200 rounded mb-1"></div>
                              <div className="h-4 w-10 bg-gray-800 rounded"></div>
                            </div>
                            <div className="h-24 w-full bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col justify-center items-center p-2">
                              <div className="h-8 w-8 rounded-full bg-red-100 mb-2 flex items-center justify-center">
                                <CreditCardIcon className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="h-2 w-12 bg-gray-200 rounded mb-1"></div>
                              <div className="h-4 w-10 bg-gray-800 rounded"></div>
                            </div>
                            <div className="h-24 w-full bg-white border border-gray-100 rounded-lg shadow-sm flex flex-col justify-center items-center p-2">
                              <div className="h-8 w-8 rounded-full bg-blue-100 mb-2 flex items-center justify-center">
                                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="h-2 w-12 bg-gray-200 rounded mb-1"></div>
                              <div className="h-4 w-10 bg-gray-800 rounded"></div>
                            </div>
                          </div>
                          <div className="h-28 w-full bg-white rounded-lg border border-gray-100 shadow-sm mb-4 p-3">
                            <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                              <div className="h-2 w-16 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-12 w-full bg-indigo-50 rounded overflow-hidden">
                              <div className="h-full w-2/3 bg-indigo-400 rounded"></div>
                            </div>
                          </div>
                          <div className="h-24 w-full bg-white rounded-lg border border-gray-100 shadow-sm p-3">
                            <div className="flex justify-between mb-3">
                              <div className="h-3 w-20 bg-gray-200 rounded"></div>
                              <div className="h-3 w-12 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="h-2 w-24 bg-gray-200 rounded"></div>
                                <div className="h-2 w-16 bg-gray-200 rounded"></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                <div className="h-2 w-12 bg-gray-200 rounded"></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="h-2 w-28 bg-gray-200 rounded"></div>
                                <div className="h-2 w-10 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Simplify your financial life
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to take control of your money in one easy-to-use app.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Expense Tracking</h3>
              <p className="text-gray-600">
                Effortlessly track and categorize your spending with our intuitive interface. See where your money goes in real-time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-5">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget Management</h3>
              <p className="text-gray-600">
                Create personalized budgets that work for your lifestyle. Stay on track with visual progress indicators and alerts.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Insights</h3>
              <p className="text-gray-600">
                Gain valuable insights through detailed reports and visualizations that help you make smarter financial decisions.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-5">
                <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Add Transactions</h3>
              <p className="text-gray-600">
                Add expenses and income on the go with our one-click transaction feature. No more forgetting where your money went.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recurring Transactions</h3>
              <p className="text-gray-600">
                Set up recurring expenses and income for automatic tracking. Perfect for subscriptions, bills, and regular payments.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Goal Setting</h3>
              <p className="text-gray-600">
                Set savings goals and track your progress. Whether it's a new home, vacation, or emergency fund, we help you get there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by thousands
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our users have to say about how Financly has transformed their financial lives.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 font-medium">SL</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Sarah L.</h4>
                  <p className="text-sm text-gray-500">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Financly has completely changed how I manage both my personal and business finances. The ability to categorize and track everything in one place is priceless."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-green-700 font-medium">MJ</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Mark J.</h4>
                  <p className="text-sm text-gray-500">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a freelancer with irregular income, budgeting was always a challenge. Financly makes it easy to plan for lean months and save during abundant ones."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="text-blue-700 font-medium">AP</span>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Aisha P.</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The quick add transaction feature is a game-changer! I can track my spending on the go, and the budgeting tools helped me pay off my student loans faster."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to take control of your finances?
              </h2>
              <p className="mt-3 text-lg text-indigo-100">
                Sign up today and join thousands of users who are transforming their financial lives with Financly.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Link 
                  href="/auth/signup" 
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                >
                  Start Free Trial
                </Link>
              <Link
                  href="/dashboard" 
                  className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                  View Demo
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-base text-gray-500 text-center">Made with ❤️</p>
      </div>
      </footer>
    </div>
  )
}
