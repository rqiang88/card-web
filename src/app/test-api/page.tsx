"use client"

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'

export default function TestApiPage() {
  const [token, setToken] = useState<string | null>(null)
  const [apiResult, setApiResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 检查localStorage中的token
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    
    // 测试API调用
    const testApi = async () => {
      try {
        console.log('测试API调用...')
        const response = await fetch('http://localhost:3001/api/recharges', {
          headers: {
            'Content-Type': 'application/json',
            ...(storedToken && { 'Authorization': `Bearer ${storedToken}` })
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setApiResult(data)
        console.log('API调用成功:', data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        setError(errorMsg)
        console.error('API调用失败:', err)
      }
    }
    
    testApi()
  }, [])

  const setTestToken = () => {
    localStorage.setItem('token', 'test-token')
    setToken('test-token')
    window.location.reload()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API 测试页面</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">认证状态</h2>
          <p>Token: {token || '无'}</p>
          {!token && (
            <button 
              onClick={setTestToken}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              设置测试Token
            </button>
          )}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">API 调用结果</h2>
          {error && (
            <div className="text-red-500">
              错误: {error}
            </div>
          )}
          {apiResult && (
            <div>
              <p>总数: {apiResult.total}</p>
              <p>记录数: {apiResult.items?.length || 0}</p>
              {apiResult.items?.length > 0 && (
                <div className="mt-2">
                  <h3 className="font-semibold">第一条记录:</h3>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(apiResult.items[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}