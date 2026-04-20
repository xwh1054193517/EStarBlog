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
COPY tsconfig.json next.config.ts postcss.config.mjs ./
COPY public ./public
COPY app ./app
COPY lib ./lib
COPY components ./components
COPY hooks ./hooks
COPY stores ./stores

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN pnpm run build

# ---------- production ----------
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
EXPOSE 3000

CMD ["node", "server.js"]