-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create RLS (Row Level Security) policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own transactions
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own transactions
CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX transactions_user_id_idx ON transactions (user_id);
CREATE INDEX transactions_date_idx ON transactions (date);
CREATE INDEX transactions_type_idx ON transactions (type); 