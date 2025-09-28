import useSWR from 'swr'

import { fetcher } from '@/components/providers/swr-provider'
import { packagesApi } from '@/lib/api'
import type { Package, PaginationResponse, QueryParams } from '@/types'

// 获取套餐列表
export function usePackages(params?: QueryParams) {
  console.log('🚀 usePackages hook 被调用，参数:', params)

  const queryString = params
    ? new URLSearchParams(params as any).toString()
    : ''
  const swrKey = queryString ? `/packages?${queryString}` : '/packages'

  console.log('🚀 usePackages SWR Key:', swrKey)

  const { data, error, mutate, isLoading, isValidating } = useSWR<
    PaginationResponse<Package>
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
        console.log('🚀 usePackages SWR onSuccess:', data)
      },
      onError: (error) => {
        console.log('🚀 usePackages SWR onError:', error)
      },
    }
  )

  console.log('🚀 usePackages SWR 状态:', {
    data,
    error,
    isLoading,
    isValidating,
    packages: data?.items || [],
    total: data?.total || 0,
  })

  return {
    packages: data?.items || [],
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

// 获取单个套餐
export function usePackage(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Package>(
    id ? `/packages/${id}` : null,
    id ? fetcher : null,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  )

  return {
    package: data,
    loading: isLoading,
    error,
    mutate,
  }
}

// 套餐操作 Hook
export function usePackageActions() {
  const createPackage = async (data: any) => {
    try {
      const response = await packagesApi.createPackage(data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const updatePackage = async (id: string, data: any) => {
    try {
      const response = await packagesApi.updatePackage(id, data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const deletePackage = async (id: string) => {
    try {
      await packagesApi.deletePackage(id)
      return true
    } catch (error) {
      throw error
    }
  }

  return {
    createPackage,
    updatePackage,
    deletePackage,
  }
}
