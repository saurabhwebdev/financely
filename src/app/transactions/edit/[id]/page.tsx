'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Profile, Transaction } from '@/types/database'
import { getCurrencySymbol } from '@/lib/countries'
import React from 'react'

// Default categories 
const defaultCategories = [
  // Income categories
  { id: 'salary', name: 'Salary', type: 'income' },
  { id: 'freelance', name: 'Freelance', type: 'income' },
  { id: 'investments', name: 'Investments', type: 'income' },
  { id: 'business', name: 'Business', type: 'income' },
  { id: 'gifts', name: 'Gifts', type: 'income' },
  { id: 'rental', name: 'Rental Income', type: 'income' },
  { id: 'refunds', name: 'Refunds', type: 'income' },
  { id: 'lottery', name: 'Lottery/Gambling', type: 'income' },
  { id: 'other_income', name: 'Other Income', type: 'income' },
  
  // Expense categories
  { id: 'food', name: 'Food & Dining', type: 'expense' },
  { id: 'groceries', name: 'Groceries', type: 'expense' },
  { id: 'restaurants', name: 'Restaurants', type: 'expense' },
  { id: 'transportation', name: 'Transportation', type: 'expense' },
  { id: 'public_transport', name: 'Public Transport', type: 'expense' },
  { id: 'fuel', name: 'Fuel', type: 'expense' },
  { id: 'car_maintenance', name: 'Car Maintenance', type: 'expense' },
  { id: 'housing', name: 'Housing', type: 'expense' },
  { id: 'rent', name: 'Rent', type: 'expense' },
  { id: 'mortgage', name: 'Mortgage', type: 'expense' },
  { id: 'utilities', name: 'Utilities', type: 'expense' },
  { id: 'electricity', name: 'Electricity', type: 'expense' },
  { id: 'water', name: 'Water', type: 'expense' },
  { id: 'internet', name: 'Internet', type: 'expense' },
  { id: 'phone', name: 'Phone', type: 'expense' },
  { id: 'shopping', name: 'Shopping', type: 'expense' },
  { id: 'clothing', name: 'Clothing', type: 'expense' },
  { id: 'electronics', name: 'Electronics', type: 'expense' },
  { id: 'gifts_given', name: 'Gifts', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense' },
  { id: 'movies', name: 'Movies & TV', type: 'expense' },
  { id: 'games', name: 'Games', type: 'expense' },
  { id: 'subscriptions', name: 'Subscriptions', type: 'expense' },
  { id: 'travel', name: 'Travel', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', type: 'expense' },
  { id: 'insurance', name: 'Insurance', type: 'expense' },
  { id: 'fitness', name: 'Fitness', type: 'expense' },
  { id: 'education', name: 'Education', type: 'expense' },
  { id: 'personal_care', name: 'Personal Care', type: 'expense' },
  { id: 'pets', name: 'Pets', type: 'expense' },
  { id: 'charity', name: 'Charity', type: 'expense' },
  { id: 'taxes', name: 'Taxes', type: 'expense' },
  { id: 'fees', name: 'Fees & Charges', type: 'expense' },
  { id: 'business_expense', name: 'Business Expense', type: 'expense' },
  { id: 'other_expense', name: 'Other Expense', type: 'expense' },
]

export default function EditTransaction({ params }: { params: { id: string } }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [type, setType] = useState('expense')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [customCategories, setCustomCategories] = useState<Array<{id: string, name: string, type: string}>>([])
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [transactionId, setTransactionId] = useState<string>('')
  const router = useRouter()
  
  useEffect(() => {
    // Store the param ID in state to avoid direct access in the effect dependency array
    if (params && params.id) {
      setTransactionId(params.id)
    }
  }, [params])
  
  useEffect(() => {
    // Only run if we have a transaction ID
    if (!transactionId) return
    
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/auth/signin')
        return
      }
      setUser(data.user)
      await fetchProfile(data.user.id)
      await fetchCustomCategories(data.user.id)
      await fetchTransaction(transactionId)
    }

    checkUser()
  }, [router, transactionId])

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

  async function fetchCustomCategories(userId: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name')

      if (error) {
        console.error('Error fetching custom categories:', error)
        return
      }
      
      setCustomCategories(data || [])
    } catch (error) {
      console.error('Error in fetchCustomCategories:', error)
    }
  }

  async function fetchTransaction(id: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching transaction:', error)
        setError('Transaction not found')
        return
      }
      
      // Populate form fields with transaction data
      setTransaction(data)
      setDescription(data.description || '')
      setAmount(data.amount?.toString() || '')
      setCategory(data.category || '')
      setType(data.type || 'expense')
      setDate(data.date || new Date().toISOString().split('T')[0])
      
    } catch (error) {
      console.error('Error in fetchTransaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !transaction) return
    
    setError(null)
    setLoading(true)

    try {
      // Validate input
      if (!description.trim()) {
        throw new Error('Description is required')
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Please enter a valid amount')
      }

      if (!category) {
        throw new Error('Please select a category')
      }

      const { error } = await supabase
        .from('transactions')
        .update({
          description,
          amount: Number(amount),
          category,
          type,
          date,
          // Don't update user_id and created_at when editing
        })
        .eq('id', transaction.id)

      if (error) throw error

      router.push('/transactions')
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the transaction')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !user) {
      return
    }

    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: newCategory.trim(),
          type
        })
        .select()

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        setCustomCategories([...customCategories, data[0]])
        setCategory(data[0].name)
        setNewCategory('')
        setIsAddingCategory(false)
      }
    } catch (error: any) {
      setError(error.message || 'Failed to add custom category')
    } finally {
      setLoading(false)
    }
  }

  // Get currency symbol based on user's profile
  const getCurrencySymbolFromProfile = () => {
    if (!profile) return '$'
    return getCurrencySymbol(profile.currency)
  }

  // Combine default and custom categories
  const allCategories = [
    ...defaultCategories,
    ...customCategories.map(cat => ({ id: cat.id, name: cat.name, type: cat.type }))
  ]

  if (loading && !transaction) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Transaction</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  value="expense"
                  checked={type === 'expense'}
                  onChange={() => {
                    setType('expense')
                    setCategory('')
                    setIsAddingCategory(false)
                  }}
                />
                <span className="ml-2 text-gray-700">Expense</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-indigo-600"
                  value="income"
                  checked={type === 'income'}
                  onChange={() => {
                    setType('income')
                    setCategory('')
                    setIsAddingCategory(false)
                  }}
                />
                <span className="ml-2 text-gray-700">Income</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{getCurrencySymbolFromProfile()}</span>
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>
          
          {isAddingCategory ? (
            <div>
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">
                New Category
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new category name"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Add
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a category</option>
                  {allCategories
                    .filter(cat => cat.type === type)
                    .map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add New Category
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push('/transactions')}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 