import dayjs from 'dayjs'
import {
  Calendar,
  Clock,
  Eye,
  Package,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataPagination } from '@/components/ui/data-pagination'
import { Input } from '@/components/ui/input'
import { usePagination } from '@/hooks/use-pagination'

interface RechargeRecord {
  id: string
  rechargeAmount: number
  packageName?: string
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
  type: 'package' | 'balance'
}

interface RechargeRecordListProps {
  records: RechargeRecord[]
  searchValue: string
  onSearchChange: (value: string) => void
  onDelete?: (id: string) => void
  onViewDetail?: (id: string) => void
  className?: string
}

export function RechargeRecordList({
  records,
  searchValue,
  onSearchChange,
  onDelete,
  onViewDetail,
  className = '',
}: RechargeRecordListProps) {
  // 过滤记录
  const filteredRecords = React.useMemo(() => {
    if (!searchValue) return records
    return records.filter(
      (record) =>
        (record.packageName &&
          record.packageName
            .toLowerCase()
            .includes(searchValue.toLowerCase())) ||
        record.rechargeAmount.toString().includes(searchValue) ||
        record.status.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [records, searchValue])

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedRecords,
    goToPage,
  } = usePagination(filteredRecords, {
    totalItems: filteredRecords.length,
    itemsPerPage: 10,
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="搜索充值记录..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-muted-foreground text-lg">
              {searchValue ? '未找到匹配的充值记录' : '暂无充值记录'}
            </p>
            {!searchValue && (
              <p className="text-sm text-muted-foreground mt-1">
                该会员暂无充值记录
              </p>
            )}
          </div>
        ) : (
          paginatedRecords.map((record) => (
            <Card
              key={record.id}
              className="hover-lift border-l-4 border-l-emerald-400 bg-background"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* 左侧信息 */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-emerald-500" />
                    </div>

                    <div className="space-y-3 flex-1">
                      {/* 套餐名称和类型 */}
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-foreground text-lg">
                          {record.type === 'package'
                            ? record.packageName || '套餐充值'
                            : '余额充值'}
                        </h3>
                        <Badge className={record.status.color}>
                          {record.status.label}
                        </Badge>
                        {record.paymentMethod && (
                          <Badge className={record.paymentMethod.color}>
                            {record.paymentMethod.icon}{' '}
                            {record.paymentMethod.label}
                          </Badge>
                        )}
                      </div>

                      {/* 使用次数信息 - 仅套餐充值显示 */}
                      {record.type === 'package' && record.totalTimes && (
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-muted-foreground">
                              剩余次数:
                            </span>
                            <span className="font-medium text-blue-600">
                              {record.remainingTimes || 0}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-muted-foreground">
                              总次数:
                            </span>
                            <span className="font-medium text-slate-600">
                              {record.totalTimes}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 时间信息 */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-muted-foreground">
                            充值时间:
                          </span>
                          <span className="text-sm font-medium">
                            {dayjs(record.rechargeAt).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </span>
                        </div>
                        {record.type === 'package' && record.expiryDate && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-muted-foreground">
                              到期日期:
                            </span>
                            <span className="text-sm font-medium text-orange-600">
                              {dayjs(record.expiryDate).format('YYYY-MM-DD')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 右侧金额和操作 */}
                  <div className="text-right flex flex-col items-end space-y-2">
                    <div className="text-2xl font-bold text-emerald-600">
                      +¥{record.rechargeAmount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      充值金额
                    </div>
                    <div className="flex space-x-2">
                      {onViewDetail && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail(record.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          详情
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(record.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          删除
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4 border-t border-border">
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  )
}
