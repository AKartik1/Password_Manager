# Use Nginx to serve static files
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend build to nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4000 for serving
EXPOSE 4000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]