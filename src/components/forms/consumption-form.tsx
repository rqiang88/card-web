"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MemberSelector } from "@/components/ui/member-selector"
import { RechargeSelector } from "@/components/ui/recharge-selector"
import { consumptionSchema, type ConsumptionFormData } from "@/lib/validations"
import { consumptionApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Member, Recharge } from "@/types"

interface ConsumptionFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  onSubmit?: (data: ConsumptionFormData) => Promise<void>
  initialData?: {
    memberId?: number
    memberName?: string
    remark?: string
  }
}

export function ConsumptionForm({ onSuccess, onCancel, onSubmit, initialData }: ConsumptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedRecharge, setSelectedRecharge] = useState<Recharge | null>(null)
  const { toast } = useToast()
// 获取当前本地时间的函数
const getCurrentDateTime = () => {
  const now = new Date()
  // 获取本地时间偏移量（分钟）
  const timezoneOffset = now.getTimezoneOffset()
  // 创建本地时间的Date对象
  const localTime = new Date(now.getTime() - (timezoneOffset * 60000))
  // 返回本地时间的ISO字符串格式（去掉秒和毫秒部分）
  return localTime.toISOString().slice(0, 16)
}

  const form = useForm<ConsumptionFormData>({
    resolver: zodResolver(consumptionSchema),
    defaultValues: {
      memberId: initialData?.memberId || 0,
      rechargeId: 0,
      packageId: 0,
      consumptionAt: getCurrentDateTime(), // 默认为当前时间
      remark: initialData?.remark || "",
    },
  })

  // 处理预填充的会员信息
  useEffect(() => {
    if (initialData?.memberId && initialData?.memberName) {
      const member: Member = {
        id: String(initialData.memberId),
        name: initialData.memberName,
        phone: "",
        email: undefined,
        gender: "male",
        birthday: undefined,
        state: "active",
        balance: 0,
        points: 0,
        registerAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setSelectedMember(member)
      form.setValue("memberId", initialData.memberId)
    }
  }, [initialData, form])

  const handleFormSubmit = async (data: ConsumptionFormData) => {
    try {
      setIsLoading(true)
      
      // 如果有自定义的 onSubmit 处理函数，使用它
      if (onSubmit) {
        await onSubmit(data)
        form.reset({
          memberId: 0,
          rechargeId: 0,
          packageId: 0,
          consumptionAt: getCurrentDateTime(), // 重置时使用最新的当前时间
          remark: "",
        })
        setSelectedMember(null)
        setSelectedRecharge(null)
        onSuccess?.()
        return
      }
      
      // 转换数据格式以匹配后端API
      const submitData = {
        memberId: data.memberId || undefined,
        customerName: selectedMember?.name || data.memberName || "",
        rechargeId: data.rechargeId || undefined,
        packageId: data.packageId || undefined,
        remark: data.remark,
        state: "completed",
        consumptionAt: data.consumptionAt ? new Date(data.consumptionAt).toISOString() : new Date().toISOString(),
      }

      await consumptionApi.createConsumption(submitData)
      
      toast({
        title: "成功",
        description: "消费记录创建成功",
      })
      
      form.reset({
        memberId: 0,
        rechargeId: 0,
        packageId: 0,
        consumptionAt: getCurrentDateTime(), // 重置时使用最新的当前时间
        remark: "",
      })
      setSelectedMember(null)
      setSelectedRecharge(null)
      onSuccess?.()
    } catch (error) {
      console.error("创建消费记录失败:", error)
      toast({
        title: "错误",
        description: "创建消费记录失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理会员选择
  const handleMemberSelect = (memberId: string, member: Member) => {
    setSelectedMember(member)
    form.setValue("memberId", parseInt(memberId))
    // 清空充值记录选择
    setSelectedRecharge(null)
    form.setValue("rechargeId", 0)
  }

  // 处理充值记录选择
  const handleRechargeSelect = (rechargeId: string, recharge: Recharge) => {
    setSelectedRecharge(recharge)
    form.setValue("rechargeId", parseInt(rechargeId))
    // 根据充值记录自动设置packageId
    if (recharge.packageId) {
      form.setValue("packageId", parseInt(String(recharge.packageId)))
    } else {
      form.setValue("packageId", 0)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>选择会员</FormLabel>
              <FormControl>
                <MemberSelector
                  value={String(field.value)}
                  onValueChange={handleMemberSelect}
                  selectedMember={selectedMember}
                  placeholder="请选择会员"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rechargeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>选择充值记录</FormLabel>
              <FormControl>
                <RechargeSelector
                  value={String(field.value)}
                  onValueChange={handleRechargeSelect}
                  memberId={selectedMember?.id}
                  placeholder="请选择充值记录"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consumptionAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>消费时间</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>消费备注</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入消费备注（可选）"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "创建中..." : "创建消费记录"}
          </Button>
        </div>
      </form>
    </Form>
  )
}