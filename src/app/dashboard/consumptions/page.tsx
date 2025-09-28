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

  // 获取性别显示信息
  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return {
          icon: '♂',
          text: '男',
          color: 'bg-blue-100 text-blue-700',
        }
      case 'female':
        return {
          icon: '♀',
          text: '女',
          color: 'bg-pink-100 text-pink-700',
        }
      default:
        return {
          icon: '?',
          text: '未知',
          color: 'bg-gray-100 text-gray-600',
        }
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
          <div className="space-y-4">
            {paginatedConsumptions.map((consumption) => {
              // 获取会员信息
              const memberName = consumption.memberName || '非会员'
              const memberPhone = consumption.memberPhone || ''
              const memberGender = consumption.memberGender || 'unknown'

              const genderInfo = getGenderDisplay(memberGender)

              return (
                <div
                  key={consumption.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-green-300 hover:from-green-50 hover:to-white"
                >
                  <div className="flex items-start justify-between">
                    {/* 左侧：会员信息 */}
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {memberName.charAt(0)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-gray-900 text-xl truncate max-w-[200px]">
                            {memberName}
                          </h3>
                          {memberGender !== 'unknown' && (
                            <div
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${genderInfo.color}`}
                            >
                              <span className="mr-1.5">{genderInfo.icon}</span>
                              <span>{genderInfo.text}</span>
                            </div>
                          )}
                        </div>
                        {memberPhone && (
                          <p className="text-sm text-gray-600 font-medium">
                            {memberPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 右侧：消费信息和操作 */}
                    <div className="flex items-center space-x-6">
                      {/* 消费信息区域 */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-w-[350px]">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {/* 套餐信息 */}
                          <div className="space-y-2 flex flex-col items-center justify-center">
                            <div className="text-sm font-bold text-gray-900">
                              套餐信息
                            </div>
                            {consumption.packageName ? (
                              <div className="text-xs text-gray-600 max-w-[90px] truncate bg-green-100 px-2 py-1 rounded">
                                {consumption.packageName}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400">
                                无套餐
                              </div>
                            )}
                          </div>

                          {/* 金额显示区域 */}
                          <div className="space-y-2 flex flex-col items-center justify-center">
                            {consumption.rechargeInfo ? (
                              // 有关联充值信息时，显示充值金额
                              <>
                                <div className="text-2xl font-bold text-emerald-600">
                                  ¥
                                  {Number(
                                    consumption.rechargeInfo.rechargeAmount
                                  ).toFixed(2)}
                                </div>
                                <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                                  关联充值金额
                                </div>
                              </>
                            ) : consumption.packageType === 'normal' ? (
                              // 普通套餐但无关联充值时，显示消费金额
                              <>
                                <div className="text-2xl font-bold text-orange-600">
                                  ¥{consumption.amount.toFixed(2)}
                                </div>
                                <div className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                                  消费金额
                                </div>
                              </>
                            ) : (
                              // 其他套餐类型显示套餐消费
                              <>
                                <div className="text-lg font-bold text-blue-600">
                                  套餐消费
                                </div>
                                <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                  {consumption.packageType === 'times'
                                    ? '按次消费'
                                    : '按金额消费'}
                                </div>
                              </>
                            )}
                          </div>

                          {/* 关联充值详情 */}
                          <div className="space-y-2 flex flex-col items-center justify-center">
                            {consumption.rechargeInfo ? (
                              <div className="space-y-1 flex flex-col items-center">
                                <div className="text-sm font-bold text-purple-700">
                                  {consumption.rechargeInfo.remainingTimes || 0}
                                  /{consumption.rechargeInfo.totalTimes || 0}
                                </div>
                                <div className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded">
                                  剩余/总次数
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 flex flex-col items-center">
                                <div className="text-sm font-bold text-gray-400">
                                  --
                                </div>
                                <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                  无关联充值
                                </div>
                              </div>
                            )}
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

                      {/* 操作按钮 */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteConsumption(consumption.id)
                          }
                          className="h-9 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 底部：时间信息 */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      {/* 消费时间 */}
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">
                          消费时间：
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {consumption.consumptionAt
                            ? dayjs(consumption.consumptionAt).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )
                            : dayjs(consumption.createdAt).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
