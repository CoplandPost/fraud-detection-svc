FROM --platform=linux/amd64 node:16

RUN mkdir /usr/src/app /usr/src/app/build
COPY ./process.yml ./usr/src/app/
COPY . ./usr/src/app/build
WORKDIR /usr/src/app/build
RUN apt update && apt install vim -y
RUN npm i --legacy-peer-deps
RUN npx tsc -p tsconfig.build.json && \
ls .env && \
cp ./.env dist &&\
cp ./package.json dist && \
cp -r dist /usr/src/app/ && \
rm -rf /usr/src/app/build
COPY ./.env /usr/src/app/dist

WORKDIR /usr/src/app
RUN cd dist && npm install --prod --legacy-peer-deps && \
    chmod -R 755 /usr/src/app

RUN npm install pm2 -g  
ENV PARTNER_SERVICE=http://customer-manager-clusterip-svc:5076/api
ENV MONGO_URI=10.0.1.178:27028
ENV HTTP_PORT=5087
ENV TZ=Europe/London
ENV HTTP_LOGIN_API=http://app.coplandpost.com/api/login
EXPOSE 5087
CMD pm2-runtime /usr/src/app/process.yml
