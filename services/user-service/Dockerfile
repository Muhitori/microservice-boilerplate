FROM node:lts-alpine

WORKDIR /usr/src/app

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

# Accept NODE_ENV as build argument with production as default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# Install dependencies (include dev dependencies in development mode)
RUN npm install

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

COPY --chown=node:node . .

RUN mkdir -p src/proto dist/proto
RUN cp -r src/proto/* dist/proto/

RUN npm run build

# Set environment variable for service name
ENV SERVICE_NAME=user-service

# Use different start commands based on environment
CMD if [ "$NODE_ENV" = "production" ] ; then npm run start ; else npm run start:dev ; fi