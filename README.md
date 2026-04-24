# ESBlog

一个现代化的全栈博客系统，基于 Next.js 和 NestJS 构建，支持前台展示和后台管理。

## 特性

- :bulb: **前台展示** - 简洁、响应式的博客界面，专注于内容阅读体验
- :lock: **后台管理** - 安全的 JWT 认证，支持文章、分类、标签的完整管理
- :rocket: **现代化技术栈** - Next.js 16 + NestJS 11 + Prisma + PostgreSQL
- :zap: **快速加载** - 服务端渲染优化，支持 SEO
- :art: **精美 UI** - Tailwind CSS 构建，支持移动端自适应
- :chart_with_upwards_trend: **数据统计** - 文章访问统计和可视化面板
- :sparkles: **AI 助手** - 基于 Kimi (Moonshot AI) 的智能写作辅助
- :floppy_disk: **对象存储** - 支持 MinIO / AWS S3 本地部署

## 技术栈

### 前端

- **框架**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS
- **状态管理**: Zustand / TanStack Query
- **组件库**: Shadcn/ui
- **图表**: Recharts
- **编辑器**: Tiptap (基于 ProseMirror)
- **AI**: Kimi API (Moonshot AI)

### 后端

- **框架**: NestJS 11
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **缓存**: Redis
- **认证**: JWT
- **存储**: MinIO / AWS S3
- **AI**: Kimi API

## 项目结构

```
esblog/
├── frontEnd/          # Next.js 前端应用
│   ├── app/           # App Router 页面
│   ├── components/    # React 组件
│   │   ├── admin/     # 后台管理组件
│   │   ├── features/  # 功能组件
│   │   ├── layouts/   # 布局组件
│   │   └── ui/        # UI 组件
│   ├── lib/           # 工具函数和 API
│   │   ├── api/       # API 调用
│   │   ├── editor/    # 编辑器扩展
│   │   └── hooks/     # 自定义 Hooks
│   └── stores/        # Zustand 状态管理
│
├── backEnd/           # NestJS 后端应用
│   ├── src/
│   │   ├── modules/   # 功能模块
│   │   │   ├── ai/       # AI 模块 (Kimi)
│   │   │   ├── auth/      # 认证模块
│   │   │   ├── posts/     # 文章管理
│   │   │   ├── categories/# 分类管理
│   │   │   ├── tags/      # 标签管理
│   │   │   ├── uploads/   # 文件上传 (MinIO/S3)
│   │   │   ├── stats/     # 统计数据
│   │   │   ├── presence/   # 在线状态
│   │   │   └── site-config/# 站点配置
│   │   ├── common/     # 公共模块 (Guard, 过滤器等)
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
cd esblog
```

### 2. 配置环境变量

```bash
# 后端环境变量 (backEnd/.env)
cp backEnd/.env.example backEnd/.env
```

### 3. 启动基础设施

```bash
# 使用 Docker 启动 PostgreSQL、Redis、MinIO
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
cd ../frontEnd
pnpm dev
```

## 环境变量配置

### 后端 (.env)

```env
# 数据库
DATABASE_URL="postgresql://eblogroot:eblog102jikluo@localhost:5432/eblog"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_TOKEN_TTL_SECONDS=900
JWT_REFRESH_TOKEN_TTL_SECONDS=604800

# MinIO (对象存储)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=blog

# Kimi AI (AI 助手)
KIMI_API_KEY=your-kimi-api-key
KIMI_BASE_URL=https://api.moonshot.cn/v1
KIMI_MODEL=moonshot-v1-32k

# 服务端口
PORT=3001
```

## API 文档

启动后端服务后访问 Swagger 文档: `http://localhost:3001/api/docs`

详细 API 文档请查看 [backEnd/README.md](backEnd/README.md)

## 功能预览

### 前台

- 首页展示最新文章（瀑布流布局）
- 文章详情页，支持 Markdown/Tiptap 渲染
- 分类和标签归档
- 文章阅读量统计
- 归档时间线
- 侧边栏（分类、标签、归档、站点统计）
- AI 智能补全（写作辅助）

### 后台管理

- 管理员登录认证 (JWT)
- 文章 CRUD 操作（Tiptap 富文本编辑器）
- 分类和标签管理
- 文件上传管理（MinIO/S3）
- 数据统计面板
- AI 助手（标题生成、摘要生成、标签推荐等）
- 站点配置管理

## Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 开发指南

请阅读 [Agent.md](Agent.md) 了解更多开发规范和约束。

## License

MIT
