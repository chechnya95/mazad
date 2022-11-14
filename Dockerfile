# Stage 1
FROM node:16 as build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm run build

# Stage 2
FROM nginx:1.22-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/mazad-oman-dashboard /usr/share/nginx/html
EXPOSE 80