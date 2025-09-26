"use client"

import * as React from "react"
import { Wallet, Calendar, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useRecharges } from "@/hooks/use-recharges"
import type { Recharge } from "@/types"

interface RechargeSelectorProps {
  value?: string
  onValueChange?: (rechargeId: string, recharge: Recharge) => void
  memberId?: string
  placeholder?: string
  disabled?: boolean
}

export function RechargeSelector({
  value,
  onValueChange,
  memberId,
  placeholder = "选择充值记录",
  disabled = false,
}: RechargeSelectorProps) {
  const [selectedRecharge, setSelectedRecharge] = React.useState<Recharge | null>(null)

  // 获取指定会员的充值记录
  console.log('🔍 RechargeSelector调试:', { memberId, params: memberId ? { memberId } : undefined })
  const { recharges, loading } = useRecharges(
    memberId ? { memberId } : undefined
  )

  // 显示该会员的所有充值记录，不做任何过滤
  const availableRecharges = React.useMemo(() => {
    if (!recharges) return []
    return recharges
  }, [recharges])

  // 当选中的充值记录改变时，更新状态（兼容父组件传入 number/string）
  React.useEffect(() => {
    if (value != null && availableRecharges.length > 0) {
      const recharge = availableRecharges.find((r: Recharge) => String(r.id) === String(value))
      setSelectedRecharge(recharge || null)
    } else {
      setSelectedRecharge(null)
    }
  }, [value, availableRecharges])

  const handleSelect = (rechargeId: string) => {
    const recharge = availableRecharges.find((r: Recharge) => String(r.id) === rechargeId)
    if (recharge) {
      setSelectedRecharge(recharge)
      onValueChange?.(rechargeId, recharge)
    }
  }

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return "无限期"
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  const getStatusBadge = (recharge: Recharge) => {
    const status = (recharge as any).status || ((recharge as any).state === 'valid' ? 'active' : (recharge as any).state)
    const remaining = recharge.remainingTimes ?? null
    const expiryRaw = (recharge as any).expiryDate || (recharge as any).endDate
    const expired = (() => {
      if (!expiryRaw) return false
      const end = new Date(expiryRaw)
      const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
      return endOfDay < new Date()
    })()

    if (expired || status === 'expired') {
      return <Badge variant="destructive" className="text-xs">已过期</Badge>
    }
    if (status === 'used' || remaining === 0) {
      return <Badge variant="secondary" className="text-xs">已用完</Badge>
    }
    return <Badge variant="default" className="text-xs bg-green-100 text-green-800">有效</Badge>
  }

  if (!memberId) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>请先选择会员</span>
          </div>
        </SelectTrigger>
      </Select>
    )
  }

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>加载中...</span>
          </div>
        </SelectTrigger>
      </Select>
    )
  }

  if (availableRecharges.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>暂无可用充值记录</span>
          </div>
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value != null ? String(value) : undefined} onValueChange={handleSelect} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedRecharge && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="truncate">
                  {selectedRecharge.packageName || "套餐充值"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {selectedRecharge.totalTimes && (
                  <span>{selectedRecharge.remainingTimes || 0}/{selectedRecharge.totalTimes}次</span>
                )}
                {getStatusBadge(selectedRecharge)}
              </div>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-w-md">
        {availableRecharges.map((recharge: Recharge) => (
          <SelectItem 
            key={recharge.id} 
            value={String(recharge.id)}
            className="p-3 mb-2 border border-gray-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate text-gray-900">
                    {recharge.packageName || "套餐充值"}
                  </p>
                  {getStatusBadge(recharge)}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-4">
                    {recharge.totalTimes && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium text-green-600">
                          剩余 {recharge.remainingTimes || 0}/{recharge.totalTimes} 次
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>至 {formatExpiryDate(((recharge as any).expiryDate || (recharge as any).endDate) as string | undefined)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}