FROM node:lts-alpine

RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /usr/src/app
COPY ./backend/package.json ./package.json
RUN npm i --only=production
COPY ./backend/dist ./dist

EXPOSE 8000
CMD npm start