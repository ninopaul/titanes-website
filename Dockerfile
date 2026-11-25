# Keep the build and the deployed runtime on the same patched Node version.
ARG NODE_IMAGE=node:22.23.5-alpine
FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund --maxsockets=8 --fetch-retries=4

# Build args for env vars needed at build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM ${NODE_IMAGE} AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
