import { z } from 'zod'

import { VALIDATION_RULES } from './constants'

// 登录表单验证
export const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名').max(50, '用户名不能超过50个字符'),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD.MIN_LENGTH,
      `密码至少${VALIDATION_RULES.PASSWORD.MIN_LENGTH}位`
    )
    .max(
      VALIDATION_RULES.PASSWORD.MAX_LENGTH,
      `密码不能超过${VALIDATION_RULES.PASSWORD.MAX_LENGTH}位`
    ),
})

// 会员表单验证
export const memberSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.NAME.MIN_LENGTH,
      `姓名至少${VALIDATION_RULES.NAME.MIN_LENGTH}个字符`
    )
    .max(
      VALIDATION_RULES.NAME.MAX_LENGTH,
      `姓名不能超过${VALIDATION_RULES.NAME.MAX_LENGTH}个字符`
    ),
  phone: z.string().regex(VALIDATION_RULES.PHONE, '请输入正确的手机号码'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '请选择性别',
  }),
  birthday: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || '')
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, '请输入有效的日期'),
  registerAt: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => val || '')
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, '请输入有效的日期时间'),
  state: z.enum(['active', 'disabled'], {
    required_error: '请选择状态',
  }),
  remark: z
    .string()
    .max(500, '备注不能超过500个字符')
    .optional()
    .or(z.literal('')),
})

// 套餐表单验证
export const packageSchema = z.object({
  name: z
    .string()
    .min(1, '请输入套餐名称')
    .max(100, '套餐名称不能超过100个字符'),
  description: z
    .string()
    .max(500, '描述不能超过500个字符')
    .optional()
    .or(z.literal('')),
  packType: z.enum(['amount', 'times', 'normal'], {
    required_error: '请选择套餐类型',
  }),
  category: z
    .enum(['fitness', 'beauty', 'entertainment', 'other'], {
      required_error: '请选择套餐分类',
    })
    .optional(),
  price: z
    .number()
    .min(0.01, '原价必须大于0')
    .max(999999.99, '原价不能超过999999.99')
    .optional(),
  salePrice: z
    .number()
    .min(0.01, '现价必须大于0')
    .max(999999.99, '现价不能超过999999.99'),
  totalTimes: z
    .number()
    .int('次数必须为整数')
    .min(1, '次数必须大于0')
    .max(9999, '次数不能超过9999')
    .optional(),
  validDay: z
    .number()
    .int('有效期必须为整数')
    .min(1, '有效期至少1天')
    .max(3650, '有效期不能超过3650天')
    .optional(),
  state: z
    .enum(['saling', 'closed'], {
      required_error: '请选择状态',
      invalid_type_error: '状态值无效',
    })
    .default('saling'),
})

// 消费记录表单验证
export const consumptionSchema = z.object({
  memberId: z.number().int('会员ID必须是整数').min(1, '请选择会员'),
  memberName: z
    .string()
    .min(1, '请输入会员姓名或选择会员')
    .max(50, '会员姓名不能超过50个字符')
    .optional(),
  amount: z
    .number()
    .min(0.01, '消费金额必须大于0')
    .max(999999.99, '消费金额不能超过999999.99')
    .optional(),
  rechargeId: z.number().int('充值记录ID必须是整数').min(1, '请选择充值记录'),
  packageId: z.number().int('套餐ID必须是整数').optional(),
  consumptionAt: z.string().min(1, '请选择消费时间').optional(),
  remark: z
    .string()
    .max(200, '备注不能超过200个字符')
    .optional()
    .or(z.literal('')),
})

// 充值记录表单验证
export const rechargeSchema = z.object({
  memberId: z.string().min(1, '请选择会员'),
  packageId: z.string().optional(),
  type: z.enum(['balance', 'package'], {
    required_error: '请选择充值类型',
  }),
  rechargeAmount: z
    .number()
    .min(0.01, '充值金额必须大于0')
    .max(999999.99, '充值金额不能超过999999.99'),
  rechargeAt: z.string().min(1, '请选择充值时间'),
  paymentType: z.enum(['cash', 'card', 'alipay', 'wechat'], {
    required_error: '请选择支付方式',
  }),
  state: z
    .enum(['active', 'completed', 'expired', 'disabled'], {
      required_error: '请选择状态',
    })
    .default('active'),
  remark: z
    .string()
    .max(500, '备注不能超过500个字符')
    .optional()
    .or(z.literal('')),
})

// 搜索表单验证
export const searchSchema = z.object({
  search: z
    .string()
    .max(100, '搜索关键词不能超过100个字符')
    .optional()
    .or(z.literal('')),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// 导出类型
export type LoginFormData = z.infer<typeof loginSchema>
export type MemberFormData = z.infer<typeof memberSchema>
export type PackageFormData = z.infer<typeof packageSchema>
export type ConsumptionFormData = z.infer<typeof consumptionSchema>
export type RechargeFormData = z.infer<typeof rechargeSchema>
export type SearchFormData = z.infer<typeof searchSchema>
