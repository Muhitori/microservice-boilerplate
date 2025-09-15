# -------- Base Dependencies Stage --------
  FROM node:lts-alpine AS deps

  WORKDIR /usr/src/app
  RUN corepack enable
  
  # Copy only dependency files first
  COPY package.json yarn.lock eslint.config.mjs nx.json tsconfig.base.json ./
  COPY libs ./libs
  COPY apps/${SERVICE} ./apps/${SERVICE}
  COPY packages ./packages
  
  # Install ALL dependencies once (dev + prod)
  RUN yarn config set nodeLinker node-modules
  RUN yarn install --immutable
  
  # -------- Build Stage --------
  FROM deps AS builder
  
  # Build *only* the target service
  ARG SERVICE
  RUN yarn nx build ${SERVICE} --skip-nx-cache
  
  # Focus only on production deps for the service
  RUN yarn workspaces focus @muhitori/${SERVICE} --production \
  && yarn cache clean \
  && rm -rf node_modules/**/test node_modules/**/docs node_modules/**/examples
  
  # -------- Runtime Stage --------
  FROM node:lts-alpine AS runtime
  
  WORKDIR /usr/src/app
  RUN corepack enable
  
  ARG SERVICE
  
  COPY --from=builder /usr/src/app/node_modules ./node_modules
  COPY --from=builder /usr/src/app/apps/${SERVICE}/dist ./dist
  COPY --from=builder /usr/src/app/dist/libs ./node_modules/@muhitori

  COPY --from=builder /usr/src/app/apps/${SERVICE}/package.json ./package.json
  
  CMD ["node", "dist/main.js"]