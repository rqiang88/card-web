"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataPagination } from "@/components/ui/data-pagination";
import { Search, PackageIcon as Package, X } from "lucide-react";
import { usePackages } from "@/hooks/use-packages";
import { usePagination } from "@/hooks/use-pagination";
import type { Package as PackageType } from "@/types";

interface PackageSelectorProps {
  value?: string;
  onValueChange: (packageId: string, packageData: PackageType) => void;
  placeholder?: string;
  disabled?: boolean;
  selectedPackage?: PackageType | null;
}

export function PackageSelector({
  value,
  onValueChange,
  placeholder = "选择套餐",
  disabled = false,
  selectedPackage,
}: PackageSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // 获取套餐数据
  const { packages, loading, error } = usePackages({
    search: searchTerm,
    page: currentPage,
    limit: 10,
  });

  // 调试信息
  React.useEffect(() => {
    console.log("PackageSelector - packages:", packages);
    console.log("PackageSelector - loading:", loading);
    console.log("PackageSelector - error:", error);
  }, [packages, loading, error]);

  // 只显示激活状态的套餐（后端返回的字段是state，null表示激活状态）
  const activePackages = packages.filter(
    (pkg) => (pkg as any).state === "saling"
  );

  console.log("PackageSelector - activePackages:", activePackages);
  console.log("PackageSelector - raw packages data:", packages);

  // 分页逻辑
  const {
    totalPages,
    paginatedItems: paginatedPackages,
    goToPage,
  } = usePagination(activePackages, {
    totalItems: activePackages.length,
    itemsPerPage: 10,
  });

  const handleSelectPackage = (packageData: PackageType) => {
    onValueChange(packageData.id, packageData);
    setOpen(false);
  };

  const handleClearSelection = () => {
    onValueChange("", {} as PackageType);
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      fitness: { label: "健身", color: "bg-green-100 text-green-800" },
      beauty: { label: "美容", color: "bg-pink-100 text-pink-800" },
      entertainment: { label: "娱乐", color: "bg-blue-100 text-blue-800" },
      other: { label: "其他", color: "bg-gray-100 text-gray-800" },
    }[category] || { label: category, color: "bg-gray-100 text-gray-800" };

    return (
      <Badge className={categoryConfig.color}>{categoryConfig.label}</Badge>
    );
  };

  const getTypeBadge = (packType: string) => {
    // 如果是按次数类型，不显示标签
    if (packType === "times") {
      return null;
    }

    const typeConfig = {
      amount: { label: "按金额", color: "bg-purple-100 text-purple-800" },
    }[packType] || { label: packType, color: "bg-gray-100 text-gray-800" };

    return <Badge className={typeConfig.color}>{typeConfig.label}</Badge>;
  };

  return (
    <div className="space-y-2">
      {/* 已选择的套餐显示 */}
      {selectedPackage && selectedPackage.id ? (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedPackage.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedPackage.description}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getCategoryBadge(selectedPackage.category)}
                  {getTypeBadge(selectedPackage.packType)}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm">
                  <div className="text-green-600 font-medium">
                    ¥{parseFloat(String(selectedPackage.salePrice || 0)).toFixed(2)}
                  </div>
                  {selectedPackage.packType === "times" && (
                    <div className="text-gray-500">
                      {selectedPackage.totalTimes}次
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 选择套餐按钮 */
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={disabled}
            >
              <Package className="w-4 h-4 mr-2" />
              {placeholder}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>选择套餐</DialogTitle>
              <DialogDescription>搜索并选择一个套餐</DialogDescription>
            </DialogHeader>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索套餐名称或描述..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* 套餐列表 */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 text-red-500">
                  加载失败，请重试
                </div>
              ) : paginatedPackages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  {searchTerm ? "未找到匹配的套餐" : "暂无套餐数据"}
                </div>
              ) : (
                <div className="space-y-2">
                  {paginatedPackages.map((packageData) => (
                    <Card
                      key={packageData.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSelectPackage(packageData)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-lg">
                                {packageData.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {packageData.description}
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                {getCategoryBadge(packageData.category)}
                                {getTypeBadge(
                                  (packageData as any).packType ||
                                    packageData.type
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              ¥{parseFloat((packageData as any).salePrice || packageData.price || "0").toFixed(2)}
                            </div>
                            {((packageData as any).packType ||
                              packageData.type) === "times" && (
                              <div className="text-sm text-gray-600 mt-1">
                                {packageData.totalTimes}次 ·{" "}
                                {(packageData as any).validDay ||
                                  packageData.validityDays}
                                天有效
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="border-t pt-4">
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
