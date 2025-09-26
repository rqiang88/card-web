"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConsumptionForm } from "@/components/forms/consumption-form";
import { RechargeForm } from "@/components/forms/recharge-form";
import { InfoCard } from "@/components/business/info-card";
import { StatsCardGrid } from "@/components/business/stats-card-grid";
import { RecordList } from "@/components/business/record-list";
import {
  Package,
  ArrowLeft,
  Edit,
  CreditCard,
  Wallet,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Phone,
  Tag,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePackage } from "@/hooks/use-packages";
import { useConsumptions, useConsumptionActions } from "@/hooks/use-consumptions";
import { useRecharges, useRechargeActions } from "@/hooks/use-recharges";
import {
  PACKAGE_CATEGORIES,
  PAYMENT_METHODS,
  RECHARGE_STATUS,
} from "@/lib/constants";
import Link from "next/link";

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;
  const { toast } = useToast();

  // 状态管理
  const [consumptionSearch, setConsumptionSearch] = React.useState("");
  const [rechargeSearch, setRechargeSearch] = React.useState("");
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] =
    React.useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = React.useState(false);

  // 获取套餐信息
  const { package: packageInfo, loading: packageLoading } = usePackage(packageId);

  // 获取套餐相关的消费记录
  const { consumptions, loading: consumptionLoading, mutate: mutateConsumptions } = useConsumptions({
    search: consumptionSearch,
    page: 1,
    limit: 50,
  });

  // 获取套餐相关的充值记录
  const { recharges, loading: rechargeLoading, mutate: mutateRecharges } = useRecharges({
    search: rechargeSearch,
    page: 1,
    limit: 50,
  });

  const { createConsumption } = useConsumptionActions();
  const { createRecharge } = useRechargeActions();

  // 获取套餐分类配置
  const getPackageCategoryConfig = (category: string) => {
    return PACKAGE_CATEGORIES.find((c) => c.value === category) || PACKAGE_CATEGORIES[0];
  };

  // 获取支付方式配置
  const getPaymentMethodConfig = (method: string) => {
    return (
      PAYMENT_METHODS.find((m) => m.value === method) || PAYMENT_METHODS[0]
    );
  };

  // 获取充值状态配置
  const getRechargeStatusConfig = (status: string) => {
    return (
      RECHARGE_STATUS.find((s) => s.value === status) || RECHARGE_STATUS[0]
    );
  };

  // 处理消费记录创建
  const handleCreateConsumption = async (data: any) => {
    try {
      await createConsumption({ ...data, packageId });
      setIsConsumptionDialogOpen(false);
      mutateConsumptions(); // 刷新消费记录

      toast({
        title: "创建成功",
        description: "消费记录已成功创建",
      });
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.response?.data?.message || "创建消费记录时发生错误，请重试",
        variant: "destructive",
      });
    }
  };

  // 处理充值记录创建
  const handleCreateRecharge = async (data: any) => {
    try {
      await createRecharge({ ...data, packageId });
      setIsRechargeDialogOpen(false);
      mutateRecharges(); // 刷新充值记录

      toast({
        title: "创建成功",
        description: "充值记录已成功创建",
      });
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.response?.data?.message || "创建充值记录时发生错误，请重试",
        variant: "destructive",
      });
    }
  };

  if (packageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
    );
  }

  const categoryConfig = getPackageCategoryConfig(packageInfo.category);

  // 准备套餐信息数据
  const packageInfoItems = [
    {
      label: "套餐分类",
      value: categoryConfig.label,
      icon: Tag,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      label: "会员价",
      value: `¥${packageInfo.memberPrice?.toLocaleString() || packageInfo.price?.toLocaleString() || 0}`,
      icon: DollarSign,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-100",
    },
    {
      label: "销售价格",
      value: `¥${packageInfo.salePrice?.toLocaleString() || packageInfo.price?.toLocaleString() || 0}`,
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600 text-lg",
    },
    {
      label: packageInfo.packType === "times" ? "使用次数" : "有效期",
      value: packageInfo.packType === "times" ? `${packageInfo.totalTimes || 0}次` : `${packageInfo.validDay || 0}天`,
      icon: packageInfo.packType === "times" ? Users : Calendar,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
    },
  ];

  // 准备统计数据
  const statsData = [
    {
      title: "总销售额",
      value: `¥${recharges.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      subtitle: `共 ${recharges.length} 笔充值`,
      icon: TrendingUp,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      valueColor: "text-green-600",
    },
    {
      title: "总消费额",
      value: `¥${consumptions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}`,
      subtitle: `共 ${consumptions.length} 笔消费`,
      icon: CreditCard,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      valueColor: "text-red-600",
    },
    {
      title: "购买用户",
      value: new Set(recharges.map(r => r.memberId)).size,
      subtitle: "不重复用户数",
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      valueColor: "text-blue-600",
    },
    {
      title: "剩余次数",
      value: recharges.filter(r => r.type === 'package').reduce((sum, r) => sum + (r.remainingTimes || 0), 0),
      subtitle: "总剩余使用次数",
      icon: Clock,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      valueColor: "text-purple-600",
    },
  ];

  // 准备消费记录数据
  const consumptionRecords = consumptions.map((consumption) => {
    const paymentConfig = getPaymentMethodConfig(consumption.paymentMethod);
    return {
      id: consumption.id,
      title: consumption.description || "消费",
      subtitle: consumption.operatorName || "未知操作员",
      amount: consumption.amount,
      createdAt: consumption.createdAt,
      badges: [
        {
          label: `${paymentConfig.icon} ${paymentConfig.label}`,
          color: "bg-blue-100 text-blue-800",
        },
      ],
    };
  });

  // 准备充值记录数据
  const rechargeRecords = recharges.map((recharge) => {
    const paymentConfig = getPaymentMethodConfig(recharge.paymentMethod);
    const statusConfig = getRechargeStatusConfig(recharge.status);
    return {
      id: String(recharge.id),
      title: recharge.type === "package" ? recharge.packageName || packageInfo.name : "余额充值",
      subtitle: recharge.operatorName || "未知操作员",
      amount: recharge.amount,
      createdAt: recharge.createdAt,
      status: {
        label: statusConfig.label,
        color: statusConfig.color,
      },
      badges: [
        {
          label: `${paymentConfig.icon} ${paymentConfig.label}`,
          color: "bg-blue-100 text-blue-800",
        },
      ],
      extraInfo: recharge.type === "package" && recharge.remainingTimes
        ? `剩余: ${recharge.remainingTimes}/${recharge.totalTimes} • 到期: ${recharge.expiryDate}`
        : undefined,
    };
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/packages">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">套餐详情</h1>
            <p className="text-gray-600">查看和管理套餐的详细信息</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          编辑套餐
        </Button>
      </div>

      {/* 套餐基本信息卡片 */}
      <InfoCard
        title={packageInfo.name}
        subtitle={`套餐ID: ${packageInfo.id}`}
        avatar={{
          icon: Package,
          bgColor: "bg-gradient-to-br from-primary/20 to-primary/10",
          iconColor: "text-primary",
        }}
        badge={{
          label: categoryConfig.label,
          color: categoryConfig.color,
        }}
        infoItems={packageInfoItems}
      />

      {/* 统计数据卡片 */}
      <StatsCardGrid stats={statsData} />

      {/* 标签页内容 */}
      <Tabs defaultValue="recharge" className="space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted p-1 rounded-lg">
            <TabsTrigger value="recharge" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Wallet className="w-4 h-4" />
              <span>充值记录</span>
            </TabsTrigger>
            <TabsTrigger value="consumption" className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CreditCard className="w-4 h-4" />
              <span>消费记录</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 充值记录标签页 */}
        <TabsContent value="recharge" className="space-y-6">
          <Card className="shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">充值记录</CardTitle>
                    <CardDescription className="text-muted-foreground">查看该套餐的所有充值记录</CardDescription>
                  </div>
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
            </CardHeader>
            <CardContent>
              <RecordList
                records={rechargeRecords}
                searchValue={rechargeSearch}
                onSearchChange={setRechargeSearch}
                searchPlaceholder="搜索充值记录..."
                emptyTitle="充值记录"
                emptyDescription="该套餐暂无充值记录"
                icon={Wallet}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
                amountColor="text-green-600"
                amountPrefix="+"
                borderColor="border-l-4 border-l-green-500"
                focusRingColor="focus:ring-green-500 focus:border-green-500"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 消费记录标签页 */}
        <TabsContent value="consumption" className="space-y-6">
          <Card className="shadow-sm border-0 bg-gradient-to-r from-red-50 to-orange-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">消费记录</CardTitle>
                    <CardDescription className="text-muted-foreground">查看该套餐的所有消费记录</CardDescription>
                  </div>
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
                        description: `使用套餐：${packageInfo.name}`,
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <RecordList
                records={consumptionRecords}
                searchValue={consumptionSearch}
                onSearchChange={setConsumptionSearch}
                searchPlaceholder="搜索消费记录..."
                emptyTitle="消费记录"
                emptyDescription="该套餐暂无消费记录"
                icon={CreditCard}
                iconColor="text-red-600"
                iconBgColor="bg-red-100"
                amountColor="text-red-600"
                amountPrefix="-"
                borderColor="border-l-4 border-l-red-500"
                focusRingColor="focus:ring-red-500 focus:border-red-500"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}