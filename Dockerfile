# Use official Nginx image
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your static files into Nginx's public directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY copy.svg /usr/share/nginx/html/

# Optional: custom Nginx config to run on port 4000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4000
EXPOSE 4000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
