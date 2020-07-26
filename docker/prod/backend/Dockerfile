FROM node:lts-alpine

RUN apk add --no-cache tzdata python3 make g++ linux-headers

WORKDIR /usr/src/app
COPY ./backend/package.json ./package.json
COPY ./backend/dist ./dist
RUN npm i --only=production

EXPOSE 8000
CMD npm start