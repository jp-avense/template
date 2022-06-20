# build stage
FROM node:16.15-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build     

# production stage

FROM nginx:stable-alpine as production-stage
RUN printenv
RUN ls
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]