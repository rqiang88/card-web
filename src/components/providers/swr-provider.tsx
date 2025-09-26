"use client"

import { SWRConfig } from 'swr'
import React, { ReactNode } from 'react'
import { apiClient } from '@/lib/api'

interface SWRProviderProps {
  children: ReactNode
}

// 全局fetcher函数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const fetcher = async (url: string) => {
  console.log('🚀 SWR Fetcher调用:', { url, timestamp: new Date().toISOString() })
  
  // 如果URL以/api开头，直接使用；否则拼接API_BASE_URL
  const fullUrl = url.startsWith('/api') ? url : `${API_BASE_URL}${url}`
  console.log('🌐 请求URL:', fullUrl)
  
  // 获取认证token - 确保在客户端环境中获取
  let token: string | null = null
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
    // 如果没有token，设置一个测试token
    if (!token) {
      console.log('🔑 未找到token，设置测试token')
      localStorage.setItem('token', 'test-token')
      token = 'test-token'
    }
  }
  console.log('🔑 Token状态:', token ? `有token: ${token.substring(0, 10)}...` : '无token')
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(fullUrl, { headers })
    console.log('📡 响应状态:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ 请求失败:', { status: response.status, statusText: response.statusText, errorText })
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ 请求成功:', { url, dataType: typeof data, hasItems: data?.items?.length })
    return data
  } catch (error) {
    console.error('💥 Fetcher异常:', { 
      url, 
      error: error instanceof Error ? error.message : String(error)
    })
    throw error
  }
}

export function SWRProvider({ children }: { children: ReactNode }) {
  console.log('🔧 SWRProvider初始化 - 最新版本')
  
  return (
    <SWRConfig value={{
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      fetcher: fetcher,
      dedupingInterval: 0, // 禁用去重
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error: any, key: string) => {
        console.error('🔥 SWR错误:', { key, error: error?.message })
      },
      onSuccess: (data: any, key: string) => {
        console.log('✅ SWR成功:', { key, hasData: !!data })
      }
    }}>
      {children}
    </SWRConfig>
  )
}