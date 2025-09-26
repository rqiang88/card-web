"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MemberForm } from "@/components/forms/member-form";
import { MEMBER_STATUS } from "@/lib/constants";
import { Plus, Search, Edit, Trash2, Eye, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { DataPagination } from "@/components/ui/data-pagination";
import { useState, useMemo } from "react";
import { useMembers, useMemberActions } from "@/hooks/use-members";
import Link from "next/link";
import type { Member } from "@/types";
import dayjs from "dayjs";

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const { toast } = useToast();
  const { members, loading, mutate } = useMembers();
  const { createMember, updateMember, deleteMember } = useMemberActions();

  // 过滤会员
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.includes(searchTerm)
    );
  }, [members, searchTerm]);

  // 分页
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedMembers,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(filteredMembers, {
    totalItems: filteredMembers.length,
    itemsPerPage: 10,
  });



  // 获取性别显示文本
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

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    const statusConfig = MEMBER_STATUS.find(s => s.value === status);
    if (statusConfig) {
      return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">未知</Badge>;
  };

  // 格式化日期显示
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('YYYY-MM-DD');
  };

  // 格式化生日显示
  const formatBirthday = (birthday?: string) => {
    if (!birthday) return '-';
    return dayjs(birthday).format('YYYY-MM-DD');
  };

  // 创建会员
  const handleCreateMember = async (data: any) => {
    try {
      await createMember(data);
      toast({
        title: "创建成功",
        description: "会员已成功创建",
      });
      setIsCreateDialogOpen(false);
      mutate();
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.message || "创建会员时发生错误",
        variant: "destructive",
      });
    }
  };

  // 编辑会员
  const handleEditMember = async (data: any) => {
    if (!selectedMember) return;

    try {
      await updateMember(selectedMember.id, data);
      toast({
        title: "更新成功",
        description: "会员信息已成功更新",
      });
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      mutate();
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message || "更新会员信息时发生错误",
        variant: "destructive",
      });
    }
  };

  // 删除会员
  const handleDeleteMember = async (id: string) => {
    if (!confirm("确定要删除这个会员吗？")) return;

    try {
      await deleteMember(id);
      toast({
        title: "删除成功",
        description: "会员已成功删除",
      });
      mutate();
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message || "删除会员时发生错误",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">会员管理</h1>
          <p className="text-muted-foreground">管理和查看所有会员信息</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增会员
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新增会员</DialogTitle>
              <DialogDescription>
                填写会员信息，创建新的会员档案。
              </DialogDescription>
            </DialogHeader>
            <MemberForm onSubmit={handleCreateMember} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索会员姓名或手机号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 会员列表 */}
      <Card>
        <CardHeader>
          <CardTitle>会员列表</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 表头 */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 rounded-lg mb-4 font-medium text-sm text-gray-600">
            <div>姓名</div>
            <div>手机号</div>
            <div>性别</div>
            <div>生日</div>
            <div>状态</div>
            <div>登记时间</div>
            <div>操作</div>
          </div>

          {/* 会员数据 */}
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : paginatedMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无会员数据</div>
          ) : (
            <div className="space-y-2">
              {paginatedMembers.map((member: Member) => (
                <div
                  key={member.id}
                  className="grid grid-cols-7 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{member.name}</div>
                  <div className="text-gray-600">{member.phone}</div>
                  <div className="text-gray-600">{getGenderDisplay(member.gender)}</div>
                  <div className="text-gray-600">{formatBirthday(member.birthday)}</div>
                  <div>{getStatusBadge(member.state)}</div>
                  <div className="text-gray-600">{formatDate(member.registerAt)}</div>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/members/${member.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMember(member);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            显示 {startIndex + 1} 到 {Math.min(endIndex, filteredMembers.length)} 条，共 {filteredMembers.length} 条记录
          </div>
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* 新增会员对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增会员</DialogTitle>
            <DialogDescription>
              添加新的会员信息，建立会员档案。
            </DialogDescription>
          </DialogHeader>
          <MemberForm onSubmit={handleCreateMember} loading={loading} />
        </DialogContent>
      </Dialog>

      {/* 编辑会员对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑会员</DialogTitle>
            <DialogDescription>修改会员信息，更新会员档案。</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <MemberForm
              defaultValues={selectedMember}
              onSubmit={handleEditMember}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
