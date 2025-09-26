"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { packageSchema } from "@/lib/validations";
import { PACKAGE_CATEGORIES, PACKAGE_TYPES } from "@/lib/constants";
import type { PackageFormData } from "@/types";

interface PackageFormProps {
  initialData?: Partial<PackageFormData>;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export function PackageForm({
  initialData,
  onSubmit,
  loading = false,
}: PackageFormProps) {
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      packType: initialData?.packType || "times",
      category: initialData?.category,
      price: initialData?.price,
      salePrice: initialData?.salePrice || 0,
      totalTimes: initialData?.totalTimes || 10,
      validDay: initialData?.validDay || 365,
      state: initialData?.state || "saling",
    },
  });

  const watchType = form.watch("packType");

  const handleSubmit = async (data: PackageFormData) => {
    try {
      // 转换数据格式以匹配后端DTO
      const submitData = {
        name: data.name,
        description: data.description,
        packType: data.packType,
        ...(data.category && { category: data.category }),
        ...(data.price && { price: data.price }), // 原价
        salePrice: data.salePrice, // 现价/售价
        totalTimes: data.packType === "times" ? data.totalTimes : undefined,
        validDay: data.validDay, // 有效天数
        state: data.state, // 状态
      };

      await onSubmit(submitData);

      // 如果不是编辑模式，重置表单
      if (!initialData) {
        form.reset();
      }
    } catch (error) {
      console.error("表单提交失败:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* 套餐名称和状态 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>套餐名称 *</FormLabel>
                <FormControl>
                  <Input placeholder="请输入套餐名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="saling">销售中</SelectItem>
                    <SelectItem value="closed">已下架</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 套餐描述 */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>套餐描述</FormLabel>
              <FormControl>
                <Input placeholder="请输入套餐描述" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 套餐类型 */}
          <FormField
            control={form.control}
            name="packType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>套餐类型 *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择套餐类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PACKAGE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  按次数：固定使用次数；按金额：充值金额使用
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 有效期 */}
          <FormField
            control={form.control}
            name="validDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>有效期（天）*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="30"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>套餐购买后的有效使用天数</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 现价/售价 */}
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>现价（元）*</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 使用次数 - 仅在按次数类型时显示 */}
          {watchType === "times" && (
            <FormField
              control={form.control}
              name="totalTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用次数 *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>


        {/* 提交按钮 */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={loading}
          >
            重置
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "提交中..." : initialData ? "更新套餐" : "创建套餐"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
