-- ========================================
-- NAGAR-SEVA - INSTANT ACCESS SETUP
-- ========================================
-- Run these queries in Supabase SQL Editor to disable email confirmation

-- 1. DISABLE EMAIL CONFIRMATION
UPDATE auth.users 
SET email_confirmed = true 
WHERE email_confirmed = false;

-- 2. UPDATE AUTH CONFIGURATION
-- Remove email confirmation requirement
UPDATE auth.config 
SET value = 'false'::boolean 
WHERE key = 'enable_signup';

-- 3. CREATE FUNCTION FOR AUTO-CONFIRMATION
CREATE OR REPLACE FUNCTION auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed = true 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CREATE TRIGGER FOR AUTO-CONFIRMATION
DROP TRIGGER IF EXISTS auto_confirm_user_signup;
CREATE TRIGGER auto_confirm_user_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auto_confirm_email();

-- 5. UPDATE USER PROFILE CREATION TRIGGER
-- Ensure user profile is created immediately
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, points, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'CITIZEN'),
    0,
    NEW.created_at
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. REPLACE EXISTING TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_profile();

-- 7. VERIFY SETUP
-- Check if users are now auto-confirmed
SELECT id, email, email_confirmed, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. UPDATE RLS POLICIES FOR IMMEDIATE ACCESS
-- Remove email confirmation checks from policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Enable immediate access for all authenticated users
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
CREATE POLICY "Enable insert for authentication" ON public.users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 9. CLEANUP (OPTIONAL)
-- Remove any existing confirmation tokens
DELETE FROM auth.sessions 
WHERE expires_at < NOW();

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Test the new user creation flow
-- This should work without email confirmation:

-- INSERT a test user (remove after testing)
-- INSERT INTO auth.users (id, email, created_at, email_confirmed)
-- VALUES (
--   gen_random_uuid(),
--   'test@example.com',
--   NOW(),
--   true
-- );

-- Check if trigger works
-- SELECT * FROM public.users WHERE email = 'test@example.com';

-- ========================================
-- SUCCESS INDICATORS
-- ========================================

-- After running these queries:
-- 1. New users should be able to signup and login immediately
-- 2. No email confirmation required
-- 3. User profiles created automatically
-- 4. RLS policies still enforce security
-- 5. Auth flows are frictionless

-- ========================================
-- NEXT STEPS
-- ========================================

-- 1. Update your auth services to remove email confirmation logic
-- 2. Test signup/login flows
-- 3. Remove any "check your email" UI elements
-- 4. Update error handling for instant access
