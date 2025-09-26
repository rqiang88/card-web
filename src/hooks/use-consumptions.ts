"use client"

import useSWR from 'swr'
import api from '@/lib/api'
import { fetcher } from '@/components/providers/swr-provider'
import type { Consumption } from '@/types'

interface UseConsumptionsParams {
  search?: string
  page?: number
  limit?: number
  memberId?: string
}

interface ConsumptionsResponse {
  items: Consumption[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useConsumptions(params: UseConsumptionsParams = {}) {
  const { search = '', page = 1, limit = 10, memberId } = params
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(memberId && { memberId }),
  })

  const swrKey = `/consumptions?${queryParams.toString()}`
  console.log('消费Hook调试:', { swrKey, params })

  const { data, error, isLoading, mutate } = useSWR<ConsumptionsResponse>(
    swrKey,
    fetcher, // 直接使用导出的fetcher
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // 禁用去重，强制发起请求
      onSuccess: (data) => {
        console.log('✅ 消费记录SWR成功:', data)
      },
      onError: (err) => {
        console.error('❌ 消费记录SWR错误:', err)
      },
      onLoadingSlow: () => {
        console.warn('⏳ 消费记录SWR加载缓慢')
      }
    }
  )

  console.log('消费Hook状态:', { 
    swrKey,
    data: data ? '有数据' : '无数据', 
    error: error ? error.message : '无错误', 
    isLoading,
    dataType: typeof data,
    dataKeys: data ? Object.keys(data) : []
  })

  // 如果使用全局fetcher，我们需要在这里进行数据转换
  const transformedData = data ? {
    ...data,
    items: data.items?.map((item: any): Consumption => ({
      id: item.id,
      memberId: item.memberId?.toString(),
      memberName: item.customerName || item.member?.name,
      memberPhone: item.customerPhone || item.member?.phone,
      memberGender: item.member?.gender as 'male' | 'female',
      amount: parseFloat(item.amount) || 0,
      paymentMethod: item.paymentType || 'cash', // 后端字段 paymentType -> 前端字段 paymentMethod
      description: item.remark, // 后端字段 remark -> 前端字段 description
      operatorId: item.operatorId?.toString() || '',
      operatorName: item.operator?.name || item.operatorName || '未知操作员',
      createdAt: item.createdAt || item.consumptionAt,
      // 新增字段
      packageName: item.packageName,
      rechargeInfo: item.rechargeInfo,
    })) || []
  } : null

  return {
    consumptions: transformedData?.items || [],
    total: transformedData?.total || 0,
    page: transformedData?.page || 1,
    limit: transformedData?.limit || 10,
    totalPages: transformedData?.totalPages || 0,
    loading: isLoading,
    error,
    mutate,
  }
}

export function useConsumptionActions() {
  const createConsumption = async (data: any) => {
    const response = await api.post('/consumptions', data)
    return response.data
  }

  const updateConsumption = async (id: string, data: any) => {
    const response = await api.patch(`/consumptions/${id}`, data)
    return response.data
  }

  const deleteConsumption = async (id: string) => {
    const response = await api.delete(`/consumptions/${id}`)
    return response.data
  }

  return {
    createConsumption,
    updateConsumption,
    deleteConsumption,
  }
}