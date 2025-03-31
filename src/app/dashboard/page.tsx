'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Transaction, Profile } from '@/types/database'
import { formatCurrency } from '@/lib/countries'
import QuickAddTransaction from '../components/QuickAddTransaction'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  BanknotesIcon, 
  PlusIcon, 
  CalendarDaysIcon,
  ChevronRightIcon,
  ChartBarIcon,
  CreditCardIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { 
  ShoppingBagIcon,
  HomeIcon, 
  TruckIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid'

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [timeframe, setTimeframe] = useState('month')
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  // Category icon mapping - fixed with ReactNode instead of JSX.Element
  const categoryIcons: Record<string, ReactNode> = {
    food: <ShoppingBagIcon className="h-6 w-6 text-orange-500" />,
    groceries: <ShoppingBagIcon className="h-6 w-6 text-green-500" />,
    housing: <HomeIcon className="h-6 w-6 text-blue-500" />,
    rent: <HomeIcon className="h-6 w-6 text-blue-600" />,
    transportation: <TruckIcon className="h-6 w-6 text-indigo-500" />,
    utilities: <HomeIcon className="h-6 w-6 text-yellow-500" />,
    entertainment: <DevicePhoneMobileIcon className="h-6 w-6 text-pink-500" />,
    healthcare: <HeartIcon className="h-6 w-6 text-red-500" />,
    education: <AcademicCapIcon className="h-6 w-6 text-cyan-500" />,
    salary: <BanknotesIcon className="h-6 w-6 text-emerald-500" />,
    freelance: <UserGroupIcon className="h-6 w-6 text-violet-500" />,
    investments: <ArrowTrendingUpIcon className="h-6 w-6 text-lime-500" />,
  }

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      food: '#f97316', // orange-500
      groceries: '#84cc16', // lime-500
      housing: '#3b82f6', // blue-500
      rent: '#2563eb', // blue-600
      transportation: '#6366f1', // indigo-500
      utilities: '#eab308', // yellow-500
      entertainment: '#ec4899', // pink-500
      healthcare: '#ef4444', // red-500
      education: '#06b6d4', // cyan-500
      salary: '#10b981', // emerald-500
      freelance: '#8b5cf6', // violet-500
      investments: '#14b8a6', // teal-500
      shopping: '#f43f5e', // rose-500
      travel: '#8b5cf6', // violet-500
      subscriptions: '#6366f1', // indigo-500
      insurance: '#0891b2', // cyan-600
      internet: '#f97316', // orange-500
      phone: '#f59e0b', // amber-500
      electronics: '#7c3aed', // violet-600
      gifts: '#ec4899', // pink-500
    }
    
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_')
    return colorMap[normalizedCategory] || '#9ca3af' // gray-400 as default
  }

  // Default icon if category doesn't exist
  const getIconForCategory = (category: string, type: string) => {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_');
    return categoryIcons[normalizedCategory] || 
      (type === 'income' 
        ? <BanknotesIcon className="h-6 w-6 text-emerald-500" /> 
        : <ShoppingBagIcon className="h-6 w-6 text-gray-500" />);
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/auth/signin')
        return
      }
      setUser(data.user)
      await fetchProfile(data.user.id)
      fetchTransactions(data.user.id)
    }

    checkUser()
  }, [router, timeframe])

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  async function fetchTransactions(userId: string) {
    try {
      setLoading(true)
      
      // Get date for filtering based on timeframe
      const now = new Date()
      let fromDate = new Date()
      
      if (timeframe === 'week') {
        fromDate.setDate(now.getDate() - 7)
      } else if (timeframe === 'month') {
        fromDate.setMonth(now.getMonth() - 1)
      } else if (timeframe === 'year') {
        fromDate.setFullYear(now.getFullYear() - 1)
      } else if (timeframe === 'all') {
        fromDate = new Date(0) // Beginning of time
      }
      
      const fromDateString = fromDate.toISOString().split('T')[0]
      
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        
      if (timeframe !== 'all') {
        query = query.gte('date', fromDateString)
      }
      
      query = query.order('date', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    }
  }, [transactions])

  // Group transactions by category for visualization - improved for better analytics
  const categoryData = useMemo(() => {
    // Focus on expenses only for category breakdown
    const expenses = transactions.filter(t => t.type === 'expense')
    const categories: Record<string, { total: number, count: number, avg: number }> = {}
    
    expenses.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = { total: 0, count: 0, avg: 0 }
      }
      categories[transaction.category].total += transaction.amount
      categories[transaction.category].count += 1
    })
    
    // Calculate average per category
    Object.keys(categories).forEach(cat => {
      categories[cat].avg = categories[cat].total / categories[cat].count
    })
    
    return Object.entries(categories)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        avg: data.avg,
        percentage: expenses.length > 0 
          ? (data.total / expenses.reduce((sum, t) => sum + t.amount, 0)) * 100 
          : 0
      }))
  }, [transactions])

  // Generate improved trend data
  const trendData = useMemo(() => {
    // Make sure we show current month and previous 2 months
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-indexed (January is 0)
    
    // Create array with current month first, then previous months
    const monthsData = []
    
    // Add the last 3 months (including current) - most recent first
    for (let i = 0; i < 3; i++) {
      // Calculate month (handle negative months by adjusting year)
      let monthIndex = currentMonth - i
      let yearIndex = currentYear
      
      if (monthIndex < 0) {
        monthIndex += 12
        yearIndex -= 1
      }
      
      // Format as YYYY-MM
      const monthStr = `${yearIndex}-${String(monthIndex + 1).padStart(2, '0')}`
      
      // Calculate data for this month
      const monthExpenses = transactions
        .filter(t => t.date.startsWith(monthStr) && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const monthIncome = transactions
        .filter(t => t.date.startsWith(monthStr) && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      // Get month name (e.g., "Mar")
      const monthName = new Date(yearIndex, monthIndex, 1).toLocaleDateString(undefined, { month: 'short' })
      
      // Add to our data array (most recent first)
      monthsData.push({
        month: `${monthName} ${yearIndex}`,
        expenses: monthExpenses,
        income: monthIncome,
        date: new Date(yearIndex, monthIndex, 1) // Store full date for sorting
      })
    }
    
    // Sort oldest to newest
    monthsData.sort((a, b) => a.date.getTime() - b.date.getTime())
    
    // Return without the date property
    return monthsData.map(({ month, expenses, income }) => ({ month, expenses, income }))
  }, [transactions])

  // Get highest value for chart scaling
  const chartMax = useMemo(() => {
    if (trendData.length === 0) return 1000
    
    const allValues = trendData.flatMap(d => [d.income, d.expenses])
    return Math.max(...allValues, 1000) // Use at least 1000 as max for empty/small values
  }, [trendData])

  // Format amount with the user's currency
  const formatAmount = (amount: number) => {
    if (!profile) return `$${amount.toFixed(2)}`
    return formatCurrency(amount, profile.currency)
  }

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true)
    if (user) {
      fetchTransactions(user.id)
    }
  }

  // Calculate visibility of transactions
  const visibleTransactions = showAllTransactions 
    ? transactions 
    : transactions.slice(0, 5)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Header & Welcome - More minimal, clean design */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          {/* Removed welcome text */}
        </div>
        
        <button 
          onClick={() => router.push('/transactions/new')}
          className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-200 text-sm font-medium"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          <span>Add Transaction</span>
        </button>
      </div>
      
      {/* Time Period Selector - More subtle and minimal */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center bg-white rounded-md shadow-sm">
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'week' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'month' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'year' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm ${timeframe === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
        
        <button 
          onClick={handleRefresh} 
          className={`p-2 rounded-full text-gray-500 hover:bg-white hover:shadow-sm ${refreshing ? 'animate-spin' : ''}`}
          disabled={refreshing}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Main content wrapper */}
      <div className="space-y-6">
        {/* Stats Cards - Minimal, clean design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Income</h3>
              <div className="p-1.5 rounded-full bg-emerald-50">
                <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-medium text-gray-900">{formatAmount(stats.totalIncome)}</p>
            <p className="mt-2 text-xs text-gray-400">
              {timeframe === 'week' ? 'Last 7 days' : 
               timeframe === 'month' ? 'Last 30 days' : 
               timeframe === 'year' ? 'Last 12 months' : 'All time'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Expenses</h3>
              <div className="p-1.5 rounded-full bg-rose-50">
                <ArrowTrendingDownIcon className="h-4 w-4 text-rose-500" />
              </div>
            </div>
            <p className="text-2xl font-medium text-gray-900">{formatAmount(stats.totalExpenses)}</p>
            <p className="mt-2 text-xs text-gray-400">
              {timeframe === 'week' ? 'Last 7 days' : 
               timeframe === 'month' ? 'Last 30 days' : 
               timeframe === 'year' ? 'Last 12 months' : 'All time'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Balance</h3>
              <div className="p-1.5 rounded-full bg-indigo-50">
                <BanknotesIcon className="h-4 w-4 text-indigo-500" />
              </div>
            </div>
            <p className={`text-2xl font-medium ${stats.balance >= 0 ? 'text-gray-900' : 'text-rose-500'}`}>
              {formatAmount(stats.balance)}
            </p>
            <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
              <span>Current balance</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${stats.balance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stats.balance >= 0 ? 'Positive' : 'Negative'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tabs - Minimal style */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-100">
            <nav className="flex">
              <button
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'insights'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('insights')}
              >
                Insights
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'budget'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('budget')}
              >
                Budget
              </button>
            </nav>
          </div>
        
          {/* Tab content container */}
          <div className="p-5">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Expense Trend Chart - Modern, sleek design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Chart */}
                  <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="text-base font-semibold text-gray-900">3-Month Expense Trend</h2>
                      <div className="text-xs text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded-full">
                        <CalendarDaysIcon className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                        Including current month
                      </div>
                    </div>
                    
                    {/* Modern, Gradient Bar Chart */}
                    <div className="h-60 flex items-end justify-around mt-6 relative">
                      {/* Light grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-b border-gray-100 h-0"></div>
                        <div className="border-b border-gray-100 h-0"></div>
                        <div className="border-b border-gray-100 h-0"></div>
                        <div className="border-b border-gray-100 h-0"></div>
                      </div>
                      
                      {trendData.map((item, i) => (
                        <div key={i} className="flex flex-col items-center group relative">
                          <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-lg rounded-lg p-3 text-xs text-gray-800 z-10 min-w-[140px] border border-gray-100 transform translate-y-1 group-hover:translate-y-0">
                            <div className="font-medium text-gray-900 mb-2">{item.month}</div>
                            <div className="flex justify-between mb-1.5">
                              <span>Income:</span> 
                              <span className="font-medium text-emerald-600">{formatAmount(item.income)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expenses:</span> 
                              <span className="font-medium text-rose-600">{formatAmount(item.expenses)}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <div className="flex flex-col items-center">
                              <div 
                                className="w-7 rounded-t-md transition-all duration-500 hover:opacity-90 relative overflow-hidden group-hover:w-9"
                                style={{ height: `${Math.max(item.income / chartMax * 160, 4)}px` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 to-emerald-400"></div>
                              </div>
                              <div className="w-7 h-1 bg-emerald-300 rounded-b-sm group-hover:w-9 transition-all"></div>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <div 
                                className="w-7 rounded-t-md transition-all duration-500 hover:opacity-90 relative overflow-hidden group-hover:w-9"
                                style={{ height: `${Math.max(item.expenses / chartMax * 160, 4)}px` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-rose-500 to-rose-400"></div>
                              </div>
                              <div className="w-7 h-1 bg-rose-300 rounded-b-sm group-hover:w-9 transition-all"></div>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-sm font-medium text-gray-700">{item.month}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-center space-x-6">
                      <div className="flex items-center p-1.5 px-3 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 mr-2"></div>
                        <span className="text-xs font-medium text-emerald-700">Income</span>
                      </div>
                      <div className="flex items-center p-1.5 px-3 rounded-full bg-gradient-to-r from-rose-50 to-rose-100">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 mr-2"></div>
                        <span className="text-xs font-medium text-rose-700">Expenses</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Categories - Clean, minimal design */}
                  <div className="bg-white rounded-lg p-5 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-900 mb-4">Top Expenses</h2>
                    
                    {categoryData.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-xs">
                        <p>No expense data available</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categoryData.slice(0, 4).map((item, index) => (
                          <div key={index} className="group">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-medium text-gray-700">{item.category}</span>
                              <span className="text-gray-900">{formatAmount(item.total)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500 ease-in-out"
                                style={{ 
                                  width: `${Math.min(item.percentage, 100)}%`,
                                  backgroundColor: getCategoryColor(item.category)
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                              <span>{item.count} items</span>
                              <span>{item.percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      className="mt-4 w-full py-2 bg-gray-50 text-xs text-gray-600 rounded-md border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                      onClick={() => router.push('/transactions')}
                    >
                      View All Categories
                    </button>
                  </div>
                </div>
                
                {/* Category Breakdown - Minimalist card design */}
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-medium text-gray-900">Expense Breakdown</h2>
                    <div className="text-xs text-gray-500">
                      {timeframe === 'week' ? 'Last 7 days' : 
                      timeframe === 'month' ? 'Last 30 days' : 
                      timeframe === 'year' ? 'Last 12 months' : 'All time'}
                    </div>
                  </div>
                  
                  {categoryData.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-400">
                      <p>No expense data available</p>
                    </div>
                  ) : (
                    <>
                      {/* Minimalist category grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                        {categoryData.slice(0, 6).map((item, index) => (
                          <div 
                            key={index} 
                            className="bg-gray-50 rounded-md p-3 flex flex-col items-center hover:shadow-sm transition-all duration-200"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm mb-2">
                              {getIconForCategory(item.category, 'expense')}
                            </div>
                            <p className="text-xs font-medium text-gray-700 truncate w-full text-center">{item.category}</p>
                            <p className="text-xs font-medium mt-1" style={{ color: getCategoryColor(item.category) }}>
                              {formatAmount(item.total)}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Percentage bar - Minimal */}
                      <div className="h-4 flex rounded-md overflow-hidden mb-2 bg-gray-100">
                        {categoryData.slice(0, 6).map((item, index) => (
                          <div 
                            key={index}
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: getCategoryColor(item.category),
                            }}
                            title={`${item.category}: ${formatAmount(item.total)}`}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-wrap gap-3 mt-3">
                        {categoryData.slice(0, 6).map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-1"
                              style={{ backgroundColor: getCategoryColor(item.category) }}
                            ></div>
                            <span className="text-xs text-gray-600">{item.category}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Recent Transactions - Minimalist design */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-5 flex justify-between items-center">
                    <h2 className="text-sm font-medium text-gray-900">Recent Transactions</h2>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                        <CreditCardIcon className="h-6 w-6 text-indigo-400" />
                      </div>
                      <p className="text-gray-500 text-xs mb-4 max-w-xs mx-auto">Add your first transaction to start tracking your finances.</p>
                      <button
                        onClick={() => router.push('/transactions/new')}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 text-xs font-medium"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        <span>Add Transaction</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {visibleTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center p-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                          onClick={() => router.push(`/transactions/edit/${transaction.id}`)}
                        >
                          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-50 mr-3">
                            {getIconForCategory(transaction.category, transaction.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{transaction.description}</p>
                            <div className="flex items-center text-xs text-gray-400">
                              <span>{new Date(transaction.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                              <span className="mx-1">•</span>
                              <span>{transaction.category}</span>
                            </div>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <p className={`text-xs font-medium ${
                              transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!loading && transactions.length > 0 && (
                    <div className="p-3 text-center border-t border-gray-50">
                      {transactions.length > 5 && !showAllTransactions ? (
                        <button 
                          onClick={() => setShowAllTransactions(true)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-all duration-200"
                        >
                          View All
                        </button>
                      ) : (
                        <button 
                          onClick={() => router.push('/transactions')}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium transition-all duration-200"
                        >
                          Go to Transactions Page
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'insights' && (
              <div className="text-center py-10 px-4">
                <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                  <ChartBarIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">Insights Coming Soon</h3>
                <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto">
                  Advanced financial insights with AI-powered analysis are on the way.
                </p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <div className="h-20 w-full bg-indigo-50 rounded-md animate-pulse"></div>
                  <div className="h-20 w-full bg-indigo-50 rounded-md animate-pulse"></div>
                  <div className="h-20 w-full bg-indigo-50 rounded-md animate-pulse"></div>
                  <div className="h-20 w-full bg-indigo-50 rounded-md animate-pulse"></div>
                </div>
              </div>
            )}
            
            {activeTab === 'budget' && (
              <div className="text-center py-10 px-4">
                <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                  <BanknotesIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">Budgeting Coming Soon</h3>
                <p className="text-gray-500 text-xs mb-6 max-w-xs mx-auto">
                  Set budgets for different categories and track your spending against your goals.
                </p>
                <div className="max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between items-center text-xs px-2">
                    <span className="text-gray-600">Food & Groceries</span>
                    <span className="text-gray-800">80%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-indigo-400 rounded-full w-4/5"></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs px-2">
                    <span className="text-gray-600">Entertainment</span>
                    <span className="text-gray-800">45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-emerald-400 rounded-full w-[45%]"></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs px-2">
                    <span className="text-gray-600">Transportation</span>
                    <span className="text-gray-800">60%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-amber-400 rounded-full w-[60%]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Add Transaction Component */}
      {user && (
        <QuickAddTransaction 
          userId={user.id} 
          profile={profile} 
          onComplete={handleRefresh} 
        />
      )}
    </div>
  )
}