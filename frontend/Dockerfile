FROM node:18-alpine

WORKDIR /usr/frontend/

COPY . .

RUN npm i

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]
