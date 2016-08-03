FROM nginx:1.11.1-alpine

MAINTAINER Luis Jaggy <luis.jaggy@woodsbagot.com>

RUN apk --update add openssl

COPY docker/start.sh /start.sh
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY app /usr/share/nginx/html
RUN rm /usr/share/nginx/html/index.html # default 'welcome to nginx' file

EXPOSE 80

CMD ["/bin/sh", "/start.sh"]
