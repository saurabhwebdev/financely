'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Transaction, Profile } from '@/types/database'
import { formatCurrency } from '@/lib/countries'
import { 
  PencilIcon, 
  TrashIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  AcademicCapIcon,
  HeartIcon,
  DevicePhoneMobileIcon,
  TicketIcon,
  WrenchIcon,
  GlobeAltIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [filter, setFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const router = useRouter()

  // Category icon mapping
  const categoryIcons: Record<string, any> = {
    // Income categories
    salary: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    freelance: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    investments: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    business: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    gifts: <GlobeAltIcon className="h-5 w-5 text-green-500" />,
    rental: <HomeIcon className="h-5 w-5 text-green-500" />,
    refunds: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    lottery: <TicketIcon className="h-5 w-5 text-green-500" />,
    other_income: <BanknotesIcon className="h-5 w-5 text-green-500" />,
    
    // Expense categories
    food: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
    groceries: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
    restaurants: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
    transportation: <TruckIcon className="h-5 w-5 text-red-500" />,
    public_transport: <TruckIcon className="h-5 w-5 text-red-500" />,
    fuel: <TruckIcon className="h-5 w-5 text-red-500" />,
    car_maintenance: <WrenchIcon className="h-5 w-5 text-red-500" />,
    housing: <HomeIcon className="h-5 w-5 text-red-500" />,
    rent: <HomeIcon className="h-5 w-5 text-red-500" />,
    mortgage: <HomeIcon className="h-5 w-5 text-red-500" />,
    utilities: <HomeIcon className="h-5 w-5 text-red-500" />,
    electricity: <HomeIcon className="h-5 w-5 text-red-500" />,
    water: <HomeIcon className="h-5 w-5 text-red-500" />,
    internet: <DevicePhoneMobileIcon className="h-5 w-5 text-red-500" />,
    phone: <DevicePhoneMobileIcon className="h-5 w-5 text-red-500" />,
    shopping: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
    clothing: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
    electronics: <DevicePhoneMobileIcon className="h-5 w-5 text-red-500" />,
    gifts_given: <GlobeAltIcon className="h-5 w-5 text-red-500" />,
    entertainment: <TicketIcon className="h-5 w-5 text-red-500" />,
    movies: <TicketIcon className="h-5 w-5 text-red-500" />,
    games: <TicketIcon className="h-5 w-5 text-red-500" />,
    subscriptions: <DevicePhoneMobileIcon className="h-5 w-5 text-red-500" />,
    travel: <GlobeAltIcon className="h-5 w-5 text-red-500" />,
    healthcare: <HeartIcon className="h-5 w-5 text-red-500" />,
    insurance: <HeartIcon className="h-5 w-5 text-red-500" />,
    fitness: <HeartIcon className="h-5 w-5 text-red-500" />,
    education: <AcademicCapIcon className="h-5 w-5 text-red-500" />,
    personal_care: <HeartIcon className="h-5 w-5 text-red-500" />,
    pets: <HeartIcon className="h-5 w-5 text-red-500" />,
    charity: <HeartIcon className="h-5 w-5 text-red-500" />,
    taxes: <BanknotesIcon className="h-5 w-5 text-red-500" />,
    fees: <BanknotesIcon className="h-5 w-5 text-red-500" />,
    business_expense: <BanknotesIcon className="h-5 w-5 text-red-500" />,
    other_expense: <ShoppingBagIcon className="h-5 w-5 text-red-500" />,
  }

  // Get icon for category, fallback to default if not found
  const getCategoryIcon = (category: string, type: string) => {
    const icon = categoryIcons[category.toLowerCase().replace(/\s+/g, '_')];
    if (icon) return icon;
    return type === 'income' 
      ? <BanknotesIcon className="h-5 w-5 text-green-500" />
      : <ShoppingBagIcon className="h-5 w-5 text-red-500" />;
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
      fetchTransactions(data.user.id, filter)
    }

    checkUser()
  }, [router, filter, sortField, sortDirection])

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

  async function fetchTransactions(userId: string, filter: string) {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)

      if (filter === 'income') {
        query = query.eq('type', 'income')
      } else if (filter === 'expense') {
        query = query.eq('type', 'expense')
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' })

      const { data, error } = await query

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Format amount with the user's currency
  const formatAmount = (amount: number) => {
    if (!profile) return `$${amount.toFixed(2)}`
    return formatCurrency(amount, profile.currency)
  }

  // Handle edit transaction
  const handleEdit = (id: string) => {
    router.push(`/transactions/edit/${id}`)
  }

  // Handle delete transaction
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh transactions list
      if (user) {
        fetchTransactions(user.id, filter)
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower)
    );
  });

  // Calculate summary
  const summary = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
    } else {
      acc.expense += transaction.amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        {/* Header with stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-green-100">
                <ArrowDownIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-xl font-semibold text-green-600">{formatAmount(summary.income)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-red-50 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-red-100">
                <ArrowUpIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-xl font-semibold text-red-600">{formatAmount(summary.expense)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
              <div className="p-3 rounded-full bg-blue-100">
                <BanknotesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <p className={`text-xl font-semibold ${summary.income - summary.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatAmount(summary.income - summary.expense)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Toolbar */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Transactions</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expenses Only</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/transactions/new')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50">
            <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No transactions found</p>
            <p className="text-sm text-gray-400">Try changing your search criteria or add a new transaction</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {sortField === 'date' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                          : <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center">
                      <span>Description</span>
                      {sortField === 'description' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                          : <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      <span>Category</span>
                      {sortField === 'category' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                          : <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                          : <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      <span>Type</span>
                      {sortField === 'type' && (
                        sortDirection === 'asc' 
                          ? <ArrowUpIcon className="ml-1 h-4 w-4" /> 
                          : <ArrowDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-100">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100">
                      <div className="flex items-center">
                        {getCategoryIcon(transaction.category, transaction.type)}
                        <span className="ml-2">{transaction.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium border-r border-gray-100">
                      <span className={`${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatAmount(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 border-r border-gray-100">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleEdit(transaction.id)} 
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          title="Edit transaction"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        
                        {deleteConfirm === transaction.id ? (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleDelete(transaction.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeleteConfirm(transaction.id)} 
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete transaction"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      </div>
    </div>
  )
} 