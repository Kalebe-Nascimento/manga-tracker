# Etapa 1: Instalação de dependências
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++ krb5-dev

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Etapa 2: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Verifica se a pasta public existe para evitar erros
RUN [ -d ./public ] && echo "public exists" || echo "public not found"

# Etapa 3: Runner com apenas o necessário
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/prisma ./prisma

EXPOSE ${PORT}
CMD ["npm", "start"]
