upstream jitsi_web {
    server 127.0.0.1:8000;
}

server {
    server_name meet.igp-maroc.com;

    # WebSocket XMPP (CRITICAL!)
    location ~ ^/(xmpp-websocket|colibri-ws) {
        proxy_pass http://jitsi_web;
        proxy_http_version 1.1;
        
        # WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_read_timeout 86400;
        proxy_connect_timeout 10;
        
        # No buffering
        proxy_buffering off;
        tcp_nodelay on;
    }

    # HTTP-BIND
    location /http-bind {
        proxy_pass http://jitsi_web/http-bind;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Everything else
    location / {
        proxy_pass http://jitsi_web;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/meet.igp-maroc.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/meet.igp-maroc.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}


server {
    if ($host = meet.igp-maroc.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name meet.igp-maroc.com;
    return 404; # managed by Certbot


}