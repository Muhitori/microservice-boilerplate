FROM node:lts-alpine

WORKDIR /usr/src/app

# Install netcat for database connection checking
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy application code
COPY --chown=node:node . .


# Set environment variable for service name
ENV SERVICE_NAME=product-service

CMD ["npm", "start"]