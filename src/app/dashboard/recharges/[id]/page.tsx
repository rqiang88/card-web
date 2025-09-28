'use client'

import dayjs from 'dayjs'
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Phone,
  Sparkles,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react'

import { useParams } from 'next/navigation'

import { ConsumptionRecordList } from '@/components/business/consumption-record-list'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useConsumptions } from '@/hooks/use-consumptions'
import { useRecharge } from '@/hooks/use-recharges'

function getStatusDisplay(status: string | undefined) {
  switch (status) {
    case 'active':
      return {
        text: '有效',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle,
      }
    case 'expired':
      return {
        text: '已过期',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
      }
    case 'used':
      return {
        text: '已用完',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle,
      }
    case 'completed':
      return {
        text: '已完成',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: CheckCircle,
      }
    default:
      return {
        text: status || '未知',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle,
      }
  }
}

function getGenderDisplay(gender: string) {
  switch (gender) {
    case 'male':
      return '男'
    case 'female':
      return '女'
    default:
      return '未知'
  }
}

export default function RechargeDetailPage() {
  const params = useParams()
  const rechargeId = params.id as string

  const {
    recharge,
    loading: rechargeLoading,
    error: rechargeError,
  } = useRecharge(rechargeId)
  const { consumptions, loading: consumptionsLoading } = useConsumptions({
    rechargeId: rechargeId,
    limit: 50, // 显示更多消费记录
  })

  if (rechargeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                加载中...
              </p>
              <p className="text-sm text-gray-500">正在获取充值记录详情</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (rechargeError || !recharge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="container mx-auto p-6">
          <Card className="border-red-200 bg-white/80 backdrop-blur-sm shadow-xl max-w-md mx-auto mt-20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  加载失败
                </h3>
                <p className="text-red-600">
                  {rechargeError?.message || '充值记录不存在或已被删除'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusDisplay(recharge.state)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-8">
          {/* 基本信息卡片 - 增强设计 */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>
            <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center space-x-4 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  基本信息
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* 基本信息一行显示 */}
              <div className="grid grid-cols-4 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      套餐名称
                    </p>
                    <p className="font-bold text-gray-900">
                      {recharge.packageName || '余额充值'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <StatusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">
                      状态
                    </p>
                    <Badge
                      className={`${statusInfo.color} border font-semibold px-3 py-1`}
                    >
                      {statusInfo.text}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">
                      充值金额
                    </p>
                    <p className="font-bold text-green-700 text-lg">
                      ¥{recharge.rechargeAmount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-600 mb-1">
                      充值时间
                    </p>
                    <p className="font-bold text-gray-900">
                      {dayjs(recharge.createdAt).format('YYYY-MM-DD HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 套餐详情（仅当是套餐充值时显示） */}
              {recharge.type === 'package' && (
                <>
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                      套餐使用情况
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600 mb-1">
                            总次数
                          </p>
                          <p className="text-2xl font-bold text-blue-700">
                            {recharge.totalTimes || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-600 mb-1">
                            已使用
                          </p>
                          <p className="text-2xl font-bold text-orange-700">
                            {recharge.usedTimes || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-600 mb-1">
                            剩余次数
                          </p>
                          <p className="text-2xl font-bold text-green-700">
                            {recharge.remainingTimes || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {recharge.endDate && (
                      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 mt-6 shadow-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-600 mb-1">
                            有效期至
                          </p>
                          <p className="font-bold text-amber-800 text-lg">
                            {dayjs(recharge.endDate).format('YYYY-MM-DD')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 会员信息卡片 - 增强设计 */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
            <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center space-x-4 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                  会员信息
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* 会员信息一行显示 */}
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">
                      会员姓名
                    </p>
                    <p className="font-bold text-gray-900">
                      {recharge.memberName || recharge.member?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      电话号码
                    </p>
                    <p className="font-bold text-gray-900">
                      {recharge.member?.phone || '未知'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">
                      状态
                    </p>
                    <p className="font-bold text-gray-900">
                      {recharge.member?.state === 'active' ? '正常' : '禁用'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 消费记录列表 - 增强设计 */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 h-2"></div>
            <CardHeader className="pb-6 bg-gradient-to-r from-red-50 to-pink-50">
              <CardTitle className="flex items-center space-x-4 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent">
                  相关消费记录
                </span>
              </CardTitle>
              <p className="text-gray-600 mt-3 ml-16">
                显示使用此充值记录的所有消费情况
              </p>
            </CardHeader>
            <CardContent className="p-8">
              {consumptionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-500 mx-auto mb-4"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      加载消费记录...
                    </p>
                  </div>
                </div>
              ) : consumptions.length > 0 ? (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                  <ConsumptionRecordList
                    records={consumptions.map((consumption) => ({
                      id: consumption.id,
                      packageName: consumption.packageName,
                      packageType: consumption.packageType, // 传递套餐类型信息
                      amount: consumption.amount,
                      paymentMethod: consumption.paymentMethod,
                      consumptionAt: consumption.consumptionAt,
                      operatorName: consumption.operatorName,
                      rechargeInfo: consumption.rechargeInfo,
                    }))}
                  />
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600 mb-3">
                    暂无消费记录
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    此充值记录还没有相关的消费记录，消费后将在这里显示详细信息
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
