FROM node:16

EXPOSE 3000

VOLUME /app

WORKDIR /app

RUN npm install -g serve

COPY entrypoint.sh /

USER node

ENTRYPOINT ["/entrypoint.sh"]

