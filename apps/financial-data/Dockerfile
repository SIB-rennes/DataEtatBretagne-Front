FROM nginx:stable
RUN rm /etc/nginx/conf.d/default.conf

COPY --chown=nginx:root ./nginx/ /etc/nginx/
COPY --chown=nginx:root dist/financial-data /usr/share/nginx/html/

#envsubst to perform the variable substitution on nginx startup
CMD ["/bin/sh",  "-c",  "exec nginx -g 'daemon off;'"]
