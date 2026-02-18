# Nagar Seva Project Setup Guide

## 📁 Exact Folder Structure

```
nagar-seva/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/                # Dashboard pages
│   ├── issues/                   # Issue management
│   ├── admin/                    # Admin panel
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication helpers
│   ├── roles.ts                  # Role-based access
│   ├── utils.ts                  # General utilities
│   └── supabase/                 # Supabase client
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
├── prisma/                       # Database schema
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── ui/                           # UI Components (shadcn/ui style)
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   ├── forms/                # Form components
│   │   ├── maps/                 # Map components
│   │   └── layout/               # Layout components
│   ├── sections/                 # Page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Dashboard.tsx
│   ├── animations/               # Framer Motion animations
│   └── styles/                   # Global styles
├── public/                       # Static assets
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript definitions
├── middleware.ts                 # Next.js middleware
└── socket/                       # Socket.IO server
    ├── server.ts
    └── handlers/
```

## 🧩 Prisma Schema

Your current schema is well-structured for a civic issue reporting system:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(CITIZEN)
  points    Int      @default(0)
  createdAt DateTime @default(now())

  issues    Issue[]
}

model Issue {
  id          String   @id @default(uuid())
  title       String
  description String
  category    String
  latitude    Float
  longitude   Float
  status      IssueStatus @default(REPORTED)
  imageBefore String?
  imageAfter  String?
  createdAt   DateTime @default(now())

  userId      String
  user        User @relation(fields: [userId], references: [id])
}

enum Role {
  CITIZEN
  ADMIN
}

enum IssueStatus {
  REPORTED
  ASSIGNED
  IN_PROGRESS
  RESOLVED
}
```

### Setup Instructions:

1. **Install Prisma CLI:**
   ```bash
   npm install prisma --save-dev
   ```

2. **Initialize database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

3. **Seed database (optional):**
   ```bash
   npx prisma db seed
   ```

## 🔐 Supabase Auth Configuration

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Get your Project URL and anon key

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_supabase_db_url
```

### 3. Supabase Client Setup

#### Client-side (`lib/supabase/client.ts`):
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()
```

#### Server-side (`lib/supabase/server.ts`):
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}
```

### 4. Authentication Configuration

#### Auth Helper (`lib/auth.ts`):
```typescript
import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'ADMIN') {
    redirect('/unauthorized')
  }
  return user
}
```

### 5. Middleware Setup (`middleware.ts`):
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if accessing protected routes without session
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## ⚡ Socket.IO Real-time Features

### 1. Install Dependencies:
```bash
npm install socket.io socket.io-client
npm install @types/socket.io --save-dev
```

### 2. Socket Server (`socket/server.ts`):
```typescript
import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    // Socket event handlers
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      // Join room for issue updates
      socket.on('join-issue-room', (issueId: string) => {
        socket.join(`issue-${issueId}`)
      })

      // Handle issue status updates
      socket.on('issue-update', (data) => {
        socket.to(`issue-${data.issueId}`).emit('issue-updated', data)
      })

      // Handle new issues
      socket.on('new-issue', (data) => {
        io.emit('issue-created', data)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler
```

### 3. Socket Client Hook (`hooks/useSocket.ts`):
```typescript
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || '', {
      path: '/api/socket/io',
    })

    socketInstance.on('connect', () => {
      console.log('Connected to socket server')
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return socket
}
```

### 4. Real-time Issue Updates Component:
```typescript
'use client'

import { useSocket } from '@/hooks/useSocket'
import { useEffect } from 'react'

export function IssueUpdates({ issueId }: { issueId: string }) {
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
      socket.emit('join-issue-room', issueId)

      socket.on('issue-updated', (data) => {
        // Handle real-time updates
        console.log('Issue updated:', data)
        // Update UI state or trigger refetch
      })

      return () => {
        socket.off('issue-updated')
      }
    }
  }, [socket, issueId])

  return null // This component handles real-time logic
}
```

## 🎨 UI Folder Structure

Based on your current UI folder, here's the recommended structure:

### Components (`ui/components/`):
```
ui/components/
├── ui/                    # Base shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── form.tsx
│   └── ...
├── forms/                 # Form components
│   ├── IssueForm.tsx
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── maps/                  # Map-related components
│   ├── IssueMap.tsx
│   └── LocationPicker.tsx
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
└── features/             # Feature-specific components
    ├── IssueCard.tsx
    ├── IssueList.tsx
    └── UserProfile.tsx
```

### Sections (`ui/sections/`):
```
ui/sections/
├── Hero.tsx              # Landing page hero
├── Features.tsx          # Feature showcase
├── Dashboard.tsx         # Main dashboard
├── IssueReporting.tsx    # Issue reporting form
└── AdminPanel.tsx        # Admin interface
```

## 🚀 Complete Setup Steps

### 1. Install Dependencies:
```bash
npm install @supabase/auth-helpers-nextjs socket.io socket.io-client
npm install @prisma/client prisma
npm install @hookform/resolvers react-hook-form zod
npm install @radix-ui/react-*
npm install framer-motion lucide-react tailwind-merge clsx
```

### 2. Configure Environment:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

### 3. Setup Database:
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run Development Server:
```bash
npm run dev
```

### 5. Test Authentication:
- Visit `/login` and `/signup` routes
- Test role-based access control

### 6. Test Real-time Features:
- Open multiple browser tabs
- Create/update issues to see real-time updates

## 📱 UI Reference for Nagar Seva

For UI inspiration, consider these design patterns:

1. **Government Portal Style**: Clean, professional, accessible
2. **Map-centric Interface**: Interactive map for issue reporting
3. **Status Tracking**: Visual progress indicators for issues
4. **Citizen Engagement**: Points system, gamification elements
5. **Mobile-First Design**: Responsive for field reporting

Key UI Components to implement:
- Interactive map with issue markers
- Issue reporting form with photo upload
- Real-time status updates
- Citizen dashboard with reported issues
- Admin panel for issue management
- Analytics and reporting dashboard

This setup provides a solid foundation for a modern civic issue reporting platform with real-time capabilities and robust authentication.
