# Multi-stage build for React application
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage with Nginx
FROM nginx:1.25-alpine AS production

# Create a non-root user for security
RUN addgroup -g 1001 -S nginxgroup && \
    adduser -u 1001 -S nginxuser -G nginxgroup

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Change ownership of nginx directories
#RUN chown -R nginxuser:nginxgroup /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
#USER nginxuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]



# # Multi-stage build for React application
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM nginx:1.25-alpine
# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# # Multi-stage build for React application
# # Stage 1: Build stage
# FROM node:18-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy package files first (for better caching)
# COPY package*.json ./

# # Install dependencies
# RUN npm ci --only=production --silent

# # Copy source code
# COPY . .

# # Build the application
# RUN npm run build

# # Stage 2: Production stage with Nginx
# FROM nginx:1.25-alpine AS production

# # Create a non-root user for security
# RUN addgroup -g 1001 -S nginxgroup && \
#     adduser -u 1001 -S nginxuser -G nginxgroup

# # Create directories with proper permissions for non-root user
# RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run/nginx && \
#     chown -R nginxuser:nginxgroup /var/cache/nginx /var/log/nginx /var/run/nginx

# # Copy custom nginx configuration
# COPY <<EOF /etc/nginx/conf.d/default.conf
# server {
#     listen 80;
#     server_name localhost;
#     root /usr/share/nginx/html;
#     index index.html;

#     # Gzip compression
#     gzip on;
#     gzip_vary on;
#     gzip_min_length 1024;
#     gzip_comp_level 6;
#     gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

#     # Security headers
#     add_header X-Frame-Options "SAMEORIGIN" always;
#     add_header X-Content-Type-Options "nosniff" always;
#     add_header X-XSS-Protection "1; mode=block" always;
#     add_header Referrer-Policy "strict-origin-when-cross-origin" always;

#     # Handle React Router (SPA)
#     location / {
#         try_files \$uri \$uri/ /index.html;
#     }

#     # Cache static assets
#     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
#         expires 1y;
#         add_header Cache-Control "public, immutable";
#     }

#     # Health check endpoint
#     location /health {
#         access_log off;
#         return 200 "healthy\n";
#         add_header Content-Type text/plain;
#     }
# }
# EOF

# # Create custom nginx.conf for non-root user
# COPY <<EOF /etc/nginx/nginx.conf
# worker_processes auto;
# error_log /var/log/nginx/error.log notice;
# pid /var/run/nginx/nginx.pid;

# events {
#     worker_connections 1024;
# }

# http {
#     include /etc/nginx/mime.types;
#     default_type application/octet-stream;

#     log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
#                     '\$status \$body_bytes_sent "\$http_referer" '
#                     '"\$http_user_agent" "\$http_x_forwarded_for"';

#     access_log /var/log/nginx/access.log main;

#     sendfile on;
#     tcp_nopush on;
#     keepalive_timeout 65;

#     include /etc/nginx/conf.d/*.conf;
# }
# EOF

# # Copy built application from builder stage
# COPY --from=builder /app/build /usr/share/nginx/html

# # Change ownership of nginx directories
# RUN chown -R nginxuser:nginxgroup /var/cache/nginx /var/run/nginx /var/log/nginx /usr/share/nginx/html

# # Switch to non-root user
# USER nginxuser

# # Expose port
# EXPOSE 80

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#     CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]