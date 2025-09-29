'use client'

import { Calendar, CreditCard, Eye, Package, Wallet } from 'lucide-react'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api/dashboard'
import type { RecentRecharge } from '@/lib/api/dashboard'

export function RecentRecharges() {
  const [recharges, setRecharges] = useState<RecentRecharge[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRecentRecharges = async () => {
      try {
        setLoading(true)
        const data = await dashboardApi.getRecentRecharges()
        setRecharges(data)
      } catch (error) {
        console.error('获取最近充值失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentRecharges()
  }, [])

  const getGenderDisplay = (gender?: string) => {
    switch (gender) {
      case 'male':
        return { text: '男', color: 'text-blue-600 bg-blue-100' }
      case 'female':
        return { text: '女', color: 'text-pink-600 bg-pink-100' }
      default:
        return { text: '未知', color: 'text-gray-600 bg-gray-100' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toFixed(2)}`
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">最近充值</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          最近充值
        </CardTitle>
        <button
          onClick={() => router.push('/dashboard/recharges')}
          className="text-xs text-primary hover:underline flex items-center gap-1 transition-colors hover:text-primary/80"
        >
          <Eye className="w-3 h-3" />
          查看更多
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recharges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无充值记录</p>
            </div>
          ) : (
            recharges.map((recharge) => {
              const genderInfo = getGenderDisplay(recharge.memberGender)
              return (
                <div
                  key={recharge.id}
                  onClick={() =>
                    router.push(`/dashboard/recharges/${recharge.id}`)
                  }
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {recharge.memberName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${genderInfo.color}`}
                    >
                      {genderInfo.text.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {recharge.memberName || '未知会员'}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(recharge.rechargeTime)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Package className="h-3 w-3 mr-1" />
                        <span className="truncate">
                          {recharge.packageName || '余额充值'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-green-600">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {formatCurrency(recharge.rechargeAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
