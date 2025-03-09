FROM node:lts-alpine
WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy application code
COPY --chown=node:node . .

CMD ["npm", "start"]