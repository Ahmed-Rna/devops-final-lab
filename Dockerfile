# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
FROM base as dependencies
RUN npm ci

# Build production image
FROM base as production

# Set NODE_ENV
ENV NODE_ENV=production

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Define environment variables with defaults
ENV PORT=3000
ENV MONGODB_URI=mongodb://localhost:27017/pharmacy

# Start the application
CMD ["node", "index.js"]