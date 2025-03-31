'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/countries'
import { Profile } from '@/types/database'
import { CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/solid'

// Common categories for quick selection
const quickCategories = [
  // Income
  { id: 'salary', name: 'Salary', type: 'income' },
  { id: 'freelance', name: 'Freelance', type: 'income' },
  { id: 'other_income', name: 'Other Income', type: 'income' },
  
  // Expense
  { id: 'food', name: 'Food', type: 'expense' },
  { id: 'groceries', name: 'Groceries', type: 'expense' },
  { id: 'transportation', name: 'Transport', type: 'expense' },
  { id: 'shopping', name: 'Shopping', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense' },
  { id: 'utilities', name: 'Utilities', type: 'expense' },
]

export default function QuickAddTransaction({ 
  userId, 
  profile, 
  onComplete 
}: { 
  userId: string, 
  profile: Profile | null,
  onComplete: () => void 
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState('expense')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close form
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isVisible && 
          formRef.current && 
          buttonRef.current && 
          !formRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }
    
    // Add event listener when form is visible
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [success])

  const getCurrencySymbol = () => {
    if (!profile || !profile.currency) return '$'
    
    try {
      return formatCurrency(0, profile.currency).replace(/[0-9.]/g, '').trim()
    } catch (error) {
      console.error('Error getting currency symbol:', error)
      return '$'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description || !amount || !category) {
      setError('Please fill in all fields')
      return
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const newTransaction = {
        user_id: userId,
        description,
        amount: parseFloat(amount),
        category,
        type,
        date: new Date().toISOString().split('T')[0]
      }
      
      const { error } = await supabase
        .from('transactions')
        .insert([newTransaction])
      
      if (error) throw error
      
      // Set success message
      setSuccess(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`)
      
      // Reset form
      setDescription('')
      setAmount('')
      setCategory('')
      setType('expense')
      
      // Notify parent component to refresh data
      onComplete()
      
      // After 3 seconds, hide the form
      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
      
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      setError(error.message || 'Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
    // Reset form when opening
    if (!isVisible) {
      setDescription('')
      setAmount('')
      setCategory('')
      setType('expense')
      setError(null)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-10">
      {/* Success notification */}
      {success && (
        <div className="absolute bottom-20 right-0 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-fade-in mb-4 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
          <span className="text-sm">{success}</span>
        </div>
      )}
    
      {/* Toggle button */}
      <button
        ref={buttonRef}
        onClick={toggleVisibility}
        className={`${isVisible ? 'bg-gray-700' : 'bg-indigo-600'} rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 text-white hover:scale-110 active:scale-95 active:shadow-md`}
        aria-label={isVisible ? "Close quick add" : "Quick add transaction"}
      >
        {isVisible ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <PlusIcon className="h-6 w-6" />
        )}
      </button>

      {/* Quick add form */}
      {isVisible && (
        <div 
          ref={formRef}
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-100 animate-fade-in"
        >
          <h3 className="text-sm font-medium text-gray-800 mb-3">Quick Add Transaction</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded mb-3 text-xs animate-bounce">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Type selector */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-1.5 text-xs font-medium ${type === 'expense' ? 'bg-red-50 text-red-600' : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors duration-200`}
                onClick={() => setType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-1.5 text-xs font-medium ${type === 'income' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-500 hover:bg-gray-50'} transition-colors duration-200`}
                onClick={() => setType('income')}
              >
                Income
              </button>
            </div>
            
            {/* Description input */}
            <div>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            {/* Amount input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">{getCurrencySymbol()}</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-12 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            {/* Quick category selection */}
            <div>
              <div className="flex flex-wrap gap-2">
                {quickCategories
                  .filter(cat => cat.type === type)
                  .map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-2 py-1 text-xs rounded-md transform transition-all duration-200 ${
                        category === cat.id 
                          ? (type === 'expense' 
                              ? 'bg-red-100 text-red-700 shadow-sm scale-110 ring-2 ring-red-200' 
                              : 'bg-green-100 text-green-700 shadow-sm scale-110 ring-2 ring-green-200')
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {cat.name}
                      {category === cat.id && (
                        <span className="ml-1 inline-flex items-center">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-300 text-sm font-medium flex items-center justify-center transform hover:translate-y-[-2px] active:translate-y-0 shadow hover:shadow-md"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : (
                <CheckIcon className="h-4 w-4 mr-1" />
              )}
              Save Transaction
            </button>
          </form>
        </div>
      )}
    </div>
  )
} 