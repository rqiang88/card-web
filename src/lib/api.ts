import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { API_BASE_URL, ERROR_MESSAGES } from './constants'
import type { ApiResponse, ApiError } from '@/types'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error: AxiosError<ApiError>) => {
    // 处理不同类型的错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
        
        case 403:
          throw new Error(ERROR_MESSAGES.FORBIDDEN)
        
        case 404:
          throw new Error(ERROR_MESSAGES.NOT_FOUND)
        
        case 422:
          throw new Error(data?.error?.message || ERROR_MESSAGES.VALIDATION_ERROR)
        
        case 500:
          throw new Error(ERROR_MESSAGES.SERVER_ERROR)
        
        default:
          throw new Error(data?.error?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      // 网络错误
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误')
    }
  }
)

// API 方法封装
export const apiClient = {
  // GET 请求
  get: <T = any>(url: string, params?: any): Promise<T> => {
    return api.get(url, { params }).then(response => response.data)
  },

  // POST 请求
  post: <T = any>(url: string, data?: any): Promise<T> => {
    return api.post(url, data).then(response => response.data)
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any): Promise<T> => {
    return api.put(url, data).then(response => response.data)
  },

  // PATCH 请求
  patch: <T = any>(url: string, data?: any): Promise<T> => {
    return api.patch(url, data).then(response => response.data)
  },

  // DELETE 请求
  delete: <T = any>(url: string): Promise<T> => {
    return api.delete(url).then(response => response.data)
  },
}

// 认证相关 API
export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
}

// 会员相关 API
export const membersApi = {
  getMembers: (params?: any) =>
    apiClient.get('/members', params),
  
  getMember: (id: string) =>
    apiClient.get(`/members/${id}`),
  
  createMember: (data: any) =>
    apiClient.post('/members', data),
  
  updateMember: (id: string, data: any) =>
    apiClient.put(`/members/${id}`, data),
  
  deleteMember: (id: string) =>
    apiClient.delete(`/members/${id}`),
}

// 套餐相关 API
export const packagesApi = {
  getPackages: (params?: any) =>
    apiClient.get('/packages', params),
  
  getPackage: (id: string) =>
    apiClient.get(`/packages/${id}`),
  
  createPackage: (data: any) =>
    apiClient.post('/packages', data),
  
  updatePackage: (id: string, data: any) =>
    apiClient.put(`/packages/${id}`, data),
  
  deletePackage: (id: string) =>
    apiClient.delete(`/packages/${id}`),
}

// 消费记录相关 API
export const consumptionApi = {
  getConsumptions: (params?: any) =>
    apiClient.get('/consumptions', params),
  
  getConsumption: (id: string) =>
    apiClient.get(`/consumptions/${id}`),
  
  createConsumption: (data: any) =>
    apiClient.post('/consumptions', data),
  
  updateConsumption: (id: string, data: any) =>
    apiClient.put(`/consumptions/${id}`, data),
  
  deleteConsumption: (id: string) =>
    apiClient.delete(`/consumptions/${id}`),
}

// 充值记录相关 API
export const rechargeApi = {
  getRecharges: (params?: any) =>
    apiClient.get('/recharges', params),

  getRecharge: (id: string) =>
    apiClient.get(`/recharges/${id}`),

  createRecharge: (data: any) =>
    apiClient.post('/recharges', data),

  updateRecharge: (id: string, data: any) =>
    apiClient.put(`/recharges/${id}`, data),

  deleteRecharge: (id: string) =>
    apiClient.delete(`/recharges/${id}`),
}

// 统计数据相关 API
export const statsApi = {
  getDashboardStats: () =>
    apiClient.get('/stats/dashboard'),
  
  getMemberStats: (params?: any) =>
    apiClient.get('/stats/members', params),
  
  getRevenueStats: (params?: any) =>
    apiClient.get('/stats/revenue', params),
  
  getPackageStats: (params?: any) =>
    apiClient.get('/stats/packages', params),
}

export default api
