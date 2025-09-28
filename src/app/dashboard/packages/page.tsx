'use client'

import dayjs from 'dayjs'
import {
  Edit,
  Eye,
  Package as PackageIcon,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'

import * as React from 'react'

import Link from 'next/link'

import { PackageForm } from '@/components/forms/package-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DataPagination } from '@/components/ui/data-pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePackageActions, usePackages } from '@/hooks/use-packages'
import { usePagination } from '@/hooks/use-pagination'
import { useToast } from '@/hooks/use-toast'
import { PACKAGE_CATEGORIES, PACKAGE_STATUS } from '@/lib/constants'
import type { Package } from '@/types'

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
    null
  )
  const { toast } = useToast()

  // 使用真实的API钩子
  const { packages, loading, error, mutate } = usePackages({
    search: searchTerm,
    page: 1,
    limit: 50, // 获取更多数据用于前端分页
  })

  const { createPackage, updatePackage, deletePackage } = usePackageActions()

  // 过滤套餐数据
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description &&
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedPackages,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(filteredPackages, {
    totalItems: filteredPackages.length,
    itemsPerPage: 6, // 每页显示6个套餐卡片
  })

  // 获取分类标签样式
  const getCategoryBadge = (category: string) => {
    const categoryConfig = PACKAGE_CATEGORIES.find((c) => c.value === category)
    return categoryConfig ? (
      <Badge className={categoryConfig.color}>{categoryConfig.label}</Badge>
    ) : null
  }

  // 获取状态标签样式
  const getStatusBadge = (status: string) => {
    const statusConfig = PACKAGE_STATUS.find((s) => s.value === status)
    return statusConfig ? (
      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
    ) : null
  }

  // 创建套餐
  const handleCreatePackage = async (data: any) => {
    try {
      await createPackage(data)
      setIsCreateDialogOpen(false)
      mutate() // 刷新数据

      toast({
        title: '创建成功',
        description: '套餐已成功创建',
      })
    } catch (error: any) {
      toast({
        title: '创建失败',
        description:
          error.response?.data?.message || '创建套餐时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 编辑套餐
  const handleEditPackage = async (data: any) => {
    if (!selectedPackage) return

    try {
      await updatePackage(selectedPackage.id, data)
      setIsEditDialogOpen(false)
      setSelectedPackage(null)
      mutate() // 刷新数据

      toast({
        title: '更新成功',
        description: '套餐已成功更新',
      })
    } catch (error: any) {
      toast({
        title: '更新失败',
        description:
          error.response?.data?.message || '更新套餐时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 删除套餐
  const handleDeletePackage = async (packageId: string) => {
    if (!confirm('确定要删除这个套餐吗？此操作不可恢复。')) {
      return
    }

    try {
      await deletePackage(packageId)
      mutate() // 刷新数据

      toast({
        title: '删除成功',
        description: '套餐已成功删除',
      })
    } catch (error: any) {
      toast({
        title: '删除失败',
        description:
          error.response?.data?.message || '删除套餐时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">套餐管理</h1>
          <p className="text-gray-600">管理系统中的所有服务套餐</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              新增套餐
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新增套餐</DialogTitle>
              <DialogDescription>
                创建新的服务套餐，设置价格和有效期
              </DialogDescription>
            </DialogHeader>
            <PackageForm onSubmit={handleCreatePackage} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索套餐名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 错误处理 */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">加载套餐数据失败</p>
            <Button onClick={() => mutate()}>重试</Button>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>加载中...</p>
          </div>
        </div>
      )}

      {/* 套餐列表 */}
      {!loading && !error && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">
                      名称
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      状态
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      价格
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      套餐类型
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      有效期
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {pkg.name}
                          </div>
                          {pkg.description && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {pkg.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={
                            pkg.state === 'saling'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {pkg.state === 'saling' ? '销售中' : '已下架'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-lg font-bold text-green-600">
                          ¥{pkg.salePrice}
                        </div>
                        {/* {pkg.price && pkg.salePrice !== pkg.price && (
                          <div className="text-sm text-gray-500 line-through">
                            ¥{pkg.price}
                          </div>
                        )} */}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {pkg.packType === 'times'
                            ? '按次数'
                            : pkg.packType === 'normal'
                              ? '普通套餐'
                              : '按金额'}
                        </div>
                        {(pkg.packType === 'times' ||
                          pkg.packType === 'normal') &&
                          pkg.totalTimes && (
                            <div className="text-sm text-gray-500">
                              {pkg.totalTimes}次
                            </div>
                          )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {pkg.packType === 'normal'
                            ? '永久'
                            : `${pkg.validDay}天`}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/packages/${pkg.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPackage(pkg)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 分页组件和统计信息 */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          共 {filteredPackages.length} 个套餐
          {totalPages > 1 && (
            <span className="ml-2">
              (第 {startIndex + 1}-{endIndex} 条，共 {totalPages} 页)
            </span>
          )}
        </div>
        {totalPages > 1 && (
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            maxVisible={5}
          />
        )}
      </div>

      {/* 编辑套餐对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑套餐</DialogTitle>
            <DialogDescription>修改套餐信息</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <PackageForm
              initialData={{
                name: selectedPackage.name,
                description: selectedPackage.description,
                packType: selectedPackage.packType || 'times',
                category: selectedPackage.category,
                price: selectedPackage.price || 0,
                salePrice: selectedPackage.salePrice || 0,
                totalTimes: selectedPackage.totalTimes,
                validDay: selectedPackage.validDay || 30,
              }}
              onSubmit={handleEditPackage}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 空状态 */}
      {filteredPackages.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">暂无套餐</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? '没有找到匹配的套餐' : '开始创建您的第一个套餐'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
