# VX-Blog 后端 API 文档

## 认证方式

- **匿名**: 无需认证，直接访问
- **管理员**: 需要 Bearer Token 认证（JWT）

---

## 1. 认证模块 (Auth)

### POST /auth/sessions
- **功能**: 管理员登录
- **权限**: 匿名
- **入参**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **返回**:
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "string",
      "username": "string",
      "role": "ADMIN | USER"
    }
  }
  ```

### POST /auth/sessions/refresh
- **功能**: 刷新 Access Token
- **权限**: 匿名
- **入参**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **返回**:
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "string",
      "username": "string",
      "role": "ADMIN | USER"
    }
  }
  ```

### DELETE /auth/sessions/current
- **功能**: 登出（删除当前会话）
- **权限**: 管理员
- **入参**: 无
- **返回**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### GET /auth/me
- **功能**: 获取当前登录用户信息
- **权限**: 管理员
- **入参**: 无
- **返回**:
  ```json
  {
    "id": "string",
    "username": "string",
    "role": "ADMIN | USER"
  }
  ```

---

## 2. 文章模块 (Posts)

### GET /posts
- **功能**: 获取公开文章列表（仅已发布）
- **权限**: 匿名
- **入参**:
  ```json
  {
    "categoryId": "string (可选)",
    "tagId": "string (可选)",
    "featured": "boolean (可选)",
    "search": "string (可选)",
    "page": "number (可选, 默认1)",
    "limit": "number (可选, 默认10)"
  }
  ```
- **返回**:
  ```json
  {
    "items": [{
      "id": "string",
      "title": "string",
      "slug": "string",
      "excerpt": "string | null",
      "coverImage": "string | null",
      "published": true,
      "featured": "boolean",
      "views": "number",
      "readingTime": "number | null",
      "publishedAt": "string | null",
      "createdAt": "string",
      "updatedAt": "string",
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string"
      } | null,
      "tags": [{
        "id": "string",
        "name": "string",
        "slug": "string"
      }]
    }],
    "meta": {
      "totalItems": "number",
      "itemCount": "number",
      "itemsPerPage": "number",
      "totalPages": "number",
      "currentPage": "number"
    }
  }
  ```

### GET /posts/:slug
- **功能**: 获取公开文章详情
- **权限**: 匿名
- **入参**: 无（slug通过路径参数）
- **返回**:
  ```json
  {
    "id": "string",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string | null",
    "coverImage": "string | null",
    "published": true,
    "featured": "boolean",
    "views": "number",
    "readingTime": "number | null",
    "publishedAt": "string | null",
    "createdAt": "string",
    "updatedAt": "string",
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string"
    } | null,
    "tags": [{
      "id": "string",
      "name": "string",
      "slug": "string"
    }]
  }
  ```

### POST /posts/:slug/views
- **功能**: 增加文章浏览量
- **权限**: 匿名
- **入参**: 无（slug通过路径参数）
- **返回**:
  ```json
  {
    "views": "number"
  }
  ```

### GET /admin/posts
- **功能**: 获取所有文章（管理员）
- **权限**: 管理员
- **入参**:
  ```json
  {
    "categoryId": "string (可选)",
    "tagId": "string (可选)",
    "featured": "boolean (可选)",
    "search": "string (可选)",
    "published": "boolean (可选)",
    "page": "number (可选, 默认1)",
    "limit": "number (可选, 默认10)"
  }
  ```
- **返回**: 同 GET /posts

### GET /admin/posts/:id
- **功能**: 获取文章详情（管理员）
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**: 同 GET /posts/:slug

### POST /admin/posts
- **功能**: 创建文章
- **权限**: 管理员
- **入参**:
  ```json
  {
    "title": "string (必填, 最大160字符)",
    "slug": "string (可选, 最大180字符)",
    "content": "string (必填)",
    "excerpt": "string (可选, 最大500字符)",
    "coverImage": "string (可选)",
    "published": "boolean (可选, 默认false)",
    "featured": "boolean (可选, 默认false)",
    "categoryId": "string (可选)",
    "tagIds": "string[] (可选)"
  }
  ```
