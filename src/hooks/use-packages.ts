import useSWR from 'swr'
import { packagesApi } from '@/lib/api'
import type { Package, PaginationResponse, QueryParams } from '@/types'

// 获取套餐列表
export function usePackages(params?: QueryParams) {
  const queryString = params ? new URLSearchParams(params as any).toString() : ''
  const { data, error, mutate, isLoading } = useSWR<PaginationResponse<Package>>(
    `/packages${queryString ? `?${queryString}` : ''}`,
    () => packagesApi.getPackages(params)
  )

  return {
    packages: data?.items || [],
    total: data?.pagination?.total || 0,
    pagination: data?.pagination,
    loading: isLoading,
    error,
    mutate,
  }
}

// 获取单个套餐
export function usePackage(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Package>(
    id ? `/packages/${id}` : null,
    id ? () => packagesApi.getPackage(id) : null
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
