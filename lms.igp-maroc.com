server {
    listen 443 ssl http2;
    server_name lms.igp-maroc.com;
    
    ssl_certificate /etc/letsencrypt/live/lms.igp-maroc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lms.igp-maroc.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 200M;
    client_body_timeout 300s;

    # 1. STORAGE EN PREMIER (le plus spécifique)
    location ^~ /storage/ {
        proxy_pass http://127.0.0.1:88/storage/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # 2. API EN DEUXIÈME
    location ^~ /api {
        client_max_body_size 200M;
        
        proxy_pass http://127.0.0.1:88;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # 3. NEXT.JS EN DERNIER (attrape tout le reste)
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}

server {
    listen 80;
    server_name lms.igp-maroc.com;
    return 301 https://$server_name$request_uri;
}