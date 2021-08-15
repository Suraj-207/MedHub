FROM node:14.17.5 as build
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app
RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]

FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# COPY certificate.crt /etc/nginx/certificate.crt
# COPY certificate.key /etc/nginx/certificate.key

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]