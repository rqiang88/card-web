import useSWR from 'swr'
import { membersApi } from '@/lib/api'
import type { Member, PaginationResponse, QueryParams } from '@/types'

// 获取会员列表
export function useMembers(params?: QueryParams) {
  const queryString = params ? new URLSearchParams(params as any).toString() : ''
  const swrKey = `/members${queryString ? `?${queryString}` : ''}`
  
  console.log('会员Hook调试:', { swrKey, params })
  
  const { data, error, mutate, isLoading } = useSWR<PaginationResponse<Member>>(
    swrKey,
    null, // 使用全局fetcher
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onSuccess: (data) => {
        console.log('会员API调用成功:', data)
      },
      onError: (err) => {
        console.error('会员API调用失败:', err)
      }
    }
  )

  console.log('会员Hook状态:', { data, error, isLoading })

  return {
    members: data?.items || [],
    total: data?.pagination?.total || 0,
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  }
}

// 获取单个会员
export function useMember(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Member>(
    id ? `/members/${id}` : null,
    id ? () => membersApi.getMember(id) : null
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
      return true
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
