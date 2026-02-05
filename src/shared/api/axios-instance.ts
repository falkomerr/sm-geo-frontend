import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '../config/api'
import { storage } from '../lib/storage'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add JWT to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401, token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError['config'] & { _retry?: boolean }

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = storage.getRefreshToken()
        if (!refreshToken) {
          // No refresh token, redirect to login
          storage.clear()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { token, refreshToken: newRefreshToken } = response.data

        // Store new tokens
        storage.setToken(token)
        storage.setRefreshToken(newRefreshToken)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        storage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
