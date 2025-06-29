# ────────────────────────── build a tiny static image ──────────────────────────
FROM nginx:alpine

# clean out the default html that ships with the image
RUN rm -rf /usr/share/nginx/html/*

# copy *only* the static assets you need

# Copy frontend build to nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# drop in the custom server block that listens on 4000
COPY nginx.conf   /etc/nginx/conf.d/default.conf

# make sure nginx can read the files (403 can occur if perms are wrong)
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755 /usr/share/nginx/html

EXPOSE 4000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]