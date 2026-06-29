FROM node:20-alpine AS builder
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy all source files first (excluding folders ignored in .dockerignore)
COPY . .

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Build applications
RUN pnpm --filter @repo/shared build
RUN pnpm --filter web build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy standalone output and public/static assets
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
