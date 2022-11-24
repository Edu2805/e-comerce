FROM node:16.17.1 as ng-builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN $(npm bin)/ng build --prod

FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ng-builder /app/dist/front-end /usr/share/nginc/html

EXPOSE 80
