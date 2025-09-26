"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SimpleChart } from '@/components/charts/simple-chart'
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Wallet,
  Receipt,
  Calculator,
  PiggyBank,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

export default function DashboardPage() {
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
        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日营收</p>
                <p className="text-3xl font-bold text-foreground">¥8,888</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12.5% 较昨日</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">本月营收</p>
                <p className="text-3xl font-bold text-foreground">¥88,888</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">+8.2% 较上月</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">会员总数</p>
                <p className="text-3xl font-bold text-foreground">1,234</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">+15 新增</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">套餐总数</p>
                <p className="text-3xl font-bold text-foreground">45</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">5 个分类</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 第二行统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950 dark:to-teal-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日充值</p>
                <p className="text-3xl font-bold text-foreground">¥12,888</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-cyan-600 mr-1" />
                  <span className="text-sm text-cyan-600 font-medium">+18.5% 较昨日</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">充值笔数</p>
                <p className="text-3xl font-bold text-foreground">156</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-indigo-600 mr-1" />
                  <span className="text-sm text-indigo-600 font-medium">+23 新增</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Receipt className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均充值</p>
                <p className="text-3xl font-bold text-foreground">¥826</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-muted-foreground">单笔平均</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">会员余额</p>
                <p className="text-3xl font-bold text-foreground">¥186,888</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-emerald-600 font-medium">总余额</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <PiggyBank className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 营收趋势图 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">营收趋势</CardTitle>
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">热门套餐</CardTitle>
                <CardDescription>销量排行榜</CardDescription>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">健身套餐A</p>
                    <p className="text-sm text-muted-foreground">销量: 156</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">¥299</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">美容套餐B</p>
                    <p className="text-sm text-muted-foreground">销量: 128</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">¥599</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">娱乐套餐C</p>
                    <p className="text-sm text-muted-foreground">销量: 95</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-primary">¥199</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新会员 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最新会员</CardTitle>
              <Button variant="ghost" className="text-green-600 hover:text-green-700">
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">张</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">张三</p>
                  <p className="text-sm text-gray-500">VIP会员 • 2小时前加入</p>
                </div>
                <span className="text-sm text-green-600">¥1,299</span>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">李</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">李四</p>
                  <p className="text-sm text-gray-500">普通会员 • 5小时前加入</p>
                </div>
                <span className="text-sm text-green-600">¥599</span>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">王</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">王五</p>
                  <p className="text-sm text-gray-500">钻石会员 • 1天前加入</p>
                </div>
                <span className="text-sm text-green-600">¥2,999</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 最近消费 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近消费</CardTitle>
              <Button variant="ghost" className="text-green-600 hover:text-green-700">
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">健身套餐A</p>
                    <p className="text-sm text-gray-500">张三 • 30分钟前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥299</span>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">美容套餐B</p>
                    <p className="text-sm text-gray-500">李四 • 1小时前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥599</span>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">娱乐套餐C</p>
                    <p className="text-sm text-gray-500">王五 • 2小时前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥199</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 最近充值 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近充值</CardTitle>
              <Button variant="ghost" className="text-green-600 hover:text-green-700">
                查看全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">余额充值</p>
                    <p className="text-sm text-gray-500">张三 • 1小时前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥1,000</span>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">套餐充值</p>
                    <p className="text-sm text-gray-500">李四 • 2小时前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥599</span>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">余额充值</p>
                    <p className="text-sm text-gray-500">王五 • 3小时前</p>
                  </div>
                </div>
                <span className="text-sm font-bold">¥2,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
