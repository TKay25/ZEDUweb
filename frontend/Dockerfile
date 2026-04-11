# Frontend Dockerfile
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api { \
        proxy_pass https://zedu-backend.onrender.com/api; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy HTML files from frontend directory
COPY frontend/*.html ./

# Copy CSS and JS directories
COPY frontend/css/ ./css/
COPY frontend/js/ ./js/

# Copy public assets if they exist
COPY frontend/public/ ./public/ 2>/dev/null || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
