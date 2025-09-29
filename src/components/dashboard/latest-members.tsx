'use client'

import { Calendar, Phone, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api/dashboard'
import type { LatestMember } from '@/lib/api/dashboard'

export function LatestMembers() {
  const [members, setMembers] = useState<LatestMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestMembers = async () => {
      try {
        setLoading(true)
        const data = await dashboardApi.getLatestMembers()
        setMembers(data)
      } catch (error) {
        console.error('获取最新会员失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestMembers()
  }, [])

  const getGenderDisplay = (gender?: string) => {
    switch (gender) {
      case 'male':
        return { text: '男', color: 'text-blue-600 bg-blue-100' }
      case 'female':
        return { text: '女', color: 'text-pink-600 bg-pink-100' }
      default:
        return { text: '未知', color: 'text-gray-600 bg-gray-100' }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">最新会员</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">最新会员</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无新会员</p>
            </div>
          ) : (
            members.map((member) => {
              const genderInfo = getGenderDisplay(member.gender)
              return (
                <div
                  key={member.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${genderInfo.color}`}
                    >
                      {genderInfo.text.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name || '未知姓名'}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(member.registrationTime)}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="truncate">{member.phone || '未知手机号'}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}