# 🎼 Dante Voice Chip Orchestra - Docker Development Environment
# Afrocentric excellence in containerized form

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better caching
COPY package*.json yarn.lock* ./
COPY frontend/package*.json ./frontend/

# Install root dependencies
RUN npm install

# Install workspace dependencies
WORKDIR /app/frontend
RUN npm install

# Install Python for agent (if needed in container)
RUN apk add --no-cache python3 py3-pip

# Back to root
WORKDIR /app

# Copy source code
COPY . .

# Create directories for logs (mounted from host)
RUN mkdir -p /app/logs /app/data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/logs || exit 1

# Default command - can be overridden
CMD ["npm", "run", "dev"]