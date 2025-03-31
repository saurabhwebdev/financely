-- Remove the automatic trigger since we're handling profiles manually
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- We're keeping the profiles table and RLS policies, just removing the automatic creation 