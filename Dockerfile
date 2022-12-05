# Stage 1
FROM node:16 as build
WORKDIR /app
COPY . .
RUN npm install
#RUN npm install -g @angular/cli
ARG CONFIG_ENV=production
RUN npm run build -- --configuration=$CONFIG_ENV

# Stage 2
FROM nginx:1.22-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/mazad-oman-dashboard /usr/share/nginx/html
EXPOSE 80