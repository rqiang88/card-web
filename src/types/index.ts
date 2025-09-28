// 用户相关类型
export interface User {
  id: string
  username: string
  email?: string
  role: 'admin' | 'operator'
  createdAt: string
  updatedAt: string
}

// 会员相关类型
export interface Member {
  id: string
  name: string
  phone: string
  email?: string
  gender: 'male' | 'female'
  level: 'normal' | 'vip' | 'diamond'
  birthday?: string
  registerAt?: string | undefined
  state: 'active' | 'disabled'
  balance: number
  points: number
  remark?: string
  createdAt: string
  updatedAt: string
}

// 套餐相关类型
export interface Package {
  id: string
  name: string
  description?: string
  packType: 'amount' | 'times' | 'normal' // 对应后端的packType字段
  category: 'fitness' | 'beauty' | 'entertainment' | 'other'
  price: number
  memberPrice?: number // 会员价格
  salePrice?: number // 销售价格
  totalTimes?: number
  validDay: number // 对应后端的validDay字段
  state: 'saling' | 'closed' // 对应后端的state字段
  position?: number // 排序
  salesCount?: number // 销售数量
  icon?: string // 图标URL
  payload?: object // 其他字段
  createdAt: string
  updatedAt: string
}

// 消费记录类型
export interface Consumption {
  id: string
  memberId?: string
  memberName?: string
  memberPhone?: string
  memberGender?: 'male' | 'female'
  amount: number
  paymentMethod: 'cash' | 'card' | 'alipay' | 'wechat' | 'balance'
  description?: string
  operatorId: string
  operatorName: string
  createdAt: string
  consumptionAt: string
  // 新增字段
  packageName?: string
  rechargeInfo?: {
    id: string | number
    totalTimes: number
    remainingTimes: number
    usedTimes: number
    rechargeAmount: number
    totalAmount: number
    remainingAmount: number
  }
}

// 充值记录类型
export interface Recharge {
  id: string | number
  memberId: string | number
  member?: {
    id: string | number
    name: string
    phone?: string
    state?: string
    gender?: 'male' | 'female'
  }
  memberName?: string
  packageId?: string | number
  packageName?: string
  type: 'balance' | 'package'
  rechargeAmount: number
  bonusAmount?: number
  totalAmount?: number
  paymentMethod: 'cash' | 'card' | 'alipay' | 'wechat'
  validityDays?: number
  totalTimes?: number
  remainingTimes?: number
  usedTimes?: number
  remainingAmount?: number
  startDate?: string
  endDate?: string
  expiryDate?: string
  state?: string
  rechargeAt?: string
  operatorId?: string | number
  operatorName?: string
  remark?: string
  createdAt: string
  updatedAt?: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  timestamp: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

// 分页相关类型
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 查询参数类型
export interface QueryParams extends PaginationParams {
  [key: string]: any
}

// 统计数据类型
export interface DashboardStats {
  totalMembers: number
  totalRevenue: number
  monthlyRevenue: number
  activePackages: number
  recentConsumptions: Consumption[]
  recentRecharges: Recharge[]
  memberGrowth: Array<{
    date: string
    count: number
  }>
  revenueChart: Array<{
    date: string
    amount: number
  }>
}

// 表单数据类型
export interface LoginFormData {
  username: string
  password: string
}

export interface MemberFormData {
  name: string
  phone: string
  email?: string
  gender: 'male' | 'female' | 'other'
  birthday?: string
  registerAt?: string
  state: 'active' | 'disabled'
  remark?: string
}

export interface PackageFormData {
  name: string
  description?: string
  packType: 'amount' | 'times' | 'normal'
  category: 'fitness' | 'beauty' | 'entertainment' | 'other'
  price: number
  memberPrice?: number
  salePrice?: number
  totalTimes?: number
  validDay: number
  state: 'saling' | 'closed'
  icon?: string
  position?: number
}

export interface ConsumptionFormData {
  memberId: number
  memberName?: string
  amount?: number
  rechargeId: number
  packageId?: number
  remark?: string
}

export interface RechargeFormData {
  memberId: string
  packageId?: string
  packageName?: string
  type: 'balance' | 'package'
  rechargeAmount: number
  rechargeAt: string
  totalTimes?: number
  validityDays?: number
  paymentType: 'cash' | 'card' | 'alipay' | 'wechat'
  state: 'active' | 'completed' | 'expired' | 'disabled'
  remark?: string
}
