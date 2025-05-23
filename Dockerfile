# Etapa 1: Instalação das dependências e geração do Prisma Client
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++ krb5-dev

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --legacy-peer-deps
RUN npx prisma generate

# Etapa 2: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npm run build

# Etapa 3: Imagem final para execução
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
