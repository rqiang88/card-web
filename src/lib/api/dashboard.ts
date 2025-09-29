import { apiClient } from '../api'

export interface LatestMember {
  id: number
  name: string
  phone: string
  gender: string
  registrationTime: string
}

export interface RecentConsumption {
  id: number
  consumptionTime: string
  customerName: string
  customerGender: string
  packageName: string
  packageType?: string
  amount?: number
}

export interface RecentRecharge {
  id: number
  rechargeTime: string
  memberName: string
  memberGender: string
  rechargeAmount: number
  packageName: string
}

export interface DashboardOverview {
  todayRevenue: number
  monthlyRevenue: number
  totalMembers: number
  todayRecharge: number
}

export interface PopularPackage {
  id: number
  name: string
  salesCount: number
  salePrice: number
  category: string
}

export interface RevenueStats {
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
  totalRevenue: number
  memberCount: number
  packageCount: number
  rechargeCount: number
  consumptionCount: number
}

export interface WeeklyRevenueData {
  date: string
  revenue: number
}

export interface WeeklyRevenueResponse {
  records: WeeklyRevenueData[]
  totalRevenue: number
  startDate: string
  endDate: string
}

export const dashboardApi = {
  // 获取最新会员
  getLatestMembers: async (): Promise<LatestMember[]> => {
    const response = await apiClient.get('/members?limit=5')
    const items = response?.data?.data?.items || response?.data?.items || []
    return items.map((member: any) => ({
      id: member.id,
      name: member.name,
      phone: member.phone,
      gender: member.gender,
      registrationTime: member.createdAt,
    }))
  },

  // 获取最近消费
  getRecentConsumptions: async (): Promise<RecentConsumption[]> => {
    const response = await apiClient.get('/consumptions?limit=5')
    const items = response?.data?.data?.items || response?.data?.items || []
    return items.map((consumption: any) => ({
      id: consumption.id,
      consumptionTime: consumption.consumptionAt,
      customerName: consumption.member?.name,
      customerGender: consumption.member?.gender,
      packageName: consumption.package?.name,
      packageType: consumption.package?.packType,
      amount: consumption.amount
        ? parseFloat(consumption.amount)
        : parseFloat(consumption.package?.salePrice || 0),
    }))
  },

  // 获取最近充值
  getRecentRecharges: async (): Promise<RecentRecharge[]> => {
    const response = await apiClient.get('/recharges?limit=5')
    const items = response?.data?.data?.items || response?.data?.items || []
    return items.map((recharge: any) => ({
      id: recharge.id,
      rechargeTime: recharge.rechargeAt,
      memberName: recharge.member?.name,
      memberGender: recharge.member?.gender,
      rechargeAmount: parseFloat(recharge.rechargeAmount),
      packageName: recharge.package?.name,
    }))
  },

  // 获取热门套餐
  getPopularPackages: async (): Promise<PopularPackage[]> => {
    const response = await apiClient.get(
      '/packages?sortBy=salesCount&sortOrder=DESC&limit=5'
    )
    // 后端返回的数据结构是 {success: true, data: {items: [...], total: ...}, message: "success", timestamp: "..."}
    const items = response?.data?.data?.items || response?.data?.items || []
    return items.map((pkg: any) => ({
      id: pkg.id,
      name: pkg.name,
      salesCount: pkg.salesCount || 0,
      salePrice: parseFloat(pkg.salePrice || pkg.memberPrice || 0),
      category: pkg.category || '默认',
    }))
  },

  // 获取仪表板概览
  getOverview: async (): Promise<DashboardOverview> => {
    // 使用现有接口计算概览数据
    const [membersResponse, rechargesResponse] = await Promise.all([
      apiClient.get('/members'),
      apiClient.get('/recharges'),
    ])

    const today = new Date().toISOString().split('T')[0]
    const currentMonth = new Date().toISOString().slice(0, 7)

    // 处理后端返回的数据结构
    const rechargeItems =
      rechargesResponse?.data?.data?.items ||
      rechargesResponse?.data?.items ||
      []
    const memberTotal =
      membersResponse?.data?.data?.total || membersResponse?.data?.total || 0

    // 计算今日充值
    const todayRecharges = rechargeItems.filter((r: any) =>
      r.rechargeAt?.startsWith(today)
    )
    const todayRecharge = todayRecharges.reduce(
      (sum: number, r: any) => sum + parseFloat(r.rechargeAmount || 0),
      0
    )

    // 计算本月收入
    const monthlyRecharges = rechargeItems.filter((r: any) =>
      r.rechargeAt?.startsWith(currentMonth)
    )
    const monthlyRevenue = monthlyRecharges.reduce(
      (sum: number, r: any) => sum + parseFloat(r.rechargeAmount || 0),
      0
    )

    return {
      todayRevenue: todayRecharge,
      monthlyRevenue,
      totalMembers: memberTotal,
      todayRecharge,
    }
  },

  // 获取营收统计数据
  getRevenueStats: async (
    startDate?: string,
    endDate?: string
  ): Promise<RevenueStats> => {
    const data: any = {}
    if (startDate) data.startDate = startDate
    if (endDate) data.endDate = endDate

    const response = await apiClient.post('/stats/revenues', data)
    // 后端返回的数据结构是 {success: true, data: {...}, message: "success", timestamp: "..."}
    return response.data?.data || response.data
  },

  // 获取周营收趋势数据
  getWeeklyRevenues: async (): Promise<WeeklyRevenueResponse> => {
    const response = await apiClient.post('/stats/weekly/revenues')
    // 后端返回的数据结构是 {success: true, data: {...}, message: "success", timestamp: "..."}
    return response.data?.data || response.data
  },
}
