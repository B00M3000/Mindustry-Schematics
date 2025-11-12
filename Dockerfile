# Multi-stage Dockerfile for Mindustry Schematics SvelteKit App

# Stage 1: Dependencies and Build
FROM node:22-alpine AS builder

# node-canvas compatibility with alpine - install all required dependencies
RUN apk update && apk add \
    build-base \
    g++ \
    cairo-dev \
    pango-dev \
    giflib-dev \
    libjpeg-turbo-dev \
    pixman-dev \
    pkgconfig \
    python3 \
    make \
    py3-setuptools

# Install pnpm globally and node-gyp for native module compilation
RUN npm install -g pnpm node-gyp

# Set working directory
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with explicit rebuild of native modules
RUN pnpm install --frozen-lockfile

# Copy source code (needed before rebuild for proper context)
COPY . .
COPY .env.build .env

# Rebuild canvas with full context after copying source
RUN pnpm rebuild canvas

# Build the application
RUN pnpm run build

RUN pnpm prune --production

FROM node:22-alpine

# Install runtime dependencies for canvas
RUN apk update && apk add \
    cairo \
    pango \
    giflib \
    libjpeg-turbo \
    pixman

WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
# COPY package.json .
# COPY /static ./static

# Temporary full copy consider above...
COPY . .
COPY .env.build .env

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 3000
ENV NODE_ENV=production

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD [ "node", "-r", "dotenv/config", "build" ]
