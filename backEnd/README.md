<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Es-Blog Backend

基于 NestJS + Prisma + PostgreSQL 的博客后端 API 服务。

## 技术栈

| 技术       | 说明                   |
| ---------- | ---------------------- |
| NestJS     | Node.js 企业级后端框架 |
| Prisma     | TypeScript ORM         |
| PostgreSQL | 关系型数据库           |
| Redis      | 会话存储 & 在线状态    |
| JWT        | 身份认证               |
| Swagger    | API 文档               |
| Kimi AI    | 智能写作辅助           |
| MinIO/S3   | 对象存储              |

---

## 系统架构

```mermaid
graph TB
    subgraph Client
        WEB[Web Frontend]
        MOBILE[Mobile App]
    end

    subgraph Gateway
        NGINX[Reverse Proxy]
    end

    subgraph Backend
        API[NestJS API<br/>:3001]
        SWAGGER[Swagger Docs<br/>/api/docs]
    end

    subgraph Data
        PG[(PostgreSQL<br/>Database)]
        REDIS[(Redis<br/>Session & Presence)]
        MINIO[(MinIO<br/>File Storage)]
    end

    WEB --> NGINX
    MOBILE --> NGINX
    NGINX --> API
    API --> PG
    API --> REDIS
    API --> MINIO
```

---

## 模块列表

| 模块 | 功能 |
|------|------|
| **ai** | Kimi AI 对话和内容补全 |
| **auth** | JWT 认证 & 会话管理 |
| **posts** | 文章 CRUD |
| **categories** | 分类管理 |
| **tags** | 标签管理 |
| **uploads** | 文件上传 (MinIO) |
| **stats** | 数据统计 |
| **presence** | 在线状态追踪 |
| **site-config** | 站点配置 |
| **profile** | 用户资料 |

---

## API 列表

### AI 接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | /ai/chat | AI 对话 (Kimi) | 管理员 |
| POST | /ai/complete | AI 内容补全 | 管理员 |

### 认证接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | /auth/sessions | 管理员登录 | 匿名 |
| POST | /auth/sessions/refresh | 刷新Token | 匿名 |
| DELETE | /auth/sessions/current | 登出 | 管理员 |
| GET | /auth/me | 获取当前用户 | 管理员 |

### 文章接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | /posts | 获取公开文章列表 | 匿名 |
| GET | /posts/:slug | 获取公开文章详情 | 匿名 |
| POST | /posts/:slug/views | 增加浏览量 | 匿名 |
| GET | /posts/archives | 获取文章归档 | 匿名 |
| GET | /admin/posts | 获取所有文章 | 管理员 |
| POST | /admin/posts | 创建文章 | 管理员 |
| PATCH | /admin/posts/:id | 更新文章 | 管理员 |
| DELETE | /admin/posts/:id | 删除文章 | 管理员 |

### 分类接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | /categories | 获取公开分类 | 匿名 |
| GET | /admin/categories | 获取所有分类 | 管理员 |
| POST | /admin/categories | 创建分类 | 管理员 |
| PATCH | /admin/categories/:id | 更新分类 | 管理员 |
| DELETE | /admin/categories/:id | 删除分类 | 管理员 |

### 标签接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | /tags | 获取公开标签 | 匿名 |
| GET | /admin/tags | 获取所有标签 | 管理员 |
| POST | /admin/tags | 创建标签 | 管理员 |
| PATCH | /admin/tags/:id | 更新标签 | 管理员 |
| DELETE | /admin/tags/:id | 删除标签 | 管理员 |

### 上传接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| POST | /uploads | 上传文件 | 管理员 |
| GET | /uploads/:id | 获取文件信息 | 管理员 |
| DELETE | /uploads/:id | 删除文件 | 管理员 |
| GET | /uploads/:objectName/presigned-url | 获取预签名URL | 管理员 |

### 统计接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| GET | /stats/site | 获取站点统计 | 匿名 |
| GET | /admin/stats/dashboard | 获取仪表盘统计 | 管理员 |

### 其他接口

| 方法 | 路径 | 功能 | 权限 |
|------|------|------|------|
| PUT | /presence/current | 发送心跳 | 匿名 |
| GET | /health | 健康检查 | 匿名 |

---

## AI 接口详情

### POST /ai/chat

AI 对话接口，使用 Kimi (Moonshot AI) 模型。

**请求体：**
```json
{
  "messages": [
    { "role": "system", "content": "你是一个助手" },
    { "role": "user", "content": "你好" }
  ],
  "model": "moonshot-v1-32k",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

**响应：**
```json
{
  "content": "你好！有什么可以帮助你的吗？",
  "tokensUsed": 50
}
```

### POST /ai/complete

AI 内容补全接口，根据上下文生成写作建议。

**请求体：**
```json
{
  "content": "文章正文内容...",
  "cursorPosition": 100,
  "style": "专业"
}
```

**响应：**
```json
{
  "suggestions": [
    { "text": "补全内容...", "confidence": 0.8 }
  ],
  "tokensUsed": 30
}
```

---

## 环境变量

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/vxblog"

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

# Kimi AI
KIMI_API_KEY=your-kimi-api-key
KIMI_BASE_URL=https://api.moonshot.cn/v1
KIMI_MODEL=moonshot-v1-32k

# 服务端口
PORT=3001
```

---

## 项目启动

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm run prisma:generate

# 数据库迁移
pnpm run prisma:migrate

# 开发模式
pnpm run start:dev

# 生产模式
pnpm run build
pnpm run start:prod
```

---

## Docker 部署

```bash
# 构建镜像
docker build -t es-blog-backend .

# 运行容器
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  es-blog-backend
```

---

## API 文档

启动服务后访问: http://localhost:3001/api/docs

---

## License

MIT
