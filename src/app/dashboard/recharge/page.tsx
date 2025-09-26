"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PAYMENT_METHODS, RECHARGE_STATUS } from "@/lib/constants"
import { Plus, Search, Trash2, Wallet, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { usePagination } from "@/hooks/use-pagination"
import { DataPagination } from "@/components/ui/data-pagination"
import { RechargeForm } from "@/components/forms/recharge-form"
import { useRecharges, useRechargeActions } from "@/hooks/use-recharges"
import type { RechargeFormData } from "@/types"
import dayjs from "dayjs"

// 立即设置token
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('🔑 立即设置临时token...')
    localStorage.setItem('token', 'test-token')
    console.log('🔑 token已立即设置')
  }
}



export default function RechargePage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  // 自动设置token
  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('🔑 自动设置临时token...')
      localStorage.setItem('token', 'test-token')
      console.log('🔑 token已自动设置')
      // 刷新页面以应用token
      window.location.reload()
    }
  }, [])



  // 格式化时间为精确到分钟的格式
  // 格式化日期时间，使用dayjs
  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD HH:mm')
  }

  // 格式化日期，只显示日期部分
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD')
  }

  // 格式化金额显示
  const formatAmount = (recharge: any) => {
    // 使用 rechargeAmount 字段显示金额，处理字符串类型
    const amount = parseFloat(recharge.rechargeAmount || recharge.amount || '0')
    return `¥${amount.toLocaleString()}`
  }

  // 使用真实的API钩子
  const { recharges, loading, error, mutate } = useRecharges({
    search: searchTerm,
    page: 1,
    limit: 50, // 获取更多数据用于前端分页
  })



  const { createRecharge, deleteRecharge } = useRechargeActions()

  // 过滤充值记录 - 添加安全检查
  const filteredRecharges = (recharges || []).filter((recharge: any) =>
    recharge.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recharge.packageName && recharge.packageName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedRecharges,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(filteredRecharges, {
    totalItems: filteredRecharges.length,
    itemsPerPage: 8, // 每页显示8条充值记录
  })

  // 获取支付方式标签
  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = PAYMENT_METHODS.find(m => m.value === method)
    if (!methodConfig) return null

    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        <span>{methodConfig.icon}</span>
        <span>{methodConfig.label}</span>
      </Badge>
    )
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    const statusConfig = RECHARGE_STATUS.find(s => s.value === status)
    return statusConfig ? (
      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
    ) : null
  }

  // 创建充值记录
  const handleCreateRecharge = async (data: RechargeFormData) => {
    try {
      await createRecharge(data)
      setIsCreateDialogOpen(false)
      mutate() // 刷新数据

      toast({
        title: "创建成功",
        description: "充值记录已成功创建",
      })
    } catch (error: any) {
      toast({
        title: "创建失败",
        description:
          error.response?.data?.message || "创建充值记录时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  // 删除充值记录

  const handleDeleteRecharge = async (rechargeId: string) => {
    if (!confirm("确定要删除这条充值记录吗？此操作不可恢复。")) {
      return
    }

    try {
      await deleteRecharge(rechargeId)
      mutate() // 刷新数据

      toast({
        title: "删除成功",
        description: "充值记录已成功删除",
      })
    } catch (error: any) {
      toast({
        title: "删除失败",
        description:
          error.response?.data?.message || "删除充值记录时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  // 计算统计数据 - 添加安全检查
  const totalAmount = (filteredRecharges || []).reduce((sum: number, r: any) => sum + parseFloat(r.rechargeAmount || r.amount || '0'), 0)
  const balanceRecharges = (filteredRecharges || []).filter((r: any) => r.type === 'balance')
  const packageRecharges = (filteredRecharges || []).filter((r: any) => r.type === 'package')

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">充值管理</h1>
          <p className="text-gray-600">管理会员的充值记录和套餐购买</p>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              会员充值
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>会员充值</DialogTitle>
              <DialogDescription>
                为会员充值余额或购买套餐
              </DialogDescription>
            </DialogHeader>
            <RechargeForm
              onSubmit={handleCreateRecharge}
              loading={false}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日充值</p>
                <p className="text-2xl font-bold text-gray-900">¥{totalAmount.toFixed(2)}</p>
                <p className="text-xs text-green-600">+18.5% 较昨日</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">充值笔数</p>
                <p className="text-2xl font-bold text-gray-900">{filteredRecharges.length}</p>
                <p className="text-xs text-blue-600">今日交易</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">余额充值</p>
                <p className="text-2xl font-bold text-gray-900">{balanceRecharges.length}</p>
                <p className="text-xs text-purple-600">余额类型</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">套餐充值</p>
                <p className="text-2xl font-bold text-gray-900">{packageRecharges.length}</p>
                <p className="text-xs text-orange-600">套餐类型</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-600" />
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
                placeholder="搜索会员姓名或套餐名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 充值记录列表 */}
      <Card>
        <CardHeader>
          <CardTitle>充值记录</CardTitle>
          <CardDescription>最新的会员充值和套餐购买记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(paginatedRecharges || []).map((recharge) => {
              // 获取会员信息
              const memberName = recharge.member?.name || recharge.memberName || '未知会员'
              const memberPhone = recharge.member?.phone || recharge.memberPhone || '未知电话'
              const memberGender = recharge.member?.gender || recharge.memberGender || 'unknown'

              // 性别显示信息
              const getGenderDisplay = (gender: string) => {
                switch (gender) {
                  case 'male': return { icon: '♂', text: '男', color: 'bg-blue-100 text-blue-700' }
                  case 'female': return { icon: '♀', text: '女', color: 'bg-pink-100 text-pink-700' }
                  default: return { icon: '?', text: '未知', color: 'bg-gray-100 text-gray-600' }
                }
              }
              
              const genderInfo = getGenderDisplay(memberGender)

              // 查看充值详情
              const handleViewRechargeDetails = (recharge: any) => {
                const memberName = recharge.member?.name || recharge.memberName || '未知会员'
                const memberPhone = recharge.member?.phone || recharge.memberPhone || '未知电话'
                const amount = parseFloat(recharge.rechargeAmount || recharge.amount || '0')
                const type = recharge.type === 'balance' ? '余额充值' : '套餐充值'
                const packageName = recharge.packageName || '无'
                const status = recharge.status || recharge.state || '未知'
                const rechargeTime = formatDateTime(recharge.rechargeAt || recharge.createdAt)
                const endDate = recharge.endDate ? formatDate(recharge.endDate) : '无'
                
                toast({
                  title: "充值记录详情",
                  description: `会员：${memberName} (${memberPhone})\n类型：${type}\n套餐：${packageName}\n金额：¥${amount.toLocaleString()}\n状态：${status}\n充值时间：${rechargeTime}\n到期时间：${endDate}`,
                  duration: 8000,
                })
              }

              return (
                <div key={recharge.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:from-blue-50 hover:to-white">
                  <div className="flex items-start justify-between">
                    {/* 左侧：会员信息 */}
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {memberName.charAt(0)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-bold text-gray-900 text-xl truncate max-w-[200px]">{memberName}</h3>
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${genderInfo.color}`}>
                            <span className="mr-1.5">{genderInfo.icon}</span>
                            <span>{genderInfo.text}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{memberPhone}</p>
                      </div>
                    </div>

                    {/* 右侧：充值信息和操作 */}
                    <div className="flex items-center space-x-6">
                      {/* 充值信息区域 */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-w-[400px]">
                        <div className="grid grid-cols-4 gap-4 text-center">
                          {/* 充值类型 */}
                          <div className="space-y-2">
                            <div className="text-sm font-bold text-gray-900">
                              {recharge.type === 'balance' ? '余额充值' : '套餐充值'}
                            </div>
                            {recharge.type !== 'balance' && (
                              <div className="text-xs text-gray-600 max-w-[80px] truncate mx-auto bg-gray-100 px-2 py-1 rounded">
                                {recharge.packageName || '未知套餐'}
                              </div>
                            )}
                          </div>

                          {/* 金额 */}
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-green-600">
                              {formatAmount(recharge)}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">充值金额</div>
                          </div>

                          {/* 状态 */}
                          <div className="space-y-2">
                            {getStatusBadge(recharge.status || recharge.state)}
                            <div className="text-xs text-gray-500 font-medium">状态</div>
                          </div>

                          {/* 剩余 */}
                          <div className="space-y-2">
                            <div className="text-sm font-bold text-gray-900">
                              {recharge.type === 'package' && recharge.remainingTimes !== undefined ? (
                                <div className="space-y-1">
                                  <div className="text-blue-600">{recharge.remainingTimes}</div>
                                  <div className="text-xs text-gray-500">/ {recharge.totalTimes} 次</div>
                                </div>
                              ) : recharge.remainingAmount !== undefined && recharge.remainingAmount > 0 ? (
                                <span className="text-blue-600">¥{recharge.remainingAmount.toLocaleString()}</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">剩余</div>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRechargeDetails(recharge)}
                          className="h-9 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 font-medium"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          详情
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRecharge(recharge.id)}
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
                    <div className="flex items-center justify-between">
                      {/* 充值时间 */}
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                        <span className="text-sm text-gray-600 font-medium">充值时间：</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatDateTime(recharge.rechargeAt || recharge.createdAt)}
                        </span>
                      </div>
                      
                      {/* 到期时间 */}
                      {recharge.endDate && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                          <span className="text-sm text-gray-600 font-medium">到期时间：</span>
                          <span className="text-sm font-bold text-orange-600">
                            {formatDate(recharge.endDate)}
                          </span>
                        </div>
                      )}
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
          共 {filteredRecharges.length} 条记录
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

      {/* 加载状态 */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">加载中...</h3>
            <p className="mt-2 text-gray-500">正在获取充值记录</p>
          </CardContent>
        </Card>
      )}

      {/* 错误状态 */}
      {error && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto h-12 w-12 text-red-400">❌</div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">加载失败</h3>
            <p className="mt-2 text-gray-500">
              {error.message || "获取充值记录时发生错误"}
            </p>
            <Button 
              onClick={() => mutate()} 
              className="mt-4"
              variant="outline"
            >
              重试
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 空状态 */}
      {!loading && !error && filteredRecharges.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">暂无充值记录</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm ? "没有找到匹配的充值记录" : "还没有任何充值记录"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
