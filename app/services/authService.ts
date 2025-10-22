/**
 * Authentication API Service
 * Handles all authentication operations including login, user management, and permissions
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

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

class AuthService {
  private baseUrl: string

  constructor() {
    // Get base URL from environment variables
    const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL
    if (!apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is not configured in environment variables')
    }
    this.baseUrl = `${apiBaseUrl}/auth`
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data: LoginResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.data) {
        // Store token and user data
        this.setToken(data.data.token)
        this.setUser(data.data.user)
      }

      return data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })

      const data: ApiResponse<{ user: User }> = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          this.logout()
        }
        throw new Error(data.message || 'Failed to get profile')
      }

      if (data.success && data.data) {
        this.setUser(data.data.user)
      }

      return data
    } catch (error) {
      console.error('Get profile failed:', error)
      throw error
    }
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: User['role']
    status?: User['status']
  }): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(userData),
      })

      const data: ApiResponse<{ user: User }> = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user')
      }

      return data
    } catch (error) {
      console.error('Create user failed:', error)
      throw error
    }
  }

  /**
   * Get all users (Admin only)
   */
  async getUsers(params?: {
    page?: number
    limit?: number
    role?: string
    status?: string
    search?: string
  }): Promise<ApiResponse<{
    users: User[]
    pagination: {
      currentPage: number
      totalPages: number
      totalUsers: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }>> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.role) queryParams.append('role', params.role)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.search) queryParams.append('search', params.search)

      const response = await fetch(`${this.baseUrl}/users?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get users')
      }

      return data
    } catch (error) {
      console.error('Get users failed:', error)
      throw error
    }
  }

  /**
   * Update user (Admin only)
   */
  async updateUser(userId: string, userData: Partial<{
    firstName: string
    lastName: string
    role: User['role']
    status: User['status']
  }>): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user')
      }

      return data
    } catch (error) {
      console.error('Update user failed:', error)
      throw error
    }
  }

  /**
   * Delete user (Super Admin only)
   */
  async deleteUser(userId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }

      return data
    } catch (error) {
      console.error('Delete user failed:', error)
      throw error
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getUser()
    return user?.permissions?.includes(permission) || false
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    const user = this.getUser()
    return user?.role === role
  }

  /**
   * Check if user is admin or higher
   */
  isAdmin(): boolean {
    const user = this.getUser()
    return user?.role === 'admin' || user?.role === 'superAdmin'
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    const user = this.getUser()
    return user?.role === 'superAdmin'
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  }

  /**
   * Set token in storage
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Set user in storage
   */
  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  /**
   * Make authenticated request
   */
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken()
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)
    
    if (response.status === 401) {
      // Token expired or invalid, logout user
      this.logout()
      window.location.href = '/login'
      throw new Error('Authentication failed')
    }

    return response
  }
}

export const authService = new AuthService()
