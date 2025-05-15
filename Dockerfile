# Etapa 1: Instalação de dependências
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache python3 make g++ krb5-dev

# Etapa 1: Instalação de dependências em ambiente separado
FROM node:18-alpine AS deps
WORKDIR /app

# Instala dependências nativas apenas se forem realmente necessárias
RUN apk add --no-cache python3 make g++ krb5-dev

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Etapa 2: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 3: Imagem final para execução (mais leve possível)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o necessário para rodar a app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
