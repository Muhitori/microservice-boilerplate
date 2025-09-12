# -------- Base Dependencies Stage --------
  FROM node:lts-alpine AS deps

  WORKDIR /usr/src/app
  RUN corepack enable
  
  # Copy only dependency files first
  COPY package.json yarn.lock eslint.config.mjs nx.json tsconfig.base.json ./
  COPY libs ./libs
  COPY apps ./apps
  
  # Install ALL dependencies once (dev + prod)
  RUN yarn config set nodeLinker node-modules
  RUN yarn install --immutable
  
  # -------- Build Stage --------
  FROM deps AS builder
  
  # Build *only* the target service
  ARG SERVICE
  RUN yarn nx build ${SERVICE}
  
  # Focus only on production deps for the service
  RUN yarn workspaces focus @muhitori/${SERVICE} --production
  
  # -------- Runtime Stage --------
  FROM node:lts-alpine AS runtime
  
  WORKDIR /usr/src/app
  RUN corepack enable
  
  ARG SERVICE
  
  # Copy focused node_modules (already pruned for the service)
  COPY --from=builder /usr/src/app/node_modules ./node_modules
  
  # Copy built dist
  COPY --from=builder /usr/src/app/apps/${SERVICE}/dist ./dist
  
  # Copy package files (so tools like NestJS can resolve metadata if needed)
  COPY --from=builder /usr/src/app/package.json ./package.json
  COPY --from=builder /usr/src/app/yarn.lock ./yarn.lock
  
  CMD ["node", "dist/main.js"]