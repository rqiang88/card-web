# 会员管理系统 - 前端

基于 Next.js + TypeScript + Tailwind CSS 的现代化会员管理系统前端应用。

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- Yarn 或 npm

### 安装依赖

```bash
yarn install
# 或
npm install
```

### 启动开发服务器

```bash
yarn dev
# 或
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── auth/              # 认证相关页面
│   │   ├── dashboard/         # 仪表板页面
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # 组件
│   │   ├── business/          # 业务组件
│   │   ├── forms/             # 表单组件
│   │   ├── layout/            # 布局组件
│   │   ├── providers/         # 提供者组件
│   │   └── ui/                # UI 基础组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── lib/                   # 工具库
│   ├── store/                 # 状态管理
│   └── types/                 # TypeScript 类型定义
├── public/                    # 静态资源
├── tailwind.config.js         # Tailwind CSS 配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 项目配置
```

## 🎨 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI + shadcn/ui
- **状态管理**: Zustand
- **数据获取**: SWR
- **表单**: React Hook Form + Zod
- **图标**: Lucide React
- **主题**: next-themes

## 📱 功能特性

### 已实现功能

- ✅ 用户认证 (登录/登出)
- ✅ 响应式仪表板
- ✅ 会员管理 (CRUD)
- ✅ 套餐管理 (CRUD)
- ✅ 消费记录管理
- ✅ 充值记录管理
- ✅ 统计数据展示
- ✅ 搜索和筛选
- ✅ 暗色模式支持

### 待实现功能

- 🔄 图表数据可视化
- 🔄 数据导出功能
- 🔄 高级筛选和排序
- 🔄 批量操作
- 🔄 权限管理
- 🔄 系统设置

## 🎯 页面说明

### 登录页面 (`/auth/login`)
- 用户名/密码登录
- 测试账号：admin / 123456
- 响应式设计，支持移动端

### 仪表板 (`/dashboard`)
- 营收统计卡片
- 会员数据概览
- 充值统计信息
- 最新活动展示
- 热门套餐排行

### 会员管理 (`/dashboard/members`)
- 会员列表展示
- 新增/编辑会员
- 会员信息搜索
- 会员等级管理

### 套餐管理 (`/dashboard/packages`)
- 套餐列表展示
- 套餐分类管理
- 价格和有效期设置
- 套餐状态控制

### 消费管理 (`/dashboard/consumption`)
- 消费记录列表
- 支付方式统计
- 消费数据分析
- 交易明细查看

### 充值管理 (`/dashboard/recharge`)
- 充值记录管理
- 余额和套餐充值
- 充值统计分析
- 有效期管理

## 🔧 开发指南

### 添加新页面

1. 在 `src/app/dashboard/` 下创建新目录
2. 添加 `page.tsx` 文件
3. 在 `src/lib/constants.ts` 中添加导航项
4. 更新路由权限配置

### 添加新组件

1. 在 `src/components/` 相应目录下创建组件
2. 使用 TypeScript 定义 Props 接口
3. 遵循 shadcn/ui 设计规范
4. 添加必要的测试

### 状态管理

使用 Zustand 进行状态管理：

```typescript
// 创建 store
export const useExampleStore = create<ExampleState>((set) => ({
  // state
  data: [],
  loading: false,
  
  // actions
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}))
```

### API 集成

使用 SWR 进行数据获取：

```typescript
// 自定义 Hook
export function useExample() {
  const { data, error, mutate } = useSWR('/api/example', fetcher)
  
  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  }
}
```

## 🎨 设计系统

### 颜色主题

- 主色调: Green (绿色)
- 辅助色: Blue, Purple, Orange
- 中性色: Gray 系列

### 组件规范

- 使用 shadcn/ui 组件库
- 遵循 Radix UI 设计原则
- 支持暗色模式
- 响应式设计

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 组件使用 PascalCase
- 文件使用 kebab-case

### 提交规范

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 样式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 🚀 部署

### 构建生产版本

```bash
yarn build
```

### 启动生产服务器

```bash
yarn start
```

### Docker 部署

```bash
docker build -t member-management-frontend .
docker run -p 3000:3000 member-management-frontend
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请联系开发团队。
