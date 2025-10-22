/**
 * Simple Authentication Utility
 * Handles login, token management with cookies, and user data in localStorage
 */

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'superAdmin' | 'admin' | 'manager' | 'salesperson'
  status: 'active' | 'inactive' | 'deleted'
  permissions: string[]
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
    expiresIn: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not configured in environment variables')
}

// Cookie utilities
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return // Skip on server
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Strict'
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null // Return null on server
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return // Skip on server
  setCookie(name, '', -1)
}

// Authentication functions
export const auth = {
  // Login function
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: LoginResponse = await response.json()

      if (data.success && data.data) {
        // Save token in cookie (7 days)
        setCookie('auth_token', data.data.token, 7)
        
        // Save user data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(data.data.user))
        }
        
        return data
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error instanceof Error ? error : new Error('Login failed')
    }
  },

  // Logout function
  logout(): void {
    deleteCookie('auth_token')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data')
    }
    
    // Only redirect if we're not already on the login page
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  },

  // Get token from cookie
  getToken(): string | null {
    return getCookie('auth_token')
  },

  // Get user data from localStorage
  getUser(): User | null {
    if (typeof window === 'undefined') return null // Return null on server
    try {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    
    // If no token or user data, not authenticated
    if (!token || !user) {
      return false
    }
    
    // Additional check: verify token hasn't expired (basic check)
    try {
      // Decode JWT payload to check expiration (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp < now) {
        // Token expired, clean up
        this.logout()
        return false
      }
      
      return true
    } catch (error) {
      // Invalid token format, clean up
      this.logout()
      return false
    }
  },

  // Check authentication and redirect if necessary
  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      return false
    }
    return true
  },

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const user = this.getUser()
    return user?.permissions.includes(permission) || false
  },

  // Check if user has specific role
  hasRole(role: User['role']): boolean {
    const user = this.getUser()
    return user?.role === role
  },

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin') || this.hasRole('superAdmin')
  }
}
