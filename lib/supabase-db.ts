import { createClient } from './supabase/server'

export async function createIssue(data: {
  title: string
  description: string
  category: string
  latitude: number
  longitude: number
  userId: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('issues')
    .insert([data])
    .select()

  if (error) {
    console.error('Error creating issue:', error)
    throw error
  }

  return data
}

export async function getIssues() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      user:users(name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching issues:', error)
    throw error
  }

  return data
}

export async function updateIssueStatus(id: string, status: string, imageAfter?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('issues')
    .update({ status, image_after: imageAfter })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating issue:', error)
    throw error
  }

  return data
}

export async function createUserProfile(userData: {
  id: string
  email: string
  name?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()

  if (error) {
    console.error('Error creating user profile:', error)
    throw error
  }

  return data
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error)
    throw error
  }

  return data
}
