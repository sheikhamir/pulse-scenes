FROM python:3.6

ENV VERSION 0.10.0

RUN mkdir -p /opt/websockify
COPY . /opt/websockify/websockify-${VERSION}

RUN python -m pip install 'numpy<1.17' redis simplejson jwcrypto

VOLUME /data

EXPOSE 80
EXPOSE 443

WORKDIR /opt/websockify

COPY docker/docker-entrypoint.sh /

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["--help"]
