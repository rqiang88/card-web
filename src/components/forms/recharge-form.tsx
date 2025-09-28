'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MemberSelector } from '@/components/ui/member-selector'
import { PackageSelector } from '@/components/ui/package-selector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMember } from '@/hooks/use-members'
import { PAYMENT_METHODS, RECHARGE_TYPES } from '@/lib/constants'
import { rechargeSchema } from '@/lib/validations'
import type { Member, Package, RechargeFormData } from '@/types'

interface RechargeFormProps {
  initialData?: Partial<RechargeFormData>
  onSubmit: (data: RechargeFormData) => Promise<void>
  loading?: boolean
}

export function RechargeForm({
  initialData,
  onSubmit,
  loading = false,
}: RechargeFormProps) {
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(
    null
  )
  const [selectedPackage, setSelectedPackage] = React.useState<Package | null>(
    null
  )

  // 如果有初始会员ID，获取会员信息
  const { member: initialMember } = useMember(initialData?.memberId || '')

  // 获取北京时间的函数
  const getBeijingTime = () => {
    const now = new Date()
    // 北京时间是UTC+8
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000)
    return beijingTime.toISOString().slice(0, 16)
  }

  const form = useForm<RechargeFormData>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      memberId: initialData?.memberId || '',
      packageId: initialData?.packageId || '',
      type: initialData?.type || 'package',
      rechargeAmount: initialData?.rechargeAmount || 0,
      rechargeAt: initialData?.rechargeAt || getBeijingTime(),
      paymentType: initialData?.paymentType || 'cash',
      state: initialData?.state || 'active',
      remark: initialData?.remark || '',
    },
  })

  const watchType = form.watch('type')

  // 当获取到初始会员信息时，自动设置选中的会员
  React.useEffect(() => {
    if (initialMember && !selectedMember) {
      setSelectedMember(initialMember)
    }
  }, [initialMember, selectedMember])

  const handleMemberSelect = (memberId: string, member: Member) => {
    setSelectedMember(member)
    form.setValue('memberId', memberId)
  }

  const handlePackageSelect = (packageId: string, packageData: Package) => {
    setSelectedPackage(packageData)
    form.setValue('packageId', String(packageId))
    // 自动填充套餐价格，优先使用 salePrice，如果没有则使用 price
    const priceToUse = packageData.salePrice || packageData.price || 0
    form.setValue('rechargeAmount', parseFloat(String(priceToUse)))
  }

  // 当充值类型改变时，清除套餐选择
  React.useEffect(() => {
    if (watchType === 'balance') {
      setSelectedPackage(null)
      form.setValue('packageId', '')
    }
  }, [watchType, form])

  const handleSubmit = async (data: RechargeFormData) => {
    try {
      const submitData: any = {
        ...data,
        // 转换ID为数字类型以匹配后端DTO
        memberId: parseInt(data.memberId),
        packageId: data.packageId ? parseInt(data.packageId) : undefined,
      }

      if (data.type === 'package' && selectedPackage) {
        // 套餐充值：同步套餐信息，优先使用 salePrice，如果没有则使用 price
        const priceToUse =
          selectedPackage.salePrice || selectedPackage.price || 0
        submitData.rechargeAmount = parseFloat(String(priceToUse))
        submitData.totalTimes = selectedPackage.totalTimes
        submitData.validityDays = selectedPackage.validDay
        submitData.packageName = selectedPackage.name
      } else if (data.type === 'balance') {
        // 余额充值：清除套餐相关字段
        submitData.packageId = undefined
        submitData.totalTimes = undefined
        submitData.validityDays = undefined
        submitData.packageName = undefined
        submitData.rechargeAmount = data.rechargeAmount
      }

      await onSubmit(submitData)

      // 如果不是编辑模式，重置表单
      if (!initialData) {
        form.reset()
        setSelectedMember(null)
        setSelectedPackage(null)
      }
    } catch (error) {
      console.error('表单提交失败:', error)
    }
  }

  // 判断是否有预设的会员（从会员详情页面进入）
  const hasPresetMember = !!initialData?.memberId

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 第一行：充值类型、支付方式、状态 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 充值类型 */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>充值类型 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择充值类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECHARGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 支付方式 */}
          <FormField
            control={form.control}
            name="paymentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>支付方式 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择支付方式" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_METHODS.filter(
                      (method) => method.value !== 'balance'
                    ).map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 状态 */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">有效</SelectItem>
                    <SelectItem value="completed">已使用</SelectItem>
                    <SelectItem value="expired">已过期</SelectItem>
                    <SelectItem value="disabled">已禁用</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 第二行：选择会员和选择套餐 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 会员选择 */}
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>选择会员 *</FormLabel>
                <FormControl>
                  {hasPresetMember ? (
                    // 如果有预设会员，显示会员信息但不允许修改
                    <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {selectedMember?.name?.charAt(0) ||
                            initialMember?.name?.charAt(0) ||
                            '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {selectedMember?.name ||
                            initialMember?.name ||
                            '加载中...'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedMember?.phone || initialMember?.phone || ''}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">当前会员</div>
                    </div>
                  ) : (
                    // 如果没有预设会员，显示会员选择器
                    <MemberSelector
                      value={field.value}
                      onValueChange={handleMemberSelect}
                      selectedMember={selectedMember}
                      placeholder="点击选择会员"
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {hasPresetMember ? '当前会员的充值记录' : '选择要充值的会员'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 套餐选择 - 仅在套餐充值时显示 */}
          {watchType === 'package' && (
            <FormField
              control={form.control}
              name="packageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择套餐 *</FormLabel>
                  <FormControl>
                    <PackageSelector
                      value={field.value}
                      onValueChange={handlePackageSelect}
                      selectedPackage={selectedPackage}
                      placeholder="点击选择套餐"
                    />
                  </FormControl>
                  <FormDescription>选择要购买的服务套餐</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* 当选择余额充值时，在右侧显示占位符以保持布局一致 */}
          {watchType === 'balance' && <div className="hidden md:block"></div>}
        </div>

        {/* 第三行：充值金额和充值时间 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 充值金额 */}
          <FormField
            control={form.control}
            name="rechargeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>充值金额（元）*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  {watchType === 'package' && selectedPackage
                    ? '已自动填充套餐价格，可手动修改'
                    : '请输入充值金额'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 充值时间 */}
          <FormField
            control={form.control}
            name="rechargeAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>充值时间 *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 备注 */}
        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入备注信息（可选）"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset()
              setSelectedMember(null)
            }}
            disabled={loading}
          >
            重置
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? '提交中...'
              : initialData
                ? '更新充值记录'
                : '创建充值记录'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
