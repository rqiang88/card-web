import dayjs from 'dayjs'
import { LucideIcon, Search } from 'lucide-react'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DataPagination } from '@/components/ui/data-pagination'
import { Input } from '@/components/ui/input'
import { usePagination } from '@/hooks/use-pagination'

interface RecordItem {
  id: string
  title: string
  subtitle: string
  amount: number
  createdAt: string
  status?: {
    label: string
    color: string
  }
  badges?: {
    label: string
    color: string
  }[]
  extraInfo?: string
}

interface RecordListProps {
  records: RecordItem[]
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  emptyTitle: string
  emptyDescription: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
  amountColor: string
  amountPrefix: string
  borderColor: string
  focusRingColor: string
  className?: string
}

export function RecordList({
  records,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  iconColor,
  iconBgColor,
  amountColor,
  amountPrefix,
  borderColor,
  focusRingColor,
  className = '',
}: RecordListProps) {
  // 过滤记录
  const filteredRecords = React.useMemo(() => {
    if (!searchValue) return records
    return records.filter(
      (record) =>
        record.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.subtitle.toLowerCase().includes(searchValue.toLowerCase())
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
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`pl-10 bg-background border-border focus:ring-2 ${focusRingColor} transition-all duration-200`}
        />
      </div>

      {/* 记录列表 */}
      <div className="space-y-3">
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-16">
            <div
              className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <Icon className={`w-10 h-10 ${iconColor}`} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchValue ? `未找到匹配的${emptyTitle}` : `暂无${emptyTitle}`}
            </h3>
            {!searchValue && (
              <p className="text-sm text-muted-foreground">
                {emptyDescription}
              </p>
            )}
          </div>
        ) : (
          paginatedRecords.map((record) => (
            <Card
              key={record.id}
              className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${borderColor} bg-gradient-to-r from-background to-background/95 border-l-4`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div
                      className={`w-14 h-14 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}
                    >
                      <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors duration-200">
                          {record.title}
                        </h4>
                        {record.status && (
                          <Badge
                            className={`${record.status.color} text-xs font-medium shadow-sm`}
                          >
                            {record.status.label}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        {record.badges &&
                          record.badges.map(
                            (
                              badge: { label: string; color: string },
                              index: number
                            ) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className={`${badge.color} text-xs border-current`}
                              >
                                {badge.label}
                              </Badge>
                            )
                          )}
                        {record.badges &&
                          record.badges.length > 0 &&
                          record.subtitle && (
                            <span className="text-muted-foreground">•</span>
                          )}
                        <span className="text-muted-foreground font-medium">
                          {record.subtitle}
                        </span>
                      </div>

                      {record.extraInfo && (
                        <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg inline-block">
                          {record.extraInfo}
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="bg-muted/50 px-2 py-1 rounded-md">
                          {dayjs(record.createdAt).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-3 ml-4">
                    <div
                      className={`text-3xl font-bold ${amountColor} group-hover:scale-105 transition-transform duration-200`}
                    >
                      {amountPrefix}¥{record.amount.toLocaleString()}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
                        {amountPrefix === '+' ? '充值金额' : '消费金额'}
                      </div>
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
        <div className="flex justify-center pt-6 border-t border-border/50">
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
