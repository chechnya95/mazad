# Mazad Oman dashboard

npm install

ng serve --configuration production
ng serve --configuration staging

# Docker
```
docker build -t mazad-oman-dashboard:latest --build-arg CONFIG_ENV=production .
```
CONFIG_ENV can be one of the following: development, production, staging
# GCP
```
docker tag mazad-oman-dashboard gcr.io/mazad-beta/mazad-oman-dashboard
docker push gcr.io/mazad-beta/mazad-oman-dashboard
```