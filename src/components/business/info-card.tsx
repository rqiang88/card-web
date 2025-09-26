import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface InfoItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  valueColor?: string;
}

interface InfoCardProps {
  title: string;
  subtitle?: string;
  avatar: {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  };
  badge?: {
    label: string;
    color: string;
  };
  infoItems: InfoItem[];
  className?: string;
}

export function InfoCard({
  title,
  subtitle,
  avatar,
  badge,
  infoItems,
  className = ""
}: InfoCardProps) {
  const AvatarIcon = avatar.icon;

  return (
    <Card className={`hover-lift ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 ${avatar.bgColor} rounded-xl flex items-center justify-center`}>
              <AvatarIcon className={`w-8 h-8 ${avatar.iconColor}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{title}</div>
              {subtitle && (
                <div className="text-sm text-muted-foreground">{subtitle}</div>
              )}
            </div>
          </div>
          {badge && (
            <Badge className={`${badge.color} text-sm px-3 py-1`}>{badge.label}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 信息网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <div className={`w-10 h-10 ${item.iconBgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
                  <div className={`font-semibold ${item.valueColor || 'text-foreground'} ${typeof item.value === 'number' && item.value > 1000 ? 'text-lg' : ''}`}>
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}