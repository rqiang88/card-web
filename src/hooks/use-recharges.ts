'use client'

import useSWR from 'swr'

import { useEffect } from 'react'

import { fetcher } from '@/components/providers/swr-provider'
import { rechargeApi } from '@/lib/api'
import type {
  PaginationResponse,
  QueryParams,
  Recharge,
  RechargeFormData,
} from '@/types'

// 获取充值列表
export function useRecharges(params?: QueryParams) {
  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : ''
  const swrKey = `/recharges${queryString ? `?${queryString}` : ''}`
  // 使用最简单的SWR配置
  const { data, error, mutate, isLoading } = useSWR<
    PaginationResponse<Recharge>
  >(
    swrKey,
    fetcher, // 直接使用fetcher
    {
      revalidateOnMount: true,
    }
  )

  return {
    recharges: data?.items || [],
    total: data?.total || 0,
    pagination: data ? {
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 10,
      totalPages: data.totalPages || 1
    } : undefined,
    loading: isLoading,
    error,
    mutate,
  }
}

// 获取单个充值记录
export function useRecharge(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Recharge>(
    id ? `/recharges/${id}` : null,
    id ? fetcher : null, // 使用全局 fetcher，自动解包后端 ApiResponse 的 data 字段
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  return {
    recharge: data,
    loading: isLoading,
    error,
    mutate,
  }
}

// 充值操作
export function useRechargeActions() {
  const createRecharge = async (data: RechargeFormData) => {
    return await rechargeApi.createRecharge(data)
  }

  const updateRecharge = async (
    id: string,
    data: Partial<RechargeFormData>
  ) => {
    return await rechargeApi.updateRecharge(id, data)
  }

  const deleteRecharge = async (id: string) => {
    return await rechargeApi.deleteRecharge(id)
  }

  return {
    createRecharge,
    updateRecharge,
    deleteRecharge,
  }
}
