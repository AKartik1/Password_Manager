# Use Nginx to serve static files
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy all static files to the nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 4000 for serving
EXPOSE 4000

# Replace default config to use port 4000
RUN sed -i 's/80;/4000;/g' /etc/nginx/conf.d/default.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
