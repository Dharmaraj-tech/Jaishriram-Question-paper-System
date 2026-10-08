# Multi-stage Dockerfile for Jaishriram College Questionpaper Management System

# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy root package files
COPY package*.json ./

# Copy backend package and install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy backend source code
COPY server ./server

# Copy built frontend dist folder from Stage 1 into root dist
COPY --from=frontend-builder /app/dist ./dist

# Create persistent storage directories
RUN mkdir -p /app/server/data /app/server/uploads

EXPOSE 5000

CMD ["node", "server/src/index.js"]
