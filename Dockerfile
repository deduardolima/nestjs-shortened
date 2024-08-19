FROM node:20.16.0-alpine AS builder

RUN apk add --no-cache openssl

RUN npm install -g npm@10.8.2 && \
  npm install -g @nestjs/cli@10.3.2

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

RUN chown -R node:node /home/node/app

USER node

EXPOSE 8080

CMD ["npm", "run", "start:prod"]