FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./

FROM base as dependencies
RUN npm ci

FROM base as production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "index.js"]
