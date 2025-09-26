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
import { Search, User, X } from "lucide-react";
import { useMembers } from "@/hooks/use-members";
import { usePagination } from "@/hooks/use-pagination";
import type { Member } from "@/types";

interface MemberSelectorProps {
  value?: string;
  onValueChange: (memberId: string, member: Member) => void;
  placeholder?: string;
  disabled?: boolean;
  selectedMember?: Member | null;
}

export function MemberSelector({
  value,
  onValueChange,
  placeholder = "选择会员",
  disabled = false,
  selectedMember,
}: MemberSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // 获取会员数据
  const { members, loading, error } = useMembers({
    search: searchTerm,
    page: currentPage,
    limit: 10,
  });

  // 分页逻辑
  const {
    totalPages,
    paginatedItems: paginatedMembers,
    goToPage,
  } = usePagination(members, {
    totalItems: members.length,
    itemsPerPage: 10,
  });

  const handleSelectMember = (member: Member) => {
    onValueChange(String(member.id), member);
    setOpen(false);
  };

  const handleClearSelection = () => {
    onValueChange("", {} as Member);
  };

  const getMemberLevelBadge = (level: string) => {
    const levelConfig = {
      normal: { label: "普通", color: "bg-gray-100 text-gray-800" },
      vip: { label: "VIP", color: "bg-yellow-100 text-yellow-800" },
      diamond: { label: "钻石", color: "bg-purple-100 text-purple-800" },
    }[level] || { label: level, color: "bg-gray-100 text-gray-800" };

    return <Badge className={levelConfig.color}>{levelConfig.label}</Badge>;
  };

  return (
    <div className="space-y-2">
      {/* 已选择的会员显示 */}
      {selectedMember && selectedMember.id ? (
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedMember.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedMember.phone}
                  </div>
                </div>
                {getMemberLevelBadge(selectedMember.level)}
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
          </CardContent>
        </Card>
      ) : (
        /* 选择会员按钮 */
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={disabled}
            >
              <User className="w-4 h-4 mr-2" />
              {placeholder}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>选择会员</DialogTitle>
              <DialogDescription>搜索并选择一个会员</DialogDescription>
            </DialogHeader>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索会员姓名或手机号..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* 会员列表 */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 text-red-500">
                  加载失败，请重试
                </div>
              ) : paginatedMembers.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  {searchTerm ? "未找到匹配的会员" : "暂无会员数据"}
                </div>
              ) : (
                <div className="space-y-2">
                  {paginatedMembers.map((member) => (
                    <Card
                      key={member.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSelectMember(member)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">
                                {member.phone}
                              </div>
                              {member.email && (
                                <div className="text-xs text-gray-400">
                                  {member.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getMemberLevelBadge(member.level)}
                            <div className="text-right text-sm">
                              <div className="text-green-600 font-medium">
                                ¥{member.balance}
                              </div>
                              <div className="text-gray-500">
                                {member.points || 0}积分
                              </div>
                            </div>
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
