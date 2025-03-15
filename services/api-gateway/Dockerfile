FROM node:lts-alpine
WORKDIR /usr/src/app

# Accept NODE_ENV as build argument with production as default
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./

# Install dependencies (include dev dependencies in development mode)
RUN if [ "$NODE_ENV" = "production" ] ; then npm install --force --only=production ; else npm install --force ; fi

# Copy application code
COPY --chown=node:node . .

# Use different start commands based on environment
CMD if [ "$NODE_ENV" = "production" ] ; then npm run start ; else npm run start:dev ; fi