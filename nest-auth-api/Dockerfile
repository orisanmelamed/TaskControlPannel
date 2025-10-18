# --- base
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# --- deps
FROM base AS deps
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --omit=dev

# --- build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json nest-cli.json ./
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

# --- prod
FROM base AS prod
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
# A tiny startup that runs DB migrations, then serve
CMD sh -c "npx prisma generate && npx prisma migrate deploy && node dist/main.js"