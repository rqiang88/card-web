'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  startDate?: Date | null
  endDate?: Date | null
  onDateChange: (startDate: Date | null, endDate: Date | null) => void
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localStartDate, setLocalStartDate] = useState(
    startDate ? startDate.toISOString().split('T')[0] : ''
  )
  const [localEndDate, setLocalEndDate] = useState(
    endDate ? endDate.toISOString().split('T')[0] : ''
  )

  const handleApply = () => {
    const start = localStartDate ? new Date(localStartDate) : null
    const end = localEndDate ? new Date(localEndDate) : null
    onDateChange(start, end)
    setIsOpen(false)
  }

  const handleClear = () => {
    setLocalStartDate('')
    setLocalEndDate('')
    onDateChange(null, null)
    setIsOpen(false)
  }

  const formatDateRange = () => {
    if (!startDate && !endDate) return '选择日期范围'
    const formatDate = (date: Date) => date.toLocaleDateString('zh-CN')
    if (startDate && endDate) return `${formatDate(startDate)} 至 ${formatDate(endDate)}`
    if (startDate) return `从 ${formatDate(startDate)}`
    if (endDate) return `至 ${formatDate(endDate)}`
    return '选择日期范围'
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-[280px] justify-start text-left font-normal',
          !startDate && !endDate && 'text-muted-foreground'
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {formatDateRange()}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-md border bg-background p-4 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">开始日期</label>
              <Input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">结束日期</label>
              <Input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button variant="outline" onClick={handleClear} className="flex-1">
                清除
              </Button>
              <Button onClick={handleApply} className="flex-1">
                应用
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}