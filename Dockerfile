FROM node:18-alpine

WORKDIR /app

# Build arguments
ARG PORT=3000
ARG MONGODB_URI
ARG JWT_SECRET
ARG STAGE=production

# Set environment variables
ENV PORT=$PORT
ENV MONGODB_URI=$MONGODB_URI
ENV JWT_SECRET=$JWT_SECRET
ENV STAGE=$STAGE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
