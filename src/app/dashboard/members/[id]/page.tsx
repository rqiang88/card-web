"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
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
import { Badge } from "@/components/ui/badge";

import { ConsumptionForm } from "@/components/forms/consumption-form";
import { RechargeForm } from "@/components/forms/recharge-form";
import {
  User,
  Phone,
  Calendar,
  CreditCard,
  Wallet,
  Plus,
  Search,
  FileText,
  UserCheck,
  TrendingUp,
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMember } from "@/hooks/use-members";
import { useConsumptions, useConsumptionActions } from "@/hooks/use-consumptions";
import { useRecharges, useRechargeActions } from "@/hooks/use-recharges";
import { RechargeRecordList } from "@/components/business/recharge-record-list";
import { ConsumptionRecordList } from "@/components/business/consumption-record-list";
import {
  MEMBER_STATUS,
  PAYMENT_METHODS,
  RECHARGE_STATUS,
} from "@/lib/constants";
import dayjs from "dayjs";

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = params.id as string;
  const { toast } = useToast();

  // 状态管理
  const [consumptionSearch, setConsumptionSearch] = React.useState("");
  const [rechargeSearch, setRechargeSearch] = React.useState("");
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] =
    React.useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = React.useState(false);

  // 获取会员信息
  const { member, loading: memberLoading } = useMember(memberId);

  // 获取会员的消费记录
  const { consumptions, loading: consumptionLoading, mutate: mutateConsumptions } = useConsumptions({
    memberId,
    search: consumptionSearch,
    page: 1,
    limit: 50,
  });

  // 获取会员的充值记录
  const { recharges, loading: rechargeLoading, mutate: mutateRecharges } = useRecharges({
    memberId,
    search: rechargeSearch,
    page: 1,
    limit: 50,
  });

  const { createConsumption, deleteConsumption } = useConsumptionActions();
  const { createRecharge, deleteRecharge } = useRechargeActions();

  // 获取会员状态配置
  const getStatusConfig = (status: string) => {
    return MEMBER_STATUS.find(s => s.value === status) || MEMBER_STATUS[0];
  };

  // 获取性别显示
  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男';
      case 'female':
        return '女';
      default:
        return '未知';
    }
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
      id: String(recharge.id), // 确保 id 是字符串类型
      rechargeAmount: recharge.rechargeAmount,
      packageName: recharge.packageName,
      remainingTimes: recharge.remainingTimes,
      totalTimes: recharge.totalTimes,
      expiryDate: recharge.endDate,
      rechargeAt: recharge.rechargeAt || new Date().toISOString(),
      status: {
        label: statusConfig.label,
        color: statusConfig.color,
      },
      paymentMethod: {
        label: paymentConfig.label,
        icon: paymentConfig.icon,
        color: "bg-blue-100 text-blue-800",
      },
      type: recharge.type as "balance" | "package",
    };
  });

  // 处理消费记录创建
  const handleCreateConsumption = async (data: any) => {
    try {
      await createConsumption({ ...data, memberId });
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
      await createRecharge({ ...data, memberId });
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

  // 处理充值记录删除
  const handleDeleteRecharge = async (rechargeId: string) => {
    if (!confirm("确定要删除这条充值记录吗？此操作不可恢复。")) {
      return;
    }

    try {
      await deleteRecharge(rechargeId);
      mutateRecharges(); // 刷新充值记录

      toast({
        title: "删除成功",
        description: "充值记录已成功删除",
      });
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.response?.data?.message || "删除充值记录时发生错误，请重试",
        variant: "destructive",
      });
    }
  };



  // 处理消费记录删除
  const handleDeleteConsumption = async (consumptionId: string) => {
    if (!confirm("确定要删除这条消费记录吗？此操作不可恢复。")) {
      return;
    }

    try {
      await deleteConsumption(consumptionId);
      mutateConsumptions(); // 刷新消费记录

      toast({
        title: "删除成功",
        description: "消费记录已成功删除",
      });
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.response?.data?.message || "删除消费记录时发生错误，请重试",
        variant: "destructive",
      });
    }
  };

  if (memberLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">会员不存在</h3>
          <p className="text-gray-500 mt-2">未找到指定的会员信息</p>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const totalRechargeAmount = (recharges || []).reduce((sum, r) => sum + r.rechargeAmount, 0);
  const rechargeCount = (recharges || []).length;
  const consumptionCount = (consumptions || []).length;

  const statusConfig = getStatusConfig(member.state);

  return (
    <div className="space-y-8">
      {/* 会员信息卡片 */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center border border-slate-200">
              <User className="w-8 h-8 text-slate-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{member.name}</h1>
              {member.remark && (
                <p className="text-slate-600 text-sm bg-slate-100 px-3 py-1 rounded-full inline-block mt-2">
                  {member.remark}
                </p>
              )}
            </div>
            <Badge 
              className={`${statusConfig.color} border-0 shadow-sm`}
            >
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 电话号码 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Phone className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">电话号码</p>
                <p className="font-medium text-slate-700">{member.phone}</p>
              </div>
            </div>

            {/* 性别 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">性别</p>
                <p className="font-medium text-slate-700">{getGenderDisplay(member.gender)}</p>
              </div>
            </div>

            {/* 出生日期 */}
            {member.birthday && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center border border-pink-100">
                  <Calendar className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">出生日期</p>
                  <p className="font-medium text-slate-700">{dayjs(member.birthday).format('YYYY-MM-DD')}</p>
                </div>
              </div>
            )}

            {/* 登记日期 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500">登记日期</p>
                <p className="font-medium text-slate-700">
                  {member.registerAt ? dayjs(member.registerAt).format('YYYY-MM-DD') : '未知'}
                </p>
              </div>
            </div>

            {/* 状态 */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                member.state === 'active'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-red-50 border-red-100'
              }`}>
                <UserCheck className={`w-5 h-5 ${
                  member.state === 'active' ? 'text-emerald-500' : 'text-red-500'
                }`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">会员状态</p>
                <p className={`font-medium ${
                  member.state === 'active' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {statusConfig.label}
                </p>
              </div>
            </div>


          </div>
        </CardContent>
      </Card>

      {/* 统计数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 充值总金额 */}
        <Card className="border-emerald-100 bg-emerald-50/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                <Wallet className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">充值总金额</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ¥{totalRechargeAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 充值笔数 */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                <Hash className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">充值笔数</p>
                <p className="text-2xl font-bold text-blue-600">{rechargeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 消费笔数 */}
        <Card className="border-rose-100 bg-rose-50/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100">
                <TrendingUp className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500">消费笔数</p>
                <p className="text-2xl font-bold text-rose-600">{consumptionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  <p className="text-sm text-gray-500">查看会员的所有充值记录</p>
                </div>
                <Dialog
                  open={isRechargeDialogOpen}
                  onOpenChange={setIsRechargeDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      新增充值
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>新增充值记录</DialogTitle>
                      <DialogDescription>
                        为会员创建新的充值记录
                      </DialogDescription>
                    </DialogHeader>
                    <RechargeForm
                      onSubmit={handleCreateRecharge}
                      initialData={{ memberId: String(member.id) }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <RechargeRecordList
                records={rechargeRecords}
                searchValue={rechargeSearch}
                onSearchChange={setRechargeSearch}
                onDelete={handleDeleteRecharge}
              />
            </CardContent>
          </TabsContent>

          {/* 消费记录标签页 */}
          <TabsContent value="consumption" className="mt-0">
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">消费记录</h3>
                  <p className="text-sm text-gray-500">查看会员的所有消费记录</p>
                </div>
                <Dialog
                  open={isConsumptionDialogOpen}
                  onOpenChange={setIsConsumptionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      新增消费
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>新增消费记录</DialogTitle>
                      <DialogDescription>
                        为会员创建新的消费记录
                      </DialogDescription>
                    </DialogHeader>
                    <ConsumptionForm
                      onSubmit={handleCreateConsumption}
                      initialData={{
                        memberId: Number(member.id),
                        memberName: member.name,
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <ConsumptionRecordList
                records={consumptions}
                onDelete={handleDeleteConsumption}
              />
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
