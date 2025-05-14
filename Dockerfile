# Etapa 1: Instalação de dependências
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++ krb5-dev

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Etapa 2: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Se estiver usando Prisma e a pasta existir:
# COPY prisma ./prisma

RUN npx prisma generate
RUN npm run build

# Etapa 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

CMD ["node_modules/.bin/next", "start"]
