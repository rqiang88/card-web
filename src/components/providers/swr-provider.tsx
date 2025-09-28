'use client'

import { SWRConfig } from 'swr'

import React, { ReactNode } from 'react'

import { apiClient } from '@/lib/api'

interface SWRProviderProps {
  children: ReactNode
}

// 全局fetcher函数
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'

export const newFetcher = async (url: string) => {
  console.log('🚀🚀🚀 FETCHER 被调用!!! URL:', url)
  console.log('🚀🚀🚀 调用栈:', new Error().stack)

  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
    console.log('🚀🚀🚀 完整URL:', fullUrl)

    // 对于 GET 请求移除自定义 headers，避免触发 CORS 预检
    const response = await fetch(fullUrl)

    console.log('🚀🚀🚀 响应状态:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    // 统一解包后端的全局响应格式 { success, data, message, timestamp }
    const unwrapped =
      raw && typeof raw === 'object' && 'data' in raw ? (raw as any).data : raw
    console.log('🚀🚀🚀 Fetcher 原始数据:', raw)
    console.log('🚀🚀🚀 Fetcher 解包后的返回数据:', unwrapped)
    return unwrapped
  } catch (error) {
    console.error('🚀🚀🚀 Fetcher 错误:', error)
    throw error
  }
}

// 导出别名以保持兼容性
export const fetcher = newFetcher

export function SWRProvider({ children }: { children: ReactNode }) {
  console.log('🔧 ===== SWRProvider 初始化 (简化版) =====')
  console.log('🔧 Fetcher函数类型:', typeof newFetcher)
  console.log('🔧 Fetcher函数名称:', newFetcher.name)

  return (
    <SWRConfig
      value={{
        fetcher: newFetcher,
        onSuccess: (data: any, key: string) => {
          console.log('🔧 SWR onSuccess:', { key, dataType: typeof data })
        },
        onError: (error: any, key: string) => {
          console.log('🔧 SWR onError:', {
            key,
            error: (error as Error).message,
          })
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
