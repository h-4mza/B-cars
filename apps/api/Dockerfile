FROM node:20-alpine AS builder
RUN npm install -g pnpm@9.0.0
WORKDIR /app

# Copy all source files first (excluding folders ignored in .dockerignore)
COPY . .

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Generate Prisma Client and build the applications
RUN pnpm db:generate
RUN pnpm --filter @repo/shared build
RUN pnpm --filter api build

# Prune devDependencies for production runtime
# RUN pnpm install --prod --frozen-lockfile

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and built bundles from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000
CMD ["node", "apps/api/dist/main"]
