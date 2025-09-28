// API 相关常量
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'

// 调试信息
if (typeof window !== 'undefined') {
  console.log('环境变量调试:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_BASE_URL: API_BASE_URL,
  })
}

// 应用配置
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || '会员管理系统',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  description: '基于 Next.js + NestJS 的会员管理系统',
}

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}

// 会员等级选项
export const MEMBER_LEVELS = [
  { value: 'normal', label: '普通会员', color: 'bg-gray-100 text-gray-800' },
  { value: 'vip', label: 'VIP会员', color: 'bg-yellow-100 text-yellow-800' },
  {
    value: 'diamond',
    label: '钻石会员',
    color: 'bg-purple-100 text-purple-800',
  },
] as const

// 会员状态选项
export const MEMBER_STATUS = [
  { value: 'active', label: '活跃', color: 'bg-green-100 text-green-800' },
  { value: 'disabled', label: '禁用', color: 'bg-red-100 text-red-800' },
] as const

// 性别选项
export const GENDER_OPTIONS = [
  { value: 'female', label: '女' },
  { value: 'male', label: '男' },
  { value: 'other', label: '其他' },
] as const

// 套餐类型选项
export const PACKAGE_TYPES = [
  { value: 'amount', label: '按金额' },
  { value: 'times', label: '按次数' },
  { value: 'normal', label: '普通套餐' },
] as const

// 套餐分类选项
export const PACKAGE_CATEGORIES = [
  { value: 'fitness', label: '健身', color: 'bg-blue-100 text-blue-800' },
  { value: 'beauty', label: '美容', color: 'bg-pink-100 text-pink-800' },
  {
    value: 'entertainment',
    label: '娱乐',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'other', label: '其他', color: 'bg-gray-100 text-gray-800' },
] as const

// 套餐状态选项
export const PACKAGE_STATUS = [
  { value: 'active', label: '启用', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: '停用', color: 'bg-gray-100 text-gray-800' },
] as const

// 支付方式选项
export const PAYMENT_METHODS = [
  { value: 'cash', label: '现金', icon: '💵' },
  { value: 'card', label: '刷卡', icon: '💳' },
  { value: 'alipay', label: '支付宝', icon: '🅰️' },
  { value: 'wechat', label: '微信支付', icon: '💬' },
  { value: 'balance', label: '余额支付', icon: '💰' },
] as const

// 充值类型选项
export const RECHARGE_TYPES = [
  { value: 'balance', label: '余额充值' },
  { value: 'package', label: '套餐充值' },
] as const

// 充值状态选项
export const RECHARGE_STATUS = [
  { value: 'active', label: '有效', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: '已使用', color: 'bg-blue-100 text-blue-800' },
  { value: 'expired', label: '已过期', color: 'bg-red-100 text-red-800' },
  { value: 'disabled', label: '已禁用', color: 'bg-gray-100 text-gray-800' },
] as const

// 用户角色选项
export const USER_ROLES = [
  { value: 'admin', label: '管理员' },
  { value: 'operator', label: '操作员' },
] as const

// 导航菜单
export const NAVIGATION_ITEMS = [
  {
    title: '仪表板',
    href: '/dashboard',
    icon: 'BarChart3',
  },
  {
    title: '会员管理',
    href: '/dashboard/members',
    icon: 'Users',
  },
  {
    title: '套餐管理',
    href: '/dashboard/packages',
    icon: 'Package',
  },
  {
    title: '充值管理',
    href: '/dashboard/recharges',
    icon: 'Wallet',
  },
  {
    title: '消费管理',
    href: '/dashboard/consumptions',
    icon: 'CreditCard',
  },
] as const

// 表格配置
export const TABLE_CONFIG = {
  ROWS_PER_PAGE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_ROWS_PER_PAGE: 10,
}

// 日期格式
export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD',
  DISPLAY_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
}

// 验证规则
export const VALIDATION_RULES = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
  },
}

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络错误，请稍后重试',
  SERVER_ERROR: '服务器错误',
  NOT_FOUND: '资源未找到',
  UNAUTHORIZED: '未授权，请重新登录',
  FORBIDDEN: '权限不足',
  VALIDATION_ERROR: '数据验证失败',
}

export const ENV = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL: API_BASE_URL,
}

// 成功消息
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: '创建成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
}
