# Supabase Setup Guide for Nagar Seva

## 🔐 Step 1: Authentication Setup

### 1.1 Go to Supabase Dashboard
- URL: https://tvhsninaslxshcwfptpn.supabase.co
- Navigate to **Authentication** → **Settings**

### 1.2 Configure Site URL
```
Site URL: http://localhost:3000
Redirect URLs: 
- http://localhost:3000/auth/callback
- http://localhost:3000/**
```

### 1.3 Enable Auth Providers
- **Email/Password**: Enable
- **Google**: Enable (optional)
- **Phone**: Enable (optional)

## 🗄️ Step 2: Database Setup

### 2.1 Create Tables (SQL Editor)
Go to **SQL Editor** → **New query** and run:

```sql
-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'ADMIN')),
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE public.issues (
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

-- Create indexes for better performance
CREATE INDEX idx_issues_user_id ON public.issues(user_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_location ON public.issues USING GIST (
  point(longitude, latitude)
);
```

### 2.2 Enable PostGIS for Location Features
```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 🔒 Step 3: Row Level Security (RLS)

### 3.1 Enable RLS
```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
```

### 3.2 Create RLS Policies

#### Users Table Policies
```sql
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
```

#### Issues Table Policies
```sql
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
```

## 📁 Step 4: Storage Setup

### 4.1 Create Storage Buckets
Go to **Storage** → **Create new bucket**:

#### Issue Images Bucket
```
Bucket name: issue-images
Public: Yes
Allowed MIME types: image/jpeg, image/png, image/webp
Max file size: 5MB
```

#### Profile Pictures Bucket
```
Bucket name: profile-pictures
Public: Yes
Allowed MIME types: image/jpeg, image/png, image/webp
Max file size: 2MB
```

### 4.2 Storage Policies
```sql
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
```

## 🔄 Step 5: Database Functions & Triggers

### 5.1 Create User Profile Trigger
```sql
-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5.2 Create Issue Status Update Function
```sql
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
```

## 📊 Step 6: Real-time Setup

### 6.1 Enable Real-time
Go to **Database** → **Replication** and enable:
- `public.users`
- `public.issues`

### 6.2 Create Publication
```sql
-- Create publication for real-time updates
CREATE PUBLICATION supabase_realtime 
FOR TABLE public.users, public.issues;
```

## 🔑 Step 7: API Keys & Environment

### 7.1 Get Your Database URL
Go to **Settings** → **Database** → **Connection string**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.tvhsninaslxshcwfptpn.supabase.co:5432/postgres
```

### 7.2 Update Your .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://tvhsninaslxshcwfptpn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_OyG1ECbS9CPlrrHNzomEnA_Tky_RUCY
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tvhsninaslxshcwfptpn.supabase.co:5432/postgres
```

## 🎯 Step 8: Test Setup

### 8.1 Run Prisma Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 8.2 Test Authentication
- Start your app: `npm run dev`
- Go to `http://localhost:3000/auth/signup`
- Create a test account
- Check if user appears in Supabase **Authentication** → **Users**

### 8.3 Test Database Operations
- Create an issue through your app
- Verify it appears in Supabase **Table Editor** → `issues`
- Test real-time updates by opening two browser tabs

## 🚨 Important Notes

1. **Security**: Never expose your `service_role` key in client-side code
2. **RLS**: Always test your RLS policies thoroughly
3. **Storage**: Set appropriate file size limits and allowed MIME types
4. **Backups**: Enable daily backups in Supabase settings
5. **Monitoring**: Set up alerts for database performance and usage

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Discord Community: https://discord.supabase.com
- Your Project: https://tvhsninaslxshcwfptpn.supabase.co

After completing these steps, your Nagar Seva app will have:
✅ Secure authentication with role-based access
✅ Real-time issue tracking
✅ Image storage for issues
✅ Points system for citizens
✅ Admin dashboard capabilities
✅ Location-based issue reporting
