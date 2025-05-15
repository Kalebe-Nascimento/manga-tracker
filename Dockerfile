# Etapa 1: Instalação das dependências
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
COPY prisma ./prisma

# Gere o Prisma Client depois de copiar o schema
RUN npx prisma generate

# Compile a aplicação
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
COPY --from=builder /app/.env ./.env

# Não precisa gerar prisma novamente aqui se já foi feito
# EXPOSE é opcional se o container for orquestrado via Compose
EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
