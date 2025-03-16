FROM node:lts-alpine

WORKDIR /usr/src/app

# Accept NODE_ENV as build argument with production as default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy package files
COPY package*.json ./

# Install dependencies (include dev dependencies in development mode)
RUN npm install

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

COPY --chown=node:node . .
RUN npm run build

# Use different start commands based on environment
CMD if [ "$NODE_ENV" = "production" ] ; then npm run start ; else npm run start:dev ; fi