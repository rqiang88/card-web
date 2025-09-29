'use client'

import { Calendar, Download, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { LatestMembers } from '@/components/dashboard/latest-members'
import { PopularPackages } from '@/components/dashboard/popular-packages'
import { RecentConsumptions } from '@/components/dashboard/recent-consumptions'
import { RecentRecharges } from '@/components/dashboard/recent-recharges'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { dashboardApi } from '@/lib/api/dashboard'

interface RevenueStats {
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  totalRevenue: number
  memberCount: number
  packageCount: number
  rechargeCount: number
  consumptionCount: number
}

export default function DashboardPage() {
  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    totalRevenue: 0,
    memberCount: 0,
    packageCount: 0,
    rechargeCount: 0,
    consumptionCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const fetchRevenueStats = async () => {
    try {
      setLoading(true)
      let startDateStr: string | undefined
      let endDateStr: string | undefined
      
      if (startDate) {
        startDateStr = startDate.toISOString().split('T')[0]
      }
      if (endDate) {
        endDateStr = endDate.toISOString().split('T')[0]
      }

      const data = await dashboardApi.getRevenueStats(startDateStr, endDateStr)
      setRevenueStats(data)
    } catch (error) {
      console.error('获取营收统计失败:', error)
      // 设置默认值
      setRevenueStats({
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        totalRevenue: 0,
        memberCount: 0,
        packageCount: 0,
        rechargeCount: 0,
        consumptionCount: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenueStats()
  }, [startDate, endDate])

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来，这里是您的业务概览
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 今日营收 */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">今日营收</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {loading ? '加载中...' : formatCurrency(revenueStats.todayRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* 本周营收 */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">本周营收</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {loading ? '加载中...' : formatCurrency(revenueStats.weekRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* 本月营收 */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">本月营收</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {loading ? '加载中...' : formatCurrency(revenueStats.monthRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* 总营收 */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">总营收</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {loading ? '加载中...' : formatCurrency(revenueStats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* 会员数量 */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">会员数量</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">
              {loading ? '加载中...' : revenueStats.memberCount.toLocaleString('zh-CN')}
            </div>
          </CardContent>
        </Card>

        {/* 套餐数量 */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-indigo-700">套餐数量</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {loading ? '加载中...' : revenueStats.packageCount.toLocaleString('zh-CN')}
            </div>
          </CardContent>
        </Card>

        {/* 充值笔数 */}
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700">充值笔数</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900">
              {loading ? '加载中...' : revenueStats.rechargeCount.toLocaleString('zh-CN')}
            </div>
          </CardContent>
        </Card>

        {/* 消费笔数 */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">消费笔数</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {loading ? '加载中...' : revenueStats.consumptionCount.toLocaleString('zh-CN')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表和热门套餐区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营收趋势图占位 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>营收趋势</span>
              <select className="text-sm border rounded px-2 py-1">
                <option>最近7天</option>
                <option>最近30天</option>
                <option>最近90天</option>
              </select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              图表功能开发中...
            </div>
          </CardContent>
        </Card>

        {/* 热门套餐 */}
        <PopularPackages />
      </div>

      {/* 最近活动区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新会员 */}
        <LatestMembers />

        {/* 最近充值 */}
        <RecentRecharges />

        {/* 最近消费 */}
        <RecentConsumptions />
      </div>
    </div>
  )
}