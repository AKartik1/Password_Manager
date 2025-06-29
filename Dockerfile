# ────────────────────────── build a tiny static image ──────────────────────────
FROM nginx:alpine

# clean out the default html that ships with the image
RUN rm -rf /usr/share/nginx/html/*

# copy *only* the static assets you need
COPY index.html   /usr/share/nginx/html/
COPY style.css    /usr/share/nginx/html/
COPY script.js    /usr/share/nginx/html/
COPY copy.svg     /usr/share/nginx/html/

# drop in the custom server block that listens on 4000
COPY nginx.conf   /etc/nginx/conf.d/default.conf

# make sure nginx can read the files (403 can occur if perms are wrong)
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755 /usr/share/nginx/html

EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]
