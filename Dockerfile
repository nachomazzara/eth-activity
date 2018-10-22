FROM node:10-alpine
WORKDIR /usr/src
COPY package.json package-lock.json ./
RUN apk --no-cache add git
RUN npm i
COPY . .
RUN npm run build
RUN mv ./build /public/