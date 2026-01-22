# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy build from previous stage
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Serve the app
CMD ["serve", "-s", "dist", "-l", "5173"]
