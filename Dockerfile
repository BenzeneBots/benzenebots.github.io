FROM httpd:2.4
COPY etc/httpd-bb.conf /usr/local/apache2/conf/httpd.conf
COPY etc/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy Content
COPY css/ /usr/local/apache2/htdocs/css/
COPY images/ /usr/local/apache2/htdocs/images/
COPY js/ /usr/local/apache2/htdocs/js/
COPY vendor/ /usr/local/apache2/htdocs/vendor/
COPY index.html /usr/local/apache2/htdocs/index.html


## locale and timezone
RUN apt update && apt upgrade --yes && apt install sudo locales --yes
RUN dpkg-reconfigure tzdata

## Add bbots user
RUN useradd -m bbots && echo "bbots:bbots" | chpasswd
RUN echo "bbots ALL=PASSWD: ALL" > /etc/sudoers.d/bbots

#setup ssh
RUN apt-get install -y openssh-server
EXPOSE 22

ENTRYPOINT ["sh", "/docker-entrypoint.sh"]
CMD ["httpd-foreground"]
