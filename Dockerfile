FROM alpine:3.9.4

RUN mkdir -p /opt/messengerprod

WORKDIR /opt/messengerprod

COPY index.js .

RUN apk add nodejs
RUN apk add --update nodejs npm

RUN npm init --yes
RUN npm i express
RUN npm i joi
RUN npm i redis
RUN npm i url
RUN npm i -g nodemon

EXPOSE 3000
EXPOSE 8080

CMD [ "/bin/sh", "-c", "sleep 3 && nodemon" ]