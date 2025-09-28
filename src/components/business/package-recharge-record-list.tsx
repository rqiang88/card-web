'use client'

import {
  Calendar,
  Clock,
  CreditCard,
  Eye,
  Phone,
  Search,
  Trash2,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react'

import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// 扩展的充值记录接口，包含完整的用户信息
interface PackageRechargeRecord {
  id: string
  rechargeAmount: number
  member: {
    id: string | number
    name: string
    phone?: string
    gender?: 'male' | 'female'
  }
  remainingTimes?: number
  totalTimes?: number
  expiryDate?: string
  rechargeAt: string
  status: {
    label: string
    color: string
  }
  paymentMethod?: {
    label: string
    icon: string
    color: string
  }
}

interface PackageRechargeRecordListProps {
  records: PackageRechargeRecord[]
  searchValue: string
  onSearchChange: (value: string) => void
  onDelete?: (record: PackageRechargeRecord) => void
  onViewDetail?: (record: PackageRechargeRecord) => void
  className?: string
}

// 性别显示配置
const getGenderDisplay = (gender?: 'male' | 'female') => {
  switch (gender) {
    case 'male':
      return {
        icon: '👨',
        text: '男',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      }
    case 'female':
      return {
        icon: '👩',
        text: '女',
        color: 'bg-pink-50 text-pink-700 border-pink-200',
      }
    default:
      return {
        icon: '👤',
        text: '未知',
        color: 'bg-gray-50 text-gray-700 border-gray-200',
      }
  }
}

// 获取用户头像背景色
const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return '已过期'
    } else if (diffDays === 0) {
      return '今天到期'
    } else if (diffDays <= 7) {
      return `${diffDays}天后到期`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  } catch {
    return '无效日期'
  }
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// 获取状态样式
const getStatusStyle = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    expired: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return statusMap[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

export function PackageRechargeRecordList({
  records,
  searchValue,
  onSearchChange,
  onDelete,
  onViewDetail,
  className,
}: PackageRechargeRecordListProps) {
  // 过滤记录
  const filteredRecords = React.useMemo(() => {
    if (!searchValue.trim()) return records

    const searchTerm = searchValue.toLowerCase()
    return records.filter(
      (record) =>
        record.member.name?.toLowerCase().includes(searchTerm) ||
        record.member.phone?.toLowerCase().includes(searchTerm) ||
        record.rechargeAmount.toString().includes(searchTerm)
    )
  }, [records, searchValue])

  return (
    <div className={cn('space-y-6', className)}>
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="搜索用户姓名、电话或充值金额..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
        />
      </div>

      {/* 记录列表 */}
      {filteredRecords.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                暂无充值记录
              </h3>
              <p className="text-sm text-gray-500">还没有任何充值记录</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const genderInfo = getGenderDisplay(record.member.gender)
            const avatarColor = getAvatarColor(record.member.name || '')

            return (
              <Card
                key={record.id}
                className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border-gray-200 hover:border-blue-300 relative overflow-hidden"
              >
                {/* 顶部装饰条 */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                <CardContent className="p-6">
                  {/* 主要内容区域 */}
                  <div className="space-y-4">
                    {/* 顶部：用户信息和充值金额 */}
                    <div className="flex items-start justify-between">
                      {/* 左侧：用户信息 */}
                      <div className="flex items-center space-x-4">
                        {/* 用户头像 */}
                        <div
                          className={cn(
                            'w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-md ring-2 ring-white',
                            avatarColor
                          )}
                        >
                          <span className="text-xl font-bold text-white">
                            {record.member.name?.charAt(0) || '?'}
                          </span>
                        </div>

                        {/* 用户基本信息 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {record.member.name || '未知用户'}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn('text-xs border', genderInfo.color)}
                            >
                              <span className="mr-1">{genderInfo.icon}</span>
                              {genderInfo.text}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {record.member.phone || '未提供'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 右侧：充值金额 */}
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          ¥{record.rechargeAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">充值金额</div>
                      </div>
                    </div>

                    {/* 使用次数信息 */}
                    {record.totalTimes !== undefined &&
                      record.totalTimes > 0 && (
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600">
                                剩余次数:
                              </span>
                              <span className="text-lg font-bold text-blue-600">
                                {record.remainingTimes || 0}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Wallet className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600">
                                总次数:
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {record.totalTimes}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-gray-500">
                              使用进度
                            </div>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, ((record.totalTimes - (record.remainingTimes || 0)) / record.totalTimes) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    {/* 充值详细信息和操作按钮 */}
                    <div className="flex items-center justify-between">
                      {/* 左侧：充值详细信息 */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">充值时间:</span>
                          <span className="text-gray-900 font-medium">
                            {formatDate(record.rechargeAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">状态:</span>
                          <Badge className={cn('text-xs', record.status.color)}>
                            {record.status.label}
                          </Badge>
                        </div>
                        {record.paymentMethod && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">支付方式:</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                record.paymentMethod.color
                              )}
                            >
                              <span className="mr-1">
                                {record.paymentMethod.icon}
                              </span>
                              {record.paymentMethod.label}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* 右侧：操作按钮 */}
                      {(onViewDetail || onDelete) && (
                        <div className="flex space-x-2">
                          {onViewDetail && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetail(record)}
                              className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                              <span>查看详情</span>
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(record)}
                              className="flex items-center space-x-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>删除</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
