FROM  nginx:1.14-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY static /static

EXPOSE 80
