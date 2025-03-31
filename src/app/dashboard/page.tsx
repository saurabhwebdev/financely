'use client'

import { useState, useEffect, useMemo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Transaction, Profile } from '@/types/database'
import { formatCurrency } from '@/lib/countries'
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

  // Group transactions by category for visualization
  const categoryData = useMemo(() => {
    const categories: Record<string, { total: number, type: string }> = {}
    
    transactions.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = { total: 0, type: transaction.type }
      }
      categories[transaction.category].total += transaction.amount
    })
    
    return Object.entries(categories)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
  }, [transactions])

  // Generate improved trend data
  const trendData = useMemo(() => {
    // Create a proper ordered array of the last 6 months
    const now = new Date()
    const monthsArray = []
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = monthDate.toISOString().substring(0, 7)
      monthsArray.push(monthKey)
    }
    
    return monthsArray.map(month => {
      const monthExpenses = transactions
        .filter(t => t.date.startsWith(month) && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const monthIncome = transactions
        .filter(t => t.date.startsWith(month) && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        month: new Date(`${month}-01`).toLocaleDateString(undefined, { month: 'short' }),
        expenses: monthExpenses,
        income: monthIncome
      }
    })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back{profile ? `, ${profile.country === 'US' ? 'American' : profile.country} friend` : ''}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your finances</p>
      </div>
      
      {/* Time Period Selector */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow p-1">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'week' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'month' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'year' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeframe === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
        
        <button 
          onClick={handleRefresh} 
          className={`p-2 rounded-full text-gray-500 hover:bg-gray-100 ${refreshing ? 'animate-spin' : ''}`}
          disabled={refreshing}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="flex items-center">
                <ChartBarIcon className={`mr-2 h-5 w-5 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-gray-400'}`} />
                Overview
              </span>
            </button>
            <button
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('insights')}
            >
              <span className="flex items-center">
                <ArrowTrendingUpIcon className={`mr-2 h-5 w-5 ${activeTab === 'insights' ? 'text-indigo-500' : 'text-gray-400'}`} />
                Insights
              </span>
            </button>
            <button
              className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'budget'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('budget')}
            >
              <span className="flex items-center">
                <BanknotesIcon className={`mr-2 h-5 w-5 ${activeTab === 'budget' ? 'text-indigo-500' : 'text-gray-400'}`} />
                Budget
              </span>
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl shadow-lg p-6 border border-emerald-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-emerald-100 shadow-inner">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Total Income</h3>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{formatAmount(stats.totalIncome)}</p>
              <p className="mt-2 text-sm text-gray-500">
                {timeframe === 'week' ? 'Last 7 days' : 
                timeframe === 'month' ? 'Last 30 days' : 
                timeframe === 'year' ? 'Last 12 months' : 'All time'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl shadow-lg p-6 border border-rose-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-rose-100 shadow-inner">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Total Expenses</h3>
              </div>
              <p className="text-3xl font-bold text-rose-600">{formatAmount(stats.totalExpenses)}</p>
              <p className="mt-2 text-sm text-gray-500">
                {timeframe === 'week' ? 'Last 7 days' : 
                timeframe === 'month' ? 'Last 30 days' : 
                timeframe === 'year' ? 'Last 12 months' : 'All time'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl shadow-lg p-6 border border-indigo-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 shadow-inner">
                  <BanknotesIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">Balance</h3>
              </div>
              <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                {formatAmount(stats.balance)}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Current balance
              </p>
            </div>
          </div>
          
          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Spending By Category Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Spending Trend</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  Last 6 months
                </div>
              </div>
              
              {/* Simple Mock Bar Chart */}
              <div className="h-64 flex items-end justify-between">
                {trendData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center group relative">
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transform -translate-x-1/2 left-1/2 z-10 min-w-[120px]">
                      <div className="flex justify-between mb-1">
                        <span>Income:</span> 
                        <span className="font-medium text-emerald-300">{formatAmount(item.income)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expenses:</span> 
                        <span className="font-medium text-rose-300">{formatAmount(item.expenses)}</span>
                      </div>
                    </div>
                    <div className="w-16 flex space-x-1">
                      <div 
                        className="w-1/2 bg-emerald-400 rounded-t-md transition-all duration-300 hover:bg-emerald-500"
                        style={{ height: `${Math.max(item.income / chartMax * 180, 4)}px` }}
                      ></div>
                      <div 
                        className="w-1/2 bg-rose-400 rounded-t-md transition-all duration-300 hover:bg-rose-500"
                        style={{ height: `${Math.max(item.expenses / chartMax * 180, 4)}px` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium">{item.month}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div>
                  <span className="text-sm text-gray-500">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-rose-400 mr-2"></div>
                  <span className="text-sm text-gray-500">Expenses</span>
                </div>
              </div>
            </div>
            
            {/* Top Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
                <ChartBarIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              {categoryData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No transaction data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryData.map(([category, data], index) => (
                    <div key={index} className="relative group">
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                        <div className="mr-3 p-2 rounded-full bg-gray-100">
                          {getIconForCategory(category, data.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-700">{category}</p>
                            <p className={`text-sm font-medium ${data.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {formatAmount(data.total)}
                            </p>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full ${data.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'} transition-all duration-500 ease-in-out`}
                              style={{ width: `${Math.min((data.total / stats[data.type === 'income' ? 'totalIncome' : 'totalExpenses']) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <button 
                className="mt-6 w-full py-2 bg-gray-50 text-gray-600 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow"
                onClick={() => router.push('/transactions')}
              >
                View All Categories
              </button>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button
                onClick={() => router.push('/transactions/new')}
                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-200 shadow-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Add New</span>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white">
                <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CreditCardIcon className="h-10 w-10 text-indigo-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2 text-lg">No transactions yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Add your first transaction to start tracking your finances and see personalized insights.</p>
                <button
                  onClick={() => router.push('/transactions/new')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none shadow-md transition-all duration-200 hover:shadow-lg"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  <span>Add First Transaction</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {visibleTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                    onClick={() => router.push(`/transactions/edit/${transaction.id}`)}
                  >
                    <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 mr-4 shadow-sm group-hover:shadow group-hover:scale-110 transition-all duration-200">
                      {getIconForCategory(transaction.category, transaction.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </p>
                    </div>
                    
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                ))}
              </div>
            )}
            
            {!loading && transactions.length > 0 && (
              <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
                {transactions.length > 5 && !showAllTransactions ? (
                  <button 
                    onClick={() => setShowAllTransactions(true)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-all duration-200 px-4 py-1 hover:bg-indigo-50 rounded-full"
                  >
                    View All Transactions
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push('/transactions')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-all duration-200 px-4 py-1 hover:bg-indigo-50 rounded-full"
                  >
                    Go to Transactions Page
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      {activeTab === 'insights' && (
        <div className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <ChartBarIcon className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">Insights Coming Soon</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            We're working on advanced financial insights with AI-powered analysis to help you manage your money smarter.
          </p>
          <div className="animate-pulse flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <div className="h-24 w-48 bg-indigo-50 rounded-lg"></div>
            <div className="h-24 w-48 bg-indigo-50 rounded-lg"></div>
            <div className="h-24 w-48 bg-indigo-50 rounded-lg"></div>
            <div className="h-24 w-48 bg-indigo-50 rounded-lg"></div>
          </div>
        </div>
      )}
      
      {activeTab === 'budget' && (
        <div className="text-center py-16 px-4 bg-white rounded-xl shadow-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <BanknotesIcon className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">Budgeting Coming Soon</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Set budgets for different categories and track your spending against your goals with customized alerts and recommendations.
          </p>
          <div className="flex justify-center gap-4 max-w-2xl mx-auto">
            <div className="h-6 w-full max-w-md bg-gray-100 rounded-full overflow-hidden">
              <div className="h-6 bg-indigo-500 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}