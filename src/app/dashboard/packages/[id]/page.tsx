'use client'

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

import React from 'react'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { ConsumptionRecordList } from '@/components/business/consumption-record-list'
import { InfoCard } from '@/components/business/info-card'
import { PackageRechargeRecordList } from '@/components/business/package-recharge-record-list'
import { StatsCardGrid } from '@/components/business/stats-card-grid'
import { ConsumptionForm } from '@/components/forms/consumption-form'
import { RechargeForm } from '@/components/forms/recharge-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useConsumptionActions,
  useConsumptions,
} from '@/hooks/use-consumptions'
import { usePackage } from '@/hooks/use-packages'
import { useRechargeActions, useRecharges } from '@/hooks/use-recharges'
import { useToast } from '@/hooks/use-toast'
import {
  PACKAGE_CATEGORIES,
  PACKAGE_STATUS,
  PACKAGE_TYPES,
  PAYMENT_METHODS,
  RECHARGE_STATUS,
} from '@/lib/constants'

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const packageId = params.id as string
  const { toast } = useToast()

  // 状态管理
  const [consumptionSearch, setConsumptionSearch] = React.useState('')
  const [rechargeSearch, setRechargeSearch] = React.useState('')
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] =
    React.useState(false)
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = React.useState(false)

  // 获取套餐信息
  const { package: packageInfo, loading: packageLoading } =
    usePackage(packageId)

  // 获取套餐相关的消费记录
  const {
    consumptions,
    loading: consumptionLoading,
    mutate: mutateConsumptions,
  } = useConsumptions({
    search: consumptionSearch,
    packageId: packageId, // 添加packageId过滤
    page: 1,
    limit: 50,
  })

  // 获取套餐相关的充值记录
  const {
    recharges,
    loading: rechargeLoading,
    mutate: mutateRecharges,
  } = useRecharges({
    search: rechargeSearch,
    packageId: packageId, // 添加packageId搜索
    page: 1,
    limit: 50,
  })

  const { createConsumption } = useConsumptionActions()
  const { createRecharge, deleteRecharge } = useRechargeActions()

  // 获取套餐分类配置
  const getPackageCategoryConfig = (category: string) => {
    return (
      PACKAGE_CATEGORIES.find((c) => c.value === category) ||
      PACKAGE_CATEGORIES[0]
    )
  }

  // 获取套餐类型配置
  const getPackageTypeConfig = (packType: string) => {
    return PACKAGE_TYPES.find((t) => t.value === packType) || PACKAGE_TYPES[0]
  }

  // 获取套餐状态配置
  const getPackageStatusConfig = (status: string) => {
    return PACKAGE_STATUS.find((s) => s.value === status) || PACKAGE_STATUS[0]
  }

  // 获取支付方式配置
  const getPaymentMethodConfig = (method: string) => {
    return PAYMENT_METHODS.find((m) => m.value === method) || PAYMENT_METHODS[0]
  }

  // 获取充值状态配置
  const getRechargeStatusConfig = (status: string) => {
    return RECHARGE_STATUS.find((s) => s.value === status) || RECHARGE_STATUS[0]
  }

  // 处理消费记录创建
  const handleCreateConsumption = async (data: any) => {
    try {
      await createConsumption({ ...data, packageId })
      setIsConsumptionDialogOpen(false)
      mutateConsumptions() // 刷新消费记录

      toast({
        title: '创建成功',
        description: '消费记录已成功创建',
      })
    } catch (error: any) {
      toast({
        title: '创建失败',
        description:
          error.response?.data?.message || '创建消费记录时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 处理充值记录创建
  const handleCreateRecharge = async (data: any) => {
    try {
      await createRecharge({ ...data, packageId })
      setIsRechargeDialogOpen(false)
      mutateRecharges() // 刷新充值记录

      toast({
        title: '创建成功',
        description: '充值记录已成功创建',
      })
    } catch (error: any) {
      toast({
        title: '创建失败',
        description:
          error.response?.data?.message || '创建充值记录时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 处理充值记录删除
  const handleDeleteRecharge = async (record: any) => {
    try {
      await deleteRecharge(record.id)
      mutateRecharges() // 刷新充值记录

      toast({
        title: '删除成功',
        description: '充值记录已成功删除',
      })
    } catch (error: any) {
      toast({
        title: '删除失败',
        description:
          error.response?.data?.message || '删除充值记录时发生错误，请重试',
        variant: 'destructive',
      })
    }
  }

  // 处理查看充值记录详情
  const handleViewRechargeDetail = (record: any) => {
    router.push(`/dashboard/recharges/${record.id}`)
  }

  if (packageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!packageInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">套餐不存在</h3>
          <p className="text-gray-500 mt-2">未找到指定的套餐信息</p>
          <Link href="/dashboard/packages">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回套餐列表
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const categoryConfig = getPackageCategoryConfig(packageInfo.category)
  const typeConfig = getPackageTypeConfig(packageInfo.packType)
  const statusConfig = getPackageStatusConfig(packageInfo.state || 'active')

  // 准备套餐信息数据
  const packageInfoItems = [
    {
      label: '套餐类型',
      value: typeConfig.label,
      icon: Package,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
    },
    {
      label: '套餐状态',
      value: statusConfig.label,
      icon: CheckCircle,
      iconColor:
        statusConfig.value === 'active' ? 'text-green-600' : 'text-gray-600',
      iconBgColor:
        statusConfig.value === 'active' ? 'bg-green-100' : 'bg-gray-100',
    },
    {
      label: '销售价格',
      value: `¥${packageInfo.salePrice?.toLocaleString() || packageInfo.price?.toLocaleString() || 0}`,
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      valueColor: 'text-green-600 text-lg',
    },
    // 普通套餐只显示使用次数，其他套餐根据类型显示使用次数或有效期
    ...(packageInfo.packType === 'normal'
      ? [
          {
            label: '使用次数',
            value: `${packageInfo.totalTimes || 1}次`,
            icon: Users,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
          },
        ]
      : packageInfo.packType === 'times'
        ? [
            {
              label: '使用次数',
              value: `${packageInfo.totalTimes || 0}次`,
              icon: Users,
              iconColor: 'text-purple-600',
              iconBgColor: 'bg-purple-100',
            },
            {
              label: '有效期',
              value: `${packageInfo.validDay || 0}天`,
              icon: Calendar,
              iconColor: 'text-orange-600',
              iconBgColor: 'bg-orange-100',
            },
          ]
        : [
            {
              label: '有效期',
              value: `${packageInfo.validDay || 0}天`,
              icon: Calendar,
              iconColor: 'text-orange-600',
              iconBgColor: 'bg-orange-100',
            },
          ]),
  ]

  // 准备统计数据
  const statsData = [
    {
      title: '总销售额',
      value: `¥${recharges.reduce((sum, r) => sum + (r.rechargeAmount || 0), 0).toLocaleString()}`,
      subtitle: `共 ${recharges.length} 笔充值`,
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      valueColor: 'text-green-600',
    },
    {
      title: '充值次数',
      value: recharges.length.toString(),
      subtitle: '总充值笔数',
      icon: Wallet,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      valueColor: 'text-blue-600',
    },
    {
      title: '消费次数',
      value: consumptions.length.toString(),
      subtitle: '总消费笔数',
      icon: CreditCard,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      valueColor: 'text-purple-600',
    },
  ]

  // 准备消费记录数据
  const consumptionRecords = consumptions.map((consumption) => {
    const paymentConfig = getPaymentMethodConfig(consumption.paymentMethod)
    return {
      id: consumption.id,
      title: consumption.description || '消费',
      subtitle: consumption.operatorName || '未知操作员',
      amount: consumption.amount,
      createdAt: consumption.createdAt,
      badges: [
        {
          label: `${paymentConfig.icon} ${paymentConfig.label}`,
          color: 'bg-blue-100 text-blue-800',
        },
      ],
    }
  })

  // 准备充值记录数据
  const rechargeRecords =
    recharges?.map((recharge: any) => {
      const paymentConfig = getPaymentMethodConfig(recharge.paymentType)
      const statusConfig = getRechargeStatusConfig(recharge.state || '')
      return {
        id: String(recharge.id),
        title:
          recharge.type === 'package'
            ? recharge.packageName || packageInfo.name
            : '余额充值',
        subtitle: recharge.operatorName || '未知操作员',
        amount: recharge.rechargeAmount, // 修复：使用rechargeAmount而不是amount
        createdAt: recharge.rechargeAt || recharge.createdAt,
        status: {
          label: statusConfig.label,
          color: statusConfig.color,
        },
        badges: [
          {
            label: `${paymentConfig.icon} ${paymentConfig.label}`,
            color: 'bg-blue-100 text-blue-800',
          },
        ],
        extraInfo:
          recharge.type === 'package' && recharge.remainingTimes
            ? `剩余: ${recharge.remainingTimes}/${recharge.totalTimes} • 到期: ${recharge.expiryDate}`
            : undefined,
      }
    }) || []

  return (
    <div className="space-y-6">
      {/* 套餐基本信息卡片 */}
      <InfoCard
        title={packageInfo.name}
        subtitle={packageInfo.description || '备注'}
        avatar={{
          icon: Package,
          bgColor: 'bg-gradient-to-br from-primary/20 to-primary/10',
          iconColor: 'text-primary',
        }}
        infoItems={packageInfoItems}
      />

      {/* 统计数据卡片 */}
      <StatsCardGrid stats={statsData} />

      {/* 标签页内容 */}
      <Card>
        <Tabs defaultValue="recharge" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger
                value="recharge"
                className="flex items-center space-x-2 text-base font-medium"
              >
                <Wallet className="w-5 h-5" />
                <span>充值记录</span>
              </TabsTrigger>
              <TabsTrigger
                value="consumption"
                className="flex items-center space-x-2 text-base font-medium"
              >
                <CreditCard className="w-5 h-5" />
                <span>消费记录</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          {/* 充值记录标签页 */}
          <TabsContent value="recharge" className="mt-0">
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">充值记录</h3>
                  <p className="text-sm text-gray-500">
                    查看该套餐的所有充值记录
                  </p>
                </div>
                <Dialog
                  open={isRechargeDialogOpen}
                  onOpenChange={setIsRechargeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      新增充值
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>新增充值记录</DialogTitle>
                      <DialogDescription>
                        为该套餐创建新的充值记录
                      </DialogDescription>
                    </DialogHeader>
                    <RechargeForm
                      onSubmit={handleCreateRecharge}
                      initialData={{ packageId: packageInfo.id }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <PackageRechargeRecordList
                records={recharges.map((recharge) => ({
                  id: recharge.id.toString(),
                  rechargeAmount: recharge.rechargeAmount,
                  member: {
                    id: recharge.member?.id || recharge.memberId || '',
                    name:
                      recharge.member?.name ||
                      recharge.memberName ||
                      '未知用户',
                    phone: recharge.member?.phone || '',
                    gender: recharge.member?.gender,
                  },
                  remainingTimes: recharge.remainingTimes || 0,
                  totalTimes: recharge.totalTimes || 0,
                  expiryDate: recharge.expiryDate || recharge.endDate || '',
                  rechargeAt: recharge.rechargeAt || recharge.createdAt || '',
                  status: {
                    label:
                      (recharge.remainingTimes || 0) > 0
                        ? '有效'
                        : (recharge.remainingTimes || 0) === 0
                          ? '已使用'
                          : recharge.expiryDate &&
                              new Date(recharge.expiryDate) < new Date()
                            ? '已过期'
                            : '已禁用',
                    color:
                      (recharge.remainingTimes || 0) > 0
                        ? 'bg-green-100 text-green-800'
                        : (recharge.remainingTimes || 0) === 0
                          ? 'bg-gray-100 text-gray-800'
                          : recharge.expiryDate &&
                              new Date(recharge.expiryDate) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800',
                  },
                  paymentMethod: {
                    label:
                      recharge.paymentMethod === 'cash'
                        ? '现金'
                        : recharge.paymentMethod === 'card'
                          ? '刷卡'
                          : recharge.paymentMethod === 'wechat'
                            ? '微信'
                            : recharge.paymentMethod === 'alipay'
                              ? '支付宝'
                              : '其他',
                    icon:
                      recharge.paymentMethod === 'cash'
                        ? '💰'
                        : recharge.paymentMethod === 'card'
                          ? '💳'
                          : recharge.paymentMethod === 'wechat'
                            ? '💚'
                            : recharge.paymentMethod === 'alipay'
                              ? '🔵'
                              : '💳',
                    color: 'bg-blue-100 text-blue-800',
                  },
                }))}
                searchValue={rechargeSearch}
                onSearchChange={setRechargeSearch}
                onDelete={handleDeleteRecharge}
                onViewDetail={handleViewRechargeDetail}
              />
            </CardContent>
          </TabsContent>

          {/* 消费记录标签页 */}
          <TabsContent value="consumption" className="mt-0">
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">消费记录</h3>
                  <p className="text-sm text-gray-500">
                    查看该套餐的所有消费记录
                  </p>
                </div>
                <Dialog
                  open={isConsumptionDialogOpen}
                  onOpenChange={setIsConsumptionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      新增消费
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>新增消费记录</DialogTitle>
                      <DialogDescription>
                        为该套餐创建新的消费记录
                      </DialogDescription>
                    </DialogHeader>
                    <ConsumptionForm
                      onSubmit={handleCreateConsumption}
                      initialData={{
                        remark: `使用套餐：${packageInfo.name}`,
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <ConsumptionRecordList
                records={consumptions.map((consumption) => ({
                  id: consumption.id,
                  packageName:
                    consumption.packageName || packageInfo?.name || '未知套餐',
                  amount: consumption.amount,
                  paymentMethod: consumption.paymentMethod,
                  consumptionAt: consumption.consumptionAt,
                  memberName: consumption.memberName,
                  memberPhone: consumption.memberPhone,
                  memberGender: consumption.memberGender,
                  rechargeInfo: consumption.rechargeInfo,
                }))}
                onDelete={(id) => {
                  console.log('删除消费记录:', id)
                }}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
