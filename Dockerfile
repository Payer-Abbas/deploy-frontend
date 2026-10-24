# -------------------------------------------------
# 1️⃣  Builder stage – compile the React/Vite app
# -------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install only package metadata first (cached layer)
COPY package*.json ./
RUN npm ci          # install exact deps from lock file

# Copy source code
COPY . .

# Build the production bundle (creates ./dist)
RUN npm run build   # Vite’s default output folder is /dist

# -------------------------------------------------
# 2️⃣  Runtime stage – serve the static files with Nginx
# -------------------------------------------------
FROM nginx:stable-alpine AS runtime

# Remove the default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Custom Nginx config (HTTP→HTTPS + /api proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

# Use the default Nginx startup command
CMD ["nginx", "-g", "daemon off;"]