- **返回**:
  ```json
  {
    "id": "string",
    "title": "string",
    "slug": "string",
    "content": "string",
    "excerpt": "string | null",
    "coverImage": "string | null",
    "published": "boolean",
    "featured": "boolean",
    "views": "number",
    "readingTime": "number | null",
    "publishedAt": "string | null",
    "createdAt": "string",
    "updatedAt": "string",
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string"
    } | null,
    "tags": [{
      "id": "string",
      "name": "string",
      "slug": "string"
    }]
  }
  ```

### PATCH /admin/posts/:id
- **功能**: 更新文章
- **权限**: 管理员
- **入参**: 同 POST /admin/posts（所有字段可选）
- **返回**: 同 POST /admin/posts

### DELETE /admin/posts/:id
- **功能**: 删除文章
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**:
  ```json
  {
    "message": "Post deleted successfully"
  }
  ```

---

## 3. 分类模块 (Categories)

### GET /categories
- **功能**: 获取公开分类列表
- **权限**: 匿名
- **入参**: 无
- **返回**:
  ```json
  [{
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string | null",
    "color": "string | null",
    "icon": "string | null",
    "sortOrder": "number",
    "postCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }]
  ```

### GET /admin/categories
- **功能**: 获取所有分类（管理员）
- **权限**: 管理员
- **入参**: 无
- **返回**: 同 GET /categories

### POST /admin/categories
- **功能**: 创建分类
- **权限**: 管理员
- **入参**:
  ```json
  {
    "name": "string (必填, 最大100字符)",
    "slug": "string (可选, 最大120字符)",
    "description": "string (可选, 最大500字符)",
    "color": "string (可选)",
    "icon": "string (可选)",
    "sortOrder": "number (可选, 默认0)"
  }
  ```
