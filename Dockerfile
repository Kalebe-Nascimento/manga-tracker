FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências de build necessárias para node-gyp
RUN apk add --no-cache python3 make g++ krb5-dev

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build

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
