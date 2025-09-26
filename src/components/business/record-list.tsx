import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataPagination } from "@/components/ui/data-pagination";
import { Search, LucideIcon } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import dayjs from "dayjs";

interface RecordItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  createdAt: string;
  status?: {
    label: string;
    color: string;
  };
  badges?: {
    label: string;
    color: string;
  }[];
  extraInfo?: string;
}

interface RecordListProps {
  records: RecordItem[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  amountColor: string;
  amountPrefix: string;
  borderColor: string;
  focusRingColor: string;
  className?: string;
}

export function RecordList({
  records,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  icon: Icon,
  iconColor,
  iconBgColor,
  amountColor,
  amountPrefix,
  borderColor,
  focusRingColor,
  className = ""
}: RecordListProps) {
  // 过滤记录
  const filteredRecords = React.useMemo(() => {
    if (!searchValue) return records;
    return records.filter(
      (record) =>
        record.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.subtitle.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [records, searchValue]);

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedRecords,
    goToPage,
  } = usePagination(filteredRecords, {
    totalItems: filteredRecords.length,
    itemsPerPage: 10,
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`pl-10 bg-background border-border focus:ring-2 ${focusRingColor}`}
        />
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
            <p className="text-muted-foreground text-lg">
              {searchValue ? `未找到匹配的${emptyTitle}` : `暂无${emptyTitle}`}
            </p>
            {!searchValue && (
              <p className="text-sm text-muted-foreground mt-1">{emptyDescription}</p>
            )}
          </div>
        ) : (
          paginatedRecords.map((record) => (
            <Card key={record.id} className={`hover-lift ${borderColor} bg-background`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground text-lg">
                        {record.title}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {record.badges && record.badges.map((badge: {label: string; color: string}, index: number) => (
                          <span key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${badge.color}`}>
                            {badge.label}
                          </span>
                        ))}
                        {record.badges && record.subtitle && <span>•</span>}
                        <span>{record.subtitle}</span>
                      </div>
                      {record.extraInfo && (
                        <div className="text-xs text-muted-foreground">
                          {record.extraInfo}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className={`text-2xl font-bold ${amountColor}`}>
                      {amountPrefix}¥{record.amount}
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {record.status && (
                        <Badge className={`${record.status.color} text-xs`}>
                          {record.status.label}
                        </Badge>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {amountPrefix === '+' ? '充值金额' : '消费金额'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4 border-t border-border">
          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}