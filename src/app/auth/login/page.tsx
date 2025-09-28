'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn, Shield, Sparkles, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { type LoginFormData, loginSchema } from '@/lib/validations'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      // 模拟登录API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟成功登录
      if (data.username === 'admin' && data.password === '123456') {
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        })
        router.push('/dashboard')
      } else {
        throw new Error('用户名或密码错误')
      }
    } catch (error: any) {
      toast({
        title: '登录失败',
        description: error.message || '用户名或密码错误',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* 左侧装饰区域 */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
                <h1 className="ml-4 text-3xl font-bold">会员管理系统</h1>
              </div>
              <p className="text-xl text-blue-100 leading-relaxed">
                专业的会员管理解决方案，助力您的业务增长
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">安全可靠</h3>
                  <p className="text-blue-100 text-sm">
                    企业级安全保障，数据加密存储
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">功能丰富</h3>
                  <p className="text-blue-100 text-sm">
                    会员管理、套餐销售、数据分析一体化
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">易于使用</h3>
                  <p className="text-blue-100 text-sm">
                    直观的界面设计，快速上手操作
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 装饰性几何图形 */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-blue-300/20 rounded-full blur-md"></div>
        </div>

        {/* 右侧登录表单 */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* 移动端标题 */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">会员管理系统</h1>
              <p className="mt-2 text-gray-600">请登录您的账户</p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-900">
                  欢迎回来
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  请输入您的账号密码登录系统
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            用户名
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="请输入用户名"
                              className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            密码
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="请输入密码"
                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                {...field}
                                disabled={loading}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          登录中...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          登录系统
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {/* 默认账号信息 */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-600" />
                    测试账号
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>管理员账号：</span>
                      <code className="bg-white px-2 py-1 rounded border text-xs">
                        admin / 123456
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>操作员账号：</span>
                      <code className="bg-white px-2 py-1 rounded border text-xs">
                        operator / 123456
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 底部信息 */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2024 会员管理系统. 保留所有权利.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
