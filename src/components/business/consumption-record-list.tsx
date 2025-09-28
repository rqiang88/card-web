'use client'

import dayjs from 'dayjs'
import {
  Calendar,
  Clock,
  CreditCard,
  Package,
  Phone,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react'

import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface ConsumptionRecord {
  id: string
  packageName?: string
  amount: number
  paymentMethod?: string
  consumptionAt: string
  memberName?: string
  memberPhone?: string
  memberGender?: 'male' | 'female'
  rechargeInfo?: {
    id: string | number
    totalTimes: number
    remainingTimes: number
    usedTimes: number
    rechargeAmount: number
    totalAmount: number
    remainingAmount: number
  }
}

export interface ConsumptionRecordListProps {
  records: ConsumptionRecord[]
  onDelete?: (id: string) => void
}

const getPaymentMethodConfig = (method?: string) => {
  switch (method) {
    case 'cash':
      return { label: '现金', icon: '💵', color: 'bg-green-100 text-green-800' }
    case 'card':
      return { label: '银行卡', icon: '💳', color: 'bg-blue-100 text-blue-800' }
    case 'wechat':
      return {
        label: '微信支付',
        icon: '💚',
        color: 'bg-green-100 text-green-800',
      }
    case 'alipay':
      return { label: '支付宝', icon: '🔵', color: 'bg-blue-100 text-blue-800' }
    default:
      return { label: '其他', icon: '💰', color: 'bg-gray-100 text-gray-800' }
  }
}

const getGenderDisplay = (gender?: 'male' | 'female') => {
  switch (gender) {
    case 'male':
      return '男'
    case 'female':
      return '女'
    default:
      return ''
  }
}

export function ConsumptionRecordList({
  records,
  onDelete,
}: ConsumptionRecordListProps) {
  if (!records || records.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            暂无消费记录
          </h3>
          <p className="text-gray-500 text-center">该会员还没有任何消费记录</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {records.map((record) => {
        const paymentConfig = getPaymentMethodConfig(record.paymentMethod)

        return (
          <Card
            key={record.id}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* 左侧主要信息 */}
                <div className="flex-1 space-y-3">
                  {/* 套餐名称和金额 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {record.packageName || '未知套餐'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-blue-500" />
                            <span className="text-sm text-gray-700 font-medium">
                              {record.memberName || '非会员'}
                            </span>
                            {record.memberGender && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {getGenderDisplay(record.memberGender)}
                              </span>
                            )}
                          </div>
                          {record.memberPhone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {record.memberPhone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 右侧金额和删除按钮 */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          -¥{record.amount.toFixed(2)}
                        </div>
                        <Badge className={paymentConfig.color}>
                          {paymentConfig.icon} {paymentConfig.label}
                        </Badge>
                      </div>

                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(record.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 使用次数信息 - 仅当有充值记录时显示 */}
                  {record.rechargeInfo && (
                    <div className="flex items-center space-x-6 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          已使用:
                        </span>
                        <span className="font-medium text-orange-600">
                          {record.rechargeInfo.usedTimes}次
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          剩余:
                        </span>
                        <span className="font-medium text-blue-600">
                          {record.rechargeInfo.remainingTimes}次
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-muted-foreground">
                          总次数:
                        </span>
                        <span className="font-medium text-slate-600">
                          {record.rechargeInfo.totalTimes}次
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 消费时间 */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-muted-foreground">
                      消费时间:
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {dayjs(record.consumptionAt).format(
                        'YYYY年MM月DD日 HH:mm'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
