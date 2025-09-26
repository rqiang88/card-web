"use client"

import useSWR from 'swr'
import { useEffect } from 'react'
import { rechargeApi } from '@/lib/api'
import { fetcher } from '@/components/providers/swr-provider'
import type { Recharge, RechargeFormData, PaginationResponse, QueryParams } from '@/types'

// 获取充值列表
export function useRecharges(params?: QueryParams) {
  const queryString = params ? new URLSearchParams(params as any).toString() : ''
  const swrKey = `/recharges${queryString ? `?${queryString}` : ''}`
  // 使用最简单的SWR配置
  const { data, error, mutate, isLoading } = useSWR<PaginationResponse<Recharge>>(
    swrKey,
    fetcher, // 直接使用fetcher
    {
      revalidateOnMount: true,
    }
  )

  return {
    recharges: data?.items || [],
    total: data?.pagination?.total || 0,
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  }
}

// 获取单个充值记录
export function useRecharge(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Recharge>(
    id ? `/recharges/${id}` : null,
    id ? () => rechargeApi.getRecharge(id) : null
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

  const updateRecharge = async (id: string, data: Partial<RechargeFormData>) => {
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