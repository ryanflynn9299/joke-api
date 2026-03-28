# Stage 1: Build the Vite application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Enable corepack to use pnpm
RUN corepack enable

# Copy package.json and pnpm-lock.yaml first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the frontend application
RUN pnpm build

# Stage 2: Serve the static files using NGINX
FROM nginx:alpine

# Copy the built files from the builder stage to NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for NGINX
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
