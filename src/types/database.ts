export type Transaction = {
  id: string
  user_id: string
  amount: number
  description: string
  category: string
  type: 'income' | 'expense'
  date: string
  created_at: string
}

export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  color: string
  icon: string
}

export type Profile = {
  id: string
  country: string
  currency: string
  created_at: string
  updated_at: string
}

export type CurrencyInfo = {
  [key: string]: {
    symbol: string
    code: string
    name: string
  }
} 