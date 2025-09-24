# Multi-stage Dockerfile for MCP ID Generator
# Author: Clancy Lee <clancylee.818@gmail.com>
# Repository: https://github.com/liqiongchao/mcp-id-generator

# Builder stage: install dependencies and build the project
FROM node:lts-alpine AS builder
WORKDIR /app

# Copy project files
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src

# Install all dependencies (including dev) and build
RUN npm ci && npm run build

# Runtime stage: install production dependencies only, skipping build scripts
FROM node:lts-alpine AS runtime
WORKDIR /app

# Copy package files and install production dependencies without running scripts
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built output from builder
COPY --from=builder /app/build ./build

# Default entrypoint to start the MCP server
ENTRYPOINT ["node", "build/index.js"]
