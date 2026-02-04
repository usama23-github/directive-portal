# Install dependencies only when needed
FROM node:14.16.0-alpine3.13

WORKDIR /app
COPY . .

RUN npm install

# Build the Next.js app
# FROM node:23-alpine3.20 AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# Production image, copy only needed files
# FROM node:23-alpine3.20 AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# EXPOSE 3000

# CMD ["npm", "start"]
