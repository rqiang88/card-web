'use client'

import dayjs from 'dayjs'
import {
  Calendar,
  Clock,
  Coins,
  CreditCard,
  Package,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-react'

import * as React from 'react'

import { ConsumptionForm } from '@/components/forms/consumption-form'
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
import {
  useConsumptionActions,
  useConsumptions,
} from '@/hooks/use-consumptions'
import { usePagination } from '@/hooks/use-pagination'
import { useToast } from '@/hooks/use-toast'
import { PAYMENT_METHODS } from '@/lib/constants'
import type { ConsumptionFormData } from '@/types'

export default function ConsumptionPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const { toast } = useToast()

  // 使用真实的API钩子
  const { consumptions, loading, error, mutate } = useConsumptions({
    search: searchTerm,
    page: 1,
    limit: 50, // 获取更多数据用于前端分页
  })

  const { createConsumption, deleteConsumption } = useConsumptionActions()

  // 获取性别显示文本
  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男'
      case 'female':
        return '女'
      default:
        return '未知'
    }
  }

  // 过滤消费记录
  const filteredConsumptions = consumptions.filter(
    (consumption: any) =>
      consumption.memberName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consumption.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedConsumptions,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(filteredConsumptions, {
    totalItems: filteredConsumptions.length,
    itemsPerPage: 8, // 每页显示8条消费记录
  })

  // 获取支付方式标签
  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = PAYMENT_METHODS.find((m) => m.value === method)
    if (!methodConfig) return null

    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <span>{methodConfig.icon}</span>
        <span>{methodConfig.label}</span>
      </Badge>
    )
  }

  // 创建消费记录
  const handleCreateConsumption = async (data: ConsumptionFormData) => {
    try {
      await createConsumption(data)
      setIsCreateDialogOpen(false)
      mutate() // 刷新数据

      toast({
        title: '创建成功',
        description: '消费记录已成功创建',
      })
    } catch (error: any) {
      toast({
        title: '创建失败',
        description:
          error.response?.data?.message || '创建消费记录时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 删除消费记录
  const handleDeleteConsumption = async (consumptionId: string) => {
    if (!confirm('确定要删除这条消费记录吗？此操作不可恢复。')) {
      return
    }

    try {
      await deleteConsumption(consumptionId)
      mutate() // 刷新数据

      toast({
        title: '删除成功',
        description: '消费记录已成功删除',
      })
    } catch (error: any) {
      toast({
        title: '删除失败',
        description:
          error.response?.data?.message || '删除消费记录时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 计算总金额
  const totalAmount = filteredConsumptions.reduce(
    (sum: number, c: any) => sum + c.amount,
    0
  )

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">消费管理</h1>
          <p className="text-gray-600">管理会员的消费记录和交易明细</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              记录消费
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>记录消费</DialogTitle>
              <DialogDescription>为会员添加新的消费记录</DialogDescription>
            </DialogHeader>
            <ConsumptionForm
              onSubmit={handleCreateConsumption}
              loading={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日消费</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{totalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-green-600">+12.5% 较昨日</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">消费笔数</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredConsumptions.length}
                </p>
                <p className="text-xs text-blue-600">今日交易</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均消费</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥
                  {filteredConsumptions.length > 0
                    ? (totalAmount / filteredConsumptions.length).toFixed(2)
                    : '0.00'}
                </p>
                <p className="text-xs text-purple-600">单笔平均</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索会员姓名或消费描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 消费记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>消费记录</span>
          </CardTitle>
          <CardDescription>最新的会员消费交易记录</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 表头 */}
          <div className="grid grid-cols-12 gap-6 items-center py-3 px-6 bg-gray-50 rounded-lg mb-4 text-xs font-medium text-gray-600">
            <div className="col-span-3 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>会员信息</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>套餐</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>消费时间</span>
            </div>
            <div className="col-span-3 flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>关联充值</span>
            </div>
            <div className="col-span-2 text-right">
              <span>消费金额</span>
            </div>
          </div>

          <div className="space-y-4">
            {paginatedConsumptions.map((consumption) => (
              <div
                key={consumption.id}
                className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
              >
                {/* 主要信息区域 */}
                <div className="grid grid-cols-12 gap-6 items-start">
                  {/* 左侧：会员信息 */}
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-gray-900 text-sm">
                        {consumption.memberName || '非会员'}
                      </span>
                      {consumption.memberGender && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {getGenderDisplay(consumption.memberGender)}
                        </span>
                      )}
                    </div>
                    {consumption.memberPhone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {consumption.memberPhone}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 套餐信息 */}
                  <div className="col-span-2">
                    {consumption.packageName ? (
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-green-500" />
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          {consumption.packageName}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">无套餐</span>
                    )}
                  </div>

                  {/* 消费时间 */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <div className="text-xs">
                        <div className="font-medium text-gray-900">
                          {consumption.consumptionAt
                            ? dayjs(consumption.consumptionAt).format(
                                'YYYY-MM-DD'
                              )
                            : dayjs(consumption.createdAt).format('YYYY-MM-DD')}
                        </div>
                        <div className="text-gray-500">
                          {consumption.consumptionAt
                            ? dayjs(consumption.consumptionAt).format('HH:mm')
                            : dayjs(consumption.createdAt).format('HH:mm')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 充值信息 */}
                  <div className="col-span-3">
                    {consumption.rechargeInfo ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4 text-orange-500" />
                          <span className="text-xs font-medium text-gray-900">
                            ¥
                            {Number(
                              consumption.rechargeInfo.rechargeAmount
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          剩余 {consumption.rechargeInfo.remainingTimes}/
                          {consumption.rechargeInfo.totalTimes} 次
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">无关联充值</span>
                    )}
                  </div>

                  {/* 右侧：金额和操作 */}
                  <div className="col-span-2 flex items-center justify-end space-x-3">
                    <div className="text-right space-y-1">
                      <div className="text-xl font-bold text-gray-900">
                        ¥{consumption.amount.toFixed(2)}
                      </div>
                      <div className="flex justify-end">
                        {getPaymentMethodBadge(consumption.paymentMethod)}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConsumption(consumption.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 消费描述（如果有） */}
                {consumption.description && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">备注：</span>
                      {consumption.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 分页组件和统计信息 */}
      <div className="flex justify-between items-center mt-6 min-w-0 flex-nowrap">
        <div className="text-sm text-gray-500 flex-shrink-0">
          共 {filteredConsumptions.length} 条记录
          {totalPages > 1 && (
            <span className="ml-2">
              (第 {startIndex + 1}-{endIndex} 条，共 {totalPages} 页)
            </span>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex-shrink-0">
            <DataPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              maxVisible={5}
              className="justify-end"
            />
          </div>
        )}
      </div>

      {/* 空状态 */}
      {filteredConsumptions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              暂无消费记录
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? '没有找到匹配的消费记录' : '还没有任何消费记录'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
