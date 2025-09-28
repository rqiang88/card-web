'use client'

import {
  BarChart3,
  CreditCard,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconMap = {
  BarChart3,
  Users,
  Package,
  CreditCard,
  Wallet,
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    // 清除认证信息并跳转到登录页
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-sidebar-foreground">
              会员管理系统
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap]
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground border-r-3 border-sidebar-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* 用户信息 */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                管理员
              </p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
            <button
              className="p-1 hover:bg-sidebar-accent rounded transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <nav className="text-sm text-muted-foreground">
                <span>首页</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">
                  {NAVIGATION_ITEMS.find((item) => item.href === pathname)
                    ?.title || '仪表板'}
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
