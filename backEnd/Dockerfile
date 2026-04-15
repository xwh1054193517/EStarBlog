# ---------- deps ----------
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# 生成 Prisma Client（输出到 src/generated/prisma）
RUN pnpm run prisma:generate

# 构建 NestJS
RUN pnpm run build

# ---------- production ----------
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Prisma schema / migrations
COPY prisma ./prisma

# NestJS 构建产物
COPY --from=builder /app/dist ./dist

# 保留 Prisma 自定义输出目录
COPY --from=builder /app/src/generated ./src/generated


EXPOSE 3001

CMD ["sh", "-c", "pnpm run prisma:migrate:deploy && node dist/main"]