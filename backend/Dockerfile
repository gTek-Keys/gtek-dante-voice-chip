# 🎼 Dante Voice Chip Backend - Ubuntu-powered API
FROM node:18-alpine

# Ubuntu philosophy: "I am because we are"
LABEL maintainer="Dante Voice Chip Orchestra"
LABEL description="Backend API service for terminal monitoring with Afrocentric excellence"

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with Ubuntu spirit
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user for security (Ubuntu principle)
RUN addgroup -g 1001 -S dante && \
    adduser -S dante -u 1001 -G dante

# Set ownership to dante user
RUN chown -R dante:dante /app
USER dante

# Expose the API port
EXPOSE 3001

# Health check command
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Ubuntu wisdom: Start with purpose
CMD ["node", "index.js"]