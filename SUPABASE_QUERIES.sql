-- ========================================
-- NAGAR SEVA - SUPABASE DATABASE SETUP
-- ========================================
-- Run these queries in Supabase SQL Editor: https://tvhsninaslxshcwfptpn.supabase.co

-- ========================================
-- 1. ENABLE POSTGIS FOR LOCATION FEATURES
-- ========================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ========================================
-- 2. CREATE USERS TABLE (extends auth.users)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'ADMIN')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. CREATE ISSUES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status TEXT DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED')),
  image_before TEXT,
  image_after TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- ========================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);

-- Location index for spatial queries
CREATE INDEX IF NOT EXISTS idx_issues_location ON public.issues USING GIST (
  point(longitude, latitude)
);

-- ========================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. CREATE RLS POLICIES FOR USERS TABLE
-- ========================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Allow insert on signup (trigger will handle this)
CREATE POLICY "Enable insert for authentication" ON public.users
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 7. CREATE RLS POLICIES FOR ISSUES TABLE
-- ========================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view issues" ON public.issues;
DROP POLICY IF EXISTS "Users can create issues" ON public.issues;
DROP POLICY IF EXISTS "Users can update own issues" ON public.issues;
DROP POLICY IF EXISTS "Admins can update any issue" ON public.issues;

-- Everyone can view issues
CREATE POLICY "Anyone can view issues" ON public.issues
  FOR SELECT USING (true);

-- Users can create issues
CREATE POLICY "Users can create issues" ON public.issues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own issues
CREATE POLICY "Users can update own issues" ON public.issues
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can update any issue
CREATE POLICY "Admins can update any issue" ON public.issues
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ========================================
-- 8. CREATE STORAGE BUCKETS
-- ========================================
-- Issue images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'issue-images',
  'issue-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Profile pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 9. CREATE STORAGE POLICIES
-- ========================================
-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload issue images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view issue images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;

-- Users can upload to issue-images
CREATE POLICY "Users can upload issue images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'issue-images' AND 
    auth.role() = 'authenticated'
  );

-- Public can view issue images
CREATE POLICY "Anyone can view issue images" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-images');

-- Users can upload their own profile picture
CREATE POLICY "Users can upload profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' AND 
    auth.role() = 'authenticated'
  );

-- Public can view profile pictures
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

-- ========================================
-- 10. CREATE USER PROFILE TRIGGER
-- ========================================
-- Drop existing function and trigger
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- 11. CREATE ISSUE STATUS UPDATE FUNCTION
-- ========================================
-- Drop existing function and trigger
DROP FUNCTION IF EXISTS public.update_user_points() CASCADE;
DROP TRIGGER IF EXISTS on_issue_resolved ON public.issues;

-- Function to update user points when issue is resolved
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'RESOLVED' AND NEW.status = 'RESOLVED' THEN
    UPDATE public.users 
    SET points = points + 10 
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for points update
CREATE TRIGGER on_issue_resolved
  AFTER UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- ========================================
-- 12. ENABLE REAL-TIME
-- ========================================
-- Create publication for real-time updates
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE public.users, public.issues;

-- ========================================
-- 13. INSERT SAMPLE DATA (OPTIONAL)
-- ========================================
-- Create a sample admin user (you need to sign up first)
-- This will be triggered automatically when someone signs up

-- Sample categories for issues
-- You can use these in your frontend
-- ['Road Damage', 'Street Light', 'Garbage', 'Water Supply', 'Electricity', 'Public Toilet', 'Park Maintenance', 'Traffic Signal']

-- ========================================
-- 14. VERIFICATION QUERIES
-- ========================================
-- Check if tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'issues');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'issues');

-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check if storage buckets exist
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE name IN ('issue-images', 'profile-pictures');

-- ========================================
-- 15. CLEANUP (RUN ONLY IF NEEDED)
-- ========================================
-- Uncomment and run these only if you need to reset everything

-- DROP TABLE IF EXISTS public.issues CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- DROP FUNCTION IF EXISTS public.update_user_points() CASCADE;
-- DROP PUBLICATION IF EXISTS supabase_realtime;

-- ========================================
-- SETUP COMPLETE! 🎉
-- ========================================
