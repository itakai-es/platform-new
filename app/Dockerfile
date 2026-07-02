# ============================================
# Etapa build
# ============================================
FROM node:20-alpine AS builder

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG NUXT_PUBLIC_API_BASE=/api
ARG NUXT_PUBLIC_USE_REAL_BACKEND=true
ARG NUXT_PUBLIC_SHOW_DEMO_BUTTONS=true
ARG NUXT_PUBLIC_GOOGLE_CLIENT_ID=

ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_USE_REAL_BACKEND=$NUXT_PUBLIC_USE_REAL_BACKEND
ENV NUXT_PUBLIC_SHOW_DEMO_BUTTONS=$NUXT_PUBLIC_SHOW_DEMO_BUTTONS
ENV NUXT_PUBLIC_GOOGLE_CLIENT_ID=$NUXT_PUBLIC_GOOGLE_CLIENT_ID

RUN pnpm build

# ============================================
# Etapa runtime
# ============================================
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./output

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "output/server/index.mjs"]
