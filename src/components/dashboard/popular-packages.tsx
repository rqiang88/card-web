'use client'

import { Eye, Package, Star, TrendingUp } from 'lucide-react'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api/dashboard'
import type { PopularPackage } from '@/lib/api/dashboard'

export function PopularPackages() {
  const [packages, setPackages] = useState<PopularPackage[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPopularPackages = async () => {
      try {
        setLoading(true)
        const data = await dashboardApi.getPopularPackages()
        setPackages(data)
      } catch (error) {
        console.error('获取热门套餐失败:', error)
        setPackages([])
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPackages()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      美容: 'bg-pink-100 text-pink-800',
      健身: 'bg-blue-100 text-blue-800',
      娱乐: 'bg-purple-100 text-purple-800',
      餐饮: 'bg-orange-100 text-orange-800',
      其他: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors['其他']
  }

  const getRankIcon = (index: number) => {
    const icons = [
      { icon: '🥇', color: 'text-yellow-600' },
      { icon: '🥈', color: 'text-gray-500' },
      { icon: '🥉', color: 'text-amber-600' },
    ]
    return icons[index] || { icon: `${index + 1}`, color: 'text-gray-600' }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          热门套餐
        </CardTitle>
        <button
          onClick={() => router.push('/dashboard/packages')}
          className="text-sm text-primary hover:underline flex items-center gap-1 transition-colors hover:text-primary/80"
        >
          <Eye className="w-3 h-3" />
          查看更多
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">加载中...</p>
            </div>
          ) : packages.length > 0 ? (
            packages.map((pkg, index) => {
              const rankIcon = getRankIcon(index)
              return (
                <div
                  key={pkg.id}
                  onClick={() => router.push(`/dashboard/packages/${pkg.id}`)}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        index < 3
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <span
                        className={index < 3 ? 'text-white' : rankIcon.color}
                      >
                        {index < 3 ? rankIcon.icon : index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {pkg.name}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pkg.category)}`}
                        >
                          {pkg.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          销量: {pkg.salesCount.toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(pkg.salePrice)}
                    </span>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              暂无数据
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
