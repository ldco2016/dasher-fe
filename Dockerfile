# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install && npm run build  --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV development

ARG REACT_APP_CURRENT_COMMIT_SHA1

ENV REACT_APP_CURRENT_COMMIT_SHA1=$REACT_APP_CURRENT_COMMIT_SHA1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["entrypoint.sh"]

CMD ["yarn", "start"]