'use client'

import dayjs from 'dayjs'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  DollarSign,
  Download,
  ExternalLink,
  Package,
  PiggyBank,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { SimpleChart } from '@/components/charts/simple-chart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DashboardOverview,
  LatestMember,
  PopularPackage,
  RecentConsumption,
  RecentRecharge,
  dashboardApi,
} from '@/lib/api/dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [latestMembers, setLatestMembers] = useState<LatestMember[]>([])
  const [recentConsumptions, setRecentConsumptions] = useState<
    RecentConsumption[]
  >([])
  const [recentRecharges, setRecentRecharges] = useState<RecentRecharge[]>([])
  const [popularPackages, setPopularPackages] = useState<PopularPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewData, members, consumptions, recharges, packages] =
          await Promise.all([
            dashboardApi.getOverview(),
            dashboardApi.getLatestMembers(),
            dashboardApi.getRecentConsumptions(),
            dashboardApi.getRecentRecharges(),
            dashboardApi.getPopularPackages(),
          ])
        setOverview(overviewData)
        setLatestMembers(members)
        setRecentConsumptions(consumptions)
        setRecentRecharges(recharges)
        setPopularPackages(packages)
      } catch (error) {
        console.error('获取仪表板数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // 格式化时间显示 - 使用dayjs精确到分钟
  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD HH:mm')
  }

  // 获取性别显示
  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男'
      case 'female':
        return '女'
      default:
        return '未知'
    }
  }

  // 获取头像颜色
  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-purple-500 to-violet-500',
      'bg-gradient-to-br from-orange-500 to-amber-500',
      'bg-gradient-to-br from-pink-500 to-rose-500',
    ]
    return colors[index % colors.length]
  }

  // 获取消费显示内容
  const getConsumptionDisplay = (consumption: RecentConsumption) => {
    // 如果有金额且金额大于0，显示金额（普通套餐）
    if (consumption.amount && consumption.amount > 0) {
      return `¥${consumption.amount}`
    }
    // 否则显示"套餐消费"
    return '套餐消费'
  }

  // 跳转到相应页面
  const navigateToPage = (page: string) => {
    router.push(`/dashboard${page}`)
  }

  // 模拟图表数据
  const revenueData = [
    { date: '01', value: 8000 },
    { date: '02', value: 9200 },
    { date: '03', value: 8800 },
    { date: '04', value: 10500 },
    { date: '05', value: 12000 },
    { date: '06', value: 11200 },
    { date: '07', value: 12800 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">仪表板</h1>
          <p className="text-muted-foreground">欢迎回来，这是您的业务概览</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option>今天</option>
            <option>本周</option>
            <option>本月</option>
            <option>本年</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            导出报表
          </Button>
        </div>
      </div>

      {/* 第一行统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  今日营收
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading
                    ? '加载中...'
                    : `¥${overview?.todayRevenue?.toLocaleString() || '0'}`}
                </p>
                <div className="flex items-center mt-3">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +12.5% 较昨日
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  本月营收
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading
                    ? '加载中...'
                    : `¥${overview?.monthlyRevenue?.toLocaleString() || '0'}`}
                </p>
                <div className="flex items-center mt-3">
                  <ArrowUpRight className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    +8.2% 较上月
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  会员总数
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading
                    ? '加载中...'
                    : overview?.totalMembers?.toLocaleString() || '0'}
                </p>
                <div className="flex items-center mt-3">
                  <ArrowUpRight className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    +15 新增
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  套餐总数
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">45</p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    5 个分类
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第二行统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950 dark:to-teal-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  今日充值
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading
                    ? '加载中...'
                    : `¥${overview?.todayRecharge?.toLocaleString() || '0'}`}
                </p>
                <div className="flex items-center mt-3">
                  <ArrowUpRight className="w-4 h-4 text-cyan-600 mr-1" />
                  <span className="text-sm text-cyan-600 font-medium">
                    +18.5% 较昨日
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  充值笔数
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">156</p>
                <div className="flex items-center mt-3">
                  <ArrowUpRight className="w-4 h-4 text-indigo-600 mr-1" />
                  <span className="text-sm text-indigo-600 font-medium">
                    +23 新增
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  平均充值
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">¥826</p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-muted-foreground">
                    单笔平均
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  会员余额
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ¥186,888
                </p>
                <div className="flex items-center mt-3">
                  <span className="text-sm text-emerald-600 font-medium">
                    总余额
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <PiggyBank className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营收趋势图 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  营收趋势
                </CardTitle>
                <CardDescription>最近7天的营收变化</CardDescription>
              </div>
              <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                <option>最近7天</option>
                <option>最近30天</option>
                <option>最近90天</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <SimpleChart
                data={revenueData}
                height={240}
                color="#10b981"
                type="line"
              />
            </div>
          </CardContent>
        </Card>

        {/* 热门套餐 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  热门套餐
                </CardTitle>
                <CardDescription>销量排行榜</CardDescription>
              </div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => navigateToPage('/packages')}
              >
                查看全部
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                // 加载状态
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-xl"></div>
                      <div>
                        <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                ))
              ) : popularPackages.length > 0 ? (
                // 真实数据
                popularPackages.map((pkg, index) => {
                  const rankColors = [
                    'bg-gradient-to-br from-green-500 to-emerald-500',
                    'bg-gradient-to-br from-blue-500 to-cyan-500',
                    'bg-gradient-to-br from-purple-500 to-violet-500',
                  ]
                  return (
                    <div
                      key={pkg.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl hover:from-muted/50 hover:to-muted/30 transition-all duration-300 hover:shadow-sm cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/packages/${pkg.id}`)
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 ${rankColors[index]} rounded-xl flex items-center justify-center shadow-md`}
                        >
                          <span className="text-sm font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {pkg.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            销量: {pkg.salesCount}
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-primary">
                        ¥{pkg.salePrice.toFixed(2)}
                      </span>
                    </div>
                  )
                })
              ) : (
                // 无数据状态
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无热门套餐数据</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新会员 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">最新会员</CardTitle>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => navigateToPage('/members')}
              >
                查看全部
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">加载中...</p>
                </div>
              ) : latestMembers.length > 0 ? (
                latestMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-sm"
                  >
                    <div
                      className={`w-10 h-10 ${getAvatarColor(index)} rounded-full flex items-center justify-center shadow-md`}
                    >
                      <span className="text-sm font-bold text-white">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getGenderDisplay(member.gender)} • {member.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(member.registrationTime)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  暂无数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 最近充值 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">最近充值</CardTitle>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => navigateToPage('/recharges')}
              >
                查看全部
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">加载中...</p>
                </div>
              ) : recentRecharges.length > 0 ? (
                recentRecharges.map((recharge, index) => (
                  <div
                    key={recharge.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full shadow-sm"></div>
                      <div>
                        <p className="font-medium text-foreground">
                          {recharge.packageName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {recharge.memberName} •{' '}
                          {getGenderDisplay(recharge.memberGender)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(recharge.rechargeTime)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      ¥{recharge.rechargeAmount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  暂无数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 最近消费 */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">最近消费</CardTitle>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => navigateToPage('/consumptions')}
              >
                查看全部
                <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">加载中...</p>
                </div>
              ) : recentConsumptions.length > 0 ? (
                recentConsumptions.map((consumption, index) => (
                  <div
                    key={consumption.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                      <div>
                        <p className="font-medium text-foreground">
                          {consumption.packageName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {consumption.customerName} •{' '}
                          {getGenderDisplay(consumption.customerGender)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(consumption.consumptionTime)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {getConsumptionDisplay(consumption)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  暂无数据
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
