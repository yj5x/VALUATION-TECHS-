import axios, { AxiosInstance, AxiosError } from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            const response = await this.client.post('/auth/refresh')
            const newToken = response.data.accessToken
            localStorage.setItem('accessToken', newToken)
            
            // Retry original request
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${newToken}`
              return this.client.request(error.config)
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken')
            window.location.href = '/login'
          }
        }

        const message = error.response?.data?.error || error.message || 'حدث خطأ غير متوقع'
        throw new Error(message)
      }
    )
  }

  setAuthToken(token: string) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.client.defaults.headers.Authorization
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password })
  }

  async register(userData: any) {
    return this.client.post('/auth/register', userData)
  }

  async logout() {
    return this.client.post('/auth/logout')
  }

  async getProfile() {
    return this.client.get('/auth/profile')
  }

  async updateProfile(userData: any) {
    return this.client.put('/auth/profile', userData)
  }

  // File endpoints
  async uploadFiles(files: File[]) {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    return this.client.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  async getFiles(limit = 50, offset = 0) {
    return this.client.get('/files', { params: { limit, offset } })
  }

  async getFile(id: string) {
    return this.client.get(`/files/${id}`)
  }

  async deleteFile(id: string) {
    return this.client.delete(`/files/${id}`)
  }

  // Report endpoints
  async getReports(limit = 50, offset = 0) {
    return this.client.get('/reports', { params: { limit, offset } })
  }

  async getReport(id: string) {
    return this.client.get(`/reports/${id}`)
  }

  async deleteReport(id: string) {
    return this.client.delete(`/reports/${id}`)
  }

  async exportReport(id: string) {
    const response = await this.client.get(`/reports/${id}/export`, {
      responseType: 'blob',
    })
    return response
  }

  async exportMultipleReports(reportIds: string[]) {
    const response = await this.client.post('/reports/export', { reportIds }, {
      responseType: 'blob',
    })
    return response
  }

  // Analysis endpoints
  async startAnalysis(fileIds: string[]) {
    return this.client.post('/analysis/start', { fileIds })
  }

  async getAnalysisStatus(fileId: string) {
    return this.client.get(`/analysis/status/${fileId}`)
  }
}

const apiClient = new APIClient()

export const setAuthToken = (token: string) => apiClient.setAuthToken(token)
export const removeAuthToken = () => apiClient.removeAuthToken()
export const login = (email: string, password: string) => apiClient.login(email, password)
export const register = (userData: any) => apiClient.register(userData)
export const logout = () => apiClient.logout()
export const getProfile = () => apiClient.getProfile()
export const updateProfile = (userData: any) => apiClient.updateProfile(userData)
export const uploadFiles = (files: File[]) => apiClient.uploadFiles(files)
export const getFiles = (limit?: number, offset?: number) => apiClient.getFiles(limit, offset)
export const getFile = (id: string) => apiClient.getFile(id)
export const deleteFile = (id: string) => apiClient.deleteFile(id)
export const getReports = (limit?: number, offset?: number) => apiClient.getReports(limit, offset)
export const getReport = (id: string) => apiClient.getReport(id)
export const deleteReport = (id: string) => apiClient.deleteReport(id)
export const exportReport = (id: string) => apiClient.exportReport(id)
export const exportMultipleReports = (reportIds: string[]) => apiClient.exportMultipleReports(reportIds)
export const startAnalysis = (fileIds: string[]) => apiClient.startAnalysis(fileIds)
export const getAnalysisStatus = (fileId: string) => apiClient.getAnalysisStatus(fileId)


