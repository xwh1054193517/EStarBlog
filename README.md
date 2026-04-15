# ESBlog

一个现代化的全栈博客系统，基于 Next.js 和 NestJS 构建，支持前台展示和后台管理。

## 特性

- :bulb: **前台展示** - 简洁、响应式的博客界面，专注于内容阅读体验
- :lock: **后台管理** - 安全的 JWT 认证，支持文章、分类、标签的完整管理
- :rocket: **现代化技术栈** - Next.js 16 + NestJS 11 + Prisma + PostgreSQL
- :zap: **快速加载** - 服务端渲染优化，支持 SEO
- :art: **精美 UI** - Tailwind CSS 构建，支持移动端自适应
- :chart_with_upwards_trend: **数据统计** - 文章访问统计和可视化面板

## 技术栈

### 前端

- **框架**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS
- **状态管理**: Zustand
- **组件库**: Shadcn/ui
- **图表**: Recharts

### 后端

- **框架**: NestJS 11
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **缓存**: Redis
- **认证**: JWT
- **存储**: AWS S3 (可选)

## 项目结构

```
vx-blog/
├── frontEnd/          # Next.js 前端应用
│   ├── app/           # App Router 页面
│   ├── components/    # React 组件
│   ├── lib/           # 工具函数和 API
│   ├── stores/        # Zustand 状态管理
│   └── public/        # 静态资源
│
├── backEnd/           # NestJS 后端应用
│   ├── src/
│   │   ├── modules/   # 功能模块
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── posts/     # 文章管理
│   │   │   ├── categories/# 分类管理
│   │   │   ├── tags/      # 标签管理
│   │   │   ├── uploads/   # 文件上传
│   │   │   ├── stats/     # 统计数据
│   │   │   └── presence/  # 在线状态
│   │   ├── common/    # 公共模块
│   │   ├── prisma/    # Prisma 服务
│   │   └── redis/     # Redis 服务
│   └── prisma/        # 数据库 schema
│
├── docker-compose.yaml  # Docker 编排配置
└── Agent.md           # AI 助手开发规范
```

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- pnpm 8+

### 1. 克隆项目

```bash
git clone <repository-url>
cd vx-blog
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 后端环境变量 (backEnd/.env)
cp backEnd/.env.example backEnd/.env
```

### 3. 启动数据库服务

```bash
# 使用 Docker 启动 PostgreSQL 和 Redis
docker-compose up -d
```

### 4. 安装依赖

```bash
# 安装前端依赖
cd frontEnd
pnpm install

# 安装后端依赖
cd ../backEnd
pnpm install
```

### 5. 初始化数据库

```bash
cd backEnd
pnpm prisma:generate
pnpm prisma:migrate
```

### 6. 启动开发服务器

```bash
# 启动后端 (http://localhost:3001)
cd backEnd
pnpm start:dev

# 启动前端 (http://localhost:3000)
cd frontEnd
pnpm dev
```

## API 文档

启动后端服务后访问: `http://localhost:3001/api`

详细 API 文档请查看 [backEnd/api.md](backEnd/api.md)

## 功能预览

### 前台

- 首页展示最新文章
- 文章详情页，支持 Markdown 渲染
- 分类和标签归档
- 文章阅读量统计

### 后台管理

- 管理员登录认证
- 文章 CRUD 操作
- 分类和标签管理
- 文件上传管理
- 数据统计面板

## 开发指南

请阅读 [Agent.md](Agent.md) 了解更多开发规范和约束。

## License

MIT
