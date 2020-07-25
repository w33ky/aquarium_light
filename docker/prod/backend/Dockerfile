FROM node:lts-alpine

WORKDIR /usr/src/app
COPY ./backend/package.json ./package.json
COPY ./backend/node_modules ./node_modules
COPY ./backend/dist ./dist

RUN ls

EXPOSE 8000
CMD npm start