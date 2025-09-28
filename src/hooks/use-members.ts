import useSWR from 'swr'

import { fetcher } from '@/components/providers/swr-provider'
import { membersApi } from '@/lib/api'
import type { Member, PaginationResponse, QueryParams } from '@/types'

// 获取会员列表
export function useMembers(params?: QueryParams) {
  console.log('🚀 useMembers hook 被调用，参数:', params)

  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : ''
  const swrKey = queryString ? `/members?${queryString}` : '/members'

  console.log('🚀 useMembers SWR Key:', swrKey)

  const { data, error, mutate, isLoading, isValidating } = useSWR<
    PaginationResponse<Member>
  >(
    swrKey,
    fetcher, // 添加缺失的fetcher参数
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // 2秒内去重
      refreshInterval: 0, // 不自动刷新
      onSuccess: (data) => {
        console.log('🚀 useMembers SWR onSuccess:', data)
      },
      onError: (error) => {
        console.log('🚀 useMembers SWR onError:', error)
      },
    }
  )

  console.log('🚀 useMembers SWR 状态:', {
    data,
    error,
    isLoading,
    isValidating,
    members: data?.items || [],
    total: data?.total || 0,
  })

  return {
    members: data?.items || [],
    total: data?.total || 0,
    pagination: data
      ? {
          total: data.total || 0,
          page: data.page || 1,
          limit: data.limit || 10,
          totalPages: data.totalPages || 1,
        }
      : undefined,
    loading: isLoading,
    error,
    mutate,
  }
}

// 获取单个会员
export function useMember(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Member>(
    id ? `/members/${id}` : null,
    id ? fetcher : null,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  return {
    member: data,
    loading: isLoading,
    error,
    mutate,
  }
}

// 会员操作 Hook
export function useMemberActions() {
  const createMember = async (data: any) => {
    try {
      const response = await membersApi.createMember(data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const updateMember = async (id: string, data: any) => {
    try {
      const response = await membersApi.updateMember(id, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const deleteMember = async (id: string) => {
    try {
      await membersApi.deleteMember(id)
    } catch (error) {
      throw error
    }
  }

  return {
    createMember,
    updateMember,
    deleteMember,
  }
}
