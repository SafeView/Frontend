# Frontend: build with node + serve with nginx
# Build stage
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Use pnpm if lockfile exists
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Runtime stage
FROM nginx:alpine
# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
