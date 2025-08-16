import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import * as authAPI from '../services/api'
import toast from 'react-hot-toast'

export interface User {
  id: string
  email: string
  name: string
  license_number?: string
  membership_category?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  license_number?: string
  membership_category?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      authAPI.setAuthToken(token)
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await authAPI.getProfile()
      setUser(userData.user)
    } catch (error) {
      localStorage.removeItem('accessToken')
      authAPI.removeAuthToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      localStorage.setItem('accessToken', response.accessToken)
      authAPI.setAuthToken(response.accessToken)
      setUser(response.user)
      toast.success('تم تسجيل الدخول بنجاح')
    } catch (error: any) {
      toast.error(error.message || 'فشل تسجيل الدخول')
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData)
      localStorage.setItem('accessToken', response.accessToken)
      authAPI.setAuthToken(response.accessToken)
      setUser(response.user)
      toast.success('تم إنشاء الحساب بنجاح')
    } catch (error: any) {
      toast.error(error.message || 'فشل إنشاء الحساب')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    authAPI.removeAuthToken()
    authAPI.logout()
    setUser(null)
    toast.success('تم تسجيل الخروج بنجاح')
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(userData)
      setUser(response.user)
      toast.success('تم تحديث الملف الشخصي بنجاح')
    } catch (error: any) {
      toast.error(error.message || 'فشل تحديث الملف الشخصي')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}


