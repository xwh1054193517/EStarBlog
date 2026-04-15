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
        S3[(AWS S3<br/>File Storage)]
    end

    WEB --> NGINX
    MOBILE --> NGINX
    NGINX --> API
    API --> PG
    API --> REDIS
    API --> S3
```

---

---

## 认证流程

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Redis
    participant DB

    Client->>API: POST /api/v1/auth/sessions<br/>{username, password}
    API->>DB: 查询用户
    DB-->>API: User
    API->>API: bcrypt.compare(password)
    API->>Redis: SET auth:session:{sessionId}
    API-->>Client: {accessToken, refreshToken}

    Client->>API: GET /admin/posts<br/>Authorization: Bearer {token}
    API->>API: JWT verify
    API->>Redis: GET auth:session:{sessionId}
    Redis-->>API: Session
    API-->>Client: Response

    Note over Client,API: Token 过期时
    Client->>API: POST /api/v1/auth/sessions/refresh<br/>{refreshToken}
    API->>Redis: 验证会话
    Redis-->>API: Session
    API->>Redis: 更新会话
    API-->>Client: {accessToken, refreshToken}
```

---

## 模块关系

```mermaid
graph LR
    subgraph Modules
        AUTH[Auth Module<br/>认证 & 会话]
        POSTS[Posts Module<br/>文章管理]
        CATS[Categories Module<br/>分类管理]
        TAGS[Tags Module<br/>标签管理]
        UPLOADS[Uploads Module<br/>文件上传]
        STATS[Stats Module<br/>数据统计]
        PRESENCE[Presence Module<br/>在线状态]
        HEALTH[Health Module<br/>健康检查]
    end

    subgraph Guards
        JWT[JwtAuthGuard]
        ROLES[RolesGuard]
    end

    AUTH --> JWT
    POSTS --> JWT
    POSTS --> ROLES
    CATS --> JWT
    CATS --> ROLES
    TAGS --> JWT
    TAGS --> ROLES
    UPLOADS --> JWT
    UPLOADS --> ROLES
    STATS --> JWT
    STATS --> ROLES
```

---

## API 分组

```mermaid
flowchart LR
    subgraph 公开接口
        PUB1[GET /posts]
        PUB2[GET /posts/:slug]
        PUB3[POST /posts/:slug/views]
        PUB4[GET /categories]
        PUB5[GET /tags]
        PUB6[GET /stats/site]
        PUB7[PUT /presence/current]
        PUB8[POST /auth/sessions]
        PUB9[POST /auth/sessions/refresh]
        PUB10[GET /health]
    end

    subgraph 管理接口
        ADMIN1[POST /admin/posts]
        ADMIN2[PATCH /admin/posts/:id]
        ADMIN3[DELETE /admin/posts/:id]
        ADMIN4[POST /admin/categories]
        ADMIN5[PATCH /admin/categories/:id]
        ADMIN6[DELETE /admin/categories/:id]
        ADMIN7[POST /admin/tags]
        ADMIN8[PATCH /admin/tags/:id]
        ADMIN9[DELETE /admin/tags/:id]
        ADMIN10[POST /uploads]
        ADMIN11[GET /uploads/:id]
        ADMIN12[DELETE /uploads/:id]
        ADMIN13[GET /admin/stats/dashboard]
        ADMIN14[DELETE /auth/sessions/current]
        ADMIN15[GET /auth/me]
    end

    PUB1 ~~~ PUB2 ~~~ PUB3 ~~~ PUB4 ~~~ PUB5 ~~~ PUB6 ~~~ PUB7 ~~~ PUB8 ~~~ PUB9 ~~~ PUB10
    ADMIN1 ~~~ ADMIN2 ~~~ ADMIN3 ~~~ ADMIN4 ~~~ ADMIN5 ~~~ ADMIN6 ~~~ ADMIN7 ~~~ ADMIN8 ~~~ ADMIN9 ~~~ ADMIN10 ~~~ ADMIN11 ~~~ ADMIN12 ~~~ ADMIN13 ~~~ ADMIN14 ~~~ ADMIN15
```

---

## 在线状态追踪

```mermaid
graph TB
    subgraph Redis
        ZSET["ZSET: presence:visitors<br/>Score: timestamp<br/>Member: visitorId"]
        KEY["String: presence:visitor:{id}<br/>TTL: 90s"]
    end

    subgraph 用户访问流程
        V1["访客A 发送心跳"]
        V2["ZADD 更新分数"]
        V3["SET 设置独立key"]
        V4["cleanup 清理过期"]
        V5["返回在线人数"]
    end

    V1 --> V2 --> V3 --> V4 --> V5
```

---

## 环境变量

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vxblog"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_TOKEN_TTL_SECONDS=900
JWT_REFRESH_TOKEN_TTL_SECONDS=604800

# AWS S3
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Server
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
docker build -t vx-blog .

# 运行容器
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  vx-blog
```

---

## API 文档

启动服务后访问: http://localhost:3001/api/docs

---

## 接口总览

| 方法   | 路径                   | 功能             | 权限   |
| ------ | ---------------------- | ---------------- | ------ |
| POST   | /auth/sessions         | 管理员登录       | 匿名   |
| POST   | /auth/sessions/refresh | 刷新Token        | 匿名   |
| DELETE | /auth/sessions/current | 登出             | 管理员 |
| GET    | /auth/me               | 获取当前用户     | 管理员 |
| GET    | /posts                 | 获取公开文章列表 | 匿名   |
| GET    | /posts/:slug           | 获取公开文章详情 | 匿名   |
| POST   | /posts/:slug/views     | 增加浏览量       | 匿名   |
| GET    | /admin/posts           | 获取所有文章     | 管理员 |
| POST   | /admin/posts           | 创建文章         | 管理员 |
| PATCH  | /admin/posts/:id       | 更新文章         | 管理员 |
| DELETE | /admin/posts/:id       | 删除文章         | 管理员 |
| GET    | /categories            | 获取公开分类     | 匿名   |
| GET    | /admin/categories      | 获取所有分类     | 管理员 |
| POST   | /admin/categories      | 创建分类         | 管理员 |
| PATCH  | /admin/categories/:id  | 更新分类         | 管理员 |
| DELETE | /admin/categories/:id  | 删除分类         | 管理员 |
| GET    | /tags                  | 获取公开标签     | 匿名   |
| GET    | /admin/tags            | 获取所有标签     | 管理员 |
| POST   | /admin/tags            | 创建标签         | 管理员 |
| PATCH  | /admin/tags/:id        | 更新标签         | 管理员 |
| DELETE | /admin/tags/:id        | 删除标签         | 管理员 |
| POST   | /uploads               | 上传文件         | 管理员 |
| GET    | /uploads/:id           | 获取文件信息     | 管理员 |
| DELETE | /uploads/:id           | 删除文件         | 管理员 |
| GET    | /stats/site            | 获取站点统计     | 匿名   |
| GET    | /admin/stats/dashboard | 获取仪表盘统计   | 管理员 |
| PUT    | /presence/current      | 发送心跳         | 匿名   |
| GET    | /health                | 健康检查         | 匿名   |

---

## License

MIT