- **返回**:
  ```json
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string | null",
    "color": "string | null",
    "icon": "string | null",
    "sortOrder": "number",
    "postCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### PATCH /admin/categories/:id
- **功能**: 更新分类
- **权限**: 管理员
- **入参**: 同 POST /admin/categories（所有字段可选）
- **返回**: 同 POST /admin/categories

### DELETE /admin/categories/:id
- **功能**: 删除分类
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**:
  ```json
  {
    "message": "Category deleted successfully"
  }
  ```

---

## 4. 标签模块 (Tags)

### GET /tags
- **功能**: 获取公开标签列表（仅统计已发布文章的标签）
- **权限**: 匿名
- **入参**: 无
- **返回**:
  ```json
  [{
    "id": "string",
    "name": "string",
    "slug": "string",
    "color": "string | null",
    "postCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }]
  ```

### GET /admin/tags
- **功能**: 获取所有标签（管理员）
- **权限**: 管理员
- **入参**: 无
- **返回**: 同 GET /tags

### POST /admin/tags
- **功能**: 创建标签
- **权限**: 管理员
- **入参**:
  ```json
  {
    "name": "string (必填, 最大100字符)",
    "slug": "string (可选, 最大120字符)",
    "color": "string (可选)"
  }
  ```
- **返回**:
  ```json
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "color": "string | null",
    "postCount": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

### PATCH /admin/tags/:id
- **功能**: 更新标签
- **权限**: 管理员
- **入参**: 同 POST /admin/tags（所有字段可选）
- **返回**: 同 POST /admin/tags

### DELETE /admin/tags/:id
- **功能**: 删除标签
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**:
  ```json
  {
    "message": "Tag deleted successfully"
  }
  ```

---

## 5. 上传模块 (Uploads)

### POST /uploads
- **功能**: 上传文件到对象存储
- **权限**: 管理员
- **入参**: multipart/form-data
  ```json
  {
    "file": "binary (必填, 最大10MB)"
  }
  ```
- **返回**:
  ```json
  {
    "id": "string",
    "filename": "string",
    "originalName": "string",
    "mimeType": "string",
    "size": "number",
    "url": "string",
    "bucket": "string",
    "provider": "string",
    "createdAt": "string"
  }
  ```

### GET /uploads/:id
- **功能**: 获取上传文件信息
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**: 同 POST /uploads

### DELETE /uploads/:id
- **功能**: 删除上传文件
- **权限**: 管理员
- **入参**: 无（id通过路径参数）
- **返回**:
  ```json
  {
    "message": "File deleted successfully"
  }
  ```

---

## 6. 统计模块 (Stats)

### GET /stats/site
- **功能**: 获取公开站点统计
- **权限**: 匿名
- **入参**: 无
- **返回**:
  ```json
  {
    "totalPosts": "number",
    "totalCategories": "number",
    "totalTags": "number"
  }
  ```

### GET /admin/stats/dashboard
- **功能**: 获取管理员仪表盘统计
- **权限**: 管理员
- **入参**: 无
- **返回**:
  ```json
  {
    "totalPosts": "number",
    "publishedPosts": "number",
    "draftPosts": "number",
    "totalViews": "number",
    "totalCategories": "number",
    "totalTags": "number",
    "totalUsers": "number"
  }
  ```

---

## 7. 在线状态模块 (Presence)

### PUT /presence/current
- **功能**: 发送访客心跳（保持在线状态）
- **权限**: 匿名
- **入参**:
  ```json
  {
    "visitorId": "string (必填)"
  }
  ```
- **返回**:
  ```json
  {
    "visitorId": "string",
    "onlineUsers": "number"
  }
  ```

---

## 8. 健康检查 (Health)

### GET /health
- **功能**: 服务健康检查
- **权限**: 匿名
- **入参**: 无
- **返回**:
  ```json
  {
    "message": "vx-blog backend is running"
  }
  ```

---

## 接口总览

| 方法 | 路径 | 功能 | 权限 |
|-----|------|------|------|
| POST | /auth/sessions | 管理员登录 | 匿名 |
| POST | /auth/sessions/refresh | 刷新Token | 匿名 |
| DELETE | /auth/sessions/current | 登出 | 管理员 |
| GET | /auth/me | 获取当前用户 | 管理员 |
| GET | /posts | 获取公开文章列表 | 匿名 |
| GET | /posts/:slug | 获取公开文章详情 | 匿名 |
| POST | /posts/:slug/views | 增加浏览量 | 匿名 |
| GET | /admin/posts | 获取所有文章 | 管理员 |
| GET | /admin/posts/:id | 获取文章详情 | 管理员 |
| POST | /admin/posts | 创建文章 | 管理员 |
| PATCH | /admin/posts/:id | 更新文章 | 管理员 |
| DELETE | /admin/posts/:id | 删除文章 | 管理员 |
| GET | /categories | 获取公开分类 | 匿名 |
| GET | /admin/categories | 获取所有分类 | 管理员 |
| POST | /admin/categories | 创建分类 | 管理员 |
| PATCH | /admin/categories/:id | 更新分类 | 管理员 |
| DELETE | /admin/categories/:id | 删除分类 | 管理员 |
| GET | /tags | 获取公开标签 | 匿名 |
| GET | /admin/tags | 获取所有标签 | 管理员 |
| POST | /admin/tags | 创建标签 | 管理员 |
| PATCH | /admin/tags/:id | 更新标签 | 管理员 |
| DELETE | /admin/tags/:id | 删除标签 | 管理员 |
| POST | /uploads | 上传文件 | 管理员 |
| GET | /uploads/:id | 获取文件信息 | 管理员 |
| DELETE | /uploads/:id | 删除文件 | 管理员 |
| GET | /stats/site | 获取站点统计 | 匿名 |
| GET | /admin/stats/dashboard | 获取仪表盘统计 | 管理员 |
| PUT | /presence/current | 发送心跳 | 匿名 |
| GET | /health | 健康检查 | 匿名 |

---

## 认证流程

```
1. 登录获取Token
   POST /auth/sessions
   → 返回 accessToken (15分钟有效)
   → 返回 refreshToken (7天有效)

2. 访问受保护接口
   Header: Authorization: Bearer <accessToken>

3. Token过期处理
   POST /auth/sessions/refresh
   → 返回新的 accessToken 和 refreshToken

4. 登出
   DELETE /auth/sessions/current
   → 删除Redis会话，下次需重新登录
```

---

## 角色说明

| 角色 | 权限 |
|-----|------|
| USER | 前台内容浏览（当前系统未开放） |
| ADMIN | 全部权限（前台浏览 + 后台管理） |
